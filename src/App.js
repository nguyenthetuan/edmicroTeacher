import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import codePush from "react-native-code-push";
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

// let codePushOptions = codePush({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
// enableScreens(); // crash webview back

class App extends Component {
  constructor(props) {
    super(props);
    this.initMixpanel();
    this.getActiveRoute = this.getActiveRoute.bind(this);
  }

  async initMixpanel() {
    this.mixpanel = new MixpanelInstance(Common.MixpanelToken);
    await this.mixpanel.initialize();
  }

  componentDidMount() {
    Mixpanel.sharedInstanceWithToken(Common.MixpanelToken);
    console.disableYellowBox = true;
    this.configureTextProps();
    dataHelper.getToken().then(({ token }) => {
      const { userId, idMixpanel } = jwtDecode(token);
      if (!idMixpanel || idMixpanel !== Common.MixpanelToken) {
        Mixpanel.createAlias(userId);
        apiUser
          .updateMixpanelId({ token, mixpanelId: Common.MixpanelToken })
          .then((data) => {
            if (!!data) {
              Mixpanel.set(jwtDecode(data.access_token));
              Mixpanel.trackWithProperties('Sign Up', {
                user: 'OLD',
                mobile: Platform.OS,
              });
            }
          });
      }
    });
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
      </Provider>
    );
  }
}

sagaMiddleware.run(rootSaga);

const MyApp = codePush({
  updateDialog: {
    title: 'Cập nhật bản mới',
    optionalUpdateMessage: 'Đã có bản cập nhật mới. Bạn có muốn cập nhật ngay bây giờ?',
    optionalInstallButtonLabel: 'Cập nhật',
    optionalIgnoreButtonLabel: 'Bỏ qua'
  },
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_START
})(App);

export default MyApp;
