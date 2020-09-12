import LevelCompletion from '../../../components/Teacher/Homework/LevelCompletion';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        data: state.homeworkTeacher.data,
        loading: state.homeworkTeacher.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LevelCompletion);