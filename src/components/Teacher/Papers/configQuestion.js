import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Text,
  Platform,
  Dimensions,
  TextInput,
  Keyboard,
  ScrollView,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dropdown from '../Homework/Dropdown';
import { WebView } from 'react-native-webview';
import MathJaxLibs from '../../../utils/webViewConfigQuestion';
import WarningModal from '../../modals/WarningModal';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import _ from 'lodash';
import { connect } from 'react-redux';
import FormInput from '../../common/FormInput';
import AnalyticsManager from '../../../utils/AnalyticsManager';
import Globals from '../../../utils/Globals';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import SwitchButton from '../../../components/common/ButtonSwitch';
import { RFFonsize } from '../../../utils/Fonts';
import { AlertNoti, roundToTwo, roundToFour } from '../../../utils/Common';
import html from '../../../utils/ModalMatarial';
import Header from '../../common-new/Header';
import Toast, { DURATION } from 'react-native-easy-toast';
import { setListGrades, updateExamListAction } from '../../../actions/paperAction';
import AppIcon from '../../../utils/AppIcon';
import shadowStyle from '../../../themes/shadowStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalClass from './ModalClass';
import SubjectItem from './SubjectItem';
import ModalSubject from './ModalSubject';
import ClassItem from './ClassItem';
import ToastFaild from '../../common-new/ToastFaild';
import { DraggableGrid } from 'react-native-draggable-grid';
import ModalSuccess from './ModalSuccess/ModalSuccess';

const NUM_ITEMS = 10;

const { width, height } = Dimensions.get('screen');
const HEIGHT_WEB = isIphoneX() ? height - 200 : height - 100;
let baseUrl = 'file:///android_asset/';
const webViewScript = `
  setTimeout(function() { 
    window.ReactNativeWebView.postMessage(document.body.scrollHeight); 
  }, 0);
`;

