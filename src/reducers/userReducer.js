/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 11:53:22
 * @modify date 2018-04-17 11:53:22
 * @desc [description]
*/

import * as Types from '../constants/type';

const initState = {
  data: {},
  gradeId: '',
  displayName: '',
  email: '',
  birthday: '',
  districtId: '',
  phoneNumber: '',
  provinceId: '',
  schoolId: '',
  selectGradeId: '',
  CreateBySchool: '',
  AvatarSource: '',
  userName: '',
  listGrades: [],
  userInfomation: {},
  statisticChart: {},
  isLoadingStatichart: true,
  dataMatery: {},
  isLoadMateryLoading: true,
  dataChartSubjectId: [],
  dataChartContribution: [],
  flashCardTheory: [],
  flashCardVideo: []
};

export default function userReducer(state = initState, action) {
  switch (action.type) {
    case Types.FETCH_USER_INFOMTAION_ACTION:
      return {
        ...state
      }
    case Types.FETCH_USER_INFOMTAION_SUCCESS_ACTION:
      return {
        ...state,
        userInfomation: action.data
      }
    case Types.FETCH_USER_INFOMTAION_FAILD_ACTION:
      return {
        ...state,
        userInfomation: {}
      }
    case Types.SET_PROFILE_USER_ACTION:
      return {
        ...state,
        ...action.payload
      };
    case Types.FETCH_LIST_GRADE_SUCCESS_ACTION:
      return {
        ...state,
        listGrades: action.data.grades
      };
    case Types.FETCH_LIST_SUBJECT_FAILD_ACTION:
      return {
        ...state,
        listGrades: []
      };
    case Types.SET_GRADE_ID_ACTION:
      return {
        ...state,
        selectGradeId: action.payload.gradeId
      };
    case Types.FETCH_STATISTIC_CHART_ACTION:
      return {
        ...state,
        isLoadingStatichart: true
      }
    case Types.FETCH_STATISTIC_CHART_SUCCESS_ACTION:
      return {
        ...state,
        statisticChart: action.data,
        isLoadingStatichart: false,
      }
    case Types.FETCH_STATISTIC_CHART_FAILD_ACTION:
      return {
        ...state,
        statisticChart: [],
        isLoadingStatichart: false,
      }
    case Types.FETCH_MATERY_USER_START_ACTION:
      return {
        ...state,
        isLoadMateryLoading: true,
        dataMatery: {}
      }
    case Types.FETCH_MATERY_USER_SUCCESS_ACTION:
      return {
        ...state,
        dataMatery: action.data,
        isLoadMateryLoading: false,
      }
    case Types.FETCH_MATERY_USER_FAILD_ACTION:
      return {
        ...state,
        isLoadMateryLoading: false,
        dataMatery: {}
      }
    case Types.FETCH_CHART_BUY_SUBJECT_ID_SUCCESS_ACTION:
      return {
        ...state,
        dataChartSubjectId: action.data
      }
    case Types.FETCH_CHART_BUY_SUBJECT_ID_FAILD_ACTION:
      return {
        ...state,
        dataChartSubjectId: []
      }
    case Types.FETCH_CHART_CONTRIBUTION_SUCCESS_ACTION:
      return {
        ...state,
        dataChartContribution: action.data
      }
    case Types.FETCH_CHART_CONTRIBUTION_FAILD_ACTION:
      return {
        ...state,
        dataChartContribution: []
      }
    case Types.FETCH_FLASH_CARD_THEORY_SUCCESS_ACTION:
      return {
        ...state,
        flashCardTheory: action.data
      }
    case Types.FETCH_FLASH_CARD_THEORY_FAILD_ACTION:
      return {
        ...state,
        flashCardTheory: []
      }
    case Types.FETCH_FLASH_CARD_VIDEO_SUCCESS_ACTION:
      return {
        ...state,
        flashCardTheory: action.data
      }
    case Types.FETCH_FLASH_CARD_VIDEO_FAILD_ACTION:
      return {
        ...state,
        flashCardTheory: []
      }
    case Types.SAVE_AVATAR_ACTION:
      return {
        ...state,
        AvatarSource: action.payload
      }
    case Types.SAVE_USER_ACTION:
      return {
        ...state,
        userName: action.payload.userName,
      }
    default:
      return state;
  }
}
