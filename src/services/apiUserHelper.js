import { API_BASE, API_BASE_OAUTH, API_PROVIDER } from '../constants/setting';
import { TEST_IN_APP_PURCHASE } from '../constants/const';

const getHeaders = (token) => (
  {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Referer': 'https://m.k12.onluyen.vn'
  }
);

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



const getAccountStatistic = ({ token }) => {
  return fetch(`${API_BASE}account/statistic`, {
    method: 'GET',
    headers: getHeaders(token)
  }).then(res => res.json())
}

const upragePackageRegister = async (payload) => {
  const { token, description, email, phone } = payload;
  const response = await fetch(`${API_BASE}package/Request/Register`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ description, email, phone })
  });
  const responseJson = await response.json();
  return responseJson;
};

const getListGrades = async (payload) => {
  const { token } = payload;
  const response = await fetch(`${API_BASE}grades`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const responseJson = await response.json();
  return responseJson;
};

const updateProfile = async (payload) => {
  const {
    token, birthday, displayName, districtId, email, gradeId, password,
    phoneNumber, provinceId, schoolId
  } = payload;
  const response = await fetch(`${API_BASE_OAUTH}Account/profile/update`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ birthday, displayName, districtId, email, gradeId, password, phoneNumber, provinceId, schoolId })
  });
  const responseJson = await response.json();
  return responseJson;
};

const forgotPasswordV2 = async (payload) => {
  const { password, phoneNumber, code, csrf } = payload;
  const response = await fetch(`${API_BASE_OAUTH}account/forgotPassword/v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Referer': 'https://m.k12.onluyen.vn'
    },
    body: JSON.stringify({ code, csrf, password, phoneNumber })
  })
  const responseJson = await response.json();
  return responseJson;
}

const changePassword = async (payload) => {
  const { token, userName, passwordNew, passwordOld } = payload;
  const response = await fetch(`${API_BASE_OAUTH}account/changepassword`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ userName, passwordNew, passwordOld })
  });
  const responseJson = await response.json();
  return responseJson;
}

const fetchListProcessActivity = async (payload) => {
  const { token, timestamp } = payload;
  const response = await fetch(`${API_BASE}account/activity/${timestamp}`, {
    method: 'GET',
    headers: getHeaders(token)
  })
  const responseJson = await response.json();
  return responseJson;
}

const checkPhoneNumber = async (payload) => {
  try {
    const { type, phoneNumber, token } = payload;
    const response = await fetch(`${API_BASE_OAUTH}account/checkPhoneNumber`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ type, phoneNumber, token })
    })
    const responseJson = await response.json();
    return responseJson;
  } catch (e) {
    return "";
  }
}

const registerPhoneV2 = async ({ code, csrf, displayName, password, phoneNumber, rememberMe, userToken }) => {
  const response = await fetch(`${API_BASE_OAUTH}account/register/v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Referer': 'https://m.k12.onluyen.vn'
    },
    body: JSON.stringify({ displayName, phoneNumber, password, rememberMe, userToken, code, csrf })
  });
  let responseJson = await response.json();
  return responseJson;
}

const changePasswordV2 = async (payload) => {
  try {
    const { code, csrf, password, phoneNumber } = payload;
    const response = await fetch(`${API_BASE_OAUTH}account/forgotPassword/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ code, csrf, password, phoneNumber })
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (e) {
    return "err";
  }
}

const loginPhoneV2 = async (payload) => {
  try {
    const { loginType, password, phoneNumber, rememberMe, socialId, socialToken, socialType } = payload;
    const response = await fetch(`${API_BASE_OAUTH}account/login/v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ loginType, password, phoneNumber, rememberMe, socialId, socialToken, socialType })
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (e) {
    return "";
  }
}

