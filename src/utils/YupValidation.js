import * as yup from 'yup';
import {
    username,
    phoneNumber,
    password,
    rePassword,
    confirmPassword,
    firstName,
    lastName,
    email,
    displayName,
    goalName
} from './ValidationConfig';

export const singinValidate = yup.object().shape({
    username: username,
    password: password
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
