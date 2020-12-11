import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dropdown from '../Homework/Dropdown';
import _ from 'lodash';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import InputNumberQuestion from './InputNumberQuestion';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Toast from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppIcon from '../../../utils/AppIcon';
import SelectAnswer from './SelectAnswer';
import AnalyticsManager from '../../../utils/AnalyticsManager';
import Globals from '../../../utils/Globals';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import HeaderPaper from './HeaderPaper';
import ModalSelectAnswers from './ModalSelectAnswers';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window');

export default class UploadPDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleViewAnswer: true,
      totalQuestion: 10,
      totalQuestionTL: 0,
      showModalFullPDF: false,
      viewFileFDF: true,
      urlFilePDF: '',
      urlFileAnswerPDF: '',
      loadingUpload: false,
      pathFileAnswerPDF: null,
      indexSelecting: 0,
      assignmentTypes: [
        {
          id: 0,
          name: 'Bài tự luyện',
        },
        {
          id: 1,
          name: 'Bài kiểm tra',
        },
      ],
      gradeCode: [],
      subjectCode: [],
      name: '',
      assignmentType: 0,
      duration: '',
      typeQuestion: 0,
      indexSelectingTL: 0,
    };
  }

  onClickItem = async (index, optionIdAnswer) => {
    await this.setState({ indexSelecting: index, optionIdAnswer: optionIdAnswer || -1, showSelectAnswer: true });
    await this.modalSelectAnswers.setIdAnswer(optionIdAnswer || -1);
    console.log("showSelectAnswer: ", this.state.showSelectAnswer);
    setTimeout(() => {
      this.scrollview.scrollToEnd();
    }, 0)
  };

  onClickItemTL = (index, optionIdAnswer) => { this.setState({ indexSelectingTL: index, optionIdAnswer: optionIdAnswer || -1 }); this.modalSelectAnswers.setIdAnswer(optionIdAnswer || -1) };

  closeModalSelectAnswer = () => {
    this.setState({ showSelectAnswer: false })
  }

  changeTotalQuestion = (totalQuestion) => {
    const { typeQuestion } = this.state;
    if (typeQuestion === 0) {
      this.setState({ totalQuestion, indexSelecting: 0 });
    } else {
      this.setState({ totalQuestionTL: totalQuestion, indexSelectingTL: 0 });
    }
  };

  _onTop = () => {
    try {
      if (this.pdf) {
        this.pdf.setPage(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  _onFullView = (type) => {
    if (type == 1) {
      if (!this.state.urlFileAnswerPDF) {
        this.toast.show('Chưa có tài liệu PDF');
        return;
      }
    } else {
      if (!this.state.urlFilePDF) {
        this.toast.show('Chưa có tài liệu PDF');
        return;
      }
    }
    this.setState({ showModalFullPDF: true, typeShowFullPDF: type });
  };

  getNumColumns = () => {
    return Math.floor((width - 20) / 65);
  };

  onPickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (res) {
        this.setState({
          loadingUpload: true,
        });
        //upload pdf
        const { token } = await dataHelper.getToken();
        if (token) {
          const resSignedUrl = await apiPapers.signedUrlContentPDF({ token });
          if (resSignedUrl) {
            var formData = new FormData();
            formData.append('file', {
              uri: res.uri,
              name: resSignedUrl.fileName,
              type: res.type,
            });

            const resUpload = await apiPapers.uploadPDF({
              url: resSignedUrl.preSignedUrl,
              formData,
            });

            if (resUpload && resUpload.status === 200) {
              this.setState({
                urlFilePDF: resSignedUrl.urlFile,
                loadingUpload: false,
              });
            } else {
              this.toast.show('Tải lên PDF thất bại');
              this.setState({ loadingUpload: false });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      this.toast.show('Tải lên PDF thất bại');
      this.setState({ loadingUpload: false });
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  onPickAnswerPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      let url = res.uri;
      let split = url.split('/');
      let name = split.pop();

      if (res) {
        this.setState({
          loadingUpload: true,
        });
        //upload pdf
        const { token } = await dataHelper.getToken();
        if (token) {
          const resSignedUrl = await apiPapers.signedUrlContentPDF({ token });

          if (resSignedUrl) {
            var formData = new FormData();
            formData.append('file', {
              uri: res.uri,
              name: resSignedUrl.fileName,
              type: res.type,
            });

            const resUpload = await apiPapers.uploadPDF({
              url: resSignedUrl.preSignedUrl,
              formData,
            });

            if (resUpload && resUpload.status === 200) {
              this.setState({
                urlFileAnswerPDF: resSignedUrl.urlFile,
                loadingUpload: false,
              });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  validation = () => {
    try {
      const {
        gradeCode,
        subjectCode,
        name,
        assignmentType,
        duration,
        urlFilePDF,
        urlFileAnswerPDF,
      } = this.state;
      if (!name) {
        this.toast.show('Chưa nhập tên bộ đề!');
        return;
      }
      if (!subjectCode.length) {
        this.toast.show('Chưa chọn môn học!');
        return;
      }
      if (!gradeCode.length) {
        this.toast.show('Chưa chọn khối!');
        return;
      }
      if (assignmentType && !duration) {
        this.toast.show('Chưa nhập thời gian kiểm tra!');
        return;
      }
      const list = this.selectAnswer.getListQuestions();
      if (list.data.length === 0) {
        this.toast.show('Chưa có câu hỏi nào!');
        return;
      }

      if (!urlFilePDF) {
        this.toast.show('Chưa thêm bộ đề!');
        return;
      }

      if (list.totalPoint + list.totalPointTL !== 10) {
        this.toast.show('Tổng điểm chưa bằng 10!');
        return;
      }

      let checkChooseOption = true;
      list.data.map((e) => {
        if (e.optionIdAnswer === -1) {
          checkChooseOption = false;
        }
      });
      if (!checkChooseOption) {
        this.toast.show('Chưa chọn hết đáp án cho câu hỏi!');
        return;
      }
      let checkPointTL = true;
      list.dataTL.map((e) => {
        if (e.point === 0) {
          checkPointTL = false;
        }
      });

      if (!checkPointTL) {
        this.toast.show('Chưa chọn hết điểm cho câu hỏi!');
        return;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  assignmentContent = async () => {
    Keyboard.dismiss();
    let question = [
      ...this.selectAnswer.getListQuestions().data,
      ...this.selectAnswer.getListQuestions().dataTL,
    ];
    if (this.validation()) {
      const {
        gradeCode,
        subjectCode,
        name,
        assignmentType,
        duration,
        urlFilePDF,
        urlFileAnswerPDF,
      } = this.state;
      let body = {
        gradeCode: gradeCode,
        subjectCode: subjectCode,
        status: 'Publish',
        name,
        isShare: true,
        assignmentType,
        duration: assignmentType ? parseInt(duration) * 60 : 300,
        question: question,
        assignmentContentType: 1,
        listFile: [urlFilePDF],
        answerFile: urlFileAnswerPDF,
      };

      const { token } = await dataHelper.getToken();
      if (token) {
        const res = await apiPapers.assignmentContent({ token, body });
        if (res && res.status === 0) {
          this.refToast.show('Tạo bộ đề thành công!');
          setTimeout(() => {
            // this.props.navigation.goBack();
            this.props.navigation.navigate('Assignment', {
              item: { ...res, name: name, id: res.id },
            });
          }, 100);
          // cau hinh thanh cong
          AnalyticsManager.trackWithProperties('School Teacher', {
            action: 'CREATEASSIGNMENT',
            mobile: Platform.OS,
            grade: gradeCode,
            subject: subjectCode,
          });
        }
      }
    }
  };

  onChangeTextName = (text) => {
    this.setState({ name: text });
  };

  onChangeTextDuration = (text) => {
    this.setState({ duration: text });
  };

  onEnediting = () => {
    const { duration } = this.state;
    if (duration === '0') {
      this.setState({ duration: '5' })
    }
  }

  onPressItemSubject = (index) => {
    const { listSubjects } = this.props.navigation.state.params;
    this.setState({ subjectCode: [listSubjects[index].code] });
  };

  onPressItemGrade = (index) => {
    const { listGrades } = this.props.navigation.state.params;
    this.setState({ gradeCode: [listGrades[index].gradeId] });
  };

  onPressItemAssignmentType = (index) => {
    const { assignmentTypes } = this.state;
    this.setState({ assignmentType: assignmentTypes[index].id });
  };

  renderModalFullViewPDF = () => {
    const {
      showModalFullPDF,
      viewFileFDF,
      urlFilePDF,
      urlFileAnswerPDF,
      typeShowFullPDF,
    } = this.state;
    const { urlFile } = this.props.navigation.state.params;

    let uri = urlFile;
    if (typeShowFullPDF == 1) {
      uri = urlFileAnswerPDF || urlFile;
    } else {
      uri = urlFilePDF || urlFile;
    }

    return (
      <Modal animationType="fade" transparent={true} visible={showModalFullPDF}>
        <View style={{ flex: 1 }}>
          <Pdf
            ref={(ref) => (this.pdfFull = ref)}
            source={{
              uri: uri,
              cache: true,
            }}
            onLoadComplete={(numberOfPages, filePath) => { }}
            onError={(error) => {
              console.log(error);
            }}
            style={styles.pdf}
          />
          {/* <View>
            <TouchableOpacity
              style={styles.buttomTop}
              onPress={() => {
                try {
                  this.pdfFull.setPage(1);
                } catch (error) { }
              }}>
              <Image
                source={require('../../../asserts/appIcon/icUp.png')}
                resizeMode="contain"
                style={{ height: 8, width: 8 }}
              />
              <Text style={{ color: '#fff', fontSize: 8, textAlign: 'center' }}>
                TOP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnZoomPDF}
              onPress={() => {
                this.setState({ showModalFullPDF: false });
              }}>
              <Ionicons
                name={'md-close'}
                size={20}
                color={'white'}
                style={{ marginTop: 2, marginStart: 1 }}
              />
            </TouchableOpacity>
          </View> */}
        </View>
      </Modal>
    );
  };

  _hideKeybroad = () => Keyboard.dismiss();

  onSelectAnswer = (answer) => {
    console.log("UPloadPDF: ", answer);
    this.selectAnswer.onSelectAnswer(answer);
  }

  render() {
    const {
      listGrades,
      listSubjects,
      urlFile,
    } = this.props.navigation.state.params;
    const {
      urlFilePDF,
      urlFileAnswerPDF,
      totalQuestion,
      totalQuestionTL,
      assignmentTypes,
      visibleViewAnswer,
      loadingUpload,
      name,
      assignmentType,
      duration,
      viewFileFDF,
      typeQuestion,
    } = this.state;
    const numColumns = this.getNumColumns();
    const urlPdf = (viewFileFDF && urlFilePDF) || urlFileAnswerPDF || urlFile;
    console.log("render UPLOADPDF: ", this.state.indexSelecting);
    return (
      <SafeAreaView style={styles.container}>
        {/* start header */}
        <HeaderPaper
          title={'Câu Hỏi PDF'}
          navigation={this.props.navigation}
          color={'#979797'}
          onRightAction={this.assignmentContent}
          iconColor='#000'
        />
        {/* <View style={styles.topheader}>
          <RippleButton
            style={{ marginTop: 3, marginLeft: 3 }}
            onPress={() => {
              // Globals.updatePaper();
              this.props.navigation.goBack();
            }}>
            <MaterialCommunityIcons name="arrow-left" color="#FFF" size={23} />
          </RippleButton>
          <View
            pointerEvents="none"
            style={{
              alignItems: 'center',
              flex: 1,
              position: 'absolute',
              width,
            }}>
            <Text style={styles.txtTitle}>Câu Hỏi PDF</Text>
          </View>
          <TouchableOpacity
            style={styles.rightHeader}
            onPress={this.assignmentContent}>
            <Text style={styles.txtRightHeader}>Tạo bộ đề</Text>
          </TouchableOpacity>
        </View> */}
        {/* End header */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10 }} ref={ref => this.scrollview = ref}>
          {/* start create Upload PDF */}
          <TouchableWithoutFeedback onPress={() => { this._hideKeybroad(); this.closeModalSelectAnswer() }}>
            <View>
              <View
                style={[styles.bodyHeader, { flex: 1 }]}>
                <View
                  style={{
                    flex: 1,
                    // paddingStart: width * 0.24,
                  }}>
                  <TextInput
                    value={name}
                    onChangeText={this.onChangeTextName}
                    numberOfLines={1}
                    returnKeyType={'done'}
                    placeholder={'Nhập tên bài kiểm tra'}
                    placeholderTextColor={'#BDBDBD'}
                    style={styles.inputName}
                  />
                  <Text>Môn học</Text>
                  <Dropdown
                    containerStyle={{
                      marginHorizontal: 0,
                    }}
                    contentStyle={{ marginHorizontal: 0, borderWidth: 1, borderColor: '#C4C4C4', width: '100%' }}
                    title="Môn Học"
                    data={listSubjects}
                    onPressItem={(index) => this.onPressItemSubject(index)}
                  />
                  <Text>Khối lớp</Text>
                  <Dropdown
                    contentStyle={{ marginHorizontal: 0, borderWidth: 1, borderColor: '#C4C4C4', width: '100%' }}
                    title="Khối lớp"
                    data={listGrades}
                    onPressItem={(index) => this.onPressItemGrade(index)}
                  />
                  <Text>Dạng bài</Text>
                  <Dropdown
                    contentStyle={{ marginHorizontal: 0, borderWidth: 1, borderColor: '#C4C4C4', width: '100%' }}
                    title="Dạng Bài"
                    data={assignmentTypes}
                    indexSelected={0}
                    onPressItem={(index) =>
                      this.onPressItemAssignmentType(index)
                    }
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingBottom: 0,
                      marginTop: 10,
                    }}>
                    <View>
                      {assignmentType ? (
                        <View style={{ flex: 1, marginBottom: 10, }}>
                          <TextInput
                            value={duration}
                            onChangeText={this.onChangeTextDuration}
                            numberOfLines={1}
                            returnKeyType={'done'}
                            keyboardType={'decimal-pad'}
                            maxLength={4}
                            placeholder={'Nhập thời gian'}
                            placeholderTextColor={'#BDBDBD'}
                            style={styles.inputName}
                            onEndEditing={() => this.onEnediting()}
                          />
                          <Text style={styles.textMinutes}>Phút</Text>
                        </View>
                      ) : null}
                      {/* <TouchableOpacity
                      onPress={this.onPickPDF}
                      style={[styles.btnAddPDF]}>
                      <Text style={styles.txtAddPDF}>
                        {urlFilePDF ? 'Đổi' : 'Thêm'} bộ đề PDF
                      </Text>
                    </TouchableOpacity> */}
                      <Text
                        style={{
                          fontFamily: 'Nunito-Bold',
                          fontSize: 12,
                          color: '#fff',
                          borderRadius: 1,
                          marginTop: 10,
                        }}>
                        Loại bài tập
                    </Text>
                      <View style={styles.wrapButtonType}>
                        <TouchableOpacity
                          onPress={() => this.setState({ typeQuestion: 0 })}
                          style={[
                            styles.btnChooseType,
                            this.state.typeQuestion === 0 && {
                              backgroundColor: '#2D9CDB',
                            },
                          ]}>
                          <Text
                            style={[
                              this.state.typeQuestion === 0
                                ? styles.txtActive
                                : styles.txtNoActive,
                            ]}>
                            Trắc nghiệm
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.setState({ typeQuestion: 1 })}
                          style={[
                            styles.btnChooseType, { left: 5 },
                            this.state.typeQuestion === 1 && {
                              backgroundColor: '#2D9CDB',
                            },
                          ]}>
                          <Text
                            style={[
                              this.state.typeQuestion === 1
                                ? styles.txtActive
                                : styles.txtNoActive,
                            ]}>
                            Tự luận
                        </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.wrapAreaUploadPDF}>
                        <View>
                          <Text>Bộ đề PDF</Text>
                          <View style={styles.wrapMiniPDF}>
                            {!!urlFilePDF && <Pdf
                              ref={(ref) => (this.pdf = ref)}
                              source={{ uri: urlFilePDF, cache: true }}
                              onLoadComplete={(numberOfPages, filePath) => { }}
                              onError={(error) => {
                                console.log(error);
                              }}
                              style={styles.pdf}
                            />}
                            <View style={styles.wrapEndAreaUploadPDF}>
                              <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={() => { this._onFullView(0) }}>
                                <Image source={AppIcon.search_pdf} />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={this.onPickPDF}>
                                <Image source={AppIcon.pencil_pdf} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <View>
                          <Text>Lời giải</Text>
                          <View style={styles.wrapMiniPDF}>
                            {!!urlFileAnswerPDF && <Pdf
                              ref={(ref) => (this.pdf = ref)}
                              source={{ uri: urlFileAnswerPDF, cache: true }}
                              onLoadComplete={(numberOfPages, filePath) => { }}
                              onError={(error) => {
                                console.log(error);
                              }}
                              style={styles.pdf}
                            />}
                            <View style={styles.wrapEndAreaUploadPDF}>
                              <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={() => { this._onFullView(1) }}>
                                <Image source={AppIcon.search_pdf} />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={this.onPickAnswerPDF}>
                                <Image source={AppIcon.pencil_pdf} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', alignSelf: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <View style={{ borderWidth: 0.5, height: 0, borderColor: '#C4C4C4', width: '10%' }} />
                    <Text style={styles.txtNoteUploadPDF}>
                      Lưu ý! Bộ đề và đáp án file PDF. Dung lượng không quá 5MB!
                  </Text>
                    <View style={{ borderWidth: 0.5, height: 0, borderColor: '#C4C4C4', width: '10%' }} />
                  </View>
                </View>

                {/* <TouchableOpacity
                  onPress={this.onPickAnswerPDF}
                  style={styles.btnAddPDF}>
                  <Text style={styles.txtAddPDF}>
                    {urlFileAnswerPDF ? 'Đổi' : 'Thêm'} lời giải PDF
                      </Text>
                </TouchableOpacity> */}
              </View>
              <View style={styles.wrapTotalQsNPoint}>
                <View>
                  <SelectAnswer
                    ref={(ref) => (this.selectAnswer = ref)}
                    isVisible={visibleViewAnswer}
                    numColumns={numColumns}
                    totalQuestion={totalQuestion}
                    totalQuestionTL={totalQuestionTL}
                    typeQuestion={typeQuestion}
                    assignmentType={assignmentType}
                    totalQuestion={
                      typeQuestion === 0 ? totalQuestion : totalQuestionTL
                    }
                    onClickItem={this.onClickItem}
                    onClickItemTL={this.onClickItemTL}
                    onChange={this.changeTotalQuestion}
                    indexSelecting={this.state.indexSelecting}
                    indexSelectingTL={this.state.indexSelectingTl}
                    showSelectAnswer={this.state.showSelectAnswer}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* End create Upload PDF */}

          {/* Start setting question */}
          <View style={{ flex: 1, backgroundColor: '#FFF', }}>
            {/* <TouchableOpacity
              onPress={() => {
                this.setState({ visibleViewAnswer: !visibleViewAnswer });
              }}
              style={styles.btnEnterAnswer}>
              <Text style={styles.txtEnterAnswer}>Nhập đáp án</Text>
              <Ionicons
                name={visibleViewAnswer ? 'ios-chevron-down' : 'ios-chevron-up'}
                size={20}
                color="#000"
              />
            </TouchableOpacity> */}

            {/* <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                marginVertical: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (!viewFileFDF) {
                    this.setState({ viewFileFDF: true });
                  }
                }}
                style={[styles.btnShowPDF, { marginEnd: 4 }]}>
                <View style={styles.dotViewPDF}>
                  {viewFileFDF ? (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#0091EA',
                      }}
                    />
                  ) : null}
                </View>
                <Text style={styles.txtShowPDF}>Xem bộ đề</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (viewFileFDF) {
                    this.setState({ viewFileFDF: false });
                  }
                }}
                style={[styles.btnShowPDF, { marginStart: 4 }]}>
                <View style={styles.dotViewPDF}>
                  {!viewFileFDF ? (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#0091EA',
                      }}
                    />
                  ) : null}
                </View>
                <Text style={styles.txtShowPDF}>Xem lời giải</Text>
              </TouchableOpacity>
            </View> */}
            <View style={[styles.viewPdf, { paddingBottom: this.state.showSelectAnswer ? 160 : 0 }]}></View>
            {/* <View style={[styles.viewPdf, { paddingBottom: this.state.showSelectAnswer ? 160 : 0 }]}>
              <View style={{ flex: 1 }}>
                {viewFileFDF ?
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    {urlFilePDF ? <View style={{ flex: 1, }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            urlFilePDF: '',
                            urlFile: '',
                            loadingUpload: false,
                          });
                        }}
                        style={{ alignSelf: 'flex-end', marginRight: '15%' }}>
                        <Image source={AppIcon.icon_close_modal} />
                      </TouchableOpacity>
                      <Pdf
                        ref={(ref) => (this.pdf = ref)}
                        source={{ uri: urlFilePDF, cache: true }}
                        onLoadComplete={(numberOfPages, filePath) => { }}
                        onError={(error) => {
                          console.log(error);
                        }}
                        style={styles.pdf}
                      />
                      <View>
                        <TouchableOpacity
                          style={styles.buttomTop}
                          onPress={this._onTop}>
                          <Image
                            source={require('../../../asserts/appIcon/icUp.png')}
                            resizeMode="contain"
                            style={{ height: 8, width: 8 }}
                          />
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 8,
                              textAlign: 'center',
                            }}>
                            TOP
                      </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.btnZoomPDF}
                          onPress={this._onFullView}>
                          <Image
                            source={require('../../../asserts/icon/ic_full_pdf.png')}
                            resizeMode="contain"
                            style={{ height: 16, width: 16 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                      :
                      <View>
                        {loadingUpload ? (
                          <View>
                            <ActivityIndicator />
                            <Text style={styles.txtUploadingPDF}>
                              Đang tải lên file PDF...
                      </Text>
                          </View>
                        ) : (
                            <></>
                          )}
                      </View>}
                  </View>
                  :
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    {urlFileAnswerPDF ? <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            urlFileAnswerPDF: '',
                            loadingUpload: false,
                          });
                        }}
                        style={{ alignSelf: 'flex-end', marginRight: '15%' }}>
                        <Image source={AppIcon.icon_close_modal} />
                      </TouchableOpacity>
                      <Pdf
                        ref={(ref) => (this.pdf = ref)}
                        source={{ uri: urlFileAnswerPDF, cache: true }}
                        onLoadComplete={(numberOfPages, filePath) => { }}
                        onError={(error) => {
                          console.log(error);
                        }}
                        style={styles.pdf}
                      />
                      <View>
                        <TouchableOpacity
                          style={styles.buttomTop}
                          onPress={this._onTop}>
                          <Image
                            source={require('../../../asserts/appIcon/icUp.png')}
                            resizeMode="contain"
                            style={{ height: 8, width: 8 }}
                          />
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 8,
                              textAlign: 'center',
                            }}>
                            TOP
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.btnZoomPDF}
                          onPress={this._onFullView}>
                          <Image
                            source={require('../../../asserts/icon/ic_full_pdf.png')}
                            resizeMode="contain"
                            style={{ height: 16, width: 16 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                      :
                      <View style={{ alignItems: 'center' }}>
                        {loadingUpload ? (
                          <View>
                            <ActivityIndicator />
                            <Text style={styles.txtUploadingPDF}>
                              Đang tải lên file PDF...
                            </Text>
                          </View>
                        ) : (
                            <Text style={styles.txtNotAdd}>
                              {viewFileFDF ? 'Chưa thêm bộ đề' : 'Chưa thêm lời giải'}
                            </Text>
                          )}
                      </View>}
                  </View>
                }
              </View>
            </View> */}
          </View>
          {/* End setting question */}
        </ScrollView>
        <ModalSelectAnswers
          ref={(ref) => { this.modalSelectAnswers = ref }}
          indexSelecting={this.state.indexSelecting}
          indexSelectingTL={this.state.indexSelectingTL}
          onSelectAnswer={this.onSelectAnswer}
          optionIdAnswer={this.state.optionIdAnswer}
          showSelectAnswer={this.state.showSelectAnswer}
          close={this.closeModalSelectAnswer}
        />
        <Toast ref={ref => this.refToast = ref} position={'bottom'} />
        {this.renderModalFullViewPDF()}
        <Toast ref={(ref) => (this.toast = ref)} position={'bottom'} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    // backgroundColor: '#56CCF2',
  },
  imgHeader: {
    width: width * 0.24,
    height: 0 + width * 0.35,
    position: 'absolute',
    bottom: 0,
    left: 16,
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
    marginEnd: 16,
  },
  totalAddQuestion: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#828282',
  },
  buttomTop: {
    backgroundColor: '#0091EA',
    marginTop: 20,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    right: 16,
    bottom: 48 + getBottomSpace(),
    height: 24,
    width: 24,
  },
  txtRightHeader: {
    paddingHorizontal: 13,
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
  },
  btnAnswer: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
  },
  txtAnswer: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#828282',
  },
  txtNotAdd: {
    color: '#FF6213',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  viewPdf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  btnZoomPDF: {
    backgroundColor: 'rgba(47, 47, 46, 0.5)',
    marginTop: 20,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    right: 16,
    bottom: 16 + getBottomSpace(),
    height: 24,
    width: 24,
  },
  txtUploadingPDF: {
    marginTop: 10,
    marginVertical: 3,
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  txtEnterAnswer: {
    marginVertical: 3,
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  btnEnterAnswer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 15,
  },
  txtNoteUploadPDF: {
    marginVertical: 3,
    color: '#FF0000',
    fontFamily: 'Nunito-Regular',
    fontSize: 9,
    textAlign: 'center',
  },
  btnAddPDF: {
    width: width / 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnChooseType: {
    width: width / 3,
    backgroundColor: '#C4C4C4',
    borderRadius: 2,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  txtAddPDF: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
  },
  txtNoActive: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  txtActive: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  inputName: {
    height: 24,
    backgroundColor: '#fff',
    color: '#828282',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    paddingStart: 5,
    marginBottom: 7,
    borderRadius: 1,
    paddingVertical: 0,
    borderColor: '#C4C4C4',
    borderWidth: 1,
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
  viewPointAndOption: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 16,
    marginBottom: 0,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#C4C4C4',
  },
  btnShowPDF: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#0091EA',
    height: 30,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f1fa',
  },
  txtShowPDF: {
    marginStart: 8,
    color: '#0091EA',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  dotViewPDF: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#0091EA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  viewPosition: {
    position: 'absolute',
    // backgroundColor: '#56CCF2',
    width,
    height: height / 2,
    zIndex: -1,
  },
  textMinutes: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '400',
    position: 'absolute',
    left: 130,
    top: 5
  },
  wrapButtonType: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#C4C4C4',
    width: 0.9 * width,
  },
  wrapAreaUploadPDF: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 0.9 * width,
    height: 100,
    justifyContent: 'space-between',
    marginTop: 10
  },
  wrapMiniPDF: {
    width: 150,
    height: 80,
    borderWidth: 0.5,
    backgroundColor: 'rgba(86, 204, 242, 0.1)',
    borderColor: '#56CCF2',
    borderRadius: 5,
  },
  wrapEndAreaUploadPDF: {
    position: 'absolute',
    width: '100%',
    bottom: 6,
    height: 20,
    flexDirection: 'row-reverse',
    zIndex: 2
  },
  buttonInSideAreaUploadPDF: {
    height: 20,
    width: 34,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    borderWidth: .5,
    borderColor: '#56CCF2',
    backgroundColor: '#FFFFFF'
  },
  // wrapTotalQsNPoint: {
  //   width: 0.9 * width,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   alignSelf: 'center',
  // }
});
