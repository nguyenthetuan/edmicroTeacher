import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Platform,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { fetchDataAssignmentAction, updateExamListAction } from '../../../actions/paperAction';
import apiHelper from '../../../utils/dataHelper';
import apiPaper from '../../../services/apiPapersTeacher';
import MarkingPointTeacherWeb from '../../../utils/MarkingPointTeacherWeb';
import markingHomework from '../../../utils/webviewHomeWorkForStudent';
import { WebView } from 'react-native-webview';
import RippleButton from '../../libs/RippleButton';
import { Picker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppIcon from '../../../utils/AppIcon';
import Pdf from 'react-native-pdf';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dropdown from '../../../utils/Dropdown';
import { AlertNoti, roundToTwo } from '../../../utils/Common';
import FormInput from '../../../components/common/FormInput';
import ImageViewer from 'react-native-image-zoom-viewer';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';

const messageErrPoint =
  'Số điểm nhập vào lớn hơn số điểm mặc định.Vui lòng nhập lại';
const messageSuccess = 'Cập nhật thành công';
const messageSuccessPoint = 'Công bố điểm thành công';
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}
const { width, height } = Dimensions.get('window');
class MarkingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      isHideCommentInput: true,
      isVisibleModal: false,
      listStudentAssigned: [],
      listClassAssigned: [],
      assignmentDetailCheck: {},
      tabActive: 0,
      selectedValueStudent: '',
      selectedValueClass: '',
      idStudent: '',
      selectAssignId: '',
      assignId: '',
      indexSelected: {
        indexClass: 0,
        indexStudent: 0,
        status: -1
      },
      urlFile: '',
      modalImageFull: false,
      arrayImage: []
    };
  }

  filterDataStudentAssigned(data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      // if (data[i].idLog && data[i].status === 6) {
      result.push(data[i]);
      // }
    }
    return result;
  }

  componentDidMount() {
    const { assignmentId } = this.props.navigation.state.params.item;
    // const {token} = apiPaper.getToken();
    apiHelper.getToken().then(tk => {
      apiPaper
        .getListClassAssigned({ token: tk.token, assignmentId })
        .then(res => {
          //có asignID ở đây,
          this.setState({
            listClassAssigned: res.data,
            assignId: res.data[0].assignId,
            selectedValueClass: res.data[0].classId,
          });

          apiPaper
            .fetchListStudentAssign({
              token: tk.token,
              assignId: res.data[0].assignId,
            })
            .then(rs => {
              let studentListAssigned = this.filterDataStudentAssigned(rs);
              if (_.isEmpty(studentListAssigned)) {
                return;
              }
              const indexSelected = {
                ...indexSelected,
                status: rs[0].status
              }
              this.setState({
                selectedValueStudent: studentListAssigned[0]?.studentId,
                listStudentAssigned: studentListAssigned,
                selectAssignId: res.data[0].assignId,
                indexSelected
              });
              apiPaper
                .assignmentDetailCheck({
                  token: tk.token,
                  studentId: studentListAssigned[0]?.studentId,
                  assignId: res.data[0].assignId,
                })
                .then(respone => {
                  this.setState({
                    assignmentDetailCheck: respone,
                    urlFile:
                      !_.isEmpty(respone.data.listFile) &&
                      respone.data.listFile[0],
                  }, () => this.state.urlFile && this.checkCurrentIndex());
                  this.assignInitDataScoreAndComment(respone.data.data);
                });
            });
        });
    });
  }

  getDataPickupStudent = async () => {
    const { selectedValueStudent, selectAssignId } = this.state;

    const { token } = await apiHelper.getToken();
    const response = await apiPaper.assignmentDetailCheck({
      token,
      studentId: selectedValueStudent,
      assignId: selectAssignId,
    });
    if (response.status === 5) {
      this.setState({ assignmentDetailCheck: {} });
    }
    if (response.status === 1) {
      this.setState(
        {
          assignmentDetailCheck: response && response,
          urlFile:
            !_.isEmpty(response.data.listFile) && response.data.listFile[0],
        },
        () => { this.state.urlFile && this.checkCurrentIndex() },
      );
      this.assignInitDataScoreAndComment(response.data.data);
    }
  }

  getData = async () => {
    const { selectedValueStudent, selectAssignId } = this.state;
    const { token } = await apiHelper.getToken();
    const student = await apiPaper.fetchListStudentAssign({
      token,
      assignId: selectAssignId,
    });
    let studentListAssigned = this.filterDataStudentAssigned(student);
    this.setState(
      {
        selectedValueStudent: studentListAssigned[0]?.studentId,
        listStudentAssigned: studentListAssigned,
        indexSelected: {
          ...this.state.indexSelected,
          status: studentListAssigned[0]?.status
        }
      },
      async () => {
        const response = await apiPaper.assignmentDetailCheck({
          token,
          studentId: this.state.selectedValueStudent,
          assignId: this.state.selectAssignId,
        });
        if (response.status === 5) {
          this.setState({ assignmentDetailCheck: {} });
        }
        if (response.status === 1) {
          this.setState(
            {
              assignmentDetailCheck: response && response,
              urlFile:
                !_.isEmpty(response.data.listFile) && response.data.listFile[0],
            },
            () => this.state.urlFile && this.checkCurrentIndex(),
          );
          this.assignInitDataScoreAndComment(response.data.data);
        }
      },
    );
  };

  checkCurrentIndex = () => {
    const { assignmentDetailCheck } = this.state;
    let count = 0;
    _.forEach(assignmentDetailCheck.data.data, (e, index) => {
      let typeAnswer = 0;
      if (e.dataMaterial) {
        typeAnswer = e.dataMaterial?.data[0]?.typeAnswer;
      } else {
        typeAnswer = e?.dataStandard.typeAnswer;
      }
      if (typeAnswer === 0) {
        count = count + 1;
      }
    });
    this.setState({ currentIndex: count });
  };

  assignInitDataScoreAndComment(data) {
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (e.dataMaterial) {
        let dataMaterial = e.dataMaterial.data[0];
        let scoreTeacher = dataMaterial.scoreTeacher;
        let stepId = dataMaterial.stepId;
        let contentNoteTeacher = dataMaterial.contentNoteTeacher;
        if (contentNoteTeacher?.indexOf('<p>') >= 0) {
          contentNoteTeacher = contentNoteTeacher?.slice(
            3,
            contentNoteTeacher.length - 4,
          );
        }
        this.setState({
          [`valueScore${i}`]: (!!scoreTeacher && scoreTeacher) || 0,
          [`valueCommnent${i}`]: contentNoteTeacher,
        });
      } else {
        let dataStandard = e.dataStandard;
        let scoreTeacher = dataStandard.scoreTeacher;
        let stepId = dataStandard.stepId;
        let contentNoteTeacher = dataStandard.contentNoteTeacher;
        if (contentNoteTeacher?.indexOf('<p>') >= 0) {
          contentNoteTeacher = contentNoteTeacher?.slice(
            3,
            contentNoteTeacher.length - 4,
          );
        }
        this.setState({
          [`${this.state.selectedValueStudent}marked${i}`]: !!scoreTeacher,
          [`valueScore${i}`]: scoreTeacher,
          [`valueCommnent${i}`]: contentNoteTeacher,
        });
      }
    }
  }

  async refreshDataWithNewClass() {
    const { assignId, classId } = this.state;
    apiHelper.getToken().then(tk => {
      apiPaper
        .fetchListStudentAssign({ token: tk.token, assignId: assignId })
        .then(rs => {
          let studentListAssigned = this.filterDataStudentAssigned(rs);
          this.setState({
            selectedValueStudent: studentListAssigned[0]?.studentId,
            listStudentAssigned: studentListAssigned,
          });
          apiPaper
            .assignmentDetailCheck({
              token: tk.token,
              studentId: studentListAssigned[0]?.studentId,
              assignId: res.data[0].assignId,
            })
            .then(respone => {
              this.setState({ assignmentDetailCheck: respone });
            });
        });
    });
  }

  refreshWithNewStudent = () => {
    const { assignId, classId, selectedValueStudent } = this.state;
    apiHelper.getToken().then(tk => {
      apiPaper
        .assignmentDetailCheck({
          token: tk.token,
          studentId: selectedValueStudent,
          assignId: assignId,
        })
        .then(respone => {
          this.setState({ assignmentDetailCheck: respone });
        });
    });
  };

  onValueChangePickerStudent = value => {
    const indexStudent = value;
    const { listStudentAssigned, indexSelected } = this.state;
    value = listStudentAssigned[value];
    this.setState(
      {
        selectedValueStudent: value.studentId,
        indexSelected: {
          indexStudent,
          ...indexSelected,
          status: value.status
        },
        urlFile: '',
      },
      () => this.getDataPickupStudent(),
    );
  };
  onValueChangePickerClass = value => {
    const indexClass = value;
    const { listClassAssigned, indexSelected } = this.state;
    value = listClassAssigned[value];
    let assignId = value?.assignId;
    this.setState(
      {
        selectedValueClass: value.classId,
        selectAssignId: assignId,
        indexSelected: {
          indexClass,
          ...indexSelected,
        },
        urlFile: '',
      },
      () => this.getData(),
    );
  };

  async onPressSubmitButton() {
    const isErr = this.checkScore();
    if (isErr) {
      return;
    }
    const {
      listStudentAssigned,
      listClassAssigned,
      currentIndex,
      selectedValueStudent,
      selectedValueClass,
      assignmentDetailCheck,
    } = this.state;
    const stepId =
      (assignmentDetailCheck.data.data[this.state.currentIndex]?.dataMaterial &&
        assignmentDetailCheck.data.data[this.state.currentIndex]?.dataMaterial
          .data[0].stepId) ||
      assignmentDetailCheck.data.data[this.state.currentIndex].dataStandard
        .stepId;
    const idLog = _.find(
      listStudentAssigned,
      e => e.studentId === selectedValueStudent,
    ).idLog;
    const assignId = _.find(
      listClassAssigned,
      e => e.classId === selectedValueClass,
    );
    try {
      let formData = {
        assignId: assignId?.assignId,
        classId: selectedValueClass,
        contentNote: this.state[`valueCommnent${this.state.currentIndex}`],
        idLog: idLog,
        scoreTeacher: this.state[`valueScore${this.state.currentIndex}`],
        stepId: stepId,
        studentId: selectedValueStudent,
      };
      const { token } = await apiHelper.getToken();
      const response = await apiPaper.submitReview({ token, formData });
      if (response && response.msg === null) {
        if (!_.isEmpty(assignmentDetailCheck?.data?.data)) {
          assignmentDetailCheck.data.data = assignmentDetailCheck.data.data.map(
            item => {
              if (item.dataStandard != null) {
                if (item.dataStandard.stepId == response.stepId) {
                  item.dataStandard.timeSetScore = new Date().getTime();
                }
              } else {
                let dataMaterial = item.dataMaterial.data;
                for (let element of dataMaterial) {
                  if (element.stepId == response.stepId) {
                    element.timeSetScore = new Date().getTime();
                  }
                }
              }
              return item;
            },
          );
          this.setState({ assignmentDetailCheck, [`${selectedValueStudent}marked${this.state.currentIndex}`]: true });
        }
        AlertNoti(messageSuccess);
        return;
      }
      AlertNoti(response.msg);
    } catch (error) { }
  }

  onChangeTextComment(value) {
    this.setState({ [`valueCommnent${this.state.currentIndex}`]: value });
  }

  onChangeTextScore(point) {
    if (point[point.length - 1] == ',') {
      point = `${point.substring(0, point.length - 1)}.`
    }
    // if(point ==='') {
    //   point = 0;
    // }

    this.setState({ [`valueScore${this.state.currentIndex}`]: point });
  }

  checkScore() {
    const { assignmentDetailCheck, currentIndex } = this.state;
    let pointCurrent = parseFloat(this.state[`valueScore${currentIndex}`]);
    pointCurrent = roundToTwo(pointCurrent);
    const maxScore =
      Object.keys(assignmentDetailCheck).length === 0
        ? null
        : assignmentDetailCheck.data.data[currentIndex]?.dataMaterial
          ? assignmentDetailCheck.data.data[currentIndex]?.dataMaterial.data[0]
            .maxScore
          : assignmentDetailCheck.data.data[currentIndex].dataStandard.maxScore;
    if (pointCurrent > maxScore) {
      AlertNoti(messageErrPoint);
      this.setState({ [`valueScore${this.state.currentIndex}`]: maxScore });
      return true;
    } else {
      this.setState({ [`valueScore${this.state.currentIndex}`]: pointCurrent });
      return false;
    }
  }

  onpressComment() {
    if (this.state.isHideCommentInput) {
      this.setState({ isHideCommentInput: !this.state.isHideCommentInput });
    } else {
      this.setState({ isHideCommentInput: !this.state.isHideCommentInput });
    }
  }

  onButtonQuestionPress = index => {
    const { assignmentDetailCheck, selectedValueStudent } = this.state;
    if (!this.state[`${selectedValueStudent}marked${index}`]) {
      this.setState({
        [`valueScore${index}`]: 0,
        [`valueCommnent${index}`]: ''
      })
    }
    if (!this.state.isHideCommentInput) {
      this.onpressComment();
    }
    if (!assignmentDetailCheck.data.listFile[0]) {
      this.webview.postMessage(`buttonQuestion---${index}`);
    }
    this.setState({ currentIndex: index });
  };

  onPressPublicScore = () => {
    Alert.alert('', 'Bạn có chắc chắn muốn công bố điểm cho cả lớp không? Lưu ý: Các câu, các bài làm chưa được chấm sẽ bị 0 điểm.', [
      {
        text: 'Xác nhận',
        onPress: () => {
          this.publicedScore();
        }
      },
      {
        text: 'Hủy bỏ',
        onPress: () => { }
      },
    ])
  }

  publicedScore = async () => {
    const isErr = this.checkScore();
    const { selectedValueClass, listClassAssigned, listStudentAssigned } = this.state;
    if (isErr || listStudentAssigned.length === 0) {
      return;
    }
    const assignId = _.find(
      listClassAssigned,
      e => e.classId === selectedValueClass,
    );
    const formData = {
      assignId: assignId?.assignId,
      classId: selectedValueClass,
    };
    try {
      const { token } = await apiHelper.getToken();
      const response = await apiPaper.publicedScore({ token, formData });
      if (response.status === 1) {
        AlertNoti(messageSuccessPoint, () => {
          this.props.needUpdate(true);
          this.props.navigation.pop(1);
        });
      }
    } catch (error) { }
  };

  renderHeader = () => {
    const {
      selectedValueClass,
      listStudentAssigned,
      listClassAssigned,
      indexSelected
    } = this.state;
    const { item } = this.props.navigation.state.params;
    const { shadowBtn } = shadowStyle;
    return (
      <SafeAreaView style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RippleButton
              style={styles.buttonBack}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Image
                style={{ tintColor: "#fff" }}
                source={require('../../../asserts/icon/icon_arrowLeftv3.png')}
              />
            </RippleButton>
            <Text numberOfLines={1}
              style={styles.titleScre}>
              {item.name}
            </Text>
          </View>
          <RippleButton
            style={[styles.buttonReleasePoint, shadowBtn]}
            onPress={() => this.onPressPublicScore()}>
            <Text style={styles.txtBtn}>
              Công bố điểm
            </Text>
          </RippleButton>
        </View>
        {
          <View style={styles.rowDrop}>
            <View style={styles.dropTwo}>
              <Text style={styles.titleDrop}>
                Lớp :
              </Text>
              <Text style={styles.titleDrop}>
                Học Sinh :
              </Text>
            </View>
            <View style={styles.dropTwo}>
              <Dropdown
                title="Lớp"
                data={listClassAssigned}
                indexSelected={indexSelected.indexClass}
                isShowIcon={true}
                onPressItem={this.onValueChangePickerClass}
                contentStyle={styles.widthDrop}
              />
              <Dropdown
                title="Học Sinh"
                data={listStudentAssigned}
                indexSelected={indexSelected.indexStudent}
                status={indexSelected.status}
                isShowIcon={true}
                onPressItem={this.onValueChangePickerStudent}
                contentStyle={[styles.widthDrop, { top: 7 }]}
              />
            </View>
          </View>
        }
      </SafeAreaView>
    );
  };

  _changeTab = key => {
    const { tabActive } = this.state;
    if (key == tabActive) {
      return;
    }
    switch (key) {
      case 0:
        this.setState({ tabActive: key });
        break;
      case 1:
        this.setState({ tabActive: key });
        break;
      case 2:
        this.setState({ tabActive: key })
        break;
    }
  };

  tabHomework() {
    const { currentIndex, assignmentDetailCheck } = this.state;
    let explan = assignmentDetailCheck.data.data[currentIndex]?.dataMaterial ?
      assignmentDetailCheck.data.data[currentIndex]?.dataMaterial.data[0].userOptionText ? assignmentDetailCheck.data.data[currentIndex]?.dataMaterial.data[0].userOptionText[0] : ''
      : assignmentDetailCheck.data.data[currentIndex]?.dataStandard.userOptionText ? assignmentDetailCheck.data.data[currentIndex]?.dataStandard.userOptionText[0] : '';
    let urlMedia = assignmentDetailCheck.data.data[currentIndex]?.dataMaterial ?
      assignmentDetailCheck.data.data[currentIndex]?.dataMaterial.data[0].userImageAnswer ? assignmentDetailCheck.data.data[currentIndex]?.dataMaterial.data[0].userImageAnswer : ''
      : assignmentDetailCheck.data.data[currentIndex]?.dataStandard.userImageAnswer ? assignmentDetailCheck.data.data[currentIndex]?.dataStandard.userImageAnswer : '';
    return (
      <View style={{ flex: 1, paddingHorizontal: 16, }}>
        <WebView
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            alignContent: 'center',
          }}
          onMessage={this.onHandleMessage.bind(this)}
          source={{
            html: markingHomework.renderHomeWork(
              explan,
              urlMedia
            ),
            baseUrl,
          }}
          originWhitelist={['file://']}
          startInLoadingState
          scalesPageToFit={false}
          injectedJavaScript={`window.testMessage = "hello world"`}
          javaScriptEnabled
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  _changeTabComponent = () => {
    const { tabActive } = this.state;
    const { assignmentDetailCheck } = this.state;
    const source = { uri: assignmentDetailCheck.data.listFile[0] };
    const answer = { uri: assignmentDetailCheck.data.answerFile }
    switch (tabActive) {
      case 0:
        return (
          source.uri && <Pdf
            ref={ref => (this.pdfFull = ref)}
            source={source}
            onLoadComplete={(numberOfPages, filePath) => { }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          /> || null
        );
        break;
      case 1:
        return (
          answer.uri && <Pdf
            ref={ref => (this.pdfFull = ref)}
            source={answer}
            onLoadComplete={(numberOfPages, filePath) => { }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          /> || null
        );
        break;
      case 2:
        return this.tabHomework();
        break;
      default:
        return (
          <Pdf
            ref={ref => (this.pdfFull = ref)}
            source={source}
            onLoadComplete={(numberOfPages, filePath) => { }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        );
    }
  };

  filterScored = () => {
    const { assignmentDetailCheck } = this.state;
    let arrayScored = [];
    Object.keys(assignmentDetailCheck).length !== 0 &&
      assignmentDetailCheck.data.length !== 0 &&
      _.forEach(assignmentDetailCheck.data.data, e => {
        if (e.dataStandard) {
          let dataStandard = e.dataStandard;
          if (dataStandard.timeSetScore != 0) {
            arrayScored.push(dataStandard.stepId);
          }
        } else {
          let dataMaterial = e.dataMaterial.data[0];
          if (dataMaterial.timeSetScore != 0) {
            arrayScored.push(dataMaterial.stepId);
          }
        }
      });
    return arrayScored;
  };

  _answer = type => {
    switch (type) {
      case 0:
        return 'A';
        break;
      case 1:
        return 'B';
      case 2:
        return 'C';
        break;
      case 3:
        return 'D';
        break;
      default:
        '';
        break;
    }
  };

  ItemQuestion = ({ index, item }) => {
    const { currentIndex, urlFile, selectedValueStudent } = this.state;
    let arrayScored = this.filterScored();
    var bg = '';
    if (item.dataStandard) {
      if (arrayScored.includes(item.dataStandard.stepId)) {
        bg = '#5DD8FF';
      }
    } else {
      if (arrayScored.includes(item.dataMaterial.data[0].stepId)) {
        bg = '#84BFE9';
      }
    }
    let typeAnswer =
      item.dataMaterial ? item.dataMaterial.data[0].typeAnswer : item.dataStandard?.typeAnswer;
    let makedPoint = false;
    if (this.state[`${selectedValueStudent}marked${index}`]) {
      makedPoint = true;
    }
    let answer =
      item.dataMaterial ? item.dataMaterial.data[0].userOptionId[0] :
        item.dataStandard?.userOptionId[0];
    if (typeAnswer === 0 || typeAnswer == 1) {
      return (
        <TouchableWithoutFeedback
        // onPress={() => {
        //   this.onButtonQuestionPress(index);
        // }}
        >
          <View style={[
            styles.buttonQuestion,
            { backgroundColor: '#5DD8FF', borderColor: '#fff' },
            makedPoint && { backgroundColor: '#5DD8FF', borderColor: '#fff' }
          ]}>
            <Text style={{ color: '#fff' }}>{index + 1}</Text>
            <Text style={{ color: '#fff', marginLeft: 1 }}>
              {this._answer(answer)}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return index !== currentIndex ? (
        <TouchableWithoutFeedback
          onPress={() => {
            this.onButtonQuestionPress(index);
          }}>
          <View style={[
            styles.buttonQuestion, { borderRadius: 20 },
            { borderColor: (bg && '#fff') || '#828282' }, bg && { backgroundColor: bg }, makedPoint && { backgroundColor: '#5DD8FF' },
          ]}>
            <Text style={{ color: (bg && '#fff') || '#828282' }}>{index + 1}</Text>
            <Text style={{ color: (bg && '#fff') || '#828282', marginLeft: 0 }}>
              {typeAnswer === 0 && this._answer(answer)}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              this.onButtonQuestionPress(index);
            }}>
            <View style={[
              styles.buttonQuestion,
              { borderColor: '#AAFF54', borderRadius: 17, }, bg && { backgroundColor: bg }
            ]}>
              <Text
                style={{ color: (bg && '#fff') || '#828282', fontWeight: 'bold', left: 1 }}>
                {index + 1}
              </Text>
              <Text style={{ color: (bg && '#fff') || '#828282', marginLeft: 3 }}>
                {typeAnswer === 0 && this._answer(answer)}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
    }
  };

  onHandleMessage = (event) => {
    const data = event.nativeEvent.data.split('---');
    if (data[0] === 'urlImage') {
      this.modalFullImage(data[1])
    }
  }

  modalFullImage = (image) => {
    const imsges = [{
      url: image
    }]
    this.setState({
      modalImageFull: true,
      arrayImage: imsges
    })
  }

  render() {
    const {
      assignmentDetailCheck,
      currentIndex,
      tabActive,
      selectedValueClass,
      modalImageFull,
      arrayImage
    } = this.state;
    const { shadowBtn } = shadowStyle;
    if (_.isEmpty(assignmentDetailCheck)) {
      return (
        <View style={styles.rootView}>
          {this.renderHeader()}
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text numberOfLines={2}
              style={{ color: '#f86c6b', textAlign: 'center', marginHorizontal: 50 }}>
              Không tồn tại học sinh có bài cần chấm trong lớp
            </Text>
          </View>
        </View>
      );
    }
    const maxScore =
      Object.keys(assignmentDetailCheck).length === 0 ||
        assignmentDetailCheck.data.data.length === 0
        ? null
        : assignmentDetailCheck.data.data[currentIndex]?.dataMaterial
          ? assignmentDetailCheck.data.data[currentIndex]?.dataMaterial.data[0]
            .maxScore
          : assignmentDetailCheck.data.data[currentIndex].dataStandard.maxScore;
    let point =
      (typeof this.state[`valueScore${this.state.currentIndex}`] !==
        `undefined` &&
        `${this.state[`valueScore${this.state.currentIndex}`]}`) ||
      ``;
    if (this.state[`valueScore${this.state.currentIndex}`] === '') {
      point = '0';
    }
    if (parseInt(point) > 0)
      point = (point).replace(/^0+/, '');

    return (
      <View style={styles.rootView}>
        {this.renderHeader()}
        {Object.keys(assignmentDetailCheck).length === 0 ||
          assignmentDetailCheck.data.data.length === 0 ? (
            <View />
          ) : (
            <View style={{ flex: 1 }}>
              <View style={styles.wrapTop}>
                <View style={{ height: 5, backgroundColor: '#c4c4c4' }} />
                <View style={{ backgroundColor: '#58A3CE', padding: 20 }}>
                  <FlatList
                    horizontal
                    data={assignmentDetailCheck.data.data}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.ItemQuestion}
                    style={{ marginTop: 10 }}
                  />
                  <View style={styles.poinded}>
                    <View style={styles.review}>
                      <View style={[styles.note, { backgroundColor: '#5DD8FF' }]} />
                      <Text style={styles.txtNote}>Đã chấm</Text>
                    </View>
                    <View style={styles.review}>
                      <View style={[styles.note, { backgroundColor: '#84BFE9', borderColor: "#828282" }]} />
                      <Text style={styles.txtNote}>Chưa chấm</Text>
                    </View>
                    <View style={styles.review}>
                      <View style={[styles.note, { backgroundColor: '#58A3CE' }]} />
                      <Text style={styles.txtNote}>Trắc nghiệm</Text>
                    </View>
                    <View style={styles.review}>
                      <View style={[styles.note, { backgroundColor: '#58A3CE', borderRadius: 10 }]} />
                      <Text style={styles.txtNote}>Tự luận </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.wrapInputScore}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Nunito-Bold', fontSize: RFFonsize(14), color: '#fff' }}>
                      Câu {this.state.currentIndex + 1}{' '}
                    </Text>
                    <View style={{
                      width: 50,
                      height: 50,
                      justifyContent: 'center',
                      marginHorizontal: 5
                    }}>
                      <FormInput
                        paddingTopContent={4}
                        borderRadius={4}
                        borderWidth={0.5}
                        onChangeText={text => this.onChangeTextScore(text)}
                        value={point}
                        keyboardType={'numeric'}
                        height={28}
                        bgColor='#FFF'
                        styleInput={styles.point}
                      />
                    </View>
                    <Text style={{ fontFamily: 'Nunito-Bold', fontSize: RFFonsize(14), color: "#fff" }}>
                      {' '}
                    /{maxScore}.đ
                    </Text>
                  </View>
                  <RippleButton
                    style={[styles.buttonCommnet, shadowBtn]}
                    rippleContainerBorderRadius={10}
                    onPress={() => {
                      this.onpressComment();
                    }}>
                    <Text
                      style={{ color: '#828282', fontFamily: 'Nunito-Bold', fontSize: RFFonsize(12), left: 5 }}>
                      Nhận xét
                  </Text>
                    <Image source={require('../../../asserts/icon/icon_cmtMarking.png')} style={{ right: 3 }} />
                  </RippleButton>
                  <RippleButton
                    style={[styles.buttonUpdate, shadowBtn]}
                    rippleContainerBorderRadius={10}
                    onPress={() => {
                      this.onPressSubmitButton();
                    }}>
                    <Text
                      style={{ color: '#fff', fontFamily: 'Nunito-Bold', fontSize: RFFonsize(12) }}>
                      Cập nhật
                  </Text>
                  </RippleButton>
                </View>
                {!this.state.isHideCommentInput && (
                  <View
                    style={{
                      width: '90%',
                      height: 30,
                      borderWidth: 0.5,
                      borderRadius: 5,
                      paddingHorizontal: 5,
                      height: 100,
                      marginVertical: 20,
                      backgroundColor: '#F2F2F2',
                      borderColor: '#C4C4C4',
                      alignSelf: 'center',
                    }}>
                    <TextInput
                      onChangeText={text => {
                        this.onChangeTextComment(text);
                      }}
                      value={
                        this.state[`valueCommnent${this.state.currentIndex}`]
                      }
                      multiline={true}
                      autoFocus={true}
                    />
                    {/* <RippleButton
                    style={styles.buttonSubmit}
                    rippleContainerBorderRadius={10}
                    onPress={() => {
                      this.onpressComment();
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Nunito',
                        fontSize: RFFonsize(12),
                      }}>
                      Lưu
                    </Text>
                  </RippleButton> */}
                  </View>
                )}
              </View>
              {!_.isEmpty(assignmentDetailCheck.data.listFile) && (
                <>
                  <TabOfPaper
                    tabActive={tabActive}
                    _changeTab={this._changeTab}
                    currentIndex={currentIndex}
                    assignmentDetailCheck={assignmentDetailCheck}
                  />
                  {this._changeTabComponent()}
                </>
              )}
              {_.isEmpty(assignmentDetailCheck.data.listFile) && (
                <>
                  <WebView
                    ref={ref => (this.webview = ref)}
                    style={{
                      backgroundColor: 'transparent',
                      flex: 1,
                      alignContent: 'center',
                    }}
                    onMessage={this.onHandleMessage.bind(this)}
                    source={{
                      html: MarkingPointTeacherWeb.renderListQuestionAndAnswersMaterial(
                        this.state.assignmentDetailCheck.data.data,
                        this.state.assignmentDetailCheck.data.assignmentType,
                      ),
                      baseUrl,
                    }}
                    originWhitelist={['file://']}
                    startInLoadingState
                    scalesPageToFit={false}
                    injectedJavaScript={`window.testMessage = "hello world"`}
                    javaScriptEnabled
                    showsVerticalScrollIndicator={false}
                  />
                </>
              )}
            </View>
          )}
        <Modal visible={modalImageFull}>
          <TouchableOpacity style={{ zIndex: 1, position: 'absolute', top: 40, left: 20 }} onPress={() => this.setState({ modalImageFull: false })}>
            <Image source={require('../../../asserts/appIcon/icon_close_modal.png')} style={{ tintColor: '#fff' }} />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={arrayImage}
            enableSwipeDown={true}
            onSwipeDown={() => this.setState({ modalImageFull: false })}
            enableImageZoom={true}
          />
        </Modal>
      </View>
    );
  }
}

class TabOfPaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionX: new Animated.Value(0),
    };
  }

  _changeTab = key => () => {
    const { tabActive } = this.props;
    const { positionX } = this.state;
    if (key == tabActive) {
      return;
    }
    this.props._changeTab(key);
    switch (key) {
      case 0:
        Animated.timing(positionX, {
          duration: 400,
          toValue: 0,
        }).start();
        break;
      case 1:
        Animated.timing(positionX, {
          duration: 400,
          toValue: width / 4,
        }).start();
        break;
      case 2:
        Animated.timing(positionX, {
          duration: 400,
          toValue: width / 1.78,
        }).start();
    }
  };

  render() {
    const { tabActive, currentIndex, assignmentDetailCheck } = this.props;
    const { positionX } = this.state;
    return (
      <View style={styles.wrapTab}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[styles.btnTab, { marginLeft: 30 }]}
            onPress={this._changeTab(0)}>
            <Text
              style={tabActive == 0 ? styles.labelTabActive : styles.labelTab}>
              Bộ đề
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnTab, { marginLeft: Platform.isPad ? 220 : 65 }]}
            onPress={this._changeTab(1)}>
            <Text
              style={tabActive == 1 ? styles.labelTabActive : styles.labelTab}>
              Lời giải
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnTab, { marginLeft: Platform.isPad ? 220 : 65 }]}
            onPress={this._changeTab(2)}>
            <Text
              style={tabActive == 2 ? styles.labelTabActive : styles.labelTab}>
              Bài làm của học sinh
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.tabActive, { marginLeft: positionX }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  point: {
    textAlign: 'center',
    paddingRight: 10,
    marginBottom: 13,
    color: '#EE0000',
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Bold',
    alignSelf: 'center'
  },
  txtNote: {
    color: '#fff',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    fontFamily: 'Nunito',
    marginLeft: 5,
  },
  note: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 1,
    borderStyle: 'solid',
  },
  rootView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonQuestion: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderRadius: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    flexDirection: 'row',
  },
  wrapTop: {
    width: '100%',
    backgroundColor: '#107CB9',
  },
  wrapInputScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  buttonUpdate: {
    width: 95,
    padding: 5,
    backgroundColor: '#FDC214',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonCommnet: {
    width: 120,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonSubmit: {
    backgroundColor: '#7E96EC',
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: 30,
    width: 40,
    height: 30,
  },
  buttonOK: {
    width: 60,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
  },
  buttonMore: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'blue',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonBack: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: 40,
    // height: 40,
  },
  header: {
    backgroundColor: '#107CB9',
    alignItems: 'center',
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
  },
  buttonReleasePoint: {
    width: 110,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textQuestion: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#000000',
  },
  pdf: {
    flex: 1,
    width,
  },
  btnTab: {
    alignItems: 'center',
  },
  labelTab: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
    color: '#383838',
    paddingVertical: 3,
  },
  labelTabActive: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold',
    color: '#000000',
    paddingVertical: 3,
  },
  wrapTab: {
    justifyContent: 'flex-start',
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 1,
  },
  tabActive: {
    width: width / 4,
    height: 1,
    backgroundColor: '#F98E2F',
  },
  poinded: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 20,
    left: 10,
    marginBottom: 8
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  styArrowDown: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 0,
    top: 0,
    borderWidth: 1,
    borderColor: '#AAE5F9',
  },
  dropTwo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: 16
  },
  widthDrop: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: width - 120,
    right: 15
  },
  rowDrop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16
  },
  titleDrop: {
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    fontFamily: 'Nunito-Bold',
    color: '#FFFEFE',
    top: 4
  },
  titleScre: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    color: '#fff',
    marginLeft: 16,
    width: width * 0.5
  },
  txtBtn: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(10),
    lineHeight: RFFonsize(14),
    color: '#ff6213',
    marginVertical: 5
  }

});

const mapStateToProps = state => {
  return {
    assignId: state.paper.assignId,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDetailAssignment: payload => {
      dispatch(fetchDataAssignmentAction(payload));
    },
    needUpdate: (payload) => dispatch(updateExamListAction(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkingView);
