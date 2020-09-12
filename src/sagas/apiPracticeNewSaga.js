import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import apiPractice2 from '../services/apiPracticeNew';
import apiService from '../services/apiPracticeHelper';
import * as Types from '../constants/type';
import { fectchListPracticeSubjectSuccessAction, fectchListPracticeSubjectFaildAction } from '../actions/slaAction';
import { fetchRequestSendAnswerSuccessAction, fetchRequestSendAnswerFaildAction } from '../actions/learnAction';

function* fetchListPractice2(action) {
  try {
    let response = yield apiPractice2.getPracticeHiearchy(action.payload);
    yield put(fectchListPracticeSubjectSuccessAction(response));
  } catch (error) {
    yield put(fectchListPracticeSubjectFaildAction(error));
  }
}

function* sendAnswer(action) {
  try {
    let response = yield apiService.getQuestionAnswerNewV2(action.payload);
    yield put(fetchRequestSendAnswerSuccessAction(response));
    action.payload.resolve(response);
  } catch (error) {
    yield put(fetchRequestSendAnswerFaildAction(error));
    action.payload.reject(error);
  }
}

export function* wathchApiPractice2() {
  yield takeEvery(Types.FETCH_LIST_PRACTICE_SUBJECT_ACTION, fetchListPractice2);
  yield takeLatest(Types.FETCH_ANSWER_QUESTION_ACTION, sendAnswer);
}