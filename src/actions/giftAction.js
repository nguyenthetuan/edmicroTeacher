import * as Types from '../constants/type';

export const userGiftAction = (payload) => ({ type: Types.USER_GIFT_ACTION, payload });
export const userGiftActionSuccessAction = (data) => ({ type: Types.USER_GIFT_SUCCESS_ACTION, data });
export const userGiftActionFaildAction = (error) => ({ type: Types.USER_GIFT_FAILD_ACTION, error });

export const getListGiftAction = (payload) => ({ type: Types.LIST_GIFT_ACTION, payload });
export const getListGiftSuccessAction = (data) => ({ type: Types.LIST_GIFT_ACTION_SUCCESS, data });
export const getListGiftFaildAction = (error) => ({ type: Types.LIST_GIFT_ACTION_FAILD, error });

export const getListHistoryAction = (payload) => ({ type: Types.HISTORY_GIFT_ACTION, payload });
export const getListHistorySuccessAction = (data) => ({ type: Types.HISTORY_GIFT_ACTION_SUCCESS, data });
export const getListHistoryFaildAction = (error) => ({ type: Types.HISTORY_GIFT_ACTION_FAILD, error });


export const getLandingCampaignAction = (payload) => ({ type: Types.LANDING_PAGE_ACTION, payload });
export const getLandingCampaignSuccessAction = (data) => ({ type: Types.LANDING_PAGE_SUCCESS_ACTION, data });
export const getLandingCampaignFaildAction = (error) => ({ type: Types.LANDING_PAGE_FAILD_ACTION, error });

export const topCampaignAction = (payload) => ({ type: Types.TOP_CAMPAIGN_ACTION, payload });
export const topCampaignSuccessAction = (data) => ({ type: Types.TOP_CAMPAIGN_SUCCESS_ACTION, data });
export const topCampaignFaildAction = (error) => ({ type: Types.TOP_CAMPAIGN_FAILD_ACTION, error });

