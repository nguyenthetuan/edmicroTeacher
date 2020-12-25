import * as Types from '../constants/type';
import * as Api from '../services/apiStatistics';
import _ from 'lodash';
import { put, takeLatest } from 'redux-saga/effects';
import {
    statisticClassSuccessAction,
    statisticMissionSuccessAction,
    statisticAssignmentSuccessAction
} from '../actions/statisticAction';

function* fetchStatisticClass(action) {
    try {
        const response = yield Api.statisticClass(action.payload);
        yield put(statisticClassSuccessAction(response));
    } catch (error) {
        yield put(statisticClassSuccessAction([]));
    }
}

function* fetchStatisticMission(action) {
    try {
        const response = yield Api.statisticMission(action.payload);
        yield put(statisticMissionSuccessAction(response));
    } catch (error) {
        yield put(statisticMissionSuccessAction([]));
    }
}

function* fetchStatisticAssignment(action) {
    try {
        const response = yield Api.statisticAssignment(action.payload);
        yield put(statisticAssignmentSuccessAction(response));
    } catch (error) {
        yield put(statisticAssignmentSuccessAction([]));
    }
}

export function* watchApiStatistic() {
    yield takeLatest(Types.STATISTIC_CLASS_ACTION, fetchStatisticClass);
    yield takeLatest(Types.STATISTIC_MISSION_ACTION, fetchStatisticMission);
    yield takeLatest(Types.STATISTIC_ASSIGNMENT_ACTION, fetchStatisticAssignment);
}