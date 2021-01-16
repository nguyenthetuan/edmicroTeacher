import React from 'react';
import { View } from 'react-native';
import { Image, Text, Platform, StyleSheet, Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import Class from '../components/Teacher/Class/class';
import Evaluate from '../components/Teacher/Evaluate/MainScreen';
import Homework from '../containers/teacher/homework/MainScreen';
import Papers from '../components/Teacher/Papers/paper';
import AppIcon from '../utils/AppIcon';
import MenuTabTeacher from '../components/menu/MenuTabTeacher';
import classIcon from '../asserts/icon/icon_class_unactive.png';
import classIconActive from '../asserts/icon/icon_class_active.png';
import FreshchatComponent from '../utils/FreshchatComponent';
import MissionScreen from '../containers/teacher/Mission/MissionContainer';
import { RFFonsize } from '../utils/Fonts';
const { width, height } = Dimensions.get('window');

const TabMainTeacher = createBottomTabNavigator(
  {
    Self: {
      screen: Class,
      navigationOptions: {
        title: 'Lớp học',
        tabBarIcon: ({ tintColor, focused }) => {
          return !focused ? (
            <Image
              color={tintColor}
              source={classIcon}
              resizeMode={'contain'}
            />
          ) : (
              <Image
                color={tintColor}
                source={classIconActive}
                resizeMode={'contain'}
              />
            );
        },
        tabBarLabel: Platform.isPad
          ? 'Lớp học'
          : ({ focused }) => {
            return !focused ? (
              <Text style={styles.txtLabel}>Lớp học</Text>
            ) : (
                <Text style={styles.txtLabelActive}>Lớp học</Text>
              );
          },
      },
    },
    TestKit: {
      screen: Papers,
      navigationOptions: {
        title: 'Bộ đề',
        tabBarIcon: ({ tintColor, focused }) => {
          return !focused ? (
            <Image
              color={tintColor}
              source={AppIcon.kiemtra}
              resizeMode={'contain'}
            />
          ) : (
              <Image
                color={tintColor}
                source={AppIcon.kiemtraActive}
                resizeMode={'contain'}
              />
            );
        },
        tabBarLabel: Platform.isPad
          ? 'Bộ đề'
          : ({ focused }) => {
            return !focused ? (
              <Text style={styles.txtLabel}>Bộ đề</Text>
            ) : (
                <Text style={styles.txtLabelActive}>Bộ đề</Text>
              );
          },
      },
    },
    Mission: {
      screen: MissionScreen,
      navigationOptions: {
        title: 'Nhiệm vụ',
        tabBarIcon: ({ tintColor, focused }) => {
          return !focused ? (
            <Image
              color={tintColor}
              source={AppIcon.task_inactive}
              resizeMode={'contain'}
            />
          ) : (
              <Image
                color={tintColor}
                source={AppIcon.task_active}
                resizeMode={'contain'}
              />
            );
        },
        tabBarLabel: Platform.isPad
          ? 'Nhiệm vụ'
          : ({ focused }) => {
            return !focused ? (
              <Text style={styles.txtLabel}>Nhiệm vụ</Text>
            ) : (
                <Text style={styles.txtLabelActive}>Nhiệm vụ</Text>
              );
          },
      },
    },
    Evaluate: {
      screen: Evaluate,
      navigationOptions: {
        title: 'Đánh giá',
        tabBarIcon: ({ tintColor, focused }) => {
          return !focused ? (
            <Image
              color={tintColor}
              source={AppIcon.iconEvaluate}
              resizeMode={'contain'}
            />
          ) : (
              <Image
                color={tintColor}
                source={AppIcon.iconEvaluateActive}
                resizeMode={'contain'}
              />
            );
        },
        tabBarLabel: Platform.isPad
          ? 'Đánh Giá'
          : ({ focused }) => {
            return !focused ? (
              <Text style={styles.txtLabel}>Đánh giá</Text>
            ) : (
                <Text style={styles.txtLabelActive}>Đánh giá</Text>
              );
          },
      },
    },
    HomeWork: {
      screen: Homework,
      navigationOptions: {
        title: 'Bài tập',
        drawerLockMode: 'locked-closed',
        tabBarIcon: ({ tintColor, focused }) => {
          return !focused ? (
            <Image
              color={tintColor}
              source={AppIcon.iconExercise}
              resizeMode={'contain'}
            />
          ) : (
              <Image color={tintColor} source={AppIcon.iconHomeWorkActive} />
            );
        },
        tabBarLabel: Platform.isPad
          ? 'Bài tập'
          : ({ focused }) => {
            return !focused ? (
              <Text style={styles.txtLabel}>Bài tập</Text>
            ) : (
                <Text style={styles.txtLabelActive}>Bài tập</Text>
              );
          },
      },
    },
  },
  {
    initialRouteName: 'Self',
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    backBehavior: 'initialRoute',
    allowFontScaling: true,
    lazy: false,
    tabBarOptions: {
      pressColor: 'blue',
      activeTintColor: '#000000',
      inactiveTintColor: '#9b9b9b',
      upperCaseLabel: false,
      showIcon: true,
      indicatorStyle: {
        height: 0,
        fontFamily: 'Nunito-Bold',
      },

      labelStyle: {
        fontSize: RFFonsize(13),
        fontFamily: 'Nunito-Regular',
      },
      style: {
        boderWodth: 1,
        borderTopWidth: 0,
        borderColor: '#9b9b9b',
        backgroundColor: '#fff',
        height: 60,
        shadowColor: 'rgba(47, 47, 46, 0.3)',
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        elevation: 3,
        // borderTopColor: 'rgba(88,72,255,0.3)',
      },
    },
    tabBarComponent: props => {
      return <TabBarComponent {...props} />;
    },
  },
);

const styles = StyleSheet.create({
  txtLabel: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    color: '#000',
    marginBottom: 3,
  },
  txtLabelActive: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 3,
  },
});

class TabBarComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <FreshchatComponent />
        <BottomTabBar {...this.props} />
      </View>
    );
  }
}

export default createDrawerNavigator(
  {
    Main: TabMainTeacher,
  },
  {
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    contentComponent: ({ navigation }) => (
      <MenuTabTeacher navigation={navigation} />
    ),
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
    hideStatusBar: false,
    drawerWidth: width * 0.7,
  },
);
