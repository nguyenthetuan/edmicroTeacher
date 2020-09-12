/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-20 03:35:06
 * @modify date 2018-04-20 03:35:06
 * @desc [description]
*/

import * as Types from '../constants/type';

export const fetchListBookmarHiearyAction = (payload) => ({ type: Types.FETCH_LIST_BOOKMARK_HIEARY_ACTION, payload });

export const fetchListBookmarHiearyMoreAction = (payload) => ({ type: Types.FETCH_LIST_BOOKMARK_MORE_HIEARY_ACTION, payload });

export const fetchListBookmarSuccessAction = (data) => ({ type: Types.FETCH_LIST_BOOKMARK_SUCCESS_ACTION, data });

export const fetchListBookmarFaildAction = (error) => ({ type: Types.FETCH_LIST_BOOKMARK_FAILD_ACTION, error });


