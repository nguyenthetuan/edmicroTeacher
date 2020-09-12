import { createStackNavigator } from 'react-navigation-stack';
// import Intro from '../components/auth/IntroScreen';
import SignUp from '../components/auth/SignUpWithPhoneScreen';
import SignIn from '../components/auth/LoginWithPhoneScreen';
import Forgot from '../components/auth/ForgotPasswordScreen';
import transition from '../components/anim/Transition';
import Orientation from 'react-native-orientation';

Orientation.lockToPortrait();

const AuthStack = createStackNavigator({
  // V_Intro: {
  //   screen: Intro,
  //   navigationOptions: {
  //     header: null
  //   }
  // },
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
  },
}, transition);

export default AuthStack;
