import { API_BASE, getHeaders } from '../constants/setting';
import _ from 'lodash';

// api get subject in misstion of class current
export const getCommonSubject = async ({ token }) => {
  let response = await fetch(`${API_BASE}school-online/common/subject`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  let responseJson = await response.json();
  return responseJson;
};

// api get List mission
export const getListMission = async ({ token }) => {
  let response = await fetch(
    `${API_BASE}school-online/mission/getlist/%20/%20/8`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};

// api get List category hirachy
export const getCategoryHirachyMission = async ({
  token,
  gradeId,
  subjectId,
}) => {
  let response = await fetch(
    `${API_BASE}school-online/mission/category/hirachy/data/${gradeId}/${subjectId}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};

//api get List category test
export const getCategoryTestMission = async ({ token, gradeId, subjectId }) => {
  let response = await fetch(
    `${API_BASE}school-online/mission/category/test/data/${gradeId}/${subjectId}/0`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );
  let responseJson = await response.json();
  return responseJson;
};

//api get List Problem Practice
export const getListProblemMission = async ({ token, id }) => {
  let response = await fetch(`${API_BASE}problemHierachy/listProblem/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  let responseJson = await response.json();
  return responseJson;
};

// api get List Problem Test
export const getTestByCategory = async ({ token, id }) => {
  let response = await fetch(`${API_BASE}tests/gettestbycategory/${id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  let responseJson = await response.json();
  return responseJson;
};

// api create Mission 
export const createMission = async (payload) => {
  const { token, params } = payload;
  let response = await fetch(`${API_BASE}school-online/mission/createmission/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(params)
  });
  let responseJson = await response.json();
  return responseJson;
}
// api get assign by mission
export const getAssignByMission = async (payload) => {
  const { token, _id } = payload;
  let response = await fetch(`${API_BASE}school-online/mission/getassignbymission/${_id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  let responseJson = await response.json();
  return responseJson;
}

// api assigned mission 
export const assignedMission = async (payload) => {
  const { token, params } = payload;
  const response = await fetch(`${API_BASE}school-online/mission/assignmission/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(params)
  });
  const responseJson = await response.json();
  return responseJson;
}

// api get info practice
export const getInfoPractice = async (token, _id) => {
  const response = await fetch(`${API_BASE}practice/info/${_id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const responseJson = await response.json();
  return responseJson;
}

// api get info test
export const getInfoTest = async (token, _id) => {
  const response = await fetch(`${API_BASE}tests/info/${_id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const responseJson = await response.json();
  return responseJson;
}

// api check permission add Mission
export const checkPermission = async (token) => {
  const response = await fetch(`${API_BASE}package/feature/school`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const responseJson = await response.json();
  return responseJson;
}

module.exports = {
  getCommonSubject,
  getListMission,
  getCategoryHirachyMission,
  getCategoryTestMission,
  getListProblemMission,
  getTestByCategory,
  createMission,
  getAssignByMission,
  assignedMission,
  getInfoPractice,
  getInfoTest,
  checkPermission
};
