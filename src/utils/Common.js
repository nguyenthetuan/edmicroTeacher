import { ToastAndroid, Dimensions, Alert, Platform, Clipboard } from 'react-native';
// import Clipboard from '@react-native-community/clipboard';
import Config from 'react-native-config';
import iconMath from '../asserts/icon/icon_toanV3.png';
import iconPhy from '../asserts/icon/icon_vatlyV3.png';
import iconChem from '../asserts/icon/icon_hoaV3.png';
import iconBio from '../asserts/icon/icon_sinhV3.png';
import iconLite from '../asserts/icon/icon_vanV3.png';
import iconHis from '../asserts/icon/icon_lichsuV3.png';
import iconGeo from '../asserts/icon/icon_diaV3.png';
import iconEng from '../asserts/icon/icon_eng10V3.png';
import iconEngGRM from '../asserts/icon/icon_tienganhThcsV3.png';
import iconEngPT from '../asserts/icon/icon_tienganhThcsV3.png';
import iconEducation from '../asserts/icon/icon_dgcdV3.png';
import icDefault from '../asserts/icon/icon_iconV3Default.png';
import Icon_Tin_Hoc from '../asserts/icon/icon_tinhocV3.png';
import Icon_Am_Nhac from '../asserts/icon/icon_amnhacV3.png';
import Icon_Khoa_Hoc from '../asserts/icon/icon_khoahocV3.png';
import icon_quocphongV3 from '../asserts/icon/icon_quocphongV3.png';
import icon_mythuatV3 from '../asserts/icon/icon_mythuatV3.png';

import report1 from '../asserts/appIcon/report1.png';
import report2 from '../asserts/appIcon/report2.png';
import report3 from '../asserts/appIcon/report3.png';
import report4 from '../asserts/appIcon/report4.png';
import report5 from '../asserts/appIcon/ic_true.png';
import report6 from '../asserts/appIcon/ic_false.png';
import ic_skip from '../asserts/appIcon/ic_skip.png';
import icon_percent_completed from '../asserts/icon/icon_percent_completed.png';

import icon_ComStep_GDCD from '../asserts/icon/icon_ComStep_GDCD.png';
import icon_ComStep_anh from '../asserts/icon/icon_ComStep_anh.png';
import icon_ComStep_dia from '../asserts/icon/icon_ComStep_dia.png';
import icon_ComStep_hoa from '../asserts/icon/icon_ComStep_hoa.png';
import icon_ComStep_Ngu_van from '../asserts/icon/icon_ComStep_Ngu_van.png';
import icon_ComStep_sinh_hoc from '../asserts/icon/icon_ComStep_sinh_hoc.png';
import icon_ComStep_vat_li from '../asserts/icon/icon_ComStep_vat_li.png';
import icon_ComSteplich_su from '../asserts/icon/icon_ComSteplich_su.png';
import icon_ComStepToan from '../asserts/icon/icon_ComStepToan.png';

import { isIphoneX } from 'react-native-iphone-x-helper';
import Color from '../constants/colors';
import AppIcon from './AppIcon';
import AppConst from '../constants/appConst';
const { width } = Dimensions.get('window');
const parallaxHeight = width * 670 / 1000;
const HEIGHT_TOPBAR = (Platform.OS == 'ios' ? (isIphoneX() ? 35 : 20) : 0);
export const getIconSubject = (id) => {
  switch (id) {
    case AppConst.mathID: return iconMath;
    case AppConst.mathThID: return iconMath;
    case AppConst.mathVao10ID: return iconMath;
    case AppConst.phyID: return iconPhy;
    case AppConst.phyTHCSID: return iconPhy;
    case AppConst.chemID: return iconChem;
    case AppConst.bioID: return iconBio;
    case AppConst.literID: return iconLite;
    case AppConst.literIDTHCS: return iconLite;
    case AppConst.hisID: return iconHis;
    case AppConst.hisTHID: return iconHis;
    case AppConst.geoID: return iconGeo;
    case AppConst.geoTHID: return iconGeo;
    case AppConst.engID: return iconEng;
    case AppConst.engTHPT3: return iconEng;
    case AppConst.engID2: return iconEng;
    case AppConst.engTHPTID: return iconEngPT;
    case AppConst.engTHPT2: return iconEngPT;
    case AppConst.engGRM: return iconEngGRM;
    case AppConst.engTHCS: return iconEng;
    case AppConst.gdcdID: return iconEducation;
    case AppConst.gdcdTHID: return iconEducation;
    case AppConst.tinhocID: return Icon_Tin_Hoc;
    case AppConst.stemID: return Icon_Khoa_Hoc;
    case AppConst.amnhacID: return Icon_Am_Nhac;
    case AppConst.gdqpID: return icon_quocphongV3;
    case AppConst.mythuatID: return icon_mythuatV3;
    default:
      return icDefault;
  }
};

