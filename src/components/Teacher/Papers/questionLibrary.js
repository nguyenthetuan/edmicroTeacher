import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  Platform,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
  ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';
import MathJaxLibs from '../../../utils/webViewBankQuestion';
import WarningModal from '../../modals/WarningModal';
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
import Header from '../../common-new/Header';
import { RFFonsize } from '../../../utils/Fonts';
import { isIphoneX } from 'react-native-iphone-x-helper';
import shadowStyle from '../../../themes/shadowStyle';
import ModalFilteQuestionLibrary from './ModalFilteQuestionLibrary';
import TourView from '../../../utils/TourView';
import { CustomeButtonRef } from '../../common-new/CustomeButtonRef';
import AsyncStorage from '@react-native-community/async-storage';

const messageNoQuestion = 'Vui lòng thêm câu hỏi';
const messageAddError =
  'Thêm câu hỏi không thành công. Bạn vui lòng chọn câu hỏi khác.';
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

const { Value, timing } = Animated;
const AnimatedWebView = Animated.createAnimatedComponent(WebView);
const { width, height } = Dimensions.get('window');

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
    backgroundColor: '#107CB9',
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
    fontSize: RFFonsize(14),
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
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold',
    color: '#000000',
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
    marginBottom: 5,
  },
  containerModal: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 200,
    flex: 1,
    justifyContent: 'center',
  },
  bodyModal: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 500,
    justifyContent: 'center',
    overflow: 'hidden'
    // paddingHorizontal: 10,
    // paddingVertical: 10
  },
  buttonCreateAssessment: {
    width: 80,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#F49A31',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: Platform.OS == 'ios' ? (isIphoneX() ? 12 : 15) : 15,
    zIndex: 2,
  },
  textCreateAssessment: {
    fontFamily: 'Nunito',
    fontSize: RFFonsize(12),
    fontWeight: '400',
    color: '#fff',
  },
  styleTitle: {
    flex: 0,
    color: '#fff',
    fontSize: RFFonsize(14),
    fontWeight: 'bold',
  },
  txtFilter: {
    color: '#E59553',
    fontFamily: 'Nunito',
    fontSize: RFFonsize(12),
    fontWeight: 'bold',
    flex: 1,
  },
  headerFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  styleBody: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  reload: {
    padding: 5,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#828282',
    borderRadius: 5
  }
});

