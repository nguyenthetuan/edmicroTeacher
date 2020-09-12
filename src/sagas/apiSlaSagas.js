/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-05-14 11:29:39
 * @modify date 2018-05-14 11:29:39
 * @desc [description]
*/

import { put, takeEvery } from 'redux-saga/effects';
import ApiHelper from '../services/apiSlaDeprecated';
import * as Types from '../constants/type';
import {
  fectchListSlaFaildAction, fectchListSlaSuccessAction, fectchTargetSlaSuccessAction, fectchTargetSlaFaildAction,
  fectchListSlaInfoSuccessdAction, fectchListSlaInfoFaildAction, fetchTestSlaDetailDoneSuccessAction,
  fetchTestSlaDetailDoneFaildAction, fetchPracticeSlaSuccessAction, fetchPracticeSlaFaildAction,
  fetchRecentSlaSuccessAction, fetchRecentSlaFaildAction, fetchTestSlaDetaiSuccessAction, fetchTestSlaDetaiFaildAction
} from '../actions/slaAction';

function* fetchListSlaSubject(action) {
  try {
    let response = yield ApiHelper.getSlaListSubject(action.payload);
    yield put(fectchListSlaSuccessAction(response));
  } catch (error) {
    yield put(fectchListSlaFaildAction(error));
  }
}

function* fetchListTargetSla(action) {
  try {
    let response = yield ApiHelper.getListTargetSla(action.payload);
    yield put(fectchTargetSlaSuccessAction(response));
    action.payload.resolve(response);
  } catch (error) {
    action.payload.reject(error);
    yield put(fectchTargetSlaFaildAction(error));
  }
}

function* fetchListSlaInfo(action) {
  try {
    let response = yield ApiHelper.getListSlaInfo(action.payload);
    action.payload.resolve(response);
    yield put(fectchListSlaInfoSuccessdAction(response));
  } catch (error) {
    action.payload.reject(error);
    yield put(fectchListSlaInfoFaildAction(error));
  }
}

function* fetchTestSlaDetailDone(action) {
  try {
    let response = yield ApiHelper.getTestSlaDetailDone(action.payload);
    yield put(fetchTestSlaDetailDoneSuccessAction(response));
  } catch (error) {
    yield put(fetchTestSlaDetailDoneFaildAction(error));
  }
}

function* fechPracticeSla(action) {
  try {
    let response = yield ApiHelper.getListPracticeSla(action.payload);
    yield put(fetchPracticeSlaSuccessAction(response));
  } catch (error) {
    yield put(fetchPracticeSlaFaildAction(error));
  }
}

function* fetchRecentSla(action) {
  try {
    let response = yield ApiHelper.getRecentSla(action.payload);
    yield put(fetchRecentSlaSuccessAction(response));
  } catch (error) {
    yield put(fetchRecentSlaFaildAction(error));
  }
}

function* fetchTestSlaDetail(action) {
  try {
    let response = yield ApiHelper.getTestQuestionDetail(action.payload);
    yield put(fetchTestSlaDetaiSuccessAction(response));
  } catch (error) {
    yield put(fetchTestSlaDetaiFaildAction(error));
  }
}

export function* watchApiSla() {
  yield takeEvery(Types.FETCH_LIST_SLA_SUBJECT_ACTION, fetchListSlaSubject);
  yield takeEvery(Types.FETCH_TARGET_START_ACTION, fetchListTargetSla);
  yield takeEvery(Types.FETCH_LIST_SLA_INFO_ACTION, fetchListSlaInfo);
  yield takeEvery(Types.FETCH_TEST_SLA_DETAIL_DONE_ACTION, fetchTestSlaDetailDone);
  yield takeEvery(Types.FETCH_PRACTICE_SLA_START_ACTION, fechPracticeSla);
  yield takeEvery(Types.FETCH_RECENT_SLA_ACTION, fetchRecentSla);
  yield takeEvery(Types.FETCH_TEST_SLA_DETAIL_START_ACTION, fetchTestSlaDetail);

}