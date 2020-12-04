import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import PracticeTab from './PracticeTab';
import TestTab from './TestTab';
const TabMissionType = createMaterialTopTabNavigator(
  {
    PracticeTab: {
      screen: PracticeTab,
      navigationOptions: {
        title: 'Tự luyện',
      },
    },
    TestTab: {
      screen: TestTab,
      navigationOptions: {
        title: 'Kiểm tra',
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: 'transparent',
      },
      labelStyle: {
        fontFamily: 'Nunito-Regular',
        fontSize: 15,
      },
      indicatorStyle: {
        backgroundColor: '#56CCF2',
        height: 0.5,
        width: "25%",
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: "10%",
        borderRadius: 10
      },
      allowFontScaling: true,
      inactiveTintColor: '#828282',
      activeTintColor: '#2D9CDB',
      upperCaseLabel: false,
    },
    lazy: true,
  },
);

const TabContain = createAppContainer(TabMissionType);
export default TabContain;
