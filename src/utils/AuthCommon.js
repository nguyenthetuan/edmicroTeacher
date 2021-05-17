import { NavigationActions, StackActions } from 'react-navigation';
import apiHelper from '../services/apiUserHelper';
import { Alert } from 'react-native';

const status = {
    school: 1,
    student: 2
}

export const LOGIN_TYPE = {
    PHONE: 'ACCOUNTKIT',
    USERNAME: 'Username',
    SOCIAL: 'Social',
    APPLE: 'APPLE'
}

export const isExpried = (exp, curTime) => {
    let time = Number.parseInt(curTime) - Number.parseInt(exp);
    return time >= -300; // need chan
  };
  
  export const isRefresh = (exp, curTime, iat) => {
    let expNumber = Number.parseInt(exp);
    let curTimeNumber = Number.parseInt(curTime);
    let iatNumber = Number.parseInt(iat);
    return expNumber - curTimeNumber < 300 || curTimeNumber - iatNumber > 14700; // 4h5 -> 5h55 
  };
  

export const authenRedirect = (CreateBySchool, GradeId, Role, navigation) => {
    // giao vien
    if (Role && Role.includes('TEACHER') && !Role.includes('STUDENT')) {
        gotoAppTeacher(navigation);
        return;
    } else {
        gotoAppOther();
    }
}

function gotoAppTeacher(navigation) {
    navigation.navigate('Teacher', { statusbar: 'dark-content', status: status });
}


function gotoAppOther() {
    Alert.alert('', 'Tài khoản của bạn dành cho app học sinh, bạn vui lòng tải app dành riêng cho học sinh');
    this.setState({ isLoading: false });
}


function gotoGrade(navigation, status) {
    navigation.navigate('Grades', { statusbar: 'dark-content', status: status });
}

export async function getResponseAuth(userObj) {
    let res = '';
    try {
        let loginType = userObj.loginType;
        switch (loginType) {
            case LOGIN_TYPE.SOCIAL:
                res = await apiHelper.loginWithSocial(userObj);
                break;
            case LOGIN_TYPE.USERNAME:
                res = await apiHelper.loginUserName(userObj);
                break;
            case LOGIN_TYPE.APPLE:
                res = await apiHelper.loginUserName(userObj);
                break;
            default:
                res = await apiHelper.loginPhoneV2(userObj);
                break;
        }
        return res;
    } catch (error) {
        return '';
    }

}

export const isSchool = (CreateBySchool) => {
    return CreateBySchool && CreateBySchool !== '0';
}

