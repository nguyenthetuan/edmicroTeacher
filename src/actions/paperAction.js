import * as Types from '../constants/type';

export const setListGrades = (payload) => ({ type: Types.SAVE_LIST_GRADES, payload });

export const setListSubject = (payload) => ({ type: Types.SAVE_LIST_SUBJECT, payload });

export const fetchDataAssignmentAction = (payload) => ({ type: Types.FETCH_ASSIGNMENT_DETAIL_ACTION, payload });

export const fetchDataAssignmentSuccess = (payload) => ({ type: Types.FETCH_ASSIGNMENT_DETAIL_SUCCESS_ACTION, payload });

export const fetchDataAssignmentFailed = (payload) => ({ type: Types.FETCH_ASSIGNMENT_DETAIL_FAILED_ACTION, payload });
