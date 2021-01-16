import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

// import dataHelper from '../../../../utils/dataHelper';
import apiHelper from '../../../../services/apiExamHelper';
import dataHelper from '../../../../utils/dataHelper';
import AppIcon from '../../../../utils/AppIcon';
import icon_time_exa from '../../../../asserts/icon/icon_time_exa.png';
import Share from '../../../exam-detail/Test';
import { formatSecond } from '../../../../utils/Common';
import MyActivityIndicator from '../../../libs/MyActivityIndicator';
import Api from '../../../../services/apiClassTeacher'
import { RFFonsize } from '../../../../utils/Fonts';
// import RateApp from '../../../common/RateApp';
// import Mixpanel from 'react-native-mixpanel';
// import jwtDecode from 'jwt-decode';
// import global from '../../utils/Globals';

export default class TestResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      report: {
      },
      isLoading: true
    };
  }

  componentDidMount() {
    dataHelper.getToken().then(({ token }) => {
      this.getData(token)
    }
    ).catch(err =>
      console.log(err)
    );
  }

  getData = async (token) => {
    const { assignmentId } = this.props.screenProps;
    try {
      const { token } = await dataHelper.getToken();
      const responseJson = await Api.getMockResult({token,assignmentId})
      this.setState({
        report: responseJson.data,
        isLoading: false
      });
      Share.updateH(responseJson.data.data);
      const list = [];
      // try {
      //   if (responseJson.data.accuracy >= 80) {
      //     this.myTime = setTimeout(this.refs.RateApp._showRateApp, 3000);
      //   }
      // } catch (error) { }
      (responseJson.data.data).forEach(element => {
        if (element.dataMaterial !== null) {
          (element.dataMaterial.data).forEach(model => {
            list.push(model);
          });
        } else {
          list.push(element.dataStandard);
        }
      });
      // Share.updateH(list);
    } catch (error) {
        console.log(error);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.myTime);
  }

  render() {
    const { report } = this.state;
    const speed = Math.ceil(report.speed * 60);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <MyActivityIndicator isLoading={this.state.isLoading} bgColor={'#fff'} />
        <View vertical={20} style={{ padding: 10 }}>
          <View style={styles.reportItem}>
            <Image source={AppIcon.totalQuestion} style={styles.iconReport} />
            <View style={styles.userStats}>
              <View style={styles.wrReport}>
                <Text style={styles.textNumber}>{report.totalQuestion}</Text><Text style={styles.descReport}>Câu</Text>
              </View>
              <Text>Tổng số câu</Text>
            </View>
          </View>

          <View style={styles.reportItem}>
            <Image source={AppIcon.r_correct} style={styles.iconReport} />
            <View style={styles.userStats}>
              <View style={styles.wrReport}>
                <Text style={styles.textNumber}>{report.totalCorrect}</Text><Text style={styles.descReport}>Câu</Text>
              </View>
              <Text>Số câu đúng</Text>
            </View>
          </View>

          <View style={styles.reportItem}>
            <Image source={AppIcon.r_false} style={styles.iconReport} />
            <View style={styles.userStats}>
              <View style={styles.wrReport}>
                <Text style={styles.textNumber}>{report.totalIncorrect}</Text><Text style={styles.descReport}>Câu</Text>
              </View>
              <Text>Số câu sai</Text>
            </View>
          </View>
          <View style={styles.reportItem}>
            <Image source={AppIcon.r_accuracy} style={styles.iconReport} />
            <View style={styles.userStats}>
              <View style={styles.wrReport}>
                <Text style={styles.textNumber}>{report.accuracy}</Text><Text style={styles.descReport}>%</Text>
              </View>
              <Text>Chính xác</Text>
            </View>
          </View>

          <View style={styles.reportItem}>
            <Image source={AppIcon.r_speed} style={styles.iconReport} />
            <View style={styles.userStats}>
              <View style={styles.wrReport}>
                <Text style={styles.textNumber}>{speed}</Text><Text style={styles.descReport}>Câu/ phút</Text>
              </View>
              <Text>Tốc độ</Text>
            </View>
          </View>

          <View style={styles.reportItem}>
            <Image source={icon_time_exa} style={styles.iconReport} />
            <View style={styles.userStats}>
              <View style={styles.wrReport}>
                <Text style={styles.textNumber}>{formatSecond(report.duration)}</Text>
              </View>
              <Text>Thời gian Kiểm tra</Text>
            </View>
          </View>

          {/* <View style={styles.borderBottom}></View> */}
        </View>
        {/* <RateApp ref='RateApp' /> */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textHeader: {
    color: '#383838',
    fontSize: RFFonsize(16),
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  reportItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: '#f8f8f8'
  },
  borderBottom: {
    height: 1,
    backgroundColor: '#e1e1e1',
  },
  textNumber: {
    fontSize: RFFonsize(14),
    color: '#383838',
    fontWeight: 'bold',
  },
  wrReport: {
    flexDirection: 'row',
  },
  descReport: {
    marginHorizontal: 5,
    alignSelf: 'center',
  },
  iconReport: {
    width: 30,
    height: 30,
    marginHorizontal: 25,
  },
  userStats: {
    flex: 1,
  },
  textDes: {
    color: '#b0bec5',
  },
  textSpeed: {
    color: '#383838',
    fontSize: RFFonsize(16),
    alignSelf: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  }
});
