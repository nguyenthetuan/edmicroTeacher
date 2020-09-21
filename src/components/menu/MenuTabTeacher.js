import React, { Component } from 'react';
import { View, Platform, ScrollView, SafeAreaView } from "react-native";
import dataHelper from '../../utils/dataHelper';
import global from '../../utils/Globals';
import AppIcon from '../../utils/AppIcon';
import { GOOGLE_PLAY_APP, ITUNES_APPLE_APP } from '../../constants/http';
import { alertLogout } from '../../utils/Alert';
import HeaderMenu from '../../components/common-new/HeaderMenu';
import AnalyticsManager from '../../utils/AnalyticsManager';
import { Freshchat } from 'react-native-freshchat-sdk';
import SettingContact from '../../components/account-detail/ContactForm';
import { connect } from 'react-redux';
import MenuStyle from './MenuStyle';
import { MenuItem } from './MenuItem';
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
    navigation.navigate({
      routeName: 'Webviews',
      params: {
        title: 'App Store',
        link: link,
        statusbar: 'light-content'
      }
    });
  }

  handleClick(type) {
    this.props.navigation.closeDrawer();
    switch (type) {
      case 1: this.props.navigation.navigate('ChangInfo', { statusbar: 'light-content', previousScreen: this.props.navigation.state.routeName }); break;
      case 2: this.props.navigation.navigate('ChangeGrade', { statusbar: 'dark-content' }); break;
      case 5: this.rateApp(); break;
      case 6: this.logout(); break;
      case 8: this.props.navigation.navigate('SettingScreen', { statusbar: 'light-content' }); break;
      case 9: this.props.navigation.navigate('V_UpdatePhone', { statusbar: 'dark-content' }); break;
      case 12: this.setState({ modalVisible: true }); break;
      case 14: this.props.navigation.navigate('ChangePassword', { statusbar: 'light-content' }); break;
      case 15: this.props.navigation.navigate('TermsOfUse', { status: 'light-contetnt' }); break;
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

  render() {
    const { user } = this.props;
    const { modalVisible } = this.state;
    return (
      <React.Fragment>
        <SafeAreaView style={MenuStyle.headerSafeview} />
        <View style={MenuStyle.container} >
          <HeaderMenu
            {...user}
            navigation={this.props.navigation}
            handleClick={(n) => this.handleClick(n)}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={MenuStyle.scrollContainer}>
            <View style={MenuStyle.wrapEventDaily}>
              <MenuItem
                onPress={() => this.handleClick(1)}
                source={AppIcon.info_account}
                title={'Hồ sơ cá nhân'}
                rippleColor={rippleColor}
              />
              <MenuItem
                onPress={() => this.handleClick(9)}
                source={require('../../asserts/appIcon/iconPhone.png')}
                title={'Cập nhật số điện thoại'}
                rippleColor={rippleColor}
              />
              <MenuItem
                onPress={() => this.handleClick(12)}
                source={require('../../asserts/appIcon/contactPhone.png')}
                title={'Liên hệ với chúng tôi'}
                rippleColor={rippleColor}
              />
              <MenuItem
                onPress={() => this.handleClick(15)}
                source={require('../../asserts/appIcon/icSecurity.png')}
                title={'Chính sách bảo mật'}
                rippleColor={rippleColor}
              />
              <MenuItem
                onPress={() => this.handleClick(6)}
                source={AppIcon.logout}
                title={'Đăng xuất'}
                rippleColor={rippleColor}
              />
            </View>
          </ScrollView>
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
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuTabTeacher);

