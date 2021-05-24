import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import HeaderResultPDF from './HeaderResultPDF';
import * as AppIcon from '../../../../utils/AppIcon';
import RippleButton from '../../../libs/RippleButton';
import Pdf from 'react-native-pdf';
import Common from '../../../../utils/Common';
import TaskResultComponent from './TaskResultComponent';
import { roundNumberOne } from '../../../../utils/Common';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
const { width, height } = Dimensions.get('window');

class SchoolResultPDF extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 'debai',
      report: null,
      isLoading: true,
      answerFile: '',
      listFile: '',
      totalQuestion: 0,
      totalCorrect: 0,
      arrRightAnswer: [],
      isNotification: false,
      assignId: this.props.navigation.state.params,
      dataForTaskResult: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { responseJson } = this.props.navigation.state.params;
    this.upDateState(responseJson);
  };

  onCloseClick = () => {
    this.myTimeonCloseClick = setTimeout(
      () => this.setState({ isNotification: false }),
      300,
    );
  };

  upDateState = (res) => {
    let arrRightAnswer = [];
    arrRightAnswer = res.data?.data.map((item) => {
      return {
        rightAnswer: item.dataStandard.rightAnswer,
        stepIndex: item.dataStandard.stepIndex,
        userOptionId:
          item.dataStandard.userOptionId && item.dataStandard.userOptionId[0],
      };
    });
    this.setState({
      answerFile: res.data ? res.data.answerFile : '',
      listFile: res.data?.listFile ? res.data.listFile[0] : '',
      isLoading: false,
      totalQuestion: res.data?.totalQuestion,
      totalCorrect: res.data?.totalCorrect,
      arrRightAnswer,
      report: res.data,
      dataForTaskResult: res.data ? res.data.data : [],
    });
  };

  changeTab = (tab = 'debai') => {
    const { tabActive } = this.state;
    if (tabActive == tab) {
      return;
    }
    this.setState({ tabActive: tab });
  };

  _onTop = () => {
    if (this.refs.ViewPDFDapAn) {
      this.refs.ViewPDFDapAn.scrollTop();
      return;
    }
    if (this.refs.ViewPDFDeBai) {
      this.refs.ViewPDFDeBai.scrollTop();
      return;
    }
  };

  changeTabComponent = (tab = 'debai') => {
    const {
      answerFile,
      listFile,
      report,
      dataForTaskResult,
    } = this.state;
    switch (tab) {
      case 'debai':
        return (
          <ViewPDFDeBai
            ref="ViewPDFDeBai"
            listFile={listFile}
            _onTop={this._onTop}
          />
        );
      case 'dapan':
        return (
          <ViewPDFDapAn
            ref="ViewPDFDapAn"
            answerFile={answerFile}
            _onTop={this._onTop}
          />
        );
      case 'chitiet':
        return (
          <SchoolResult report={report} />
        );
      case 'bailam':
        return (
          <TaskResultComponent dataForTaskResult={dataForTaskResult} />
        );
      default:
        return (
          <ViewPDFDeBai ref="ViewPDFDeBai" listFile={listFile} />
        );
    }
  };

  render() {
    const {
      tabActive,
      totalCorrect,
      totalQuestion,
      arrRightAnswer,
    } = this.state;
    const nameTest = this.props.navigation.state.params.nameTest
    return (
      <View style={{ flex: 1, backgroundColor: '#2D9CDB' }}>
        <View style={{ top: -10 }}>
          <HeaderResultPDF
            navigation={this.props.navigation}
            title={nameTest}
            bgColor="#2D9CDB"
            showIcon={1}
            back={true}
            colorIcon="#fff"
          />
        </View>
        <SafeAreaView style={styles.container}>
          <HeaderTab
            changeTab={this.changeTab}
            totalCorrect={totalCorrect}
            totalQuestion={totalQuestion}
            arrRightAnswer={arrRightAnswer}
            getData={this.getData}
            navigation={this.props.navigation}
          />
          {this.changeTabComponent(tabActive)}
        </SafeAreaView>
      </View>
    );
  }
}

class HeaderTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 'debai',
      isClick: true,
    };
  }

  changeTabDapAn = () => {
    this.props.changeTab('dapan');
    this.setState({ tabActive: 'dapan' });
  };

  changeTabDeBai = () => {
    this.props.changeTab('debai');
    this.setState({ tabActive: 'debai' });
  };

  changeTabChiTiet = () => {
    this.props.changeTab('chitiet');
    this.setState({ tabActive: 'chitiet' });
  };

  changeTabBaiLam = () => {
    this.props.changeTab('bailam');
    this.setState({ tabActive: 'bailam' });
  };

  render() {
    const { tabActive } = this.state;
    const {
      totalQuestion,
      totalCorrect,
    } = this.props;
    return (
      <View style={styles.containerHeader}>
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.txtTotalQuestionLeft}>
            Tổng số câu hỏi:{' '}
            <Text style={styles.txtTotalQuestion}>
              {' '}
              {totalQuestion || 0} câu
            </Text>
          </Text>

          <Text style={styles.txtTotalQuestionLeft}>
            Số câu đúng:{' '}
            <Text style={styles.txtTotalQuestion}>
              {' '}
              {totalCorrect || 0}/{totalQuestion || 0} câu
            </Text>
          </Text>
        </View>

        <View style={styles.wrapTab}>
          <ScrollView
            style={{ flex: 1, flexDirection: 'row' }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <RippleButton
              style={styles.btnTab}
              rippleColor={'#FFF'}
              radius={10}
              rippleSize={40}
              onPress={this.changeTabDeBai}>
              <Text
                style={
                  tabActive == 'debai' ? styles.txtTabActive : styles.txtTab
                }>
                Đề bài
              </Text>
              {tabActive == 'debai' && <View style={[styles.viewActive]} />}
            </RippleButton>

            <RippleButton
              style={styles.btnTab}
              rippleColor={'#FFF'}
              radius={10}
              rippleSize={40}
              onPress={this.changeTabDapAn}>
              <Text
                style={
                  tabActive == 'dapan' ? styles.txtTabActive : styles.txtTab
                }>
                Đáp án
              </Text>
              {tabActive == 'dapan' && <View style={[styles.viewActive]} />}
            </RippleButton>

            <RippleButton
              style={styles.btnTab}
              rippleColor={'#FFF'}
              radius={10}
              rippleSize={40}
              onPress={this.changeTabChiTiet}>
              <Text
                style={
                  tabActive == 'chitiet' ? styles.txtTabActive : styles.txtTab
                }>
                Chi tiết
              </Text>
              {tabActive == 'chitiet' && <View style={[styles.viewActive]} />}
            </RippleButton>

            <RippleButton
              style={styles.btnTab}
              rippleColor={'#FFF'}
              radius={10}
              rippleSize={40}
              onPress={this.changeTabBaiLam}>
              <Text
                style={
                  tabActive == 'bailam' ? styles.txtTabActive : styles.txtTab
                }>
                Bài làm
              </Text>
              {tabActive == 'bailam' && <View style={[styles.viewActive]} />}
            </RippleButton>
          </ScrollView>
        </View>
      </View>
    );
  }
}

class ViewPDFDeBai extends PureComponent {
  constructor(props) {
    super(props);
  }

  scrollTop = () => {
    if (this.refs.ViewPDFDeBai) {
      this.refs.ViewPDFDeBai.setPage(1);
    }
  };

