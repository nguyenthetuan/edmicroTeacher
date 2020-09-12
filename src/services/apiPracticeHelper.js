import { API_BASE, getHeaders, API_BASE_OAUTH } from '../constants/setting';
import fetch from './fetchWithTimeout';

const fogotPassword = async (email, urlForgotPassword) => {
    try {
        let response = await fetch(`${API_BASE_OAUTH}Account/forgotPassword?email=${email}&urlForgotPassword=${urlForgotPassword}`, {
            method: 'POST',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return '';
    }
}

const getListSubject = async (payload) => {
    const { token, GradeId } = payload;
    let response = await fetch(`${API_BASE}subject/${GradeId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getRecentBySubject = async (payload) => {
    const { token, subjectId, GradeId } = payload;
    let response = await fetch(`${API_BASE}practice/recent/${GradeId}/${subjectId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getListHierachy = async (payload) => {
    const { token, subjectId, GradeId } = payload;
    let response = await fetch(`${API_BASE}problemHierachy/${GradeId}/${subjectId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getListFlashcard = (token, knowledgeId) => (
    fetch(`${API_BASE}flashcard/list/${knowledgeId}/1/0/0`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getListProblemExecise = async (payload) => {
    const { token, problemHiearchyId } = payload;
    let respone = await fetch(`${API_BASE}problemHierachy/listProblem/${problemHiearchyId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await respone.json();
    return responseJson;
}

const getListProblem = (token, problemHiearchyId) => (
    fetch(`${API_BASE}problemHierachy/listProblem/${problemHiearchyId}`, {
        method: 'GET',
        headers: getHeaders(token),
    }).then(res => res.json())
);

const postWarningReport = (token, contentReport, error, file, gradeId, numberQuestion, subjectId) => (
    fetch(`${API_BASE}question/report`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ contentReport, error, file, gradeId, numberQuestion, subjectId })
    }).then(res => res.json())
);

const getReportByProblemHiearchyId = async (payload) => {
    const { token, problemHiearchyId } = payload;
    let response = await fetch(`${API_BASE}problemHierachy/report/${problemHiearchyId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getReportById = (token, problemHiearchyId) => (
    fetch(`${API_BASE}problemHierachy/report/${problemHiearchyId}`, {
        method: 'GET',
        headers: getHeaders(token),
    }).then(res => res.json())
);


const getPercentComplete = (token, problemId) => (
    fetch(`${API_BASE}problemHierachy/listProblem/${problemId}`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getPractice = (token, problemCode, stepIdNow) => (
    fetch(`${API_BASE}practice/${problemCode}/${stepIdNow}`, {
        headers: getHeaders(token),
    }).then(res => res.json())
);

const getPracticeApi = async (payload) => {
    const { problemCode, stepIdNow, token } = payload;
    const response = await fetch(`${API_BASE}practice/questions/detail/${problemCode}/${stepIdNow}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

const getQuestionComment = (token, numberQuestion) => (
    fetch(`${API_BASE}doubts/question/${numberQuestion}/0/0`, {
        headers: getHeaders(token)
    }).then(res => res.json())
);

const postQuestionComment = (token, dataContent, numberQuestion, problemId, testId, typeContent) => (
    fetch(`${API_BASE}doubts/question/comment`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ dataContent, numberQuestion, problemId, testId, typeContent })
    }).then(res => res.json())
);

const getGrades = (token) => (
    fetch(`${API_BASE}grades`, {
        headers: getHeaders(token),
    }).then(res => res.json())
);

const getSelectOption = (token, stepId, problemId, problemHierachyId, userIdOption) => (
    fetch(`${API_BASE}sld/practice/selectoption`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ stepId, problemId, problemHierachyId, userIdOption })
    })
);

const getQuestionAnswer = (token, practice, choose, textAnswer) => {
    const stepId = practice.id;
    const problemId = practice.problemId;
    const problemHierachyId = practice.problemHierachyId;
    const isAnswer = (choose !== -1) ? practice.options[choose].isAnswer : false;
    const optionId = (choose !== -1) ? practice.options[choose].id : -1;
    const dataOptionId = [0];
    const testId = '';
    return (
        fetch(`${API_BASE}practice/questions/sendanswer`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ isAnswer, optionId, dataOptionId, problemHierachyId, problemId, stepId, testId })
        }).then(res => res.json())
    );
};

