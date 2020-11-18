import * as Types from '../constants/type';
import * as Api from '../services/apiMission';
import _ from 'lodash';
import { put, takeLatest } from 'redux-saga/effects';
import {
  fetchCommonSubjectMissionSuccess,
  fetchListMissionSuccess,
  fetchCategoryHirachyMissionSuccess,
  fetchCategoryTestMissionSuccess,
  fetchListProblemMissionSuccess,
  fetchListProblemTestMissSuccess,
  fetchAssignmentByMissionSuccess,
} from '../actions/missionAction';

function* fetchCommonSubject(action) {
  try {
    const response = yield Api.getCommonSubject(action.payload);
    if (!_.isEmpty(response)) {
      yield put(fetchCommonSubjectMissionSuccess(response));
    } else {
      yield put(fetchCommonSubjectMissionSuccess([]));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchCommonSubjectMissionSuccess([]));
  }
}

function* fetchListMission(action) {
  try {
    const response = yield Api.getListMission(action.payload);
    if (!_.isEmpty(response)) {
      yield put(fetchListMissionSuccess(response));
    } else {
      yield put(fetchListMissionSuccess([]));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchListMissionSuccess([]));
  }
}

function* fetchCategoryHirachy(action) {
  try {
    const response = yield Api.getCategoryHirachyMission(action.payload);
    yield put(fetchCategoryHirachyMissionSuccess(response));
  } catch (error) {
    console.log(error);
    yield put(fetchCategoryHirachyMissionSuccess([]));
  }
}

function* fetchCategoryTest(action) {
  try {
    const response = yield Api.getCategoryTestMission(action.payload);
    yield put(fetchCategoryTestMissionSuccess(response));
  } catch (error) {
    console.log(error);
    yield put(fetchCategoryTestMissionSuccess([]));
  }
}

function* fetchListProblemMission(action) {
  try {
    const response = yield Api.getListProblemMission(action.payload);
    yield put(fetchListProblemMissionSuccess(response));
    if (action.payload.res) {
      action.payload.res(response);
    }
  } catch (error) {
    console.log(error);
    yield put(fetchListProblemMissionSuccess([]));
  }
}

function* fetchListProblemTestMission(action) {
  try {
    const response = yield Api.getTestByCategory(action.payload);
    const data = {
      id: action.payload.id,
      data: response,
    };
    yield put(fetchListProblemTestMissSuccess(data));
    if (action.payload.res) {
      action.payload.res(response);
    }
  } catch (error) {
    console.log(error);
  }
}

function* fetchAssignmentBuyMission(action) {
  try {
    const response = yield Api.getAssignByMission(action.payload);
    yield put(fetchAssignmentByMissionSuccess(response));
  } catch (error) {
    yield put(fetchAssignmentByMissionSuccess({}));
  }
}

export function* watchApiMission() {
  yield takeLatest(Types.FETCH_COMMON_SUBJECT_MISSION, fetchCommonSubject);
  yield takeLatest(Types.FETCH_LIST_MISSION, fetchListMission);
  yield takeLatest(Types.FETCH_CATEGORY_HIRACHY_MISSION, fetchCategoryHirachy);
  yield takeLatest(Types.FETCH_CATEGORY_TEST_MISSION, fetchCategoryTest);
  yield takeLatest(Types.FETCH_LIST_PROBLEM_MISSION, fetchListProblemMission);
  yield takeLatest(
    Types.FETCH_LIST_PROBLEM_TEST_MISSION,
    fetchListProblemTestMission,
  );
  yield takeLatest(Types.FETCH_ASSIGNMENT_BY_MISSION, fetchAssignmentBuyMission);
}
