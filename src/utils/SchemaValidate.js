import * as yup from 'yup';
import {
    username,
    usernameSignIn,
    phoneNumber,
    passwordSignIn,
    password,
    rePassword,
    reNewPassword,
    confirmPassword,
    firstName,
    lastName,
    email,
    displayName,
    goalName
} from './ValidationConfig';

export const singInValidate = yup.object().shape({
    username: usernameSignIn,
    password: passwordSignIn
});


export const singUpValidate = yup.object().shape({
    phoneNumber: phoneNumber,
    password: password,
    repassword: rePassword,
    displayName: displayName
});

export const forgotPasswordValidate = yup.object().shape({
    password: password,
    repassword: rePassword,
});

export const phoneNumberScheme = yup.object().shape({
    phoneNumber: phoneNumber,
});

export const changePasswordValidate = yup.object().shape({
    passwordOld: passwordSignIn,
    passwordNew: password,
    passwordNewAgain: reNewPassword
});