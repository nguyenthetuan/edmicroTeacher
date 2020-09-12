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
    };
  }

  changeTotalQuestion = (totalQuestion) => {
    const { typeQuestion } = this.state;
    if (typeQuestion === 0) {
      this.setState({ totalQuestion }, () => {
        this.selectAnswer.onResetIndexSelect();
      });
    } else {
      this.setState({ totalQuestionTL: totalQuestion }, () => {
        this.selectAnswer.onResetIndexSelectTL();
      });
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

  _onFullView = () => {
    this.setState({ showModalFullPDF: true });
  };

  getNumColumns = () => {
    return Math.floor((width - 16) / 46);
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
        console.log('body', body);
        const res = await apiPapers.assignmentContent({ token, body });
        console.log('res', res);
        if (res && res.status === 0) {
          // this.toast.show('Tạo bộ đề thành công!');
          setTimeout(() => {
            // this.props.navigation.goBack();
            this.props.navigation.navigate('Assignment', {
              item: { ...res, name: name },
              checked: true,
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
    } = this.state;
    const { urlFile } = this.props.navigation.state.params;
    return (
      <Modal animationType="fade" transparent={true} visible={showModalFullPDF}>
        <View style={{ flex: 1 }}>
          <Pdf
            ref={(ref) => (this.pdfFull = ref)}
            source={{
              uri: (viewFileFDF ? urlFilePDF : urlFileAnswerPDF) || urlFile,
              cache: true,
            }}
            onLoadComplete={(numberOfPages, filePath) => { }}
            onError={(error) => {
              console.log(error);
            }}
            style={styles.pdf}
          />
          <View>
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
          </View>
        </View>
      </Modal>
    );
  };

  _hideKeybroad = () => Keyboard.dismiss();

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
      <View style={styles.container}>
        {/* start header */}
        <View style={styles.topheader}>
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
        </View>
        {/* End header */}
        <View style={styles.viewPosition} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* start create Upload PDF */}
          <TouchableWithoutFeedback onPress={this._hideKeybroad}>
            <View
              style={[styles.bodyHeader, { height: assignmentType ? 300 : 250 }]}>
              <Image
                source={require('../../../asserts/appIcon/headerQuestion.png')}
                resizeMode="contain"
                style={styles.imgHeader}
              />
              <View
                style={{
                  flex: 1,
                  paddingStart: width * 0.24,
                }}>
                <TextInput
                  value={name}
                  onChangeText={this.onChangeTextName}
                  numberOfLines={1}
                  returnKeyType={'done'}
                  placeholder={'Nhập tên bộ đề'}
                  placeholderTextColor={'#BDBDBD'}
                  style={styles.inputName}
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
                    <Dropdown
                      containerStyle={{
                        flex: 1,
                        marginHorizontal: 0,
                      }}
                      contentStyle={{ marginHorizontal: 0 }}
                      title="Môn Học"
                      data={listSubjects}
                      onPressItem={(index) => this.onPressItemSubject(index)}
                    />
                    <Dropdown
                      contentStyle={{ marginHorizontal: 0 }}
                      containerStyle={{ flex: 1, marginHorizontal: 0 }}
                      title="Khối"
                      data={listGrades}
                      onPressItem={(index) => this.onPressItemGrade(index)}
                    />
                    {assignmentType ? (
                      <View style={{ flex: 1, marginBottom: 10 }}>
                        <Text
                          style={{
                            fontFamily: 'Nunito-Bold',
                            fontSize: 12,
                            color: '#fff',
                            borderRadius: 1,
                          }}>
                          Thời gian(phút)
                        </Text>
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
                        />
                      </View>
                    ) : null}
                    <TouchableOpacity
                      onPress={this.onPickPDF}
                      style={[styles.btnAddPDF]}>
                      <Text style={styles.txtAddPDF}>
                        {urlFilePDF ? 'Đổi' : 'Thêm'} bộ đề PDF
                      </Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity
                      onPress={() => this.setState({ typeQuestion: 0 })}
                      style={[
                        styles.btnAddPDF,
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
                  </View>
                  <View>
                    <Dropdown
                      contentStyle={{ marginHorizontal: 0 }}
                      containerStyle={{ flex: 1 }}
                      title="Dạng Bài"
                      data={assignmentTypes}
                      indexSelected={0}
                      onPressItem={(index) =>
                        this.onPressItemAssignmentType(index)
                      }
                    />
                    <InputNumberQuestion
                      containerStyle={[
                        { flex: 1, marginBottom: 25 },
                        assignmentType && { marginBottom: 80 },
                      ]}
                      title="Số câu"
                      totalQuestion={
                        typeQuestion === 0 ? totalQuestion : totalQuestionTL
                      }
                      onChange={this.changeTotalQuestion}
                    />
                    <TouchableOpacity
                      onPress={this.onPickAnswerPDF}
                      style={styles.btnAddPDF}>
                      <Text style={styles.txtAddPDF}>
                        {urlFileAnswerPDF ? 'Đổi' : 'Thêm'} lời giải PDF
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ typeQuestion: 1 })}
                      style={[
                        styles.btnAddPDF,
                        { marginTop: 26 },
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
                </View>
                <Text style={styles.txtNoteUploadPDF}>
                  Lưu ý! Bộ đề và đáp án file PDF. Dung lượng không quá 5MB!
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* End create Upload PDF */}

          {/* Start setting question */}
          <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ visibleViewAnswer: !visibleViewAnswer });
              }}
              style={styles.btnEnterAnswer}>
              <Text style={styles.txtEnterAnswer}>Nhập đáp án</Text>
              <Ionicons
                name={visibleViewAnswer ? 'ios-arrow-down' : 'ios-arrow-up'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
            <SelectAnswer
              ref={(ref) => (this.selectAnswer = ref)}
              isVisible={visibleViewAnswer}
              numColumns={numColumns}
              totalQuestion={totalQuestion}
              totalQuestionTL={totalQuestionTL}
              typeQuestion={typeQuestion}
            />
            <View
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
            </View>
            <View style={[styles.viewPdf, { height: height / 2 }]}>
              {urlPdf ? (
                <View style={{ flex: 1 }}>
                  {viewFileFDF ?
                    <>
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
                    </>
                    :
                    <>
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
                    </>
                  }
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
              ) : (
                  <View>
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
                  </View>
                )}
            </View>
          </View>
          {/* End setting question */}
        </ScrollView>

        {this.renderModalFullViewPDF()}
        <Toast ref={(ref) => (this.toast = ref)} position={'bottom'} />
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
    backgroundColor: '#56CCF2',
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
    height: 170,
    backgroundColor: '#56CCF2',
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
    width,
    flex: 1,
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
  txtAddPDF: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
  },
  txtNoActive: {
    color: '#C4C4C4',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
  },
  txtActive: {
    color: '#fff',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
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
    backgroundColor: '#56CCF2',
    width,
    height: height / 2,
    zIndex: -1,
  },
});
