import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  TextInput,
  Keyboard,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
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
import { AlertNoti, roundToTwo, roundToFour } from '../../../utils/Common';
import HTML from 'react-native-render-html';
import html from '../../../utils/ModalMatarial';
import HeaderPaper from './HeaderPaper';
import Toast, { DURATION } from 'react-native-easy-toast';

const { width, height } = Dimensions.get('window');
const HEIGHT_WEB = isIphoneX() ? height / 2 : height / 1.5;
let baseUrl = 'file:///android_asset/';
const webViewScript = `
  setTimeout(function() { 
    window.ReactNativeWebView.postMessage(document.body.scrollHeight); 
  }, 500);
`;
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
      webheight: 350,
      isExplain: false,
      isModal: false,
      isLoadingModal: false,
      htmlContent: '',
      urlMedia: '',
      loading: false,
    };
  }
  onHandleMessage(event) {
    const data = event.nativeEvent.data.split('---');
    if (data[0] === 'warningWeb') {
      this.setState({ numberQuestion: data[1] }, () => {
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
      let { questions, totalPoint } = this.state;
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
      this.setState({ webheight: parseInt(event.nativeEvent.data) + 40 });
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
    const getListQuestion = await dataHelper.getQuestion();
    const { totalPoint } = this.state;
    for (let item of getListQuestion) {
      item.point = roundToFour(totalPoint / getListQuestion.length);
    }
    !_.isEmpty(getListQuestion) &&
      this.setState({
        questions: getListQuestion,
      });

    this.setState(
      {
        listGrades: this.props.paper.listGrade && this.props.paper.listGrade,
        listSubjects:
          this.props.paper.listSubject && this.props.paper.listSubject,
      },
      () =>
        this.activeSubject({
          code: this.props.navigation.state.params.curriculumCode,
        }),
    );
  }

  getTotalTypeQuestion = questions => {
    if (questions.length !== 0) {
      let typeOne = 0;
      let typeTwo = 0;
      let typeThree = 0;
      let pointOne = 0;
      let pointTwo = 0;
      let pointThree = 0;
      let pointFour = 0;
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
          listGradeTmp = this.moveArrayItem(listGradeTmp, i, 0);
        }
      });
    this.refs.flastList.scrollToIndex({ animated: true, index: 0 });
    this.setState({
      gradeCode: gradeCodeTmp,
      listGrades: listGradeTmp,
      errors: [],
    });
  };

  _renderGrade = () => {
    const { listGrades } = this.state;
    return (
      <FlatList
        ref={'flastList'}
        style={{ marginTop: 8 }}
        data={listGrades}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return !item.isActive ? (
            <RippleButton
              key={`a${index}`}
              style={Platform.OS === 'ios' ? styles.buttomClass : null}
              onPress={() => this.activeGrade(item)}>
              <View
                style={Platform.OS === 'android' ? styles.buttomClass : null}>
                <Text style={styles.txtItem}>{item.name}</Text>
              </View>
            </RippleButton>
          ) : (
              <RippleButton
                key={`b${index}`}
                style={Platform.OS === 'ios' ? styles.buttomActive : null}
                onPress={() => this.activeGrade(item)}>
                <View
                  style={Platform.OS === 'android' ? styles.buttomActive : null}>
                  <Text style={styles.txtItemActive}>{item.name}</Text>
                </View>
              </RippleButton>
            );
        }}
        removeClippedSubviews={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
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
        listSubjectsTmp = this.moveArrayItem(listSubjectsTmp, i, 0);
      }
    });
    this.refs.flastListSub.scrollToIndex({ animated: true, index: 0 });
    this.setState({
      subjectCode: subjectCodeTmp,
      listSubjects: listSubjectsTmp,
      errors: [],
    });
  };

  _renderSubject = () => {
    const { listSubjects } = this.state;
    return (
      <FlatList
        ref={'flastListSub'}
        style={{ marginTop: 8 }}
        data={listSubjects}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return !item.isActive ? (
            <RippleButton
              key={`c${index}`}
              style={Platform.OS === 'ios' ? styles.buttomClass : null}
              onPress={() => this.activeSubject(item)}>
              <View
                style={Platform.OS === 'android' ? styles.buttomClass : null}>
                <Text style={styles.txtItem}>{item.name}</Text>
              </View>
            </RippleButton>
          ) : (
              <RippleButton
                key={`d${index}`}
                style={Platform.OS === 'ios' ? styles.buttomActive : null}
                onPress={() => this.activeSubject(item)}>
                <View
                  style={Platform.OS === 'android' ? styles.buttomActive : null}>
                  <Text style={styles.txtItemActive}>{item.name}</Text>
                </View>
              </RippleButton>
            );
        }}
        removeClippedSubviews={false}
        horizontal
        showsHorizontalScrollIndicator={false}
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
      formData.append('question', JSON.stringify(questions));
      try {
        this.setState({ loading: true })
        const { token } = await dataHelper.getToken();
        const response = await apiPapers.createQuestion({ token, formData });
        if (response.status === 0) {
          this.refToast.show('Tạo bộ đề thành công!');
          const setQuestion = await dataHelper.saveQuestion([]);
          const res = await apiPapers.getAssignmentConfig({
            token,
            id: response.id,
          });
          this.setState(
            {
              listGrades:
                this.props.paper.listGrade && this.props.paper.listGrade,
              listSubjects:
                this.props.paper.listSubject && this.props.paper.listSubject,
              name: '',
              loading: false,
            },
            () =>
              this.props.navigation.navigate('Assignment', {
                item: { ...res, id: res.assignmentId },
                checked: true,
              }),
          );
          // cau hinh thanh cong
          AnalyticsManager.trackWithProperties('School Teacher', {
            action: 'CREATEASSIGNMENT',
            mobile: Platform.OS,
            grade: gradeCode,
            subject: subjectCode,
          });
          Globals.updatePaper();
        }
      } catch (error) {
        this.setState({ loading: false })
        console.log('error', error);
      }
    } else {
      AlertNoti('Vui lòng điền đầy đủ thông tin');
      // alert('Vui lòng điền đầy đủ thông tin')
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
            if(index < questions.length){
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
    if (duration == '') {
      this.setState({ duration: 5 });
    }
  };

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
      loading
    } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <HeaderPaper
          title={'Cấu hình câu hỏi'}
          color={'white'}
          navigation={this.props.navigation}
          actionIcon={require('../../../asserts/appIcon/icRight.png')}
          actionStyle={{ borderRadius: 0 }}
          onRightAction={() => this.config()}
          loading={loading}
        />
        <ScrollView
          contentContainerStyle={{ height: webheight + HEIGHT_WEB }}
          ref={'ScrollView'}>
          <View>
            <View style={styles.bodyHeader}>
              <View style={{ flex: 1 }}>
                <View>
                  {!_.isEmpty(listGrades) && (
                    <View style={{ marginTop: 14 }}>
                      <Text
                        style={[
                          styles.txtTitleGrade,
                          errors.gradeCode && { color: '#EB5757' },
                        ]}>
                        Khối
                      </Text>
                      {this._renderGrade()}
                    </View>
                  )}
                  {!_.isEmpty(listSubjects) && (
                    <View style={{ marginTop: 14 }}>
                      <Text
                        style={[
                          styles.txtTitleGrade,
                          errors.subjectCode && { color: '#EB5757' },
                        ]}>
                        Môn học
                      </Text>
                      {this._renderSubject()}
                    </View>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: width < 380 ? 0.01 * width : 0.042 * width,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={styles.txtTitle}>Dạng bài kiểm tra</Text>
                    <Dropdown
                      title="Dạng bài"
                      data={[
                        { name: 'Bài tự luyện', code: 1 },
                        { name: 'Bài kiểm tra', code: 0 },
                      ]}
                      containerStyle={{ marginLeft: -20 }}
                      indexSelected={assignmentType}
                      onPressItem={index =>
                        this.setState({ assignmentType: index })
                      }
                    />
                  </View>

                  {assignmentType !== 0 && (
                    <View>
                      <Text style={styles.txtTitleGrade}>Thời gian(Phút)</Text>
                      <TextInput
                        style={styles.pickTime}
                        onChangeText={text => {
                          this.setState({ duration: parseInt(text) || '' });
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

                      {/* <View style={{ position: 'absolute', right: 10, top: -5, zIndex: 2, backgroundColor: 'red' }}>
                        <TouchableOpacity onPress={() => this.setState({ duration: duration + 1 })}>
                          <FontAwesome name='sort-up' style={{ marginTop: 10, position: 'absolute', top: 0 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 3 }} onPress={() => duration > 0 && this.setState({ duration: duration - 1 })}>
                          <FontAwesome name='sort-down' style={{ marginTop: 10, position: 'absolute', buttom: 0 }} />
                        </TouchableOpacity>
                      </View> */}
                    </View>
                  )}
                  <View
                    style={{
                      marginTop: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#FFFEFE',
                        fontFamily: 'Nunito-Bold',
                        fontSize: 12,
                        marginLeft: 5,
                        marginRight: 15,
                        marginBottom: 5,
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

                <View
                  style={{
                    marginTop: width < 380 ? 0.01 * width : 0.042 * width,
                  }}>
                  <Text
                    style={[
                      { color: '#FFF', fontSize: 12, fontFamily: 'Nunito-Bold' },
                      errors.name && { color: '#EB5757' },
                    ]}>
                    Nhập tên bài kiểm tra
                  </Text>
                  <FormInput
                    styleInput={{ marginBottom: 10 }}
                    paddingTopContent={4}
                    height={30}
                    borderRadius={5}
                    borderWidth={0.5}
                    borderColor={'#54CEF5'}
                    onChangeText={text =>
                      this.setState({
                        name: text,
                        errors: [],
                      })
                    }
                    value={name}
                    isShowPassword={true}
                    onSubmitEditing={Keyboard.dismiss}
                    isSecureTextEntry={this.state.isSecureTextEntry}
                    showPassword={() => this.showPassword()}
                    bgColor="#FFF"
                  />
                </View>
              </View>
            </View>
            <View style={styles.footer}>
              <View
                style={[
                  styles.bodyFooter,
                  { borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
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
                      <Text style={styles.txtTitleFooter}>Thông hiều</Text>
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
          </View>
          <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
              <View style={styles.topBodyHeader}>
                <Text style={styles.addQuestion}>
                  Tổng số câu {questions.length}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 6,
                  }}>
                  <Text style={styles.totalAddQuestion}>
                    Tổng điểm:{roundToTwo(totalPoint)}
                  </Text>
                  {/* <TextInput
                    editable={false}
                    style={[
                      styles.inputPoint,
                      { marginTop: 0, width: 60, marginLeft: 5 },
                    ]}
                    numberOfLines={1}
                    returnKeyType={'done'}
                    maxLength={4}
                    keyboardType={'numeric'}
                    onChangeText={(text) =>
                      this.setState({ totalPoint: (text && parseInt(text)) || 0 }
                        , () => this.updateScore())
                    }
                    // onEndEditing={() => this.pointSentence()}
                    value={(totalPoint && `${totalPoint}`) || ''}
                  /> */}
                  {/* <Image
                    source={require('../../../asserts/icon/editPoint.png')}
                    style={{ position: 'absolute', right: 3 }}
                  /> */}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 12,
                  height: 60,
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={this.deleteQuestion}>
                  <Text style={styles.txtDeleteChoose}>Xoá câu đã chọn</Text>
                  <MaterialCommunityIcons
                    name="delete-sweep"
                    size={23}
                    color="#DB3546"
                  />
                </TouchableOpacity>
                <View style={[{ justifyContent: 'flex-end' }]}>
                  <TouchableOpacity
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 17,
                      },
                    ]}
                    onPress={() => this.setState({ activeSort: !activeSort })}>
                    <Text style={styles.txtDeleteChoose}>Sắp xếp lại</Text>
                    <Image
                      source={require('../../../asserts/appIcon/sort.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {activeSort && (
                    <View
                      style={{
                        alignItems: 'center',
                        zIndex: 10,
                        position: 'absolute',
                        bottom: -25,
                        left: 20,
                        top: 15,
                      }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                          style={[
                            styles.buttonMove,
                            { height: Platform.OS === 'ios' ? 20.5 : 22 },
                          ]}
                          onPress={() => this._moveQuestion()}>
                          <Text style={{ fontSize: 11 }}>Đến</Text>
                        </TouchableOpacity>
                        <View
                          style={{ marginTop: Platform.OS === 'ios' ? 5 : 5 }}>
                          <FormInput
                            style={{
                              borderTopRightRadius: 4,
                              borderBottomRightRadius: 4,
                              paddingBottom: 4,
                              paddingHorizontal: 2,
                            }}
                            styleInput={{ paddingBottom: 10 }}
                            width={45}
                            height={Platform.OS === 'ios' ? 20.5 : 22}
                            borderWidth={0.5}
                            borderColor={'#828282'}
                            onChangeText={text =>
                              this.setState({
                                position: parseInt(text),
                              })
                            }
                            value={!!this.state.position.toString()}
                            onSubmitEditing={Keyboard.dismiss}
                            bgColor="#F0F0F0"
                            keyboardType={'numeric'}
                            maxLength={3}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', right: 0 }}
                  onPress={this.handleTickAll}>
                  <Text style={styles.txtDeleteChoose}>Tất cả</Text>
                  <View
                    style={{
                      backgroundColor: '#F0F0F0',
                      height: 16,
                      width: 16,
                      borderWidth: 0.5,
                      borderColor: '#828282',
                      borderRadius: 3,
                    }}>
                    {this.state.allQuestion && (
                      <Image
                        source={require('../../../asserts/appIcon/tick.png')}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => this.setState({ totalPoint: 10 }, () => this.updateScore())}>
                  <Text style={styles.txtDeleteChoose}>Chia đều điểm</Text>
                  <View style={{ marginLeft: 5 }}>
                    <Image
                      source={require('../../../asserts/images/iconDiv.png')}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
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
          </View>
          <SafeAreaView />
        </ScrollView>
        <TouchableOpacity
          style={styles.buttomTop}
          onPress={() => this._onTop()}>
          <Image
            source={require('../../../asserts/appIcon/icUp.png')}
            resizeMode="stretch"
            style={{ height: 20, width: 20 }}
          />
          <Text style={{ color: '#FAFAFA' }}>TOP</Text>
        </TouchableOpacity>
        <Modal visible={isModal} transparent={true}>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ isModal: false })}>
            <View style={styles.containerModal}>
              <TouchableWithoutFeedback>
                <View style={[styles.bodyModal]}>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      marginRight: 10,
                      marginTop: 10,
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      zIndex: 2,
                    }}
                    onPress={() => this.setState({ isModal: false })}>
                    <Image
                      source={require('../../../asserts/icon/icCloseModal.png')}
                      style={{ tintColor: '#828282' }}
                    />
                  </TouchableOpacity>
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
        <Toast ref={ref => (this.refToast = ref)} position={'bottom'} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    paper: state.paper,
  };
};

export default connect(
  mapStateToProps,
  {},
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
    backgroundColor: '#56CCF2',
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
    fontSize: 14,
    color: '#FFF',
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
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
  },
  bodyHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  pickTime: {
    height: 30,
    width: 100,
    fontSize: 12,
    color: '#828282',
    fontFamily: 'Nunito-Regular',
    backgroundColor: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    textAlign: 'center',
  },
  txtFooterheder: {
    color: '#828282',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  txtTitleFooter: {
    marginTop: 7,
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#424242',
  },
  txtIndexOne: {
    marginTop: 7,
    color: '#2D9CDB',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginLeft: -20,
  },
  txtIndexTwo: {
    marginTop: 7,
    color: '#FF6213',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginLeft: -20,
  },
  bodyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 25,
    paddingLeft: 5,
  },
  footer: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    paddingTop: 3,
    paddingBottom: 9,
    borderRadius: 5,
    marginBottom: 17,
    marginTop: 15,
  },
  topBodyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtDeleteChoose: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#828282',
    marginRight: 8,
  },
  addQuestion: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#159FDA',
    marginTop: 6,
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
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  txtTitleGrade: {
    color: '#FFFEFE',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 15,
  },
  txtItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#828282',
  },
  txtItemActive: {
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    fontSize: 12,
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
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#159FDA',
  },
  inputPoint: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#828282',
    height: 20,
    marginTop: 9,
    textAlign: 'center',
    color: '#FF6213',
    fontSize: 14,
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
    bottom: 15,
  },
  btnSwitch: {
    marginRight: 15,
  },
});