const HEIGHTTOP = height;
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}
let heightHeader = 0;
class ConfigQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allQuestion: false,
      arrayQuestion: [],
      gradeCode: [],
      listGrades: [],
      subjectCode: [],
      name: '',
      listSubjects: [],
      questions: [],
      errors: [],
      duration: 5,
      assignmentType: 0,
      activeSort: false,
      position: 0,
      scrollview: true,
      scrollWebview: false,
      totalPoint: 10,
      webheight: 500,
      isExplain: false,
      isModal: false,
      isLoadingModal: false,
      htmlContent: '',
      urlMedia: '',
      loading: false,
      modalVisible: false,
      resSuccess: null,
      dragging: false,
    };
    this.animatedValue = new Animated.Value(0);
  }
  onHandleMessage(event) {
    const data = event.nativeEvent.data.split('---');
    let { questions, totalPoint } = this.state;

    if (data[0] === 'warningWeb') {
      this.setState({ numberQuestion: data[2] }, () => {
        this.displayWarning(true);
      });
    }
    if (data[0] === 'pushArray') {
      this.setState({
        arrayQuestion: [...this.state.arrayQuestion, data[1]],
      });
    }
    if (data[0] === 'popArray') {
      let index = _.indexOf(this.state.arrayQuestion, data[1]);
      this.setState({
        arrayQuestion: [
          ...this.state.arrayQuestion.splice(0, index),
          ...this.state.arrayQuestion.splice(index + 1),
        ],
      });
    }

    if (data[0] === 'enterPoint') {
      let totalPointTemp = 0;
      const questionId = data[1];
      const value = parseFloat(data[2]) || 0;
      for (let item of questions) {
        if (item.questionId === questionId) {
          item.point = value;
        }
        totalPointTemp += item.point;
      }
      this.setState({ questions, totalPoint: totalPointTemp });
    }

    if (event.nativeEvent.data && parseInt(event.nativeEvent.data)) {
      const h = parseInt(event.nativeEvent.data);
      this.setState({ webheight: h + HEIGHTTOP });
    }
    if (data[0] === 'matariaDetail') {
      this.getDetailMatarial();
      this.setState({ isModal: true }, () => this.getDetailMatarial(data[1]));
    }
  }

  displayWarning(b) {
    this.refs.warningModal.showModal();
  }

  async componentDidMount() {
    const { data } = this.props.navigation.state.params || {};
    let getListQuestion = [];
    if (data) {
      const { questions } = data;
      getListQuestion = questions;
    } else {
      getListQuestion = await dataHelper.getQuestion();
    }
    const { totalPoint } = this.state;
    for (let item of getListQuestion) {
      item.point = roundToFour(totalPoint / getListQuestion.length);
    }
    getListQuestion = getListQuestion.map((item, index) => ({ ...item, numberQuestion: index + 1, key: index.toString() }));
    !_.isEmpty(getListQuestion) &&
      this.setState({
        questions: getListQuestion,
      });
    const { token } = await dataHelper.getToken();

    const resGrade = await apiPapers.getGrade({ token });
    if (resGrade) {
      this.props.saveGrades(resGrade);
    }
    this.setState(
      {
        listGrades: resGrade,
        listSubjects: this.props.paper.listSubject,
      },
      () =>
        this.activeSubject({
          code: this.props.navigation.state.params.curriculumCode,
        }),
    );
  }

  getListQuestionCopy = (data) => {
    const { questions } = data;
    // this.setState({ questions });
    console.log(questions);
  }

  getTotalTypeQuestion = questions => {
    if (questions.length !== 0) {
      let typeOne = 0;
      let typeTwo = 0;
      let typeThree = 0;
      questions.forEach(element => {
        switch (element.levelQuestion) {
          case 0:
            typeOne = ++typeOne;
            break;
          case 1:
            typeTwo = ++typeTwo;
            break;
          case 2:
            typeThree = ++typeThree;
            break;
          default:
            break;
        }
      });
      let typeFour = questions.length - (typeOne + typeTwo + typeThree);
      return { typeOne, typeTwo, typeThree, typeFour };
    }
  };

  getTotalPointQuestion = questions => {
    if (questions.length !== 0) {
      let pointOne = 0;
      let pointTwo = 0;
      let pointThree = 0;
      let pointFour = 0;
      questions.forEach(element => {
        switch (element.levelQuestion) {
          case 0:
            pointOne += element.point;
            break;
          case 1:
            pointTwo += element.point;
            break;
          case 2:
            pointThree += element.point;
            break;
          case 3:
            pointFour += element.point;
            break;
          default:
            break;
        }
      });
      // pointFour = totalPoint - (pointOne + pointTwo + pointThree);
      return {
        pointOne: roundToTwo(pointOne),
        pointTwo: roundToTwo(pointTwo),
        pointThree: roundToTwo(pointThree),
        pointFour: roundToTwo(pointFour),
      };
    }
  };

  moveArrayItem = (array, fromIndex, toIndex) => {
    const arr = [...array];
    arr.splice(toIndex, 0, ...arr.splice(fromIndex, 1));
    return arr;
  };

  activeGrade = item => {
    const { gradeCode, listGrades } = this.state;
    let gradeCodeTmp = gradeCode;
    let listGradeTmp = listGrades.map(e => {
      return { ...e, isActive: false };
    });

    const index = _.indexOf(gradeCodeTmp, item.gradeId);
    index < 0
      ? (gradeCodeTmp = [...gradeCodeTmp, ...[item.gradeId]])
      : (gradeCodeTmp = [
        ...gradeCodeTmp.slice(0, index),
        ...gradeCodeTmp.slice(index + 1),
      ]);

    gradeCodeTmp
      .sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)))
      .map(gradeId => {
        const i = _.indexOf(listGradeTmp.map(e => e.gradeId), gradeId);
        if (i > -1) {
          listGradeTmp[i].isActive = true;
          // listGradeTmp = this.moveArrayItem(listGradeTmp, i, 0);
        }
      });
    // this.refs.flastList.scrollToIndex({ animated: true, index: 0 });
    this.setState({
      gradeCode: gradeCodeTmp,
      listGrades: listGradeTmp,
      errors: [],
    });
  };

  _renderGrade = () => {
    const { gradeCode } = this.state;
    return (
      // <FlatList
      //   ref={'flastList'}
      //   style={{ marginTop: 8 }}
      //   data={listGrades}
      //   keyExtractor={(item, index) => index.toString()}
      //   renderItem={({ item, index }) => {
      //     return !item.isActive ? (
      //       <RippleButton
      //         key={`a${index}`}
      //         style={styles.buttomClass}
      //         onPress={() => this.activeGrade(item)}>
      //         <Text style={styles.txtItem}>{item.name}</Text>
      //       </RippleButton>
      //     )
      //       :
      //       (
      //         <RippleButton
      //           key={`b${index}`}
      //           style={styles.buttomActive}
      //           onPress={() => this.activeGrade(item)}>
      //           <Text style={styles.txtItemActive}>{item.name}</Text>
      //         </RippleButton>
      //       );
      //   }}
      //   removeClippedSubviews={false}
      //   horizontal
      //   showsHorizontalScrollIndicator={false}
      // />
      <ClassItem
        gradeActive={gradeCode}
        onOpen={() => this.refModalClass.onOpen()}
        refFlatlist={this.refFlatlist}
        activeClass={this.activeClass}
        Icon={AppIcon.iconDowSelect}
        style={{ borderWidth: 1, borderColor: "#c4c4c4" }}
      />
    );
  };
  activeClass = async item => {
    let { gradeCode } = this.state;
    const index = _.indexOf(gradeCode, item.gradeId || item);
    if (index < 0) {
      this.setState({
        gradeCode: [...gradeCode, item.gradeId],
      });
    } else {
      this.setState({
        gradeCode: [...gradeCode.splice(0, index), ...gradeCode.splice(index + 1)],
      });
    }
  };

  activeSubject = async item => {
    let { subjectCode } = this.state;
    const index = _.indexOf(subjectCode, item.code || item);
    if (index < 0) {
      this.setState({
        subjectCode: [...subjectCode, item.code],
      });
    } else {
      let arrTmp = [...subjectCode.splice(0, index), ...subjectCode.splice(index + 1)]
      this.setState({
        subjectCode: arrTmp,
      });
    }
  };

  activeSubject = item => {
    const { subjectCode, listSubjects } = this.state;
    let subjectCodeTmp = subjectCode;
    let listSubjectsTmp = listSubjects.map(e => {
      return { ...e, isActive: false };
    });
    const index = _.indexOf(subjectCodeTmp, item.code);
    index < 0
      ? (subjectCodeTmp = [...subjectCodeTmp, ...[item.code]])
      : (subjectCodeTmp = [
        ...subjectCodeTmp.slice(0, index),
        ...subjectCodeTmp.slice(index + 1),
      ]);

    subjectCodeTmp.map(subjectId => {
      const i = _.indexOf(listSubjectsTmp.map(e => e.code), subjectId);
      if (i > -1) {
        listSubjectsTmp[i].isActive = true;
        // listSubjectsTmp = this.moveArrayItem(listSubjectsTmp, i, 0);
      }
    });
    // this.refs.flastListSub.scrollToIndex({ animated: true, index: 0 });
    this.setState({
      subjectCode: subjectCodeTmp,
      listSubjects: listSubjectsTmp,
      errors: [],
    });
  };

  _renderSubject = () => {
    const { listSubjects, subjectCode } = this.state;
    return (
      // <FlatList
      //   ref={'flastListSub'}
      //   style={{ marginTop: 8 }}
      //   data={listSubjects}
      //   keyExtractor={(item, index) => index.toString()}
      //   renderItem={({ item, index }) => {
      //     return !item.isActive ? (
      //       <RippleButton
      //         key={`c${index}`}
      //         style={styles.buttomClass}
      //         onPress={() => this.activeSubject(item)}>
      //         <Text style={styles.txtItem}>{item.name}</Text>
      //       </RippleButton>
      //     ) : (
      //         <RippleButton
      //           key={`d${index}`}
      //           style={styles.buttomActive}
      //           onPress={() => this.activeSubject(item)}>
      //           <Text style={styles.txtItemActive}>{item.name}</Text>
      //         </RippleButton>
      //       );
      //   }}
      //   removeClippedSubviews={false}
      //   horizontal
      //   showsHorizontalScrollIndicator={false}
      // />
      <SubjectItem
        subjectActive={subjectCode}
        listSubjects={listSubjects}
        onOpen={() => this.refModalSubject.onOpen()}
        refFlatlist={this.refFlatlist}
        activeSubject={this.activeSubject}
        Icon={AppIcon.iconDowSelect}
        style={{ borderWidth: 1, borderColor: "#c4c4c4" }}
      />
    );
  };

  validate = () => {
    var errors = [];
    var result = true;
    _.forEach(['gradeCode', 'subjectCode', 'name'], item => {
      if (_.isEmpty(this.state[item])) {
        switch (item) {
          case 'gradeCode': {
            errors[item] = true;
            result = false;
            break;
          }
          case 'subjectCode': {
            errors[item] = true;
            result = false;
            break;
          }
          case 'name': {
            errors[item] = true;
            result = false;
            break;
          }
          default:
            break;
        }
      }
      this.setState({ errors });
    });
    return result;
  };

  getQuestionPostData = (data) => {
    try {
      const questions = data.map((val, key) => {
        return {
          questionId: val.questionId,
          index: key,
          point: val.point,
          typeAnswer: val.typeAnswer
        }
      })
      return questions;
    } catch (error) {
      console.log(error);
    }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  config = async () => {
    if (this.validate()) {
      const {
        gradeCode,
        subjectCode,
        assignmentType,
        duration,
        questions,
        name,
        isExplain,
        totalPoint,
      } = this.state;
      if (totalPoint < 10 || totalPoint > 10) {
        AlertNoti('Vui lòng nhập tổng điểm bằng 10');
        return;
      }
      const formData = new FormData();
      const time = Math.ceil(new Date().getTime() / 1000);
      formData.append(`name`, name);
      formData.append(`timeStart`, time);
      formData.append(`timeEnd`, time);
      formData.append(`status`, 'Publish');
      formData.append(`isShare`, true);
      formData.append(`assignmentType`, assignmentType);
      formData.append(`isExplain`, isExplain);
      if (duration) {
        formData.append(`duration`, duration * 60);
      } else {
        formData.append(`duration`, 5 * 60);
      }
      formData.append(`file`, null);
      _.forEach(gradeCode, item => {
        formData.append(`gradeCode[]`, item);
      });
      _.forEach(subjectCode, item => {
        formData.append(`subjectCode[]`, item);
      });
      formData.append('question', JSON.stringify(this.getQuestionPostData(questions)));

      try {
        this.setState({ loading: true });
        console.log("config token: ");
        const { token } = await dataHelper.getToken();
        console.log("config token: ", token);

        const response = await apiPapers.createQuestion({ token, formData });
        if (response.status === 0) {
          const setQuestion = await dataHelper.saveQuestion([]);
          const res = await apiPapers.getAssignmentConfig({
            token,
            id: response.id,
          });
          if (res && res.assignmentId) {
            this.setState(
              {
                listGrades: this.props.paper.listGrade,
                listSubjects: this.props.paper.listSubject,
                // name: '',
                loading: false,
                resSuccess: res,
              },
              this.loadingToast.show((<ActivityIndicator size="small" />), 100,
                () => {
                  this.setModalVisible(true)
                }
              ),
            );
            // cau hinh thanh cong
            AnalyticsManager.trackWithProperties('School Teacher', {
              action: 'CREATEASSIGNMENT',
              mobile: Platform.OS,
              grade: gradeCode,
              subject: subjectCode,
            });
            Globals.updatePaper();
            this.props.needUpdate(true);
          }
        }
        // lam them alert bao loi neu co
      } catch (error) {
        this.setState({ loading: false })
        console.log('error', error);
      }
    } else {
      this.refToast.show(<ToastFaild title="Vui lòng điền đầy đủ thông tin" />);
    }
  };


  handleTickAll = () => {
    var array = [];
    _.forEach(this.state.questions, item => {
      array.push(item.questionId);
    });
    this.setState(
      {
        allQuestion: !this.state.allQuestion,
      },
      () => {
        if (this.state.allQuestion) {
          this.webview.postMessage('tickAll');
          this.setState({ arrayQuestion: array });
        } else {
          this.webview.postMessage('hideAll');
          this.setState({ arrayQuestion: [] });
        }
      },
    );
  };

  deleteQuestion = async () => {
    const { questions, arrayQuestion } = this.state;
    const arrFilter = questions.filter(
      item => !arrayQuestion.includes(item.questionId),
    );
    this.setState({
      questions: arrFilter,
      arrayQuestion: [],
    });
    const setQuestion = await dataHelper.saveQuestion(arrFilter);
    if (arrFilter.length === 0) {
      this.props.navigation.replace('QuestionLibrary');
    }
  };

  _moveQuestion = () => {
    const { questions, arrayQuestion, position } = this.state;
    let newQuestions = questions;
    if (questions.length !== 1) {
      if (arrayQuestion.length === 1) {
        let positionItem = _.findIndex(
          questions,
          item => item.questionId === arrayQuestion[0],
        );
        let index = position - 1;
        let idx = questions.length - 1;
        if (positionItem !== index) {
          if (index >= questions.length) {
            let tmp = {};
            for (let i = 0; i < newQuestions.length; i++) {
              if (i === positionItem) {
                tmp = newQuestions[positionItem];
                newQuestions[positionItem] = newQuestions[idx];
              }
              if (idx === i) {
                newQuestions[idx] = tmp;
              }
            }
            if (index < questions.length) {
              this.setState({
                questions: newQuestions,
                arrayQuestion: [],
              });
            }
          } else {
            let m = {};
            for (let i = 0; i < newQuestions.length; i++) {
              if (i === positionItem) {
                m = newQuestions[positionItem];
                newQuestions[positionItem] = newQuestions[index];
                newQuestions[index] = m;
              }
              if (i === index) {
                newQuestions[index] = m;
              }
            }
            this.setState({
              questions: newQuestions,
              arrayQuestion: [],
            });
          }
        }
      } else {
        alert('Xin Vui lòng Chọn một câu hỏi');
      }
    }
  };

  _onTop = () => {
    this.refs.ScrollView.scrollTo({ x: 0, y: 0, animated: true });
  };

  getDetailMatarial = async idMatarial => {
    const { token } = await dataHelper.getToken();
    this.setState({ isLoadingModal: true });
    const response = await apiPapers.getMatarialDetail({ token, idMatarial });
    if (response) {
      this.setState({
        htmlContent: response?.contentHtml,
        urlMedia: response?.urlMedia,
        isLoadingModal: false,
      });
    }
  };

  updateScore = async () => {
    const { totalPoint, questions } = this.state;
    let questionTmp = questions;
    for (let item of questionTmp) {
      item.point = roundToFour(10 / questionTmp.length);
    }
    !_.isEmpty(questionTmp) &&
      this.setState({
        questions: questionTmp,
      });
  };

  unFocusTime = () => {
    const { duration } = this.state;
    if (!duration || duration < 5) {
      AlertNoti('Thời gian làm bài tối thiếu phải là 5 phút!');
      this.setState({ duration: 5 });
    }
  };

  onValueTimeChange = (num) => {
    if (num[num.length - 1] == ',') {
      num = `${num.substring(0, num.length - 1)}.`
    }
    this.setState({ duration: num || '' });
  }


  goToAssigned = () => {
    const { resSuccess } = this.state;
    this.setModalVisible();
    this.props.navigation.replace('Assignment', {
      item: { ...resSuccess, id: resSuccess.assignmentId },
      pop: 3,
      statusbar: 'light-content',
    });
  };

  renderItemSort = (item, order) => {
    const id = item.questionNumber.toString().substr(-3);
    return (
      <View
        key={order}
        style={styles.styWrapItemSort}
      >
        <Text
          style={{
            color: "white",
            fontFamily: 'Nunito-Bold',
            fontSize: 12
          }}
        >
          {id}
        </Text>
      </View>
    );
  }

  onDragEnd = (questions) => {
    questions = questions.map((item, index) => ({ ...item, numberQuestion: index + 1, key: index.toString() }));
    this.setState({ questions, dragging: false });
  }

  confirmSort = () => {
    let { questions } = this.state;
    dataHelper.saveQuestion(questions);
  }

  onDragStart = () => {
    this.setState({ dragging: true });
    this.animatedValue.setValue(1);
    Animated.timing(this.animatedValue, {
      toValue: 1.5,
      duration: 400,
    }).start();
  }

  render() {
    const {
      name,
      totalPoint,
      listGrades,
      listSubjects,
      activeSort,
      questions,
      assignmentType,
      duration,
      errors,
      arrayQuestion,
      webheight,
      isExplain,
      isModal,
      isLoadingModal,
      htmlContent,
      subjectCode,
      urlMedia,
      loading,
      gradeCode,
      modalVisible,
      dragging,
      wrapTopHeight: height
    } = this.state;
    const { shadowBtn } = shadowStyle;
    let heightSort = _.isArray(questions) ? 100 + (Math.ceil(questions.length / 10) - 1) * 40 : 100;
    heightSort = Platform.select({ ios: heightSort, android: heightSort + 50 });
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ backgroundColor: '#117DB9' }} />
        <SafeAreaView>
          <View style={{ backgroundColor: '#117DB9' }}>
            <Header
              ref={ref => this.refHeader = ref}
              title={'Cấu hình câu hỏi'}
              color={'#fff'}
              navigation={this.props.navigation}
              onRightAction={() => this.config()}
              styleTitle={styles.styleTitle}
              colorBtnBack={'#ffffff'}
              centerTitle={false}
              bgColorActive={{ backgroundColor: '#117DB9' }}
              createPaper={true}
            />
          </View>
          <ScrollView
            contentContainerStyle={{ height: webheight + heightSort }}
            ref={'ScrollView'}
            scrollEnabled={!dragging}
          >
            <View
              onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                this.setState({
                  wrapTopHeight: height
                })
              }}
            >
              <View>
                <View style={styles.bodyHeader}>
                  <View style={{ flex: 1 }}>

                    <View
                      style={{
                        marginTop: width < 380 ? 0.01 * width : 0.042 * width,
                      }}>
                      <Text
                        style={[
                          { color: '#000', fontSize: RFFonsize(14), lineHeight: RFFonsize(19), fontFamily: 'Nunito-Bold', marginTop: 4 },
                        ]}>
                        Tên bài tập
                      </Text>
                      <FormInput
                        styleInput={styles.input}
                        placeholder='Tên bài tập'
                        height={40}
                        borderRadius={5}
                        borderWidth={1}
                        borderColor={'#c4c4c4'}
                        onChangeText={text =>
                          this.setState({
                            name: text,
                            errors: [],
                          })
                        }
                        value={name}
                        onSubmitEditing={Keyboard.dismiss}
                        isSecureTextEntry={this.state.isSecureTextEntry}
                      />
                    </View>

                    <View>
                      {!_.isEmpty(listGrades) && (
                        <View style={{ marginTop: 10 }}>
                          {this._renderGrade()}
                        </View>
                      )}
                      {!_.isEmpty(listSubjects) && (
                        <View style={{ marginTop: 10 }}>
                          {this._renderSubject()}
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 16,
                        justifyContent: 'space-between'
                      }}>
                      <View style={styles.rowAlign}>
                        <Text style={styles.txtTitle}>Dạng bài</Text>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                          <Dropdown
                            title="Dạng bài"
                            contentStyle={styles.borBorder}
                            data={[
                              { name: 'Bài tự luyện', code: 1 },
                              { name: 'Bài kiểm tra', code: 0 },
                            ]}
                            indexSelected={assignmentType}
                            onPressItem={index =>
                              this.setState({ assignmentType: index })
                            }
                          />
                          <Icon
                            name={'angle-down'}
                            size={25}
                            color={Platform.OS == 'android' ? '#828282' : '#000'}
                            style={styles.icon}
                          />
                        </View>
                      </View>

                      {assignmentType !== 0 && (
                        <View style={[styles.rowAlign, { padidngLeft: 10 }]}>
                          <Text style={[styles.txtTitleGrade, { paddingTop: 3, marginLeft: 10 }]}>Thời gian(Phút)</Text>
                          <TextInput
                            style={styles.pickTime}
                            onChangeText={text => {
                              this.onValueTimeChange(text);
                            }}
                            value={
                              (typeof duration.toString() !== NaN &&
                                duration.toString()) ||
                              ''
                            }
                            numeric
                            keyboardType={'numeric'}
                            onBlur={this.unFocusTime}
                          />
                        </View>
                      )}

                      <View style={styles.rowAlign}>
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'Nunito-Bold',
                            fontSize: RFFonsize(13),
                            lineHeight: RFFonsize(17),
                            marginRight: 15,
                            marginBottom: 5
                          }}>
                          Giải thích
                    </Text>
                        <SwitchButton
                          stylebtnOnOff={styles.btnSwitch}
                          isCheck={isExplain}
                          onPress={() => {
                            this.setState({ isExplain: !isExplain });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ backgroundColor: "#f3f3f3" }}>
                  <View style={styles.footer}>
                    <View
                      style={[
                        styles.bodyFooter,
                        {
                          borderBottomWidth: 1,
                          borderBottomColor: '#E0E0E0',
                          backgroundColor: '#107CB9',
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          padding: 10
                        },
                      ]}>
                      <Text style={styles.txtFooterheder}>Loại câu hỏi</Text>
                      <Text style={styles.txtFooterheder}>Số câu</Text>
                      <Text style={styles.txtFooterheder}>Điểm</Text>
                    </View>
                    {!_.isEmpty(questions) ? (
                      <View style={styles.bodyFooter}>
                        {/* tiêu đề */}
                        <View>
                          {this.getTotalTypeQuestion(questions).typeOne !== 0 && (
                            <Text style={styles.txtTitleFooter}>Nhận biết</Text>
                          )}
                          {this.getTotalTypeQuestion(questions).typeTwo !== 0 && (
                            <Text style={styles.txtTitleFooter}>Thông hiểu</Text>
                          )}
                          {this.getTotalTypeQuestion(questions).typeThree !== 0 && (
                            <Text style={styles.txtTitleFooter}>Vận dụng</Text>
                          )}
                          {this.getTotalTypeQuestion(questions).typeFour !== 0 && (
                            <Text style={styles.txtTitleFooter}>Vận dụng cao</Text>
                          )}
                        </View>

                        {/* Số câu */}
                        <View>
                          {/* Nhận biết */}
                          {this.getTotalTypeQuestion(questions).typeOne !== 0 && (
                            <Text style={styles.txtIndexOne}>
                              {this.getTotalTypeQuestion(questions).typeOne}
                            </Text>
                          )}
                          {/* Thông hiều */}
                          {this.getTotalTypeQuestion(questions).typeTwo !== 0 && (
                            <Text style={styles.txtIndexOne}>
                              {this.getTotalTypeQuestion(questions).typeTwo}
                            </Text>
                          )}
                          {/* Vận dụng */}
                          {this.getTotalTypeQuestion(questions).typeThree !== 0 && (
                            <Text style={styles.txtIndexOne}>
                              {this.getTotalTypeQuestion(questions).typeThree}
                            </Text>
                          )}
                          {/* Vận dụng cao */}
                          {this.getTotalTypeQuestion(questions).typeFour !== 0 && (
                            <Text style={styles.txtIndexOne}>
                              {this.getTotalTypeQuestion(questions).typeFour}
                            </Text>
                          )}
                        </View>

                        {/* Điểm */}
                        <View>
                          {/* Nhận biết */}
                          {this.getTotalPointQuestion(questions).pointOne !== 0 && (
                            <Text style={styles.txtIndexTwo}>
                              {this.getTotalPointQuestion(questions).pointOne}
                            </Text>
                          )}
                          {/* Thông hiều */}
                          {this.getTotalPointQuestion(questions).pointTwo !== 0 && (
                            <Text style={styles.txtIndexTwo}>
                              {this.getTotalPointQuestion(questions).pointTwo}
                            </Text>
                          )}
                          {/* Vận dụng */}
                          {this.getTotalPointQuestion(questions).pointThree !== 0 && (
                            <Text style={styles.txtIndexTwo}>
                              {this.getTotalPointQuestion(questions).pointThree}
                            </Text>
                          )}
                          {/* Vận dụng cao */}
                          {this.getTotalPointQuestion(questions).pointFour !== 0 && (
                            <Text style={styles.txtIndexTwo}>
                              {this.getTotalPointQuestion(questions).pointFour}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.topBodyHeader}>
                    <Text style={styles.addQuestion}>
                      Tổng số câu: <Text style={{ color: '#4876AD' }}>{questions.length}</Text>
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 6,
                      }}>
                      <Text style={styles.totalAddQuestion}>
                        Tổng số điểm: <Text style={{ color: '#EF0001' }}>{roundToTwo(totalPoint)}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ backgroundColor: '#fff' }}>
                {/* start sort */}
                <View style={{ height: heightSort, width: '100%', padding: 20, }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.styTxtSort}>Kéo thả sắp xếp lại thứ tự câu</Text>
                    <TouchableWithoutFeedback onPress={this.confirmSort}>
                      <View style={[styles.styBtnSort, shadowBtn]}>
                        <Text style={[styles.txtDeleteChoose, { marginVertical: 2 }]}>Lưu</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <DraggableGrid
                    numColumns={10}
                    renderItem={this.renderItemSort}
                    data={questions || []}
                    onDragRelease={this.onDragEnd}
                    onDragStart={this.onDragStart}
                    dragStartAnimation={{
                      transform: [
                        { scale: this.animatedValue }
                      ],
                    }}
                    style={{ marginVertical: 10 }}
                  />
                </View>
                {/* end sort*/}
                <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 17
                    }}>

                    <TouchableWithoutFeedback
                      onPress={() => this.setState({ totalPoint: 10 }, () => this.updateScore())}>
                      <View style={[styles.btnOption, shadowBtn, { backgroundColor: "#7E96EC", justifyContent: 'center', marginTop: 14 }]}>
                        <View style={{ marginLeft: 5 }}>
                          <Image
                            source={require('../../../asserts/icon/icon_shareMark.png')}
                            resizeMode="contain"
                            style={{ width: 10, height: 10 }}
                          />
                        </View>
                        <Text style={styles.txtDeleteChoose}>Chia điểm</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={this.deleteQuestion}>
                      <View style={[styles.btnOption, shadowBtn, { marginTop: 14, paddingHorizontal: 2, justifyContent: 'center', }]}>
                        <MaterialCommunityIcons
                          name="delete-sweep"
                          size={20}
                          color="#fff"
                        />
                        <Text style={styles.txtDeleteChoose}>Xoá câu đã chọn</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={this.handleTickAll}>
                      <View style={[styles.btnOption, shadowBtn, { backgroundColor: '#56BB73', justifyContent: 'center', marginTop: 14 }]}>
                        <View
                          style={styles.styleTick}>
                          {this.state.allQuestion && (
                            <Image
                              source={require('../../../asserts/icon/icon_tick.png')}
                              resizeMode="contain"
                              style={{ width: 10, height: 10 }}
                            />
                          )}
                        </View>
                        <Text style={styles.txtDeleteChoose}>Chọn tất cả</Text>
                      </View>
                    </TouchableWithoutFeedback>

                  </View>
                </View>
              </View>
            </View>

            <WebView
              onMessage={this.onHandleMessage.bind(this)}
              source={{
                html: MathJaxLibs.renderHtmlQuestionDetail(
                  questions,
                  'TOAN',
                  arrayQuestion,
                  totalPoint,
                ),
                baseUrl,
              }}
              subjectId={'TOAN'}
              originWhitelist={['file://']}
              scalesPageToFit={false}
              javaScriptEnabled
              ref={ref => (this.webview = ref)}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              startInLoadingState
              injectedJavaScript={webViewScript}
            />
            <WarningModal
              ref={'warningModal'}
              navigation={this.props.navigation}
              visible={this.state.visibleModalWarning}
              hideModal={() => this.displayWarning(false)}
              numberQuestion={this.state.numberQuestion}
              subjectId={'TOAN'}
            />
            <SafeAreaView />
          </ScrollView>
          <Modal visible={isModal} transparent={true}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ isModal: false })}>
              <View style={styles.containerModal}>
                <TouchableWithoutFeedback>
                  <View style={[styles.bodyModal]}>
                    <TouchableWithoutFeedback
                      onPress={() => this.setState({ isModal: false })}>
                      <View
                        style={styles.closeState}>
                        <Image
                          source={require('../../../asserts/icon/icCloseModal.png')}
                          style={{ tintColor: '#828282' }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                    {isLoadingModal ? (
                      <ActivityIndicator
                        color="red"
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                      />
                    ) : (
                        <WebView
                          ref={ref => (this.webview = ref)}
                          source={{
                            html: html.renderMatarialDetail(htmlContent, urlMedia),
                            baseUrl,
                          }}
                          subjectId={'TOAN'}
                          originWhitelist={['file://']}
                          scalesPageToFit={false}
                          javaScriptEnabled
                          showsVerticalScrollIndicator={false}
                          startInLoadingState={false}
                          style={{ backgroundColor: '#fff' }}
                        />
                      )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
          >
            <ModalSuccess
              data={{ ...this.state.resSuccess, name: this.state.name }}
              navigation={this.props.navigation}
              goToAssigned={this.goToAssigned}
            />
          </Modal>
        </SafeAreaView>
        <ModalClass
          ref={ref => this.refModalClass = ref}
          gradeActive={gradeCode}
          listGrades={listGrades}
          activeClass={this.activeClass}
        />
        <ModalSubject
          ref={ref => this.refModalSubject = ref}
          subjectActive={subjectCode}
          listSubjects={listSubjects}
          activeSubject={this.activeSubject}
          Icon={AppIcon.iconDowSelect}
        />
        <Toast ref={ref => (this.refToast = ref)} position={'top'} />
        <Toast ref={ref => (this.toast = ref)} position={'top'} style={{ backgroundColor: '#16BDA9', height: 70 }} />
        <Toast ref={ref => (this.loadingToast = ref)} position={'center'} style={{ backgroundColor: "transparent" }} />

        <TouchableWithoutFeedback onPress={() => this._onTop()}>
          <View style={styles.buttomTop}>
            <Image
              source={require('../../../asserts/appIcon/icUp.png')}
              resizeMode="stretch"
              style={{ height: 20, width: 20 }}
            />
            <Text style={{ color: '#FAFAFA' }}>TOP</Text>
          </View>
        </TouchableWithoutFeedback>

      </View >
    );
  }
}

