import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Formik } from 'formik';
import InputPrimary from '../common-new/InputPrimary';
import ApiUser from '../../services/apiUserHelper';
import RippleButton from '../libs/RippleButton';
import AppIcon from '../../utils/AppIcon';
import SlideLeft from '../anim/SlideLeft';
import HeaderNavigation from '../common/HeaderNavigation';
import Common from '../../utils/Common';
import global from '../../utils/Globals';
import dataHelper from '../../utils/dataHelper';
import authStyle from '../../themes/authStyle';
import LoadingScreen from '../libs/LoadingScreen';
import FormInput from '../common/FormInput';
import OTPTextView from '../common/InputOTP';
import _ from 'lodash'
import { PHONE_DEBUG } from '../../constants/const';
import { WOOPS_ERROR } from '../../constants/message';
import { DotIndicator } from 'react-native-indicators';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast';
import FreshchatComponent from '../../utils/FreshchatComponent';
import { phoneNumberScheme, forgotPasswordValidate } from '../../utils/SchemaValidate';
import { SizedBox } from '../common-new/Bootstrap';

const { width, height } = Dimensions.get('window');
export default class ForgotPasswordScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: <HeaderNavigation navigation={navigation} title="Quên mật khẩu" bgColor={'transparent'} back={true} />
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      isVerify: false,
      password: '',
      repassword: '',
      phoneNumber: '',
      errors: '',
      confirmResult: null,
      codeOTP: '',
      projectId: 'onluyen-a2989',
      isSecureTextEntry: true,
      isShowKeybroad: false,
      statusPassWord: true,
      statusRePassWord: true,
      errorEmpty: [],
      accountSearch: [],
      accountSelected: null,
      isEditPhone: true,
      editableOTP: true,
      secureTextEntry: false
    };
    this.phoneNumber = '';
    this.password = '';
    this.repassword = '';
    this.verificationId = null;
  }

  async componentDidMount() {
    if (auth().currentUser) {
      auth().signOut();
    }
    this.unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        let currentUser = await auth().currentUser;
        this.verificationId = await currentUser.getIdToken();
        await this.setState({ secureTextEntry: true, codeOTP: '******' });
        this.forgotAction();
      }
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    const { email } = this.props.navigation.state.params;
    this.setState({ email });
  }

  _handleValidation = () => {
    var result = true;
    var { errorEmpty, repassword, password } = this.state;
    _.forEach(['phoneNumber', 'password', 'repassword'], item => {
      if (_.isEmpty(this.state[item])) {
        switch (item) {
          case 'phoneNumber': {
            errorEmpty[item] = 'Tên đăng nhập không được để trống';
            result = false;
            break;
          }
          case 'password': {
            errorEmpty[item] = 'Mật khẩu không được để trống';
            result = false;
            break;
          }
          case 'repassword': {
            errorEmpty[item] = 'Xác thực mật khẩu không được để trống';
            result = false;
            break;
          }
          default: break;
        }
        this.setState({ errorEmpty });
      } else {
        const passwordRegex = password.match(/[\ \/\'\"\+\-\*\(\)\[\]\{\}\_\,\.\$\%\^\!\~\`]/g);
        if (item === 'password' && passwordRegex) {
          errorEmpty[item] = 'Mật khẩu không được chứa kí tự đặc biệt !'
          result = false;
        }
        if (item === 'password' && password.trim().length < 6) {
          errorEmpty[item] = 'Mật khẩu phải chứa ít nhất 6 kí tự !'
          result = false;
        }
        if (item === 'repassword' && password != repassword) {
          errorEmpty[item] = 'Nhập lại mật khẩu không khớp !'
          result = false;
        }
        this.setState({ errorEmpty });
      }
    });
    return result;
  }

  verifyPhone(values) {
    this.password = values.password;
    this.repassword = values.repassword;
    const phoneNumber = this.phoneNumber;
    const phone = Common.formatPhoneNumber(phoneNumber);
    this.checkPhoneNumber(phone);
  }

  loginWithPhone = async (phone) => {
    try {
      const phoneVerify = Common.fomatPhoneVerify(phone);
      let confirmResult = await auth().signInWithPhoneNumber(phoneVerify);
      this.verificationId = confirmResult._verificationId;
      await this.setState({ isVerify: true, isLoading: false, errors: '' });
    } catch (error) {
      this.onConfirmErrors(error, phone);
    }
    return;

    const phoneVerify = Common.fomatPhoneVerify(phoneNumber);
    auth()
      .verifyPhoneNumber(phoneVerify)
      .on('state_changed', (phoneAuthSnapshot) => {
        switch (phoneAuthSnapshot.state) {
          //  IOS AND ANDROID EVENTS
          case auth.PhoneAuthState.CODE_SENT: // or 'sent'
            console.log('code sent');
            this.setState({ isVerify: true, isLoading: false, errors: '' });
            break;
          case auth.PhoneAuthState.ERROR: // or 'error'
            console.log('verification error');
            console.log(phoneAuthSnapshot.error);
            break;
          // ANDROID ONLY EVENTS
          case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
            console.log('auto verify on android timed out');
            break;
          case auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
            console.log('auto verified on android');
            console.log(phoneAuthSnapshot);
            break;
        }
      }, (error) => {
        console.log(error);
        this.onConfirmErrors(error, phoneNumber);
        console.log(error.verificationId);
      }, async (phoneAuthSnapshot) => {
        console.log(phoneAuthSnapshot);
        const { verificationId, state, code } = phoneAuthSnapshot;
        if (state == auth.PhoneAuthState.AUTO_VERIFIED) {
          const currentUser = await auth().currentUser;
          this.verificationId = await currentUser.getIdToken();
          await this.setState({ editableOTP: false, codeOTP: code });
          this.forgotAction();
        }
        else {
          this.verificationId = verificationId;
        }
      });
  }

  resendOTP = async () => {
    this.setState({ isLoading: true });
    const { phoneNumber } = this.state;
    this.verificationId = null;
    this.otp.onClear();
    await this.setState({ isLoading: true, codeOTP: '', errors: '' });
    this.loginWithPhone(phoneNumber);
    // let phoneVerify = Common.fomatPhoneVerify(phoneNumber);
    // try {
    //   this.otp.onClear();
    //   await this.setState({ isLoading: true, codeOTP: '', errors: '' });
    //   const confirmResult = await auth().signInWithPhoneNumber(phoneVerify);
    //   const verificationId = confirmResult._verificationId;
    //   if (verificationId) {
    //     this.refs.toast.show('Mã OTP đã được gửi lại!');
    //   } else {
    //     this.refs.toast.show('Gửi lại OTP không thành công !');
    //   }
    //   await this.setState({ isLoading: false });
    // } catch (error) {
    //   this.onConfirmErrors(errors, phoneNumber);
    // }
  }

  onConfirmErrors = (error, phoneNumber) => {
    console.log(error);
    let message = Common.getMessageConfirmResult(error, phoneNumber);
    this.setState({
      isLoading: false,
      password: '',
      repassword: '',
      errors: message
    });
  }

  checkPhoneNumber(phone) {
    let phoneNumber = Common.formatPhoneNumber(phone);
    const type = 1;
    const token = '';
    ApiUser.checkPhoneNumber({ type, phoneNumber, token }).then(response => {
      if (response != '') {
        const { status } = response;
        if (status == 302) {
          this.setState({ errors: '', isLoading: true }, () => {
            this.loginWithPhone(phoneNumber);
          });
        } else {
          this.setState({ errors: 'Số điện thoại này chưa được đăng kí !', isLoading: false });
          return;
        }
      }
    });
  }

  forgotAction() {
    const { codeOTP, confirmResult, projectId, accountSelected } = this.state;
    const password = this.password;
    const phone = this.phoneNumber;
    const phoneNumber = Common.convertPhoneNumber(phone);
    if (codeOTP.trim().length <= 0) {
      this.setState({ errors: 'Mã OTP không được để trống !' });
      return;
    }
    if (!this.verificationId) {
      this.otp.onClear();
      this.setState({ errors: 'Mã OTP không chính xác', codeOTP: '' });
      return;
    }
    this.setState({ errors: '', isLoading: true });
    const userName = accountSelected && accountSelected.userName ? accountSelected.userName : phoneNumber;
    const phoneCountry = "+84";
    const token = this.verificationId;
    // submit API 
    ApiUser.changeFirebasePassword({
      codeOTP,
      userName,
      password,
      phoneNumber,
      phoneCountry,
      token,
      projectId
    }).then(response => {
      const { status, message } = response;
      console.log(response);
      if (status == 200) {
        dataHelper.saveUserName(userName);
        dataHelper.saveUserPass(password);
        dataHelper.removeItem('');
        global.updateRemember();
        this.refs.toast.show('Thay đổi mật khẩu thành công!', 600, () => {
          this.setState({ isLoading: false });
          this.props.navigation.goBack();
          console.log('update success')
        });
      } else {
        //
        this.setState({
          errors: message,
          codeOTP: '',
          isLoading: false,
          editableOTP: true,
        });
        this.otp.onClear();
      }
    }).catch(err => {
      this.setState({
        isLoading: false,
        editableOTP: true
      });
      console.log(err);
    });
  }

  validatePhone(inputtxt) {
    var phoneno = /^\d{10}$/;
    if (inputtxt.value.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  }

  onChangeTextPhoneNumber = text => this.setState({
    phoneNumber: text,
    errorEmpty: [],
    errors: ''
  })

  showPassword() {
    Keyboard.dismiss();
    this.setState({
      isSecureTextEntry: !this.state.isSecureTextEntry
    });
  }

  _keyboardDidShow = () => {
    this.setState({ isShowKeybroad: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isShowKeybroad: false });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _showPassword = type => {
    const {
      statusPassWord,
      statusRePassWord
    } = this.state;
    switch (type) {
      case 1: {
        this.setState({
          statusPassWord: !statusPassWord
        });
        break;
      }
      case 2: {
        this.setState({
          statusRePassWord: !statusRePassWord
        });
        break;
      }
      default: break;
    }
  }

  handleBtnBack = (isShowKeybroad) => () => {
    if (isShowKeybroad) {
      Keyboard.dismiss()
    } else {
      this.props.navigation.goBack();
    }
  }

  getAvatar = (source) => {
    try {
      if (source.indexOf('http') == -1) {
        return `http:${source}`;
      } else {
        return source;
      }
    } catch (error) {
      // console.log(error)
      return '';
    }
  }

  handleSearchAccount = (values) => {
    const { phoneNumber } = values;
    this.phoneNumber = phoneNumber;
    if (phoneNumber.length < 10 || parseInt(phoneNumber) < 0 || isNaN(parseInt(phoneNumber))) {
      this.setState({ errors: 'Số điện thoại không hợp lệ !', isLoading: false });
      return;
    }
    ApiUser.getSearchAccount({ phoneNumber }).then(res => {
      if (!!res) {
        console.log(res)
        if (!_.isEmpty(res[0])) {
          if (res.length > 1) {
            this.setState({
              accountSearch: res,
              isEditPhone: false
            })
          } else {
            this.setState({
              accountSearch: res,
              accountSelected: res[0],
              isEditPhone: false
            })
          }
        } else {
          this.setState({
            errors: 'Số điện thoại này chưa được đăng kí !',
            isLoading: false,
            isEditPhone: true
          });
        }
      }
    });
  }

  renderItemAccount = ({ item }) => {
    const uriAvatar = this.getAvatar(item.avatar);
    return (
      <RippleButton
        onPress={() => {
          this.setState({ accountSelected: item })
        }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10
        }}>
          <View style={{
            justifyContent: 'center',
            margin: 5
          }}>
            <View style={{
              borderWidth: 0.5,
              borderColor: '#54CEF5',
              width: 40,
              height: 40,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              {
                uriAvatar
                  ?
                  <Image
                    source={{ uri: uriAvatar }}
                    style={{ width: 40, height: 40 }}
                    resizeMode={'contain'}
                  />
                  :
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#54CEF5',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Nunito-Bold', fontSize: 16, color: '#fff'
                    }}>{item.displayName ? item.displayName.substring(0, 1) : ''}</Text>
                  </View>
              }
            </View>
          </View>
          <Text style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 14,
            marginStart: 25
          }}>{
              item.displayName}
          </Text>
        </View>
      </RippleButton>
    )
  }

  renderAccountSearch = (account) => {
    if (!_.isEmpty(account)) {
      return (
        <View style={{ width: width - width / 5, alignSelf: 'center' }}>
          {
            this.state.accountSelected
              ?
              <View>
                {this.renderItemAccount({ item: this.state.accountSelected })}
                {this.renderEnterPass()}
              </View>
              :
              <View>
                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 14, marginTop: 45 }}>Chọn tài khoản</Text>
                <FlatList
                  data={account}
                  keyExtractor={(item) => item.userName}
                  renderItem={this.renderItemAccount}
                />
              </View>
          }
        </View>
      )
    }
    return;
  }

  renderEnterPass = () => {
    const {
      password,
      repassword,
      statusRePassWord,
      statusPassWord,
      errorEmpty,
      accountSearch
    } = this.state;
    if (!_.isEmpty(accountSearch)) {
      return (
        <Formik
          initialValues={{
            password: __DEV__ ? this.state.password : this.state.password,
            repassword: __DEV__ ? this.state.repassword : this.state.repassword,
            phoneNumber: this.phoneNumber
          }}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => this.verifyPhone(values, resetForm)}
          validationSchema={forgotPasswordValidate}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <View>
              {errorEmpty.phoneNumber &&
                (<View><Text style={styles.txtErrorEmpty}>
                  {errorEmpty.phoneNumber}
                </Text></View>)}
              <SizedBox height={20} />
              <InputPrimary
                label={'Mật khẩu'}
                placeholder={'Nhập Mật khẩu'}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={() => setFieldTouched('password')}
                secureTextEntry
                isValid={(touched.password && !errors.password)}
                error={(touched.password && errors.password) && errors.password}
              />
              <InputPrimary
                label={'Nhập lại Mật khẩu'}
                placeholder={'Nhập lại Mật khẩu'}
                value={values.repassword}
                onChangeText={handleChange('repassword')}
                onBlur={() => setFieldTouched('repassword')}
                secureTextEntry
                isValid={(touched.repassword && !errors.repassword)}
                error={(touched.repassword && errors.repassword) && errors.repassword}
              />
              {
                !this.state.isLoading
                  ?
                  <RippleButton
                    color={'#ddd'}
                    // onPress={() => this.verifyPhone()}
                    onPress={handleSubmit}
                    style={styles.btnLaylaimk}>
                    <Text style={authStyle.textAction}>Đổi mật khẩu</Text>
                  </RippleButton>
                  :
                  <View style={{ height: 20, marginTop: 30, width: 320 }}>
                    <DotIndicator color={'#54CEF5'} size={6} count={8} />
                  </View>
              }

            </View>
          )}
        </Formik>
      )
    }
    return;
  }
  render() {
    const {
      phoneNumber,
      isShowKeybroad,
      password,
      repassword,
      statusRePassWord,
      statusPassWord,
      errorEmpty,
      accountSearch
    } = this.state;
    const {
      wrapLogin,
      authItem,
      wrapIcon,
      backArrow,
      contentContainer,
      textInput,
      textAction,
      buttonLogin,
      validationStyle,
      container
    } = authStyle;
    return (
      <View
        style={[
          container,
          {
            backgroundColor: '#FFF'
          }
        ]}
      >
        <StatusBar />
        <SafeAreaView style={container}>
          <View style={backArrow}>
            <RippleButton
              size={50}
              color={'black'}
              duration={200}
              onPress={this.handleBtnBack(isShowKeybroad)}
            >
              <Image source={AppIcon.arrow_left_S_light} style={styles.btnBack} resizeMode={'contain'} />
            </RippleButton>
            <View style={{ flex: .9, alignItems: 'center' }}>
              <Text style={styles.txtTitle}>{!this.state.isVerify ? 'Quên mật khẩu' : 'Xác thực'}</Text>
            </View>
          </View>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            showsVerticalScrollIndicator={false}>
            <View style={[{ flex: 1 }]}>
              <View>
                {/* <Text style={{ fontSize: 18, color: '#fff', marginBottom: 10 }}>Quên mật khẩu</Text> */}
                <Text style={[validationStyle, {
                  marginBottom: 28,
                  paddingHorizontal: width / 5,
                  textAlign: 'center'
                }]}>{this.state.errors}</Text>
                {
                  !this.state.isVerify ?
                    <Formik
                      initialValues={{
                        phoneNumber: __DEV__ ? '0367851356' : this.state.phoneNumber,
                      }}
                      enableReinitialize={true}
                      onSubmit={(values, { resetForm }) => this.handleSearchAccount(values, resetForm)}
                      validationSchema={phoneNumberScheme}
                    >
                      {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                        <View style={{ width: width - width / 5, alignSelf: 'center' }}>
                          <InputPrimary
                            label={'Số điện thoại'}
                            placeholder={'eg.09x....'}
                            value={values.phoneNumber}
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={() => setFieldTouched('phoneNumber')}
                            isValid={(touched.phoneNumber && !errors.phoneNumber)}
                            error={(touched.phoneNumber && errors.phoneNumber) && errors.phoneNumber}
                            editable={this.state.isEditPhone}
                            keyboardType={'phone-pad'}
                          />
                          {this.renderAccountSearch(accountSearch)}
                          {_.isEmpty(accountSearch) && <RippleButton
                            color={'#ddd'}
                            onPress={handleSubmit}
                            style={styles.btnLaylaimk}>
                            <Text style={textAction}>Tìm kiếm tài khoản</Text>
                          </RippleButton>}
                        </View>
                      )}
                    </Formik>
                    :
                    <View style={{ paddingHorizontal: width / 5 }}>
                      <Text style={{
                        marginBottom: 20,
                        color: '#222222',
                        fontFamily: 'Nunito-Bold',
                        fontSize: 15,
                        width: width - width / 5
                      }}>
                        Nhập mã OTP
                        </Text>
                      <OTPTextView
                        ref={ref => this.otp = ref}
                        containerStyle={styles.textInputContainer}
                        textInputStyle={[styles.roundedTextInput, width < 400 && { height: width * 2 / 15, width: width * 2 / 15 }]}
                        handleTextChange={text => this.setState({ codeOTP: text, errors: '' }, () => console.log('text1', this.state.codeOTP))}
                        inputCount={6}
                        keyboardType="numeric"
                        defaultValue={this.state.codeOTP}
                        editable={this.state.editableOTP}
                      // secureTextEntry={this.state.secureTextEntry}
                      />
                      {
                        !this.state.isLoading
                          ?
                          <View>
                            <RippleButton
                              size={180}
                              onPress={() => this.forgotAction()}
                              style={styles.btnCreate}
                            >
                              <Text style={textAction}>Xác thực</Text>
                            </RippleButton>
                            <View style={{ marginTop: 30, flexDirection: 'row' }}>
                              <Text style={{
                                fontFamily: 'Nunito-Regular',
                                fontSize: 13,
                                color: '#999999'
                              }}>Tôi không nhận được mã</Text>
                              <TouchableOpacity
                                onPress={this.resendOTP}>
                                <Text style={{
                                  marginStart: 17,
                                  fontFamily: 'Nunito-Bold',
                                  fontSize: 14,
                                  color: '#54CEF5'
                                }}>Gửi lại</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          :
                          <View style={{ height: 20, marginTop: 60, width: 320 }}>
                            <DotIndicator color={'#54CEF5'} size={6} count={8} />
                          </View>
                      }
                    </View>
                }
              </View>
            </View>
            <View>
              <View style={styles.wrapFooter}>
                <Text style={{
                  color: '#757575',
                  fontSize: 12,
                  fontFamily: 'Nunito-Regular'
                }}>
                  Quay lại màn hình
                       </Text>
                <TouchableOpacity onPress={() => {
                  this.props.navigation.pop();
                  this.props.navigation.navigate('V_SignIn',
                    {
                      statusbar: 'dark-content'
                    });
                }}>
                  <Text style={{
                    color: '#757575',
                    alignSelf: 'center',
                    fontFamily: 'Nunito-Regular',
                    fontSize: 12,
                    marginLeft: 3,
                    textDecorationLine: 'underline'
                  }}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <Toast ref="toast" position={'bottom'} />
          <LoadingScreen
            isLoading={this.state.isLoading}
            bgColor={'transparent'}
            color={'transparent'}
          />
        </SafeAreaView>
        <FreshchatComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtTitleForm: {
    marginTop: (height / width),
    fontFamily: 'Nunito',
    fontSize: 15,
    lineHeight: 20,
    color: '#000',
    lineHeight: 19,
    marginBottom: 3,
    marginLeft: 10,
  },
  txtTitle: {
    fontFamily: 'Nunito',
    fontSize: 18,
    lineHeight: 25,
    color: '#979797',
  },
  btnBack: {
    tintColor: '#000',
    width: 30,
    height: 25,
    marginLeft: 10
  },
  btnCreate: {
    backgroundColor: '#54CEF5',
    width: width - width / 5,
    height: 40,
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnLaylaimk: {
    backgroundColor: '#2D9CDB',
    width: width - width / 5,
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtDecsMK: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: "#ddd",
    position: 'absolute',
    bottom: -20,
    left: 5
  },
  imageBottom: {
    width: width,
    height: width * global.ratioImageBottom
  },
  buttonHide: {
    position: 'absolute',
    right: 5,
    bottom: 0
  },
  wrapFooter: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 30,
    alignSelf: 'center',
    zIndex: 1
  },
  textInputContainer: {
    width: width - width / 5,
    marginBottom: 0,
    padding: 0,
    fontSize: 10
  },
  roundedTextInput: {
    margin: 0,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderWidth: 1,
    //  height: width*2/15,
  },
  txtErrorEmpty: {
    color: '#D22D3F',
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
  },
  textAction: {
    fontFamily: 'Nunito',
    fontSize: 18,
    lineHeight: 21
  }
})