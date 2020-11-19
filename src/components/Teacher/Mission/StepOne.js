import React, { Component } from 'react';
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TextInput,
  Dimensions,
} from 'react-native';
import ModalEditor from '../../common-new/Editor';
import HTML from 'react-native-render-html';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast, { DURATION } from 'react-native-easy-toast';
import _ from 'lodash';
import dataHelper from '../../../utils/dataHelper';
import Global from '../../../utils/Globals';

export default class StepOne extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      htmlContent,
      valueClass: '',
      valueSubject: '',
      nameMission: '',
    };
    Global.resetStateStepOne = this.reset.bind(this);
  }
  token = null;

  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    const { token } = await dataHelper.getToken();
    this.token = token;
  }

  reset = () => {
    this.setState({
      htmlContent,
      valueClass: '',
      valueSubject: '',
      nameMission: '',
    });
  }

  onOpenEditor = () => {
    const { htmlContent } = this.state;
    this.modalEditor.onShow(htmlContent);
  };

  onDone = htmlContent => {
    this.setState({ htmlContent });
  };

  onChangeClass = v => {
    this.setState({ valueClass: v });
  };

  handleNextStepTwo = () => {
    const { valueClass, valueSubject, nameMission, htmlContent } = this.state;
    const gradeId = `C${valueClass.split(' ')[1]}`;
    if (
      _.isEmpty(valueClass) ||
      _.isEmpty(valueSubject) ||
      _.isEmpty(nameMission)
    ) {
      this.refToast.show('Bạn chưa điền đầy đủ thông tin', 3000);
      return;
    }
    let { listSubject } = this.props.screenProps;
    let subjectId = '';
    subjectId = listSubject.find(item => item.name == valueSubject).code;
    const formData = {
      gradeId,
      subjectId,
      nameMission,
    };
    this.props.screenProps.getCategoryHirachyMission({
      token: this.token,
      gradeId: formData.gradeId,
      subjectId: formData.subjectId,
    });
    this.props.screenProps.getCategoryTest({
      token: this.token,
      gradeId: formData.gradeId,
      subjectId: formData.subjectId,
    });
    this.props.navigation.navigate('StepTwo');
    const data = {
      ...this.props.screenProps.data,
      nameMission,
      valueSubject,
      valueClass,
      valueDes: htmlContent,
      subjectCode: subjectId,
      gradeId
    };
    this.props.screenProps.handleNextStep(1, data);
  };

  render() {
    const { htmlContent, valueClass, valueSubject, nameMission } = this.state;
    let { listSubject } = this.props.screenProps;
    listSubject = listSubject.map(item => ({
      label: item.name,
      value: item.name,
      ...item,
    }));
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.styTxtLabel}>Tên nhiệm vụ</Text>
        <TextInput
          placeholder={'Tên nhiệm vụ'}
          placeholderTextColor={'#ccc'}
          style={styles.styWrapInput}
          value={nameMission}
          onChangeText={nameMission => this.setState({ nameMission })}
        />

        <Text>Khối</Text>
        <View style={styles.viewRNPicker}>
          <RNPickerSelect
            placeholder={{
              label: '--- Chọn khối lớp ---',
              value: null,
            }}
            items={listClass}
            style={{ ...pickerSelectStyles }}
            onValueChange={value => {
              this.setState({ valueClass: value });
            }}
            value={valueClass}
            ref={el => {
              this.inputRefs.picker = el;
            }}
            hideIcon={true}
          />
          <Icon
            name={'angle-down'}
            size={25}
            color={'#000'}
            style={styles.icon}
          />
        </View>

        <Text>Môn học</Text>
        <View style={styles.viewRNPicker}>
          <RNPickerSelect
            placeholder={{
              label: '--- Chọn môn học ---',
              value: null,
            }}
            items={listSubject}
            style={{ ...pickerSelectStyles }}
            onValueChange={value => {
              this.setState({ valueSubject: value });
            }}
            value={valueSubject}
            ref={el => {
              this.inputRefs.picker = el;
            }}
            hideIcon={true}
          />
          <Icon
            name={'angle-down'}
            size={25}
            color={'#000'}
            style={styles.icon}
          />
        </View>

        <Text>Mô tả</Text>
        <TouchableOpacity style={styles.styWrapDes} onPress={this.onOpenEditor}>
          <HTML
            html={htmlContent}
            imagesMaxWidth={Dimensions.get('window').width}
            baseFontStyle={{ color: '#000' }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.styBtnNext}
          onPress={this.handleNextStepTwo}>
          <Text style={styles.styTxtBtnNext}>Bước tiếp theo</Text>
          <Icon
            name={'angle-right'}
            size={25}
            color={'#fff'}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Toast ref={ref => (this.refToast = ref)} position={'top'} />
        <ModalEditor
          ref={ref => (this.modalEditor = ref)}
          onDone={this.onDone}
        />
        <SafeAreaView />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  styWrapInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#999',
    margin: 10,
    color: '#000',
  },
  styWrapDes: {
    paddingHorizontal: 10,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#efefef',
    borderRadius: 5,
    margin: 10,
    minHeight: 200
  },
  viewRNPicker: {
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
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
    fontFamily: 'Nunito-Regular',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderRadius: 5,
    color: '#000',
    fontFamily: 'Nunito-Regular',
    height: 35,
    margin: 10,
    borderWidth: 1,
    borderColor: '#999',
  },
  inputAndroid: {
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderRadius: 5,
    backgroundColor: '#446BA0',
    color: '#000',
    fontFamily: 'Nunito-Regular',
    borderWidth: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: '#999',
  },
});

const htmlContent = `
    <h4 style="font-weight: 300;">Viết mô tả cho nhiệm vụ này...</h4>
`;

const listClass = [];

for (let i = 1; i <= 12; i++) {
  listClass.push({ label: `Lớp ${i}`, value: `Lớp ${i}` });
}
