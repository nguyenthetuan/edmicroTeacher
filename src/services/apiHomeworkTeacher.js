import { API_BASE, getHeaders } from '../constants/setting';

const getGrade = async ({ token }) => {
    let response = await fetch(`${API_BASE}school-online/common/grade`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getSubject = async ({ token }) => {
    let response = await fetch(`${API_BASE}school-online/common/subject`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getHomework = async ({ token, body }) => {
    let response = await fetch(`${API_BASE}school-online/library/assignment/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(body)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getClass = async ({ token, classId }) => {
    let response = await fetch(`${API_BASE}school-online/assignment/assign/${classId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getDetailResult = async ({ token, assignId }) => {
    let response = await fetch(`${API_BASE}school-online/assignment/assign-detail/${assignId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const retryCheckPoint = async ({ token, assignId, studentId }) => {
    let response = await fetch(`${API_BASE}school-online/assignment/retry/check-point-teacher/
    ${assignId}/${studentId}`,
        {
            method: 'PUT',
            headers: getHeaders(token)
        });
    let responseJson = await response.json();
    return responseJson;
}

const rework = async ({ token, assignId, studentId }) => {
    let response = await fetch(`${API_BASE}school-online/assignment/delete/${assignId}/${studentId}`,
        {
            method: 'DELETE',
            headers: getHeaders(token)
        });
    let responseJson = await response.json();
    return responseJson;
}

module.exports = {
    getGrade,
    getSubject,
    getHomework,
    getClass,
    getDetailResult,
    retryCheckPoint,
    rework
};
