/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-05-07 11:28:56
 * @modify date 2018-05-07 11:28:56
 * @desc [description]
*/

import * as Types from '../constants/type';

export const fetchPracticeAction = (payload) => ({ type: Types.FETCH_DATA_PRACTICE_ACTION, payload })

export const fetchPracticeSuccessAction = (data) => ({ type: Types.FETCH_DATA_PRACTICE_SUCCESS_ACTION, data });

export const fetchPracticeFaildAction = (error) => ({ type: Types.FETCH_DATA_PRACTICE_FAILD_ACTION, error });

export const chonseAnswerAction = (payload) => ({ type: Types.CHONSE_ANSWER_SELECT_ACTION, payload });

export const fetchRequestSendAnswerAction = (payload) => ({ type: Types.FETCH_ANSWER_QUESTION_ACTION, payload });

export const fetchRequestSendAnswerSuccessAction = (data) => ({ type: Types.FETCH_ANSWER_QUESTION_SUCCESS_ACTION, data });

export const fetchRequestSendAnswerFaildAction = (error) => ({ type: Types.FETCH_ANSWER_QUESTION_FAILD_ACTION, error })