const getQuestionAnswerNew = async (token, practice, choose, textAnswer, arrMulti, isSkip) => {
    const stepId = practice.id;
    const problemId = practice.problemId;
    const optionId = (choose !== -1) ? practice.options[choose].id : -1;
    const dataOptionId = [];
    if (optionId !== -1) {
        dataOptionId.push(choose);
    } else {
        for (let i = 0; i < arrMulti.length; i++) {
            if (arrMulti[i] === 1) {
                dataOptionId.push(i);
            }
        }
    }
    let response = await fetch(`${API_BASE}practice/questions/sendanswer`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ dataOptionId, textAnswer, problemId, stepId, isSkip })
    });
    let responseJson = await response.json();
    return responseJson;
};

const getQuestionAnswerNewV2 = async ({ token, dataOptionId, stepId, problemId, isSkip, textAnswer, dataOptionText, dataTextAnswer }) => {
    let response = await fetch(`${API_BASE}practice/questions/sendanswer`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ dataOptionId, textAnswer, problemId, stepId, isSkip, dataOptionText, dataTextAnswer })
    });
    let responseJson = await response.json();
    return responseJson;
};

const getQuestionAnswerNewIOS = async (payload) => {
    const { token, dataOptionId, stepId, textAnswer, problemId, isSkip } = payload;
    let response = await fetch(`${API_BASE}practice/questions/sendanswer`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ dataOptionId, textAnswer, problemId, stepId, isSkip })
    });
    let responseJson = await response.json();
    return responseJson;
};

