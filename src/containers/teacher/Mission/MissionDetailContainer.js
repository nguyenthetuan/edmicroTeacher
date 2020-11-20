import { connect } from 'react-redux';
import MissionDetailScreen from '../../../components/Teacher/MissionDetail/MissionDetailScreen';
import { fetchListMission, fetchAssignmentByMission } from '../../../actions/missionAction';
const mapStateToProps = state => {
    return {
        user: state.user,
        classList: state.mission.classList,
        missionDetail: state.mission.missionDetail,
        isLoading: state.mission.isLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getListMission: payload => dispatch(fetchListMission(payload)),
        getAssignmentByMission: payload => dispatch(fetchAssignmentByMission(payload))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MissionDetailScreen);
