import StudentDetail from '../../../components/Teacher/Homework/StudentDetail';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        data: state.report.student,
        loading: state.report.loading,
        assignId: state.report.assignId
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail);