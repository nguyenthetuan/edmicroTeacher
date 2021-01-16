import { Platform, Dimensions } from 'react-native';
import ListStudent from './listStudent';
import ListExercise from './listExercise';
import Plans from './plans';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { RFFonsize } from '../../../utils/Fonts';

const Tab = createMaterialTopTabNavigator(
  {
    ListStudent: {
      screen: ListStudent,
      navigationOptions: {
        title: 'Học sinh',
      },
    },
    Plans: {
      screen: Plans,
      navigationOptions: {
        title: 'Kế hoạch',
      },
    },
    ListExercise: {
      screen: ListExercise,
      navigationOptions: {
        title: 'Bài tập',
      },
    },
  },
  {
    swipeEnabled: Platform.OS == 'ios',
    lazy: false,
    tabBarOptions: {
      upperCaseLabel: false,
      pressOpacity: 0.5,
      activeTintColor: '#56CCF2',
      inactiveTintColor: '#C4C4C4',
      allowFontScaling: true,
      tabStyle: {
        height: 30,
        marginBottom: 10,
        // paddingHorizontal: 30,
      },
      indicatorStyle: {
        height: 5,
        backgroundColor: '#56CCF2',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // width: 65,
        // marginLeft:35,
      },
      style: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOffset: { height: 0, width: 0 },
        justifyContent: 'space-between',
        borderBottomColor: '#56CCF2',
        borderBottomWidth: 1,

      },
      labelStyle: {
        fontSize: RFFonsize(12),
        fontFamily: 'Nunito-Bold',
      },
    },
  },
);

const TabTop = createAppContainer(Tab);
export default TabTop;
