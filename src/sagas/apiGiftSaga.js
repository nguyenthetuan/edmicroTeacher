import * as Types from '../constants/type';
import * as Api from '../services/apiGift';
import _ from 'lodash';
import { put, takeLatest } from 'redux-saga/effects';
import {
    userGiftActionSuccessAction,
    getListGiftSuccessAction,
    getListHistorySuccessAction
} from '../actions/giftAction';

function* fetchInfoUserGift(action) {
    try {
        const response = yield Api.getInfoGiftUser(action.payload);
        yield put(userGiftActionSuccessAction(response));
    } catch (error) {
        yield put(userGiftActionSuccessAction({ result: {} }));
    }
}

function* fetchListGift(action) {
    try {
        const response = yield Api.getListGift(action.payload);
        yield put(getListGiftSuccessAction(response));
    } catch (error) {
        yield put(getListGiftSuccessAction({ result: [] }));
    }
}

function* fetchListHistoryGift(action) {
    try {
        const response = yield Api.getHistoryGift(action.payload);
        yield put(getListHistorySuccessAction(response));
    } catch (error) {
        yield put(getListHistorySuccessAction({ result: [] }));
    }
}

export function* watchApiGift() {
    yield takeLatest(Types.USER_GIFT_ACTION, fetchInfoUserGift);
    yield takeLatest(Types.LIST_GIFT_ACTION, fetchListGift);
    yield takeLatest(Types.HISTORY_GIFT_ACTION, fetchListHistoryGift);
}