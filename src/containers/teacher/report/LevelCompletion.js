import LevelCompletion from '../../../components/Teacher/Homework/LevelCompletion';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        data: state.report.data,
        loading: state.report.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LevelCompletion);