const getIconSubjectForCompetition = (id) => {
  switch (id) {
    case AppConst.mathID: return icon_ComStepToan;
    case AppConst.mathThID: return icon_ComStepToan;
    case AppConst.mathVao10ID: return icon_ComStepToan;
    case AppConst.phyID: return icon_ComStep_vat_li;
    case AppConst.phyTHCSID: return icon_ComStep_vat_li;
    case AppConst.chemID: return icon_ComStep_hoa;
    case AppConst.bioID: return icon_ComStep_sinh_hoc;
    case AppConst.literID: return icon_ComStep_Ngu_van;
    case AppConst.literIDTHCS: return icon_ComStep_Ngu_van;
    case AppConst.hisID: return icon_ComSteplich_su;
    case AppConst.hisTHID: return icon_ComSteplich_su;
    case AppConst.geoID: return icon_ComStep_dia;
    case AppConst.geoTHID: return icon_ComStep_dia;
    case AppConst.engID: return icon_ComStep_anh;
    case AppConst.engTHPT3: return icon_ComStep_anh;
    case AppConst.engID2: return icon_ComStep_anh;
    case AppConst.engTHPTID: return icon_ComStep_anh;
    case AppConst.engTHPT2: return icon_ComStep_anh;
    case AppConst.engGRM: return icon_ComStep_anh;
    case AppConst.engTHCS: return icon_ComStep_anh;
    case AppConst.gdcdID: return icon_ComStep_GDCD;
    case AppConst.gdcdTHID: return icon_ComStep_GDCD;
    case AppConst.tinhocID: return Icon_Tin_Hoc;
    default:
      return icon_ComStep_anh;
  }
};

const getDisplaySubject = (id) => {
  switch (id) {
    case AppConst.mathID: return 'Toán';
    case AppConst.phyID: return 'Vật lí';
    case AppConst.chemID: return 'Hóa Học';
    case AppConst.bioID: return 'Sinh Học';
    case AppConst.literID: return 'Ngữ Văn';
    case AppConst.literIDTHCS: return 'Ngữ Văn THCS';
    case AppConst.hisID: return 'Lịch sử';
    case AppConst.geoID: return 'Địa lí';
    case AppConst.engID: return 'Tiếng Anh';
    case AppConst.engID2: return 'Tiếng Anh';
    case AppConst.gdcdID: return 'Giáo Dục Công Dân';
    case AppConst.gdtcID: return 'Giáo Dục Thể Chất';
    case AppConst.engTHPTID: return 'Tiếng Anh THPT';
    case AppConst.engGRM: return 'Ngữ Pháp Tiếng Anh';
    case AppConst.engTHCS: return 'Tiếng Anh THCS';
    case AppConst.khoahocID: return 'Khoa Học';
    case AppConst.mythuatID: return 'Mỹ Thuật';
    case AppConst.amnhacID: return 'Âm Nhạc';
    case AppConst.tinhocID: return 'Tin Học';
    case AppConst.mathThptID: return 'Toán THPT';
    case AppConst.mathJRID: return 'Toán';
    case AppConst.gdqpID: return 'Giáo Dục Quốc Phòng';
    case AppConst.lienmonhocID: return 'Liên môn';
    case AppConst.congngheID: return 'Công Nghệ';
    default:
      return 'Unknown variable';
  }
};

