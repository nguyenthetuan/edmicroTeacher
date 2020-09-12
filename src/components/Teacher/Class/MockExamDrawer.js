import React, { Component } from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Dimensions } from 'react-native';
import MockExam from './MockExample';
import QuestionMockMenu from './QuestionMockMenu';

const { width } = Dimensions.get('window');

const MockDrawer = createDrawerNavigator({
  TestPlaying: {
    screen: MockExam
  }
}, {
  drawerWidth: width * 0.7,
  drawerPosition: 'left',
  contentComponent: props => <QuestionMockMenu {...props} />,
}

);

export default MockDrawer;