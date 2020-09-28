import React, { Component, PureComponent } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';
import MathJaxLibs from '../../../utils/webViewBankQuestion';
import WarningModal from '../../modals/WarningModal';
import ModalConfigLibrary from './modalConfigLibrary';
import ModalCurriculum from './modalCurriculum';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import { connect } from 'react-redux';
import md5 from 'md5';
import _ from 'lodash';
import dataHeper from '../../../utils/dataHelper';
import LearnPlaceholder from '../../shim/LearnPlaceholder';
import PaginationUtils from '../../../utils/PaginationUtils';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import { AlertNoti } from '../../../utils/Common';
import HTML from "react-native-render-html";
import html from '../../../utils/ModalMatarial'
import HeaderNavigation from '../../common-new/HeaderNavigation';
const messageNoQuestion = 'Vui lòng thêm câu hỏi';
const messageAddError =
  'Thêm câu hỏi không thành công. Bạn vui lòng chọn câu hỏi khác.';
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}
const { width, height } = Dimensions.get('window');

class QuestionLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
      totalAddQuestion: 0,
      subject: [],
      element: [],
      lerningTarget: [],
      objectSearch: {
        author: '',
        curriculumCode: '',
        grades: null,
        indexPage: 0,
        isVerified: false,
        learningTargetsCode: [],
        levelKnowledge: [],
        levelQuestion: [],
        skill: null,
        typeAnswer: [],
      },
      questions: [],
      listQuestionAdded: [],
      height: 0,
      isLoading: true,
      totalQuestion: 0,
      isAllowRerennder: false,
      isModal: false,
      htmlContent: '',
      isLoadingModal: false,
      listSkills: [],
      urlMedia: '',
    };
  }

  displayWarning(b) {
    this.refs.warningModal.showModal();
  }

  setListQuestion = async (data) => {
    const response = await dataHeper.saveQuestion(data);
  };

  onHandleMessage = (event) => {
    const data = event.nativeEvent.data.split('---');
    const { questions, listQuestionAdded } = this.state;
    if (data[0] === 'warningWeb') {
      this.setState({ numberQuestion: data[1] }, () => {
        this.displayWarning(true);
      });
    }
    if (data[0] === 'addQuestion') {
      const element = _.find(questions, (item) => item.questionId === data[1]);
      if (element) {
        this.setState(
          {
            listQuestionAdded: [...listQuestionAdded, element],
          },
          () => this.setListQuestion(this.state.listQuestionAdded),
        );
        return;
      }
      AlertNoti(messageAddError);
    }
    if (data[0] === 'deleteQuestion') {
      const index = _.findIndex(listQuestionAdded, ['questionId', data[1]]);
      this.setState(
        {
          listQuestionAdded: [
            ...listQuestionAdded.slice(0, index),
            ...listQuestionAdded.slice(index + 1),
          ],
        },
        () => this.setListQuestion(this.state.listQuestionAdded),
      );
    }
    if (data[0] === 'matariaDetail') {
      this.getDetailMatarial()
      this.setState({ isModal: true }, () => this.getDetailMatarial(data[1]))
    }
  };

  getDetailMatarial = async (idMatarial) => {
    const { token } = await dataHelper.getToken();
    this.setState({ isLoadingModal: true })
    const response = await apiPapers.getMatarialDetail({ token, idMatarial })
    if (response) {
      this.setState({
        urlMedia: response?.urlMedia,
        htmlContent: response?.contentHtml,
        isLoadingModal: false
      })
    }
  }
  _onTop = () => {
    // this.webview.postMessage('onTop');
    this.refs.WebViewComponent._onTop();
  };

  async componentDidMount() {
    this.getQuestionLocal();
    const { token } = await dataHelper.getToken();
    const { objectSearch } = this.state;
    if (token) {
      try {
        const response = await apiPapers.getSubjects({ token });
        await this.setState(
          {
            subject: response && response,
            objectSearch: {
              ...objectSearch,
              curriculumCode: response[0].code,
            },
          }
        );
        this.getDetailSubject();
      } catch (error) { }
    }
  }

  getQuestionLocal = async () => {
    const getListQuestion = await dataHeper.getQuestion();
    !_.isEmpty(getListQuestion) &&
      this.setState({
        listQuestionAdded: getListQuestion,
      });
  };

  getDetailSubject = async () => {
    const { objectSearch } = this.state;
    try {
      const { token } = await dataHelper.getToken();
      if (token) {
        const response = await apiPapers.getDetailSubject({
          token: token,
          subjectCode: objectSearch.curriculumCode,
        });
        await this.setState(
          {
            element: response && response,
            objectSearch: {
              ...objectSearch,
              // curriculumCode: response && response[0].id,
            },
            // isLoading: false,
          },
        );
        this.searchPaper();
        this.getLearingTarget();
      }
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  getLearingTarget = async () => {
    const { objectSearch } = this.state;
    try {
      const { token } = await dataHelper.getToken();
      if (token) {
        const response = await apiPapers.getLearingTarget({
          token: token,
          subjectCode: objectSearch.curriculumCode,
        });
        this.setState(
          {
            lerningTarget: response && response,
          },
          () => this.searchPaper(),
        );
      }
    } catch (error) { }
  };

  getListSkills = async () => {
    const { objectSearch } = this.state;
    const { token } = await dataHelper.getToken();
    const response = await apiPapers.getSkill({ token, idSubject: objectSearch.learningTargetsCode });
    const res = Object.entries(response).map((e) => ({ id: e[0], name: e[1] }));
    this.setState({
      listSkills: res
    },()=>this.searchPaper())
  }

  onPress = (value, item) => {
    this.refs.PaginationUtils.resetState();
    const { objectSearch } = this.state;
    switch (value) {
      case 1:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              author: item.code,
              indexPage: 0,
            },
            isLoading: true,
          },
          () => this.searchPaper(),
        );
        break;
      case 2:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              curriculumCode: item.code,
              indexPage: 0,
            },
            isLoading: true,
            lerningTarget: [],
          },
          () => {
            this.getDetailSubject();
          },
        );
        break;
      case 3:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              curriculumCode: item.id,
              indexPage: 0,
            },
            isLoading: true,
          },
          () => this.getLearingTarget(),
        );
        break;
      case 4:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              learningTargetsCode: (item.code && [item.code]) || [],
              indexPage: 0,
            },
            isLoading: true,
          },
          () => {
            this.getListSkills();
            
          }
        );
        break;
      case 5:
        this.setState({
          objectSearch: {
            ...objectSearch,
            indexPage: 0,
            skill:item.code
          },
          isLoading: true,
        },()=>{
          this.searchPaper()
        })
        break;
      case 6:
        {
          this.setState(
            {
              objectSearch: {
                ...objectSearch,
                levelKnowledge: (item.code && [item.code]) || [],
                indexPage: 0,
              },
              isLoading: true,
            },
            () => this.searchPaper(),
          );
        }
        break;
      default:
        break;
    }
  };

  searchPaper = async (isAllowRerennder) => {
    const key = this.getKeyCache(this.state.objectSearch);
    try {
      const { token } = await dataHelper.getToken();
      const response = await apiPapers.searchPaper({
        token: token,
        body: this.state.objectSearch,
        key: key,
      });
      console.log(response);
      const responseCount = await apiPapers.countSearch({
        token: token,
        body: this.state.objectSearch,
      });
      const { totalQuestion } = responseCount;
      if (response && response.length > 0) {
        this.setState({
          questions: !!response && response,
          totalQuestion,
        });
      } else {
        this.setState({
          isLoading: false,
          questions: [],
          totalQuestion: 0
        });
      }
    } catch (error) { }
  };

  getKeyCache = (obj) => {
    let _return = '';
    for (const property in obj) {
      if (Array.isArray(obj[property])) {
        obj[property].forEach((element) => {
          _return += element;
        });
      } else {
        _return += obj[property];
      }
    }
    return md5(_return);
  };

  _closeLearnPlaceholder = () => {
    this.setState({ isLoading: false });
  };

  handleNextPage = (indexPage) => {
    const { objectSearch } = this.state;
    this.setState(
      {
        objectSearch: {
          ...objectSearch,
          indexPage,
        },
        isLoading: true,
      },
      () => {
        this.searchPaper(true);
      },
    );
  };

  configurationQuestion = () => {
    const { listQuestionAdded } = this.state;
    if (listQuestionAdded.length !== 0) {
      this.props.navigation.navigate('ConfigQuestion', {
        nagigation: this.props.nagigation,
        statusbar: 'light-content',
        curriculumCode: this.state.objectSearch.curriculumCode,
      });
    } else {
      AlertNoti(messageNoQuestion);
    }
  }



  render() {
    const {
      listQuestionAdded,
      subject,
      element,
      lerningTarget,
      objectSearch,
      isLoading,
      totalQuestion,
      isAllowRerennder,
      isModal,
      htmlContent,
      isLoadingModal,
      curriculumCode,
      urlMedia,
      listSkills
    } = this.state;
    const level = [
      { name: 'Nhận biết', code: '0' },
      { name: 'Thông hiểu', code: '1' },
      { name: 'Vận dụng', code: '2' },
      { name: 'Vận dụng cao', code: '3' },
    ];
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <HeaderNavigation
          title={'Ngân hàng câu hỏi'}
          color={'white'}
          navigation={this.props.navigation}
          actionIcon={require('../../../asserts/appIcon/icRight.png')}
          actionStyle={{ borderRadius: 0 }}
          onRightAction={() => this.configurationQuestion()}
        />
        <View style={styles.wrapSelectQuestion}>
          <View style={{ flex: 0.45 }}>
            <ModalConfigLibrary
              title="Câu Hỏi"
              data={[
                { name: 'Câu hỏi công khai', code: '' },
                { name: 'Câu hỏi của tôi', code: this.props.userName },
              ]}
              onPress={(value) => this.onPress(1, value)}
              colum={2}
              widthItem={40}
              value={{ name: 'Câu hỏi công khai', code: '' }}
            />
            <ModalConfigLibrary
              title="Môn Học"
              data={subject}
              onPress={(value) => this.onPress(2, value)}
              colum={2}
              widthItem={40}
              value={subject && subject[0]}
            />
            <ModalConfigLibrary
              title="Giáo trình"
              data={element}
              onPress={(value) => this.onPress(3, value)}
              value={!_.isEmpty(element) && element[0]}
            />
          </View>
          <View style={{ flex: 0.45 }}>
            <ModalCurriculum
              title="Đơn vị kiến thức"
              height={this.state.height}
              data={lerningTarget}
              onPress={(value) => this.onPress(4, value)}
            />
            <ModalConfigLibrary
              title="Dạng bài"
              data={listSkills}
              onPress={value => this.onPress(5, value)}
              colum={2}
              widthItem={40}
            />
            <ModalConfigLibrary
              title="Cấp độ"
              data={level}
              colum={2}
              widthItem={40}
              onPress={(value) => this.onPress(6, value)}
            />
          </View>
        </View>
        <View
          style={{ flex: 1, backgroundColor: '#FFF' }}
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            this.setState({
              height: height,
            });
          }}>
          {isLoading && <LearnPlaceholder />}
          <View style={styles.wrapPageAndNumberQuesion}>
            <Text style={styles.totalAddQuestion}>
              Số câu hỏi đã thêm: {listQuestionAdded.length}
            </Text>
            <PaginationUtils
              ref={'PaginationUtils'}
              totalQuestion={totalQuestion}
              handleNextPage={this.handleNextPage}
            />
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            {!_.isEmpty(this.state.questions) ? (
              <WebViewComponent
                ref={'WebViewComponent'}
                onHandleMessage={this.onHandleMessage}
                _closeLearnPlaceholder={this._closeLearnPlaceholder}
                questions={this.state.questions}
                listQuestionAdded={listQuestionAdded}
              />

            ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 200,
                  }}>
                  <Text>Không có dữ liệu</Text>
                </View>
              )}
            {!_.isEmpty(this.state.questions) && (
              <TouchableOpacity
                style={styles.buttomTop}
                onPress={() => this._onTop()}>
                <Image
                  source={require('../../../asserts/appIcon/icUp.png')}
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                />
                <Text style={{ color: '#FAFAFA' }}>TOP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <WarningModal
          ref={'warningModal'}
          navigation={this.props.navigation}
          visible={this.state.visibleModalWarning}
          hideModal={() => this.displayWarning(false)}
          numberQuestion={this.state.numberQuestion}
          subjectId={'TOAN'}
        />
        <Modal
          visible={isModal}
          transparent={true}
        >
          <TouchableWithoutFeedback
            onPress={() => this.setState({ isModal: false })}
          >
            <View style={styles.containerModal}>
              <TouchableWithoutFeedback>
                <View style={styles.bodyModal}>
                  <TouchableOpacity
                    style={styles.btnClose}
                    onPress={() => this.setState({ isModal: false })}>
                    <Image source={require('../../../asserts/icon/icCloseModal.png')} style={{ tintColor: '#828282', }} />
                  </TouchableOpacity>
                  {isLoadingModal ?
                    <ActivityIndicator color='red' style={{ justifyContent: 'center', alignItems: 'center', }} />
                    :
                    <WebView
                      ref={(ref) => (this.webview = ref)}
                      source={{
                        html: html.renderMatarialDetail(htmlContent),
                        html: html.renderMatarialDetail(htmlContent, urlMedia),
                        baseUrl,
                      }}
                      subjectId={'TOAN'}
                      originWhitelist={['file://']}
                      scalesPageToFit={false}
                      javaScriptEnabled
                      showsVerticalScrollIndicator={false}
                      startInLoadingState={false}
                    />
                  }
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <SafeAreaView style={{ backgroundColor: '#fff' }} />
      </View>
    );
  }
}
class WebViewComponent extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    // if (this.props.isAllowRerennder != nextProps.isAllowRerennder) {
    //   return true;
    // }
    if (this.props.questions != nextProps.questions) {
      return true;
    }
    return false;
  }
  _onTop = () => {
    this.webview.postMessage('onTop');
  };
  render() {
    const {
      onHandleMessage,
      _closeLearnPlaceholder,
      questions,
      listQuestionAdded,
    } = this.props;
    return (
      <WebView
        ref={(ref) => (this.webview = ref)}
        style={{ backgroundColor: 'transparent' }}
        onMessage={onHandleMessage}
        onLoad={_closeLearnPlaceholder}
        onError={_closeLearnPlaceholder}
        source={{
          html: MathJaxLibs.renderHtmlQuestionDetail(
            questions,
            'TOAN',
            listQuestionAdded,
          ),
          baseUrl,
        }}
        subjectId={'TOAN'}
        originWhitelist={['file://']}
        scalesPageToFit={false}
        javaScriptEnabled
        showsVerticalScrollIndicator={false}
        startInLoadingState={false}
      />
    );
  }
}
const styles = StyleSheet.create({
  btnClose: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2
  },
  container: {
    flex: 1,
    backgroundColor: '#56CCF2',
  },
  header: {
    backgroundColor: '#56CCF2',
    zIndex: 99,
  },
  topheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: width < 380 ? 20 : 15,
    paddingVertical: 10,
    marginTop: HEIGHT_TOPBAR,
  },
  bodyHeader: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 18,
    zIndex: 1,
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#FFF',
  },
  rightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingRight: width < 380 ? 20 : 15,
  },
  totalAddQuestion: {
    marginLeft: 16,
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#159FDA',
    marginTop: 10,
  },
  buttomTop: {
    backgroundColor: '#0091EA',
    marginTop: 20,
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    right: 15,
    bottom: 15,
  },
  wrapSelectQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 0,
    minHeight: 150,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  wrapPageAndNumberQuesion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    // zIndex: 10,
  },
  containerModal: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 200,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  bodyModal: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 500,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
  }
});

const mapStateToProps = (state) => {
  return {
    paper: state.paper,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(QuestionLibrary);