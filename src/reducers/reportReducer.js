import * as Types from '../constants/type';

const initState = {
    loading: true,
    data: null,
    student: [],
    questionResult: [],
    assignId: null
};

export default function homeworkTeacherReducer(state = initState, action) {
    switch (action.type) {
        case Types.FETCH_DATA_REPORT_ACTION:
            return {
                ...state,
                loading: true,
                assignId: null
            }
        case Types.FETCH_DATA_REPORT_SUCCESS_ACTION:
            const data = action.data.response;
            return {
                assignId: action.data.assignId,
                loading: false,
                data: data,
                student: data && data.data ? data.data.students : [],
                questionResult: data && data.data ? data.data.questionResult : []
            };
        case Types.FETCH_DATA_REPORT_FAILED_ACTION:
            return {
                ...initState,
                loading: false
            };
        default:
            return state;
    }
}
