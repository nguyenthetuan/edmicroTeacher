/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-24 02:49:14
 * @modify date 2018-04-24 02:49:14
 * @desc [description]
*/

import * as Types from '../constants/type';

export const fetchCategoryAction = (payload) => ({ type: Types.FETCH_CATEGORY_ACTION, payload });

export const fetchCategoryMoreAction = (payload) => ({ type: Types.FETCH_CATEGORY_MORE_ACTION, payload });

export const fetchCategorySuccessAction = (data) => ({ type: Types.FETCH_CATEGORY_SUCCESS_ACTION, data });

export const fetchCategoryFaildAction = (error) => ({ type: Types.FETCH_CATEGORY_FAILD_ACTION, error });

export const fetchCategoryLevelAction = (payload) => ({ type: Types.FETCH_CATEGORY_LEVEL_ACTION, payload });

export const fetchCategoryLevelSuccessAction = (data) => ({ type: Types.FETCH_CATEGORY_LEVEL_SUCCESS_ACTION, data });

export const fetchCategoryLevelFaildAction = (error) => ({ type: Types.FETCH_CATEGORY_LEVEL_FAILD_ACTION, error });

export const fetchCategoryDetailAction = (payload) => ({ type: Types.FETCH_CATEGORY_DETAIL_ACTION, payload });

export const fetchCategoryDetailSuccessAction = (data) => ({ type: Types.FETCH_CATEGORY_DETAIL_SUCCESS_ACTION, data });

export const fetchCategoryDetailFaildAction = (error) => ({ type: Types.FETCH_CATEGORY_DETAIL_FAILD_ACTION, error });

export const fetchCategoryTimelAction = (payload) => ({ type: Types.FETCH_CATEGORY_TIME_ACTION, payload });

export const fetchCategoryTimeSuccessAction = (data) => ({ type: Types.FETCH_CATEGORY_TIME_SUCCESS_ACTION, data });

export const fetchCategoryTimelFaildAction = (error) => ({ type: Types.FETCH_CATEGORY_TIME_FAILD_ACTION, error });