const loginUserName = async (payload) => {
  try {
    const { loginType, password, userName, rememberMe, socialId, socialToken, socialType } = payload;
    const response = await fetch(`${API_BASE_OAUTH}account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ loginType, password, userName, rememberMe, socialId, socialToken, socialType })
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (e) {
    return "";
  }
}
const getPayment = async ({ token, address, districtId, fullname, packageCode, paymentType, phoneNumber, provinceId, type }) => {
  try {
    const response = await fetch(`${API_PROVIDER}payment/request`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ token, address, districtId, fullname, packageCode, paymentType, phoneNumber, provinceId, type })
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return "";
  }
}

const getMateryBySubjectId = async ({ token, subjectId, GradeId }) => {
  const response = await fetch(`${API_BASE}account/mastery/${subjectId}/${GradeId}`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const responseJson = await response.json();
  return responseJson;
}

const getStatisticChartBySubjectId = async ({ token, timeStart, timeEnd, subjectId }) => {
  try {
    const response = await fetch(`${API_BASE}account/statistic/chart/${timeStart}/${timeEnd}/${subjectId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return "";
  }
}

const getChartBuySubjectId = async (payload) => {
  const { token, subjectId, gradeId } = payload;
  try {
    const response = await fetch(`${API_BASE}account/chart/subject/${subjectId}/${gradeId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return 'Lỗi Dữ Liệu!'
  }
}

const getChartContribution = async (payload) => {
  const { token } = payload;
  try {
    const response = await fetch(`${API_BASE}account/glance`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return 'Lỗi Dữ Liệu!'
  }
}

const getFlashCardTheory = async (payload) => {
  const { token } = payload;
  try {
    const response = await fetch(`${API_BASE}flashcard/list/flashcard/0`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {

  }
}

const getFlashCardVideo = async (payload) => {
  const { token } = payload;
  try {
    const response = await fetch(`${API_BASE}flashcard/list/flashcard/1`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return error;
  }
}

const getDataFlashCardTheory = async (payload) => {
  const { token, flashcardId } = payload;
  try {
    const response = await fetch(`${API_BASE}flashcard/detail/${flashcardId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return error;
  }
}

// POST DATA FOR FIREBASE
const registerFirebasePhone = async (payload) => {
  const { displayName, phoneNumber, password, projectId, token, codeOTP, phoneCountry } = payload;
  const response = await fetch(`${API_BASE_OAUTH}firebase/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Referer': 'https://m.k12.onluyen.vn'
    },
    body: JSON.stringify({ displayName, phoneNumber, password, projectId, token, codeOTP, phoneCountry })
  });
  let responseJson = await response.json();
  return responseJson;
}

const changeFirebasePassword = async (payload) => {
  try {
    const { codeOTP, userName, password, phoneNumber, phoneCountry, token, projectId } = payload;
    const response = await fetch(`${API_BASE_OAUTH}firebase/forgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ codeOTP, userName, password, phoneNumber, phoneCountry, token, projectId })
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (e) {
    return e;
  }
}

const verifiedFirebase = async (payload) => {
  try {
    const { codeOTP, phoneNumber, phoneCountry, token, projectId } = payload;
    const response = await fetch(`${API_BASE_OAUTH}firebase/forgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ codeOTP, userName, password, phoneNumber, phoneCountry, token, projectId })
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (e) {
    return "err";
  }
}

const updateMixpanelId = async (payload) => {
  try {
    const { token, mixpanelId } = payload;
    const response = await fetch(`${API_BASE_OAUTH}user/update/mixpanel`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ idMixpanel: mixpanelId, token })
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return error
  }
}

const getSearchAccount = async (payload) => {
  try {
    const { phoneNumber } = payload;
    const response = await fetch(`${API_BASE_OAUTH}account/username/phoneNumber?phoneNumber=${phoneNumber}`, {
      method: 'POST',
      headers: getHeaders(null),
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return error;
  }
}

const updatePhone = async (payload) => {
  try {
    const { codeOTP, token, projectId, phoneNumber, phoneCountry, access_token } = payload;
    const response = await fetch(`${API_BASE_OAUTH}firebase/verified`, {
      method: 'POST',
      headers: getHeaders(access_token),
      body: JSON.stringify({ codeOTP, token, projectId, phoneNumber, phoneCountry })
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (e) {
    return "";
  }
}

const getListPackage = async ({ token, gradeId, indexPage }) => {
  try {
    const response = await fetch(`${API_BASE}package/${gradeId}/${indexPage}`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return "";
  }
}

const getPackageInfo = async ({ token, packageCode }) => {
  try {
    const response = await fetch(`${API_BASE}package/info/${packageCode}`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return "";
  }
}

const iap = async (payload) => {
  const { token, receiptData } = payload;

  if (TEST_IN_APP_PURCHASE) {
    return {
      status: 1,
      message: 'Thêm gói dev thành công'
    }
  }

  try {
    const response = await fetch(`${API_BASE}package/in-app-purchase`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ receiptData })
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return "";
  }
}

// Login with google account
const loginWithGoogle = async (payload) => {
  const { idToken, id, socialType } = payload;
  const dataLogin = {
    socialId: id,
    socialToken: idToken,
    socialType
  }
  try {
    const response = await fetch(`${API_BASE_OAUTH}account/login/social`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ dataLogin })
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return "";
  }
}


// Login with facebook account
const loginWithFacebook = async (payload) => {
  console.log("loginWithGoogle -> payload", payload)
  console.log(`${API_BASE_OAUTH}account/login/social`);
  const { accessToken, userID, socialType } = payload;
  const dataLogin = {
    socialId: userID,
    socialToken: accessToken,
    socialType
  }
  console.log("loginWithGoogle -> dataLogin", dataLogin);
  try {
    const response = await fetch(`${API_BASE_OAUTH}account/login/social`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Referer': 'https://m.k12.onluyen.vn'
      },
      body: JSON.stringify({ dataLogin })
    });
    const responseJson = await response.json();
    console.log("loginWithGoogle -> responseJson", responseJson)
    return responseJson;
  } catch (error) {
    return "";
  }
}

// update freshchatId
const updateFreshchatId = async (payload) => {
  const { token, idFreshchat } = payload;
  const body = JSON.stringify({
    idFreshchat
  })
  const response = await fetch(`${API_BASE_OAUTH}user/update/freshchat`, {
    method: 'POST',
    headers: getHeaders(token),
    body
  });
  const responseJson = await response.json();
  return responseJson
}

module.exports = {
  refreshTokenV2,
  getAccountStatistic,
  getPayment,
  upragePackageRegister,
  getListGrades,
  updateProfile,
  fetchListProcessActivity,
  checkPhoneNumber,
  registerPhoneV2,
  loginPhoneV2,
  loginWithGoogle,
  loginWithFacebook,
  forgotPasswordV2,
  changePasswordV2,
  changePassword,
  getStatisticChartBySubjectId,
  getChartBuySubjectId,
  getMateryBySubjectId,
  registerFirebasePhone,
  changeFirebasePassword,
  verifiedFirebase,
  loginUserName,
  updateMixpanelId,
  getChartContribution,
  getFlashCardTheory,
  getFlashCardVideo,
  getDataFlashCardTheory,
  getSearchAccount,
  updatePhone,
  getListPackage,
  getPackageInfo,
  iap,
  updateFreshchatId
};
