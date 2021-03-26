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
import CopyFromSubjectExists from '../components/Teacher/Papers/CopyFromSubjectExists';
import ListQuestionCopy from '../components/Teacher/Papers/ListQuestionCopy';
import ConfigQuestionCopy from '../components/Teacher/Papers/ConfigQuestionCopy';
import transition from '../components/anim/Transition';
import ChangInfo from '../components/account-detail/ChangeInfo';
import Class from '../components/Teacher/Class/class';
import ChangePassWord from '../components/account-detail/ChangePassword';
import MockExample from '../components/Teacher/Class/MockExample';
import MockExamDrawer from '../components/Teacher/Class/MockExamDrawer';
import MockResult from '../components/Teacher/Class/exam-result/TestResultTab';
import HomeWorkResult from '../components/Teacher/Homework/homework-result/TestResultTab';
import UpdatePlan from '../components/Teacher/Class/updatePlan';
import V_UpdatePhone from '../containers/auth/UpdatePhoneContainer';
import TermsOfUse from '../components/Terms/TermsOfUse';
import MissionStepByStep from '../containers/teacher/Mission/MissionSBSContainer';
import MissionDetailScreen from '../containers/teacher/Mission/MissionDetailContainer';
import MissionPlayWebView from '../components/Teacher/MissionDetail/MissonPlayWebView';
import MissonTestPlayWebView from '../components/Teacher/MissionDetail/MissonTestPlayWebView';
import MissionStatisticsScreen from '../components/Teacher/MissionStatistics/MissionStatisticsScreen';
import FullViewPDFAssessment from '../components/Teacher/Papers/FullViewPDF';
import ExchangeGiftScreen from '../components/gifts/ExchangeGiftScreen';
import SaleGift from '../components/gifts/SaleGift';
import GiftDetail from '../components/gifts/GiftDetail';
import OfferGiftDetail from '../components/gifts/OfferGiftDetail';
import StatisticScreen from '../components/statistics/StatisticScreen';
import EditConfig from '../components/Teacher/Papers/EditConfig';
import SchoolResultPDF from '../components/Teacher/Homework/homework-result/SchoolResultPDF';
import SearchScreen from '../components/common-new/SearchScreen';
import { Platform } from 'react-native';
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
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ExcerciseDetail: {
    screen: ExcerciseDetail,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  StatisticsPoints: {
    screen: StatisticsPoints,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ModlaLevelComplete: {
    screen: ModlaLevelComplete,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  QuestionLibrary: {
    screen: QuestionLibrary,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ListQuestionCopy: {
    screen: ListQuestionCopy,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ConfigQuestionCopy: {
    screen: ConfigQuestionCopy,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ConfigQuestion: {
    screen: ConfigQuestion,
    navigationOptions: { header: null, gesturesEnabled: true },
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
  FullViewPDFAssessment: {
    screen: FullViewPDFAssessment,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  CopyFromSubjectExists: {
    screen: CopyFromSubjectExists,
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
  },
  MissionStepByStep: {
    screen: MissionStepByStep,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  MissionDetail: {
    screen: MissionDetailScreen,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  MissionPlayWebView: {
    screen: MissionPlayWebView,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  MissonTestPlayWebView: {
    screen: MissonTestPlayWebView,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  MissionStatisticsScreen: {
    screen: MissionStatisticsScreen,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  ExchangeGiftScreen: {
    screen: ExchangeGiftScreen,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  SaleGift: {
    screen: SaleGift,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  GiftDetail: {
    screen: GiftDetail,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  OfferGiftDetail: {
    screen: OfferGiftDetail,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  StatisticScreen: {
    screen: StatisticScreen,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  EditConfig: {
    screen: EditConfig,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  // WebViews:{
  //   screen: AppStoreScreen,
  //   navigationOptions: { header: null, gesturesEnabled: true },
  // },
  HomeWorkResult: {
    screen: HomeWorkResult,
    navigationOptions: { header: null, gesturesEnabled: true },
  },
  SchoolResultPDF: {
    screen: SchoolResultPDF,
    navigationOptions: { header: null, gesturesEnabled: true },
  }
}, Platform.OS == 'android' && transition);

export default TeacherStack;
