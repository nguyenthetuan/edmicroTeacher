/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 02:29:00
 * @modify date 2018-04-17 02:29:00
 * @desc [description]
*/

import * as Types from '../constants/type';

export const fetchUserInfomationAction = (payload) => ({ type: Types.FETCH_USER_INFOMTAION_ACTION, payload });

export const fetchUserInfomationSuccessAction = (data) => ({ type: Types.FETCH_USER_INFOMTAION_SUCCESS_ACTION, data });

export const fetchUserInfomationFaildAction = (error) => ({ type: Types.FETCH_USER_INFOMTAION_FAILD_ACTION, error });

export const setProfileUserAction = (payload) => ({ type: Types.SET_PROFILE_USER_ACTION, payload });

export const fetchListGradeAction = (payload) => ({ type: Types.FETCH_LIST_GRADE_ACTION, payload });

export const fetchListGradeSuccessAction = (data) => ({ type: Types.FETCH_LIST_GRADE_SUCCESS_ACTION, data });

export const fetchListGradeFaildAction = (error) => ({ type: Types.FETCH_LIST_GRADE_FAILD_ACTION, error });

export const setGradeIdAction = (payload) => ({ type: Types.SET_GRADE_ID_ACTION, payload });

export const updateUserProfileAction = (payload) => ({ type: Types.UPDATE_USER_PROFILE_ACTION, payload });

export const updateUserProfileSuccessAction = (data) => ({ type: Types.UPDATE_USER_PROFILE_SUCCESS_ACTION, data });

export const updateUserProfileFaildAction = (error) => ({ type: Types.UPDATE_USER_PROFILE_FAILD_ACTION, error });

export const changePasswordAction = (payload) => ({ type: Types.CHANGE_PASSWORD_ACTION, payload });

export const changePasswordSuccessAction = (data) => ({ type: Types.CHANGE_PASSWORD_SUCCESS_ACTION, data });

export const changePasswordFaildAction = (error) => ({ type: Types.CHANGE_PASSWORD_FAILD_ACTION, error });

export const fetchStatisticChartAction = (payload) => ({ type: Types.FETCH_STATISTIC_CHART_ACTION, payload });

export const fetchStatisticChartSuccessAction = (data) => ({ type: Types.FETCH_STATISTIC_CHART_SUCCESS_ACTION, data });

export const fetchStatisticChartFaildAction = (error) => ({ type: Types.FETCH_STATISTIC_CHART_FAILD_ACTION, error });

export const getMateryUserStartAction = (payload) => ({ type: Types.FETCH_MATERY_USER_START_ACTION, payload });

export const getMateryUserSuccessAction = (data) => ({ type: Types.FETCH_MATERY_USER_SUCCESS_ACTION, data });

export const getMateryUserFaildAction = (err) => ({ type: Types.FETCH_MATERY_USER_FAILD_ACTION, err });

export const getChartBuySubjectIdAction = payload => ({ type: Types.FETCH_CHART_BUY_SUBJECT_ID_ACTION, payload });

export const getChartBuySubjectIdSuccessAction = data => ({ type: Types.FETCH_CHART_BUY_SUBJECT_ID_SUCCESS_ACTION, data });

export const getChartBuySubjectIdFaildAction = err => ({ type: Types.FETCH_CHART_BUY_SUBJECT_ID_FAILD_ACTION, err });

export const getChartContributiondAction = payload => ({ type: Types.FETCH_CHART_CONTRIBUTION_ACTION, payload });

export const getChartContributiondSuccessAction = data => ({ type: Types.FETCH_CHART_CONTRIBUTION_SUCCESS_ACTION, data });

export const getChartContributiondFaildAction = err => ({ type: Types.FETCH_CHART_CONTRIBUTION_FAILD_ACTION, err });

export const getFlashCardTheoryAction = payload => ({ type: Types.FETCH_FLASH_CARD_THEORY_ACTION, payload });

export const getFlashCardTheorySuccessAction = data => ({ type: Types.FETCH_FLASH_CARD_THEORY_SUCCESS_ACTION, data });

export const getFlashCardTheoryFaildAction = err => ({ type: Types.FETCH_FLASH_CARD_THEORY_FAILD_ACTION, err });

export const getFlashCardVideoAction = payload => ({ type: Types.FETCH_FLASH_CARD_VIDEO_ACTION, payload });

export const getFlashCardVideoSuccessAction = data => ({ type: Types.FETCH_FLASH_CARD_VIDEO_SUCCESS_ACTION, data });

export const getFlashCardVideoFaildAction = err => ({ type: Types.FETCH_FLASH_CARD_VIDEO_FAILD_ACTION, err });

export const saveAvatarAction = payload => ({ type: Types.SAVE_AVATAR_ACTION, payload });

export const saveUserAction = payload =>({type : Types.SAVE_USER_ACTION,payload })
