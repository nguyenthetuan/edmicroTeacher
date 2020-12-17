import * as Types from '../constants/type';

const initState = {
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
  data: [],
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
        ...action.payload,
      };
    case Types.SAVE_AVATAR_ACTION:
      return {
        ...state,
        timeCached: action.payload.timeCached
      }
    default:
      return state;
  }
}
