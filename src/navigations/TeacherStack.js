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
import MarkingCamera from '../components/Teacher/MarkingCamera/MarkingCamera';
import MarkingWebScreen from '../components/Teacher/MarkingWeb/MarkingWebScreen';
import Homework from '../containers/teacher/homework/MainScreen';
import MainHomeWork from '../containers/teacher/report/MainScreen';
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
import ImageResult from '../components/Teacher/Homework/homework-result/ImageResult';
import SearchScreen from '../components/common-new/SearchScreen';
import MarkCamera from '../components/Teacher/Papers/MarkCamera';
import TakePhotoCamera from '../components/Teacher/Papers/TakePhotoCamera';
import { Platform } from 'react-native';
import UploadPDFStepByStep from '../components/Teacher/Papers/UploadPDF/UploadPDFStepByStep';
import MissionDraScreen from '../components/Teacher/ScreenMenu/MissionDraScreen';
import HomeWorkDraScreen from '../components/Teacher/ScreenMenu/HomeWorkDraScreen';
import EvaluateDraScreen from '../components/Teacher/ScreenMenu/EvaluateDraScreen';
import HomeScreen from '../components/Teacher/Home/HomeScreen';
import StepFourPDF from '../components/Teacher/Papers/UploadPDF/StepFourPDF';
import LaboratoryScreen from '../components/Teacher/Laboratory/LaboratoryScreen';
import DetailLabora from '../components/Teacher/Laboratory/DetailLabora';
const LockNavigationOptions = {
  header: null,
  gesturesEnabled: false
}

const TeacherStack = createStackNavigator({
  TabMainTeacher: {
    screen: TabMainTeacher,
    navigationOptions: LockNavigationOptions,
  },
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: LockNavigationOptions,
  },
  Class: {
    screen: Class,
    navigationOptions: LockNavigationOptions,
  },
  ClassDetail: {
    screen: ClassDetail,
    navigationOptions: LockNavigationOptions,
  },
  ExcerciseDetail: {
    screen: ExcerciseDetail,
    navigationOptions: LockNavigationOptions,
  },
  StatisticsPoints: {
    screen: StatisticsPoints,
    navigationOptions: LockNavigationOptions,
  },
  ModlaLevelComplete: {
    screen: ModlaLevelComplete,
    navigationOptions: LockNavigationOptions,
  },
  QuestionLibrary: {
    screen: QuestionLibrary,
    navigationOptions: LockNavigationOptions,
  },
  ListQuestionCopy: {
    screen: ListQuestionCopy,
    navigationOptions: LockNavigationOptions,
  },
  ConfigQuestionCopy: {
    screen: ConfigQuestionCopy,
    navigationOptions: LockNavigationOptions,
  },
  ConfigQuestion: {
    screen: ConfigQuestion,
    navigationOptions: LockNavigationOptions,
  },
  Assignment: {
    screen: Assignment,
    navigationOptions: LockNavigationOptions,
  },
  MarkingView: {
    screen: MarkingView,
    navigationOptions: LockNavigationOptions,
  },
  MarkingCamera: {
    screen: MarkingCamera,
    navigationOptions: LockNavigationOptions,
  },
  TakePhotoCamera: {
    screen: TakePhotoCamera,
    navigationOptions: LockNavigationOptions,
  },
  MarkingWeb: {
    screen: MarkingWebScreen,
    navigationOptions: LockNavigationOptions,
  },
  Report: {
    screen: Homework,
    navigationOptions: LockNavigationOptions,
  },
  MainHomeWork: {
    screen: MainHomeWork,
    navigationOptions: LockNavigationOptions,
  },
  MarkCamera: {
    screen: MarkCamera,
    navigationOptions: LockNavigationOptions,
  },
  FullViewPDFAssessment: {
    screen: FullViewPDFAssessment,
    navigationOptions: LockNavigationOptions,
  },
  CopyFromSubjectExists: {
    screen: CopyFromSubjectExists,
    navigationOptions: LockNavigationOptions,
  },
  ChangInfo: {
    screen: ChangInfo,
    navigationOptions: LockNavigationOptions,
  },
  ChangePassword: {
    screen: ChangePassWord,
    navigationOptions: LockNavigationOptions,
  },
  MockExample: {
    screen: MockExample,
    navigationOptions: LockNavigationOptions,
  },
  MockExamDrawer: {
    screen: MockExamDrawer,
    navigationOptions: LockNavigationOptions,
  },
  MockResult: {
    screen: MockResult,
    navigationOptions: LockNavigationOptions,
  },
  UpdatePlan: {
    screen: UpdatePlan,
    navigationOptions: LockNavigationOptions,
  },
  V_UpdatePhone: {
    screen: V_UpdatePhone,
    navigationOptions: LockNavigationOptions,
  },
  TermsOfUse: {
    screen: TermsOfUse,
    navigationOptions: LockNavigationOptions,
  },
  MissionStepByStep: {
    screen: MissionStepByStep,
    navigationOptions: LockNavigationOptions,
  },
  MissionDetail: {
    screen: MissionDetailScreen,
    navigationOptions: LockNavigationOptions,
  },
  MissionPlayWebView: {
    screen: MissionPlayWebView,
    navigationOptions: LockNavigationOptions,
  },
  MissonTestPlayWebView: {
    screen: MissonTestPlayWebView,
    navigationOptions: LockNavigationOptions,
  },
  MissionStatisticsScreen: {
    screen: MissionStatisticsScreen,
    navigationOptions: LockNavigationOptions,
  },
  ExchangeGiftScreen: {
    screen: ExchangeGiftScreen,
    navigationOptions: LockNavigationOptions,
  },
  SaleGift: {
    screen: SaleGift,
    navigationOptions: LockNavigationOptions,
  },
  GiftDetail: {
    screen: GiftDetail,
    navigationOptions: LockNavigationOptions,
  },
  OfferGiftDetail: {
    screen: OfferGiftDetail,
    navigationOptions: LockNavigationOptions,
  },
  StatisticScreen: {
    screen: StatisticScreen,
    navigationOptions: LockNavigationOptions,
  },
  EditConfig: {
    screen: EditConfig,
    navigationOptions: LockNavigationOptions,
  },
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: LockNavigationOptions,
  },
  EvaluateDraScreen: {
    screen: EvaluateDraScreen,
    navigationOptions: LockNavigationOptions,
  },
  HomeWorkDraScreen: {
    screen: HomeWorkDraScreen,
    navigationOptions: LockNavigationOptions,
  },
  MissionDraScreen: {
    screen: MissionDraScreen,
    navigationOptions: LockNavigationOptions,
  },
  LaboratoryScreen: {
    screen: LaboratoryScreen,
    navigationOptions: LockNavigationOptions,
  },
  DetailLabora: {
    screen: DetailLabora,
    navigationOptions: LockNavigationOptions,
  },
  // WebViews:{
  //   screen: AppStoreScreen,
  //   navigationOptions: LockNavigationOptions,
  // },
  HomeWorkResult: {
    screen: HomeWorkResult,
    navigationOptions: LockNavigationOptions,
  },
  UploadPDFStepByStep: {
    screen: UploadPDFStepByStep,
    navigationOptions: LockNavigationOptions,
  },
  SchoolResultPDF: {
    screen: SchoolResultPDF,
    navigationOptions: LockNavigationOptions,
  },
  ImageResult: {
    screen: ImageResult,
    navigationOptions: LockNavigationOptions,
  },
  UploadPDFCompleted: {
    screen: StepFourPDF,
    navigationOptions: LockNavigationOptions,
  }
}, Platform.OS == 'android' && transition);

export default TeacherStack;
