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
      pdfFile: '',
      pdfFileTL: ''
    };
  }

  onClickItem = async (index, optionIdAnswer, point) => {
    await this.setState({ indexSelecting: index, optionIdAnswer: optionIdAnswer || -1, showSelectAnswer: true, currentPoint: point });
    await this.modalSelectAnswers.setIdAnswer(optionIdAnswer || -1);
    setTimeout(() => {
      this.scrollview.scrollToEnd();
    }, 0)
  };

  onClickItemTL = (index, optionIdAnswer, point) => { this.setState({ indexSelectingTL: index, optionIdAnswer: optionIdAnswer || -1, currentPoint: point }); this.modalSelectAnswers.setIdAnswer(optionIdAnswer || -1) };

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
    this.props.navigation.navigate('FullViewPDFAssessment', { urlFilePDF: type === 1 ? this.state.urlFileAnswerPDF : this.state.urlFilePDF, text: type == 1 ? 'Lời Giải' : 'Bộ đề PDF' });
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
        let url = res.uri;
        let split = url.split('/');
        let name = split.pop();
        this.setState({
          loadingUpload: true,
          pdfFile: name,
        });
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


      if (res) {
        let url = res.uri;
        let split = url.split('/');
        let name = split.pop();
        this.setState({
          loadingUpload: true,
          pdfFileTL: name,
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
      if (assignmentType && duration && duration < 1) {
        this.toast.show('Thời gian kiểm tra phải lớn hơn 1 phút!');
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

  onTextPointModalChange = (point) => {
    this.setState({ currentPoint: point });
    this.selectAnswer.onChangePoint(point);
  }

  onTextPointModalEdit = (point) => {
    this.selectAnswer.editPoint();
  }

  _hideKeybroad = () => Keyboard.dismiss();

  onSelectAnswer = (answer) => {
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
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView />
        <SafeAreaView style={styles.container}>
          {/* start header */}
          <HeaderPaper
            title={'Câu Hỏi PDF'}
            navigation={this.props.navigation}
            color={'#979797'}
            onRightAction={this.assignmentContent}
            iconColor='#000'
            notRightButton={true}
            marginLeft={-25}
          />
          <TouchableOpacity
            style={styles.buttonCreateAssessment}
            onPress={this.assignmentContent}
          >
            <Text style={styles.textCreateAssessment}>Tạo bộ đề</Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20 }}
            ref={ref => this.scrollview = ref}
          >
            {/* start create Upload PDF */}
            <TouchableWithoutFeedback onPress={() => { this._hideKeybroad(); this.closeModalSelectAnswer() }}>
              <View>
                <View style={[styles.bodyHeader, { flex: 1 }]}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      value={name}
                      onChangeText={this.onChangeTextName}
                      numberOfLines={1}
                      returnKeyType={'done'}
                      placeholder={'Nhập tên bài kiểm tra'}
                      placeholderTextColor={'#BDBDBD'}
                      style={styles.inputName}
                    />
                    <Text style={styles.styTxtLabel}>Môn học</Text>
                    <Dropdown
                      containerStyle={{
                        marginHorizontal: 0,
                      }}
                      contentStyle={styles.styTxtPlace}
                      title="Môn học"
                      data={listSubjects}
                      onPressItem={(index) => this.onPressItemSubject(index)}
                    />
                    <Text style={styles.styTxtLabel}>Khối lớp</Text>
                    <Dropdown
                      contentStyle={styles.styTxtPlace}
                      title="Khối lớp"
                      data={listGrades}
                      onPressItem={(index) => this.onPressItemGrade(index)}
                    />
                    <Text style={styles.styTxtLabel}>Dạng bài</Text>
                    <Dropdown
                      contentStyle={styles.styTxtPlace}
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
                              style={[styles.inputName, { width: 80 }]}
                              onEndEditing={() => this.onEnediting()}
                            />
                            <Text style={styles.textMinutes}>Phút</Text>
                          </View>
                        ) : null}
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
                            <Text style={{ top: -5, fontWeight: 'Nunito', fontSize: 14, fontWeight: '700' }}>Bộ đề PDF</Text>
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
                            <Text maxLength={20} numberOfLines={1} ellipsizeMode="tail" style={{ fontFamily: 'Nunito', fontSize: 12, fontWeight: '400', color: '#2D9CDB', maxWidth: 130 }}>{this.state.pdfFile}</Text>
                          </View>
                          <View>
                            <Text style={{ top: -5, fontWeight: 'Nunito', fontSize: 14, fontWeight: '700' }}>Lời giải</Text>
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
                            <Text maxLength={20} numberOfLines={1} ellipsizeMode="tail" style={{ fontFamily: 'Nunito', fontSize: 12, fontWeight: '400', color: '#2D9CDB', maxWidth: 100 }}>{this.state.pdfFileTL}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', alignSelf: 'center', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 }}>
                      <View style={{ borderWidth: 0.5, height: 0, borderColor: '#C4C4C4', width: '10%' }} />
                      <Text style={styles.txtNoteUploadPDF}>
                        Lưu ý! Bộ đề và đáp án file PDF. Dung lượng không quá 5MB!
                  </Text>
                      <View style={{ borderWidth: 0.5, height: 0, borderColor: '#C4C4C4', width: '10%' }} />
                    </View>
                  </View>
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
            <View style={{ flex: 1, backgroundColor: '#FFF', }}>
              <View style={[styles.viewPdf, { paddingBottom: this.state.showSelectAnswer ? 160 : 0 }]}></View>
            </View>
          </ScrollView>
          <ModalSelectAnswers
            ref={(ref) => { this.modalSelectAnswers = ref }}
            indexSelecting={this.state.indexSelecting}
            indexSelectingTL={this.state.indexSelectingTL}
            onSelectAnswer={this.onSelectAnswer}
            optionIdAnswer={this.state.optionIdAnswer}
            showSelectAnswer={this.state.showSelectAnswer}
            close={this.closeModalSelectAnswer}
            onChangeText={this.onTextPointModalChange}
            onEndEditing={this.onTextPointModalEdit}
            currentPoint={this.state.currentPoint}
          />
          <Toast ref={ref => this.refToast = ref} position={'bottom'} />
          {/* {this.renderModalFullViewPDF()} */}
          <Toast ref={(ref) => (this.toast = ref)} position={'bottom'} />
          {loadingUpload &&
            <View>
              <ActivityIndicator />
              <Text style={styles.txtUploadingPDF}>Đang tải lên file PDF...</Text>
            </View>}
        </SafeAreaView>
      </View>
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
  bodyHeader: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  txtUploadingPDF: {
    marginTop: 10,
    marginVertical: 3,
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  txtNoteUploadPDF: {
    marginVertical: 3,
    color: '#FF0000',
    fontFamily: 'Nunito-Regular',
    fontSize: 9,
    textAlign: 'center',
  },
  btnChooseType: {
    width: width / 3,
    backgroundColor: '#C4C4C4',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
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
    height: 30,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    paddingStart: 5,
    marginBottom: 7,
    borderRadius: 2,
    paddingVertical: 10,
    borderColor: '#C4C4C4',
    borderWidth: 1,
  },
  textMinutes: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '400',
    position: 'absolute',
    left: 90,
    top: 5
  },
  wrapButtonType: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#C4C4C4',
    width: 0.9 * width,
    top: -30
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
  buttonCreateAssessment: {
    borderRadius: 5,
    backgroundColor: '#F49A31',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    right: 16,
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  textCreateAssessment: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#fff',
  },
  styTxtLabel: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 5
  },
  styTxtPlace: {
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    width: '100%',
    height: 30,
    borderRadius: 2,
    marginBottom: 10
  }
});
