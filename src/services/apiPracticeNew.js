import { API_BASE, getHeaders } from '../constants/setting';
import fetch from './fetchWithTimeout';

const getPracticeHiearchy = async ({ token, GradeId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/hierarchy/subject/${GradeId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const getPracticeHierchyList = async ({ token, subjectId, GradeId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/hierarchy/list/${subjectId}/${GradeId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeHierarchyDetail = async ({ token, codeConfigHierarchyProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/hierarchy/detail/${codeConfigHierarchyProblem}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeProblemDetail = async ({ token, codeConfigProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/problem/detail/${codeConfigProblem}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeDetail = async ({ token, codeConfigProblem, codeConfigPractices }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/detail/${codeConfigProblem}/${codeConfigPractices}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const postPracticeStart = async ({ token, codeConfigProblem, codeConfigPractices }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/start/${codeConfigProblem}/${codeConfigPractices}`, {
            method: 'POST',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const postPracticeAgain = async ({ token, codeConfigProblem, codeConfigPractices }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/again/${codeConfigProblem}/${codeConfigPractices}`, {
            method: 'POST',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeStepDetail = async ({ token, codeConfigProblem, codeConfigPractices, stepId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/step/detail/${codeConfigProblem}/${codeConfigPractices}/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const putPracticeSendAnswer = async ({ token, dataOptionId, textAnswer, stepId, code, isSkip, studentDoRight }) => {
    let response = await fetch(`${API_BASE}v2/practice/step/sendAnswer`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ dataOptionId, textAnswer, stepId, code, isSkip, studentDoRight })
    });
    let responseJson = await response.json();
    return responseJson;
}


const getPracticeStepDone = async ({ token, codeConfigProblem, codeConfigPractices, stepId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/step/done/${codeConfigProblem}/${codeConfigPractices}/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const postPracticeTestStart = async ({ token, codeConfigProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/start/${codeConfigProblem}`, {
            method: 'POST',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeTestStep = async ({ token, codeConfigProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/step/${codeConfigProblem}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeTestDetail = async ({ token, codeConfigProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/detail/${codeConfigProblem}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const putPracticeTestStepSendAnswer = async ({ token, dataOptionId, textAnswer, stepId, code, isSkip, studentDoRight }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/step/sendAnswer`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify({ dataOptionId, textAnswer, stepId, code, isSkip, studentDoRight })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeTestAgain = async ({ token, codeConfigProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/again/${codeConfigProblem}`, {
            method: 'PUT',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const getPracticeTestStepDetail = async ({ token, codeConfigProblem, stepId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/step/detail/${codeConfigProblem}/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const putPracticeTestDone = async ({ token, codeConfigProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/done/${codeConfigProblem}`, {
            method: 'PUT',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeTestStepReviewLater = async ({ token, stepId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/step/reviewLater/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}


const getPracticeTestStepDoneDetail = async ({ token, codeConfigProblem, stepId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/test/step/done/detail/${codeConfigProblem}/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const getPracticeRecentSubject = async ({ token, subjectId, GradeId }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/recent/subject/${subjectId}/${GradeId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const getPracticeRecentProblem = async ({ token, codeConfigProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/recent/problem/${codeConfigProblem}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

const getPracticeRecentHierarchy = async ({ token, codeConfigHierarchyProblem }) => {
    try {
        let response = await fetch(`${API_BASE}v2/practice/recent/hierarchy/${codeConfigHierarchyProblem}`, {
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
    getPracticeHiearchy,
    getPracticeHierchyList,
    getPracticeHierarchyDetail,
    getPracticeProblemDetail,
    getPracticeDetail,
    postPracticeStart,
    postPracticeAgain,
    getPracticeStepDetail,
    putPracticeSendAnswer,
    getPracticeStepDone,
    postPracticeTestStart,
    getPracticeTestStep,
    getPracticeTestDetail,
    putPracticeTestStepSendAnswer,
    getPracticeTestAgain,
    getPracticeTestStepDetail,
    putPracticeTestDone,
    getPracticeTestStepReviewLater,
    getPracticeTestStepDoneDetail,
    getPracticeRecentSubject,
    getPracticeRecentProblem,
    getPracticeRecentHierarchy
}