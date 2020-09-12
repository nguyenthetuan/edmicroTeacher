import { API_BASE, API_BASE_MOCK, API_BASE_OAUTH } from '../constants/setting';

const getHeaders = (token) => ({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Referer': 'https://m.k12.onluyen.vn'
  }
});

const register = (email, passWord, displayName, rememberMe, type) => (

  fetch(API_BASE_OAUTH + 'account/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ email, passWord, displayName, rememberMe, type })
    })
    .then(res => res.json())
);

const signin = async (email, passWord, RememberMe, socialType, socialId, socialToken) => {
  let response = await fetch(API_BASE_OAUTH + 'account/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ email, passWord, RememberMe, socialType, socialId, socialToken })
    });
  let responseJson = await response.json();
  return responseJson;
};

const getListSubject = (token, gradeId) => (
  fetch(`${API_BASE}subject/${gradeId}`, getHeaders(token)).then(res => res.json())
);

const testSubject = (token, subjectId, gradeId) => (
  fetch(API_BASE + 'tests/' + gradeId + '/' + subjectId,
    getHeaders(token))
    .then((response) => response.json())
);

const testCategory = (token, testCategoryId) => (
  fetch(API_BASE + 'tests/category/' + testCategoryId,
    getHeaders(token))
    .then((response) => response.json())
);

const testStart = (token, testId) => (
  fetch(API_BASE + 'tests/start/' + testId,
    getHeaders(token))
    .then((response) => response.json())
);

const testQuestions = async (token, testId) => {
  let response = await fetch(API_BASE + 'tests/questions/' + testId,
    getHeaders(token));
  let responseJson = await response.json();
  return responseJson;
};

const testQuestionsDetail = (token, testId, stepId) => (
  fetch(API_BASE + 'tests/questions/detail/' + testId + '/' + stepId,
    getHeaders(token))
    .then((response) => response.json())
);
const testInfo = (token, testId) => (
  fetch(API_BASE + 'tests/info/' + testId,
    getHeaders(token))
    .then((response) => response.json())
);

const testPause = (token, testId) => (
  fetch(API_BASE + 'tests/pause/' + testId,
    getHeaders(token))
    .then((response) => response.json())
);

const testDone = (token, testId) => (
  fetch(API_BASE + 'tests/done/' + testId,
    getHeaders(token))
    .then((response) => response.json())
);

const testHistoryDetail = (token, testId) => (
  fetch(API_BASE + 'tests/history/detail/' + testId,
    getHeaders(token))
    .then((response) => response.json())
);

const testDetail = async (token, assignmentId) => {
  try {
    let response = await fetch(API_BASE + 'tests/detail/' + assignmentId, getHeaders(token));
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const testSendAnswer = (token, idOption, stepId, testId) => (
  fetch(API_BASE + 'tests/sendanswer',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ idOption, stepId, testId })
    })
    .then(res => res.json())
);

const testSendAnswer_556 = (token, idOption, stepId, testId, dataOptionId, textAnswer, isAnswer) => (
  fetch(API_BASE + 'tests/sendanswer_556',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({
        idOption, stepId, testId, dataOptionId, textAnswer, isAnswer, isSkip: false, problemId: '', problemHierachyId: ''
      })
    })
    .then(res => res.json())
);

const testReviewlast = (token, stepId) => (
  fetch(API_BASE + 'tests/reviewlast/' + stepId, getHeaders(token)).then(res => res.json())
);

const refreshToken = async (body) => {

  let response = await fetch(API_BASE_OAUTH + 'account/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body
    });
  let responseJson = await response.json();
  return responseJson;
};

const refreshTokenV2 = async (body) => {

  let response = await fetch(`${API_BASE_OAUTH}account/login/v2`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body
    });
  let responseJson = await response.json();
  return responseJson;
};

const updateProfile =
  (token, birthday, displayName, districtId,
    email, gradeId, password, phoneNumber, provinceId, schoolId) => (
      fetch(API_BASE_OAUTH + 'Account/profile/update',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Referer': 'https://m.k12.onluyen.vn',
            Authorization: 'Bearer ' + token
          },
          body: JSON.stringify({ birthday, displayName, districtId, gradeId, password, phoneNumber, provinceId, schoolId })
        })
        .then(res => res.json())
    );

