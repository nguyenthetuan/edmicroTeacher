/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-06-01 02:40:12
 * @modify date 2018-06-01 02:40:12
 * @desc [description]
*/

import { API_BASE, API_BASE_OAUTH, getHeaders } from '../constants/setting';
import fetch from './fetchWithTimeout';

//Lấy danh sách câu hỏi của bài kiểm tra
const getTestQuestion = async ({ token, testId }) => {
    try {
        let response = await fetch(`${API_BASE}tests/questions/${testId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//Khơi tạo bài kiểm tra mới
const getTestStartByTestId = async ({ token, testId }) => {
    try {
        let response = await fetch(`${API_BASE}tests/start/${testId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//Lấy Nội dung câu hỏi bài kiểm tra
const getTestQuestionDetail = async ({ token, testId, stepId }) => {
    try {
        // alert(`${API_BASE}tests/questions/detail/${testId}/${stepId}`);
        let response = await fetch(`${API_BASE}tests/questions/detail/${testId}/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const testSendAnswer = async ({ token, stepId, testId, dataOptionId, dataOptionText, textAnswer, isSkip }) => {
    try {
        let response = await fetch(`${API_BASE}tests/sendanswer`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ stepId, dataOptionId, dataOptionText, isSkip })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

// Dánh dấu câu xem lại trong bài kiểm tra (làm sau)
const getReviewTestLater = async ({ token, stepId }) => {
    try {
        let response = await fetch(`${API_BASE}tests/reviewlater/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const testDoneByTestId = async ({ token, testId }) => {
    try {
        let response = await fetch(`${API_BASE}tests/done/${testId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const testPause = async ({ token, testId }) => {
    try {
        let response = await fetch(`${API_BASE}tests/pause/${testId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

module.exports = {
    getReviewTestLater,
    getTestQuestion,
    getTestStartByTestId,
    getTestQuestionDetail,
    testDoneByTestId,
    testPause,
    testSendAnswer
}