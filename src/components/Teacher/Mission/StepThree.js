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
import Icon from 'react-native-vector-icons/AntDesign';
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


  handleNextStepTwo = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('StepTwo');
    this.props.screenProps.handleNextStep(1);
  }


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
        <Text style={styles.styTxtLabel}>Tự luyện</Text>
        <View style={{ marginTop: 5 }}>
          <View style={styles.styWrapHeader}>
            <Text style={[styles.styName]}>Tên nhiệm vụ</Text>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5, marginRight: 23 }]}>Số lần</Text>
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
        <Text style={styles.styTxtLabel}>Kiểm tra</Text>
        <View style={{ marginTop: 5 }}>
          <View style={styles.styWrapHeader}>
            <Text style={[styles.styName]}>Tên nhiệm vụ</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5, marginRight: 23 }]}>Điểm</Text>
              <Text style={[styles.styName, { flexGrow: 1, paddingHorizontal: 5, marginRight: 23 }]}>Số lần</Text>
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
    return (
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <ScrollView
          style={{ marginTop: 10 }}
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
              {!htmlContent ? <Text style={styles.styTxtPlacehoder}>Viết mô tả cho nhiệm vụ này...</Text> : null}
            </TouchableOpacity>
          </View>

          {this.renderPractice()}
          {this.renderTest()}
        </ScrollView>

        <View style={styles.styWrapBtn}>
          <TouchableOpacity
            style={styles.styBtnBack}
            onPress={this.handleNextStepTwo}>
            <Icon name={'arrowleft'} style={styles.styTxtBtnNext} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.styBtnNext}
            onPress={this.handleNextStepFour}>
            <Text style={styles.styTxtBtnNext}>
              Bước tiếp theo
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && <ActivityIndicator style={styles.styWrapLoading} color={'#62ACE1'} />}
        <ModalEditor
          ref={ref => (this.modalEditor = ref)}
          onDone={this.onDone}
        />
      </View>
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
  styBtnNext: {
    backgroundColor: '#2D9CDB',
    borderRadius: 25,
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  styWrapBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  styBtnBack: {
    backgroundColor: '#2D9CDB',
    borderRadius: 25,
    marginBottom: 10,
    width: 50, height: 50
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
  }
});
