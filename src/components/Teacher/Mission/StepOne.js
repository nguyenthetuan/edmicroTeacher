import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TextInput,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import ModalEditor from '../../common-new/Editor';
import HTML from 'react-native-render-html';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast, { DURATION } from 'react-native-easy-toast';
import _ from 'lodash';
import dataHelper from '../../../utils/dataHelper';
import Global from '../../../utils/Globals';
import AppIcon from '../../../utils/AppIcon';

export default class StepOne extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      htmlContent: '',
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
      htmlContent: '',
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
    Keyboard.dismiss();
    const {
      valueClass,
      valueSubject,
      nameMission,
      htmlContent
    } = this.state;
    if (
      _.isEmpty(valueClass) ||
      _.isEmpty(valueSubject) ||
      _.isEmpty(nameMission)
    ) {
      this.refToast.show('Bạn chưa điền đầy đủ thông tin', 3000);
      return;
    }
    const gradeId = `C${valueClass.split(' ')[1]}`;
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
    const {
      htmlContent,
      valueClass,
      valueSubject,
      nameMission
    } = this.state;
    let { listSubject } = this.props.screenProps;
    listSubject = listSubject.map(item => ({
      label: item.name,
      value: item.name,
      ...item,
    }));
    return (
      <View style={styles.container}>
        <ScrollView style={[styles.container,
        {
          paddingHorizontal: 0, marginTop: 20
        }]}>
          <Text style={styles.styTxtLabel}>Tên nhiệm vụ</Text>
          <View style={{ justifyContent: 'center' }}>
            <TextInput
              placeholder={'Tên nhiệm vụ'}
              placeholderTextColor={'#979797'}
              style={styles.styWrapInput}
              value={nameMission}
              onChangeText={nameMission => this.setState({ nameMission })}
            />
            <TouchableOpacity style={styles.iconEdit}>
              <Image source={AppIcon.icon_editNameMission} />
            </TouchableOpacity>
          </View>
          <Text style={styles.styTxtLabel}>Khối</Text>
          <View style={styles.viewRNPicker}>
            <RNPickerSelect
              placeholder={{
                label: '--- Chọn khối lớp ---',
                value: null,
              }}
              underlineColorAndroid="rgba(0,0,0,0)"
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
              color={Platform.OS == 'android' ? '#979797' : '#000'}
              style={styles.icon}
            />
          </View>
          <Text style={styles.styTxtLabel}>Môn học</Text>
          <View style={styles.viewRNPicker}>
            <RNPickerSelect
              underlineColorAndroid="rgba(0,0,0,0)"
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
              color={Platform.OS == 'android' ? '#979797' : '#000'}
              style={styles.icon}
            />
          </View>

          <Text style={styles.styTxtLabel}>Mô tả</Text>
          <TouchableOpacity style={styles.styWrapDes} onPress={this.onOpenEditor}>
            <HTML
              html={htmlContent}
              imagesMaxWidth={Dimensions.get('window').width}
              baseFontStyle={{ color: '#000' }}
            />
            {!htmlContent ? <Text style={styles.styTxtPlacehoder}>Viết mô tả cho nhiệm vụ này...</Text> : null}
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity
          style={styles.styBtnNext}
          onPress={this.handleNextStepTwo}>
          <Text style={styles.styTxtBtnNext}>Bước tiếp theo</Text>
        </TouchableOpacity>
        <Toast ref={ref => (this.refToast = ref)} position={'top'} />
        <ModalEditor
          ref={ref => (this.modalEditor = ref)}
          onDone={this.onDone}
        />
        <SafeAreaView />
      </View>
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
    borderColor: '#979797',
    margin: 10,
    color: '#000',
    paddingLeft: 8,
    height: 45,
  },
  styWrapDes: {
    paddingHorizontal: 10,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#979797',
    borderRadius: 5,
    margin: 10,
    padding: 10,
    minHeight: 200
  },
  viewRNPicker: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: Platform.OS == 'android' ? '#828282' : '#979797',
    justifyContent: 'center',
    // borderWidth: Platform.OS == 'android' ? 1 : 0,
    borderWidth: 1,
    height: 45,
    marginHorizontal: Platform.OS == 'android' ? 10 : 10,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  iconEdit: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 20,
    paddingRight: 20
  },
  styBtnNext: {
    backgroundColor: '#2D9CDB',
    borderRadius: 25,
    marginBottom: 10,
    marginLeft: 27,
    marginRight: 27,
    alignItems: 'center',
    justifyContent: 'center'
  },
  styTxtBtnNext: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    lineHeight: 21,
    alignItems: 'center',
    alignSelf: 'center',
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 14
  },
  styTxtLabel: {
    fontFamily: 'Nunito',
    color: "#000",
    fontSize: 14,
    lineHeight: 19,
    marginLeft: 10
  },
  styTxtPlacehoder: {
    color: '#979797'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#000',
    fontFamily: 'Nunito-Regular',
    height: 35,
    margin: 10,
    // borderWidth: 1,
    // borderColor: '#979797',
  },
  inputAndroid: {
    borderRadius: 5,
    color: '#000',
    // backgroundColor:'red',
    height: 44,
    fontFamily: 'Nunito-Regular',
    // borderWidth: 1,
    // borderColor: '#999',
  },
});

const listClass = [];

for (let i = 1; i <= 12; i++) {
  listClass.push({ label: `Lớp ${i}`, value: `Lớp ${i}` });
}
