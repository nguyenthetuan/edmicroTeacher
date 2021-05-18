import * as Types from '../constants/type';

const initState = {
    isLoading: true,
    listClass: [],
    mission: [],
    assignment: [],
    classArray: [],
    diaryActive: [],
    countdiaryActive: []
};

export default function statisticReducer(state = initState, action) {
    switch (action.type) {
        case Types.STATISTIC_CLASS_ACTION:
            return {
                ...state,
                isLoading: true,
            };
        case Types.STATISTIC_CLASS_SUCCESS_ACTION:
            const listClass = action.data.data;
            return {
                ...state,
                isLoading: false,
                listClass: listClass,
                classArray: listClass.data ? listClass.data : []
            }
        case Types.STATISTIC_CLASS_FAILD_ACTION:
            return {
                ...state,
                isLoading: false,
                listClass: [],
                classArray: []
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
        case Types.STATISTIC_MISSION_FAILD_ACTION:
            return {
                ...state,
                isLoading: false,
                mission: []
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
        case Types.STATISTIC_ASSIGNMENT_FAILD_ACTION:
            return {
                ...state,
                isLoading: false,
                assignment: []
            }
        case Types.DIARY_ACTIVE_ACTION:
            return {
                ...state,
                isLoading: true,
            }
        case Types.DIARY_ACTIVE_SUCCESS_ACTION:
            return {
                ...state,
                isLoading: false,
                diaryActive: action.data.data,
                countdiaryActive: action.data.data.data,
            }
        case Types.DIARY_ACTIVE_FAILD_ACTION:
            return {
                ...state,
                isLoading: false,
                diaryActive: []
            }
        default:
            return state;
    }
}