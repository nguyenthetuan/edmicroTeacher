import React, { Component } from 'react';
import { Platform, View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Keyboard, SafeAreaView, Dimensions } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Formik } from 'formik';
import dataHelper from '../../utils/dataHelper';
import HeaderNavigation from '../common/HeaderNavigation';
import LoadingScreen from '../libs/LoadingScreen';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { mainStyle } from '../../themes';
import { changePasswordAction } from '../../actions/userAction';
import { connect } from 'react-redux';
import { RFFonsize } from '../../utils/Fonts';
import {
  PASS_PRESENT_PLACE, PASS_RENEW_PLACE, PASS_NEW_PLACE, TITLE_HEADER_PASSWORD, BUTTON_UPDATE_PASS,
  CHANGE_PASSWORD_FAILD_MSG, CHANGE_PASSWORD_SUCCESS_MSG
} from '../../constants/message';
import _ from 'lodash';
import { changePasswordValidate } from '../../utils/SchemaValidate';

const { width, height } = Dimensions.get('window');
class ChangePassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      passwordNew: '',
      passwordOld: '',
      passwordNewAgain: '',
      isChange: false,
      errorValidate: '',
      isSecureTextEntry: true,
      errorEmpty: []
    };
  }

  showPassword() {
    Keyboard.dismiss();
    this.setState({
      isSecureTextEntry: !this.state.isSecureTextEntry
    });
  }

  changePassword(values, resetForm) {
    Keyboard.dismiss();
    const { passwordOld, passwordNew } = values;
    const { passwordNewAgain, errorEmpty } = this.state;
    this.setState({
      isChange: true,
    }, () => {
      dataHelper.getToken().then(({ token, userName }) => {
        new Promise((resolve, reject) => {
          this.props.makeRequestchangePassword({ token, userName, passwordNew, passwordOld, resolve, reject });
        }).then(response => {
          if (response.status === 200) {
            this.refs.toast.show(CHANGE_PASSWORD_SUCCESS_MSG, DURATION.LENGTH_LONG);
            dataHelper.saveUserPass('');
            dataHelper.saveUserPost('');
            this.props.navigation.goBack(null);
          } else {
            this.setState({ errorValidate: response.message, isChange: false },
              () => {
                resetForm();
                this.timeOut = setTimeout(() => this.setState({ passwordNew: '', passwordOld: '', passwordNewAgain: '', errorValidate: '' }), 3000)
              }
            );
            return;
          }
          this.setState({ passwordNew: '', passwordOld: '', passwordNewAgain: '', errorValidate: '', isChange: false });
        }).catch(err => {
          resetForm();
          this.refs.toast.show(CHANGE_PASSWORD_FAILD_MSG, DURATION.LENGTH_LONG);
          this.setState({ passwordNew: '', passwordOld: '', passwordNewAgain: '', errorValidate: '', isChange: false });
        });
      });
    });
  }

  componentWillUnmount() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
  }

  render() {
    const {
      passwordOld,
      errorEmpty,
      passwordNew,
      passwordNewAgain
    } = this.state;
    return (

      <View style={[mainStyle.container, { backgroundColor: '#FFF' }]} >
        <HeaderNavigation
          navigation={this.props.navigation}
          title={TITLE_HEADER_PASSWORD}
          bgColor={'#2D9CDB'} colorIcon={'#FFF'}
          styleTitle={styles.styleTitle}
          back={true}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flex: 1, width: '85%' }}>
              <Text style={[mainStyle.headerTextValidate, { marginTop: 15 }]}>{this.state.errorValidate}</Text>
              <Formik
                initialValues={{
                  passwordOld: __DEV__ ? this.state.passwordOld : this.state.passwordOld,
                  passwordNew: __DEV__ ? this.state.passwordNew : this.state.passwordNew,
                  passwordNewAgain: __DEV__ ? this.state.passwordNewAgain : this.state.passwordNewAgain,
                }}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => this.changePassword(values, resetForm)}
                validationSchema={changePasswordValidate}
              >
                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                  <View style={{ marginTop: 50 }}>

                    <InputPrimary
                      label={'Mật khẩu hiện tại'}
                      placeholder={'Nhập mật khẩu hiện tại'}
                      value={values.passwordOld}
                      onChangeText={handleChange('passwordOld')}
                      onBlur={() => setFieldTouched('passwordOld')}
                      secureTextEntry
                      isValid={(touched.passwordOld && !errors.passwordOld)}
                      error={(touched.passwordOld && errors.passwordOld) && errors.passwordOld}
                    />
                    <InputPrimary
                      label={'Mật khẩu mới'}
                      placeholder={'Nhập mật khẩu mới'}
                      value={values.passwordNew}
                      onChangeText={handleChange('passwordNew')}
                      onBlur={() => setFieldTouched('passwordNew')}
                      secureTextEntry
                      isValid={(touched.passwordNew && !errors.passwordNew)}
                      error={(touched.passwordNew && errors.passwordNew) && errors.passwordNew}
                    />
                    <InputPrimary
                      label={'Xác thực mật khẩu'}
                      placeholder={'Nhập lại mật khẩu mới'}
                      value={values.passwordNewAgain}
                      onChangeText={handleChange('passwordNewAgain')}
                      onBlur={() => setFieldTouched('passwordNewAgain')}
                      secureTextEntry
                      isValid={(touched.passwordNewAgain && !errors.passwordNewAgain)}
                      error={(touched.passwordNewAgain && errors.passwordNewAgain) && errors.passwordNewAgain}
                    />
                    <Button
                      vertical={10}
                      center={true}
                      title={BUTTON_UPDATE_PASS}
                      width={'100%'} circle={40}
                      style={{ backgroundColor: '#2D9CDB', height: 40 }}
                      styleTitle={{ fontSize: RFFonsize(16), fontFamily: 'Nunito-Regular', }}
                      onPress={handleSubmit}
                    // onPress={this.changePassword.bind(this)}
                    />
                  </View>

                )}
              </Formik>



              {/* <View style={{ marginTop: 20 }}>
                <Text style={{ paddingTop: 10, color: '#222222', fontFamily: 'Nunito-Bold', fontSize: 15, lineHeight: 19 }}>Mật khẩu hiện tại</Text>
                <FormInput
                  paddingTopContent={4}
                  borderRadius={5}
                  borderWidth={1}
                  height={38}
                  placeholder='Mật khẩu hiện tại'
                  value={this.state.passwordOld}
                  secureTextEntry={this.state.isSecureTextEntry}
                  onChangeText={text => this.setState({
                    passwordOld: text,
                    errorEmpty: [],
                  })}
                  styleLabel={styles.styleLabel}
                />
              </View> */}
              {/* {(errorEmpty.passwordOld) && (<View><Text numberOfLines={1} style={styles.txtErrorEmpty} >{errorEmpty.passwordOld}</Text></View>)} */}
              {/* <Text style={{ paddingTop: 10, color: '#222222', fontFamily: 'Nunito-Bold', fontSize: 15, lineHeight: 19 }}>Mật khẩu mới</Text> */}
              {/* <FormInput
                paddingTopContent={4}
                borderRadius={5}
                borderWidth={1}
                height={38}
                placeholder={PASS_NEW_PLACE}
                value={this.state.passwordNew}
                secureTextEntry={this.state.isSecureTextEntry}
                onChangeText={text => this.setState({
                  passwordNew: text,
                  errorEmpty: [],
                })}
                styleLabel={styles.styleLabel}
              /> */}
              {/* {errorEmpty.passwordNew && (<View><Text numberOfLines={1} style={styles.txtErrorEmpty} >{errorEmpty.passwordNew}</Text></View>)} */}
              {/* <Text style={{ paddingTop: 10, color: '#222222', fontFamily: 'Nunito-Bold', fontSize: 15, lineHeight: 19 }}>Nhập lại mật khẩu mới</Text> */}
              {/* <FormInput
                paddingTopContent={4}
                borderRadius={5}
                borderWidth={1}
                height={38}
                placeholder={PASS_RENEW_PLACE}
                value={this.state.passwordNewAgain}
                secureTextEntry={this.state.isSecureTextEntry}
                onChangeText={text => this.setState({
                  passwordNewAgain: text,
                  errorEmpty: [],
                })}
                styleLabel={styles.styleLabel}
              /> */}
              {/* {(errorEmpty.passwordNewAgain) && (<View><Text numberOfLines={1} style={styles.txtErrorEmpty} >{errorEmpty.passwordNewAgain}</Text></View>)} */}
            </View>
          </View>
          {this.state.isChange &&
            <LoadingScreen isLoading={true} bgColor={'transparent'} />
          }
        </ScrollView>
        {/* <View behavior="position" enabled={true} style={{ zIndex: 0, paddingBottom: height / 16 }}>
          <Button
            vertical={10}
            center={true} btn={'rgb'}
            title={BUTTON_UPDATE_PASS}
            width={'80%'} circle={40}
            style={{ backgroundColor: '#55B619', height: 40 }}
            styleTitle={{ fontSize: 16, fontFamily: 'Nunito-Regular', }}
            onPress={this.changePassword.bind(this)}
          />
        </View> */}
        <Toast ref="toast" position={'bottom'} fadeOutDuration={3000} />
        <SafeAreaView></SafeAreaView>
      </ View>
    );
  }
}

const mapStateToProps = state => ({
  userName: state.user.userName // userName
});

const mapDispatchToProps = dispatch => ({
  makeRequestchangePassword: (payload) => {
    dispatch(changePasswordAction(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

const styles = StyleSheet.create({
  buttonHide: {
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  styleLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#828282',
    position: 'absolute',
    top: -10,
  },
  styleTitle: {

  },
  txtErrorEmpty: {
    color: '#D22D3F',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(11),
  },
})