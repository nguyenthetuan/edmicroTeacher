import { combineReducers } from 'redux';
import userReducer from './userReducer';
import formReducer from './formReducer';
import homeworkTeacherReducer from './homeworkTeacherReducer';
import PaperReducer from './paperReducer';
import ReportReucer from './reportReducer';

export default combineReducers({
  paper: PaperReducer,
  user: userReducer,
  form: formReducer,
  homeworkTeacher: homeworkTeacherReducer,
  report:ReportReucer,
});