const getBackroundSubject = (id) => {
  switch (id) {
    case AppConst.mathID: return Color.bgMath;
    case AppConst.mathVao10ID: return Color.bgMath;
    case AppConst.mathThID: return Color.bgMath;
    case AppConst.mathHH: return Color.bgMath;
    case AppConst.phyID: return Color.bgPhy;
    case AppConst.phyThID: return Color.bgPhy;
    case AppConst.chemID: return Color.bgChem;
    case AppConst.chemThID: return Color.bgChem;
    case AppConst.bioID: return Color.bgBio;
    case AppConst.literID: return Color.bgLite;
    case AppConst.literIDTHCS: return Color.bgLite;
    case AppConst.hisID: return Color.bgHis;
    case AppConst.hisTHID: return Color.bgHis;
    case AppConst.geoID: return Color.bgGeo;
    case AppConst.geoTHID: return Color.bgGeo;
    case AppConst.engID: return Color.bgEng;
    case AppConst.engGRM: return Color.bgEng;
    case AppConst.engTHCS: return Color.bgEng;
    case AppConst.engTHPTID: return Color.bgEngTHPT;
    case AppConst.engTHPT2: return Color.bgEngTHPT2;
    case AppConst.engID2: return Color.bgEng;
    case AppConst.gdcdID: return Color.bgEdu;
    case AppConst.gdcdTHID: return Color.bgEdu;
    case AppConst.engTHPTID: return Color.colorMath;
    case AppConst.tinhocID: return Color.bgTinHoc
    default:
      return Color.bgLite;
  }
};

const getBackroundSubjectCompetition = (id) => {
  switch (id) {
    case AppConst.mathID: return '#334ca4';
    case AppConst.mathVao10ID: return '#334ca4';
    case AppConst.mathThID: return '#334ca4';
    case AppConst.mathHH: return '#334ca4';
    case AppConst.phyID: return '#FFA800';
    case AppConst.phyThID: return '#FFA800';
    case AppConst.chemID: return '#DB3546';
    case AppConst.chemThID: return '#DB3546';
    case AppConst.bioID: return '#4FA54E';
    case AppConst.literID: return '#834EAE';
    case AppConst.literIDTHCS: return '#834EAE';
    case AppConst.hisID: return '#eebf33';
    case AppConst.hisTHID: return '#eebf33';
    case AppConst.geoID: return '#1a8bbb';
    case AppConst.geoTHID: return '#1a8bbb';
    case AppConst.engID: return '#007069';
    case AppConst.engGRM: return '#007069';
    case AppConst.engTHCS: return '#007069';
    case AppConst.engTHPTID: return '#007069';
    case AppConst.engTHPT2: return '#007069';
    case AppConst.engTHPTID: return '#007069';
    case AppConst.gdcdID: return '#37b55b';
    case AppConst.gdcdTHID: return '#37b55b';
    case AppConst.tinhocID: return '#15b157'
    default:
      return '#007069';
  }
};

const geHighSchoolName = (gradeId) => {
  if (gradeId <= 5) return 'TH';
  else if (gradeId <= 9) return 'THCS';
  else if (gradeId <= 12) return 'THPT';
}

const roundNumber = (number) => {
  return Math.round((number + 0.00001) * 100) / 100;
}

const getIconReport = (data) => {
  switch (data) {
    case AppConst.exactly:
      return report1;
    case AppConst.speed:
      return report3;
    case AppConst.timeP:
      return report2;
    case AppConst.numFalse:
      return report6;
    case AppConst.numTrue:
      return report5;
    case AppConst.pauseCount:
      return report4;
    case AppConst.skip:
      return ic_skip;
    case AppConst.percent_completed:
      return icon_percent_completed;
    default:
      break;
  }
};


const getTitleProcess = (data) => {
  switch (data) {
    case AppConst.exactly:
      return '%';
    case AppConst.speed:
      return 'Câu/phút';
    case AppConst.timeP:
      return 'Phút';
    case AppConst.numFalse:
      return 'Câu';
    case AppConst.numTrue:
      return 'Câu';
    case AppConst.skip:
      return 'Câu';
    default:
      break;
  }
};

const getDescription = (data) => {
  switch (data) {
    case AppConst.exactly:
      return 'Chính xác';
    case AppConst.speed:
      return 'Tốc độ';
    case AppConst.timeP:
      return 'Thời gian luyện tập';
    case AppConst.numFalse:
      return 'Số câu sai';
    case AppConst.numTrue:
      return 'Số câu đúng';
    case AppConst.skip:
      return 'Số câu bỏ qua';
    default:
      break;
  }
};