class QuestionLibrary extends Component {
  constructor(props) {
    super(props);
    this._scroll_y = new Value(0);
    this.state = {
      dropdownVisible: false,
      totalAddQuestion: 0,
      subject: [],// danh sach mon hoc
      element: [],// danh sach giao trinh
      lerningTarget: [],// danh sach don vi kien thuc
      objectSearch: {
        author: '',//
        curriculumCode: '',// giao trinh
        grades: null,// lop
        indexPage: 0,
        isVerified: false,
        learningTargetsCode: [],//
        levelKnowledge: [],// don vi kien thuc
        levelQuestion: [],// cap do
        skill: null,
        typeAnswer: [],
        subjectCode: '',// mon hoc
      },
      questions: [],
      listQuestionAdded: [],
      height: 0,
      isLoading: true,
      totalQuestion: 0,
      isAllowRerennder: false,
      isModal: false,
      htmlContent: '',
      isLoadingModal: true,
      listSkills: [],
      urlMedia: '',
      idMatarial: '',
      isModalQustionLibrary: false
    };
    this.webComponent = null;
    this.refModalFilter = null;
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
      this.setState({ isModal: true, idMatarial: data[1] }, () => this.getDetailMatarial(data[1]))
    }
  };

  getDetailMatarial = async () => {
    const { idMatarial } = this.state;
    this.setState({ isLoadingModal: true })
    const { token } = await dataHelper.getToken();
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
    this.webComponent._onTop();
  };

  async componentDidMount() {
    this.getQuestionLocal();
    const { token } = await dataHelper.getToken();
    const { objectSearch } = this.state;
    if (token) {
      try {
        // get list mon hoc
        const response = await apiPapers.getSubjects({ token });
        if (_.isEmpty(response)) return;
        await this.setState(
          {
            subject: response,
            objectSearch: {
              ...objectSearch,
              subjectCode: response[0].code, //ma mon hoc de lay data giao trinh.
            },
          }
        );
        this.getDetailSubject();
      } catch (error) { }
    }
  };

  handlerShowTourView = async () => {
    // await AsyncStorage.removeItem('@Onluye_TourView_QuestionLibrary');
    const isShow = await AsyncStorage.getItem('@Onluye_TourView_QuestionLibrary');
    if (isShow) return;
    this.dataRef = [
      {
        reff: this.refHeader,
        hint: 'Tạo bộ đề mới'
      },
      {
        reff: this.refFilter,
        hint: 'Lọc bộ đề mới'
      },

    ];
    this.tour.onMeasure(this.dataRef);
    AsyncStorage.setItem('@Onluye_TourView_QuestionLibrary', '1');
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
        // get list giao trinh thong qua mon hoc
        const response = await apiPapers.getDetailSubject({
          token: token,
          subjectCode: objectSearch.subjectCode,
        });
        if (_.isEmpty(response) || !_.isArray(response)) throw 'khong co du lieu';
        await this.setState(
          {
            element: response, // danh sach giao trinh
            objectSearch: {
              ...objectSearch,
              curriculumCode: response[0].id,// ma giao trinh de lay data don vi kien thuc
            },
          },
        );
        // lay danh sach don vi kien thuc thong qua giao trinh
        this.getLearingTarget();
      }
    } catch (error) {
      // this.setState({ isLoading: false });
    }
  };

  getLearingTarget = async () => {
    // lay danh sach don vi kien thuc thong qua giao trinh
    const { objectSearch } = this.state;
    try {
      const { token } = await dataHelper.getToken();
      if (token) {
        const response = await apiPapers.getLearingTarget({
          token: token,
          curriculumCode: objectSearch.curriculumCode,
        });
        if (_.isEmpty(response) || !_.isArray(response)) throw 'khong co du lieu';
        await this.setState({ lerningTarget: response });
        // lay data cau hoi bai tap
        this.searchPaper()
      }
    } catch (error) {
      // this.setState({ isLoading: false });
    }
  };

  getListSkills = async () => {
    const { objectSearch } = this.state;
    const { token } = await dataHelper.getToken();
    const response = await apiPapers.getSkill({ token, idSubject: objectSearch.learningTargetsCode });
    const res = Object.entries(response).map((e) => ({ id: e[0], name: e[1] }));
    this.setState({
      listSkills: res
    }, () => this.searchPaper())
  }

  searchPaper = async (objectSearch) => {
    const body = _.isEmpty(objectSearch) ? this.state.objectSearch : objectSearch;
    const key = this.getKeyCache(body);
    try {
      const { token } = await dataHelper.getToken();
      // lay data cau hoi bai tap
      const response = await apiPapers.searchPaper({
        token,
        body,
        key,
      });
      // lay tong to cau hoi
      const responseCount = await apiPapers.countSearch({
        token,
        body,
      });
      const { totalQuestion } = responseCount;
      if (!_.isEmpty(response) || totalQuestion != 0) {
        this.setState({
          questions: response,
          totalQuestion,
          isLoading: false,
        });
      } else {
        this.setState({
          isLoading: false,
          questions: [],
          totalQuestion: 0
        });
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        questions: [],
        totalQuestion: 0
      });
    }
  };

  filter = async (objectSearchs) => {
    this.setState({ objectSearch: objectSearchs, isLoading: true });
    const body = _.isEmpty(objectSearchs) ? this.state.objectSearch : objectSearchs;
    const key = this.getKeyCache(body);
    try {
      const { token } = await dataHelper.getToken();
      const response = await apiPapers.searchPaper({
        token: token,
        body,
        key,
      });
      const responseCount = await apiPapers.countSearch({
        token: token,
        body,
      });
      const { totalQuestion } = responseCount;
      if (_.isEmpty(response) || totalQuestion == 0) {
        this.setState({
          isLoading: false,
          questions: [],
          totalQuestion: 0
        });
        return;
      }
      if (response.length > 0) {
        this.refPaginationUtils.resetState();
        this.setState({
          isLoading: false,
          questions: response,
          totalQuestion,
        });
      } else {
        this.setState({
          isLoading: false,
          questions: [],
          totalQuestion: 0
        });
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        questions: [],
        totalQuestion: 0
      });
    }
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
    // this.setState({ isLoading: false });
    this.handlerShowTourView();
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
        this.searchPaper();
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

  _closeLearnModal = () => {
    this.setState({ isLoadingModal: false })
  }

  rederTextHeader = () => {
    const { objectSearch, subject, element, lerningTarget } = this.state;
    var textHeader = ''
    for (var name in objectSearch) {
      if (objectSearch[name]) {
        textHeader = `${objectSearch[name]}`
      }
    }
    return textHeader
  }

  render() {
    const { shadowBtn } = shadowStyle;
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
      listSkills,
      isModalQustionLibrary,
    } = this.state;
    const level = [
      { name: 'Nhận biết', code: '0' },
      { name: 'Thông hiểu', code: '1' },
      { name: 'Vận dụng', code: '2' },
      { name: 'Vận dụng cao', code: '3' },
    ];

    const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 330);
    const _header_opacity = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 1],
      extrapolate: 'clamp'
    })
    let translateY = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 330],
      outputRange: [0, -330],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <SafeAreaView style={styles.container}>
          <Header
            ref={ref => this.refHeader = ref}
            title={'Ngân Hàng Câu Hỏi'}
            color={'white'}
            navigation={this.props.navigation}
            actionIcon={require('../../../asserts/icon/icon_add.png')}
            actionStyle={{ borderRadius: 0 }}
            onRightAction={() => this.configurationQuestion()}
            styleTitle={styles.styleTitle}
            colorBtnBack={'#ffffff'}
            centerTitle={false}
          />
          <View
            style={styles.styleBody}
            onLayout={(event) => {
              var { x, y, width, height } = event.nativeEvent.layout;
              this.setState({
                height: height,
              });
            }}>
            <View style={styles.headerFilter}>
              <Text style={styles.txtFilter} numberOfLines={1}>{this.refModalFilter?.getRenderText()}</Text>
              <CustomeButtonRef
                ref={ref => this.refFilter = ref}
                tintColor={'#E59553'}
                icon={require('../../../asserts/icon/iconFilter.png')}
                onPress={() => this.setState({ isModalQustionLibrary: true })}
              />
            </View>

            <View style={styles.wrapPageAndNumberQuesion}>
              <View style={{ alignSelf: 'flex-end' }}>
                <PaginationUtils
                  ref={ref => this.refPaginationUtils = ref}
                  totalQuestion={totalQuestion}
                  handleNextPage={this.handleNextPage}
                  countQuestion={listQuestionAdded.length}
                  disabled={isLoading}
                />
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>

              <WebViewComponent
                ref={(webComponent) => this.webComponent = webComponent}
                onHandleMessage={this.onHandleMessage}
                _closeLearnPlaceholder={this._closeLearnPlaceholder}
                questions={this.state.questions}
                listQuestionAdded={listQuestionAdded}
                isModal={isModal}
                isLoading={isLoading}
                totalQuestion={totalQuestion}
              />

              {!_.isEmpty(this.state.questions) && (
                <TouchableWithoutFeedback
                  onPress={() => this._onTop()}>
                  <View style={styles.buttomTop} >
                    <Image
                      source={require('../../../asserts/appIcon/icUp.png')}
                      resizeMode="contain"
                      style={{ height: 20, width: 20 }}
                    />
                    <Text style={{ color: '#FAFAFA' }}>TOP</Text>
                  </View>
                </TouchableWithoutFeedback>
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
          <ModalQuestion
            isModal={isModal}
            isLoadingModal={isLoadingModal}
            htmlContent={htmlContent}
            getDetailMatarial={this.getDetailMatarial}
            urlMedia={urlMedia}
            questions={this.state.questions}
            listQuestionAdded={listQuestionAdded}
            onHandleMessage={this.onHandleMessage}
            onClose={() => this.setState({ isModal: false })}
          />
          <ModalFilteQuestionLibrary
            ref={ref => this.refModalFilter = ref}
            isModal={isModalQustionLibrary}
            _handleCloseModal={() => this.setState({ isModalQustionLibrary: false })}
            subject={subject}
            element={element}
            lerningTarget={lerningTarget}
            listSkills={listSkills}
            filter={this.filter}
            code={this.props.user.userName}
            objectSearch={objectSearch}
          />
        </SafeAreaView>
        <SafeAreaView style={{ backgroundColor: '#fff' }} />
        <TourView ref={(tv) => this.tour = tv} />
      </View>
    );
  }
}

