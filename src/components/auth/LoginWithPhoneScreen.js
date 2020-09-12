import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Platform, Keyboard,
  BackHandler, SafeAreaView, StatusBar, Dimensions, Alert
} from 'react-native';
import jwtDecode from 'jwt-decode';
import { DotIndicator } from 'react-native-indicators';
import SplashScreen from 'react-native-splash-screen';
import Toast, { DURATION } from 'react-native-easy-toast';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/FontAwesome';
import apiUser from '../../services/apiUserHelper';
import global from '../../utils/Globals';
import authStyle from '../../themes/authStyle';
import dataHelper from '../../utils/dataHelper';
import AppIcon from '../../utils/AppIcon';
import RippleButton from '../libs/RippleButton';
import Button from '../common/Button';
import Common from '../../utils/Common';
import Footer from './Footer';
import FormInput from '../common/FormInput';
import * as Messages from '../../constants/message';
import NetInfo from "@react-native-community/netinfo";
import AnalyticsManager from '../../utils/AnalyticsManager';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authenRedirect } from '../../utils/AuthCommon';
import { LOGIN_TYPE } from '../../utils/AuthCommon';
import { API_TYPE } from '../../constants/const';
import { AuthConfig } from './AuthConfig';
import FreshchatComponent from '../../utils/FreshchatComponent';

const ACCOUNTKIT = 'ACCOUNTKIT';
const ICON_SIZE = 17;
const { width, height } = Dimensions.get('window');

const configMicrosoft = {
  clientId: AuthConfig.appId,
  redirectUrl: 'graph-tutorial://react-native-auth',
  scopes: AuthConfig.appScopes,
  additionalParameters: { prompt: 'select_account' },
  serviceConfiguration: {
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  }
};


class LoginWithPhoneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoging: false,
      phoneNumber: '',
      userName: '',
      passWord: '',
      RememberMe: false,
      socialType: '',
      socialId: '',
      socialToken: '',
      isSecureTextEntry: true,
      errors: '',
      errorEmpty: [],
      isShowKeybroad: false
    };
    global.updateRemember = this.update.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getRememberPhoneAndPass();
    AsyncStorage.getItem('RememberMe_Onluyen').then(data => {
      if (data == 1) {
        this.setState({ RememberMe: true })
      }
    });
    const webClientId = API_TYPE == 3 ?
      '826468171337-oga35t90f5h5ela2gd10ivr7nmci8kgi.apps.googleusercontent.com'
      :
      '826468171337-f4at6ish835lciqds5ls1kc7pe61pscr.apps.googleusercontent.com';
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: webClientId,
      // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  getRememberPhoneAndPass() {
    dataHelper.getUserName().then(username => {
      this.setState({ phoneNumber: username, errors: '' });
      if (username !== '' && username !== null) this.setState({ RememberMe: true });
    }).catch(err => console.log('LOI CHECK LOGIN', err));

    dataHelper.getUserPass().then(userpass => {
      this.setState({ passWord: userpass });
    }).catch(err => console.log('LOI CHECK LOGIN', err));
  }

  update() {
    this.getRememberPhoneAndPass();
  }

  signInGoogle = async () => {
    try {
      this.setState({ isLoging: true });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const socialType = 'google';
      if (!_.isEmpty(userInfo)) {
        const { idToken, user } = userInfo;
        if (!_.isEmpty(user)) {
          const { id } = user;
          const payload = {
            socialId: id,
            socialToken: idToken,
            socialType: socialType
          }
          const response = await apiUser.loginWithSocial(payload);
          const { status } = response;
          if (status == 200) {
            const { display_name } = response;
            global.DisplayName = display_name;
            const { idMixpanel, userId, userName } = jwtDecode(response.access_token);
            if (!!idMixpanel && idMixpanel === Common.MixpanelToken) {
              AnalyticsManager.identify(userId);
              AnalyticsManager.trackWithProperties('Sign In', {
                "mobile": Platform.OS,
                "socialType": socialType
              });
              dataHelper.saveToken(response.access_token);
            } else {
              AnalyticsManager.createAlias(userId);
              apiUser.updateMixpanelId({ token: response.access_token, mixpanelId: Common.MixpanelToken }).then(data => {
                if (data && data.access_token) {
                  AnalyticsManager.set(jwtDecode(data.access_token));
                  AnalyticsManager.trackWithProperties('Sign Up', {
                    "mobile": Platform.OS,
                    "user": "OLD",
                    "socialType": socialType
                  });
                  dataHelper.saveToken(data.access_token);
                }
              });
            }
            if (response.avatar != null) {
              dataHelper.saveAvatar(response.avatar);
            }

            dataHelper.saveUserPost(JSON.stringify({ userName, password: '', socialType, socialId: id, socialToken: idToken, loginType: LOGIN_TYPE.SOCIAL, isPhonenumber: false }));
            this.setState({ isLoging: false, errors: '' });
            this.onSuccess(response.access_token);
          } else {
            this.myTimeErr = setTimeout(() => {
              this.setState({ isLoging: false, errors: 'Đăng nhập thất bại, bạn vui lòng thử lại sau!' });
              this.clearTimeError();
            }, 2000);
          }
        }
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.setState({ isLoging: false });
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.setState({ isLoging: false });
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState({ isLoging: false });
        // play services not available or outdated
      } else {
        // some other error happened
        this.setState({ isLoging: false, errors: 'Đăng nhập thất bại, bạn vui lòng thử lại sau!' });
      }
    }
  };


  signInFacebook = () => {
    this.setState({ isLoging: true });
    let that = this;
    LoginManager.logInWithPermissions(["public_profile"]).then((result) => {
      if (result.isCancelled) {
        this.setState({ isLoging: false });
        console.log("Login cancelled");
      } else {
        console.log(result);
        console.log(
          "Login success with permissions: " +
          result.grantedPermissions.toString()
        );
        that.requestGraph();
      }
    }
    ).catch(err => {
      this.setState({ isLoging: true });
    });
  }

  _responseInfoCallback(error, result) {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      console.log(result);
      console.log('Success fetching data: ' + result.toString());
      // id : 'dsajhdksahdsa'
    }
  }

  requestGraph = () => {
    const socialType = 'facebook';
    AccessToken.getCurrentAccessToken().then(async (token) => {
      if (!_.isEmpty(token)) {
        const { accessToken, userID } = token;
        let payload = {
          socialId: userID,
          socialToken: accessToken,
          socialType: socialType
        }
        try {
          const response = await apiUser.loginWithSocial(payload);
          const { status } = response;
          if (status == 200) {
            const { display_name } = response;
            global.DisplayName = display_name;
            const { idMixpanel, userId, userName } = jwtDecode(response.access_token);
            if (!!idMixpanel && idMixpanel === Common.MixpanelToken) {
              AnalyticsManager.identify(userId);
              AnalyticsManager.trackWithProperties('Sign In', {
                "mobile": Platform.OS,
                "socialType": socialType
              });
              dataHelper.saveToken(response.access_token);
            } else {
              AnalyticsManager.createAlias(userId);
              apiUser.updateMixpanelId({ token: response.access_token, mixpanelId: Common.MixpanelToken }).then(data => {
                if (data && data.access_token) {
                  AnalyticsManager.set(jwtDecode(data.access_token));
                  AnalyticsManager.trackWithProperties('Sign Up', {
                    "mobile": Platform.OS,
                    "user": "OLD",
                    "socialType": socialType
                  });
                  dataHelper.saveToken(data.access_token);
                }
              });
            }
            if (response.avatar != null) {
              dataHelper.saveAvatar(response.avatar);
            }

            dataHelper.saveUserPost(JSON.stringify({ userName, password: '', socialType, socialId: userID, socialToken: accessToken, loginType: LOGIN_TYPE.SOCIAL, isPhonenumber: false }));
            this.setState({ isLoging: false, errors: '' });
            this.onSuccess(response.access_token);
          } else {
            this.myTimeErr = setTimeout(() => {
              this.setState({ isLoging: false, errors: 'Đăng nhập thất bại, bạn vui lòng thử lại sau!' });
              this.clearTimeError();
            }, 2000);
          }
        } catch (error) {
          this.setState({ isLoging: false, errors: 'Đăng nhập thất bại, bạn vui lòng thử lại sau!' });
        }

      }
    })
    //Create response callback.
    // Create a graph request asking for user information with a callback to handle the response.
    const infoRequest = new GraphRequest(
      '/me',
      null,
      this._responseInfoCallback,
    );
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  signInMicrosoft = async () => {
    this.setState({ isLoging: true });
    try {
      const result = await authorize(configMicrosoft);
      const { accessToken, idToken } = result;
      if (!accessToken && !idToken) {
        this.setState({ isLoging: false, errors: 'Đăng nhập thất bại, bạn vui lòng thử lại sau!' });
        return;
      }
      const { oid } = await jwtDecode(idToken);
      const socialId = oid;
      const socialType = 'MICROSOFT';
      const socialToken = accessToken;
      const payload = {
        socialId,
        socialToken,
        socialType,
        loginType: LOGIN_TYPE.SOCIAL
      }
      const response = await apiUser.loginWithSocial(payload);
      this.handleSocialResponse(response, socialType, socialToken, socialId);
    } catch (error) {
      this.setState({ isLoging: false, errors: 'Đăng nhập thất bại, bạn vui lòng thử lại sau!' });
      console.log("signInMicrosoft -> error", error)

    }
  }

  handleSocialResponse = (response, socialType, socialToken, socialId) => {
    const { status } = response;
    if (status == 200) {
      const { display_name } = response;
      global.DisplayName = display_name;
      const { idMixpanel, userId, userName } = jwtDecode(response.access_token);
      if (!!idMixpanel && idMixpanel === Common.MixpanelToken) {
        AnalyticsManager.identify(userId);
        AnalyticsManager.trackWithProperties('Sign In', {
          "mobile": Platform.OS,
          "socialType": socialType
        });
        dataHelper.saveToken(response.access_token);
      } else {
        AnalyticsManager.createAlias(userId);
        apiUser.updateMixpanelId({ token: response.access_token, mixpanelId: Common.MixpanelToken }).then(data => {
          if (data && data.access_token) {
            AnalyticsManager.set(jwtDecode(data.access_token));
            AnalyticsManager.trackWithProperties('Sign Up', {
              "mobile": Platform.OS,
              "user": "OLD",
              "socialType": socialType
            });
            dataHelper.saveToken(data.access_token);
          }
        });
      }
      if (response.avatar != null) {
        dataHelper.saveAvatar(response.avatar);
      }

      dataHelper.saveUserPost(JSON.stringify({ userName: '', password: '', socialType, socialId: socialId, socialToken: socialToken, loginType: LOGIN_TYPE.SOCIAL }));
      this.setState({ isLoging: false, errors: '' });
      this.onSuccess(response.access_token);
    } else {
      this.myTimeErr = setTimeout(() => {
        this.setState({ isLoging: false, errors: 'Đăng nhập thất bại, bạn vui lòng thử lại sau!' });
        this.clearTimeError();
      }, 2000);
    }
  }

  onSuccess = (access_token) => {
    const { GradeId, CreateBySchool, Role, codeApp = '' } = jwtDecode(access_token);
    this.setState({ isLoging: false });
    return authenRedirect(CreateBySchool, GradeId, Role, this.props.navigation);
  }

  _handleValidation = () => {
    var result = true;
    const { errorEmpty } = this.state;
    _.forEach(['phoneNumber', 'passWord'], item => {
      if (_.isEmpty(this.state[item]) && item === 'phoneNumber') {
        errorEmpty[item] = 'Tên đăng nhập không được để trống'
        result = false;
      } if (_.isEmpty(this.state[item]) && item === 'passWord') {
        errorEmpty[item] = 'Mật khẩu không được để trống'
        result = false;
      }
      this.setState({ errorEmpty });
    });
    return result;
  }

  checkLoginType(authorizationCode = "") {
    Keyboard.dismiss();
    const phone = this.state.phoneNumber;
    const password = this.state.passWord;
    let loginType = LOGIN_TYPE.PHONE;
    const rememberMe = this.state.RememberMe;
    const socialId = "";
    const socialToken = "";
    const socialType = "";
    const authorization_code = authorizationCode;
    const phoneNumber = Common.convertPhoneOldToNew(phone);

    if (authorizationCode) {
      this.loginApi({
        userName: phoneNumber,
        loginType: LOGIN_TYPE.APPLE,
        password: "",
        rememberMe,
        socialId: "",
        socialToken: "",
        socialType: LOGIN_TYPE.APPLE,
        authorization_code
      });
      return;
    }

    if (this._handleValidation()) {
      // login bang email
      if (!Common.validatePhoneNumberOld(phone)) {
        NetInfo.fetch().then((connectionInfo) => {
          if (connectionInfo.type !== 'none') {
            this.setState({ isLoging: true }, () => {
              loginType = LOGIN_TYPE.USERNAME;
              // dang nhap bang username
              const payload = {
                userName: phoneNumber,
                loginType: LOGIN_TYPE.USERNAME,
                password,
                rememberMe,
                socialId,
                socialToken,
                socialType,
                authorization_code
              }
              this.loginApi(payload);
            });
          } else {
            this.setState({ isLoging: false, errors: '' });
            try {
              this.refs.toast.show('Không có kết nối internet', DURATION.LENGTH_LONG);
            } catch (error) {
              return;
            }
          }
        });
      } else {
        // login bang so dien thoai
        NetInfo.fetch().then((connectionInfo) => {
          if (connectionInfo.type !== 'none') {
            this.setState({ isLoging: true }, () => {
              const payload = { phoneNumber, loginType, password, rememberMe, socialId, socialToken, socialType }
              apiUser.loginPhoneV2(payload).then(response => {
                if (response != "") {
                  this.handleLoginSuccess({ response, payload });
                } else {
                  this.handleLoginFailure();
                }
              });
            });
          } else {
            this.setState({ isLoging: false, errors: '' });
            try {
              this.refs.toast.show('Không có kết nối internet', DURATION.LENGTH_LONG);
            } catch (error) {
              return;
            }
          }
        });
      }
    }
  }

  loginApi = (payload) => {
    apiUser.loginUserName(payload).then(response => {
      if (response !== "") {
        this.handleLoginSuccess({ response, payload });
      } else {
        this.handleLoginFailure();
      }
    });
  }

  handleLoginFailure = () => {
    this.myTimeErr = setTimeout(() => {
      this.setState({ isLoging: false, errors: '' });
      this.clearTimeError();
      try {
        this.refs.toast.show('Đăng nhập thất bại !', 3000);
      } catch (error) {
        return;
      }
    }, 2000);
  }

  handleLoginSuccess = ({ response, payload }) => {
    const { phoneNumber, password, loginType } = payload;
    const { RememberMe } = this.state;
    const { status } = response;
    if (status == 200) {
      dataHelper.saveToken(response.access_token);
      const { idMixpanel, userId, userName } = jwtDecode(response.access_token);
      console.log(userId);
      if (!!idMixpanel && idMixpanel === Common.MixpanelToken) {
        AnalyticsManager.identify(userId);
        AnalyticsManager.trackWithProperties('Sign In', {
          "mobile": Platform.OS
        });
      } else {
        AnalyticsManager.createAlias(userId);
        apiUser.updateMixpanelId({ token: response.access_token, mixpanelId: Common.MixpanelToken }).then(data => {
          if (data && data.access_token) {
            dataHelper.saveToken(data.access_token);
            AnalyticsManager.set(jwtDecode(data.access_token));
            AnalyticsManager.trackWithProperties('Sign Up', {
              "mobile": Platform.OS,
              "user": "OLD"
            });
          }
        });
      }
      if (response.avatar != null) {
        dataHelper.saveAvatar(response.avatar);
      }
      if (RememberMe) {
        dataHelper.saveUserName(loginType == "Username" ? userName : phoneNumber);
        dataHelper.saveUserPass(password);
      } else {
        dataHelper.saveUserName('');
        dataHelper.saveUserPass('');
      }
      dataHelper.saveUserPost(JSON.stringify(payload));
      this.setState({ isLoging: true, errors: '' });
      this.onSuccess(response.access_token);
    } else {
      this.myTimeErr = setTimeout(() => {
        this.setState({ isLoging: false, errors: 'Tên đăng nhập hoặc mật khẩu không chính xác !' });
        this.clearTimeError();
      }, 2000);
    }
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  showPassword() {
    this.setState({
      isSecureTextEntry: !this.state.isSecureTextEntry
    });
  }

  handleRemember() {
    if (!this.state.RememberMe) {
      this.setState({ RememberMe: !this.state.RememberMe }, async () => {
        await AsyncStorage.setItem('RememberMe_Onluyen', '1')
      });
    } else {
      this.setState({ RememberMe: !this.state.RememberMe }, async () => {
        await AsyncStorage.removeItem('RememberMe_Onluyen');
      });
    }
  }

  handlerFogot() {
    this.setState({
      RememberMe: false
    },
      () => this.props.navigation.navigate('V_Forgot', { email: this.state.userName, statusbar: 'dark-content' })
    )
  }

  gotoSignUp() {
    this.props.navigation.pop();
    this.props.navigation.navigate('V_SignUp', { statusbar: 'dark-content' });
  }

  goBack() {
    this.props.navigation.goBack();
  }

  clearTimeError() {
    if (this.myTimeErr) {
      clearTimeout(this.myTimeErr);
      this.myTimeErr = null;
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.clearTimeError();
  }

  _keyboardDidShow = () => {
    this.setState({ isShowKeybroad: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isShowKeybroad: false });
  }

  check = () => {
    this.props.navigation.navigate('Teacher', { statusbar: 'dark-content' });
  }

  render() {
    const { container, viewLogin, backArrow,
      textLink, validationStyle } = authStyle;
    const { isShowKeybroad, errorEmpty, phoneNumber, passWord, errors } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar />
        <SafeAreaView style={container}>
          <View style={[backArrow, { paddingTop: Platform.OS === 'android' ? 20 : null }]}>
            <View style={styles.wrapTitle}>
              <Text style={styles.txtTitle}>Đăng nhập</Text>
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
            <View style={[{ alignItems: 'center', marginTop: 0.02 * height }, (errors) && { marginTop: 0 }]}>
              <Image source={require('../../asserts/images/image_login.png')} resizeMode={'contain'} style={{ width: height / 4 * 981 / 617, height: height / 4 }} />
            </View>
            <Text style={[validationStyle, { marginBottom: 15 }]}>{this.state.errors}</Text>
            <View style={[viewLogin, { flex: 1 }]}>
              <Text style={{ color: '#828282', fontFamily: 'Nunito-Bold', fontSize: 14, lineHeight: 19 }}>Tên đăng nhập</Text>
              <FormInput
                paddingTopContent={4}
                borderRadius={5}
                borderWidth={0.5}
                borderColor={'#333030'}
                onChangeText={text => this.setState({
                  errors: '',
                  phoneNumber: text,
                  errorEmpty: [],
                })}
                value={this.state.phoneNumber}
                placeholder={'Email hoặc số điện thoại'}
                keyboardType={'email-address'}
                height={40}
                bgColor='#FFF'
              />
              {(errorEmpty.phoneNumber && !phoneNumber) && (<View><Text style={styles.txtErrorEmpty} >{errorEmpty.phoneNumber}</Text></View>)}
              <Text style={{ paddingTop: 10, color: '#828282', fontFamily: 'Nunito-Bold', fontSize: 14, lineHeight: 19 }}>Mật khẩu</Text>
              <FormInput
                paddingTopContent={4}
                height={40}
                borderRadius={5}
                borderWidth={0.5}
                borderColor={'#333030'}
                secureTextEntry={this.state.isSecureTextEntry}
                onChangeText={text => this.setState({
                  errors: '',
                  passWord: text,
                  errorEmpty: [],
                })}
                value={this.state.passWord}
                placeholder={'Mật khẩu'}
                isShowPassword={true}
                actionIcon={AppIcon.icon_eye}
                onSubmitEditing={Keyboard.dismiss}
                isSecureTextEntry={this.state.isSecureTextEntry}
                showPassword={() => this.showPassword()}
                bgColor='#FFF'
              />
              {(errorEmpty.passWord && !passWord) && (<View><Text style={styles.txtErrorEmpty}>{errorEmpty.passWord}</Text></View>)}
              <View style={styles.wrapbottom}>
                <TouchableOpacity style={styles.buttonRemember} onPress={() => this.handleRemember()}>
                  <View style={styles.wrapButtonRemember}>
                    {this.state.RememberMe ?
                      <Icon name="check" color={'#828282'} size={12} /> :
                      <View />
                    }
                  </View>
                  <Text style={{ color: '#828282', fontSize: 12, fontFamily: 'Nunito-Regular' }}>Ghi nhớ đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handlerFogot()}>
                  <Text style={[textLink, {
                    textDecorationLine: 'underline',
                    fontSize: 12,
                    color: '#56CCF2',
                    fontFamily: 'Nunito-Regular'
                  }]}>Quên mật khẩu</Text>
                </TouchableOpacity>
              </View>
              {!this.state.isLoging ?
                <Button
                  center={true} btn={'rgb'} title="Đăng nhập"
                  width={width - width / 5} circle={40}
                  style={styles.btnLogin}
                  styleTitle={{ fontWeight: 'bold', fontSize: 14, color: '#FFF' }}
                  onPress={() => this.checkLoginType()}
                />
                :
                <View style={{ height: 20, marginTop: 8 }}>
                  <DotIndicator color={'#54CEF5'} size={6} count={8} />
                </View>
              }
              {/* {__DEV__ && <>
                <View style={styles.wrapOr}>
                  <View style={styles.lineHeight} />
                  <Text style={styles.txtOr}> hoặc </Text>
                  <View style={styles.lineHeight} />
                </View>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.wrapBtnGoogle}
                    onPress={this.signInGoogle}
                  >
                    <Image source={AppIcon.icon_google} resizeMode={'contain'} style={{ marginHorizontal: 15 }} />
                    <Text style={styles.txtBtnGoogle}>Đăng nhập Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.wrapBtnFacebook}
                    onPress={this.signInFacebook}
                  >
                    <Image source={AppIcon.icon_face} resizeMode={'contain'} style={{ marginHorizontal: 8 }} />
                    <Text style={styles.txtBtnFace}>Đăng nhập Facebook</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ margin: 10 }} />
              </>} */}
            </View>
            {/* {
              Platform.OS === 'android' &&
              <Footer
                link={Messages.FOOTER_TITLE_SIGNIN}
                onPress={this.gotoSignUp.bind(this)}
              />
            } */}
            {/* <TouchableOpacity onPress={this.gotoSignUp.bind(this)}>
              <Text style={{ marginBottom: 21, textAlign: 'center', color: '#56CCF2', textDecorationLine: 'underline', fontSize: 12, fontFamily: 'Nunito-Regular' }}>Đăng ký tài khooản</Text>
            </TouchableOpacity> */}
          </KeyboardAwareScrollView>
          <Toast ref="toast" position={'bottom'} />
        </SafeAreaView>
        <FreshchatComponent />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: height <= 592 ? 0 : height / 8,
    zIndex: 10,
  },
  containerAware: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  imageLogo: {
    width: 150,
    height: 150
  },
  buttonHide: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  wrapbottom: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonRemember: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wrapButtonRemember: {
    width: 16,
    height: 16,
    borderWidth: 0.5,
    borderColor: '#828282',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    borderRadius: 5,
  },
  txtErrorEmpty: {
    color: '#D22D3F',
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
  },
  btnBack: {
    tintColor: '#FFFFFF',
    width: 30,
    height: 30,
    marginLeft: 10
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#000',
  },
  wrapTitle: {
    flex: 1,
    alignItems: 'center'
  },
  viewDot: {
    borderWidth: 2,
    borderRadius: 50,
    width: 5, height: 5,
    alignSelf: 'center',
    borderColor: '#E0E0E0',
    marginRight: 10
  },
  btnLogin: {
    backgroundColor: '#2D9CDB',
    height: 40,
    zIndex: 10,
    borderRadius: 5,
    marginTop: 10
  },
  imageBottom: {
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
    width: width,
    height: width * global.ratioImageBottom
  },
  wrapOr: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: '2%'
  },
  lineHeight: {
    borderColor: '#E0E0E0',
    width: '30%',
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: 'center',
    marginHorizontal: 5
  },
  wrapBtnGoogle: {
    height: 40,
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    backgroundColor: '#E3E3E3'
  },
  wrapBtnFacebook: {
    height: 40,
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    backgroundColor: '#395185'
  },
  txtBtnGoogle: {
    fontSize: width > 380 ? 12 : 10,
    fontFamily: 'Nunito-Regular',
    color: '#1976D2'
  },
  txtBtnFace: {
    fontSize: width > 380 ? 12 : 10,
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
  },
  txtOr: {
    color: '#C4C4C4',
    fontSize: width > 380 ? 16 : 14,
    fontFamily: 'Nunito-Regular'
  }
});

export default LoginWithPhoneScreen;