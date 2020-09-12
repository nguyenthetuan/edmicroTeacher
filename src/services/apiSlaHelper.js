import { API_BASE, getHeaders } from '../constants/setting';

const getConfigSlaPractice = async ({ token, GradeId, subjectId }) => {
    let response = await fetch(`${API_BASE}v2/sla/configSla/${subjectId}/${GradeId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getDetailConfigPractice = async ({ token, codeConfigSLA }) => {
    let response = await fetch(`${API_BASE}v2/sla/detail/${codeConfigSLA}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getInfoSla = async ({ token, codeConfigSLA }) => {
    let response = await fetch(`${API_BASE}v2/sla/infoSla/${codeConfigSLA}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getTestDoneSla = async ({ token, codeStudentSLA, codeStudentTest }) => {
    let response = await fetch(`${API_BASE}v2/sla/test/done/${codeStudentSLA}/${codeStudentTest}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getPracticesQuestionDetail = async ({ token, codeStudentSLA, codeStudentPractices, questionIdStudentPractices }) => {
    try {
        let response = await fetch(`${API_BASE}v2/sla/practices/question/detail/${codeStudentSLA}/${codeStudentPractices}/${questionIdStudentPractices}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (err) {
        return "";
    }
}

const getQuestionAnswerNewV2 = async ({ token, dataOptionId, codeStudentPractices, questionIdStudentPractices, studentDoRight, isSkip, textAnswer, codeStudentSLA }) => {
    let response = await fetch(`${API_BASE}v2/sla/practices/question/sendanswer/${codeStudentSLA}/${codeStudentPractices}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ dataOptionId, textAnswer, questionIdStudentPractices, codeStudentPractices, isSkip, studentDoRight })
    });
    let responseJson = await response.json();
    return responseJson;
};

const getPracticeDetail = async ({ token, codeStudentPractices }) => {
    try {
        let response = await fetch(`${API_BASE}v2/sla/practices/detail/${codeStudentPractices}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const getSlaTestInfo = async ({ token, codeStudentSLA, codeConfigTest }) => {
    let response = await fetch(`${API_BASE}v2/sla/test/info/${codeStudentSLA}/${codeConfigTest}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getPracticeSlaStart = async ({ token, codeStudentSLA, codeStudentTest, codeQuestionSetRule, codeConfigPractice }) => {
    let response = await fetch(`${API_BASE}v2/sla/practices/start/${codeStudentSLA}/${codeStudentTest}/${codeQuestionSetRule}/${codeConfigPractice}`, {
        method: 'POST',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getTestQuestionDataSla = async ({ token, codeStudentSLA, codeStudentTest }) => {
    try {
        let response = await fetch(`${API_BASE}v2/sla/test/question/data/${codeStudentSLA}/${codeStudentTest}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const getTestQuestionDetail = async ({ token, codeStudentTest, questionIdStudentTest }) => {
    let response = await fetch(`${API_BASE}v2/sla/test/question/detail/${codeStudentTest}/${questionIdStudentTest}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getTestDetailSlaV2 = async ({ token, codeStudentSLA, codeStudentTest }) => {
    try {
        let response = await fetch(`${API_BASE}v2/sla/test/detail/${codeStudentSLA}/${codeStudentTest}`, {
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
    getConfigSlaPractice,
    getDetailConfigPractice,
    getTestDoneSla,
    getPracticesQuestionDetail,
    getPracticeDetail,
    getQuestionAnswerNewV2,
    getSlaTestInfo,
    getPracticeSlaStart,
    getTestQuestionDetail,
    getTestQuestionDataSla,
    getTestDetailSlaV2,
    getInfoSla
}