import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Platform, SafeAreaView, Alert, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import TestResult from './TestResult';
import TestHistoryDetail from './TestHistoryDetail';

import Share from '../../../exam-detail/Test';
import Utils from '../../../../utils/Utils';
import HeaderNavigation from '../../../common/HeaderNavigationMenu';
const { width, height } = Dimensions.get('window');
const TestResultTab = createMaterialTopTabNavigator({
  ResultTab: {
    screen: props => <TestResult {...props} />,
    navigationOptions: {
      title: 'Chi tiết',
    }
  },
  HistoryTab: {
    screen: props => <TestHistoryDetail {...props} />,
    navigationOptions: {
      title: 'Kết quả'
    }
  }
}, {
  backBehavior: false,
  swipeEnabled: false,
  animationEnabled: false,
  lazy: false,
  tabBarPosition: 'top',
  tabBarOptions: {
    scrollEnabled: true,
    upperCaseLabel: false,
    labelStyle: {
      fontSize: 16,
      fontFamily: 'Nunito-Regular'
    },
    tabStyle: {
      width: 140,
    },
    style: {
      backgroundColor: '#3371CB',
      elevation: 0,
      shadowOffset: { height: 0, width: 0 },
    },
    indicatorStyle: {
      backgroundColor: '#f8f8f8',
      height: 4,
      borderBottomWidth: 2,
      borderBottomColor: '#f8f8f8',
    }
  }
});

const TestResultTabContainer = createAppContainer(TestResultTab);

export default class TestResultScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.nameTest,
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#3371CB',
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  handleLongText(text) {
    const textLength = 25;
    let result = '';
    if (text.length > textLength) {
      result = `${text.slice(0, textLength)}...`;
      return (result)
    } else {
      return text;
    }
  }

  render() {
    const { assignmentId, testIdStudent } = this.props.navigation.state.params;
    return (
      <View style={{ flex: 1 }}>
        <HeaderNavigation
          navigation={this.props.navigation}
          title={this.handleLongText(this.props.navigation.state.params.nameTest)}
          bgColor='#3371CB'
          showIcon={1}
          isBack={true}
          styleTitle={{ fontSize: width < 380 ? 14 : 16, position: 'absolute', width: '100%', height: 40, alignSelf: 'flex-end', zIndex: -1 }}
        />
        {true && <TestResultTabContainer
          screenProps={{ assignmentId, testIdStudent, navigation: this.props.navigation }}
        />}
      </View>
    );
  }
}
