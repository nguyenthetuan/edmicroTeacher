import * as Types from '../constants/type';

export const fetchListProcessAction = (payload) => ({ type: Types.FETCH_LIST_PROCESS_ACTION, payload });

export const fetchListProcessMoreAction = (payload) => ({ type: Types.FETCH_LIST_PROCESS_MORE_ACTION, payload });

export const fetchListProcessSuccessAction = (data) => ({ type: Types.FETCH_LIST_PROCESS_SUCCESS_ACTION, data });

export const fetchListProcessFaildAction = (error) => ({ type: Types.FETCH_LIST_PROCESS_FAILD_ACTION, error });
