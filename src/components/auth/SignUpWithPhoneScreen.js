import React, { Component } from 'react';
import {
  View, Text, BackHandler,
  StyleSheet, Dimensions, Image, Alert, Keyboard, SafeAreaView, StatusBar, Platform, TouchableOpacity
} from 'react-native';
import auth from '@react-native-firebase/auth';
import RippleButton from '../libs/RippleButton';
import apiUser from '../../services/apiUserHelper';
import Common from '../../utils/Common';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import SlideLeft from '../anim/SlideLeft';
import authStyle from '../../themes/authStyle';
import dataHelper from '../../utils/dataHelper';
import FormInput from '../common/FormInput';
import { PHONE_DEBUG } from '../../constants/const';
import Button from '../common/Button';
import AppIcon from '../../utils/AppIcon';
import LoadingScreen from '../libs/LoadingScreen';
import Mixpanel from 'react-native-mixpanel';
import jwtDecode from 'jwt-decode';
import global from '../../utils/Globals';
import OTPTextView from '../common/InputOTP';
import _ from 'lodash';
import { DotIndicator } from 'react-native-indicators';
import { WOOPS_ERROR } from '../../constants/message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast, { DURATION } from 'react-native-easy-toast';

const { height, width } = Dimensions.get("window");
const ICON_SIZE = 17;

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
    this.verificationId = null;
  }

  getInitState = () => {
    return {
      phoneNumber: '',
      code: '',
      userName: '',
      user: null,
      email: '',
      passWord: '',
      repassWord: '',
      isVerify: false,
      rememberMe: true,
      errors: '',
      isRegistered: false,
      isLoading: false,
      confirmResult: null,
      isConfirm: false,
      codeOTP: '',
      projectId: 'onluyen-a2989',
      listCountry: [],
      country: 'Viet Nam',
      codeCountry: '+84',
      flatCountry: 'VN',
      isSecureTextEntry: true,
      isShowKeybroad: false,
      statusPassWord: true,
      statusRePassWord: true,
      editableOTP: true,
      errorEmpty: [],
    };
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
        this.handleSignUpAPI();
      }
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getApiCountry()
  }


  getApiCountry = async () => {
    const listCountry = await fetch('https://restcountries.eu/rest/v2/all', {
      method: 'GET',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    const data = await listCountry.json();
    console.log(data.filter(item => item.name === 'Viet Nam'));
    data.filter(item => item.name === 'Viet Nam')
    this.setState({ listCountry: data });
  }

  _handleValidation = () => {
    var result = true;
    var { errorEmpty, repassWord, passWord, phoneNumber } = this.state;
    _.forEach(['phoneNumber', 'passWord', 'repassWord'], item => {
      if (_.isEmpty(this.state[item])) {
        switch (item) {
          case 'phoneNumber': {
            errorEmpty[item] = 'Số điện thoại không được để trống';
            result = false;
            break;
          }
          case 'passWord': {
            errorEmpty[item] = 'Mật khẩu không được để trống';
            result = false;
            break;
          }
          case 'repassWord': {
            errorEmpty[item] = 'Xác thực mật khẩu không được để trống';
            result = false;
            break;
          }
          default: break;
        }
        this.setState({ errorEmpty });
      } else {
        const passwordRegex = passWord.match(/[\ \/\'\"\+\-\*\(\)\[\]\{\}\_\,\.\$\%\^\!\~\`]/g);
        if (item === 'phoneNumber' && !Common.validatePhoneNumberV2(phoneNumber)) {
          errorEmpty[item] = 'Số điện thoại không hợp lệ !';
          result = false;
        }

        if (item === 'passWord' && passwordRegex) {
          errorEmpty[item] = 'Mật khẩu không được chứa kí tự đặc biệt !'
          result = false;
        }
        if (item === 'passWord' && passWord.trim().length < 6) {
          errorEmpty[item] = 'Mật khẩu phải chứa ít nhất 6 kí tự !'
          result = false;
        }
        if (item === 'repassWord' && passWord != repassWord) {
          errorEmpty[item] = 'Nhập lại, mật khẩu không khớp !'
          result = false;
        }
        this.setState({ errorEmpty });
      }
    });
    return result;
  }

  handleSignUp() {
    if (this._handleValidation()) {
      this.setState({
        isLoading: true
      }, () => {
        const phone = this.state.phoneNumber;
        const { passWord, repassWord } = this.state;
        let phoneNumber = Common.convertPhoneNumber(phone);

        const type = 1;
        const token = "";

        if (!Common.validatePhoneNumberV2(phoneNumber)) {
          this.setState({
            errors: 'Vui lòng nhập đúng số điện thoại!',
            isLoading: false
          });
          return;
        }

        apiUser.checkPhoneNumber({ token, type, phoneNumber }).then(response => {
          if (response != '') {
            const { status } = response;
            if (status == 302) {
              this.setState({ errors: 'Số điện thoại đã được sử dụng', isLoading: false });
            } else if (status == 200) {
              this.setState({ isLoading: true }, () => {
                this.signUpWithPhone(phoneNumber);
              });
            }
          }
        });
      });
    }
  }

  gotoSignIn() {
    this.props.navigation.pop();
    this.props.navigation.navigate('V_SignIn', { statusbar: 'dark-content' });
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  signUpWithPhone = async (phone) => {
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

  onConfirmErrors = (error, phoneNumber) => {
    let message = Common.getMessageConfirmResult(error, phoneNumber);
    this.setState({
      isLoading: false,
      errors: message
    });
  }

  resendOTP = async () => {
    this.otp.onClear();
    this.verificationId = null;
    const { phoneNumber } = this.state;
    await this.setState({ isLoading: true, codeOTP: '', errors: '' });
    this.signUpWithPhone(phoneNumber);
  }

  signUpFaild = (error, phoneNumber) => {
    let message = Common.getMessageConfirmResult(error, phoneNumber);
    this.setState({
      isLoading: false,
      phoneNumber: '',
      password: '',
      repassword: '',
      errors: message
    });
  }

  handleSignUpAPI = async () => {
    const { passWord, rememberMe, repassWord, codeOTP, projectId, confirmResult } = this.state;
    const phone = this.state.phoneNumber;
    const displayName = phone;
    const password = passWord;

    // if (passWord === '' || repassWord === '' || displayName === '') {
    //   this.setState({ errors: 'Bạn chưa điền đầy đủ thông tin !' });
    //   return;
    // }
    // if (passWord !== repassWord) {
    //   this.setState({ errors: 'Mật khẩu và mật khẩu nhập lại không khớp !' });
    //   return;
    // }
    // if (passWord.length < 6) {
    //   this.setState({ errors: 'Mật khẩu ít nhất phải có 6 kí tự !' });
    //   return;
    // }

    if (codeOTP === '') {
      this.setState({ errors: 'Bạn chưa Nhập Mã OTP' });
      return;
    }
    this.setState({
      errors: ''
    });
    // const csrf = "";
    let phoneNumber = Common.formatPhoneNumber(phone);
    let token = this.verificationId;
    let phoneCountry = "+84";
    await this.setState({ isRegistered: true });
    apiUser.registerFirebasePhone({
      displayName, phoneNumber, password, projectId, token, codeOTP, phoneCountry
    }).then(response => {
      const { status, userid, access_token } = response;
      if (status == 200) {
        dataHelper.saveToken(access_token);
        dataHelper.saveUserPass(passWord);
        dataHelper.saveUserName(phoneNumber);
        Mixpanel.createAlias(userid);
        apiUser.updateMixpanelId({ token: access_token, mixpanelId: Common.MixpanelToken }).then(data => {
          if (!!data) {
            Mixpanel.set(jwtDecode(response.access_token));
            Mixpanel.trackWithProperties('Sign Up', {
              "mobile": Platform.OS,
              "user": "NEW"
            });
          }
        });
        this.onSuccess();
      } else if (status == 403) {
        this.otp.onClear();
        this.setState({ errors: 'Mã OTP không chính xác !', codeOTP: '', editableOTP: true, isRegistered: false });
      } else {
        this.otp.onClear();
        this.setState({ errors: response.message || 'Mã OTP không chính xác !', codeOTP: '', editableOTP: true, isRegistered: false });
      }
    }).catch(err => {
      this.otp.onClear();
      this.setState({ errors: 'Mã OTP không chính xác !', codeOTP: '', editableOTP: true, isRegistered: false });
    });
  }

  onSuccess(text) {
    this.refs.toast.show('Đăng kí thành công !', 600, () => {
      this.setState(this.getInitState());
      this.verificationId = null;
      this.props.navigation.navigate('V_SignIn', { statusbar: 'dark-content' });
    });
  }

  onFail(message) {
    this.setState({ errors: message });
  }

  onLogin(token) {
    if (!token) {
    } else {

    }
  }

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
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  _showPassword = type => {
    const { statusPassWord, statusRePassWord } = this.state;
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

  render() {
    const { passWord, errorEmpty,
      repassWord, displayName, isShowKeybroad,
      statusPassWord, statusRePassWord } = this.state;
    const { container, contentContainer, backArrow } = authStyle;
    const { viewLogin, wrapLogin, validationStyle, } = styles;
    return (
      <View style={[container, { backgroundColor: '#FFF' }]}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}
      >
        <StatusBar />
        <SafeAreaView style={[container]}>
          <View style={[backArrow, { paddingTop: Platform.OS == 'android' ? 20 : null }]} >
            <RippleButton
              size={50}
              color={'black'}
              duration={200}
              onPress={() => {
                if (isShowKeybroad) {
                  Keyboard.dismiss()
                } else {
                  this.props.navigation.goBack()
                }
              }}
            >
              <Image source={AppIcon.arrow_left_S_light} style={styles.btnBack} resizeMode={'contain'} />
            </RippleButton>
            <View style={styles.wrapText}>
              <Text style={styles.txtTitle}>{this.state.isVerify ? 'Xác thực' : 'Đăng ký'}</Text>
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
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={validationStyle}>{this.state.errors}</Text>
              <View style={wrapLogin}>
                {!this.state.isVerify && !this.state.confirmResult &&
                  <View>
                    {/* <View style={{ flexDirection: 'row', }}>
                        <Image source={{ uri: `https://www.countryflags.io/${flatCountry}/flat/64.png` }} resizeMode={'contain'} style={{ width: 40, height: 40, alignSelf: 'flex-end', marginRight: 10 }}></Image>
                        <Dropdown
                          data={listCountry.map(item => {
                            let obj = {};
                            obj['value'] = item.name;
                            return obj;
                          })}
                          containerStyle={{ width: 100, }}
                          onChangeText={(txt) => {
                            let flatCountry = listCountry.filter(item => item.name === txt)[0].alpha2Code;
                            let codeCountry = listCountry.filter(item => item.name === txt)[0].callingCodes[0];
                            this.setState({ country: txt, flatCountry, codeCountry });
                          }}
                          value={country}
                          itemTextStyle={{ fontFamily: 'Nunito-Regular', }}
                          itemCount={10}
                          overlayStyle={{ fontFamily: 'Nunito-Regular', }}
                        />
                      </View> */}
                    <View style={{ flex: 1, width: width - width / 4 }}>
                      <Text style={[styles.txtTitleForm, { paddingTop: 0, marginTop: 10 }]}>Số điện thoại</Text>
                      <FormInput
                        paddingTopContent={4}
                        height={40}
                        onChangeText={text => this.setState({
                          phoneNumber: text,
                          errors: '',
                          errorEmpty: []
                        })}
                        borderWidth={0.5}
                        borderColor={'#54CEF5'}
                        borderRadius={5}
                        keyboardType={'number-pad'}
                        value={this.state.phoneNumber}
                        placeholder={'Nhập số điện thoại'}
                      />
                      {errorEmpty.phoneNumber && (<View><Text style={styles.txtErrorEmpty} >{errorEmpty.phoneNumber}</Text></View>)}
                      <Text style={styles.txtTitleForm}>Mật khẩu</Text>
                      <FormInput
                        paddingTopContent={4}
                        height={40}
                        onChangeText={text => this.setState({
                          passWord: text,
                          errors: '',
                          errorEmpty: []
                        })}
                        borderWidth={0.5}
                        borderColor={'#54CEF5'}
                        borderRadius={5}
                        value={passWord}
                        placeholder={'Nhập mật khẩu'}
                        isShowPassword={true}
                        actionIcon={AppIcon.icon_eye}
                        secureTextEntry={statusPassWord}
                        isSecureTextEntry={statusPassWord}
                        showPassword={() => this._showPassword(1)}
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      {errorEmpty.passWord && (<View><Text style={styles.txtErrorEmpty} >{errorEmpty.passWord}</Text></View>)}
                      <Text style={styles.txtTitleForm}>Xác thực mật khẩu</Text>
                      <FormInput
                        paddingTopContent={4}
                        height={40}
                        onChangeText={text => this.setState({
                          repassWord: text,
                          errors: '',
                          errorEmpty: []
                        })}
                        borderWidth={0.5}
                        borderColor={'#54CEF5'}
                        borderRadius={5}
                        value={repassWord}
                        placeholder={'Nhập lại mật khẩu'}
                        isShowPassword={true}
                        actionIcon={AppIcon.icon_eye}
                        secureTextEntry={statusRePassWord}
                        isSecureTextEntry={statusRePassWord}
                        showPassword={() => this._showPassword(2)}
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      {errorEmpty.repassWord && (<View><Text style={styles.txtErrorEmpty} >{errorEmpty.repassWord}</Text></View>)}
                      {
                        !this.state.isLoading
                          ?
                          <Button
                            center={true} btn={'rgb-lg'} title="Đăng ký"
                            width={width - width / 4} circle={40} color={'#f8f8f8'} vertical={20}
                            style={{ backgroundColor: '#54CEF5', height: 40, borderRadius: 5 }}
                            styleTitle={{ fontWeight: 'bold', fontSize: 14 }}
                            onPress={() => this.handleSignUp()}
                          />
                          :
                          <View style={{ height: 20, marginTop: 30, alignSelf: 'center' }}>
                            <DotIndicator color={'#54CEF5'} size={6} count={8} />
                          </View>
                      }
                    </View>
                    {/* <Text style={styles.txtDecsNotf}>* Việc xác minh số điện thoại có thể mất vài phút</Text> */}
                  </View>
                }
                {this.state.isVerify &&
                  <SlideLeft style={{ flex: 1, width: width - width / 4 }}>
                    <Text style={{ marginVertical: 20, color: '#222222', fontFamily: 'Nunito-Bold', fontSize: 15 }}>Nhập mã OTP</Text>
                    <OTPTextView
                      ref={ref => this.otp = ref}
                      containerStyle={styles.textInputContainer}
                      textInputStyle={[styles.roundedTextInput, width < 400 && { height: width * 2 / 15, width: width * 2 / 15 }]}
                      handleTextChange={text => this.setState({ codeOTP: text, errors: '' }, () => console.log('text1', this.state.codeOTP))}
                      inputCount={6}
                      keyboardType="numeric"
                      defaultValue={this.state.codeOTP}
                      editable={this.state.editableOTP}
                    />
                    {!this.state.isRegistered ?
                      <View>
                        <Button
                          center={true} btn={'rgb-lg'} title="Xác thực"
                          width={width - width / 4} circle={40} color={'#f8f8f8'} vertical={35}
                          style={{ backgroundColor: '#54CEF5', height: 40, borderRadius: 5 }}
                          styleTitle={{ fontWeight: 'bold', fontSize: 14 }}
                          onPress={() => this.handleSignUpAPI()}
                        />
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
                      <View style={{ height: 20, marginTop: 30 }}>
                        <DotIndicator color={'#54CEF5'} size={6} count={8} />
                      </View>
                    }
                  </SlideLeft>
                }
              </View>
            </View>
            <Image source={AppIcon.bottomChangeGrade} style={styles.imageBottom} resizeMode={'contain'} />
          </KeyboardAwareScrollView>
          <Toast ref="toast" position={'bottom'} />
          <LoadingScreen isLoading={this.state.isLoading} bgColor={'transparent'} color={'transparent'} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewLogin: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationStyle: {
    color: '#D22D3F',
    fontSize: 13,
    textAlign: 'center',
    width: 350
  },
  textLink: {
    color: "#ffffff",
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: 'bold'
  },
  imageLogo: {
    width: 150,
    height: 150,
    marginTop: 40,
  },
  wrapLogin: {
    width: width - width / 4,
    // marginBottom: height / 12
  },
  authItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(248,242,242,0.3)',
  },
  wrapIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50
  },
  inputStyle: {
    width: 220,
    minHeight: 50,
    color: '#fff',
    paddingHorizontal: 5
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    color: 'white'
  },
  viewDotIndicator: {
    height: 30
  },
  txtTitle: { fontFamily: 'Nunito-Regular', fontSize: 16, color: '#000000', fontWeight: 'bold' },
  txtTitleForm: { paddingTop: 10, fontFamily: 'Nunito-Bold', fontSize: 14, color: '#222222', lineHeight: 19 },
  btnBack: { tintColor: '#000', width: 30, height: 30, marginLeft: 10 },
  wrapText: { flex: .9, alignItems: 'center' },
  viewPhoneUse: { marginHorizontal: 30, marginBottom: height / 3 },
  txtPhoneUes: { fontFamily: 'Nunito-Bold', fontSize: 16, lineHeight: 35 },
  txtPhoneUesDecs: { fontFamily: 'Nunito-Regular', color: '#BDBDBD', fontSize: 11 },
  txtDecsNotf: { marginTop: 20, fontSize: 12, color: '#828282', textAlign: 'center' },
  imageBottom: {
    width: width,
    height: width * global.ratioImageBottom
  },
  buttonHide: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  textInputContainer: {
    marginBottom: 0,
    padding: 0,
  },
  roundedTextInput: {
    margin: 0,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderWidth: 1,
  },
  txtErrorEmpty: {
    color: '#D22D3F',
    fontFamily: 'Nunito-Regular',
    fontSize: 11
  },
});
