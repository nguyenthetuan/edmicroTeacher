import React from 'react';
import { StyleSheet, View, StatusBar, Platform, Dimensions } from 'react-native';
import jwtDecode from 'jwt-decode';
import dataHelper from '../../utils/dataHelper';
import global from '../../utils/Globals';
import { authenRedirect } from '../../utils/AuthCommon';
const { width, height } = Dimensions.get('window');

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Role: ''
    }
    this._bootstrapAsync();
    global.updateUserInfo = this.initGlobal.bind(this);
    global.updateRemember = this.initGlobal.bind(this);
    if (Platform.OS == 'android') {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('white');
    } else {
      StatusBar.setBarStyle('light-content');
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
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  star1: {
    position: 'absolute',
    top: -30,
    right: 0,
  },
  star2: {

  },
  star3: {
    position: 'absolute',
    top: height / 3,
    right: 100
  },
  star4: {
    position: 'absolute',
    top: 140,
    right: 40
  }
});