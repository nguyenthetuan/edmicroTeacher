import { put, takeLatest } from 'redux-saga/effects';
import * as Types from '../constants/type';
import apiPaperTeacher from '../services/apiPapersTeacher';
import { fetchDataAssignmentFailed, fetchDataAssignmentSuccess } from '../actions/paperAction';

function* getAssignmentDetail(action) {
    try {
        let response = yield apiPaperTeacher.assignmentDetail(action.payload);
        yield put(fetchDataAssignmentSuccess({ assignId: response.data[0].assignId }));
        action.payload.resolve(response.data[0].assignId);
    } catch (error) {
        yield put(fetchDataAssignmentFailed(error));
        action.payload.reject(error);
    }
}

export function* watchApiPaperTeacher() {
    yield takeLatest(Types.FETCH_ASSIGNMENT_DETAIL_ACTION, getAssignmentDetail)
}