  render() {
    const { listFile } = this.props;
    return (
      <View style={styles.containerPdf}>
        <Pdf
          ref={'ViewPDFDeBai'}
          fitPolicy={0}
          enableAnnotationRendering={false}
          source={{ uri: listFile, cache: true }}
          enableAntialiasing={true}
          activityIndicatorProps={{
            color: '#009900',
            progressTintColor: '#009900',
          }}
          style={styles.pdf}
        />
        <TouchableOpacity
          style={styles.buttomTop}
          onPress={() => this.props._onTop()}>
          <IconAntDesign name={'arrowup'} size={18} color={'#FFF'} />
          <Text style={{ color: '#FAFAFA' }}>TOP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class ViewPDFDapAn extends PureComponent {
  constructor(props) {
    super(props);
  }

  scrollTop = () => {
    if (this.refs.ViewPDFDapAn) {
      this.refs.ViewPDFDapAn.setPage(1);
    }
  };

  render() {
    const { answerFile } = this.props;
    return (
      <View style={styles.containerPdf}>
        {!answerFile ? (
          <Text style={styles.txtH1}>Hiện tại chưa có đáp án</Text>
        ) : (
          <>
            <Pdf
              ref="ViewPDFDapAn"
              fitPolicy={0}
              enableAnnotationRendering={false}
              enableAntialiasing={true}
              activityIndicatorProps={{
                color: '#009900',
                progressTintColor: '#009900',
              }}
              source={{ uri: answerFile, cache: true }}
              style={styles.pdf}
            />
            <TouchableOpacity
              style={styles.buttomTop}
              onPress={() => this.props._onTop()}>
              <IconAntDesign name={'arrowup'} size={18} color={'#FFF'} />
              <Text style={{ color: '#FAFAFA' }}>TOP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

class ElementItem extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    let { title, img, number, type } = this.props;
    number = Common.roundNumberOne(number) || number;
    return (
      <View style={styles.reportItem}>
        <Image source={img} style={styles.iconReport} resizeMode="contain" />
        <View style={styles.userStats}>
          <View style={styles.wrReport}>
            <Text style={styles.textNumber}>{number || 0}</Text>
            <Text style={styles.descReport}>{type}</Text>
          </View>
          <Text style={styles.textNumber}>{title}</Text>
        </View>
      </View>
    );
  }
}

class SchoolResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      report: {},
      isLoading: true,
      duration: 0,
    };
  }

  toTime(num) {
    num = Math.abs(num);
    if (!num) {
      return 0 + ' giây';
    }
    if (num < 60) {
      return num + ' giây';
    } else if (num < 3600) {
      const minute = Math.floor(num / 60);
      const second = num % 60;
      return second ? minute + ' phút ' + second + ' giây' : minute + ' phút';
    } else if (num < 86400) {
      const hour = Math.floor(num / 60 / 60);
      const minute = Math.floor((num / 60) % 60);
      return minute ? hour + ' giờ ' + minute + ' phút' : hour + ' giờ';
    } else {
      const date = Math.floor(num / 86400);
      const hour = Math.floor((num % 86400) / 60);
      return hour ? date + ' ngày ' + hour + ' giờ' : date + ' ngày';
    }
  }
  render() {
    const { isLoading = false, duration = 0 } = this.state;
    const { report } = this.props;
    const speed = report ? Math.ceil(report?.speed * 60) : 0;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView vertical={20} style={{ padding: 10, flex: 1, }}>
          <ElementItem
            title={'Điểm số'}
            img={AppIcon.score_9}
            number={roundNumberOne(report.totalScore)}
            type={'Điểm'}
          />
          <ElementItem
            title={'Tổng số câu'}
            img={AppIcon.totalQuestion}
            number={report?.totalQuestion}
            type={'Câu'}
          />
          <ElementItem
            title={'Số câu đúng'}
            img={AppIcon.r_correct}
            number={report?.totalCorrect}
            type={'Câu'}
          />
          <ElementItem
            title={'Số câu sai và bỏ qua'}
            img={AppIcon.r_false}
            number={report?.totalQuestion - report?.totalCorrect}
            type={'Câu'}
          />
          <ElementItem
            title={'Chính xác'}
            img={AppIcon.r_accuracy}
            number={report?.accuracy}
            type={'%'}
          />
          <ElementItem
            title={'Tốc độ'}
            img={AppIcon.r_speed}
            number={speed}
            type={'Câu/ phút'}
          />
          <ElementItem
            title={
              report?.assignmentType === 0
                ? 'Thời gian luyện tập'
                : 'Thời gian kiểm tra'
            }
            img={AppIcon.r_time}
            number={this.toTime(report?.duration)}
          />
        </ScrollView>
      </View>
    );
  }
}

export default SchoolResultPDF;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  containerHeader: {
    backgroundColor: '#2D9CDB',
  },
  wrapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D9CDB'
  },
  wrapProgress: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    flexDirection: 'row',
    marginTop: 20,
    width: '90%',
  },
  txtProgress: {
    color: '#90EA59',
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  txtTotalQuestion: {
    fontFamily: 'Nunito-Bold',
    color: '#FFF',
    fontSize: 12,
  },
  txtTotalQuestionLeft: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    textAlign: 'left',
    marginHorizontal: 20,
  },
  txtTabActive: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
  },
  txtTab: {
    color: '#f0f0f0',
    fontFamily: 'Nunito-Regular',
  },
  wrapTab: {
    flexDirection: 'row',
    width: width,
  },
  btnTab: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewActive: {
    width: 80,
    height: 7,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttomTop: {
    backgroundColor: '#0091EA',
    marginTop: 20,
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    right: 15,
    bottom: 15,
  },
  txtH1: {
    fontFamily: 'Nunito',
    color: '#828282'

  },
  containerPdf: {
    flex: 1,
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  reportItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: '#f8f8f8'
  },
  borderBottom: {
    height: 1,
    backgroundColor: '#e1e1e1',
  },
  textNumber: {
    fontSize: 14,
    color: '#383838',
    fontFamily: 'Nunito-Bold',
  },
  wrReport: {
    flexDirection: 'row',
  },
  descReport: {
    marginHorizontal: 5,
    alignSelf: 'center',
    fontFamily: 'Nunito-Bold',
  },
  iconReport: {
    width: 30,
    height: 30,
    marginHorizontal: 25,
  },
  userStats: {
    flex: 1,
  },
});
