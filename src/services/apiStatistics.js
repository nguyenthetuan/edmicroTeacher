import { API_BASE, getHeaders } from '../constants/setting';
import _ from 'lodash';
// const API_STATIS = 'https://api-dev.onluyen.vn/swagger/index.html?urls.primaryName=SCHOOL#/Statistic';

export const statisticClass = async ({ token, schoolYear }) => {
    // const schoolYear = new Date().getFullYear();
    const response = await fetch(`${API_BASE}school-online/statistic/class/${schoolYear}`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const statisticMission = async ({ token, enumType, schoolYear }) => {
    const response = await fetch(`${API_BASE}school-online/statistic/mission/${enumType}/${schoolYear}`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

export const statisticAssignment = async ({ token, enumType, schoolYear }) => {
    const response = await fetch(`${API_BASE}school-online/statistic/assignment/${enumType}/${schoolYear}`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}



