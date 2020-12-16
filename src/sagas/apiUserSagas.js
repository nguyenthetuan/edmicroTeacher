/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 04:53:06
 * @modify date 2018-04-17 04:53:06
 * @desc [description]
*/

import { put, takeEvery } from 'redux-saga/effects';
import * as Types from '../constants/type';
import ApiHelper from '../services/apiUserHelper';
import { showResultConfirmAction } from '../actions/modalAction';
import {
  fetchListGradeSuccessAction, fetchListGradeFaildAction, updateUserProfileSuccessAction,
  updateUserProfileFaildAction, fetchUserInfomationSuccessAction, fetchUserInfomationFaildAction,
  fetchStatisticChartSuccessAction, fetchStatisticChartFaildAction, getMateryUserSuccessAction, getMateryUserFaildAction,
  getChartBuySubjectIdSuccessAction, getChartBuySubjectIdFaildAction, getChartContributiondFaildAction, getChartContributiondSuccessAction,
  getFlashCardTheorySuccessAction, getFlashCardTheoryFaildAction, getFlashCardVideoSuccessAction, getFlashCardVideoFaildAction
} from '../actions/userAction';
import { fetchListProcessFaildAction, fetchListProcessSuccessAction } from '../actions/processAction';
import { userGiftActionSuccessAction, userGiftActionFaildAction } from '../actions/userAction';

function* fetchUserInfomation(action) {
  try {
    const response = yield ApiHelper.getAccountStatistic(action.payload);
    yield put(fetchUserInfomationSuccessAction(response));
  } catch (error) {
    yield put(fetchUserInfomationFaildAction(error));
  }
}

function* upradePhoneNow(action) {
  try {
    const response = yield ApiHelper.upragePackageRegister(action.payload);
    if (response.status === 200) {
      yield put(showResultConfirmAction());
    }
  } catch (error) {

  }
}

function* fetchListGrade(action) {
  try {
    const response = yield ApiHelper.getListGrades(action.payload);
    yield put(fetchListGradeSuccessAction(response));
  } catch (error) {
    yield put(fetchListGradeFaildAction(error));
  }
}

function* updateProfile(action) {
  try {
    const response = yield ApiHelper.updateProfile(action.payload);
    yield put(updateUserProfileSuccessAction(response));
    return action.payload.resolve(response);
  } catch (error) {
    yield put(updateUserProfileFaildAction(error));
    return action.payload.reject(error);
  }
}

function* changePassword(action) {
  try {
    const response = yield ApiHelper.changePassword(action.payload);
    action.payload.resolve(response);
  } catch (error) {
    action.payload.reject(error);
  }
}

function* fetchListProcess(action) {
  try {
    let response = yield ApiHelper.fetchListProcessActivity(action.payload);
    yield put(fetchListProcessSuccessAction(response));
  } catch (error) {
    yield put(fetchListProcessFaildAction(error));
  }
}

function* fetchStatisticChart(action) {
  try {
    let response = yield ApiHelper.getStatisticChartBySubjectId(action.payload);
    yield put(fetchStatisticChartSuccessAction(response));
  } catch (error) {
    yield put(fetchStatisticChartFaildAction(error));
  }
}

function* fetchDataMatery(action) {
  try {
    let response = yield ApiHelper.getMateryBySubjectId(action.payload);
    yield put(getMateryUserSuccessAction(response));
  } catch (error) {
    yield put(getMateryUserFaildAction(error));
  }
}

function* fetchChartBuySubjectId(action) {
  try {
    let response = yield ApiHelper.getChartBuySubjectId(action.payload);
    yield put(getChartBuySubjectIdSuccessAction(response));
    yield action.payload.resolve(response);
  } catch (error) {
    yield put(getChartBuySubjectIdFaildAction(error));
    yield action.payload.reject(error);
  }
}

function* fetchChartContribution(action) {
  try {
    let response = yield ApiHelper.getChartContribution(action.payload);
    yield put(getChartContributiondSuccessAction(response));
    yield action.payload.resolve(response);
  } catch (error) {
    yield put(getChartContributiondFaildAction(error));
    yield action.payload.reject(error);
  }
}

function* fetchFlashCardTheory(action) {
  try {
    let response = yield ApiHelper.getFlashCardTheory(action.payload);
    yield put(getFlashCardTheorySuccessAction(response));
  } catch (error) {
    yield put(getFlashCardTheoryFaildAction(error));
  }
}

function* fetchFlashCardVideo(action) {
  try {
    let response = yield ApiHelper.getFlashCardTheory(action.payload);
    yield put(getFlashCardVideoSuccessAction(response));
  } catch (error) {
    yield put(getFlashCardVideoFaildAction(error));
  }
}
function* userGift(action) {
  try {
    let response = yield ApiHelper.userGift(action.payload);
    yield put(userGiftActionSuccessAction(response));
  } catch (error) {
    yield put(userGiftActionFaildAction(error));
  }
}


export function* watchApiUser() {
  yield takeEvery(Types.UPGRADE_PHONE_NOW_ACTION, upradePhoneNow);
  yield takeEvery(Types.FETCH_LIST_GRADE_ACTION, fetchListGrade);
  yield takeEvery(Types.UPDATE_USER_PROFILE_ACTION, updateProfile);
  yield takeEvery(Types.CHANGE_PASSWORD_ACTION, changePassword);
  yield takeEvery(Types.FETCH_LIST_PROCESS_ACTION, fetchListProcess);
  yield takeEvery(Types.FETCH_LIST_PROCESS_MORE_ACTION, fetchListProcess);
  yield takeEvery(Types.FETCH_USER_INFOMTAION_ACTION, fetchUserInfomation);
  yield takeEvery(Types.FETCH_STATISTIC_CHART_ACTION, fetchStatisticChart);
  yield takeEvery(Types.FETCH_MATERY_USER_START_ACTION, fetchDataMatery);
  yield takeEvery(Types.FETCH_CHART_BUY_SUBJECT_ID_ACTION, fetchChartBuySubjectId);
  yield takeEvery(Types.FETCH_CHART_CONTRIBUTION_ACTION, fetchChartContribution);
  yield takeEvery(Types.FETCH_FLASH_CARD_THEORY_ACTION, fetchFlashCardTheory);
  yield takeEvery(Types.FETCH_FLASH_CARD_VIDEO_ACTION, fetchFlashCardVideo);
  yield takeEvery(Types.USER_GIFT_ACTION, userGift);
}
