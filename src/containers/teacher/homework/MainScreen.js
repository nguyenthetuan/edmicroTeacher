import MainScreen from '../../../components/Teacher/Homework/MainScreen';
import { connect } from 'react-redux';
import { fetchHomeworkAction } from '../../../actions/homeworkTeacherAction';

const mapStateToProps = state => {
  return {
    data: state.homeworkTeacher.data,
    loading: state.homeworkTeacher.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchHomework: (payload) => { dispatch(fetchHomeworkAction(payload)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);