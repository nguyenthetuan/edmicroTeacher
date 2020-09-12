import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import ClassDetail from '../components/Teacher/Class/classDetail';
import ExcerciseDetail from '../components/Teacher/Class/excerciseDetail';
import TabMainTeacher from './TabMainTeacher';
import StatisticsPoints from '../components/Teacher/Evaluate/StatisticsPoints';
import ModlaLevelComplete from '../components/Teacher/Class/modalLevelComplete';
import QuestionLibrary from '../components/Teacher/Papers/questionLibrary';
import ConfigQuestion from '../components/Teacher/Papers/configQuestion';
import Assignment from '../components/Teacher/Papers/Assignment';
import MarkingView from '../components/Teacher/Papers/MarkingView';
import Homework from '../containers/teacher/homework/MainScreen';
import MainHomeWork from '../containers/teacher/report/MainScreen';
import UploadPDF from '../components/Teacher/Papers/UploadPDF';
import transition from '../components/anim/Transition';
import ChangInfo from '../components/account-detail/ChangeInfo';
import Class from '../components/Teacher/Class/class';
import ChangePassWord from '../components/account-detail/ChangePassword';
import MockExample from '../components/Teacher/Class/MockExample';
import MockExamDrawer from '../components/Teacher/Class/MockExamDrawer';
import MockResult from '../components/Teacher/Class/exam-result/TestResultTab';
import UpdatePlan from '../components/Teacher/Class/updatePlan';
import V_UpdatePhone from '../components/auth/UpdatePhoneScreen';
import TermsOfUse from '../components/Terms/TermsOfUse';

const TeacherStack = createStackNavigator({
  TabMainTeacher: {
    screen: TabMainTeacher,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  Class: {
    screen: Class,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ClassDetail: {
    screen: ClassDetail,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  ExcerciseDetail: {
    screen: ExcerciseDetail,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  StatisticsPoints: {
    screen: StatisticsPoints,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  ModlaLevelComplete: {
    screen: ModlaLevelComplete,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  QuestionLibrary: {
    screen: QuestionLibrary,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  ConfigQuestion: {
    screen: ConfigQuestion,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  Assignment: {
    screen: Assignment,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  MarkingView: {
    screen: MarkingView,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  Report: {
    screen: Homework,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  MainHomeWork: {
    screen: MainHomeWork,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  UploadPDF: {
    screen: UploadPDF,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ChangInfo: {
    screen: ChangInfo,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ChangePassword: {
    screen: ChangePassWord,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  MockExample: {
    screen: MockExample,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  MockExamDrawer: {
    screen: MockExamDrawer,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  MockResult: {
    screen: MockResult,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  UpdatePlan: {
    screen: UpdatePlan,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  V_UpdatePhone: {
    screen: V_UpdatePhone,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  TermsOfUse: {
    screen: TermsOfUse,
    navigationOptions: { header: null, gesturesEnabled: true },
  }
});

export default TeacherStack;
