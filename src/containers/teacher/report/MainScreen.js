import MainScreen from '../../../components/Teacher/Homework/MainScreen';
import { connect } from 'react-redux';
import { fetchReportAction } from '../../../actions/reportAction';

const mapStateToProps = state => {
    return {
        data: state.report.data,
        loading:state.report.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
      fetchReportAction: (payload) => { dispatch(fetchReportAction(payload)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);