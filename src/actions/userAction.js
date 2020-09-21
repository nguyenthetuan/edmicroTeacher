import * as Types from '../constants/type';

export const fetchUserInfomationAction = (payload) => ({ type: Types.FETCH_USER_INFOMTAION_ACTION, payload });

export const fetchUserInfomationSuccessAction = (data) => ({ type: Types.FETCH_USER_INFOMTAION_SUCCESS_ACTION, data });

export const fetchUserInfomationFaildAction = (error) => ({ type: Types.FETCH_USER_INFOMTAION_FAILD_ACTION, error });

export const setProfileUserAction = (payload) => ({ type: Types.SET_PROFILE_USER_ACTION, payload });

export const updateUserProfileAction = (payload) => ({ type: Types.UPDATE_USER_PROFILE_ACTION, payload });

export const updateUserProfileSuccessAction = (data) => ({ type: Types.UPDATE_USER_PROFILE_SUCCESS_ACTION, data });

export const updateUserProfileFaildAction = (error) => ({ type: Types.UPDATE_USER_PROFILE_FAILD_ACTION, error });

export const changePasswordAction = (payload) => ({ type: Types.CHANGE_PASSWORD_ACTION, payload });

export const changePasswordSuccessAction = (data) => ({ type: Types.CHANGE_PASSWORD_SUCCESS_ACTION, data });

export const changePasswordFaildAction = (error) => ({ type: Types.CHANGE_PASSWORD_FAILD_ACTION, error });
