import { getHeaders, API_GIFT } from '../constants/setting';

export const getInfoGiftUser = async ({ token }) => {
    const response = await fetch(`${API_GIFT}campaign/user`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const getListGift = async ({ token, page }) => {
    const limit = (page + 1) * 10;
    const response = await fetch(`${API_GIFT}gift?limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const getHistoryGift = async ({ token, page }) => {
    const limit = (page + 1) * 10;
    const response = await fetch(`${API_GIFT}gift/history?limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const giftExchange = async ({ token, params }) => {
    const response = await fetch(`${API_GIFT}gift/exchange`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(params)
    });
    const responseJson = await response.json();
    return responseJson;
}