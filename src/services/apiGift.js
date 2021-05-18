import { number } from 'yup';
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
    // const limit = (page + 1) * 10;
    // const limitSize = (pageSize + 1) * 10;
    // const response = await fetch(`${API_GIFT}gift?limit=${limit}`, {
    // const response = await fetch(`https://a8p61ebql5.execute-api.ap-southeast-1.amazonaws.com/dev/gift?schoolId=${schoolId}&limit=${limit}&limitSize=${limitSize}`, {
    
        // https://serverless.onluyen.vn
        // https://serverless.onluyen.vn/api-reward/user/showgifts
    const response = await fetch(`https://a8p61ebql5.execute-api.ap-southeast-1.amazonaws.com/dev/gift?schoolId=50227&page=1&pageSize=12`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const getHistoryGift = async ({ token, page }) => {
    // const limit = (page + 1) * 10;
    // const response = await fetch(`${API_GIFT}dev/gift/history?limit=${limit}`, {
    const response = await fetch(`https://a8p61ebql5.execute-api.ap-southeast-1.amazonaws.com/dev/gift/history?limit=12`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const giftExchange = async ({ token, params }) => {
    try {
        const response = await fetch('https://a8p61ebql5.execute-api.ap-southeast-1.amazonaws.com/dev/gift/exchange', {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(params)
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
    }

}

export const landingCampaign = async ({ token, params }) => {
    try {
        const response = await fetch('https://a8p61ebql5.execute-api.ap-southeast-1.amazonaws.com/dev/campaign/campaignuser', {
            method: 'GET',
            headers: getHeaders(token)
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
    }
}
export const topCampaign = async ({ token }) => {
    try {
        const response = await fetch('https://a8p61ebql5.execute-api.ap-southeast-1.amazonaws.com/dev/campaign/topcampaign', {
            method: 'POST',
            headers: getHeaders(token)
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
    }
}
