import { combineReducers } from 'redux';
import userReducer from './userReducer';
import homeworkTeacherReducer from './homeworkTeacherReducer';
import PaperReducer from './paperReducer';
import ReportReucer from './reportReducer';
import missionReducer from './missionReducer';
import giftReducer from './giftReducer';
export default combineReducers({
  paper: PaperReducer,
  user: userReducer,
  homeworkTeacher: homeworkTeacherReducer,
  report: ReportReucer,
  mission: missionReducer,
  gift: giftReducer,
});
