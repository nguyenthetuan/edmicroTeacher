import { connect } from 'react-redux';
import MissionDetailScreen from '../../../components/Teacher/MissionDetail/MissionDetailScreen';
const mapStateToProps = state => {
    return {
        user: state.user,
        classList: state.mission.classList,
        missionDetail: state.mission.missionDetail,
        isLoading: state.mission.isLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MissionDetailScreen);
