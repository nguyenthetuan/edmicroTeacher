import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
Icon.loadFont();
import IconEntypo from 'react-native-vector-icons/Entypo';
IconEntypo.loadFont();
import RippleButton from '../libs/RippleButton';
import AppIcon from '../../utils/AppIcon';
import SlideLeft from '../anim/SlideLeft';
import HeaderNavigation from '../common-new/HeaderNavigation';
import Common from '../../utils/Common';
import global from '../../utils/Globals';
import authStyle from '../../themes/authStyle';
import LoadingScreen from '../libs/LoadingScreen';
import FormInput from '../common/FormInput';
import OTPTextView from '../common/InputOTP';
import _ from 'lodash'
import { DotIndicator } from 'react-native-indicators';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import apiUser from '../../services/apiUserHelper';
import { WOOPS_ERROR } from '../../constants/message';
import dataHelper from '../../utils/dataHelper';
import Mixpanel from 'react-native-mixpanel';
import jwtDecode from 'jwt-decode';
import { NavigationActions, StackActions } from 'react-navigation';
import Toast, { DURATION } from 'react-native-easy-toast';
import { PHONE_DEBUG } from '../../constants/const';
import { getUserByToken } from '../../utils/Helper';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');
const description = 'Việc cập nhật số điện thoại sẽ giúp bảo mật tài khoản và để cấp lại mật khẩu nếu bạn quên mật khẩu.'
export default class UpdatePhoneScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      phoneNumber: '',
      inputOtpVisible: false,
      errors: '',
      codeOTP: '',
      projectId: 'onluyen-a2989',
      isShowKeybroad: false,
      isEditPhone: true,
      updateSuccess: false,
      confirmResult: null,
      editableOTP: true,
      secureTextEntry: false
    };
    this.unsubscribe = null;
    this.unsubscribeToken = null;
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
        await this.setState({
          secureTextEntry: true,
          codeOTP: '******'
        });
        this.handleUpdate();
      }
    });
    this.keyboardDidShowListener = Keyboard.addListener
      (
        'keyboardDidShow',
        this._keyboardDidShow
      );
    this.keyboardDidHideListener = Keyboard.addListener
      (
        'keyboardDidHide',
        this._keyboardDidHide
      );
    BackHandler.addEventListener('hardwareBackPress', () => {
      return false;
    });
    try {
      const phone = this.props.user.phoneNumber;
      const phoneNumber = (
        phone.startsWith('84')
        && phone.length > 10)
        ?
        `${phone.replace('84', '0')}`
        :
        phone;
      this.setState({
        phoneNumber: phoneNumber
      });
    } catch (error) {

    }
  }

  onChangeTextPhoneNumber = text => this.setState({
    phoneNumber: text,
    errors: ''
  })

  _keyboardDidShow = () => {
    this.setState({ isShowKeybroad: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isShowKeybroad: false });
  }

  handleBtnBack = (isShowKeybroad) => () => {
    if (isShowKeybroad) {
      Keyboard.dismiss()
    } else {
      this.props.navigation.goBack();
    }
  }

  updateWithPhone = async (phone) => {
    const phoneVerify = Common.fomatPhoneVerify(phone);
    try {
      let confirmResult = await auth().signInWithPhoneNumber(phoneVerify);
      this.verificationId = confirmResult._verificationId;
      await this.setState({
        inputOtpVisible: true,
        isLoading: false,
        errors: ''
      });
    } catch (error) {
      this.updateFailed(error, phone);
    }
    // return;
    // // const confirmation = await auth().signInWithPhoneNumber(phoneVerify);
    // if (auth().currentUser) {
    //     auth().signOut();
    // }
    return;
    auth()
      .verifyPhoneNumber(phoneVerify)
      .on('state_changed', async (phoneAuthSnapshot) => {
        switch (phoneAuthSnapshot.state) {
          //  IOS AND ANDROID EVENTS
          case auth.PhoneAuthState.CODE_SENT: // or 'sent'
            console.log('code sent');
            this.setState({ inputOtpVisible: true, isLoading: false, errors: '' });
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
        this.updateFailed(error, phone);
        console.log(error.verificationId);
      }, async (phoneAuthSnapshot) => {
        console.log(phoneAuthSnapshot);
        const { verificationId, state, code } = phoneAuthSnapshot;
        try {
          if (state == auth.PhoneAuthState.AUTO_VERIFIED) {
            await this.setState({ editableOTP: false, codeOTP: code });
            setTimeout(async () => {
              let currentUser = await auth().currentUser;
              alert(JSON.stringify(currentUser));
            }, 10000);
            // const currentUser = await auth().currentUser;
            // this.verificationId = await currentUser.getIdToken();
            // auth().currentUser.getIdToken().then(idToken => {
            //     alert(idToken);
            //     this.verificationId = idToken;
            //     // this.handleUpdate();
            // });
            // this.verificationId = currentUser.getIdToken();
            // alert(this.verificationId);
            // this.handleUpdate();

          }
          else {
            this.verificationId = verificationId;
          }
        } catch (error) {
          alert(error);
        }
      });
  }

  resendOTP = async () => {
    this.otp.onClear();
    const { phoneNumber } = this.state;
    await this.setState({
      isLoading: true,
      codeOTP: '',
      errors: '',
      secureTextEntry: false
    });
    this.updateWithPhone(phoneNumber);
  }

  updateFailed = (error, phoneNumber) => {
    let message = Common.getMessageConfirmResult(error, phoneNumber);
    this.setState({
      isLoading: false,
      phoneNumber: '',
      errors: message,
      secureTextEntry: false
    });
  }

  handleUpdate = async () => {
    try {
      const {
        codeOTP,
        projectId,
        phoneNumber,
        confirmResult
      } = this.state;
      if (codeOTP.trim().length <= 0) {
        this.setState({ errors: 'Mã OTP không được để trống!' });
        return;
      }
      if (codeOTP.trim().length !== 6) {
        this.setState({ errors: 'Mã OTP không hợp lệ!' });
        return;
      }

      if (!this.verificationId) {
        this.otp.onClear();
        this.setState({ errors: 'Mã OTP không chính xác', codeOTP: '' });
        return;
      }

      this.setState({
        errors: '',
        isLoading: true
      });
      const data = await dataHelper.getToken();
      const phone = Common.formatPhoneNumber(phoneNumber);
      const dataSubmit = {
        codeOTP: codeOTP,
        token: this.verificationId,
        projectId: projectId,
        phoneNumber: phone,
        phoneCountry: "+84",
        access_token: data.token
      }
      const response = await apiUser.updatePhone(dataSubmit);


      if (response != '') {
        const { status } = response;
        if (status == 200) {
          dataHelper.saveToken(response.access_token);
          if (response.avatar != null) {
            dataHelper.saveAvatar(response.avatar);
          }
          const payload = getUserByToken(response.access_token);
          this.props.makeRequestProfile(payload);
          this.refs.toast.show('Cập nhập số điện thoại thành công!', 600, () => {
            this.props.navigation.goBack();
            console.log('update success')
          });
        } else {
          this.otp.onClear();
          this.setState({
            editableOTP: true,
            codeOTP: '',
            isLoading: false,
            secureTextEntry: false,
            errors: response.message || WOOPS_ERROR
          });
        }
      } else {
        this.otp.onClear();
        this.setState({
          isLoading: false,
          codeOTP: '',
          secureTextEntry: false,
          errors: 'Mã OTP không chính xác'
        });

      }
    } catch (error) {
      const { phoneNumber } = this.state;
      console.log(error);
      this.updateFailed(error, phoneNumber);
    }
  }

  showInputOTP = () => {
    const phoneNumber = this.state.phoneNumber;

    if (_.isEmpty(phoneNumber)) {
      this.setState({ errors: 'Số điện thoại không được để trống' });
    } else if (!Common.validatePhoneNumberV2(phoneNumber)) {
      this.setState({ errors: 'Số điện thoại không hợp lệ !' });
    } else {
      this.setState({ errors: '', isLoading: true }, () => {
        this.updateWithPhone(phoneNumber);
      });
    }
  }

  goToMain = () => {
    this.props.navigation.navigate('App', { statusbar: 'dark-content', });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', () => {
      return false;
    });
  }

  render() {

    const {
      phoneNumber,
      isShowKeybroad,
      isEditPhone,
      inputOtpVisible,
      updateSuccess
    } = this.state;
    const {
      backArrow,
      textAction,
      validationStyle,
      container
    } = authStyle;
    return (
      <SafeAreaView
        style={[
          container,
          { backgroundColor: '#FFF' }
        ]}
      >
        <StatusBar />
        <View style={{ flex: 1 }}>
          <HeaderNavigation
            title={!this.state.inputOtpVisible ? 'Cập nhật số điện thoại' : 'Xác thực'}
            navigation={this.props.navigation}
            goBack={this.handleBtnBack(isShowKeybroad)}
            color={'#979797'}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            showsVerticalScrollIndicator={false}>
            {
              updateSuccess
                ?
                <View style={{ flex: 1 }}>
                  <SlideLeft>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <FastImage
                        source={require('../../asserts/images/success_update_phone.png')}
                        style={{ marginTop: height / 10 }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Nunito-Bold',
                          textTransform: 'uppercase',
                          color: '#000'
                        }}>Chào mừng bạn đến với ôn luyện</Text>
                      </View>
                      <RippleButton
                        color={'#ddd'}
                        onPress={this.goToMain}
                        style={styles.btnLaylaimk}>
                        <Text style={[textAction, { textTransform: 'uppercase', }]}>Bắt đầu</Text>
                      </RippleButton>
                    </View>
                  </SlideLeft>
                </View>
                :
                <View style={{ flex: 1 }}>
                  <View>
                    {
                      !inputOtpVisible
                        ?
                        <View style={{ alignItems: 'center', marginTop: 0.02 * height }}>
                          {/* <Image source={require('../../asserts/images/image_login.png')} /> */}
                        </View>
                        :
                        null
                    }
                    {
                      _.isEmpty(this.state.errors) ?
                        <Text style={[validationStyle, { marginVertical: 20, width: width - width / 5, textAlign: 'center', color: '#757575' }]}>{description}</Text>
                        :
                        <Text style={[validationStyle, { marginVertical: 20, width: width - width / 5, textAlign: 'center' }]}>{this.state.errors}</Text>
                    }

                    {
                      !inputOtpVisible ?
                        <View style={{ width: width - width / 5, alignSelf: 'center' }}>
                          <Text style={styles.txtTitleForm}>Số điện thoại</Text>
                          <FormInput
                            paddingTopContent={4}
                            height={40}
                            onChangeText={this.onChangeTextPhoneNumber}
                            borderWidth={0.5}
                            borderColor={'#54CEF5'}
                            keyboardType={'phone-pad'}
                            borderRadius={5}
                            editable={isEditPhone}
                            value={phoneNumber}
                            placeholder={'Số điện thoại'}
                          />
                          {
                            !this.state.isLoading
                              ?
                              <RippleButton
                                color={'#ddd'}
                                onPress={this.showInputOTP}
                                style={styles.btnLaylaimk}>
                                <Text style={textAction}>Cập nhật</Text>
                              </RippleButton>
                              :
                              <View style={{ height: 20, marginTop: 20, width: 320 }}>
                                <DotIndicator color={'#54CEF5'} size={6} count={8} />
                              </View>
                          }
                        </View>
                        :
                        <View>
                          <Text style={{
                            marginBottom: 20, color: '#222222',
                            fontFamily: 'Nunito-Bold', fontSize: 15
                          }}>
                            Nhập mã OTP
                            </Text>
                          <OTPTextView
                            ref={ref => this.otp = ref}
                            containerStyle={styles.textInputContainer}
                            textInputStyle={styles.roundedTextInput}
                            handleTextChange={text => this.setState({
                              codeOTP: text,
                              errors: ''
                            },
                              () => console.log('text1', this.state.codeOTP))}
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
                                  onPress={this.handleUpdate}
                                  style={styles.btnCreate}
                                >
                                  <Text style={textAction}>Xác thực</Text>
                                </RippleButton>
                                <View style={{ marginTop: 30, flexDirection: 'row', justifyContent:'space-around' }}>
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
            }
            <View>
              <Image
                source={AppIcon.bottomChangeGrade}
                style={styles.imageBottom}
                resizeMode={'contain'}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
        <Toast ref="toast" position={'bottom'} />
        <LoadingScreen
          isLoading={this.state.isLoading}
          bgColor={'transparent'}
          color={'transparent'}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  txtTitleForm: {
    marginTop: (height / width),
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#222222',
    lineHeight: 19,
    marginBottom: 3
  },
  txtTitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16, color: '#000000',
    fontWeight: 'bold'
  },
  btnBack: {
    tintColor: '#000',
    width: 30,
    height: 30,
    marginLeft: 10
  },
  btnCreate: {
    backgroundColor: '#2D9CDB',
    width: width - width / 5,
    height: 40,
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnLaylaimk: {
    backgroundColor: '#2D9CDB',
    width: width - width / 5,
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtDecsMK: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: "#ddd",
    position: 'absolute',
    bottom: -20, left: 5
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
    marginBottom: 0,
    padding: 0,
    fontSize: 10,
    width: width - width / 5
  },
  roundedTextInput: {
    margin: 0,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderWidth: 1,
    // height: 35,
    //width: 35,
  },
  txtErrorEmpty: {
    color: '#D22D3F',
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
  },
  txtSkip: {
    color: '#828282',
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    marginEnd: 6
  },
  btnSkip: {
    marginTop: 12,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },  
  textAction:{
    marginTop: 14,
    marginBottom:14
  }
})