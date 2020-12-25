import * as Types from '../constants/type';

const initState = {
    isLoading: true,
    listClass: [],
    mission: [],
    assignment: []
};

export default function statisticReducer(state = initState, action) {
    switch (action.type) {
        case Types.STATISTIC_CLASS_ACTION:
            return {
                ...state,
                isLoading: true,
            };
        case Types.STATISTIC_CLASS_SUCCESS_ACTION:
            return {
                ...state,
                isLoading: false,
                listClass: action.data.data
            }
        case Types.STATISTIC_MISSION_ACTION:
            return {
                ...state,
                isLoading: true,
            }
        case Types.STATISTIC_MISSION_SUCCESS_ACTION:
            return {
                ...state,
                isLoading: false,
                mission: action.data.data
            }
        case Types.STATISTIC_ASSIGNMENT_ACTION:
            return {
                ...state,
                isLoading: true,
            }
        case Types.STATISTIC_ASSIGNMENT_SUCCESS_ACTION:
            return {
                ...state,
                isLoading: false,
                assignment: action.data.data
            }
        default:
            return state;
    }
}