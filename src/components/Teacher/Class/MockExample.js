import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import MathJaxLibs from '../../../utils/WebVIewMockExample';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import RippleButton from '../../libs/RippleButton';
import {isIphoneX} from 'react-native-iphone-x-helper';
import Globals from '../../../utils/Globals';
import WarningModal from '../../modals/WarningModal';
import ModalMockExamComplete from './modalMockExamComplete';
import LearnPlaceholder from '../../shim/LearnPlaceholder';
import HeaderDetail from '../../common-new/HeaderDetail';
import AppIcon from '../../../utils/AppIcon';
import HeaderExample from '../../common-new/HeaderExample';
const messageError = 'Không có nội dung hiển thị';
const {width, height} = Dimensions.get('window');
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

export default class MockExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataSideBar: [],
      index: 0,
      isDone: false,
      isLoading: true,
      isError: false,
      idItem: Globals.idItemMockExam,
      numberQuestion: '',
      valueTextarea: '',
      actBtnSbumit: false,
      loadingSubmit: true,
      optionId: 0,
    };
    this.stepId = '';
    Globals.updateQuestionMockExam = this.handleQuestion.bind(this);
  }

  handleQuestion(index) {
    const {data} = this.state;
    this.setState(
      {
        index: index,
        actBtnSbumit: false,
        isDone: false,
      },
      () => this.getData(),
    );
  }

  handNext = () => {
    const {index, data} = this.state;
    if (data.data.length - 1 === index) {
      this.setState({isDone: true});
    } else {
      this.setState(
        {
          index: index + 1,
          actBtnSbumit: false,
        },
        () => {
          Globals.nextQuestion(this.state.index);
        },
      );
    }
  };

  getData = async init => {
    const {
      assignId,
      classId,
      assignmentId,
    } = this.props.navigation.state.params;
    if (init) {
      this.setState({isLoading: false});
    }
    try {
      const {token} = await dataHelper.getToken();
      let response = await Api.getExam({token, assignmentId});
      const resSideBar = await Api.getMockExample({token, assignmentId});
      if (_.isEmpty(response.data.data) && _.isEmpty(response.data.data)) {
        this.setState({
          data: [],
          isLoading: true,
          dataSideBar: [],
        });
        return;
      }
      response.data.data = this._convertData(response.data.data);
      this.setState({
        data: response.data,
        isLoading: true,
        dataSideBar: resSideBar.data,
      });
    } catch (error) {
      this.setState({isError: true});
    }
  };

  _convertData = (data = []) => {
    if (_.isArray(data)) {
      data = data.map(item => {
        let dataStandard = new Object();
        if (item.typeData == 0) {
          return item.dataStandard;
        } else {
          item.dataMaterial.data.forEach(element => {
            dataStandard = {...element};
          });
          dataStandard.contentHtml = item.dataMaterial.contentHtml;
          dataStandard.materialId = item.dataMaterial.materialId;
        }
        return dataStandard;
      });
      return data;
    }
    return [];
  };

  async componentDidMount() {
    this.getData(true);
  }

  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  };

  reviewlater = async () => {
    try {
      const {data, index, dataSideBar} = this.state;
      const typeAnswer =
        (data.data[index].dataMaterial &&
          data.data[index].dataMaterial.data[0].typeAnswer) ||
        data.data[index].dataStandard.typeAnswer;
      var id = '';
      if (typeAnswer === 3) {
        id = dataSideBar[index].stepId;
      } else {
        id = dataSideBar[index].stepId;
      }
      const {token} = await dataHelper.getToken();
      const res = await Api.reviewlater({token, id: id});
      Globals.updateMenuQuestion();
    } catch (error) {}
  };

  onHandleMessage(event) {
    const data = event.nativeEvent.data.split('---');
    if (data[0] === 'warningWeb') {
      this.setState({numberQuestion: data[1]}, () => {
        this.displayWarning(true);
      });
    }
    if (data[0] === 'active') {
      this.reviewlater();
    }
    if (data[0] === 'changeText9') {
      this.setState({
        valueTextarea: data[1],
        actBtnSbumit: true,
        isDone: false,
      });
    }
    if (data[0] === 'chonseEventTest') {
      this.setState({
        optionId: data[1],
        actBtnSbumit: data[1] != -1,
        isDone: false,
      });
    }
  }

  displayWarning(b) {
    this.refs.warningModal.showModal();
  }

  Submit = async () => {
    const {data, valueTextarea, index, optionId} = this.state;
    let formData = new Object();
    if (data.data[index].typeAnswer == 3) {
      // dang tu luan
      formData = {
        configId: data.data[index].testId,
        id: data.data[index].stepId,
        isSkip: false,
        optionText: [`${valueTextarea?.trim()}`],
        studentDoRight: true,
      };
    } else {
      // dang trac nghiem
      formData = {
        configId: data.data[index].testId,
        id: data.data[index].stepId,
        isSkip: false,
        optionId: [parseInt(optionId)],
        studentDoRight: true,
      };
    }
    this.setState({loadingSubmit: false});
    const {token} = await dataHelper.getToken();
    const resSubmit = await Api.putMockExam({token, formData});
    if (resSubmit.status === 1) {
      this.setState(
        {
          loadingSubmit: true,
        },
        () => {
          this.getData();
          this.handNext();
        },
      );
    }
  };

  buttonSkip = async () => {
    const {data, valueTextarea, index} = this.state;
    let formData = {};

    if (data.data[index].dataMaterial) {
      formData = {
        configId: data.data[index].dataMaterial.data[0].testId,
        id: data.data[index].dataMaterial.data[0].stepId,
        isSkip: true,
        optionText: [`${data.data[index].dataMaterial.data[0].userOptionText}`],
        studentDoRight: true,
      };
    } else {
      if (data.data[index].dataStandard) {
        formData = {
          configId: data.data[index].dataStandard.testId,
          id: data.data[index].dataStandard.stepId,
          isSkip: true,
          optionId: [data.data[index].dataStandard.userOptionId[0]],
          studentDoRight: true,
        };
      } else {
        formData = {
          configId: data.data[index].testId,
          id: data.data[index].stepId,
          isSkip: true,
          optionText: [`${data.data[index].userOptionText}`],
          studentDoRight: true,
        };
      }
    }
    this.setState({loadingSubmit: false});
    const {token} = await dataHelper.getToken();
    const resSkip = await Api.putMockExam({token, formData});
    if (resSkip.status === 1) {
      this.setState(
        {
          loadingSubmit: true,
        },
        () => this.handNext(),
      );
    }
  };

  complete = async () => {
    const {assignmentId} = this.props.navigation.state.params;
    const {data} = this.state;
    this.refs.modalMockExamComplete.activeModal({
      nameTest: data.name,
      assignmentId,
    });
  };

  _btnBackErr = () => {
    this.props.navigation.pop(1);
  };

  render() {
    const {
      data,
      index,
      isDone,
      isLoading,
      isError,
      actBtnSbumit,
      loadingSubmit,
      dataSideBar,
    } = this.state;
    const {navigation} = this.props;
    const {assignId, classId} = navigation.state.params;
    const status =
      (!_.isEmpty(data) &&
        data.data[index].dataMaterial &&
        data.data[index].dataMaterial.data[0].statusStep) ||
      (!_.isEmpty(data) &&
        data.data[index].dataStandard &&
        data.data[index].dataStandard.statusStep);

    return !isError ? (
      <SafeAreaView style={styles.containter}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}>
          <HeaderExample
            navigation={this.props.navigation}
            onActionPress={() => this.complete()}
          />
          <View style={{flex: 1}}>
            <LearnPlaceholder visible={isLoading} />
            {!_.isEmpty(data) && (
              <WebViewComponent
                dataSideBar={dataSideBar}
                data={data}
                index={index}
                handleMessage={this.onHandleMessage.bind(this)}
              />
            )}
            <View style={styles.wrapBtn}>
              {!isDone ? (
                status === 0 || status === 3 || actBtnSbumit ? (
                  <RippleButton
                    color={'#2D9CDB'}
                    radius={25}
                    onPress={this.Submit}
                    style={styles.wrapButtonAnswer}>
                    {!loadingSubmit ? (
                      <ActivityIndicator color={'#FFF'} />
                    ) : (
                      <Text style={[styles.textButton, {color: '#FFF'}]}>
                        Trả Lời
                      </Text>
                    )}
                  </RippleButton>
                ) : (
                  <RippleButton
                    radius={25}
                    onPress={this.buttonSkip}
                    style={[
                      styles.wrapButtonAnswer,
                      {backgroundColor: '#828282'},
                    ]}>
                    {!loadingSubmit ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={[styles.textButton, {color: '#FFF'}]}>
                        Bỏ Qua
                      </Text>
                    )}
                  </RippleButton>
                )
              ) : (
                <RippleButton
                  color={'#'}
                  radius={25}
                  onPress={() => this.complete()}
                  style={[
                    styles.wrapButtonAnswer,
                    {backgroundColor: '#55B619'},
                  ]}>
                  <Text style={[styles.textButton, {color: '#FFF'}]}>
                    Kết Thúc
                  </Text>
                </RippleButton>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <WarningModal
          ref={'warningModal'}
          navigation={navigation}
          visible={this.state.visibleModalWarning}
          hideModal={() => this.displayWarning(false)}
          numberQuestion={this.state.numberQuestion}
          subjectId={'TOAN'}
        />
        <ModalMockExamComplete
          ref={'modalMockExamComplete'}
          navigation={navigation}
        />
      </SafeAreaView>
    ) : (
      <View style={styles.containter}>
        <HeaderDetail onPress={this._btnBackErr} />
        <View style={styles.wrapContanErr}>
          <Image
            source={AppIcon.iconNodata}
            resizeMode={'contain'}
            style={{marginBottom: 20}}
          />
          <Text style={[styles.txtErr, {fontFamily: 'Nunito-Regular'}]}>
            {messageError}
          </Text>
          <TouchableOpacity
            style={styles.btnBackErr}
            onPress={this._btnBackErr}>
            <Text style={[styles.txtErr, {color: '#FFF'}]}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class WebViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataConvert: [],
      heightWebview: 0,
    };
  }

  shouldComponentUpdate(prevProps, nextState) {
    if (
      this.props.dataSideBar != prevProps.dataSideBar ||
      this.props.data != prevProps.data ||
      this.props.index != prevProps.index ||
      this.state.dataConvert != nextState.dataConvert ||
      this.state.heightWebview != nextState.heightWebview
    ) {
      return true;
    }
    return false;
  }

  render() {
    const {handleMessage, dataSideBar, index, token, data} = this.props;
    let dataConvert = data.data;
    let dataTemp = dataConvert[index];
    let linkMedia = dataTemp.dataMaterial?.urlMedia;
    return dataTemp ? (
      <View
        style={{height: Platform.OS === 'ios' ? height * 0.82 : height * 0.78}}>
        <WebView
          showsVerticalScrollIndicator={false}
          ignoreSsError={false}
          originWhitelist={['file://']}
          scrollEnable={true}
          onMessage={handleMessage}
          style={[styles.styleWebView]}
          source={{
            html: MathJaxLibs.renderMockExample(
              dataTemp, //data
              'TOAN', //subjectId
              dataTemp.numberQuestion, //numberQuestion
              false, //isBookmark
              dataTemp.contentHtml, //contentHtml
              dataTemp.content, //question
              2, //type
              index,
              !_.isEmpty(dataTemp.userOptionId)
                ? dataTemp.userOptionId
                : dataTemp.userOptionText, //userAnswer
              token, //token,
              dataSideBar,
              linkMedia,
            ),
            baseUrl,
          }}
        />
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  txtSubmit: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#2D9CDB',
    marginLeft: 6,
  },
  styleWebView: {
    backgroundColor: Platform.OS == 'ios' ? '#fff' : 'transparent',
    flex: 1,
  },
  wrapBtn: {
    width,
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 50,
  },
  wrapButtonSkip: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 40,
    width: 40,
    justifyContent: 'center',
    marginBottom: isIphoneX() ? 25 : 10,
    marginHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#828282',
  },
  wrapButtonAnswer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#64B2ED',
    height: 40,
    width: '90%',
    marginBottom: isIphoneX() ? 25 : 10,
    marginHorizontal: 20,
    borderRadius: 4,
  },
  textButton: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  wrapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingBottom: 5,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#828282',
  },
  wrapContanErr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 150,
  },
  txtErr: {
    fontFamily: 'Nunito-Bold',
    color: '#828282',
  },
  btnBackErr: {
    backgroundColor: '#2D9CDB',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 20,
  },
});
