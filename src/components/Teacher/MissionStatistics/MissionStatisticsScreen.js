import React, { useEffect, useState, useRef, Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import LevelCompletion from './LevelCompletion';
import StudentDetail from './StudentDetail';
import dataHelper from '../../../utils/dataHelper';
import apiHomework from '../../../services/apiHomeworkTeacher';
import Toast from 'react-native-easy-toast';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import { convertTimeHMDMY } from '../../../utils/Utils';
import _ from 'lodash';
import moment from 'moment';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import Api from '../../../services/apiMission';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');

const initTab = createMaterialTopTabNavigator(
  {
    LevelComplete: {
      screen: (props) => <LevelCompletion {...props} />,
      navigationOptions: {
        title: 'Độ hoàn thành',
        tabBarLabel: ({ focused }) => {
          return !focused ? (
            <Text numberOfLines={1} style={styles.labelTab}>
              Độ hoàn thành
            </Text>
          ) : (
              <Text numberOfLines={1} style={styles.labelTabActive}>
                Độ hoàn thành
              </Text>
            );
        },
      },
    },
    StudentDetail: {
      screen: (props) => <StudentDetail
        {...props}
      />,
      navigationOptions: {
        title: 'Học sinh',
        tabBarLabel: ({ focused }) => {
          return !focused ? (
            <Text numberOfLines={1} style={styles.labelTab}>
              Học sinh
            </Text>
          ) : (
              <Text numberOfLines={1} style={styles.labelTabActive}>
                Học sinh
              </Text>
            );
        },
      },
    },
  },
  {
    backBehavior: false,
    swipeEnabled: false,
    animationEnabled: false,
    lazy: Platform.OS == 'ios',
    tabBarPosition: 'top',
    tabBarOptions: {
      scrollEnabled: false,
      upperCaseLabel: false,
      style: {
        backgroundColor: '#FFF',
        borderBottomWidth: 2,
        borderBottomColor: '#2D9CDB',
        height: 40,
        elevation: 0,
        shadowOffset: { height: 0, width: 0 },
        justifyContent: 'space-between',
      },
      indicatorStyle: {
        backgroundColor: '#2D9CDB',
        height: 5,
        width: Platform.isPad ? 200 : 80,
        borderBottomWidth: 1,
        borderBottomColor: '#2D9CDB',
        borderBottomWidth: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        // marginLeft: width < 350 ? 20 : 50,
        marginLeft: Platform.isPad ? (width / 2 - 200) / 2 : (width / 2 - 80) / 2,
      },
    },
  },
);

const Tab = createAppContainer(initTab);

const indexSelected = {
  grade: -1,
  subject: -1,
  homework: 0,
  class: 0,
};

export default class StatisticsPoints extends Component {

  state = {
    data: [],
    missionDetail: {}
  }

  componentDidMount() {
    this.fetchData();
  }

  handleStatistic = async () => {
    if (data.class.length > 0) {
      const { token } = await dataHelper.getToken();
      if (token) {
        this.props.fetchHomework({
          token,
          assignId: data.class[indexSelected.class].assignId,
        });
      }
    } else {
      // toast.current.show('Không tìm thấy lớp nào!');
    }
  };

  fetchData = async () => {
    const { token } = await dataHelper.getToken();
    const { _id } = this.props.navigation.state.params;
    const response = await Api.getMissionResult({ token, _id });
    console.log("StatisticsPoints -> response", response);
    const { listDetailStudent, assignDetail, missionDetail } = response;
    this.setState({ data: listDetailStudent, assignDetail: assignDetail, missionDetail });
  };

  refreshData = async () => {
    setIsLoading(true);
    fetchData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  render() {
    const { data, assignDetail, missionDetail } = this.state;
    let timeEnd = (assignDetail?.endTime) * 1000;
    // timeEnd = convertTimeHMDMY(timeEnd);
    timeEnd = moment((assignDetail?.endTime) * 1000).format('DD-MM-YYYY, HH:MM');
    console.log(assignDetail);
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <HeaderNavigation
          title={'Thống kê nhiệm vụ'}
          navigation={this.props.navigation}
        />
        <View style={styles.header}>
          {
            // !true ?
            _.isEmpty(assignDetail) ?
              null
              : <View style={styles.wrapInfo}>
                <Text style={styles.txtAssignment}>{missionDetail?.title || ''}</Text>
                <Text style={styles.txtTitle}>{assignDetail?.className || ''}</Text>
                <Text style={styles.txtTime}>Kết thúc lúc {timeEnd}</Text>
              </View>
            // :
            // <View style={styles.wrapInfo}>
            //   <ActivityIndicator size={'small'} color={'#2D9CDB'} />
            // </View>
          }
        </View>
        <Tab
          screenProps={{
            onRefresh: this.handleStatistic,
            data,
            isLoading: false,
            refreshData: this.refreshData,
          }}
        />
        <Toast ref={'toast'} position={'top'} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: HEIGHT_TOPBAR - 10,
    zIndex: 99,
  },
  labelTab: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
    color: '#828282',
  },
  labelTabActive: {
    fontSize: RFFonsize(11),
    fontFamily: 'Nunito-Bold',
    color: '#000',
  },
  wrapInfo: {
    marginHorizontal: 20,
    marginBottom: 10,
    minHeight: 50,
    justifyContent: 'center'
  },
  txtAssignment: {
    color: '#2D9CDB',
    fontSize: RFFonsize(18),
    marginLeft: 10,
    fontFamily: 'Nunito-Bold',
    marginBottom: 5,
  },
  txtTitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(16),
    color: '#2D9CDB',
    marginLeft: 10,
    marginBottom: 5,
  },
  txtTime: {
    fontFamily: 'Nunito-Regular',
    color: '#828282',
    marginLeft: 10,
    marginBottom: 5,
  },
});
