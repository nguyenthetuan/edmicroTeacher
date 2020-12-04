import * as Types from '../constants/type';

const initState = {
    listGrade: [],
    listSubject: [],
    assignId: null,
    updateListExam: false
};

export default function paperReducer(state = initState, action) {
    switch (action.type) {
        case Types.SAVE_LIST_GRADES:
            return {
                ...state,
                listGrade: action.payload,
            }
        case Types.SAVE_LIST_SUBJECT:
            return {
                ...state,
                listSubject: action.payload
            }
        case Types.FETCH_ASSIGNMENT_DETAIL_ACTION:
            return {
                ...state,
                assignId: null
            }
        case Types.FETCH_ASSIGNMENT_DETAIL_SUCCESS_ACTION:
            return {
                ...state,
                assignId: action.payload.assignId
            }
        case Types.FETCH_ASSIGNMENT_DETAIL_FAILED_ACTION:
            return {
                ...state,
                assignId: null
            }
        case Types.NEED_UPDATE_EXAM_LIST_ACTION:
            return {
                ...state,
                updateListExam: state.updateListExam
            }
        default:
            return state;
    }
} 