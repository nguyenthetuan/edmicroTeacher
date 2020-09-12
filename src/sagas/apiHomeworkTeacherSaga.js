import { put, takeLatest } from 'redux-saga/effects';
import apiHomeworkTeacher from '../services/apiHomeworkTeacher';
import * as Types from '../constants/type';
import { fetchHomeworkSuccessAction, fetchHomeworkFailedAction } from '../actions/homeworkTeacherAction';

function* getHomeworkDetail(action) {
    try {
        let response = yield apiHomeworkTeacher.getDetailResult(action.payload);
        yield put(fetchHomeworkSuccessAction({ response, assignId: action.payload.assignId }));
    } catch (error) {
        console.log(error);
        yield put(fetchHomeworkFailedAction(error));
    }
}

export function* watchApiHomeworkTeacher() {
    yield takeLatest(Types.FETCH_DATA_HOMEWORK_TEACHER_ACTION, getHomeworkDetail)
}