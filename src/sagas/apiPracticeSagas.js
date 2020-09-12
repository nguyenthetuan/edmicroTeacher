/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 12:05:56
 * @modify date 2018-04-17 12:05:56
 * @desc [description]
*/

import { put, takeEvery } from 'redux-saga/effects';
import * as Types from '../constants/type';
import {
  fetchListSubjectSuccessAction, fetchListSubjectFaildAction, fetchRequestRecentSuccessAction,
  fetchRequestRecentFaildAction, fetchRequestHierachyFaildAction, fetchRequestHierachySuccessAction,
  fetchExeciseFaildAction, fetchExeciseSuccessAction, fetchReportFaildAction, fetchReportSuccessAction,
  fetchListMockExamSuccessAction, fetchListMockExamFaildAction, fetchDetailMockExamSuccessAction,
  fetchDetailMockExamFaildAction
} from '../actions/practiceAction';
import * as BookmarkAction from '../actions/bookmarkAction';
import * as LearnAction from '../actions/learnAction';
import ApiHelper from '../services/apiPracticeHelper';

function* fetchListSubject(action) {
  try {
    let response = yield ApiHelper.getListSubject(action.payload);
    yield put(fetchListSubjectSuccessAction(response));
  } catch (error) {
    yield put(fetchListSubjectFaildAction(error));
  }
}

function* fetchRecentBySubjectId(action) {
  try {
    let response = yield ApiHelper.getRecentBySubject(action.payload);
    yield put(fetchRequestRecentSuccessAction(response));
  } catch (error) {
    yield put(fetchRequestRecentFaildAction(error));
  }
}

function* fetchListHierachy(action) {
  try {
    let response = yield ApiHelper.getListHierachy(action.payload);
    yield put(fetchRequestHierachySuccessAction(response));
  } catch (error) {
    yield put(fetchRequestHierachyFaildAction(error));
  }
}

function* fetchListExecise(action) {
  try {
    let response = yield ApiHelper.getListProblemExecise(action.payload);
    yield put(fetchExeciseSuccessAction(response));
  } catch (error) {
    yield put(fetchExeciseFaildAction(error));
  }
}

function* fetchReport(action) {
  try {
    let response = yield ApiHelper.getReportByProblemHiearchyId(action.payload);
    yield put(fetchReportSuccessAction(response));
  } catch (error) {
    yield put(fetchReportFaildAction(error));
  }
}

function* fetchListBookmarkHieary(action) {
  try {
    let response = yield ApiHelper.getListproblemHierachies(action.payload);
    yield put(BookmarkAction.fetchListBookmarSuccessAction(response));
  } catch (error) {
    yield put(BookmarkAction.fetchListBookmarFaildAction(error));
  }
}

function* fetchDataPracitce(action) {
  try {
    let response = yield ApiHelper.getPracticeApi(action.payload);
    yield put(LearnAction.fetchPracticeSuccessAction(response));
  } catch (error) {
    yield put(LearnAction.fetchPracticeFaildAction(error));
  }
}

// function* fechSendAnswer(action) {
//   try {
//     let response = yield ApiHelper.getQuestionAnswerNewIOS(action.payload);
//     yield put(LearnAction.fetchRequestSendAnswerSuccessAction(response));
//   } catch (error) {
//     yield put(LearnAction.fetchRequestSendAnswerFaildAction(error));
//   }
// }

function* fetchListMockExam(action) {
  try {
    let response = yield ApiHelper.getListMockExam(action.payload);
    yield put(fetchListMockExamSuccessAction(response));
  } catch (error) {
    yield put(fetchListMockExamFaildAction(error));
  }
}

function* fetchDetailMockExam(action) {
  try {
    let response = yield ApiHelper.getDetailMockExam(action.payload);
    yield put(fetchDetailMockExamSuccessAction(response));
  } catch (error) {
    yield put(fetchDetailMockExamFaildAction(error));
  }
}

export function* watchApiPractice() {
  yield takeEvery(Types.FETCH_LIST_SUBJECT_START_ACTION, fetchListSubject);
  yield takeEvery(Types.FETCH_RECENT_START_ACTION, fetchRecentBySubjectId);
  yield takeEvery(Types.FETCH_LIST_CHAPTER_START_ACTION, fetchListHierachy);
  yield takeEvery(Types.FETCH_LIST_EXECISE_START_ACTION, fetchListExecise);
  yield takeEvery(Types.FETCH_REPORT_START_ACTION, fetchReport);
  yield takeEvery(Types.FETCH_LIST_BOOKMARK_HIEARY_ACTION, fetchListBookmarkHieary);
  yield takeEvery(Types.FETCH_LIST_BOOKMARK_MORE_HIEARY_ACTION, fetchListBookmarkHieary);
  yield takeEvery(Types.FETCH_DATA_PRACTICE_ACTION, fetchDataPracitce);
  // yield takeEvery(Types.FETCH_ANSWER_QUESTION_ACTION, fechSendAnswer);
  yield takeEvery(Types.FETCH_LIST_MOCK_EXAM_ACTION, fetchListMockExam);
  yield takeEvery(Types.FETCH_DETAIL_MOCK_EXAM_ACTION, fetchDetailMockExam);
}