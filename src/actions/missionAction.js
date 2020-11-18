import * as Types from '../constants/type';

export const fetchCommonSubjectMission = payload => ({
  type: Types.FETCH_COMMON_SUBJECT_MISSION,
  payload,
});

export const fetchCommonSubjectMissionSuccess = data => ({
  type: Types.FETCH_COMMON_SUBJECT_MISSION_SUCCESS,
  data,
});

export const fetchListMission = payload => ({
  type: Types.FETCH_LIST_MISSION,
  payload,
});

export const fetchListMissionSuccess = data => ({
  type: Types.FETCH_LIST_MISSION_SUCCESS,
  data,
});

export const fetchCategoryHirachyMission = payload => ({
  type: Types.FETCH_CATEGORY_HIRACHY_MISSION,
  payload,
});

export const fetchCategoryHirachyMissionSuccess = data => ({
  type: Types.FETCH_CATEGORY_HIRACHY_MISSION_SUCCESS,
  data,
});

export const fetchCategoryTestMission = payload => ({
  type: Types.FETCH_CATEGORY_TEST_MISSION,
  payload,
});

export const fetchCategoryTestMissionSuccess = data => ({
  type: Types.FETCH_CATEGORY_TEST_MISSION_SUCCESS,
  data,
});

export const fetchListProblemMission = payload => ({
  type: Types.FETCH_LIST_PROBLEM_MISSION,
  payload,
});

export const fetchListProblemMissionSuccess = data => ({
  type: Types.FETCH_LIST_PROBLEM_MISSION_SUCCESS,
  data,
});

export const fetchListProblemTestMiss = payload => ({
  type: Types.FETCH_LIST_PROBLEM_TEST_MISSION,
  payload,
});

export const fetchListProblemTestMissSuccess = data => ({
  type: Types.FETCH_LIST_PROBLEM_TEST_MISSION_SUCCESS,
  data,
});

export const fetchAssignmentByMission = payload => ({
  type: Types.FETCH_ASSIGNMENT_BY_MISSION,
  payload
})

export const fetchAssignmentByMissionSuccess = data => ({
  type: Types.FETCH_ASSIGNMENT_BY_MISSION_SUCCESS,
  data
});

module.exports = {
  fetchCommonSubjectMission,
  fetchCommonSubjectMissionSuccess,
  fetchListMission,
  fetchListMissionSuccess,
  fetchCategoryHirachyMission,
  fetchCategoryHirachyMissionSuccess,
  fetchCategoryTestMission,
  fetchCategoryTestMissionSuccess,
  fetchListProblemMission,
  fetchListProblemMissionSuccess,
  fetchListProblemTestMiss,
  fetchListProblemTestMissSuccess,
  fetchAssignmentByMission,
  fetchAssignmentByMissionSuccess
};