const noAnswerDetailByStepId = async (token, stepId) => {
    let respone = await fetch(`${API_BASE}practice/questions/NoAnswer/detail/${stepId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let resJson = await respone.json();
    return resJson;
}

const studentCheckAnswer = async (token, textAnswer, problemId, stepId, studentDoRight) => {
    let response = await fetch(`${API_BASE}practice/questions/studentCheckAnswer`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ studentDoRight, problemId, stepId, textAnswer })
    });
    let responseJson = await response.json();
    return responseJson;
}

const getPracticeInfo = (token, problemCode) => (
    fetch(`${API_BASE}practice/info/${problemCode}`, {
        method: 'GET',
        headers: getHeaders(token),
    }).then(res => res.json())
);

const getFlashCardDetail = (token, stepId, flashcardId) => (
    fetch(`${API_BASE}practice/flashcard/detail/${stepId}/${flashcardId}`, {
        method: 'GET',
        headers: getHeaders(token),
    }).then(res => res.json())
);

const getFlashCardDetailBm = (token, flashcardId) => (
    fetch(`${API_BASE}flashcard/detail/${flashcardId}`, {
        method: 'GET',
        headers: getHeaders(token),
    }).then(res => res.json())
);

const getListLeaderBoard = (token, gradesId, subjectId) => (
    fetch(`${API_BASE}leaderboard/2/${gradesId}/${subjectId}`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getPausePractice = (token, problemCode) => (
    fetch(`${API_BASE}practice/pause/${problemCode}`, {
        method: 'GET',
        headers: getHeaders(token),
    }).then(res => res.json())
);

const getListLectures = (token, problemHiearchyId) => (
    fetch(`${API_BASE}problemHierachy/lectures/${problemHiearchyId}/1`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getVideoDetail = (token, flashcardId) => (
    fetch(`${API_BASE}flashcard/detail/${flashcardId}`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getKnowledge = (token, knowledge) => (
    fetch(`${API_BASE}flashcard/list/${knowledge}/1/0/0`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const updateProfile = (token, data) => {
    const email = data.email;
    const password = data.password;
    const gradeId = data.gradeId;
    const displayName = data.displayName;
    const phoneNumber = data.phoneNumber;
    const birthday = data.birthday;
    return fetch(`${API_BASE_OAUTH}Account/profile/update`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ email, password, gradeId, displayName, phoneNumber, birthday })
    }).then(res => res.json());
};

const getProcessActivity = (token, timeStart) => (
    fetch(`${API_BASE}account/activity/${timeStart}`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getProfileInfo = (token) => (
    fetch(`${API_BASE}account/statistic`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getListSbBmark = (token) => (
    fetch(`${API_BASE}bookmark/subject`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getListproblemHierachies = async (payload) => {
    const { token, subjectId, pageIndex } = payload;
    const response = await fetch(`${API_BASE}bookmark/subject/${subjectId}/${pageIndex}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
}

const getListproblemHierachiesSub = (token) => (
    fetch(`${API_BASE}bookmark/problemHierachy/listProblem/problemHierachyId`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getListDoubts = (token, knowledgeId, page) => (
    fetch(`${API_BASE}bookmark/knowledge/${knowledgeId}/${page}`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const bookMarkQuestion = (token, isBookmark, numberQuestion, problemId, subjectId, subjectName, testId = "") => (
    fetch(`${API_BASE}bookmark/question`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ isBookmark, numberQuestion, problemId, subjectId, subjectName, testId })
    }).then(res => res.json())
);

const getListProvince = (token) => (
    fetch(`${API_BASE}common/province`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getDistrictes = (token, cityId) => (
    fetch(`${API_BASE}common/districtes/${cityId}`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const getListSchool = (token, districtId, cityId) => (
    fetch(`${API_BASE}common/school/${districtId}/${cityId}`, {
        method: 'GET',
        headers: getHeaders(token)
    }).then(res => res.json())
);

const updateAvatar = (token, email, imageBase64) => {
    console.log({
        ...getHeaders(token),
        Accept: 'application/json, text/plain, */*'
    })
    return (

        fetch(`${API_BASE_OAUTH}Account/profile/avatar`, {
            method: 'POST',
            headers: {
                ...getHeaders(token),
                Accept: 'application/json, text/plain, */*'
            },
            body: JSON.stringify({ email, imageBase64 })
        }).then(res => res.json())
    )
};

const resetProblemByID = async (token, problemHiearchyId) => {
    let response = await fetch(`${API_BASE}practice/start/${problemHiearchyId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
};

const getPracticeQuestionV2 = async (token, problemId, stepId) => {
    try {
        let response = await fetch(`${API_BASE}practice/questions/detail/${problemId}/${stepId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return '';
    }
};

const getPackageRegister = (token, description, email, phone) => {
    return fetch(`${API_BASE}package/Request/Register`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ description, email, phone })
    }).then(res => res.json())
};

const postPracticeActivity = async (payload) => {
    const listId = { payload };
    let response = await fetch(`${API_BASE}practice/activity`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ listId })
    });
    let responseJson = await response.json();
    return responseJson;
}

const getListMockExam = async (payload) => {
    const { token, indexPage } = payload;
    let response = await fetch(`${API_BASE}exam/${indexPage}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

const getDetailMockExam = async (payload) => {
    const { token, examId } = payload;
    let response = await fetch(`${API_BASE}exam/detail/${examId}`, {
        method: 'GET',
        headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
}

module.exports = {
    fogotPassword,
    getListSubject,
    getListHierachy,
    getListProblem,
    getRecentBySubject,
    getReportById,
    getPractice,
    getPracticeApi,
    getQuestionComment,
    postQuestionComment,
    getQuestionAnswer,
    getQuestionAnswerNew,
    getQuestionAnswerNewIOS,
    getListLectures,
    getVideoDetail,
    getKnowledge,
    getFlashCardDetail,
    getFlashCardDetailBm,
    getPracticeInfo,
    getGrades,
    getPausePractice,
    getProcessActivity,
    getProfileInfo,
    postWarningReport,
    getListSbBmark,
    bookMarkQuestion,
    getListproblemHierachies,
    getListproblemHierachiesSub,
    getListDoubts,
    updateProfile,
    getListFlashcard,
    getPercentComplete,
    getPracticeQuestionV2,
    getQuestionAnswerNewV2,
    getListLeaderBoard,
    getListProvince,
    getDistrictes,
    getListSchool,
    resetProblemByID,
    updateAvatar,
    noAnswerDetailByStepId,
    studentCheckAnswer,
    getPackageRegister,
    getListProblemExecise,
    getReportByProblemHiearchyId,
    postPracticeActivity,
    getSelectOption,
    getListMockExam,
    getDetailMockExam
};
async function newFunction() {
    const respone = await fetch(`${API_BASE}subject/${gradeId}`, {
        method: 'GET',
        headers: getHeaders(token),
    });
    let resJson = await respone.json();
    return resJson;
}

