import { API_BASE, getHeaders } from '../constants/setting';
import _ from 'lodash';
const API_GIFT = 'https://a8p61ebql5.execute-api.ap-southeast-1.amazonaws.com/dev/';

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