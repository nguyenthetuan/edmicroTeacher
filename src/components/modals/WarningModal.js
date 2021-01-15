import React, { Component } from 'react';
import {
  View,
  Text,
  Picker,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import jwtDecode from 'jwt-decode';
import FrameModal from '../modals/coreloop/FrameLoopVn';
import HeaderModal from '../modals/coreloop/HeaderLoop';
import RNPickerSelect from 'react-native-picker-select';
import global from '../../utils/Globals';
import dataHelper from '../../utils/dataHelper';
import apiService from '../../services/apiPracticeHelper';
import PickerUtils from '../../utils/PickerUtils';
import AppIcon from '../../utils/AppIcon';
import { alertMessage } from '../../utils/Alert';
import { RFFonsize } from '../../utils/Fonts';
import { styles } from 'react-native-material-ripple/styles';
const { width, height } = Dimensions.get('window');
export default class WarningModal extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      isLoading: false,
      detail: {},
      typeError: 0,
      text: '',
      isMouting: false,
      avatarSource: null,
      file: null,
      visible: false,
      isButtonVisible: true,
      isShow: true,
      warningList: [
        {
          label: 'Nội dung câu hỏi sai',
          value: 0,
        },
        {
          label: 'Đáp án câu hỏi sai',
          value: 1,
        },
        {
          label: 'Hình ảnh bị lỗi',
          value: 2,
        },
        {
          label: 'Video sai nội dung',
          value: 3,
        },
      ],
    };
    global.setModalWarning = this.setModalWarning.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      visible,
      detail,
      text,
      isLoading,
      typeError,
      isMouting,
      isButtonVisible,
      isShow,
    } = this.state;
    if (this.props.visible != nextProps.visible) {
      return true;
    }
    if (this.props.numberQuestion != nextProps.numberQuestion) {
      return true;
    }
    if (visible != nextState.visible) {
      return true;
    }
    if (detail != nextState.detail) {
      return true;
    }
    if (isLoading != nextState.isLoading) {
      return true;
    }
    if (text != nextState.text) {
      return true;
    }
    if (typeError != nextState.typeError) {
      return true;
    }
    if (isMouting != nextState.isMouting) {
      return true;
    }
    if (isButtonVisible != nextState.isButtonVisible) {
      return true;
    }
    if (isShow != nextState.isShow) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.setState({
      isMouting: true,
    });
  }

  showModal = () => {
    if (!this.state.visible) {
      this.setState({ visible: true });
    }
  };

  hideModal = () => {
    if (this.state.visible) {
      this.setState({ visible: false });
    }
  };

  onLoadEnd() {
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 2000);
  }

  setModalWarning(bolean) {
    this.setState({
      modalVisible: bolean,
    });
  }

  sendError() {
    const { text, typeError } = this.state;
    if (text.trim() === '') {
      Alert.alert(
        'Thông báo',
        'Nội dung không được để trống',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({ text: '' });
            },
          },
        ],
        { cancelable: false },
      );
    } else if (text.length < 12 && text !== '') {
      Alert.alert(
        'Thông báo',
        'Nội dung phải bao gồm ít nhất 12 kí tự',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ],
        { cancelable: false },
      );
    } else {
      const error = typeError;
      const file = this.state.file;
      const contentReport = text;
      const numberQuestion = this.props.numberQuestion;
      const subjectId = this.props.subjectId;
      if (this.state.typeError == null) {
        alertMessage('', 'Bạn chưa chọn kiểu lỗi !');
        return;
      }
      dataHelper
        .getToken()
        .then(({ token }) => {
          const gradeId = jwtDecode(token).GradeId;
          this.setState(
            {
              isButtonVisible: false,
            },
            () => {
              apiService
                .postWarningReport(
                  token,
                  contentReport,
                  error,
                  file,
                  gradeId,
                  numberQuestion,
                  subjectId,
                )
                .then(response => {
                  const { msg, status } = response;
                  if (msg === 'OK' && status === 200) {
                    this.setState(
                      {
                        text: '',
                        avatarSource: '',
                        isButtonVisible: true,
                        file: null,
                      },
                      () => {
                        Alert.alert(
                          'Thông báo',
                          'Cảm ơn bạn đã gửi thông báo lỗi',
                          [
                            {
                              text: 'OK',
                              onPress: () => {
                                this.setState({
                                  text: '',
                                  isButtonVisible: true,
                                });
                                this.hideModal();
                              },
                            },
                          ],
                          { cancelable: false },
                        );
                      },
                    );
                  } else {
                    this.setState({
                      isButtonVisible: true,
                    });
                  }
                })
                .catch(err => console.log(err));
            },
          );
        })
        .catch(err => console.log(err));
    }
  }

  showChooseImage() {
    PickerUtils.showSelectImage((source, file) => {
      this.setState({
        avatarSource: source,
        file,
      });
    });
  }

  render() {
    return (
      <FrameModal
        color={'white'}
        visible={this.state.visible}
        hideModal={() => {
          this.setState({ text: '', isButtonVisible: true });
          this.hideModal();
        }}
        screen>
        <StatusBar barStyle={'dark-content'} />
        <HeaderModal
          hideModal={() => {
            this.setState({ text: '', isButtonVisible: true });
            this.hideModal();
          }}
          title={`Báo lỗi câu hỏi`}
          color={'#000'}
          bgColor={'#FFF'}
        />
        <View backgroundColor={'#FFF'} style={{ width, height }}>
          <ScrollView scrollEnabled={false} style={styles1.viewScroll}>
            {this.state.isMouting && (
              <View style={{ height: 900 }}>
                <View style={{ padding: 20 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles1.txtPLL}>Phân loại lỗi: </Text>
                  </View>
                  <View style={styles1.viewRNPicker}>
                    <RNPickerSelect
                      placeholder={{
                        label: '--- Phân Loại lỗi ---',
                        value: null,
                      }}
                      items={this.state.warningList}
                      style={{ ...pickerSelectStyles }}
                      onValueChange={value => {
                        this.setState({ typeError: value });
                      }}
                      value={Number.parseInt(this.state.typeError)}
                      ref={el => {
                        this.inputRefs.picker = el;
                      }}
                      hideIcon={true}
                    />
                    <Icon
                      name={'angle-down'}
                      size={25}
                      color={'#FFF'}
                      style={styles1.icon}
                    />
                  </View>
                  {/* <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 4, marginBottom: 20 }}>

                  <Picker
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                    selectedValue={this.state.typeError}
                    onValueChange={(itemValue, itemIndex) => this.setState({ typeError: itemValue })}>
                    <Picker.Item label="Nội dung câu hỏi sai" value="0" />
                    <Picker.Item label="Đáp án câu hỏi sai" value="1" />
                    <Picker.Item label="Hình ảnh bị lỗi" value="2" />
                    <Picker.Item label="Video sai nội dung" value="3" />
                  </Picker>
                  <Icon name={'sort-down'} color={'#55bbea'} size={16} style={{ alignSelf: 'center', right: 10, position: 'absolute' }} />
                </View> */}
                  <Text style={styles1.txtVLMT}>
                    Vui lòng mô tả lỗi gặp phải :{' '}
                  </Text>
                  <KeyboardAvoidingView behavior="padding">
                    {!this.state.text && Platform.OS == 'ios' && (
                      <Icon
                        name={'edit'}
                        size={20}
                        color={'#999'}
                        style={styles1.iconEdit}
                      />
                    )}
                    <TextInput
                      style={styles1.txtInputCont}
                      underlineColorAndroid={'transparent'}
                      multiline={true}
                      placeholder={`Nội dung Lỗi bạn gặp phải`}
                      placeholderTextColor={'#999'}
                      numberOfLines={4}
                      onChangeText={text => this.setState({ text })}
                      value={this.state.text}
                      textAlignVertical={'top'}
                    />
                  </KeyboardAvoidingView>
                  {this.state.isButtonVisible && (
                    <TouchableOpacity
                      onPress={() => this.sendError()}
                      style={styles1.btnSend}>
                      <Text style={styles1.txtSend}>Gửi Ngay</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </FrameModal>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderRadius: 50,
    backgroundColor: '#446BA0',
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    height: 35,
  },
  inputAndroid: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderRadius: 50,
    backgroundColor: '#446BA0',
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    borderWidth: 1,
  },
});

const styles1 = StyleSheet.create({
  viewScroll: { flex: 1, backgroundColor: 'transparent' },
  txtPLL: {
    marginVertical: 10,
    color: '#828282',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  viewRNPicker: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 50,
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  txtVLMT: {
    marginTop: 40,
    marginBottom: 10,
    color: '#828282',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  iconEdit: { position: 'absolute', zIndex: 2, padding: 7, right: 4 },
  txtInputCont: {
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingTop: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginBottom: 21,
    fontSize: 12,
    color: '#000',
    minHeight: 100,
    maxHeight: 300,
    borderRadius: 5,
    fontFamily: 'Nunito-Regular',
  },
  btnSend: {
    marginVertical: 50,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: '#55bbea',
    borderRadius: 50,
    width: '80%',
    alignSelf: 'center',
  },
  txtSend: {
    color: '#FFF',
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    textTransform: 'uppercase',
  },
});
