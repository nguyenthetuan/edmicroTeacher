import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Platform,
} from 'react-native';
import AppIcon from './AppIcon';
import {
  Freshchat,
  FreshchatConfig,
  FreshchatUser,
  FreshchatNotificationConfig
} from 'react-native-freshchat-sdk';
import dataHelper from './dataHelper';
import jwtDecode from 'jwt-decode';
import apiUserHelper from '../services/apiUserHelper';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RFFonsize } from '../utils/Fonts';

const APP_ID = '8d0af544-bbe3-4d5b-bd87-3ed6e2338a35';
const APP_KEY = '97de673e-7c15-46d6-9a22-875bf38f2ecf';

const APP_ID_PROD = '0028d840-483d-4e1a-a3d4-1d7a6f4b6ca0';
const APP_KEY_PROD = 'fca858ec-d267-4881-834f-b0dcda358476';
export default class FreshchatComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    this.configFreschat();
  }

  async configFreschat() {
    const { token } = await dataHelper.getToken();
    const {
      userId,
      PhoneNumber,
      userName,
      DisplayName,
      idFreshchat
    } = jwtDecode(token);
    this.userInfo = jwtDecode(token);
    let userProperties = {
      user_id: this.userInfo.userId,
      name: this.userInfo.DisplayName,
      Birthday: this.userInfo.Birthday,
      codeApp: this.userInfo.codeApp,
      CreateBySchool: this.userInfo.CreateBySchool,
      CurrentSchoolId: this.userInfo.CurrentSchoolId,
      DisplayName: this.userInfo.DisplayName,
      Email: this.userInfo.Email,
      emailConfirmed: this.userInfo.sub,
      needChangePassword: this.userInfo.needChangePassword,
      packages: JSON.stringify(this.userInfo.packages),
      PhoneNumber: this.userInfo.PhoneNumber,
      Role: JSON.stringify(this.userInfo.Role),
      SchoolId: this.userInfo.SchoolId,
      unique_name: this.userInfo.unique_name,
      userId: this.userInfo.userId,
      userName: this.userInfo.userName,
      GradeId: this.userInfo.GradeId,
    };

    //config for Freshchat
    var freshchatConfig = new FreshchatConfig(APP_ID_PROD, APP_KEY_PROD);
    freshchatConfig.domain = "https://msdk.in.freshchat.com";
    freshchatConfig.teamMemberInfoVisible = true;
    freshchatConfig.cameraCaptureEnabled = false;
    freshchatConfig.gallerySelectionEnabled = true;
    freshchatConfig.responseExpectationEnabled = true;

    if (Platform.OS === 'ios') {
      freshchatConfig.notificationSoundEnabled = true; //iOS only
      freshchatConfig.themeName = 'CustomTheme.plist'; //iOS only
      freshchatConfig.stringsBundle = 'FCCustomLocalizable'; //iOS only
      freshchatConfig.showNotificationBanner = true; //iOS only
    }
    //end config for Freshchat
    Freshchat.init(freshchatConfig);

    // neu nguoi dung da duoc khoi tao tren freshchat thi bo qua khoi tao moi
    let freshChatId = (Array.isArray(idFreshchat) && idFreshchat.length > 0) ? idFreshchat[0] : !!idFreshchat ? idFreshchat : null
    Freshchat.identifyUser(userId, freshChatId, (error) => {
      console.log(error);
    });

    //Updating User Information
    var freshchatUser = new FreshchatUser();
    freshchatUser.firstName = DisplayName;
    freshchatUser.email = userName;
    freshchatUser.phoneCountryCode = '+84';
    freshchatUser.phone = PhoneNumber;
    Freshchat.setUser(freshchatUser, (error) => {
      console.log(error);
    });

    setTimeout(() => {
      Freshchat.setUserProperties(userProperties, (error) => {
        console.log('err setUserWithIdToken', error);
      });
      if (Platform.OS == 'android') {
        var freshchatNotificationConfig = new FreshchatNotificationConfig();
        freshchatNotificationConfig.priority = FreshchatNotificationConfig.NotificationPriority.PRIORITY_HIGH;
        freshchatNotificationConfig.notificationSoundEnabled = true;
        freshchatNotificationConfig.largeIcon = "notif"; // Drawable name
        freshchatNotificationConfig.smallIcon = "notif"; // Drawable name
        Freshchat.setNotificationConfig(freshchatNotificationConfig);
      }
    }, 1000);

    // khi co api luu restoreId thi thuc hien check va goi ham luu no tai day
    Freshchat.addEventListener(
      Freshchat.EVENT_USER_RESTORE_ID_GENERATED,
      () => {
        Freshchat.getUser(async (user) => {
          let restoreId = user.restoreId;
          if (!!restoreId && !idFreshchat) {
            const response = await apiUserHelper.updateFreshchatId({ token, idFreshchat: restoreId });
            console.log("FreshchatComponent -> componentDidMount -> response", response)
          }
        })
      }
    );

    Freshchat.addEventListener(
      Freshchat.EVENT_UNREAD_MESSAGE_COUNT_CHANGED,
      () => {
        console.log('onUnreadMessageCountChanged triggered');
        Freshchat.getUnreadCountAsync((data) => {
          var count = data.count;
          var status = data.status;
          if (status) {
            this._onUnreadChange({ count });
            console.log('Message count: ' + count);
          } else {
            console.log('getUnreadCountAsync unsuccessful');
          }
        });
      },
    );
  }

  registerUnidentifiedUser() {
    try {
      // Intercom.displayMessenger();
      Freshchat.showConversations();
      // Freshchat.showFAQs();
    } catch (error) {
      console.log(
        'LoginWithPhoneScreen -> registerUnidentifiedUser -> error',
        error,
      );
    }
  }

  _onUnreadChange = ({ count }) => {
    this.setState({ count });
  };

  componentWillUnmount() {
    Freshchat.removeEventListeners(
      Freshchat.EVENT_UNREAD_MESSAGE_COUNT_CHANGED,
      this._onUnreadChange,
    );
    // Intercom.removeEventListener(Intercom.Notifications.UNREAD_COUNT, this._onUnreadChange);
  }

  render() {
    const { count } = this.state;
    const { style } = this.props;
    return (
      <TouchableOpacity
        style={[styles.wrapIntercom, style]}
        onPress={this.registerUnidentifiedUser}>
        <Image source={AppIcon.icon_freshchat} resizeMode={'contain'} />
        {count > 0 && (
          <View style={styles.wrapTxtIntercom}>
            <Text style={styles.txtIntercom}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapIntercom: {
    position: 'absolute',
    zIndex: 10,
    bottom: isIphoneX() ? 100 : 65,
    right: 5,
    alignItems: 'center',
  },
  txtIntercom: {
    fontWeight: '600',
    color: '#FFF',
    fontSize: 16,
  },
  wrapTxtIntercom: {
    backgroundColor: 'red',
    borderRadius: 20,
    position: 'absolute',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
    right: 0,
  },
});
