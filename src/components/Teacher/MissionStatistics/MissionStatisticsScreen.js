import React, { useEffect, useState, useRef } from 'react';
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
import HeaderNavigation from '../../common-new/HeaderNavigation';

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
        marginLeft: width < 350 ? 10 : 30,
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

export default function StatisticsPoints(props) {
  const toast = useRef();
  const [data, setData] = useState({
    grade: [],
    subject: [],
    homework: [],
    class: [],
  });
  const [isLoading, setIsLoading] = useState(true)

  const onPressItemGrade = async (index) => {
    indexSelected.grade = index;

    const { token } = await dataHelper.getToken();
    if (token) {
      let listHomework = [];
      let listClass = [];

      const resHomework = await apiHomework.getHomework({
        token,
        body: {
          gradeCode: [data.grade[index].gradeId],
          subjectCode:
            indexSelected.subject > -1
              ? [data.subject[indexSelected.subject].code]
              : [],
        },
      });
      if (resHomework && resHomework.data) {
        indexSelected.homework = 0;
        listHomework = resHomework.data;
      }

      if (listHomework.length) {
        const status = {
          ToDo: 0,
          Doing: 1,
          Submit: 2,
          Done: 3,
          NotOpen: 4,
          Paused: 5,
          TimeOut: 6,
          TimeOutDontDo: 7,
        };
        const resClass = await apiHomework.getClass({
          token,
          classId: listHomework[0].assignmentId,
          status: status.ToDo,
          indexPage: 0,
        });
        if (resClass && resClass.data) {
          indexSelected.class = 0;
          listClass = resClass.data;
        }
      }

      setData({
        ...data,
        homework: listHomework,
        class: listClass,
      });
    }
  };

  const handleStatistic = async () => {
    if (data.class.length > 0) {
      const { token } = await dataHelper.getToken();
      if (token) {
        props.fetchHomework({
          token,
          assignId: data.class[indexSelected.class].assignId,
        });
      }
    } else {
      toast.current.show('Không tìm thấy lớp nào!');
    }
  };

  const fetchData = async () => {
    const { token } = await dataHelper.getToken();
    if (token) {
      let listGrade = [];
      let listSubject = [];
      let listHomework = [];
      let listClass = [];

      const resGrade = await apiHomework.getGrade({ token });
      if (resGrade) {
        listGrade = resGrade;
      }
      const resSubject = await apiHomework.getSubject({ token });
      if (resSubject) {
        listSubject = resSubject;
      }

      const resHomework = await apiHomework.getHomework({ token, body: {} });
      if (resHomework && resHomework.data) {
        indexSelected.homework = 0;
        listHomework = resHomework.data;
      }
      if (listHomework.length) {
        const status = {
          ToDo: 0,
          Doing: 1,
          Submit: 2,
          Done: 3,
          NotOpen: 4,
          Paused: 5,
          TimeOut: 6,
          TimeOutDontDo: 7,
        };

        const resClass = await apiHomework.getClass({
          token,
          classId: listHomework[0].assignmentId,
          status: status.ToDo,
          indexPage: 0,
        });
        if (resClass && resClass.data) {
          indexSelected.class = 0;
          listClass = resClass.data;
        }
      }

      const params = props.navigation.state.params;
      if (params !== undefined && params.assignId) {
        props.fetchReportAction({
          token,
          assignId: props.navigation.state.params.assignId,
        }, 2000);
      } else {
        if (listClass.length) {
          props.fetchHomework({
            token,
            assignId: listClass[0].assignId,
          });
        } else {
          props.fetchHomework({
            token,
            assignId: '',
          });
        }
      }

      setData({
        grade: listGrade,
        subject: listSubject,
        homework: listHomework,
        class: listClass,
      });
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    fetchData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  let timeEnd = props.data?.data.timeEnd;
  timeEnd = convertTimeHMDMY(timeEnd);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <HeaderNavigation
        title={'Thống kê bài tập'}
        navigation={props.navigation}
      />
      <View style={styles.header}>
        {
          !isLoading ?
            _.isEmpty(props.data) ?
              null
              : <View style={styles.wrapInfo}>
                <Text style={styles.txtAssignment}>{props.data?.data.name || ''}</Text>
                <Text style={styles.txtTitle}>{props.data?.data.className || ''}</Text>
                <Text style={styles.txtTime}>Kết thúc lúc {timeEnd}</Text>
              </View>
            :
            <View style={styles.wrapInfo}>
              <ActivityIndicator size={'small'} color={'#2D9CDB'} />
            </View>
        }
      </View>
      <Tab
        screenProps={{
          onRefresh: handleStatistic,
          data: props.data,
          isLoading: isLoading,
          refreshData: refreshData,
        }}
      />
      <Toast ref={toast} position={'top'} />
    </SafeAreaView>
  );
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
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#828282',
  },
  labelTabActive: {
    fontSize: 11,
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
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Nunito-Bold',
    marginBottom: 5,
  },
  txtTitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
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
