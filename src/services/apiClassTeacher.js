import {API_BASE, getHeaders} from '../constants/setting';

const getListClass = async ({token}) => {
  let response = await fetch(`${API_BASE}school-online/class/teacher/`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  let responseJson = await response.json();
  return responseJson;
};
const getInfoClass = async ({token, classId}) => {
  let response = await fetch(
    `${API_BASE}school-online/class/config/${classId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getListExercise = async ({token, classId}) => {
  let response = await fetch(
    `${API_BASE}school-online/assignment/assign/class/${classId}/0`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getClassReport = async ({token, classID, idStudent}) => {
  let response = await fetch(
    `${API_BASE}school-online/report/class-report/${classID}/undefined/undefined/${idStudent}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getMastery = async ({token, classID}) => {
  let response = await fetch(
    `${API_BASE}school-online/mastery/mastery-class/${classID}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getListClassAssigment = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/assignment/assign/${assignmentId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getListQuestion = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/library/assignment/config/${assignmentId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getListPlan = async ({token, classId}) => {
  let response = await fetch(
    `${API_BASE}school-online/class/config/study-planning/${classId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const putPlan = async ({token, formData}) => {
  let response = await fetch(
    `${API_BASE}school-online/class/config/study-planning`,
    {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getConfigMockExample = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/library/assignment/config/${assignmentId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getMockExample = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/check-assign/question/${assignmentId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getDatailQuestionMockExam = async ({token,assignmentId,questionId})=>{
  let response = await fetch(
    `${API_BASE}school-online/check-assign/question/${assignmentId}/${questionId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getExam = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/check-assign/doing/${assignmentId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const reviewlater = async ({token, id}) => {
  let response = await fetch(`${API_BASE}tests/reviewlater/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  let responseJson = await response.json();
  return responseJson;
};
const putMockExam = async ({token, formData}) => {
  let response = await fetch(
    `${API_BASE}school-online/check-assign/question/send-answer`,
    {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(formData),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getInforMockExam = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/check-assign/info/${assignmentId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const getMockResult = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/check-assign/detail/${assignmentId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};
const submitMockExam = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/check-assign/submit/${assignmentId}`,
    {
      method: 'PUT',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};

const startMockExam = async ({token, assignmentId}) => {
  let response = await fetch(
    `${API_BASE}school-online/check-assign/start/${assignmentId}`,
    {
      method: 'POST',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};

module.exports = {
  getListClass,
  getInfoClass,
  getListExercise,
  getClassReport,
  getListClassAssigment,
  getListQuestion,
  getListPlan,
  putPlan,
  getConfigMockExample,
  getMockExample,
  getExam,
  reviewlater,
  putMockExam,
  getInforMockExam,
  getMockResult,
  getMastery,
  submitMockExam,
  startMockExam,
  getDatailQuestionMockExam
};
