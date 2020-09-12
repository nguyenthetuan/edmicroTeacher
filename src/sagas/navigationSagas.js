/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 11:31:09
 * @modify date 2018-04-17 11:31:09
 * @desc [description]
*/

import { put, takeLatest } from 'redux-saga/effects';
import { NavigationActions } from 'react-navigation';
import * as Types from '../constants/type';

function* navigationActions(action) {
  switch (action.type) {
    case Types.NAVIGATION_NAVIGATE_ROOT_ACTION:
      yield put(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'App', params: action.payload })],
      }));
      break;
    case Types.NAVIGATION_NAVIGATE_GO_AUTH_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'Auth' }));
      break;
    case Types.NAVIGATION_NAVIGATE_SUBJECT_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'Subject', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_GRADE_CHANGE_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'ChangeGrade', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_LEARN_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'Learn', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_VIDEO_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'Video', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_PRACTICE_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'Practice' }));
      break;
    case Types.NAVIGATION_NAVIGATE_CATEGORY_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'Cate', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_BOOKMARK_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'BookMark', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_BOOKMARK_DETAIL_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'BookMarkDetail', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_CATEGORY_DETAIL_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'CateDetail', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_CATE_LEVEL_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'CateLevel', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_CATE_TIME_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'CateTime', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_TARGET_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'Target', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_SLA_INFO_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'TargetDetail', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_PAYMENT_UPGRADE:
      yield put(NavigationActions.navigate({ routeName: 'PayUpgrade' }));
      break;
    case Types.NAVIGATION_NAVIGATE_CHAPTER_SLA:
      yield put(NavigationActions.navigate({ routeName: 'ChapterSla', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_GO_HOME_WORK_ACTION:
      yield put(NavigationActions.navigate({ routeName: 'ListHomeWork', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_GOBACK_ACTION:
      yield put(NavigationActions.back());
      break;
    case Types.NAVIGATION_NAVIGATE_GO_SCHOOL_RESULTAB:
      yield put(NavigationActions.navigate({ routeName: 'SchoolTabResult', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_GO_CLASS_STUDENT_TAB:
      yield put(NavigationActions.navigate({ routeName: 'ClassTabScreen', params: action.payload }));
      break;
    case Types.NAVIGATION_NAVIGATE_GO_TO_HOMEWORKDRAWER:
      yield put(NavigationActions.navigate({ routeName: 'HomeWorkDrawer', params: action.payload }));
      break;
    case Types.NVAIGATION_NAVIGATE_GO_TO_LIST_EXAM:
      yield put(NavigationActions.navigate({ routeName: 'CompetitionStepScreen', params: action.payload }));
      break;
    case Types.NVAIGATION_NAVIGATE_GO_TO_UPGRADE_STEP:
      yield put(NavigationActions.navigate({ routeName: 'UpgradeStep', params: action.payload }));
      break;
    default:
      yield put(NavigationActions.back());
      break;
  }
}

export function* watchNavigationRoute() {
  yield takeLatest(Types.NAVIGATION_NAVIGATE_ROOT_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_SUBJECT_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_GRADE_CHANGE_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_LEARN_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_PRACTICE_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_CATEGORY_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_BOOKMARK_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_BOOKMARK_DETAIL_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_CATEGORY_DETAIL_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_CATE_LEVEL_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_CATE_TIME_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_GOBACK_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_TARGET_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_SLA_INFO_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_VIDEO_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_PAYMENT_UPGRADE, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_CHAPTER_SLA, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_GO_HOME_WORK_ACTION, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_GO_SCHOOL_RESULTAB, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_GO_CLASS_STUDENT_TAB, navigationActions);
  yield takeLatest(Types.NAVIGATION_NAVIGATE_GO_TO_HOMEWORKDRAWER, navigationActions);
  yield takeLatest(Types.NVAIGATION_NAVIGATE_GO_TO_LIST_EXAM, navigationActions);
  yield takeLatest(Types.NVAIGATION_NAVIGATE_GO_TO_UPGRADE_STEP, navigationActions);

}
