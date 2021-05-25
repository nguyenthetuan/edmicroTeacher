import { API_BASE, getHeaders } from '../constants/setting';
import _ from 'lodash';
import fetch from './fetchWithTimeout';
// const API_STATIS = 'https://api-dev.onluyen.vn/swagger/index.html?urls.primaryName=SCHOOL#/Statistic';

export const statisticClass = async ({ token }) => {
    // console.log(`${API_BASE}school-online/statistic/class/${schoolYear}`);
    const schoolYear = new Date().getFullYear();
    const response = await fetch(`${API_BASE}school-online/statistic/class/2020`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const statisticMission = async ({ token, enumType }) => {
    const schoolYear = new Date().getFullYear();
    const response = await fetch(`${API_BASE}school-online/statistic/mission/${enumType}/${schoolYear}`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const statisticAssignment = async ({ token, enumType }) => {
    const schoolYear = new Date().getFullYear();
    const response = await fetch(`${API_BASE}school-online/statistic/assignment/${enumType}/${schoolYear}`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

//  diaryActive - nhật ký hoạt động 
export const diaryActive = async ({ token, enumType }) => {
    const schoolYear = new Date().getFullYear();
    const response = await fetch(`${API_BASE}school-online/statistic/activity/${enumType}/${schoolYear}`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}
export const getLaboratory = async ({ token, }) => {
    const response = await fetch(`https://api-elb.onluyen.vn/api/laboratory/find?
    `, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}



