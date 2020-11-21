import * as yup from 'yup';
import {
    username,
    usernameSignIn,
    phoneNumber,
    passwordSignIn,
    password,
    rePassword,
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
    rePassword: rePassword,
    displayName: displayName
});

export const forgotPasswordValidate = yup.object().shape({
    phoneNumber: phoneNumber,
    // password: password,
    // rePassword: rePassword
});