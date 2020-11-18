import * as Types from '../constants/type';

const initState = {
  isLoading: false,
  listSubject: [],
  listMission: [],
  listCateHirachy: [],
  listCateTest: [],
  listProblem: [],
  classList: [],
  missionDetail: []
};

export default function missionReducer(state = initState, action) {
  switch (action.type) {
    case Types.FETCH_COMMON_SUBJECT_MISSION:
      return {
        ...state,
        isLoading: true,
      };
    case Types.FETCH_COMMON_SUBJECT_MISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listSubject: action.data,
      };
    case Types.FETCH_LIST_MISSION:
      return {
        ...state,
        isLoading: true,
      };
    case Types.FETCH_LIST_MISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listMission: action.data,
      };
    case Types.FETCH_CATEGORY_HIRACHY_MISSION:
      return {
        ...state,
        isLoading: true,
      };
    case Types.FETCH_CATEGORY_HIRACHY_MISSION_SUCCESS:
      return {
        ...state,
        listCateHirachy: action.data,
        isLoading: false,
      };
    case Types.FETCH_CATEGORY_TEST_MISSION:
      return {
        ...state,
        isLoading: true,
      };
    case Types.FETCH_CATEGORY_TEST_MISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCateTest: action.data,
      };

    case Types.FETCH_LIST_PROBLEM_MISSION:
      return {
        ...state,
        isLoading: true,
      };
    case Types.FETCH_LIST_PROBLEM_MISSION_SUCCESS: {
      const { listCateHirachy } = state;
      let listCateHirachyTemp = [];
      if (listCateHirachy) {
        listCateHirachyTemp = listCateHirachy.map(item => {
          if (item.id == action.data.problemHierachyId) {
            return {
              ...item,
              data: action.data,
            };
          }
          return item;
        });
      }
      return {
        ...state,
        isLoading: false,
        listCateHirachy: listCateHirachyTemp,
        listProblem: action.data,
      };
    }

    case Types.FETCH_LIST_PROBLEM_TEST_MISSION:
      return {
        ...state,
        isLoading: true,
      };
    case Types.FETCH_LIST_PROBLEM_TEST_MISSION_SUCCESS: {
      const { listCateTest } = state;
      let listCateTestTemp = [];
      if (listCateTest) {
        if (action.data.data) {
          action.data.data = action.data.data.map(item => {
            return {
              ...item,
              id: action.data.id,
            };
          });
        }
        listCateTestTemp = listCateTest.map(item => {
          if (item.testCategoryId == action.data.id) {
            return {
              ...item,
              data: action.data.data,
              id: action.data.id,
            };
          }
          return item;
        });
      }
      return {
        ...state,
        isLoading: false,
        listCateTest: listCateTestTemp,
        listProblem: action.data,
      };
    }
    case Types.FETCH_ASSIGNMENT_BY_MISSION:
      return {
        ...state,
        isLoading: true
      }
    case Types.FETCH_ASSIGNMENT_BY_MISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        classList: action.data.classList,
        missionDetail: action.data.missionDetail
      }

    default:
      return state;
  }
}
