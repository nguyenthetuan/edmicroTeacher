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
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { fetchDataAssignmentAction } from '../../../actions/paperAction';
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
      },
      urlFile: '',
      modalImageFull: false,
      arrayImage: []
    };
  }

  filterDataStudentAssigned(data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].idLog && data[i].status === 6) {
        result.push(data[i]);
      }
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
              this.setState({
                selectedValueStudent: studentListAssigned[0]?.studentId,
                listStudentAssigned: studentListAssigned,
                selectAssignId: res.data[0].assignId,
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
      if (response && response.message === null) {
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
          this.setState({ assignmentDetailCheck });
        }
        AlertNoti(messageSuccess);
        return;
      }
      // AlertNoti(response.message);
    } catch (error) { }
  }

  onChangeTextComment(value) {
    this.setState({ [`valueCommnent${this.state.currentIndex}`]: value });
  }

  onChangeTextScore(point) {
    if (point[point.length - 1] == ',') {
      point = `${point.substring(0, point.length - 1)}.`
    }
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
    const { assignmentDetailCheck } = this.state;
    if (!this.state.isHideCommentInput) {
      this.onpressComment();
    }
    if (!assignmentDetailCheck.data.listFile[0]) {
      this.webview.postMessage(`buttonQuestion---${index}`);
    }
    this.setState({ currentIndex: index });
  };

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
      indexSelected,
    } = this.state;
    return (
      <SafeAreaView style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RippleButton
              style={styles.buttonBack}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              {/* <Image source={AppIcon.icon_arrow_left} resizeMode='contain' ></Image> */}
              <MaterialCommunityIcons
                name={'arrow-left'}
                color={'#FFF'}
                size={23}
              />
            </RippleButton>
            <Text
              style={{ fontFamily: 'Nunito-Bold', fontSize: RFFonsize(14), color: '#fff' }}>
              Chấm điểm
            </Text>
          </View>
          <RippleButton
            style={styles.buttonReleasePoint}
            onPress={() => this.publicedScore()}>
            <Text style={{ fontFamily: 'Nunito', fontSize: RFFonsize(12), color: '#fff' }}>
              Công bố điểm
            </Text>
          </RippleButton>
        </View>
        {
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 27,
              marginBottom: 22,
            }}>
            <View style={{}}>
              <Text
                style={{
                  fontSize: RFFonsize(14),
                  fontFamily: 'Nunito-Bold',
                  color: '#FFFEFE',
                  marginLeft: 20,
                }}>
                Lớp
              </Text>
              <View style={{}}>
                <Dropdown
                  title="Lớp"
                  data={listClassAssigned}
                  indexSelected={indexSelected.indexClass}
                  isShowIcon={true}
                  onPressItem={this.onValueChangePickerClass}
                />
              </View>
            </View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: RFFonsize(14),
                  fontFamily: 'Nunito-Bold',
                  color: '#FFFEFE',
                  marginLeft: 20,
                }}>
                Học Sinh
              </Text>
              <View style={{}}>
                <Dropdown
                  title="Học Sinh"
                  data={listStudentAssigned}
                  indexSelected={indexSelected.indexStudent}
                  isShowIcon={true}
                  onPressItem={this.onValueChangePickerStudent}
                />
              </View>
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
    const { currentIndex, urlFile } = this.state;
    let arrayScored = this.filterScored();
    var bg = '';
    if (item.dataStandard) {
      if (arrayScored.includes(item.dataStandard.stepId)) {
        bg = '#2D9CDB';
      }
    } else {
      if (arrayScored.includes(item.dataMaterial.data[0].stepId)) {
        bg = '#2D9CDB';
      }
    }
    let typeAnswer =
      item.dataMaterial ? item.dataMaterial.data[0].typeAnswer : item.dataStandard?.typeAnswer;
    let makedPoint = false;
    // if (this.state[`valueScore${index}`] || this.state[`valueCommnent${index}`]) {
    //   makedPoint = true;
    // }
    let answer =
      item.dataMaterial ? item.dataMaterial.data[0].userOptionId[0] :
        item.dataStandard?.userOptionId[0];
    if (typeAnswer === 0 && urlFile) {
      return (
        <RippleButton
          style={[
            styles.buttonQuestion,
            { backgroundColor: '#E34D5C', borderColor: '#E34D5C' },
            makedPoint && { backgroundColor: '#2D9CDB' }
          ]}>
          <Text style={{ color: '#fff' }, makedPoint && { color: '#fff' }}>{index + 1}</Text>
          <Text style={{ color: '#fff', marginLeft: 3 }, makedPoint && { color: '#fff' }}>
            {this._answer(answer)}
          </Text>
        </RippleButton>
      );
    } else {
      return index !== currentIndex ? (
        <RippleButton
          style={[
            styles.buttonQuestion,
            { borderColor: (bg && '#56CCF2') || '#828282' }, bg && { backgroundColor: bg }, makedPoint && { backgroundColor: '#2D9CDB' },
          ]}
          onPress={() => {
            this.onButtonQuestionPress(index);
          }}>
          <Text style={{ color: (bg && '#fff') || '#a4a6b0' }, makedPoint && { color: '#fff' }}>{index + 1}</Text>
          <Text style={{ color: (bg && '#fff') || '#a4a6b0', marginLeft: 3 }, makedPoint && { color: '#fff' }}>
            {typeAnswer === 0 && this._answer(answer)}
          </Text>
        </RippleButton>
      ) : (
          <RippleButton
            style={[
              styles.buttonQuestion,
              { borderColor: '#56CCF2' }, bg && { backgroundColor: bg }
            ]}
            onPress={() => {
              this.onButtonQuestionPress(index);
            }}>
            <Text
              style={{ color: (bg && '#fff') || '#a4a6b0', fontWeight: 'bold', left: 1 }}>
              {index + 1}
            </Text>
            <Text style={{ color: (bg && '#fff') || '#a4a6b0', marginLeft: 3 }}>
              {typeAnswer === 0 && this._answer(answer)}
            </Text>
          </RippleButton>
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
    if (_.isEmpty(assignmentDetailCheck)) {
      return (
        <View style={styles.rootView}>
          {this.renderHeader()}
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#f86c6b', textAlign: 'center' }}>
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
    const point =
      (typeof this.state[`valueScore${this.state.currentIndex}`] !==
        `undefined` &&
        `${this.state[`valueScore${this.state.currentIndex}`]}`) ||
      ``;

    return (
      <View style={styles.rootView}>
        {this.renderHeader()}
        {Object.keys(assignmentDetailCheck).length === 0 ||
          assignmentDetailCheck.data.data.length === 0 ? (
            <View />
          ) : (
            <View style={{ flex: 1, marginTop: 5 }}>
              <View style={styles.wrapTop}>
                <View style={{ height: 70 }}>
                  <Text style={styles.textQuestion}>Câu hỏi</Text>
                  <FlatList
                    horizontal
                    data={assignmentDetailCheck.data.data}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.ItemQuestion}
                  />
                </View>
                <View style={styles.poinded}>
                  <View style={styles.review}>
                    <View style={[styles.note, { backgroundColor: '#E34D5C' }]} />
                    <Text style={styles.txtNote}>Trắc nghiệm</Text>
                  </View>
                  <View style={styles.review}>
                    <View style={styles.note} />
                    <Text style={styles.txtNote}>Chưa chấm</Text>
                  </View>
                  <View style={styles.review}>
                    <View style={[styles.note, { backgroundColor: '#2D9CDB' }]} />
                    <Text style={styles.txtNote}>Đã chấm</Text>
                  </View>
                </View>
                <View style={styles.wrapInputScore}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Nunito-Bold', fontSize: RFFonsize(14) }}>
                      Câu {this.state.currentIndex + 1}{' '}
                    </Text>
                    <View style={{
                      width: 50,
                      height: 50,
                      justifyContent: 'center'
                    }}>
                      <FormInput
                        paddingTopContent={4}
                        borderRadius={2}
                        borderWidth={0.5}
                        borderColor={'#828282'}
                        onChangeText={text => this.onChangeTextScore(text)}
                        value={point}
                        keyboardType={'numeric'}
                        height={28}
                        bgColor='#FFF'
                        styleInput={styles.point}
                      />
                    </View>
                    <Text style={{ fontFamily: 'Nunito-Bold', fontSize: RFFonsize(14) }}>
                      {' '}
                    /{maxScore}
                    </Text>
                  </View>
                  <RippleButton
                    style={styles.buttonCommnet}
                    rippleContainerBorderRadius={10}
                    onPress={() => {
                      this.onpressComment();
                    }}>
                    <Text
                      style={{ color: '#fff', fontFamily: 'Nunito', fontSize: RFFonsize(12) }}>
                      Nhận xét
                  </Text>
                  </RippleButton>
                  <RippleButton
                    style={styles.buttonUpdate}
                    rippleContainerBorderRadius={10}
                    onPress={() => {
                      this.onPressSubmitButton();
                    }}>
                    <Text
                      style={{ color: '#fff', fontFamily: 'Nunito', fontSize: RFFonsize(12) }}>
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
                      marginTop: 20,
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
                    <RippleButton
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
                        Nhận xét
                    </Text>
                    </RippleButton>
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
    marginBottom: 13
  },
  txtNote: {
    color: '#828282',
    fontSize: RFFonsize(10),
    fontFamily: 'Nunito',
    marginLeft: 5,
  },
  note: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#828282',
    borderRadius: 1,
  },
  rootView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonQuestion: {
    width: 35,
    height: 30,
    borderWidth: 1,
    borderRadius: 2,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#828282',
    flexDirection: 'row',
  },
  wrapTop: {
    width: '100%',
    // height: 100,
    // alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  wrapInputScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonUpdate: {
    width: 95,
    height: 20,
    backgroundColor: '#56BB73',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonCommnet: {
    width: 95,
    height: 20,
    backgroundColor: '#7E96EC',
    justifyContent: 'center',
    borderRadius: 2,
    alignItems: 'center',
  },
  buttonSubmit: {
    backgroundColor: '#7E96EC',
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    bottom: 5,
    padding: 5,
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
    width: 40,
    height: 40,
  },
  header: {
    backgroundColor: '#56CCF2',
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
    width: 100,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA031',
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
    color: '#DADADA',
  },
  labelTabActive: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold',
    color: '#000000',
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: -10,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkingView);
