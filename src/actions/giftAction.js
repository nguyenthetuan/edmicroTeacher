import * as Types from '../constants/type';

export const userGiftAction = (payload) => ({ type: Types.USER_GIFT_ACTION, payload });

export const userGiftActionSuccessAction = (data) => ({ type: Types.USER_GIFT_SUCCESS_ACTION, data });

export const userGiftActionFaildAction = (error) => ({ type: Types.USER_GIFT_FAILD_ACTION, error });

export const getListGiftAction = (payload) => ({ type: Types.LIST_GIFT_ACTION, payload });

export const getListGiftSuccessAction = (data) => ({ type: Types.LIST_GIFT_ACTION_SUCCESS, data });

export const getListHistoryAction = (payload) => ({ type: Types.HISTORY_GIFT_ACTION, payload });

export const getListHistorySuccessAction = (data) => ({ type: Types.HISTORY_GIFT_ACTION_SUCCESS, data });