import { combineReducers } from 'redux';
import userReducer from './userReducer';
import homeworkTeacherReducer from './homeworkTeacherReducer';
import PaperReducer from './paperReducer';
import ReportReucer from './reportReducer';
import missionReducer from './missionReducer';
import giftReducer from './giftReducer';
import statisticReducer from './statisticReducer';
import * as Types from '../constants/type';

const appReducer = combineReducers({
  paper: PaperReducer,
  user: userReducer,
  homeworkTeacher: homeworkTeacherReducer,
  report: ReportReucer,
  mission: missionReducer,
  gift: giftReducer,
  statistic: statisticReducer,
});

const rootReducer = (state, action) => {
  if (action.type === Types.RESET_APP_STATE_ACTION) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;