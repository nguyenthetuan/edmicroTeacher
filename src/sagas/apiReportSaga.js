import { put, takeLatest } from 'redux-saga/effects';
import apiHomeworkTeacher from '../services/apiHomeworkTeacher';
import * as Types from '../constants/type';
import { fetchReportSuccessAction, fetchReportFailedAction } from '../actions/reportAction';

function* GetReportDetail(action) {
    try {
        let response = yield apiHomeworkTeacher.getDetailResult(action.payload);
        yield put(fetchReportSuccessAction({ response, assignId: action.payload.assignId }));
    } catch (error) {
        console.log(error);
        yield put(fetchReportFailedAction(error));
    }
}

export function* watchApiReport() {
    yield takeLatest(Types.FETCH_DATA_REPORT_ACTION, GetReportDetail)
}