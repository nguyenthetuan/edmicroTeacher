import { API_BASE, getHeaders } from '../constants/setting';
import _ from 'lodash';

const getGrade = async ({ token }) => {
  let response = await fetch(`${API_BASE}school-online/common/grade`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getSubject = async ({ token }) => {
  let response = await fetch(`${API_BASE}school-online/common/subject`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getPapers = async ({ token, body }) => {
  let response = await fetch(`${API_BASE}school-online/library/assignment`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(body)
  });
  let responseJson = await response.json();
  return responseJson;
}

const updateInfo = async ({ token, body }) => {
  let response = await fetch(`${API_BASE}school-online/library/assignment/update/info/v2`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(body)
  });
  let responseJson = await response.json();
  return responseJson;
}

const findPremadeLib = async (payload) => {
  const { token, curriculumCodes, gradeCodes, knowledgeUnits, name, pageIndex, searchKnowledgeUnitChild, subjectCodes } = payload;
  try {
    let response = await fetch(`${API_BASE}school-online/premade-lib/find`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ curriculumCodes, gradeCodes, knowledgeUnits, name, pageIndex, searchKnowledgeUnitChild, subjectCodes })
    })
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {

  }
}
const premadeLibCopy = async (payload) => {
  const { token, id } = payload;
  try {
    let response = await fetch(`${API_BASE}school-online/premade-lib/coppy/${id}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    
  }
}


const getAssignment = async ({ token, assignmentId }) => {
  let response = await fetch(`${API_BASE}school-online/assignment/get-class-assign/${assignmentId}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getStudents = async ({ token, classId }) => {
  let response = await fetch(`${API_BASE}school-online/class/student/${classId}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const assignment = async ({ token, body }) => {
  let response = await fetch(`${API_BASE}school-online/assignment/assign`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(body)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getSubjects = async ({ token }) => {
  let response = await fetch(`${API_BASE}school-online/common/subject`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getDetailSubject = async ({ token, subjectCode }) => {
  let response = await fetch(`${API_BASE}school-online/curriculum/curriculum/select/${subjectCode}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getLearingTarget = async ({ token, subjectCode }) => {
  let response = await fetch(`${API_BASE}school-online/curriculum/curriculum/learning-targets-all/${subjectCode}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const searchPaper = async ({ token, body, key }) => {
  try {
    let response = await fetch(`${API_BASE}school-online/library/question/search/${key}/data.json`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(body)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return "";
  }

}

const countSearch = async ({ token, body }) => {
  try {
    let response = await fetch(`${API_BASE}school-online/library/question/count-search`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(body)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return { totalQuestion: 0 };
  }
}

const assignmentDetailCheck = async (payload) => {
  const { token, assignId, studentId } = payload;
  try {
    let response = await fetch(`${API_BASE}school-online/assignment/detail/check/${assignId}/${studentId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {

  }
}

const getListClassAssigned = async (payload) => {
  const { token, assignmentId } = payload;
  try {
    let response = await fetch(`${API_BASE}school-online/assignment/assign/${assignmentId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
  }

}

const updateScoreForEach = async (payload) => {
  const { token, studentId, assignId, classId, idLog, stepId, scoreTeacher, contentNote } = payload;
  try {
    let response = await fetch(`${API_BASE}school-online/assignment/assign/update/score/`, {
      method: 'GET',
      headers: getHeaders(token),
      body: JSON.stringify({ studentId, assignId, classId, idLog, stepId, scoreTeacher, contentNote })
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
  }

}

const assignmentDetail = async (payload) => {
  const { token, assignmentId } = payload;
  try {
    let response = await fetch(`${API_BASE}school-online/assignment/assign/${assignmentId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
  }

}

const fetchListStudentAssign = async (payload) => {
  const { token, assignId } = payload;
  try {
    let response = await fetch(`${API_BASE}school-online/assignment/list-student/${assignId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
  }

}



const signedUrlContentPDF = async ({ token }) => {
  let response = await fetch(`${API_BASE}school-online/library/assignment-content/signed-url-content/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({
      extensionFile: 'pdf',
      fileType: 'application/pdf'
    })
  });
  let responseJson = await response.json();
  return responseJson;
}

const uploadPDF = async ({ url, formData }) => {
  let response = await fetch(`${url}`, {
    method: 'PUT',
    body: formData
  });
  return response;
}

const assignmentContent = async ({ token, body }) => {
  let response = await fetch(`${API_BASE}school-online/library/assignment-content/create/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(body)
  });
  let responseJson = await response.json();
  return responseJson;
}

const createQuestion = async ({ token, formData }) => {
  let response = await fetch(`${API_BASE}school-online/library/assignment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Referer': 'https://app.onluyen.vn'
    },
    body: formData,
  })
  console.log("createQuestion response: ", JSON.stringify(response));

  let responseJson = await response.json();
  console.log("createQuestion responseJson: ", JSON.stringify(responseJson));
  return responseJson;
}

const getAssignmentConfig = async ({ token, id }) => {
  let response = await fetch(`${API_BASE}school-online/library/assignment/config/${id}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getStaticExam = async ({ token, yearCurrent, classSubjectId = 0, testId = 0 }) => {
  let response = await fetch(`${API_BASE}school-online/StatisticExam/score/${classSubjectId}/${testId}/${yearCurrent}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const deletePaper = async ({ token, id }) => {
  let response = await fetch(`${API_BASE}school-online/library/assignment/delete/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const submitReview = async ({ token, formData }) => {
  let response = await fetch(`${API_BASE}school-online/assignment/assign/update/score/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(formData)
  });
  let responseJson = await response.json();
  return responseJson;
}

const publicedScore = async ({ token, formData }) => {
  let response = await fetch(`${API_BASE}school-online/assignment/assign/publish/score/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(formData)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getMatarialDetail = async ({ token, idMatarial }) => {
  let response = await fetch(`${API_BASE}school-online/library/material/detail/${idMatarial}/0`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}

const getSkill = async ({ token, idSubject }) => {
  let response = await fetch(`${API_BASE}school-online/curriculum/curriculum/learning-target/skill/${idSubject}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  let responseJson = await response.json();
  return responseJson;
}


module.exports = {
  getGrade,
  getSubject,
  getPapers,
  updateInfo,
  getAssignment,
  getStudents,
  assignment,
  signedUrlContentPDF,
  uploadPDF,
  assignmentContent,
  getSubjects,
  getDetailSubject,
  getLearingTarget,
  searchPaper,
  createQuestion,
  getAssignmentConfig,
  getStaticExam,
  deletePaper,
  assignmentDetailCheck,
  assignmentDetail,
  fetchListStudentAssign,
  updateScoreForEach,
  getListClassAssigned,
  submitReview,
  countSearch,
  publicedScore,
  getMatarialDetail,
  getSkill,
  findPremadeLib,
  premadeLibCopy,
};
