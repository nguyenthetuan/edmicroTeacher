import StudentDetail from '../../../components/Teacher/Homework/StudentDetail';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        data: state.homeworkTeacher.student,
        loading: state.homeworkTeacher.loading,
        assignId: state.homeworkTeacher.assignId
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail);