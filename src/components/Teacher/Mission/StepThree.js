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
} from 'react-native';
import ModalEditor from '../../common-new/Editor';
import HTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast, { DURATION } from 'react-native-easy-toast';
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
  async componentDidMount() {
    const { token } = await dataHelper.getToken();
    this.token = token;
  }

  handleNextStepFour = async () => {
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
      this.setState({ isLoading: false });
    }
  };

  handleNextStepTwo = () => {
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
      <>
        <Text>Tự luyện</Text>
        <View>
          <View style={styles.styWrapHeader}>
            <Text style={[styles.styName, { flex: 1 }]}>Tên nhiệm vụ</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.styName, { flexGrow: 1 }]}>Số lần</Text>
              <Text style={[styles.styName, { flexGrow: 1 }]}> | </Text>
              <Text style={[styles.styName, { flexGrow: 1 }]}>Hủy</Text>
            </View>
          </View>
          <SectionList
            sections={dataTemp}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <ItemSectionListPrac
              onPress={this.deleteRow(item)}
              item={item}
            />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.styTxtHeader}>- {title}</Text>
            )}
          />
        </View>
      </>
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
      <>
        <Text>Kiểm tra</Text>
        <View>
          <View style={styles.styWrapHeader}>
            <Text style={[styles.styName]}>Tên nhiệm vụ</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.styName, { flexGrow: 1 }]}>Điểm</Text>
              <Text style={[styles.styName, { flexGrow: 1 }]}> | </Text>
              <Text style={[styles.styName, { flexGrow: 1 }]}>Số lần</Text>
              <Text style={[styles.styName, { flexGrow: 1 }]}> | </Text>
              <Text style={[styles.styName, { flexGrow: 1 }]}>Hủy</Text>
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
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.styTxtHeader}>- {title}</Text>
            )}
          />
        </View>
      </>
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
          <View>
            <Text style={styles.styTxtLabel}>Tên nhiệm vụ</Text>
            <TextInput
              placeholder={'Tên nhiệm vụ'}
              placeholderTextColor={'#ccc'}
              style={styles.styWrapInput}
              value={nameMission}
              onChangeText={nameMission => this.setState({ nameMission })}
            />
          </View>

          <View style={[styles.styWrapInfo, { marginVertical: 10 }]}>
            <View style={styles.styWrapInfo}>
              <Text style={styles.styTxtInfo}>Khối</Text>
              <Text style={styles.styWrapSubject}>{valueClass}</Text>
            </View>

            <View style={styles.styWrapInfo}>
              <Text style={styles.styTxtInfo}>Môn học</Text>
              <Text style={styles.styWrapSubject}>{valueSubject}</Text>
            </View>
          </View>

          <View>
            <Text>Mô tả</Text>
            <TouchableOpacity style={styles.styWrapDes} onPress={this.onOpenEditor}>
              <HTML
                html={htmlContent}
                imagesMaxWidth={Dimensions.get('window').width}
              />
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
            <Icon
              name={'angle-right'}
              size={25}
              color={'#fff'}
              style={styles.icon}
            />
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={styles.styBtnNext}
            onPress={this.handleNextStepTwo}>
            <Text style={styles.styTxtBtnNext}>Chọn bộ đề</Text>
            <Icon
              name={'angle-left'}
              size={25}
              color={'#fff'}
              style={[styles.icon, { alignSelf: 'flex-start', paddingLeft: 40 }]}
            />
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
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#999',
    margin: 10,
    color: '#000',
  },
  styWrapDes: {
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#efefef',
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62ACE1',
    margin: 10,
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
  styWrapSubject: {
    borderWidth: 1,
    padding: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: '#999',
    minWidth: 80,
    textAlign: 'center',
  },
  styWrapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  styTxtInfo: {
    fontFamily: 'Nunito-Regular',
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
  }
});

const htmlContent = `
    <h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <em style="textAlign: center;">Look at how happy this native cat is</em>
`;
const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];