const getLabel = (type) => {
  switch (type) {
    case 'Total':
      return 'Số câu';
    case 'True':
      return 'Số câu đúng';
    case 'False':
      return 'Số câu sai';
    case 'Acur':
      return 'Độ chính xác';
    case 'Speed':
      return 'Tốc độ';
    case 'Pause':
      return 'Số lần tạm dừng';
    case 'Skip':
      return 'Số lần bỏ qua';
    case 'Attempted':
      return 'Số câu đã trả lời';
    case 'ResiveLaster':
      return 'Số lần sửa lại';
    case 'UnAttempted':
      return 'Số câu chưa làm';
    case 'Time':
      return 'Thời gian làm bài (phút)';
    case 'Point':
      return 'Điểm số';
    case 'FalseAndSkip':
      return 'Số câu sai và bỏ qua';
    case 'TimePratice':
      return 'Thời gian';
    case 'TimePratice':
      return 'Thời gian';
    default:
      return '';
  }
};

const getTextColor = (type) => {
  switch (type) {
    case 'Total':
      return '#FFD044';
    case 'True':
      return '#90EA59';
    case 'False':
      return '#DB3546';
    case 'Acur':
      return '#FF6213';
    case 'Speed':
      return '#9B51E0';
    case 'Pause':
      return '#2D9CDB';
    case 'Skip':
      return '#7E96EC';
    case 'Attempted':
      return '#74B186'
    case 'ResiveLaster':
      return '#d9534f';
    case 'UnAttempted':
      return '#f0ad4e';
    case 'Time':
      return '#e07b5d';
    case 'Point':
      return '#17385b';
    case 'FalseAndSkip':
      return '#DB3546';
    default:
      return '#d9534f';
  }
};

const getIconModal = (type) => {
  switch (type) {
    case 'Total':
      return AppIcon.totalQuestion;
    case 'True':
      return AppIcon.r_correct;
    case 'False':
      return AppIcon.r_false;
    case 'Acur':
      return AppIcon.r_accuracy;
    case 'Speed':
      return AppIcon.r_speed;
    case 'Pause':
      return AppIcon.icon_number_of_pause;
    case 'Skip':
      return AppIcon.icon_number_of_skip;
    case 'Attempted':
      return AppIcon.icon_number_of_rep;
    case 'ResiveLaster':
      return AppIcon.icon_edit_exa;
    case 'UnAttempted':
      return AppIcon.Icon_non_see;
    case 'Time':
      return AppIcon.icon_Time_exa;
    case 'Point':
      return AppIcon.r_accuracy;
    case 'FalseAndSkip':
      return AppIcon.r_false;
    case 'TimePratice':
      return AppIcon.icon_Time_exa;
    case 'TimePratice':
      return AppIcon.icon_Time_exa;
    default:
      return AppIcon.Icon_non_see;
  }
}

const validatePhoneNumber = (inputtxt) => {
  const length = inputtxt.trim().length;
  if (length == 10) {
    return true;
  }
  else {
    return false;
  }
}

const convertPhoneNumber = (phoneNumber) => {
  let phone = phoneNumber.toString();
  phone = phone.replace('+84', '0');
  phone = phone.replace('(+84)', '0');
  phone = phone.replace('0084', '0');
  phone = phone.replace(/ /g, '');
  return phone;
}

const convertPhoneVN = (phoneNumber) => {
  let phone = phoneNumber.toString();
  phone = phone.replace('84', '0');
  return phone;
}


const validatePhoneNumberV2 = (phoneNumber) => {
  let flag = false;
  const carriers_number = [
    '086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039', //Viettel
    '089', '090', '093', '070', '079', '077', '076', '078', // mobile
    '091', '094', '088', '081', '082', '083', '084', '085', // vinaphone
    '099', '059', // Gmobile
    '092', '056', '058' // Vietnamobile
  ]
  if (phoneNumber) {
    let phone = convertPhoneNumber(phoneNumber);
    if (phone !== '') {
      flag = (phone.match(/^\d{10}/) && phone.length == 10 && carriers_number.includes(phone.substring(0, 3))) ? true : false
    }
  } else {
    flag = false; // when input text empty
  }
  return flag;
}

