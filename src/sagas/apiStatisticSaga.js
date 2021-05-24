import * as Types from '../constants/type';
import * as Api from '../services/apiStatistics';
import _ from 'lodash';
import { put, takeLatest } from 'redux-saga/effects';
import {
    statisticClassSuccessAction,
    statisticMissionSuccessAction,
    statisticAssignmentSuccessAction,
    diaryActiveSuccessAction,
    statisticMissionFaildAction,
    statisticAssignmentFaildAction,
    statisticClassFaildAction,
    diaryActiveFaildAction,
    laboratorySuccessAction,
    laboratoryFaildAction
} from '../actions/statisticAction';

function* fetchStatisticClass(action) {
    try {
        const response = yield Api.statisticClass(action.payload);
        yield put(statisticClassSuccessAction(response));
    } catch (error) {
        yield put(statisticClassFaildAction([]));
    }
}

function* fetchStatisticMission(action) {
    try {
        const response = yield Api.statisticMission(action.payload);
        yield put(statisticMissionSuccessAction(response));
    } catch (error) {
        yield put(statisticMissionFaildAction([]));
    }
}

function* fetchStatisticAssignment(action) {
    try {
        const response = yield Api.statisticAssignment(action.payload);
        yield put(statisticAssignmentSuccessAction(response));
    } catch (error) {
        yield put(statisticAssignmentFaildAction([]));
    }
}
function* fetchDiaryActive(action) {
    try {
        const response = yield Api.diaryActive(action.payload);
        yield put(diaryActiveSuccessAction(response));
    } catch (error) {
        yield put(diaryActiveFaildAction([]));
    }
}
function* fetchLaboratory(action) {
    try {
        const response = yield Api.getLaboratory(action.payload);
        yield put(laboratorySuccessAction(response));
    } catch (error) {
        yield put(laboratoryFaildAction([]));
    }
}

export function* watchApiStatistic() {
    yield takeLatest(Types.STATISTIC_CLASS_ACTION, fetchStatisticClass);
    yield takeLatest(Types.STATISTIC_MISSION_ACTION, fetchStatisticMission);
    yield takeLatest(Types.STATISTIC_ASSIGNMENT_ACTION, fetchStatisticAssignment);
    yield takeLatest(Types.DIARY_ACTIVE_ACTION, fetchDiaryActive);
    yield takeLatest(Types.LABORATORY_ACTION, fetchLaboratory);
}