import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
  Text,
  KeyboardAvoidingView
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
import _ from 'lodash';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
    if (index == 0 && _.isEmpty(data)) {
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
    Alert.alert('', 'Dữ liệu sẽ không được lưu khi bạn rời khỏi đây', [
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
          color={'#979797'}
        />
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView style={{ backgroundColor: '#fff' }}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={this.state.currentPosition}
              labels={labels}
              stepCount={4}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        <TopTabMissionContain
          screenProps={{
            ...this.props,
            handleNextStep: this.handleNextStep,
            token: this.token,
            data: this.state.data,
            goback: this.goBack,
          }}
        />
      </SafeAreaView >
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
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: '#56ccf2',
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: '#56ccf2',
  stepStrokeUnFinishedColor: '#979797',
  separatorFinishedColor: '#56ccf2',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#56ccf2',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#56ccf2',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#000',
  labelColor: '#757575',
  labelSize: 13,
  currentStepLabelColor: '#56ccf2',
  labelFontFamily: 'Nunito-Bold'
}

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
