import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import dataHelper from '../../../utils/dataHelper';
import _ from 'lodash';
import TabMissionType from './TabMissionType';
import Toast from 'react-native-easy-toast';
import Global from '../../../utils/Globals';
export default class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      activeSections: [],
      listProblem: [],
      dataPracticeAdd: [],
      dataTestAdd: [],
    };
  }

  token = null;
  componentDidMount() {
    this.getToken();
    Global.resetDataSelect = this.resetDataSelect;
  }

  async getToken() {
    const { token } = await dataHelper.getToken();
    this.token = token;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.screenProps.listProblem != state.listProblem) {
      return {
        listProblem: props.screenProps.listProblem,
      };
    }
    return null;
  }

  changeDataPracticeAdd = dataPracticeAdd => {
    this.setState({ dataPracticeAdd });
  };

  changeDataTestAdd = dataTestAdd => {
    this.setState({ dataTestAdd });
  };

  handleNextStepThree = () => {
    const { dataPracticeAdd, dataTestAdd } = this.state;
    if (dataPracticeAdd.length == 0 && dataTestAdd.length == 0) {
      this.refToast.show('Bạn chưa chọn nhiệm vụ cho học sinh', 1000);
      return;
    }
    const data = {
      ...this.props.screenProps.data,
      dataPracticeAdd,
      dataTestAdd,
    };
    this.props.navigation.navigate('StepThree');
    this.props.screenProps.handleNextStep(2, data);
  };

  resetDataSelect = () => {
    this.setState({ dataPracticeAdd: [], dataTestAdd: [] });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.styTxtLabel}>Chọn nhiệm vụ ôn luyện </Text>
        <TabMissionType
          screenProps={{
            ...this.props.screenProps,
            changeDataPracticeAdd: this.changeDataPracticeAdd,
            changeDataTestAdd: this.changeDataTestAdd,
          }}
        />
        <TouchableOpacity
          style={styles.styBtnNext}
          onPress={this.handleNextStepThree}>
          <Text style={styles.styTxtBtnNext}>Bước tiếp theo</Text>
          <Icon
            name={'angle-right'}
            size={25}
            color={'#fff'}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Toast ref={ref => (this.refToast = ref)} position={'top'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  styBtnNext: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62ACE1',
    marginVertical: 10,
    borderRadius: 5,
  },
  styTxtBtnNext: {
    color: '#FFF',
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
  },
  styTxtLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    marginTop: 10,
  },
  styHeaderList: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: '#efefef',
    flexDirection: 'row',
    // alignItems: 'center',
  },
  headerTextIndex: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: '#999',
    marginHorizontal: 10,
  },
  headerTextTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#000',
    marginRight: 20,
  },
  styWrapBtnAdd: {
    borderRadius: 5,
    backgroundColor: '#28a745',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styTxtBtnAdd: {
    color: '#FFF',
    fontFamily: 'Nunito-Regular',
    marginHorizontal: 5,
  },
  styTxtName: {
    color: '#007bff',
    fontFamily: 'Nunito-Bold',
    flex: 1,
  },
  styWrapItem: {
    borderWidth: 1,
    borderColor: '#efefef',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
