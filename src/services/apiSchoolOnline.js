import { API_BASE } from '../constants/setting';
import fetch from './fetchWithTimeout';

const getHeaders = (token) => (
    {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
);
// Lay Danh Sach Lop Hoc Cua Hoc Sinh
const getListClassUser = async (payload) => {
    const { indexPage, token } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/class/list/student/${indexPage}`, {
            method: 'GET',
            headers: getHeaders(token)
        })
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log('error', error);
        return error
    }
}

// Lay Danh sach bai tap duoc giao cua hoc sinh.
const getListHomeWork = async (payload) => {
    const { classId, status, indexPage, token } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/assign/class/${classId}/${status}/${indexPage}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}

// lay thong tin tin bai tap
const getInfoAssignment = async (payload) => {
    const { assignId, token } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/info/${assignId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        // resolve(responseJson);
        return responseJson;
    } catch (error) {
        // reject(error);
        return error;
    }
}

// lay noi dung chi tiết cua bai tap khi lam song.(status==3)
const getResultDetail = async (payload) => {
    const { assignId, token } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/detail/${assignId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}

// khoi tao bai thi
const getCreateAssignments = async (payload) => {
    const { assignId, token } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/start/${assignId}`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ assignId })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}
// lay tat ca danh sach tieu de cac cau hoi.
const getListQuestionAssign = async (payload) => {
    const { assignId, token } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/question/${assignId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}

// lay noi dung cua 1 cau hoi thong qua stepId lay duoc tu phia tren
const getContentQuestion = async (payload) => {
    const { token, assignId, stepId } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/question/${assignId}/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {

    }
}

// hoc sinh gui dap an len
const sendAnswer = async (payload) => {
    const { token, id, optionId, optionText, isSkip, studentDoRight } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/question/send-answer`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify({ id, optionId, optionText, isSkip })
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}

// ket thuc bai lam yeu cau cham bai.
const submitAssignment = async (payload) => {
    const { token, assignId } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/submit/${assignId}`, {
            method: 'PUT',
            headers: getHeaders(token),
        });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}

// lay danh sach lop hoc cua hoc sinh.
const getListClassOfStudent = async (payload) => {
    const { token, indexPage } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/class/list/student/${indexPage}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}

//lay thong tin lop hoc
const getInfoClassOfStudent = async (payload) => {
    const { token, classId } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/class/config/${classId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {

    }
}

// lay lo trinh ke hoach giang day.
const getStudyPlanning = async (payload) => {
    const { token, classId } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/class/config/study-planning/${classId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {

    }
}

// lay danh sach bai tap cua lop hoc
const getListAssignmentsOfClass = async payload => {
    const { token, classId, indexPage } = payload;
    try {
        let response = await fetch(`${API_BASE}school-online/assignment/assign/class/${classId}/${indexPage}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let reponseJson = await response.json();
        return reponseJson;
    } catch (error) {

    }
}

// lay danh sach cac cuoc thi trong nam.
const getListExampleInYear = async payload => {
    const { token, indexPage } = payload;
    let year = new Date().getFullYear();
    const url = `${API_BASE}school-online/exam/data/${year}/${indexPage}`;
    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {

    }
}

// lay danh sach cac bai kiem tra trong cuoc thi.
const getListExampleInExample = async payload => {
    const { token, examId } = payload;
    const url = `${API_BASE}school-online/exam/detail/${examId}`;
    let response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

// lay thong tin trang thai bai test hien tai.
const getInfoStateExamCurrent = async payload => {
    const { token, testId } = payload;
    let response = await fetch(`${API_BASE}school-online/exam/test/config/${testId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

// lay trang thai bai test hien tai.
const getInfoExamCurrent = async payload => {
    const { token, testId } = payload;
    let response = await fetch(`${API_BASE}school-online/exam/test/info/${testId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

// khoi tao bai kiem tra trong cuoc thi.
const getStartExamTest = async payload => {
    const { token, testId } = payload;
    let response = await fetch(`${API_BASE}school-online/exam/test/start/${testId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const sendAnswerCompetition = async (payload) => {
    try {
        const { token, dataSendAnswer } = payload;
        let response = await fetch(API_BASE + 'school-online/exam/test/receive/answer', {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(dataSendAnswer)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log("sendAnswerCompetition -> error", error);
        return error;
    }
}

// cham lai bai thi cho hoc sinh
const retryCheckPointCompetition = async (payload) => {
    try {
        const { token, assignId } = payload;
        let response = await fetch(`${API_BASE}school-online/assignment/retry/check-point/${assignId}`, {
            method: 'PUT',
            headers: getHeaders(token),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}


// lay thong tin bai thi thu.
const getInfoMockExamCurrent = async payload => {
    const { token, testId } = payload;
    let response = await fetch(`${API_BASE}exam/test/info/${testId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

// lay thong tin trang thai bai thi thu hien tai.
const getInfoStateMockExamCurrent = async payload => {
    const { token, testId } = payload;
    let response = await fetch(`${API_BASE}exam/test/config/${testId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

// khoi tao bai thi thu
const getCreateMockExam = async payload => {
    const { token, testId } = payload;
    let response = await fetch(`${API_BASE}exam/test/start/${testId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

// nop bai thi thu
const sendAnswerMockExam = async (payload) => {
    try {
        const { token, dataSendAnswer } = payload;
        let response = await fetch(API_BASE + 'exam/test/receive/answer', {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(dataSendAnswer)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log("sendAnswerCompetition -> error", error);
        return error;
    }
}

// lay thoi gian hien tai.
const getTimeCurrentMockExam = async payload => {
    const { token, format } = payload;
    let response = await fetch(`${API_BASE}time/timestamp/${format}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

module.exports = {
    getListClassUser,
    getListHomeWork,
    getInfoAssignment,
    getResultDetail,
    getCreateAssignments,
    getListQuestionAssign,
    getContentQuestion,
    sendAnswer,
    submitAssignment,
    getListClassOfStudent,
    getInfoClassOfStudent,
    getStudyPlanning,
    getListAssignmentsOfClass,
    getListExampleInYear,
    getListExampleInExample,
    getInfoStateExamCurrent,
    getInfoExamCurrent,
    getStartExamTest,
    sendAnswerCompetition,
    retryCheckPointCompetition,
    getInfoMockExamCurrent,
    getInfoStateMockExamCurrent,
    getCreateMockExam,
    getTimeCurrentMockExam,
    sendAnswerMockExam
}