const mapStateToProps = state => {
  return {
    paper: state.paper,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    saveGrades: listGrades => dispatch(setListGrades(listGrades)),
    needUpdate: (payload) => dispatch(updateExamListAction(payload)),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfigQuestion);

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 200,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  bodyModal: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 500,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    // backgroundColor: '#117DB9',
    backgroundColor: "transparent",
  },
  topheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: width < 380 ? 20 : 15,
    paddingVertical: 10,
    marginTop: HEIGHT_TOPBAR,
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    color: '#000',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  rightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: width < 380 ? 5 : 5,
    paddingBottom: 2,
    backgroundColor: '#F49A31',
    borderRadius: 5,
    marginRight: 10,
  },
  txtRightHeader: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
  },
  bodyHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    // backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  pickTime: {
    height: 40,
    width: 100,
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    color: '#000',
    fontFamily: 'Nunito',
    backgroundColor: '#fff',
    // paddingVertical: 3,
    // paddingHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#c4c4c4',
  },
  txtFooterheder: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    paddingHorizontal: 10
  },
  txtTitleFooter: {
    marginTop: 7,
    fontFamily: 'Nunito',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    color: '#000',
    marginHorizontal: 10
  },
  txtIndexOne: {
    marginTop: 7,
    color: '#4776AD',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    fontFamily: 'Nunito-Bold',
    marginLeft: -20
  },
  txtIndexTwo: {
    marginTop: 7,
    color: '#EE0000',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    fontFamily: 'Nunito-Bold',
    marginLeft: -20,
    marginHorizontal: 10
  },
  bodyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 25,
    paddingLeft: 5,
    paddingVertical: 6
  },
  footer: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    paddingTop: 3,
    borderRadius: 5,
    marginTop: 15,
  },
  topBodyHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingBottom: 16
  },
  txtDeleteChoose: {
    fontFamily: 'Nunito',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(19),
    color: '#fff',
    // marginRight: 8,
    // marginLeft: 12,
    // marginVertical: 5
    marginHorizontal: 5,
  },
  addQuestion: {
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    fontFamily: 'Nunito-Bold',
    color: '#000',
    marginTop: 15,
  },
  buttomClass: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: '#FFF',
  },
  buttomActive: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0085FF',
    backgroundColor: '#89EAFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  txtTitleGrade: {
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    marginRight: 15,
    marginTop: 4
  },
  txtItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    color: '#828282',
  },
  txtItemActive: {
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    fontSize: RFFonsize(12),
    color: '#000',
  },
  buttonMove: {
    marginTop: 5,
    borderWidth: 0.5,
    backgroundColor: '#F0F0F0',
    borderColor: '#828282',
    padding: 2,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  totalAddQuestion: {
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    fontFamily: 'Nunito-Bold',
    color: '#000',
  },
  inputPoint: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#828282',
    height: 20,
    marginTop: 9,
    textAlign: 'center',
    color: '#FF6213',
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Bold',
    paddingVertical: 0,
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
    bottom: Platform.OS === 'ios' ? 15 : 60,
    zIndex: 100,
  },
  btnSwitch: {
    marginRight: 15,
  },
  input: {
    paddingTop: 9,
    paddingRight: 10
  },
  borBorder: {
    width: width - 240,
    borderWidth: 1,
    marginLeft: 0,
    height: 40,
    borderColor: '#c4c4c4',
    backgroundColor: 'transparent',
    marginTop: 4,
  },
  icon: {
    zIndex: -1,
    // position: 'absolute',
    alignSelf: 'center',
    marginLeft: -50,
    color: '#828282',
    marginTop: 5
  },
  rowAlign: {
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
  },
  closeState: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  styleTick: {
    backgroundColor: '#56BB73',
    height: 15,
    width: 15,
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 1,
    borderStyle: "solid",
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5242',
    padding: 5,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  flexColumn: {
    flexDirection: 'column'
  },
  styleTitle: {
    flex: 0,
    color: '#fff',
    fontSize: RFFonsize(14),
    fontWeight: 'bold',
  },
  styTxtSort: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    flex: 1,
  },
  styWrapItemSort: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    backgroundColor: '#56CCF2',
  },
  styBtnSort: {
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 5,
    justifyContent: 'center',
    backgroundColor: "#56CCF2",
  }
});
