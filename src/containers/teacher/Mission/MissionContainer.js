import { connect } from 'react-redux';
import MissionScreen from '../../../components/Teacher/Mission/MissionScreen';
import {
  fetchListMission,
  fetchCommonSubjectMission,
  fetchAssignmentByMission
} from '../../../actions/missionAction';
const mapStateToProps = state => {
  return {
    user: state.user,
    listMission: state.mission.listMission,
    isLoadingMission: state.mission.isLoadingMission,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCommonSubjectMission: payload =>
      dispatch(fetchCommonSubjectMission(payload)),
    getListMission: payload => dispatch(fetchListMission(payload)),
    getAssignmentByMission: payload => dispatch(fetchAssignmentByMission(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MissionScreen);
