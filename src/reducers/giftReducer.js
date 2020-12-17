import * as Types from '../constants/type';

const initState = {
    isLoading: true,
    user: {},
    listGift: [],
    listHistory: []
};

export default function giftReducer(state = initState, action) {
    switch (action.type) {
        case Types.USER_GIFT_ACTION:
            return {
                ...state,
            };
        case Types.USER_GIFT_SUCCESS_ACTION:
            return {
                ...state,
                user: action.data.result
            }
        case Types.LIST_GIFT_ACTION:
            return {
                ...state,
                isLoading: true,
            }
        case Types.LIST_GIFT_ACTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listGift: action.data.result
            }
        case Types.HISTORY_GIFT_ACTION:
            return state;
        case Types.HISTORY_GIFT_ACTION_SUCCESS:
            return {
                ...state,
                listHistory: action.data.result
            }
        default:
            return state;
    }
}