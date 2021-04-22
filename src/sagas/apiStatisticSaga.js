import * as Types from '../constants/type';
import * as Api from '../services/apiStatistics';
import _ from 'lodash';
import { put, takeLatest } from 'redux-saga/effects';
import {
    statisticClassSuccessAction,
    statisticMissionSuccessAction,
    statisticAssignmentSuccessAction,
    statisticMissionFaildAction,
    statisticAssignmentFaildAction,
    statisticClassFaildAction
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

export function* watchApiStatistic() {
    yield takeLatest(Types.STATISTIC_CLASS_ACTION, fetchStatisticClass);
    yield takeLatest(Types.STATISTIC_MISSION_ACTION, fetchStatisticMission);
    yield takeLatest(Types.STATISTIC_ASSIGNMENT_ACTION, fetchStatisticAssignment);
}