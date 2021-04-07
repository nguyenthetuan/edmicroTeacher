import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import store from './store/index';
import sagaMiddleware from './middleware/sagaMiddleWare';
import rootSaga from './sagas/rootSaga';
import Mixpanel, { MixpanelInstance } from 'react-native-mixpanel';
import Common from './utils/Common';
import dataHelper from './utils/dataHelper';
import jwtDecode from 'jwt-decode';
import apiUser from './services/apiUserHelper';
import RootAppNavigator from './navigations/RootNavigator';
import { StatusBar, Platform } from 'react-native';
import ConfigNotification from './utils/ConfigNotification';
import UpdateApp from './components/common/UpdateApp';
import firestore from '@react-native-firebase/firestore';
import { APP_VERSION_CODE } from './constants/buildConfig';
import AsyncStorage from '@react-native-community/async-storage';
import DownloadCodePushApp from './utils/DownloadCodePush';

// let codePushOptions = codePush({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
// enableScreens(); // crash webview back

class App extends Component {
  constructor(props) {
    super(props);
    this.initMixpanel();
    this.getActiveRoute = this.getActiveRoute.bind(this);
    this.version = '';
  }

  async initMixpanel() {
    this.mixpanel = new MixpanelInstance(Common.MixpanelToken);
    await this.mixpanel.initialize();
  }

  componentDidMount() {
    Mixpanel.sharedInstanceWithToken(Common.MixpanelToken);
    this.updataVersionApp();
    console.disableYellowBox = true;
    this.configureTextProps();
  }

  updataVersionApp = async () => {
    try {
      // get versionCode on device
      // version old
      let versionCode = APP_VERSION_CODE;
      versionCode = parseInt(versionCode);
      //get versionCode on firebase
      const usersCollection = await firestore()
        .collection('version')
        .doc('versionAppSchool')
        .get();
      const UpdateAppOnluyen = await AsyncStorage.getItem('UpdateAppOnluyen');
      if (usersCollection._data) {
        let {
          versionAndroid,
          versionIos,
          isLockUpdate,
          isLockAndroid,
          isLockIOS,
          isRequiredUpdate
        } = usersCollection._data;
        if (!isLockUpdate) {
          if (!isLockAndroid && Platform.OS == 'android') {
            //version news
            this.version = parseInt(versionAndroid);
            if (
              UpdateAppOnluyen != 'NoNeverShowUpdate' &&
              this.version > versionCode
            ) {
              // nếu người dùng không tắt chức năng hiển thị
              // và phiên bản hiện tại thấp phiên bản mới trên appStore hay CHPlay
              // và mới chỉ áp dụng cho android
              setTimeout(() => {
                this.refUpdateApp._handleShow(this.version, isRequiredUpdate);
              }, 10000);
            }
          } else if (!isLockIOS && Platform.OS == 'ios') {
            //version news
            this.version = parseInt(versionIos);
            if (
              UpdateAppOnluyen != 'NoNeverShowUpdate' &&
              this.version > versionCode
            ) {
              // nếu người dùng không tắt chức năng hiển thị
              // và phiên bản hiện tại thấp phiên bản mới trên appStore hay CHPlay
              // và mới chỉ áp dụng cho android
              setTimeout(() => {
                this.refUpdateApp._handleShow(this.version, isRequiredUpdate);
              }, 10000);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  configureTextProps = () => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
  };

  getActiveRoute(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRoute(route);
    }
    return route;
  }
  render() {
    return (
      <Provider store={store}>
        <ConfigNotification />
        <UpdateApp ref={ref => this.refUpdateApp = ref} version={this.version} />
        <RootAppNavigator
          onNavigationStateChange={(prevState, currentState, action) => {
            const currentScreen = this.getActiveRoute(currentState);
            const prevScreen = this.getActiveRoute(prevState);
            if (prevScreen.routeName !== currentScreen.routeName) {
              if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor('white');
                StatusBar.setBarStyle('dark-content');
                return;
              }
              if (currentScreen.params) {
                const statusTheme = currentScreen.params.statusbar;
                if (statusTheme) {
                  StatusBar.setBarStyle(statusTheme);
                }
              } else {
                StatusBar.setBarStyle('dark-content');
              }
            }
          }}
        />
        <DownloadCodePushApp />
      </Provider>
    );
  }
}

sagaMiddleware.run(rootSaga);

export default App;

