import { combineReducers } from 'redux';
import userReducer from './userReducer';
import homeworkTeacherReducer from './homeworkTeacherReducer';
import PaperReducer from './paperReducer';
import ReportReucer from './reportReducer';

export default combineReducers({
  paper: PaperReducer,
  user: userReducer,
  homeworkTeacher: homeworkTeacherReducer,
  report:ReportReucer,
});