const validatePhoneNumberOld = (phoneNumber) => {
  let flag = false;
  const carriers_number11 = [
    '0162', '0163', '0164', '0165', '0166', '0167', '0168', '0169', // viettel
    '0120', '0121', '0122', '0126', '0128', // mobile
    '0123', '0124', '0125', '0127', '0129', // vinaphone
    '0199', // Gmobile
    '0186', '0188' // Vietnamobile
  ]
  const carriers_number = [
    '086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039', //Viettel
    '089', '090', '093', '070', '079', '077', '076', '078', // mobile
    '091', '094', '088', '081', '082', '083', '084', '085', // vinaphone
    '099', '059', // Gmobile
    '092', '056', '058' // Vietnamobile
  ]
  if (phoneNumber) {
    let phone = convertPhoneNumber(phoneNumber);
    if (phone !== '') {
      if (phone.length === 10) {
        flag = (phone.match(/^\d{10}/) && carriers_number.includes(phone.substring(0, 3))) ? true : false
      } else if (phone.length === 11) {
        flag = (phone.match(/^\d{11}/) && carriers_number11.includes(phone.substring(0, 4))) ? true : false
      } else {
        flag = false;
      }
    }
  } else {
    flag = false; // when input text empty
  }
  return flag;
}

const convertPhoneOldToNew = (phoneNumber) => {
  let phone = convertPhoneNumber(phoneNumber);
  let arrPhone11 = ['0162', '0163', '0164', '0165', '0166', '0167', '0168', '0169', '0120', '0121', '0122', '0126', '0128', '0123', '0124', '0125', '0127', '0129', '0186', '0188', '0199'];
  let arrPhone10 = ['032', '033', '034', '035', '036', '037', '038', '039', '070', '079', '077', '076', '078', '083', '084', '085', '081', '082', '056', '058', '059'];
  let phoneNew = phone;
  if (phone.length === 11) {
    for (var i = 0; i < arrPhone11.length; i++) {
      if (phone.startsWith(arrPhone11[i])) {
        phoneNew = phone.replace(arrPhone11[i], arrPhone10[i]);
      }
    }
  }
  return phoneNew;
}


const formatSecond = (seconds) => {
  var seconds = parseInt(seconds, 10);
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  const mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;
  if (days > 0) {
    const smnthours = hrs > 0 ? (`${hrs} giờ`) : '';
    return `${days} ngày ${smnthours}`;
  } else if (hrs > 0) {
    const smnt = mnts > 0 ? (`${mnts} phút`) : '';
    return `${hrs} giờ ${smnt}`;
  } else if (mnts > 0) {
    const sec = seconds > 0 ? (`${seconds} giây`) : '';
    return `${mnts} phút ${sec}`;
  }
  return `${seconds ? seconds : '0'} giây`;
};

