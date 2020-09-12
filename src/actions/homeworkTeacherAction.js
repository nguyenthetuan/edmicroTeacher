import * as Types from '../constants/type';

export const fetchHomeworkAction = (payload) => ({ type: Types.FETCH_DATA_HOMEWORK_TEACHER_ACTION, payload });

export const fetchHomeworkSuccessAction = (data) => ({ type: Types.FETCH_DATA_HOMEWORK_TEACHER_SUCCESS_ACTION, data });

export const fetchHomeworkFailedAction = (error) => ({ type: Types.FETCH_DATA_HOMEWORK_TEACHER_FAILED_ACTION, error });