import * as Types from '../constants/type';

const initState = {
    isLoading: true,
    user: {},
    listGift: [],
    listHistory: [],
    listItems: []
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
        case Types.USER_GIFT_FAILD_ACTION:
            return {
                ...state,
                isLoading: false,
                user: {}
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
                listGift: action.data.result,
                listItems: action.data.result?.items,
            }
        case Types.LIST_GIFT_ACTION_FAILD:
            return {
                ...state,
                isLoading: false,
                listGift: [],
                listItems: []
            }
        case Types.HISTORY_GIFT_ACTION:
            return {
                ...state,
                isLoading: true
            }
        case Types.HISTORY_GIFT_ACTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listHistory: action.data.result
            }
        case Types.HISTORY_GIFT_ACTION_FAILD:
            return {
                ...state,
                isLoading: false,
                listHistory: []
            }
        default:
            return state;
    }
}