import * as Types from '../constants/type';

export const fetchReportAction = (payload) => ({ type: Types.FETCH_DATA_REPORT_ACTION, payload });

export const fetchReportSuccessAction = (data) => ({ type: Types.FETCH_DATA_REPORT_SUCCESS_ACTION, data });

export const fetchReportFailedAction = (error) => ({ type: Types.FETCH_DATA_REPORT_FAILED_ACTION, error });