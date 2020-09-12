import { put, takeEvery } from 'redux-saga/effects';
import ApiHelper from '../services/apiSchoolOnline';
import * as Types from '../constants/type';
import {
    fetchListClassUserSuccessAction, fetchListClassUserFaildAction,
    fetchListHomeWorkSuccessAction, fetchListHomeWorkFaildAction,
    fetchInfoAssignmentSuccessAction, fetchInfoAssignmentFailAction,
    fetchResultDetailSuccessAction, fetchResultDetailFaildAction,
    fetchCreateAssignmentsSuccessAction, fetchCreateAssignmentsFaildAction,
    fetchListTitleQuestionSuccessAction, fetchListTitleQuestionFaildAction,
    fetchContentQuestionSuccessAction, fetchContentQuestionFaildAction

} from '../actions/schoolOnlineAction';

function* fetchListClassUser(action) {
    try {
        let listClassUser = yield ApiHelper.getListClassUser(action.payload);
        yield put(fetchListClassUserSuccessAction(listClassUser))
        action.payload.resolve(listClassUser);
    } catch (error) {
        yield put(fetchListClassUserFaildAction(error));
        action.payload.reject(error);
    }
}

function* fetListHomeWork(action) {
    try {
        let listHomeWork = yield ApiHelper.getListHomeWork(action.payload);
        yield put(fetchListHomeWorkSuccessAction(listHomeWork));
        action.payload.resolve(listHomeWork);
    } catch (error) {
        yield put(fetchListHomeWorkFaildAction(error));
        action.payload.reject(error);
    }
}

function* fetchInfoAssignment(action) {
    try {
        let infoAssignment = yield ApiHelper.getInfoAssignment(action.payload);
        yield put(fetchInfoAssignmentSuccessAction(infoAssignment));
        action.payload.resolve(infoAssignment);
    } catch (error) {
        yield put(fetchInfoAssignmentFailAction(error));
        action.payload.reject(error);
    }
}

function* fetchResultDetail(action) {
    try {
        let response = yield ApiHelper.getResultDetail(action.payload);
        yield put(fetchResultDetailSuccessAction(response));
        action.payload.resolve(response);
    } catch (error) {
        yield put(fetchResultDetailFaildAction(error));
        action.payload.reject(error);
    }
}

function* fetchCreateAssignments(action) {
    try {
        let response = yield ApiHelper.getCreateAssignments(action.payload);
        yield put(fetchCreateAssignmentsSuccessAction(response));
        action.payload.resolve(response);
    } catch (error) {
        yield put(fetchCreateAssignmentsFaildAction(error));
        console.log(error);

        action.payload.reject(error);
    }
}

function* fetchListTitleQuestions(action) {
    try {
        let response = yield ApiHelper.getListQuestionAssign(action.payload);
        yield put(fetchListTitleQuestionSuccessAction(response));
        action.payload.resolve(response);
    } catch (error) {
        yield put(fetchListTitleQuestionFaildAction(error));
        action.payload.reject(error);
    }
}

function* fetchContentQuestion(action) {
    try {
        let response = yield ApiHelper.getContentQuestion(action.payload);
        yield put(fetchContentQuestionSuccessAction(response));
        action.payload.resolve(response);
    } catch (error) {
        yield put(fetchContentQuestionFaildAction(error));
        action.payload.reject(error);
    }
}

export function* watchApiSchool() {
    yield takeEvery(Types.FETCH_LIST_CLASS_OF_USER_ACTION, fetchListClassUser);
    yield takeEvery(Types.FETCH_LIST_HOMEWORK_ACTION, fetListHomeWork);
    yield takeEvery(Types.FETCH_INFO_ASSIGNMENT_ACTION, fetchInfoAssignment);
    yield takeEvery(Types.FETCH_RESULT_DETAIL_ACTION, fetchResultDetail);
    yield takeEvery(Types.FETCH_CREATE_ASSIGNMENT_ACTION, fetchCreateAssignments);
    yield takeEvery(Types.FETCH_LIST_TITLE_QUESTION_ACTION, fetchListTitleQuestions);
    yield takeEvery(Types.FETCH_CONTENT_QUESSTION_ACTION, fetchContentQuestion);
}