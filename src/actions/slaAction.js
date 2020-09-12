/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-05-14 11:15:34
 * @modify date 2018-05-14 11:15:34
 * @desc [description]
*/

import * as Types from '../constants/type';

export const fectchListSlaAction = (payload) => ({ type: Types.FETCH_LIST_SLA_SUBJECT_ACTION, payload });

export const fectchListSlaSuccessAction = (data) => ({ type: Types.FETCH_LIST_SLA_SUBJECT_SUCCESS_ACTION, data });

export const fectchListSlaFaildAction = (error) => ({ type: Types.FETCH_LIST_SLA_SUBJECT_FAILD_ACTION, error });

export const fectchListPracticeSubjectAction = (payload) => ({ type: Types.FETCH_LIST_PRACTICE_SUBJECT_ACTION, payload });

export const fectchListPracticeSubjectSuccessAction = (data) => ({ type: Types.FETCH_LIST_PRACTICE_SUBJECT_SUCCESS_ACTION, data });

export const fectchListPracticeSubjectFaildAction = (error) => ({ type: Types.FETCH_LIST_PRACTICE_SUBJECT_FAILD_ACTION, error });

export const fectchTargetSlaAction = (payload) => ({ type: Types.FETCH_TARGET_START_ACTION, payload });

export const fectchTargetSlaSuccessAction = (data) => ({ type: Types.FETCH_TARGET_SUCCESS_ACTION, data });

export const fectchTargetSlaFaildAction = (error) => ({ type: Types.FETCH_TARGET_FAILD_ACTION, error });

export const fectchListSlaInfoStartdAction = (payload) => ({ type: Types.FETCH_LIST_SLA_INFO_ACTION, payload });

export const fectchListSlaInfoSuccessdAction = (data) => ({ type: Types.FETCH_LIST_SLA_INFO_SUCCESS_ACTION, data });

export const fectchListSlaInfoFaildAction = (error) => ({ type: Types.FETCH_LIST_SLA_INFO_FAILD_ACTION, error });

export const fetchTestSlaDetailDoneAction = (payload) => ({ type: Types.FETCH_TEST_SLA_DETAIL_DONE_ACTION, payload });

export const fetchTestSlaDetailDoneSuccessAction = (data) => ({ type: Types.FETCH_TEST_SLA_DETAIL_DONE_SUCCESS_ACTION, data });

export const fetchTestSlaDetailDoneFaildAction = (error) => ({ type: Types.FETCH_TEST_SLA_DETAIL_DONE_FAILD_ACTION, error });

export const fetchPracticeSlaStartAction = (payload) => ({ type: Types.FETCH_PRACTICE_SLA_START_ACTION, payload });

export const fetchPracticeSlaSuccessAction = (data) => ({ type: Types.FETCH_PRACTICE_SLA_SUCCESS_ACTION, data });

export const fetchPracticeSlaFaildAction = (error) => ({ type: Types.FETCH_PRACTICE_SLA_FAILD_ACTION, error });

export const fetchRecentSlaAction = (payload) => ({ type: Types.FETCH_RECENT_SLA_ACTION, payload });

export const fetchRecentSlaSuccessAction = (data) => ({ type: Types.FETCH_RECENT_SLA_SUCCESS_ACTION, data });

export const fetchRecentSlaFaildAction = (error) => ({ type: Types.FETCH_RECENT_SLA_FAILD_ACTION, error });

export const fetchTestSlaDetaiStartAction = (payload) => ({ type: Types.FETCH_TEST_SLA_DETAIL_START_ACTION, payload });

export const fetchTestSlaDetaiSuccessAction = (data) => ({ type: Types.FETCH_TEST_SLA_DETAIL_SUCCESS_ACTION, data });

export const fetchTestSlaDetaiFaildAction = (error) => ({ type: Types.FETCH_TEST_SLA_DETAIL_FAILD_ACTION, error });

