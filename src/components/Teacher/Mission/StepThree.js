import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Dimensions,
  SectionList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import ModalEditor from '../../common-new/Editor';
import HTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import dataHelper from '../../../utils/dataHelper';
import ItemSectionListPrac from './ItemSectionListPrac';
import { createMission } from '../../../services/apiMission';
const { width, height } = Dimensions.get('window');
export default class StepThree extends Component {
  constructor(props) {
    super(props);
    const {
      nameMission,
      valueClass,
      valueSubject,
      dataPracticeAdd,
      dataTestAdd,
      valueDes,
      gradeId,
      subjectCode,
    } = props.screenProps.data;
    this.inputRefs = {};
    this.state = {
      htmlContent: valueDes,
      valueClass,
      valueSubject,
      subjectCode,
      gradeId,
      nameMission,
      isLoading: false
    };
  }

  token = null;
  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    const { token } = await dataHelper.getToken();
    this.token = token;
  }

  handleNextStepFour = async () => {
    Keyboard.dismiss();
    // this.props.navigation.navigate('StepFour');
    // this.props.screenProps.handleNextStep(3);
    // return;
    this.setState({ isLoading: true });
    let {
      htmlContent,
      gradeId,
      nameMission,
      subjectCode
    } = this.state;
    let { dataPracticeAdd, dataTestAdd } = this.props.screenProps.data;

    dataPracticeAdd = dataPracticeAdd.map(item => ({
      countDone: item.countDone || 1,
      percentDone: 100,
      problemId: item.problemCode
    }));

    dataTestAdd = dataTestAdd.map(item => ({
      countDone: item.countDone || 1,
      markDone: item.markDone || 7,
      testId: item.testId,
    }))

    const params = {
      description: htmlContent,
      gradeId,
      title: nameMission,
      listProblem: dataPracticeAdd,
      listTest: dataTestAdd,
      subjectCode,
      typeMission: null
    }
    const payload = {
      token: this.token,
      params
    };
    const response = await createMission(payload);
    if (response.status == 0) {
      this.props.navigation.navigate('StepFour');
      this.props.screenProps.handleNextStep(3);
      this.props.screenProps.getAssignmentByMission({ token: this.token, _id: response._id });
      this.setState({ isLoading: false });
    }
  };

  handleNextStepTwo = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('StepTwo');
    this.props.screenProps.handleNextStep(1);
  }

  onOpenEditor = () => {
    const { htmlContent } = this.state;
    this.modalEditor.onShow(htmlContent);
  };

  onDone = htmlContent => {
    this.setState({ htmlContent });
  };

  renderItem = item => (
    <View style={styles.styWrapElement}>
      <Text style={styles.title}>{item.name}</Text>
    </View>
  );

  deleteRow = (item) => () => {
    try {
      let { dataPracticeAdd, dataTestAdd } = this.props.screenProps.data;
      if (item.testId) {
        dataTestAdd = dataTestAdd.filter(elem => elem.testId != item.testId);
        this.props.screenProps.handleNextStep(2, {
          ...this.props.screenProps.data,
          dataTestAdd
        });
        return;
      }
      dataPracticeAdd = dataPracticeAdd.filter(elem => elem.id != item.id);
      this.props.screenProps.handleNextStep(2, {
        ...this.props.screenProps.data,
        dataPracticeAdd
      });

    } catch (error) {

    }
  };

  renderPractice = () => {
    let { dataPracticeAdd } = this.props.screenProps.data;
    if (dataPracticeAdd && dataPracticeAdd.length == 0) {
      return null;
    }
    const dataTemp = _.chain(dataPracticeAdd)
      .groupBy('problemHierachyId')
      .map((value, key) => ({ title: value[0].problemHierachyName, data: value }))
      .value();
    return (
      <View style={styles.ViewTable}>
        <Text style={styles.styTxtLabelParac}>Tự luyện</Text>
        <View style={styles.borderAll}>
          <View style={styles.styWrapHeader}>
            <Text style={[styles.styName, { marginLeft: 12 }]}>Tên nhiệm vụ</Text>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5 }]}>Số lần</Text>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5 }]}>Hủy</Text>
            </View>
          </View>
          <SectionList
            sections={dataTemp}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <ItemSectionListPrac
              onPress={this.deleteRow(item)}
              item={item}
            />}
            style={styles.sectionList}
          // renderSectionHeader={({ section: { title } }) => (
          //   <Text style={styles.styTxtHeader}>- {title}</Text>
          // )}
          />
        </View>
      </View>
    );
  }

  renderTest = () => {
    // let { dataTestAdd } = this.state;
    let { dataTestAdd } = this.props.screenProps.data;
    if (dataTestAdd && dataTestAdd.length == 0) {
      return null;
    }
    const dataTemp = _.chain(dataTestAdd)
      .groupBy('title')
      .map((value, key) => ({ title: value[0].title, data: value }))
      .value();
    return (
      <View style={styles.ViewTable}>
        <Text style={styles.styTxtLabelParac}>Kiểm tra</Text>
        <View style={styles.borderAll}>
          <View style={styles.styWrapHeader}>
            <Text style={[styles.styName, { marginLeft: 12 }]}>Tên nhiệm vụ</Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5 }]}>Điểm</Text>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5 }]}>Số lần</Text>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5 }]}>Hủy</Text>
            </View>
          </View>
          <SectionList
            sections={dataTemp}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <ItemSectionListPrac
              isTest={true}
              onPress={this.deleteRow(item)}
              item={item}
            />}
            style={styles.sectionList}
          // renderSectionHeader={({ section: { title } }) => (
          //   <Text style={styles.styTxtHeader}>- {title}</Text>
          // )}
          />
        </View>
      </View>
    );
  }

  render() {
    let {
      nameMission,
      valueClass,
      valueSubject,
      htmlContent,
      isLoading
    } = this.state;
    const {
      dataPracticeAdd,
      dataTestAdd,
    } = this.props.screenProps.data;
    let isShowBtnNext = false;
    try {
      isShowBtnNext = dataPracticeAdd.length > 0 || dataTestAdd.length > 0;
    } catch (error) { }
    return (
      <>
        <ScrollView
          style={{ marginHorizontal: 10, marginTop: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.flexNameMiss}>
            <Text numberOfLines={2}
              style={styles.styTxtLabel}>Tên nhiệm vụ</Text>
            <TextInput
              placeholder={'Tên nhiệm vụ'}
              placeholderTextColor={'#ccc'}
              style={styles.styWrapInput}
              value={nameMission}
              onChangeText={nameMission => this.setState({ nameMission })}
            />
          </View>

          <View style={styles.flexWrap}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.styTxtInfo}>Khối</Text>
              <TouchableOpacity style={styles.styWrapInfo}>
                <View style={styles.flexIconVa}>
                  <Text style={styles.styWrapSubject}>{valueClass}</Text>
                  <Icon name={'angle-down'} color={'#000'} size={14}
                    style={{ marginRight: 10, marginLeft: 5 }} />
                </View>
              </TouchableOpacity>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.styTxtInfo}>Môn học</Text>
                <TouchableOpacity style={styles.styWrapInfo}>
                  <View style={styles.flexIconVa}>
                    <Text style={styles.styWrapSubject}>{valueSubject}</Text>
                    <Icon name={'angle-down'} color={'#000'} size={14}
                      style={{ marginRight: 10, marginLeft: 5 }} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          <View>
            <Text style={styles.styTxtLabelMoTa}>Mô tả</Text>
            <TouchableOpacity style={styles.styWrapDes} onPress={this.onOpenEditor}>
              <HTML
                html={htmlContent}
                imagesMaxWidth={Dimensions.get('window').width}
              />
              {!htmlContent ? <Text style={styles.styTxtPlacehoder}>Nhập...</Text> : null}
            </TouchableOpacity>
          </View>
          {this.renderPractice()}
          {this.renderTest()}
        </ScrollView>
        {isShowBtnNext ?
          <TouchableOpacity
            style={styles.styBtnNext}
            onPress={this.handleNextStepFour}>
            <Text style={styles.styTxtBtnNext}>Bước tiếp theo</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={styles.styBtnNext}
            onPress={this.handleNextStepTwo}>
            <Text style={styles.styTxtBtnNext}>Chọn bộ đề</Text>
          </TouchableOpacity>
        }
        {isLoading && <ActivityIndicator style={styles.styWrapLoading} color={'#62ACE1'} />}
        <ModalEditor
          ref={ref => (this.modalEditor = ref)}
          onDone={this.onDone}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
  },
  styWrapInput: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#B5B5B5',
    margin: 10,
    color: '#000',
    width: "70%",
    alignSelf: 'center'
    // backgroundColor: 'red'
  },
  styWrapDes: {
    padding: 10,
    borderWidth: 0.5,
    overflow: 'hidden',
    borderColor: '#828282',
    borderRadius: 5,
    margin: 10,
    minHeight: 100
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
    backgroundColor: '#2D9CDB',
    borderRadius: 25,
    marginBottom: 10,
    marginLeft: 27,
    marginRight: 27,
    marginTop: 20
  },
  styTxtBtnNext: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    lineHeight: 21,
    alignItems: 'center',
    alignSelf: 'center',
    fontWeight: "500",
    marginTop: 14,
    marginBottom: 14
  },
  styTxtLabel: {
    fontFamily: 'Nunito-Bold',
    color: "#000",
    fontSize: 14,
    lineHeight: 19,
    marginLeft: 16,
    alignSelf: 'center',
    width: 95
  },
  styTxtLabelMoTa: {
    fontFamily: 'Nunito-Bold',
    color: "#000",
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 28
  },
  styTxtLabelParac: {
    fontFamily: 'Nunito-Bold',
    color: "#000",
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'left',
    // marginLeft: 10,
    marginTop: 36
  },
  styWrapSubject: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    // minWidth: 80,
    textAlign: 'center',
    color: "#828282"
  },
  styWrapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  styTxtInfo: {
    fontFamily: 'Nunito',
    fontSize: 14,
    lineHeight: 19,
    color: "#424242",
    marginLeft: 8,
    alignSelf: 'center'
  },
  styWrapElement: {
    borderWidth: 1,
    padding: 5,
  },
  styWrapHeader: {
    flexDirection: 'row',
    backgroundColor: '#2D9CDB',
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'space-between',
  },
  styName: {
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  styTxtHeader: {
    color: '#1c4db2',
    marginTop: 5,
    marginHorizontal: 3,
    fontSize: 12
  },
  styWrapLoading: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    width,
    height,
    top: -100
  },
  styTxtPlacehoder: {
    color: '#999',
  },
  flexNameMiss: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignSelf: 'center',
  },
  flexIconVa: {
    flexDirection: "row",
    justifyContent: 'space-between',
    borderWidth: 0.5,
    backgroundColor: '#DDDDDD',
    borderColor: '#828282',
    marginLeft: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  ViewTable: {
    marginLeft: 10,
    marginRight: 10
  },
  borderAll: {
    marginTop: 5,
    borderWidth: 0.5,
    borderColor: '#828282',
    borderRadius: 5
  },
  sectionList: {
    flex: 1,
    padding: 1
  },
  flexWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:10
  }
});