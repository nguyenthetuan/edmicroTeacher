import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Platform, ScrollView, ImageBackground, Linking, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import jwtDecode from 'jwt-decode';
import dataHelper from '../utils/dataHelper';
import global from '../utils/Globals';
import AppIcon from '../utils/AppIcon';
import RippleButton from '../components/common-new/RippleMenu';
import { GOOGLE_PLAY_APP, ITUNES_APPLE_APP } from '../constants/http';
import { alertLogout } from '../utils/Alert';
import Common from '../utils/Common';
import HeaderMenu from '../components/common-new/HeaderMenu';
import AnalyticsManager from '../utils/AnalyticsManager';
import { Freshchat } from 'react-native-freshchat-sdk';
import SettingContact from '../components/account-detail/ContactForm';
import { connect } from 'react-redux';
const rippleColor = '#999';

class MenuTabTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      DisplayName: '',
      GradeId: '',
      btnChangeGradeIdVisible: false,
      isPhoneNumber: false,
      PhoneNumber: '',
      userName: '',
    }
    this._isMounted = false;
    this.access_token = null;
  }

  componentDidMount() {
    console.log('phoneNumber', this.props.phoneNumber);
    this._isMounted = true;
    dataHelper.getToken().then(({ token }) => {
      this.access_token = token;
      const { PhoneNumber = '', DisplayName, userName } = jwtDecode(token);
      this.setState({
        isPhoneNumber: Common.validatePhoneNumberOld(Common.convertPhoneVN(PhoneNumber)),
        DisplayName: DisplayName,
        PhoneNumber: PhoneNumber,
        userName,
      })
    }).catch(err => console.log(err));
  }

  rateApp() {
    if (Platform.OS === 'ios') {
      // Linking.openURL(ITUNES_APPLE_APP).catch(err => console.error('An error occurred', err));
      // this.props.gotoWebview({ title: 'App Store', link: ITUNES_APPLE_APP });
      this.props.navigation.navigate({ routeName: 'Webviews', params: { title: 'App Store', link: ITUNES_APPLE_APP, statusbar: 'light-content' } })

    } else {
      this.props.navigation.navigate({ routeName: 'Webviews', params: { title: 'Google Play', link: GOOGLE_PLAY_APP, statusbar: 'light-content' } })
    }
  }

  handleClick(type) {
    this.props.navigation.closeDrawer();
    switch (type) {
      case 1: this.props.navigation.navigate('ChangInfo', { statusbar: 'light-content', previousScreen: this.props.navigation.state.routeName }); break;
      case 2: this.props.navigation.navigate('ChangeGrade', { statusbar: 'dark-content' }); break;
      case 3: this.props.navigation.navigate('EventDailyScreen', { statusbar: 'light-content' }); break;
      case 4: this.props.navigation.navigate('ProcessScreen', { statusbar: 'light-content' }); break;
      case 5: this.rateApp(); break;
      case 6: this.logout(); break;
      case 7: this.props.navigation.navigate('Matery', { statusbar: 'light-content' }); break;
      case 8: this.props.navigation.navigate('SettingScreen', { statusbar: 'light-content' }); break;
      case 9: this.props.navigation.navigate('V_UpdatePhone', { token: this.access_token, statusbar: 'dark-content' }); break;
      case 10: this.handleClickNotes(); break;
      case 11: this.props.navigation.navigate('ProcessScreen1', { statusbar: 'dark-content' }); break;
      case 12: this.setState({ modalVisible: true }); break;
      case 13: this.props.navigation.navigate('LearningDiaryScreen', { statusbar: 'dark-content' }); break;
      case 14: this.props.navigation.navigate('ChangePassword', { statusbar: 'light-content' }); break;
      case 15: this.props.navigation.navigate('TermsOfUse', { status: 'light-contetnt' }); break;
      default:
        break;
    }
  }

  handleClickNotes = () => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate('BookmarkScreen', { statusbar: 'light-content' });
  }

  logout() {
    alertLogout(cal => {
      dataHelper.saveToken('');
      dataHelper.saveUserPost('');
      dataHelper.saveCodeHocMai('');
      dataHelper.saveAvatar('');
      global.onSignIn(false);
      AnalyticsManager.trackWithProperties('Sign Out', {
        "mobile": Platform.OS
      });
      AnalyticsManager.reset();
      Freshchat.resetUser();
    });
  }

  getDisplayGrade = (GradeId) => {
    return 'Học sinh lớp ' + (GradeId) ? GradeId.substring(1) : '';
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { modalVisible, DisplayName, userName } = this.state;
    const { phoneNumber } = this.props;
    return (
      <React.Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#3A608C' }} ></SafeAreaView>
        <View style={styles.container} >
          <HeaderMenu {...this.props} handleClick={(n) => this.handleClick(n)} PhoneNumber={phoneNumber} displayName={DisplayName} userName={userName} />
          {/* {
            <RippleButton onPress={() => {
              this.handleClick(9)
            }}
            >
              <View style={styles.wrapTextUpdate}>
                <Text style={styles.txtLabelDes}>Cập nhật số điện thoại</Text>
                {(PhoneNumber && PhoneNumber.length >= 10) ?
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../asserts/appIcon/checked_phone.png')} style={{ marginRight: 5, alignSelf: 'center' }} />
                    <Text style={[styles.txtDescription, { color: '#0CCC08' }]}>Bạn đã cập nhật số điện thoại</Text>
                  </View>
                  :
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../asserts/icon/warning_icon.png')} style={{ alignSelf: 'center', tintColor: '#FF0404', width: 15, }} resizeMode='contain' />
                    <Text style={[styles.txtDescription]}>Bạn chưa cập nhật số điện thoại</Text>
                  </View>
                }
              </View>
            </RippleButton>
          } */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}>
            <View style={{ backgroundColor: '#fff', height: '200%' }}>
              <View style={styles.wrapEventDaily}>
                <RippleButton color={rippleColor}
                  onPress={() => this.handleClick(1)}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={AppIcon.info_account} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent}>Hồ sơ cá nhân</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton>
                <RippleButton color={rippleColor}
                  onPress={() => {
                    this.handleClick(9)
                  }}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={require('../asserts/appIcon/iconPhone.png')} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent} numberOfLines={1}>Cập nhật số điện thoại</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton>
                <RippleButton color={rippleColor}
                  onPress={() => this.handleClick(12)}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={require('../asserts/appIcon/contactPhone.png')} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent}>Liên hệ với chúng tôi</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton>
                {/* <RippleButton color={rippleColor}
                // onPress={() => this.handleClick(1)}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={require('../asserts/appIcon/iconEvulater.png')} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent}>Đánh giá ứng dụng</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton> */}
                {/* <RippleButton color={rippleColor}
                  // onPress={() => this.handleClick(1)}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={require('../asserts/appIcon/iconUpdate.png')} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent}>Kiểm tra cập nhật</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton> */}
                {/* <RippleButton color={rippleColor}
                  // onPress={() => this.handleClick(1)}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={require('../asserts/appIcon/iconSetting.png')} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent}>Cài đặt</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton> */}
                <RippleButton color={rippleColor}
                  onPress={() => this.handleClick(15)}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={require('../asserts/appIcon/icSecurity.png')} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent}>Chính sách bảo mật</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton>
                <RippleButton color={rippleColor}
                  onPress={() => this.handleClick(6)}
                >
                  <View style={styles.wrapComponent}>
                    <Image source={AppIcon.logout} style={styles.styleImage} resizeMode={'contain'} />
                    <Text style={styles.txtComponent}>Đăng xuất</Text>
                    <Icon name={'angle-right'} color={'#4776AD'} size={16} style={[styles.angle]} />
                  </View>
                </RippleButton>
              </View>
            </View>
          </ScrollView>
        </View >
        <SettingContact modalVisible={modalVisible} closeModal={() => this.setState({ modalVisible: false })} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    phoneNumber: state.user.phoneNumber
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuTabTeacher);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  wrapUser: {
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 120,
    backgroundColor: "#ACE6FF",
  },
  avatar: {
    borderColor: '#fff',
    borderRadius: 100,
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  rowAcount: {
    flexDirection: 'row'
  },
  textUsername: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    fontFamily: 'Nunito-Bold',
  },
  textFlag: {
    fontSize: 13,
    color: '#828282',
    lineHeight: 21,
    fontFamily: 'Nunito-Regular'
  },
  wrapUserInfo: {
    backgroundColor: '#fff',
  },
  wrapIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  rowItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  textItem: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10,
    color: '#626262',
    fontSize: 14,
    fontWeight: 'bold'
  },
  angle: {
    alignSelf: 'center',
  },
  changeClass: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapChangeClass: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarDefault: {
    width: 30.75,
    height: 32,
    alignSelf: 'center'
  },
  viewDateAccount: {
    height: 60,
    backgroundColor: '#DFF7FF',
    paddingLeft: 16,
    paddingTop: 5,
    justifyContent: 'center',
  },
  txtUpdate: {
    fontSize: 15,
    lineHeight: 19,
    color: '#000',
    fontFamily: 'Nunito-Regular'
  },
  txtDate: {
    color: '#FF0404',
    fontSize: 13,
    fontFamily: 'Nunito-Regular'
  },
  txtDaily: {
    marginTop: 5,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 19,
    color: '#BDBDBD',
    fontFamily: 'Nunito-Regular'
  },
  wrapComponent: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingLeft: 10,
  },
  txtComponent: {
    marginHorizontal: 20,
    fontSize: 12,
    fontWeight: 'bold',
    flex: .9,
    fontFamily: 'Nunito-Regular',
    alignSelf: 'flex-start',
    lineHeight: 40,
    alignItems: 'center',
    marginTop: 6,
    color: '#4776AD'
  },
  wrapNew: {
    borderRadius: 50,
    paddingHorizontal: 5,
    backgroundColor: '#FF5353'
  },
  wrapEventDaily: {
    marginTop: 10,
  },
  styleImage: {
    marginHorizontal: 5,
    width: 16, height: 16,
    tintColor: '#4776AD'
  },
  wrapTextUpdate: {
    backgroundColor: '#DFF7FF',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  txtDescription: {
    color: '#FF0404',
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    marginLeft: 5
  },
  txtLabelDes: {
    fontFamily: 'Nunito-Regular',
    fontSize: 15
  }
});