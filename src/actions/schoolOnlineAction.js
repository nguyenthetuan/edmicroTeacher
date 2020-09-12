import * as Types from '../constants/type';

export const fetchListClassUserAction = (payload) => ({ type: Types.FETCH_LIST_CLASS_OF_USER_ACTION, payload });

export const fetchListClassUserSuccessAction = (data) => ({ type: Types.FETCH_LIST_CLASS_OF_USER_SUCCESS_ACTION, data });

export const fetchListClassUserFaildAction = (error) => ({ type: Types.FETCH_LIST_CLASS_OF_USER_FAILD_ACTION, error });

export const fetchListHomeworkAction = (payload) => ({ type: Types.FETCH_LIST_HOMEWORK_ACTION, payload });

export const fetchListHomeWorkSuccessAction = (data) => ({ type: Types.FETCH_LIST_HOMEWORK_SUCCESS_ACTION, data });

export const fetchListHomeWorkFaildAction = (error) => ({ type: Types.FETCH_LIST_HOMEWORK_FAILD_ACTION, error });

export const fetchInfoAssignmentAction = payload => ({ type: Types.FETCH_INFO_ASSIGNMENT_ACTION, payload });

export const fetchInfoAssignmentSuccessAction = data => ({ type: Types.FETCH_INFO_ASSIGNMENT_SUCCESS_ACTION, data });

export const fetchInfoAssignmentFailAction = error => ({ type: Types.FETCH_INFO_ASSIGNMENT_FAILD_ACTION, error });

export const fetchResultDetailAction = payload => ({ type: Types.FETCH_RESULT_DETAIL_ACTION, payload });

export const fetchResultDetailSuccessAction = data => ({ type: Types.FETCH_RESULT_DETAIL_SUCCESS_ACTION, data });

export const fetchResultDetailFaildAction = error => ({ type: Types.FETCH_RESULT_DETAIL_FAILD_ACTION, error });

export const fetchCreateAssignmentsAction = payload => ({ type: Types.FETCH_CREATE_ASSIGNMENT_ACTION, payload });

export const fetchCreateAssignmentsSuccessAction = data => ({ type: Types.FETCH_CREATE_ASSIGNMENT_SUCCESS_ACTION, data });

export const fetchCreateAssignmentsFaildAction = error => ({ type: Types.FETCH_CREATE_ASSIGNMENT_FAILD_ACTION, error });

export const fetchListTitleQuestionAction = payload => ({ type: Types.FETCH_LIST_TITLE_QUESTION_ACTION, payload });

export const fetchListTitleQuestionSuccessAction = data => ({ type: Types.FETCH_LIST_TITLE_QUESTION_SUCCESS_ACTION, data });

export const fetchListTitleQuestionFaildAction = error => ({ type: Types.FETCH_LIST_TITLE_QUESTION_FAILD_ACTION, error });

export const fetchContentQuestionAction = payload => ({ type: Types.FETCH_CONTENT_QUESSTION_ACTION, payload });

export const fetchContentQuestionSuccessAction = data => ({ type: Types.FETCH_CONTENT_QUESSTION_SUCCESS_ACTION, data });

export const fetchContentQuestionFaildAction = error => ({ type: Types.FETCH_CONTENT_QUESSTION_FAILD_ACTION, error });