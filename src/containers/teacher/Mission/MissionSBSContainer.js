import { connect } from 'react-redux';
import MissionStepByStep from '../../../components/Teacher/Mission/MissionStepByStep';
import {
  fetchCategoryHirachyMission,
  fetchCategoryTestMission,
  fetchListProblemMission,
  fetchListProblemTestMiss,
  fetchListMission
} from '../../../actions/missionAction';

const mapStateToProps = state => {
  return {
    user: state.user,
    listSubject: state.mission.listSubject,
    listCateHirachy: state.mission.listCateHirachy,
    listCateTest: state.mission.listCateTest,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCategoryHirachyMission: payload =>
      dispatch(fetchCategoryHirachyMission(payload)),
    getCategoryTest: payload => dispatch(fetchCategoryTestMission(payload)),
    getListProblemMission: payload =>
      dispatch(fetchListProblemMission(payload)),
    getListProblemTestMiss: payload =>
      dispatch(fetchListProblemTestMiss(payload)),
    getListMission: payload => dispatch(fetchListMission(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MissionStepByStep);
