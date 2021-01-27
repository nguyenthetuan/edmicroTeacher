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

export const SubjectIds = () => {
    return [
        {
            id: "ANHTIEUHOC",
            name: "english"
        },
        {
            id: "HOCHAY",
            name: "math"
        },
        {
            id: "TOANVAO10",
            name: "math"
        },
        {
            id: "TOAN",
            name: "math"
        },
        {
            id: "VATLY",
            name: "physics"
        },
        {
            id: "SINH",
            name: "biology"
        },
        {
            id: "HOAHOC",
            name: "chemistry"
        },
        {
            id: "TIENGANH",
            name: "english"
        },
        {
            id: "LICHSU",
            name: "history"
        },
        {
            id: "DIALY",
            name: "geography"
        },
        {
            id: "GDCD",
            name: "civiceducation"
        },
        {
            id: "ANHTHCS",
            name: "english"
        },
        {
            id: "ANHTHPT",
            name: "english"
        },
        {
            id: "ANHTHPT2",
            name: "english"
        },
        {
            id: "TIENGANHTHPT3",
            name: "english10"
        },
        {
            id: "ANHGENERAL",
            name: "english"
        },
        {
            id: "NGUVANTHCS",
            name: "literature"
        },
        {
            id: "NGUVAN",
            name: "literature"
        },
        {
            id: "TOANTHCS",
            name: "math"
        },
        {
            id: "VATLITHCS",
            name: "physics"
        },
        {
            id: "LICHSUTHCS",
            name: "history"
        },
        {
            id: "DIALITHCS",
            name: "geography"
        },
        {
            id: "GDCDTHCS",
            name: "civiceducation"
        },
        {
            id: "TINHOCTHPT",
            name: "tinhoc"
        },
    ]
}


export const hasManySubjects = (subjectId) => {
    let hasManySubject = false;
    
    let data = SUBJECTS.find(item=>item.id == subjectId);
    if(data){

    }
}



export const delay = (timeout = 350) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    })
}