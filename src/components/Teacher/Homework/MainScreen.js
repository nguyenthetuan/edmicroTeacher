import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import LevelCompletion from '../../../containers/teacher/homework/LevelCompletion';
import RightWrongRatio from '../../../containers/teacher/homework/RightWrongRatio';
import StudentDetail from '../../../containers/teacher/homework/StudentDetail';
import dataHelper from '../../../utils/dataHelper';
import apiHomework from '../../../services/apiHomeworkTeacher';
import Toast from 'react-native-easy-toast';
import RippleButton from '../../common-new/RippleButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import AppIcon from '../../../utils/AppIcon';
import ModalFillter from './ModalFillter';
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
    RightWrongRatio: {
      screen: (props) => <RightWrongRatio {...props} />,
      navigationOptions: {
        title: 'Tỉ lệ Đ/S',
        tabBarLabel: ({ focused }) => {
          return !focused ? (
            <Text numberOfLines={1} style={styles.labelTab}>
              Tỉ lệ Đ/S
            </Text>
          ) : (
              <Text numberOfLines={1} style={styles.labelTabActive}>
                Tỉ lệ Đ/S
              </Text>
            );
        },
      },
    },
    StudentDetail: {
      screen: (props) => <StudentDetail {...props} />,
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
        width: 80,
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
  const modalFillter = useRef();
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

  const onPressItemSubject = async (index) => {
    indexSelected.subject = index;

    const { token } = await dataHelper.getToken();
    if (token) {
      let listHomework = [];
      let listClass = [];

      const resHomework = await apiHomework.getHomework({
        token,
        body: {
          gradeCode: indexSelected.grade
            ? [data.grade[indexSelected.grade].gradeId]
            : [],
          subjectCode: [data.subject[index].code],
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

  const onPressItemHomework = async (index) => {
    indexSelected.homework = index;

    let listClass = [];

    const { token } = await dataHelper.getToken();
    if (token) {
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
        classId: data.homework[index].assignmentId,
        status: status.ToDo,
        indexPage: 0,
      });
      if (resClass && resClass.data) {
        indexSelected.class = 0;
        listClass = resClass.data;
      }

      setData({
        ...data,
        class: listClass,
      });
    }
  };

  const onPressItemClass = async (index) => {
    indexSelected.class = index;
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

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const goBack = async () => {
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

      setData({
        grade: listGrade,
        subject: listSubject,
        homework: listHomework,
        class: listClass,
      });
    }
  };

  const onClickFillter = () => {
    modalFillter.current.changeStateModale();
  }

  const isShow = !!props.navigation.state.params &&
    props.navigation.state.params.hideBackButtom;

  let timeEnd = props.data?.data.timeEnd;
  timeEnd = convertTimeHMDMY(timeEnd);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <HeaderNavigation
        title={'Thống kê bài tập'}
        navigation={props.navigation}
        onRightAction={onClickFillter}
        actionIcon={!isShow ? AppIcon.icons_filter : null}
      />
      <View style={styles.header}>
        {/* <View style={styles.headerNavigation}> */}
        {/* {
            isShow ? (
              <RippleButton
                onPress={() => {
                  // goBack();
                  props.navigation.goBack();
                }}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  color="#000"
                  size={23}
                />
              </RippleButton>
            )
              :
              <View style={{ width: 30 }} />
          } */}

        {/* <Text style={styles.txtHeaderNavigation}>Thống kê bài tập</Text> */}
        {/* {
            !isShow ?
              <RippleButton onPress={onClickFillter}>
                <Image source={AppIcon.icons_filter} resizeMode={'contain'} />
              </RippleButton>
              : null
          } */}
        {/* </View> */}
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
        screenProps={{ onRefresh: handleStatistic, data: props.data, isLoading: isLoading }}
      />
      <Toast ref={toast} position={'top'} />
      <ModalFillter
        ref={modalFillter}
        dataGade={data.grade || []}
        dataSubject={data.subject || []}
        dataHomeWork={data.homework}
        dataClass={data.class || []}
        indexSelected={indexSelected}
        onPressItemGrade={(index) => onPressItemGrade(index)}
        onPressItemSubject={(index) => onPressItemSubject(index)}
        onPressItemHomework={(index) => onPressItemHomework(index)}
        onPressItemClass={(index) => onPressItemClass(index)}
        handleStatistic={handleStatistic}
      />
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
  headerNavigation: {
    flexDirection: 'row',
    paddingVertical: 22,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtHeaderNavigation: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#000',
    flex: 1,
    textAlign: 'center',
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
  btnViewStatistic: {
    height: 20,
    backgroundColor: '#fff',
    width: 90,
    borderRadius: 2,
    marginTop: 20,
    alignSelf: 'flex-end',
    marginEnd: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  txtStatistic: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#2D9CDB',
    borderRadius: 1,
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
