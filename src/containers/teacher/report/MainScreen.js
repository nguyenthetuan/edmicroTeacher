import MainScreen from '../../../components/Teacher/Homework/MainScreen';
import { connect } from 'react-redux';
import { fetchReportAction } from '../../../actions/reportAction';
import { fetchHomeworkAction } from '../../../actions/homeworkTeacherAction';
import { updateExamListAction } from '../../../actions/paperAction';



const mapStateToProps = state => {
    return {
        data: state.report.data,
        loading: state.report.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchReportAction: (payload) => { dispatch(fetchReportAction(payload)) },
        fetchHomework: (payload) => { dispatch(fetchHomeworkAction(payload)) },
        needUpdate: (payload) => dispatch(updateExamListAction(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);