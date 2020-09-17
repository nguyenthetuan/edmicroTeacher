import jwtDecode from 'jwt-decode';

export const getUserByToken = (token) => {
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
        phoneNumber
    }
}