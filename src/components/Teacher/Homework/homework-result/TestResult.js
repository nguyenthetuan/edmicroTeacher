import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import AppIcon from '../../../../utils/AppIcon';
import icon_time_exa from '../../../../asserts/icon/icon_time_exa.png';
import { formatSecond } from '../../../../utils/Common';
import MyActivityIndicator from '../../../libs/MyActivityIndicator';
const { width } = Dimensions.get('window');
import { RFFonsize } from '../../../../utils/Fonts';
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
    this.getData();
  }

  getData = () => {
    try {
      const { responseJson } = this.props.screenProps.navigation.state.params;
      this.setState({
        report: responseJson.data,
        isLoading: false
      });
      const list = [];
      (responseJson.data.data).forEach(element => {
        if (element.dataMaterial !== null) {
          (element.dataMaterial.data).forEach(model => {
            list.push(model);
          });
        } else {
          list.push(element.dataStandard);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { report } = this.state;
    const speed = Math.ceil(report.speed * 60);
    console.log('report', report);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <MyActivityIndicator isLoading={this.state.isLoading} bgColor={'#fff'} />
        <View vertical={20} style={{ padding: 10 }}>

          <View style={styles.totalCore}>
            <Text style={styles.firstCore}>Tổng điểm</Text>
            <Text style={styles.txtCore}>{report.totalScore}</Text>
            <Text style={styles.endCore}>Điểm</Text>
          </View>
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
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textHeader: {
    color: '#383838',
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
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
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  totalCore: {
    paddingHorizontal: 100,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  txtCore: {
    fontFamily: 'Nunito-Bold',
    alignSelf: 'center',
    fontSize: RFFonsize(18),
    lineHeight: RFFonsize(22),
    color: '#FF6213',
    paddingHorizontal: 10
  },
  firstCore: {
    fontFamily: 'Nunito-Bold',
    alignSelf: 'center',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(28),
    color: '#383838'
  },
  endCore: {
    fontFamily: 'Nunito',
    alignSelf: 'center',
    fontSize: RFFonsize(10),
    lineHeight: RFFonsize(14),
    color: '#383838'
  }
});
