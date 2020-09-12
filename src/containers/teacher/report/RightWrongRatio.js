import RightWrongRatio from '../../../components/Teacher/Homework/RightWrongRatio';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        data: state.report.questionResult,
        loading: state.report.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightWrongRatio);