import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import dataHelper from '../../../utils/dataHelper';
import StepIndicator from 'react-native-step-indicator';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Global from '../../../utils/Globals';
export default class MissionStepByStep extends Component {
  token = null;
  state = {
    currentPosition: 0,
    data: {},
  };

  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    const { token } = await dataHelper.getToken();
    this.token = token;
  }

  disableKeybroad = () => {
    Keyboard.dismiss();
  };

  handleNextStep = (index, data) => {
    if (index == 0) {
      Global.resetStateStepOne();
      this.setState({ currentPosition: index, data: {} });
      return;
    }
    if (data) {
      this.setState({ data });
    }
    this.setState({ currentPosition: index });
  };

  goBack = () => {
    Alert.alert('Thông báo', 'Dữ liệu sẽ không được lưu khi bạn rời khỏi đây', [
      {
        text: 'Rời khỏi',
        onPress: () => {
          this.props.navigation.goBack();
        }
      },
      {
        text: 'Ở lại',
        onPress: () => { }
      },
    ])
  }

  render() {
    return (
      <SafeAreaView style={styles.contain}>
        <HeaderNavigation
          title={'Thêm nhiệm vụ'}
          navigation={this.props.navigation}
          actionIcon={false}
          goBack={this.goBack}
        />
        <View style={{ backgroundColor: '#fff' }}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={this.state.currentPosition}
            labels={labels}
            stepCount={4}
          />
        </View>
        <TopTabMissionContain
          screenProps={{
            ...this.props,
            handleNextStep: this.handleNextStep,
            token: this.token,
            data: this.state.data,
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
  },
});

const labels = ['Cấu hình', 'Chọn bài', 'Kiểm tra', 'Kết thúc'];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: '#62ACE1',
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: '#62ACE1',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#62ACE1',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#62ACE1',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 12,
  stepIndicatorLabelCurrentColor: '#62ACE1',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 12,
  currentStepLabelColor: '#62ACE1',
  labelFontFamily: 'Nunito-Regular',
  labelAlign: 'center',
};

const topTabMission = createMaterialTopTabNavigator(
  {
    StepOne: {
      screen: StepOne,
    },
    StepTwo: {
      screen: StepTwo,
    },
    StepThree: {
      screen: StepThree,
    },
    StepFour: {
      screen: StepFour
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      showIcon: false,
    },
    tabBarComponent: () => <View />,
    swipeEnabled: false,
    lazy: true,
  },
);

const TopTabMissionContain = createAppContainer(topTabMission);
