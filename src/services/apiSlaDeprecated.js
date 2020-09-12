/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-18 05:59:02
 * @modify date 2018-04-18 05:59:02
 * @desc [description]
*/

import { API_BASE, API_BASE_OAUTH, getHeaders } from '../constants/setting';

//API trả về danh sách môn học có đánh giá năng lực.
const getSlaListSubject = async (payload) => {
    const { token, GradeId } = payload;
    let response = await fetch(`${API_BASE}sla/data/subject/${GradeId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

//Danh sach mục tiêu đánh giá năng lực
const getListTargetSla = async (payload) => {
    const { token, GradeId, subjectId } = payload;
    let response = await fetch(`${API_BASE}sla/data/list/${subjectId}/${GradeId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

//Lấy thông tin bài đánh giá năng lực của học sinh
const getListSlaInfo = async (payload) => {
    const { token, codeStudentSLA } = payload;
    let response = await fetch(`${API_BASE}sla/detail/${codeStudentSLA}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

//Hàm khỏi tạo bài đánh giá năng lực (POST)
const createSlaStart = async ({ token, codeConfigSLA }) => {
    try {
        let response = await fetch(`${API_BASE}sla/start/${codeConfigSLA}`, {
            method: 'POST',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//Dừng bài đánh giá năng lực (POST)
const postStopSlaByCodeStudentSLA = async ({ token, codeStudentSLA, type }) => {
    try {
        let response = await fetch(`${API_BASE}sla/stop/${codeStudentSLA}`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ token, type })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//Khởi tạo bài kiểm tra tiếp theo trong phần đánh giá năng lực (POST)
const createTestStartSla = async ({ token, codeStudentSLA }) => {
    try {
        let response = await fetch(`${API_BASE}sla/test/start/${codeStudentSLA}`, {
            method: 'POST',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//API lấy nội dung câu hỏi bài kiểm tra
const getTestQuestionDetail = async ({ token, codeStudentTest, questionIdStudentTest }) => {
    try {
        let response = await fetch(`${API_BASE}sla/test/question/detail/${codeStudentTest}/${questionIdStudentTest}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//Ghi nhận đáp học sinh chọn của bài kiểm tra (PUT)
const putSendAswerTestSla = async ({ token, codeStudentSLA, codeStudentTest, questionIdStudentTest, dataOptionId, isSkip, textAnswer }) => {
    try {
        let response = await fetch(`${API_BASE}sla/test/question/sendanswer/${codeStudentSLA}/${codeStudentTest}`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify({
                isSkip, dataOptionId, textAnswer, questionIdStudentTest, codeStudentTest
            })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//API lấy danh sách câu hỏi của bài kiểm tra
const getTestQuestionDataSla = async ({ token, codeStudentSLA, codeStudentTest }) => {
    try {
        let response = await fetch(`${API_BASE}sla/test/question/data/${codeStudentSLA}/${codeStudentTest}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//API lấy thông tin bài kiểm tra
const getTestDetailSla = async ({ token, codeStudentSLA, codeStudentTest }) => {
    try {
        let response = await fetch(`${API_BASE}sla/test/detail/${codeStudentSLA}/${codeStudentTest}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//Bắt đầu chấm bài kiểm tra (put)
const putSlaTestDone = async ({ token, codeStudentSLA, codeStudentTest }) => {
    try {
        let response = await fetch(`${API_BASE}sla/test/done/${codeStudentSLA}/${codeStudentTest}`, {
            method: 'PUT',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//Thông tin khi kết thúc bài kiểm tra.
const getTestSlaDetailDone = async ({ codeStudentSLA, codeStudentTest, token }) => {
    let response = await fetch(`${API_BASE}sla/test/detail/done/${codeStudentSLA}/${codeStudentTest}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

//Danh sách dạng bài của user làm trong bài luyện

//Dánh dấu câu xem lại trong bài kiểm tra (làm sau)
const getReviewLater = async ({ token, questionIdStudentTest }) => {
    let response = await fetch(`${API_BASE}sla/test/reviewlater/${questionIdStudentTest}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}


//API lấy sanh sách bài luyện tập của phần kiêm tra
const getListPracticeSla = async ({ codeStudentSLA, codeStudentTest, token }) => {
    let response = await fetch(`${API_BASE}sla/practices/data/${codeStudentSLA}/${codeStudentTest}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

//Nhận đáp án của học và chấm điểm cho câu hỏi =&gt; bài luyện (put)
const putPracticeSlaSendanswer = async ({ token, isSkip, codeStudentSLA, codeStudentPractices, dataOptionId, questionIdStudentPractices, studentDoRight, textAnswer }) => {
    try {
        let response = await fetch(`${API_BASE}sla/practices/question/sendanswer/${codeStudentSLA}/${codeStudentPractices}`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify({ isSkip, codeStudentPractices, dataOptionId, questionIdStudentPractices, studentDoRight, textAnswer })
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}

//API lấy thông tin bài luyện theo dạng
const getPracticeDetailSla = async ({ token, codeStudentPractices }) => {
    try {
        let response = await fetch(`${API_BASE}sla/practices/detail/${codeStudentPractices}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}
//Lấy nội đung câu hỏi của bài luyện tập
const getPracticeQuestionDetailSla = async ({ token, codeStudentSLA, codeStudentPractices, questionIdStudentPractices }) => {
    try {
        let response = await fetch(`${API_BASE}sla/practices/question/detail/${codeStudentSLA}/${codeStudentPractices}/${questionIdStudentPractices}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return "";
    }
}
//Lấy thông tin câu hỏi đã trả lời

//Lấy thông tin hoạt động của học sinh trong các bài đgnl. (POST)

//Lây bài luyên - kiểm tra gần nhất
const getRecentSla = async ({ codeStudentSLA, token }) => {
    let response = await fetch(`${API_BASE}sla/recent/${codeStudentSLA}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

module.exports = {
    getSlaListSubject,
    getListTargetSla,
    getListSlaInfo,
    getTestSlaDetailDone,
    getListPracticeSla,
    postStopSlaByCodeStudentSLA,
    getTestQuestionDetail,
    getRecentSla,
    getReviewLater,
    putSlaTestDone,
    getTestQuestionDataSla,
    putSendAswerTestSla,
    createSlaStart,
    createTestStartSla,
    getPracticeDetailSla,
    putPracticeSlaSendanswer,
    getPracticeQuestionDetailSla,
    getTestDetailSla
}