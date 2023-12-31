import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TextInput,
  Dimensions,
  Platform,
  Image,
  TouchableWithoutFeedback
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
import { RFFonsize } from '../../../utils/Fonts';

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

  reset = async () => {
    await this.setState({
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
    console.log("🚀 ~ file: StepOne.js ~ line 126 ~ StepOne ~ render ~ htmlContent", htmlContent)
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
          paddingHorizontal: 0, marginTop: 13
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
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
              <View style={styles.iconEdit}>
                <Image source={AppIcon.icon_editNameMission} style={styles.clIcon} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text style={[styles.styTxtLabel, { marginTop: 20 }]}>Khối</Text>
          <View style={styles.viewRNPicker}>
            <RNPickerSelect
              placeholder={{
                label: 'Chọn khối lớp',
                value: null,
              }}
              placeholderTextColor="#979797"
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
          <Text style={[styles.styTxtLabel, { marginTop: 26 }]}>Môn học</Text>
          <View style={styles.viewRNPicker}>
            <RNPickerSelect
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={{
                label: 'Chọn môn học',
                value: null,
              }}
              placeholderTextColor="#979797"
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
          <Text style={[styles.styTxtLabel, { marginTop: 24 }]}>Mô tả</Text>
          <TouchableWithoutFeedback onPress={this.onOpenEditor}>
            <View style={styles.styWrapDes}>
              {!htmlContent ?
                <Text style={styles.styTxtPlacehoder}>Viết mô tả cho nhiệm vụ này...</Text> :
                <HTML
                  html={htmlContent}
                  imagesMaxWidth={Dimensions.get('window').width}
                  baseFontStyle={{ color: '#000' }}
                />}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <TouchableWithoutFeedback
          onPress={this.handleNextStepTwo}>
          <View style={styles.styBtnNext}>
            <Text style={styles.styTxtBtnNext}>Bước tiếp theo</Text>
          </View>
        </TouchableWithoutFeedback>
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
    backgroundColor: '#EEFAFE',
    marginTop: 20
  },
  styWrapInput: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#B5B5B5',
    marginHorizontal: 10,
    marginTop: 8,
    color: '#000',
    paddingLeft: 16,
    height: 45,
    backgroundColor: '#fff',
    paddingRight: 40,
    fontFamily: "Nunito-Regular",
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18)
  },
  styWrapDes: {
    paddingHorizontal: 16,
    borderWidth: 0.5,
    overflow: 'hidden',
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 10,
    minHeight: 100,
    marginTop: 8,
    borderColor: '#B5B5B5',
    backgroundColor: '#fff'
  },
  viewRNPicker: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: Platform.OS == 'android' ? '#B5B5B5' : '#B5B5B5',
    justifyContent: 'center',
    // borderWidth: Platform.OS == 'android' ? 1 : 0,
    borderWidth: 0.5,
    height: 45,
    marginHorizontal: Platform.OS == 'android' ? 10 : 10,
    marginTop: 8
  },
  icon: {
    zIndex: -1,
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 15,
    color: '#979797'
  },
  iconEdit: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 20,
    paddingRight: 25
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
    fontSize: RFFonsize(16),
    lineHeight: RFFonsize(21),
    alignItems: 'center',
    alignSelf: 'center',
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 14
  },
  styTxtLabel: {
    fontFamily: 'Nunito',
    color: "#000",
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    marginLeft: 10
  },
  styTxtPlacehoder: {
    color: '#979797',
    fontFamily: 'Nunito',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18)
  },
  clIcon: {
    tintColor: '#979797'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderRadius: 5,
    color: '#000',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18),
    height: 35,
    margin: 16
  },
  underline: {
    borderTopWidth: 0,
  },
  inputAndroid: {
    borderRadius: 5,
    borderTopWidth: 0,
    color: '#000',
    height: 45,
    margin: 8,
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18)
  }
});

const listClass = [];

for (let i = 1; i <= 12; i++) {
  listClass.push({ label: `Lớp ${i}`, value: `Lớp ${i}` });
}
