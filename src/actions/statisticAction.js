import * as Types from '../constants/type';

export const statisticClassAction = (payload) => ({ type: Types.STATISTIC_CLASS_ACTION, payload });
export const statisticClassSuccessAction = (data) => ({ type: Types.STATISTIC_CLASS_SUCCESS_ACTION, data });
export const statisticClassFaildAction = (error) => ({ type: Types.STATISTIC_CLASS_FAILD_ACTION, error });

export const statisticMissionAction = (payload) => ({ type: Types.STATISTIC_MISSION_ACTION, payload });
export const statisticMissionSuccessAction = (data) => ({ type: Types.STATISTIC_MISSION_SUCCESS_ACTION, data });
export const statisticMissionFaildAction = (error) => ({ type: Types.STATISTIC_MISSION_FAILD_ACTION, error });

export const statisticAssignmentAction = (payload) => ({ type: Types.STATISTIC_ASSIGNMENT_ACTION, payload });
export const statisticAssignmentSuccessAction = (data) => ({ type: Types.STATISTIC_ASSIGNMENT_SUCCESS_ACTION, data });
export const statisticAssignmentFaildAction = (error) => ({ type: Types.STATISTIC_ASSIGNMENT_FAILD_ACTION, error });

export const diaryActiveAction = (payload) => ({ type: Types.DIARY_ACTIVE_ACTION, payload });
export const diaryActiveSuccessAction = (data) => ({ type: Types.DIARY_ACTIVE_SUCCESS_ACTION, data });
export const diaryActiveFaildAction = (error) => ({ type: Types.DIARY_ACTIVE_FAILD_ACTION, error });
 

