/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 12:01:10
 * @modify date 2018-04-17 12:01:10
 * @desc [description]
*/

import * as Types from '../constants/type';

export const fetchListSubjectStartAction = (payload) => ({ type: Types.FETCH_LIST_SUBJECT_START_ACTION, payload });

export const fetchListSubjectSuccessAction = (data) => ({ type: Types.FETCH_LIST_SUBJECT_SUCCESS_ACTION, data });

export const fetchListSubjectFaildAction = (error) => ({ type: Types.FETCH_LIST_SUBJECT_FAILD_ACTION, error });

export const fetchRequestRecentAction = (payload) => ({ type: Types.FETCH_RECENT_START_ACTION, payload });

export const fetchRequestRecentSuccessAction = (data) => ({ type: Types.FETCH_RECENT_SUCCESS_ACTION, data });

export const fetchRequestRecentFaildAction = (error) => ({ type: Types.FETCH_RECENT_FAILD_ACTION, error });

export const fetchRequestHierachyAction = (payload) => ({ type: Types.FETCH_LIST_CHAPTER_START_ACTION, payload });

export const fetchRequestHierachySuccessAction = (data) => ({ type: Types.FETCH_LIST_CHAPTER_SUCCESS_ACTION, data });

export const fetchRequestHierachyFaildAction = (error) => ({ type: Types.FETCH_LIST_CHAPTER_FAILD_ACTION, error });

export const fetchExeciseAction = (payload, callback) => ({ type: Types.FETCH_LIST_EXECISE_START_ACTION, payload });

export const fetchExeciseSuccessAction = (data) => ({ type: Types.FETCH_LIST_EXECISE_SUCCESS_ACTION, data });

export const fetchExeciseFaildAction = (error) => ({ type: Types.FETCH_LIST_EXECISE_FAILD_ACTION, error });

export const fetchReportAction = (payload) => ({ type: Types.FETCH_REPORT_START_ACTION, payload });

export const fetchReportSuccessAction = (data) => ({ type: Types.FETCH_REPORT_SUCCESS_ACTION, data });

export const fetchReportFaildAction = (error) => ({ type: Types.FETCH_REPORT_FAILD_ACTION, error });

export const fetchListMockExamAction = (payload) => ({ type: Types.FETCH_LIST_MOCK_EXAM_ACTION, payload });

export const fetchListMockExamSuccessAction = (data) => ({ type: Types.FETCH_LIST_MOCK_EXAM_SUCCESS_ACTION, data });

export const fetchListMockExamFaildAction = (error) => ({ type: Types.FETCH_LIST_MOCK_EXAM_FAILD_ACTION, error });

export const fetchDetailMockExamAction = (payload) => ({ type: Types.FETCH_DETAIL_MOCK_EXAM_ACTION, payload });

export const fetchDetailMockExamSuccessAction = (data) => ({ type: Types.FETCH_DETAIL_MOCK_EXAM_SUCCESS_ACTION, data });

export const fetchDetailMockExamFaildAction = (error) => ({ type: Types.FETCH_DETAIL_MOCK_EXAM_FAILD_ACTION, error });