class WebViewComponent extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.questions != nextProps.questions) {
      return true;
    }
    // if (this.props.listQuestionAdded != nextProps.listQuestionAdded) {
    //   console.log('reRender');
    //   return true;
    // }
    if (this.props.isLoading != nextProps.isLoading) {
      return true;
    }
    if (this.props.totalQuestion != nextProps.totalQuestion) {
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
      questions,
      listQuestionAdded,
      _closeLearnPlaceholder,
      isLoading,
      totalQuestion
    } = this.props;
    if (!totalQuestion && !isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 200,
          }}>
          <Text>Không có dữ liệu</Text>
        </View>
      );
    }
    return (
      <>
        {isLoading && <LearnPlaceholder />}
        <WebView
          ref={(ref) => (this.webview = ref)}
          style={{ backgroundColor: 'transparent' }}
          onMessage={onHandleMessage}
          onLoadEnd={_closeLearnPlaceholder}
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
      </>
    );
  }
}

class ModalQuestion extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.questions != nextProps.questions ||
      this.props.isModal != nextProps.isModal ||
      this.props.isLoadingModal != nextProps.isLoadingModal
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      isModal,
      isLoadingModal,
      htmlContent,
      getDetailMatarial,
      urlMedia,
      questions,
      listQuestionAdded,
      onHandleMessage,
      onClose
    } = this.props;
    return (
      <Modal
        visible={isModal}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.containerModal}>
            <TouchableWithoutFeedback>
              <View style={styles.bodyModal}>
                <TouchableWithoutFeedback
                  onPress={onClose}>
                  <View style={styles.btnClose}>
                    <Image source={require('../../../asserts/icon/icCloseModal.png')} style={{ tintColor: '#828282', }} />
                  </View>
                </TouchableWithoutFeedback>
                {isLoadingModal && htmlContent ?
                  <ActivityIndicator color='red' style={{ justifyContent: 'center', alignItems: 'center', }} />
                  :
                  !htmlContent ?
                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                      <Image source={require('../../../asserts/icon/iconNodata.png')} />
                      <TouchableWithoutFeedback onPress={getDetailMatarial}>
                        <View style={styles.reload}>
                          <Text style={{ color: '#fff' }}>Tải lại</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View> :
                    <WebView
                      ref={(ref) => (this.webview = ref)}
                      source={{
                        html: html.renderMatarialDetail(htmlContent, urlMedia, questions, listQuestionAdded),
                        baseUrl,
                      }}
                      onMessage={onHandleMessage}
                      subjectId={'TOAN'}
                      originWhitelist={['file://']}
                      scalesPageToFit={false}
                      javaScriptEnabled
                      showsVerticalScrollIndicator={false}
                      startInLoadingState={true}
                    />
                }
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    paper: state.paper,
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(QuestionLibrary);