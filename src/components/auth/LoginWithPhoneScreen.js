import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Keyboard,
  BackHandler,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { DotIndicator } from 'react-native-indicators';
import SplashScreen from 'react-native-splash-screen';
import Toast, { DURATION } from 'react-native-easy-toast';
import apiUser from '../../services/apiUserHelper';
import global from '../../utils/Globals';
import authStyle from '../../themes/authStyle';
import dataHelper from '../../utils/dataHelper';
import Button from '../common/Button';
import Common from '../../utils/Common';
import AnalyticsManager from '../../utils/AnalyticsManager';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authenRedirect } from '../../utils/AuthCommon';
import { LOGIN_TYPE } from '../../utils/AuthCommon';
import { saveAvatarAction } from '../../actions/userAction';
import HeaderPrimary from '../common-new/Header';
import InputPrimary from '../common-new/InputPrimary';
import { singInValidate } from '../../utils/SchemaValidate';
import Checked from '../common-new/Checked';
import TextLink from '../common-new/TextLink';
import { Row, TextValidate, SizedBox } from '../common-new/Bootstrap';
import { RFFonsize } from '../../utils/Fonts';
import AppIcon from '../../utils/AppIcon';
import { resetStateReducerAction } from '../../actions/userAction';

const { width, height } = Dimensions.get('window');

class LoginWithPhoneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoging: false,
      RememberMe: false,
      phoneNumber: '',
      passWord: '',
      socialType: '',
      socialId: '',
      socialToken: '',
      isSecureTextEntry: true,
      errors: '',
      errorEmpty: [],
      isShowKeybroad: false
    };
    this._resetForm = null;
    global.updateRemember = this.update.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getRememberPhoneAndPass();
    this.props.resetStateReducer();
    AsyncStorage.getItem('RememberMe_Onluyen').then(data => {
      if (data == 1) {
        this.setState({ RememberMe: true })
      }
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

  onSuccess = (access_token) => {
    const { GradeId, CreateBySchool, Role, codeApp = '' } = jwtDecode(access_token);
    this.setState({ isLoging: false });
    return authenRedirect(CreateBySchool, GradeId, Role, this.props.navigation);
  }

  onSignIn = (values, resetForm) => {
    Keyboard.dismiss();
    this._resetForm = resetForm;
    const userName = values.username;
    const password = values.password;
    const { RememberMe } = this.state;
    if (!Common.validatePhoneNumberOld(userName)) {
      const payload = {
        userName: userName,
        loginType: LOGIN_TYPE.USERNAME,
        password,
        rememberMe: RememberMe,
        socialId: '',
        socialToken: '',
        socialType: '',
        authorization_code: ''
      }
      this.signInUserName(payload);
    } else {
      const payload = {
        phoneNumber: userName,
        loginType: '',
        password,
        rememberMe: RememberMe,
        socialId: '',
        socialToken: '',
        socialType: ''
      };
      this.signInWithPhone(payload);
    }
  }

  signInWithPhone = async (payload) => {
    await this.setState({ isLoging: true });
    apiUser.loginPhoneV2(payload).then(response => {
      if (response != "") {
        this.handleLoginSuccess({ response, payload });
      } else {
        this.handleLoginFailure();
      }
    });
  }

  signInUserName = async (payload) => {
    await this.setState({ isLoging: true });
    let response = await apiUser.loginUserName(payload);
    if (response !== "") {
      this.handleLoginSuccess({ response, payload });
    } else {
      this.handleLoginFailure();
    }
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
    }, 1000);
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
        const payload = {
          avatar: response.avatar,
          timeCached: new Date().getTime()
        }
        this.props.saveAvatar(payload);
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
        this.setState({ isLoging: false, errors: 'Tên đăng nhập hoặc mật khẩu không chính xác !', phoneNumber: '', passWord: '' });
        this.clearTimeError();
        if (this._resetForm) {
          this._resetForm();
        }
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
    this.props.navigation.navigate('Teacher',
      {
        statusbar: 'dark-content'
      }
    );
  }

  render() {
    const {
      container,
    } = authStyle;
    const {
      isShowKeybroad,
    } = this.state;
    return (
      <SafeAreaView style={container}>
        <StatusBar />
        <HeaderPrimary showLead={false} title={'Đăng nhập'} styleTitle={styles.title} />
        <KeyboardAwareScrollView
          contentContainerStyle={styles.viewKeyboard}
          showsVerticalScrollIndicator={false}
        >
          {/* <Text style={styles.titleTea}>Giáo Viên</Text>
          <Text style={styles.teaDesc}>
            Ứng dụng hỗ trợ cho hoạt động dạy
            và học trong các trường phổ thông
            </Text> */}
          <View style={{ alignItems: 'center' }}>
            <Image source={require('../../asserts/icon/ImageLogin.png')} />
          </View>
          <TextValidate errors={this.state.errors} />
          <SizedBox height={20} />
          <Formik
            initialValues={{
              username: __DEV__ ? this.state.phoneNumber : this.state.phoneNumber,
              password: __DEV__ ? this.state.passWord : this.state.passWord,
            }}
            enableReinitialize={true}
            onSubmit={(values, { resetForm }) => this.onSignIn(values, resetForm)}
            validationSchema={singInValidate}
          >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
              <View>
                <InputPrimary
                  label={'Tên đăng nhập'}
                  placeholder={'Nhập tên đăng nhập'}
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={() => setFieldTouched('username')}
                  isValid={(touched.username && !errors.username)}
                  error={(touched.username && errors.username) && errors.username}
                />
                <InputPrimary
                  label={'Mật khẩu'}
                  placeholder={'*******'}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  isValid={(touched.password && !errors.password)}
                  error={(touched.password && errors.password) && errors.password}
                  secureTextEntry={this.state.isSecureTextEntry}
                  suffixIconAction={() => this.showPassword()}
                  suffixIcon={AppIcon.eye}
                />
                <Row>
                  <Checked
                    checked={this.state.RememberMe}
                    onPress={() => this.handleRemember()}
                    label={'Ghi nhớ đăng nhập'}
                  />
                  <TextLink title={'Quên mật khẩu'} onPress={() => this.handlerFogot()} />
                </Row>
                <SizedBox height={20} />
                {!this.state.isLoging ?
                  <Button
                    center={true}
                    title="Đăng nhập"
                    width={width - 60}
                    circle={40}
                    style={styles.btnLogin}
                    styleTitle={styles.styleTitle}
                    onPress={handleSubmit}
                  />
                  :
                  <View style={styles.viewDotIn}>
                    <DotIndicator color={'#54CEF5'} size={6} count={8} />
                  </View>
                }
              </View>
            )}
          </Formik>
          <View style={{ flex: 1 }} />
        </KeyboardAwareScrollView>
        <Toast ref="toast" position={'bottom'} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#000',
    fontWeight: 'bold'
  },
  btnLogin: {
    backgroundColor: '#54CEF5',
    height: 40,
    zIndex: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 0
  },
  viewKeyboard: {
    justifyContent: 'center',
    flexGrow: 1,
    marginHorizontal: 25,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  styleTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#FFF'
  },
  viewDotIn: {
    height: 20,
    marginTop: 8
  },
  titleTea: {
    alignSelf: 'center',
    fontFamily: "Nunito-Bold",
    fontSize: RFFonsize(28),
    lineHeight: RFFonsize(38),
    color: "#000"
  },
  teaDesc: {
    fontFamily: "Nunito",
    fontSize: RFFonsize(16),
    lineHeight: RFFonsize(22),
    color: "#000",
    textAlign: "center",
    color: "#757575",
    alignSelf: 'center',
    width: 280
  }
});

const mapStateToProps = state => {
  return {
  }
}
const mapDispatchToProps = dispatch => {
  return {
    saveAvatar: (avatar) => dispatch(saveAvatarAction(avatar)),
    resetStateReducer: () => dispatch(resetStateReducerAction()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginWithPhoneScreen);
