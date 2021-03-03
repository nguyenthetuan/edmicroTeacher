import MainScreen from '../../../components/Teacher/Homework/MainScreen';
import { connect } from 'react-redux';
import { fetchHomeworkAction } from '../../../actions/homeworkTeacherAction';
import { updateExamListAction } from '../../../actions/paperAction';


const mapStateToProps = state => {
  return {
    data: state.homeworkTeacher.data,
    loading: state.homeworkTeacher.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchHomework: (payload) => { dispatch(fetchHomeworkAction(payload)) },
    needUpdate: (payload) => dispatch(updateExamListAction(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);