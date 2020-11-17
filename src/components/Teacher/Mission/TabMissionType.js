import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import PracticeTab from './PracticeTab';
import TestTab from './TestTab';
import {View, Text, StyleSheet} from 'react-native';
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
        backgroundColor: 'transparent',
      },
      allowFontScaling: true,
      inactiveTintColor: '#828282',
      activeTintColor: '#56CCF2',
      upperCaseLabel: false,
    },
    lazy: true,
  },
);

const TabContain = createAppContainer(TabMissionType);
export default TabContain;