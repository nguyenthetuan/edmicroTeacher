import React, { Component } from 'react';
import { View, Platform, ScrollView, SafeAreaView, Linking } from "react-native";
import codePush from "react-native-code-push";
import dataHelper from '../../utils/dataHelper';
import global from '../../utils/Globals';
import AppIcon from '../../utils/AppIcon';
import { GOOGLE_PLAY_APP, ITUNES_APPLE_APP } from '../../constants/http';
import { alertLogout } from '../../utils/Alert';
import HeaderMenu from '../../components/common-new/HeaderMenu';
import AnalyticsManager from '../../utils/AnalyticsManager';
import { Freshchat } from 'react-native-freshchat-sdk';
import { APP_VERSION } from '../../constants/const';
import SettingContact from '../../components/account-detail/ContactForm';
import { connect } from 'react-redux';
import MenuStyle from './MenuStyle';
import { MenuItem } from './MenuItem';
import starIcon from '../../asserts/appIcon/star.png';
import updateIcon from '../../asserts/icon/icon_check_update.png';
import Version from './Version';
const rippleColor = '#999';

class MenuTabTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    }
  }

  rateApp() {
    const { navigation } = this.props;
    let link = Platform.OS === 'ios' ? ITUNES_APPLE_APP : GOOGLE_PLAY_APP;
    Linking.openURL(link);
    // navigation.navigate({
    //   routeName: 'Webviews',
    //   params: {
    //     title: 'App Store',
    //     link: link,
    //     statusbar: 'light-content'
    //   }
    // });
  }

  handleClick(type) {
    this.props.navigation.closeDrawer();
    switch (type) {
      case 1: this.props.navigation.navigate('ChangInfo', {
        statusbar:
          'light-content', previousScreen: this.props.navigation.state.routeName
      });
        break;
      case 2: this.props.navigation.navigate('ChangeGrade', { statusbar: 'dark-content' }); break;
      case 3: this.props.navigation.navigate('StatisticScreen', { statusbar: 'dark-content' }); break;
      case 5: this.rateApp(); break;
      case 6: this.logout(); break;
      case 8: this.props.navigation.navigate('SettingScreen', { statusbar: 'light-content' }); break;
      case 9: this.props.navigation.navigate('V_UpdatePhone', { statusbar: 'dark-content' }); break;
      case 12: this.setState({ modalVisible: true }); break;
      case 14: this.props.navigation.navigate('ChangePassword', { statusbar: 'light-content' }); break;
      case 15: this.props.navigation.navigate('TermsOfUse', { statusbar: 'dark-content' }); break;
      case 16: this.props.navigation.navigate('ExchangeGiftScreen', { statusbar: 'light-content' }); break;
      case 17: this.props.navigation.navigate('HomeWorkDraScreen', { statusbar: 'dark-content' }); break;
      case 18: this.props.navigation.navigate('EvaluateDraScreen', { statusbar: 'dark-content' }); break;
      default:
        break;
    }
  }

  logout() {
    alertLogout(cal => {
      dataHelper.saveToken('');
      dataHelper.saveUserPost('');
      dataHelper.saveCodeHocMai('');
      dataHelper.saveAvatar('');
      this.props.navigation.navigate('Auth');
      AnalyticsManager.trackWithProperties('Sign Out', {
        "mobile": Platform.OS
      });
      AnalyticsManager.reset();
      Freshchat.resetUser();
    });
  }

  onButtonPress() {
    this.props.navigation.closeDrawer();
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE
    });
  }

  render() {
    const { user, userGift } = this.props;
    const { modalVisible } = this.state;
    return (
      <React.Fragment>
        {/* <SafeAreaView style={MenuStyle.headerSafeview} /> */}
        <View style={MenuStyle.container}>
          <HeaderMenu
            {...user}
            userGift={userGift}
            navigation={this.props.navigation}
            handleClick={(n) => this.handleClick(n)}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={MenuStyle.scrollContainer}>
            <View style={MenuStyle.wrapEventDaily}>

              <MenuItem
                onPress={() => this.handleClick(18)}
                source={require('../../asserts/icon/icon_menuEvaluate.png')}
                title={'Đánh giá'}
                rippleColor={rippleColor}
              />
              <MenuItem
                onPress={() => this.handleClick(17)}
                source={require('../../asserts/appIcon/statistatic_menu.png')}
                title={'Thống kê bài tập'}
                rippleColor={rippleColor}
              />
              {/* <MenuItem
                onPress={() => this.handleClick(17)}
                source={require('../../asserts/icon/icon_menuMission.png')}
                title={'Nhiệm vụ tự luyện'}
                rippleColor={rippleColor}
              /> */}

              <View style={MenuStyle.hrRow}></View>


              <MenuItem
                onPress={() => this.handleClick(1)}
                source={AppIcon.info_account}
                title={'Hồ sơ cá nhân'}
                rippleColor={rippleColor}
              />
              {/* <MenuItem
                onPress={() => this.handleClick(16)}
                source={AppIcon.icon_diamondV3}
                title={'Đổi quà'}
                rippleColor={rippleColor}
              /> */}
              {/* <MenuItem
                onPress={() => this.handleClick(3)}
                source={require('../../asserts/icon/icon_staticV3.png')}
                title={'Thống kê'}
                rippleColor={rippleColor}
              /> */}
              <MenuItem
                onPress={() => this.handleClick(9)}
                source={require('../../asserts/appIcon/iconPhone.png')}
                title={'Cập nhật số điện thoại'}
                rippleColor={rippleColor}
              />
              {Platform.OS == 'android' &&
                <MenuItem
                  onPress={() => this.handleClick(12)}
                  source={require('../../asserts/appIcon/contactPhone.png')}
                  title={'Liên hệ với chúng tôi'}
                  rippleColor={rippleColor}
                />
              }
              <View style={MenuStyle.hrRow}></View>
              <MenuItem
                onPress={() => this.handleClick(15)}
                source={require('../../asserts/appIcon/icSecurity.png')}
                title={'Chính sách bảo mật'}
                rippleColor={rippleColor}
              />
              <MenuItem
                onPress={() => this.handleClick(5)}
                source={starIcon}
                title={'Đánh giá ứng dụng'}
                rippleColor={rippleColor}
              />
              {user?.userId == "5f6ec0d787047800015deb9b" &&
                <MenuItem
                  onPress={() => this.onButtonPress()}
                  source={updateIcon}
                  title={'Kiểm tra cập nhật'}
                  rippleColor={rippleColor}
                />
              }
              <MenuItem
                onPress={() => this.handleClick(5)}
                source={updateIcon}
                title={'Kiểm tra cập nhật'}
                rippleColor={rippleColor}
              />
              <View style={MenuStyle.hrRow}></View>
              <MenuItem
                onPress={() => this.handleClick(6)}
                source={AppIcon.logout}
                title={'Đăng xuất'}
                rippleColor={rippleColor}
              />
            </View>
          </ScrollView>
          <Version version={APP_VERSION} />
        </View >
        <SettingContact
          modalVisible={modalVisible}
          closeModal={() => this.setState({ modalVisible: false })}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userGift: state.gift.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuTabTeacher);

