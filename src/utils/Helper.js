import jwtDecode from 'jwt-decode';

export const getUserByToken = (token) => {
    const timeCached = new Date().getTime();
    const {
        GradeId: gradeId,
        userId,
        DisplayName: displayName,
        SchoolId: schoolId,
        Gender: gender,
        codeApp,
        CreateBySchool: createBySchool,
        userName,
        PhoneNumber: phoneNumber,
    } = jwtDecode(token);

    return {
        gradeId,
        userId,
        displayName,
        schoolId,
        gender,
        codeApp,
        createBySchool,
        userName,
        phoneNumber,
        timeCached
    }
}


export const getSourceAvatar = (userId, timeCached = new Date().getTime()) => {
    // https://s3-ap-southeast-1.amazonaws.com/onluyen-avatar/
    return {
        uri: `https://s3-ap-southeast-1.amazonaws.com/onluyen-avatar/${userId}.jpg?time=${timeCached}`
    }
}


export const getSourceAvatarOwl = (source) => {
    // https://s3-ap-southeast-1.amazonaws.com/onluyen-avatar/
    return {
        uri: source.replace('s3-ap-southeast-1.amazonaws.com/onluyen-avatar', 'avatar.onluyen.vn')
    }
}



export const delay = (timeout = 350) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    })
}