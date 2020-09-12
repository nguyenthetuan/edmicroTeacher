import React from 'react';
import { StyleSheet, View, Image, ImageBackground, StatusBar, Platform, Dimensions } from 'react-native';
import jwtDecode from 'jwt-decode';
import dataHelper from '../../utils/dataHelper';
import apiHelper from '../../services/apiUserHelper';
import global from '../../utils/Globals';
import { NavigationActions, StackActions } from 'react-navigation';
import JupiterAnim from '../anim/JupiterAnim';
import StarAnim from '../anim/StarAnim';
import RotateAnim from '../anim/RotateAnim';
import { authenRedirect } from '../../utils/AuthCommon';
const { width, height } = Dimensions.get('window');

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      timeOut: 0,
      Role: ''
    }
    this._bootstrapAsync();
    global.onSignIn = this.onSignIn.bind(this);
    global.updateGrades = this.onSignIn.bind(this);
    global.updateRecent = this.initGlobal.bind(this);
    global.updatePractice = this.initGlobal.bind(this);
    global.updateReport = this.initGlobal.bind(this);
    global.updateProcess = this.initGlobal.bind(this);
    global.updateExam = this.initGlobal.bind(this);
    global.updateBookMark = this.initGlobal.bind(this);
    global.updateTestHome = this.initGlobal.bind(this);
    global.updateUserInfo = this.initGlobal.bind(this);
    global.updateProblemDetail = this.initGlobal.bind(this);
    global.updateSla = this.initGlobal.bind(this);
    global.updateRemember = this.initGlobal.bind(this);
    global.getDataExamGroup = this.initGlobal.bind(this);
    if (Platform.OS == 'android') {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('white');
    } else {
      StatusBar.setBarStyle('light-content');
    }
  }

  async onSignIn(b) {
    if (!b) {
      this.props.navigation.navigate('V_SignIn', { statusbar: 'dark-content' });
    }
    else {
      const token = await dataHelper.getToken();
      const { CreateBySchool } = jwtDecode(token);
      this.gotoApp(CreateBySchool);
    }
  }

  componentWillUnmount() {
    if (this.myTimeMounted) {
      clearTimeout(this.myTimeMounted);
      this.myTimeMounted = null;
    }
    if (this.myInteval) {
      clearInterval(this.myInteval);
      this.myInteval = null;
    }
  }

  //initialize global
  initGlobal() { }

  refress() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    console.log("_bootstrapAsync");
    try {
      const { token } = await dataHelper.getToken();
      if (token && token != '') {
        dataHelper.saveToken(token);
        const { GradeId, CreateBySchool, Role, codeApp = '' } = jwtDecode(token);
        authenRedirect(CreateBySchool, GradeId, Role, this.props.navigation);
      }
      else {
        this._handleAuth();
      }
    } catch (error) {
      console.log(error);
      this._handleAuth();
    }
  };

  _handleAuth = () => {
    this.props.navigation.navigate('Auth', { statusbar: 'dark-content' });
  }


  gotoApp(CreateBySchool) {
    if (CreateBySchool && this.state.Role === 'STUDENT') {
      this.props.navigation.navigate('Self', { statusbar: 'dark-content' });
    } else {
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: CreateBySchool ? 'App' : 'AppStudent',
            params: { statusbar: 'dark-content', from: 'auth' }
          }),
        ],
      }));
    }
  }

  startJupiter = (type) => {
    if (__DEV__) {
      switch (type) {
        case 'app':
          this.gotoApp(this.state.CreateBySchool);
          break;
        case 'app':
          this.props.navigation.navigate('Grades', { statusbar: 'dark-content' });
        default:
          this.props.navigation.navigate('Auth', { statusbar: 'dark-content' });
          break;
      }
      return;
    }
    this.refs.jupiter.start(callback => {
      switch (type) {
        case 'app':
          this.gotoApp(this.state.CreateBySchool);
          break;
        case 'grade':
          this.props.navigation.navigate('Grades', { statusbar: 'dark-content' });
        default:
          this.props.navigation.navigate('Auth', { statusbar: 'dark-content' });
          break;
      }
    });
  }

  componentDidUpdate = async (prevProps, nextState) => {
    this.startJupiter('app');
  }

  componentWillUnmount() {
    if (this.timeJupiter) {
      clearTimeout(this.timeJupiter);
      this.timeJupiter = null;
    }
  }


  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgAuthLoading: {
    width: '100%', height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  star1: {
    position: 'absolute',
    top: -30,
    right: 0,
  },
  star2: {

  },
  star3: {
    position: 'absolute', top: height / 3, right: 100
  },
  star4: {
    position: 'absolute', top: 140, right: 40
  }
});