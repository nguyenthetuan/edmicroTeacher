/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 11:39:17
 * @modify date 2018-04-17 11:39:17
 * @desc [description]
*/

import * as Types from '../constants/type';

export const navigationGoBackAction = () => ({ type: Types.NAVIGATION_NAVIGATE_GOBACK_ACTION });

export const navigationGoAuthAction = () => ({ type: Types.NAVIGATION_NAVIGATE_GO_AUTH_ACTION });

export const navigationRootAppAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_ROOT_ACTION, payload });

export const navigationSubjectAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_SUBJECT_ACTION, payload });

export const navigationClassChangeAction = () => ({ type: Types.NAVIGATION_NAVIGATE_GRADE_CHANGE_ACTION });

export const navigationLearnAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_LEARN_ACTION, payload });

export const navigationPracticeAction = () => ({ type: Types.NAVIGATION_NAVIGATE_PRACTICE_ACTION });

export const navigationCategoryAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_CATEGORY_ACTION, payload });

export const navigationBookmarkDetailAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_BOOKMARK_DETAIL_ACTION, payload });

export const navigationCategoryDetailAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_CATEGORY_DETAIL_ACTION, payload });

export const navigationVideoAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_VIDEO_ACTION, payload });

export const navigationTargetAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_TARGET_ACTION, payload });

export const navigationPaymentUpgradeAction = () => ({ type: Types.NAVIGATION_NAVIGATE_PAYMENT_UPGRADE });

export const navigationChapterSlaAction = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_CHAPTER_SLA, payload });

export const navigationListHomeWork = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_GO_HOME_WORK_ACTION, payload });

export const navigationSchoolResultTab = (payload) => ({ type: Types.NAVIGATION_NAVIGATE_GO_SCHOOL_RESULTAB, payload });

export const navigationClassStudentTab = payload => ({ type: Types.NAVIGATION_NAVIGATE_GO_CLASS_STUDENT_TAB, payload });

export const navigationToHomeWorkDrawer = payload => ({ type: Types.NAVIGATION_NAVIGATE_GO_TO_HOMEWORKDRAWER, payload });

export const navigationToListExam = payload => ({ type: Types.NVAIGATION_NAVIGATE_GO_TO_LIST_EXAM, payload });

export const navigationToUpgradeStep = payload => ({ type: Types.NVAIGATION_NAVIGATE_GO_TO_UPGRADE_STEP, payload });