const changePassword = (token, email, passwordNew, passwordOld) => (

  fetch(API_BASE_OAUTH + 'account/changepassword',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ email, passwordNew, passwordOld })
    })
    .then(res => res.json())
);

const getGrades = (token) => (
  fetch(`${API_BASE}grades`, {
    headers: getHeaders(token),
  }).then(res => res.json())
);

const getProvines = (token) => (
  fetch(`${API_BASE}common/province`, {
    headers: getHeaders(token),
  }).then(res => res.json())
);

const getDistrictes = (token, cityId) => (
  fetch(`${API_BASE}common/districtes/${cityId}`, {
    headers: getHeaders(token),
  }).then(res => res.json())
);

const getSchools = (token, districtId, type) => (
  fetch(`${API_BASE_MOCK}common/districtes/${districtId}/${type}`, {
    headers: getHeaders(token),
  }).then(res => res.json())
);

const getUriLogin = async () => {
  let response = await fetch(API_BASE_OAUTH + 'ssohocmai/geturilogin?state=2', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Referer': 'https://m.k12.onluyen.vn'
    }
  });
  let responseJson = await response.json();
  return responseJson;
};

const getTokenHocmai = async (accessCodeHocmai) => {
  try {
    let response = await fetch(API_BASE_OAUTH + 'ssohocmai/token?access_code=' + accessCodeHocmai, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      }
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return 'err get token hoc mai ';
  }
};

const getAccountStatistic = (token) => (
  fetch(`${API_BASE}account/statistic`, getHeaders(token)).then(res => res.json())
);

const getFlashCardDetail = (token, flashcardId) => (
  fetch(`${API_BASE}flashcard/detail/${flashcardId}`, getHeaders(token)).then(res => res.json())
);

const getIosConfig = (token, iosVersion) => (
  fetch(`${API_BASE}getIosConfig/${iosVersion}`, getHeaders(token)).then(res => res.json())
);

const getCategoryBySubjectId = (token, gradeId, subjectId, indexPage) => (
  fetch(`${API_BASE}category/data/${gradeId}/${subjectId}/${indexPage}`, getHeaders(token)).then(res => res.json())
);

const getCategoryDetailByTestCategoryId = (token, testCategoryId, typeTest, indexPage) => (
  fetch(`${API_BASE}tests/category/detail/${testCategoryId}/${typeTest}/${indexPage}`, getHeaders(token)).then(res => res.json())
);

const getCategoryDetailByLevel = (token, testCategoryId, indexPage) => (
  fetch(`${API_BASE}tests/category/level/${testCategoryId}/${indexPage}`, getHeaders(token)).then(res => res.json())
);

const getCategoryDetailByTime = (token, testCategoryId, indexPage) => (
  fetch(`${API_BASE}tests/category/group/${testCategoryId}/${indexPage}`, getHeaders(token)).then(res => res.json())
);

const getListExam = (token) => {
  return fetch(`${API_BASE}tests/flashCard/listTest`, getHeaders(token)).then(res => res.json())
}

const getDetailListSubject = (token, testCategoryId, typeTest, indexPage) => {
  return fetch(`${API_BASE}/tests/category/detail/${testCategoryId}/${typeTest}/${indexPage}`, getHeaders(token)).then(res => res.json())
}

module.exports = {
  signin,
  register,
  getListSubject,
  testSubject,
  testCategory,
  testStart,
  testQuestions,
  testQuestionsDetail,
  testInfo,
  testSendAnswer,
  testSendAnswer_556,
  testPause,
  testDone,
  testHistoryDetail,
  testDetail,
  refreshToken,
  refreshTokenV2,
  updateProfile,
  changePassword,
  getGrades,
  getProvines,
  getDistrictes,
  getSchools,
  getUriLogin,
  getTokenHocmai,
  getAccountStatistic,
  getFlashCardDetail,
  testReviewlast,
  getCategoryBySubjectId,
  getCategoryDetailByTestCategoryId,
  getCategoryDetailByLevel,
  getCategoryDetailByTime,
  getIosConfig,
  getListExam,
  getDetailListSubject,
};
