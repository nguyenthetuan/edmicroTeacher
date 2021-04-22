import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import apiUserHelper from '../services/apiUserHelper';
import { Platform } from 'react-native';

const LOG_TAG_TEST = true;

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('@token', token);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('@token');
    if (value !== null && value !== '') {
      return { token: value };
    } else {
      return { token: '' };
    }
  } catch (error) {
    return '';
  }
}

const saveUserName = async (token) => {
  try {
    await AsyncStorage.setItem('@username', token);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};


export const saveFCMToken = async (token) => {
  try {
    await AsyncStorage.setItem('@FCMToken', token);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

export const getFCMToken = async () => {
  try {
    let fcmToken = await AsyncStorage.getItem('@FCMToken');
    return fcmToken;
  } catch (e) {
    return "";
  }
};

const removeItem = async (item) => {
  try {
    await AsyncStorage.setItem('RememberMe_Onluyen', item);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};
const getUserName = async () => {
  try {
    const value = await AsyncStorage.getItem('@username');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (error) {
    // Error retrieving data
    return '';
  }
};
const saveUserPass = async (token) => {
  try {
    await AsyncStorage.setItem('@userpass', token);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getUserPass = async () => {
  try {
    const value = await AsyncStorage.getItem('@userpass');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const saveUserPost = async (token) => {
  try {
    await AsyncStorage.setItem('@userpost', token);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getUserPost = async () => {
  try {
    const value = await AsyncStorage.getItem('@userpost');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const saveCodeHocMai = async (codehocmai) => {
  try {
    await AsyncStorage.setItem('@codehocmai', codehocmai);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getCodeHocMai = async () => {
  try {
    const value = await AsyncStorage.getItem('@codehocmai');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const saveAvatar = async (path) => {
  try {
    await AsyncStorage.setItem('@avatar', path);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getAvatar = async () => {
  try {
    const value = await AsyncStorage.getItem('@avatar');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const Log = (data) => {
  if (LOG_TAG_TEST) {
  }
}

const setDataCompetition = async (data) => {
  try {
    await AsyncStorage.setItem(`@competition+${data.testId}`, JSON.stringify(data));
    return 'THANH_CONG';
  } catch (e) {
    console.log('error', e)
    return e;
  }
};

const getDataCompetition = async (testId) => {
  try {
    const value = await AsyncStorage.getItem(`@competition+${testId}`);
    if (value !== null) {
      return JSON.parse(value);
    }
    return '';
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const removeDataCompetition = (testId) => {
  try {
    AsyncStorage.removeItem(`@competition+${testId}`);
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const setOnNotification = async (isOn) => {
  try {
    await AsyncStorage.setItem('@on_notification', isOn);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getOnNotification = async () => {
  try {
    const value = await AsyncStorage.getItem('@on_notification');
    return value;
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const setOnSound = async (isOn) => {
  try {
    await AsyncStorage.setItem('@on_sound', isOn);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getOnSound = async () => {
  try {
    const value = await AsyncStorage.getItem('@on_sound');
    return value;
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const setOnVibrate = async (isOn) => {
  try {
    await AsyncStorage.setItem('@on_vibrate', isOn);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
};

const getOnVibrate = async () => {
  try {
    const value = await AsyncStorage.getItem('@on_vibrate');
    return value;
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const saveLastDateOpenApp = async (date) => {
  try {
    await AsyncStorage.setItem('@last_date_open_app', date);
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
}

const getLastDateOpenApp = async () => {
  try {
    const value = await AsyncStorage.getItem('@last_date_open_app');
    return value;
  } catch (error) {
    // Error retrieving data
    return '';
  }
};

const saveQuestion = async (listQuestion) => {
  try {
    await AsyncStorage.setItem('@listQuestion', JSON.stringify(listQuestion));
    return 'THANH_CONG';
  } catch (e) {
    return e;
  }
}

const getQuestion = async () => {
  try {
    const value = await AsyncStorage.getItem('@listQuestion');
    return JSON.parse(value);
  } catch (error) {
    // Error retrieving data
    return '';
  }
}

module.exports = {
  saveToken,
  getToken,
  saveUserName,
  getUserName,
  saveUserPass,
  getUserPass,
  saveUserPost,
  getUserPost,
  saveCodeHocMai,
  saveAvatar,
  getAvatar,
  Log,
  getCodeHocMai,
  setDataCompetition,
  removeDataCompetition,
  getDataCompetition,
  setOnNotification,
  getOnNotification,
  setOnVibrate,
  getOnVibrate,
  setOnSound,
  getOnSound,
  saveLastDateOpenApp,
  getLastDateOpenApp,
  removeItem,
  saveQuestion,
  getQuestion
};
