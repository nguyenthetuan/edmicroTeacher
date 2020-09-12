import {Platform, Dimensions} from 'react-native';
import ListStudent from './listStudent';
import ListExercise from './listExercise';
import Plans from './plans';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
const {width} = Dimensions.get('window');
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
    initialRouteName: 'ListStudent',
    swipeEnabled: Platform.OS == 'ios',
    lazy: false,
    tabBarOptions: {
      upperCaseLabel: false,
      pressOpacity: 0.5,
      activeTintColor: '#828282',
      inactiveTintColor: '#C4C4C4',
      allowFontScaling: true,
      tabStyle: {
        height: 30,
        marginBottom: 10,
        // paddingHorizontal: 30,
      },
      indicatorStyle: {
        height: 5,
        backgroundColor: '#F98E2F',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      style: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOffset: {height: 0, width: 0},
        justifyContent: 'space-between',
        borderBottomColor: '#F98E2F',
        borderBottomWidth: 1,
        
      },
      labelStyle: {
        fontSize: 12,
        fontFamily: 'Nunito-Bold',
      },
    },
  },
);

const TabTop = createAppContainer(Tab);
export default TabTop;
