import React, { Component } from 'react';
import { Platform, View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Keyboard, SafeAreaView, Dimensions } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import dataHelper from '../../utils/dataHelper';
import HeaderNavigation from '../common/HeaderNavigation';
import AppIcon from '../../utils/AppIcon';
import LoadingScreen from '../libs/LoadingScreen';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { mainStyle } from '../../themes';
import { changePasswordAction } from '../../actions/userAction';
import { connect } from 'react-redux';
import {
  PASS_PRESENT_PLACE, PASS_RENEW_PLACE, PASS_NEW_PLACE, TITLE_HEADER_PASSWORD, BUTTON_UPDATE_PASS,
  CHANGE_PASSWORD_FAILD_MSG, CHANGE_PASSWORD_SUCCESS_MSG
} from '../../constants/message';
import _ from 'lodash';

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

  _handalValuation = () => {
    var result = true;
    const { errorEmpty, passwordNew, passwordNewAgain, passwordOld } = this.state;
    _.forEach(['passwordOld', 'passwordNew', 'passwordNewAgain'], item => {
      if (_.isEmpty(this.state[item])) {
        switch (item) {
          case 'passwordOld': {
            errorEmpty[item] = 'Mật khẩu hiện tại không được để trống';
            result = false;
            break;
          }
          case 'passwordNew': {
            errorEmpty[item] = 'Mật khẩu mới không được để trống';
            result = false;
            break;
          }
          case 'passwordNewAgain': {
            errorEmpty[item] = 'Nhập lại mật khẩu không được để trống';
            result = false;
            break;
          }
          default: break;
        }
        this.setState({ errorEmpty });
      } else {
        // const passwordRegex = passwordNew.match(/^([a-zA-Z0-9@*#]{6,30})$/g);
        const passwordRegex = passwordNew.match(/[\ \/\'\"\+\-\*\(\)\[\]\{\}\_\,\.\$\%\^\!\~\`]/g);
        if (item === 'passwordNew' && passwordRegex) {
          errorEmpty[item] = 'Mật khẩu không được chứa kí tự đặc biệt !'
          result = false;
        }
        // if (item === 'passwordNew' && !passwordRegex) {
        //   errorEmpty[item] = 'Mật khẩu không hợp lệ !';
        //   result = false;
        // }
        if ((item === 'passwordNew' || item === 'passwordOld') && this.state[item].trim().length < 6) {
          errorEmpty[item] = 'Mật khẩu phải chứa ít nhất 6 kí tự !'
          result = false;
        }
        if (item === 'passwordNewAgain' && passwordNewAgain != passwordNew) {
          errorEmpty[item] = 'Nhập lại mật khẩu không khớp !'
          result = false;
        }
        this.setState({ errorEmpty });
      }
    });
    return result;
  }

  changePassword() {
    Keyboard.dismiss();
    const { passwordNew, passwordOld, passwordNewAgain, errorEmpty } = this.state;
    if (this._handalValuation()) {
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
                  this.timeOut = setTimeout(() => this.setState({ passwordNew: '', passwordOld: '', passwordNewAgain: '', errorValidate: '' }), 3000)
                }
              );
              return;
            }
            this.setState({ passwordNew: '', passwordOld: '', passwordNewAgain: '', errorValidate: '', isChange: false });
          }).catch(err => {
            this.refs.toast.show(CHANGE_PASSWORD_FAILD_MSG, DURATION.LENGTH_LONG);
            this.setState({ passwordNew: '', passwordOld: '', passwordNewAgain: '', errorValidate: '', isChange: false });
          });
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
  }

  render() {
    const { passwordOld, errorEmpty, passwordNew, passwordNewAgain } = this.state;
    return (

      <View style={[mainStyle.container, { backgroundColor: '#FFF' }]} >
        <HeaderNavigation
          navigation={this.props.navigation}
          title={TITLE_HEADER_PASSWORD}
          bgColor={'#2F80ED'} colorIcon={'#FFF'}
          styleTitle={styles.styleTitle}
          back={true}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flex: 1, width: '80%' }}>
              <Text style={mainStyle.headerTextValidate}>{this.state.errorValidate}</Text>
              <View style={{ marginTop: 20 }}>
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
                {/* <TouchableOpacity
                  onPress={() => this.showPassword()}
                  style={styles.buttonHide}
                > */}
                {/* <View style={{ flexDirection: 'row', marginBottom: 5 }}> */}
                {/* <Icon name="eye" color={this.state.isSecureTextEntry ? "#E0E0E0" : '#444'} size={17} /> */}
                {/* <Image source={AppIcon.icon_eye} style={{ tintColor: this.state.isSecureTextEntry ? "#E0E0E0" : '#444', alignSelf: 'center', width: 20, height: 20 }} resizeMode={'contain'} /> */}
                {/* <Text style={{ fontFamily: 'Nunito-Bold', marginLeft: 5, color: this.state.isSecureTextEntry ? "#E0E0E0" : '#444', alignSelf: 'center', }}>Hiện</Text> */}
                {/* </View> */}
                {/* </TouchableOpacity> */}
              </View>
              {(errorEmpty.passwordOld) && (<View><Text numberOfLines={1} style={styles.txtErrorEmpty} >{errorEmpty.passwordOld}</Text></View>)}
              <Text style={{ paddingTop: 10, color: '#222222', fontFamily: 'Nunito-Bold', fontSize: 15, lineHeight: 19 }}>Mật khẩu mới</Text>
              <FormInput
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
              />
              {errorEmpty.passwordNew && (<View><Text numberOfLines={1} style={styles.txtErrorEmpty} >{errorEmpty.passwordNew}</Text></View>)}
              <Text style={{ paddingTop: 10, color: '#222222', fontFamily: 'Nunito-Bold', fontSize: 15, lineHeight: 19 }}>Nhập lại mật khẩu mới</Text>
              <FormInput
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
              />
              {(errorEmpty.passwordNewAgain) && (<View><Text numberOfLines={1} style={styles.txtErrorEmpty} >{errorEmpty.passwordNewAgain}</Text></View>)}
            </View>
          </View>
          {this.state.isChange &&
            <LoadingScreen isLoading={true} bgColor={'transparent'} />
          }
        </ScrollView>
        <View behavior="position" enabled={true} style={{ zIndex: 0, paddingBottom: height / 16 }}>
          <Button
            vertical={10}
            center={true} btn={'rgb'}
            title={BUTTON_UPDATE_PASS}
            width={'80%'} circle={40}
            style={{ backgroundColor: '#55B619', height: 40 }}
            styleTitle={{ fontSize: 16, fontFamily: 'Nunito-Regular', }}
            onPress={this.changePassword.bind(this)}
          />
        </View>
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
    fontSize: 14,
    color: '#828282',
    position: 'absolute',
    top: -10,
  },
  styleTitle: {

  },
  txtErrorEmpty: {
    color: '#D22D3F',
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
  },
})