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

module.exports = {
  getCommonSubject,
  getListMission,
  getCategoryHirachyMission,
  getCategoryTestMission,
  getListProblemMission,
  getTestByCategory,
  createMission
};