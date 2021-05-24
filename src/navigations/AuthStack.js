import { createStackNavigator } from 'react-navigation-stack';
import SignUp from '../components/auth/SignUpWithPhoneScreen';
import SignIn from '../components/auth/LoginWithPhoneScreen';
import Forgot from '../components/auth/ForgotPasswordScreen';
import transition from '../components/anim/Transition';
import Orientation from 'react-native-orientation';
import { Platform } from 'react-native';
import AppIntro from '../components/intro/AppIntro';

Orientation.lockToPortrait();

const AuthStack = createStackNavigator({
  V_Intro: {
    screen: AppIntro,
    navigationOptions: {
      header: null
    }
  },
  V_SignIn: {
    screen: SignIn,
    navigationOptions: {
      header: null
    }
  },
  V_SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null
    }
  },
  V_Forgot: {
    screen: Forgot,
    navigationOptions: {
      header: null
    }
  }
}, Platform.OS == 'android' && transition);

export default AuthStack;
