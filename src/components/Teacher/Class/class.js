import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  AppState
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import AppIcon from '../../../utils/AppIcon';
import global from '../../../utils/Globals';
import ListClass from './listClass';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { setProfileUserAction } from '../../../actions/userAction';
import { userGiftAction } from '../../../actions/giftAction';
import { getUserByToken } from '../../../utils/Helper';
import { LOGIN_TYPE, isExpried, isRefresh } from '../../../utils/AuthCommon';
import apiUserHelper from '../../../services/apiUserHelper';
import { TOKEN_EXP } from '../../../constants/const';
import HeaderMain from '../../common-new/HeaderMain';
import ClassHolder from '../../shim/ClassHolder';

class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      isRefresh: false,
      appState: AppState.currentState
    };
  }

  async componentDidMount() {
    try {
      SplashScreen.hide();
      AppState.addEventListener("change", this._handleAppStateChange);
      await this.onRefreshToken();
      this.setTimeoutRefresh();
      this.initData();
    } catch (error) {
      this.setState({
        isLoading: false,
      });
    }
  }

  async initData() {
    const { token } = await dataHelper.getToken();
    const payload = getUserByToken(token);
    this.props.makeRequestProfile(payload);
    this.props.userGiftAction({ token });
    const response = await Api.getListClass({ token });
    this.setState({
      isLoading: false,
      data: response && response,
    });
  }

  componentWillUnmount = () => {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      this.checkToken();
    }
    this.setState({ appState: nextAppState });
  };

  checkToken = async () => {
    this.onRefreshToken();
    this.setTimeoutRefresh();
  }

  setTimeoutRefresh = () => {
    if (this.timeRefresh != null) {
      clearInterval(this.timeRefresh);
      this.timeRefresh = null;
    }
    this.timeRefresh = setInterval(() => {
      this.onRefreshToken();
    }, 30000);
  }

  onRefreshToken = async () => {
    const value = await AsyncStorage.getItem('@token');
    if (value !== null && value !== '') {
      const curTime = Math.floor(Date.now() / 1000);
      const { iat, exp } = jwtDecode(value);
      let userPost = null;
      let userObj = null;
      let res = null;
      if (isExpried(exp, curTime) == true) {
        userPost = await dataHelper.getUserPost();
        userObj = JSON.parse(userPost);
        switch (userObj.loginType) {
          case LOGIN_TYPE.PHONE:
            res = await apiUserHelper.loginPhoneV2(userObj);
            break;
          case LOGIN_TYPE.USERNAME:
            res = await apiUserHelper.loginUserName(userObj);
            break;
          default:
            global.onSignIn(false); // sosical exp
            break;
        }
        if (res != '' && res.status === 200) {
          dataHelper.saveToken(res.access_token);
          return { token: res.access_token }
        }
      } else if (isRefresh(exp, curTime, iat)) {
        userPost = await dataHelper.getUserPost();
        userObj = JSON.parse(userPost);
        res = await apiUserHelper.refreshToken({ token: value });
        if (res != '' && res.status === 200) {
          dataHelper.saveToken(res.access_token);
          return { token: res.access_token }
        }
      }
      return { token: value };
    }
  }

  _getData = async () => {
    try {
      this.setState({ isRefresh: true });
      const { token } = await dataHelper.getToken();
      const response = await Api.getListClass({ token });
      this.setState({
        isRefresh: false,
        data: response && response,
      });
    } catch (error) { }
  };

  render() {
    const {
      data,
      isLoading,
      isRefresh
    } = this.state;
    const { user } = this.props;
    return (
      <>
        <StatusBar />
        <SafeAreaView style={styles.container}>
          <ListClass
            isLoading={isLoading}
            user={user}
            data={data}
            navigation={this.props.navigation}
            onRefresh={this._getData}
            isRefresh={isRefresh}
          />
        </SafeAreaView>
      </>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  imageHome: {
    width: width * 0.9,
    height: width * 0.52,
  },
  imageBottom: {
    width: width,
    height: width * global.ratioImageBottom,
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    makeRequestProfile: payload => {
      dispatch(setProfileUserAction(payload));
    },
    userGiftAction: payload => dispatch(userGiftAction(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Class);