const formatMinute = (minutes) => {
  if (minutes < 60) {
    return `${minutes} phút`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} giờ ${minutes % 60 === 0 ? '' : `${minutes % 60} phút`}`;
  }
  return `${Math.floor(minutes / 1440)} ngày ${Math.floor((minutes / 60) % 24) > 0 && `${Math.floor((minutes / 60) % 24)} giờ`}`;
};

const getMinuteByHour = (time) => {
  return Math.ceil(time * 60);
};

const convertSpeed = (speed) => {
  return `${getMinuteByHour(speed || '')}`; //cau /phut
}

const getNumberProcess = (data, report) => {
  switch (data) {
    case AppConst.exactly:
      return `${Math.floor(report.accuracy) || 0} ${getTitleProcess(data)}`;
    case AppConst.speed:
      return `${getMinuteByHour(report.speed || '')} ${getTitleProcess(data)}`;
    case AppConst.timeP:
      //to do handler time 
      return formatSecond(report.timePractice || 0);
    case AppConst.numFalse:
      return `${report.inCorrectAnswer || 0} ${getTitleProcess(data)}`;
    case AppConst.numTrue:
      return `${report.correctAnswer || 0} ${getTitleProcess(data)}`;
    case AppConst.skip:
      return `${report.totalSkip || 0} ${getTitleProcess(data)}`;
    default:
      break;
  }
};

const fomatPhoneVerify = (phone) => {
  try {
    let phoneNumber = phone.startsWith('+84') ? phone : `+84${phone.slice(1)}`;
    return phoneNumber;
  } catch (error) {
    return "";
  }
}


const formatPhoneNumber = (phoneNumber) => {
  try {
    let phone = phoneNumber.toString();
    phone = phone.replace('+84', '0');
    phone = phone.replace('(+84)', '0');
    phone = phone.replace('0084', '0');
    phone = phone.replace(/ /g, '');
    return phone;
  } catch (error) {
    return "";
  }
}

/**
 * Color title chapter by subjectId
 * @param {*} id 
 */
const getColorChapter = (id) => {
  switch (id) {
    case AppConst.mathID:
      return Color.colorMath;
    case AppConst.phyID:
      return Color.colorPhys;
    case AppConst.chemID:
      return Color.colorChems;
    default:
      break;
  }
};


const isSubjectMathJax = (subjectId) => {
  if (subjectId === AppConst.mathID || subjectId === AppConst.phyID || subjectId === AppConst.chemID) {
    return true;
  }
  return false;
};

const checkIsNullWithZero = (val) => {
  if (val == 0) {
    return true;
  }
  if (val != 0) {
    return !!val
  }
}

const getMessageConfirmResult = (e, phoneNumber = '') => {
  try {
    let errors = typeof e == 'object' ? e.message : e;
    if (errors.includes('auth/too-many-requests') || errors.includes('auth/unknow')) {
      return 'Tài khoản của bạn tạm thời bị khoá, Vui lòng thử lại trong một khoảng thời gian sau';
    } else {
      return 'Có lỗi xảy ra. Xin vui lòng thử lại sau';
    }
  } catch (errors) {
    return 'Có lỗi xảy ra. Xin vui lòng thử lại sau';
  }
}

const showToast = (message) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
};
const randomContent = () => {
  const content = [
    "Không có gì là không thể với một người luôn biết cố gắng.",
    "Mối nguy hiểm lớn đối với hầu hết chúng ta không phải nằm ở chỗ đặt mục tiêu quá cao rồi thất bại, mà ở chỗ đặt mục tiêu quá thấp và đạt được nó - họa sĩ",
    "Khi một cánh cửa đóng lại, một cánh cửa khác sẽ mở ra, nhưng chúng ta thường quá tiếc nuối nên mãi nhìn vào cánh cửa đã đóng lại nên không thể nhìn thấy cánh cửa khác đã mở ra cho mình",
    "Một người thành công sẽ thu được lợi ích từ những sai lầm của mình và cố gắng làm lại bằng một cách khác",
    "Thước đo thành công thực sự trong sự nghiệp thể hiện ở việc bạn có thể hài lòng, thậm chí tự hào rằng mình đã thành công dựa trên những nỗ lực của bản thân mà không để lại một dấu tích thương vong nào ",
    "Hãy làm những thứ bạn phải làm cho đến khi bạn có thể làm những thứ mình muốn làm",
    "Hãy để chúng tôi làm bệ phóng giúp bạn chạm tới ước mơ.",
    "Con người phải suốt đời trau dồi cho mình có kiến thức ngày càng rộng thêm.",
    "Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc.",
    "Những gì chúng ta biết trong ngày hôm nay ngày hôm sau sẽ lỗi thời. Nếu ngừng học tập thì chúng ta sẽ ngừng phát triển.",
    "Hãy học khi người khác ngủ, lao động khi người khác lười nhác, chuẩn bị khi người khác chơi bời và có được giấc mơ của mình khi mọi người chỉ ao ước.",
    "Hãy nên nhớ rằng : học tập thực sự hiệu quả khi nó thực sự vui thích.",
    "Bạn học được thất bại nhiều hơn thành công, vì thế đừng để thất bại khiến bạn chùn bước. Thất bại sẽ tạo nên nghị lực.",
    "Bạn vấp ngã bao nhiên lần không quan trọng, quan trọng là bạn có thể đứng dậy sau khi vấp ngã hay không.",
    "Thất bại sẽ không bao giờ hạ gục được tôi nếu quyết tâm thành công của tôi đủ lớn.",
    "Chúng ta có thể thất bại nhiều lần nhưng không thể bị đánh bại.",
    "Biết thôi chưa đủ, chúng ta phải thực hành. Muốn thôi chưa đủ, chúng ta phải hành động.",
    "Chúng ta tạo ra nỗi sợ trong khi suy nghĩ; và chỉ có thể vượt qua nỗi sợ đó bằng hành động.",
    "Hãy làm điều bạn có thể làm bằng tất cả những gì mình có, bất kể bạn đang ở đâu.",
    "Không bao giờ là quá muộn để bạn đặt ra mục tiêu hoặc mơ một giấc mơ khác.",
    "Bạn không cần phải xuất sắc khi bắt đầu, nhưng hãy bắt đầu để trở nên thật xuất sắc.",
    "Không có giới hạn nào cho những thành công bạn đạt được, ngoại trừ các giới hạn bạn tự đặt ra trong suy nghĩ của chính mình.",
    "Để thành công, khao khát thành công của bạn phải lớn hơn nỗi sợ thất bại",
  ];
  return content[Math.floor(Math.random() * content.length)];
}

export const imageDefault = 'https://thailamlandscape.vn/wp-content/uploads/2017/10/no-image.png';

export function formatNumber(number) {
  if (!number) {
    return 0;
  }
  number = number.toFixed(2) + '';
  let x = number.split('.');
  let x1 = x[0];
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + '.' + '$2');
  }
  return x1;
}


/**
 * 
 * @param {*} isAcess 
 * HIDDEN_PACKAGE false when production
 */
const isAcessUser = (isAcess) => {
  if (Config.HIDDEN_PACKAGE || Platform.OS == 'android') {
    return true;
  }
  return isAcess;
}

export const delay = (timeout = 3000) => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

export const getAvatarSource = (url) => {
  try {
    let uri = url;
    if (url.startsWith('//')) {
      uri = `https:${url}`;
    }
    return uri;
  } catch (error) {
    return '';
  }
}

export const getAvatarSourceNew = (avatar) => {
  if (avatar.startsWith('//')) {
    return `https:${avatar}`;
  } else {
    return avatar;
  }
}

export const convertNameToAvatar = (name) => {
  return name.toUpperCase().split(' ').splice(0, 2).map(item => item.split('').splice(0, 1)).join('');;
}

export const AlertNoti = (message, clickOK) => {
  Alert.alert('', message, [
    {
      text: "OK",
      onPress: clickOK
    }
  ])
}

export const roundNumberOne = (number) => {
  return Math.round((number) * 10) / 10;
}

export function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

export function roundToFour(num) {
  return +(Math.round(num + "e+4") + "e-4");
}

export const copyToClipboard = (text) => {
  if (typeof text === 'string') {
    Clipboard.setString(text);
    return true;
  }
  return false;
}

export function removeAccents(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

module.exports = {
  getIconSubject,
  getIconSubjectForCompetition,
  getBackroundSubjectCompetition,
  convertPhoneNumber,
  getDisplaySubject,
  getIconReport,
  getTitleProcess,
  isSubjectMathJax,
  getDescription,
  getNumberProcess,
  getBackroundSubject,
  showToast,
  convertSpeed,
  formatSecond,
  validatePhoneNumber,
  validatePhoneNumberV2,
  validatePhoneNumberOld,
  convertPhoneOldToNew,
  geHighSchoolName,
  getColorChapter,
  checkIsNullWithZero,
  MixpanelToken: '99416f634093fec8494af1dc56be4a4f',
  randomContent,
  roundNumber,
  convertPhoneVN,
  getLabel,
  getTextColor,
  getIconModal,
  getMessageConfirmResult,
  fomatPhoneVerify,
  formatPhoneNumber,
  isAcessUser,
  delay,
  isHideAnswerImg: true,
  getAvatarSource,
  getAvatarSourceNew,
  convertNameToAvatar,
  HEIGHT_TOPBAR,
  AlertNoti,
  roundNumberOne,
  roundToTwo,
  roundToFour,
  imageDefault,
  formatNumber,
  copyToClipboard,
  removeAccents
};
