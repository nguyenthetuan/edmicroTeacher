import * as yup from 'yup';

const Max_Leng_Password = 28;
const Min_Leng_Password = 6;

const Min_Leng_Username = 4;
const Max_Leng_Username = 28;

const Min_Leng_Stand = 2;
const Max_Leng_Stand = 28;

const USERNAME = 'Tên đăng nhập';
const PHONENUMBER = 'Số điện thoại';
const PASSWORD = 'Mật khẩu';
const CONFIRMPASSWORD = 'Xác thực mật khẩu';
const FIRST_NAME = 'Họ';
const LAST_NAME = 'Tên';
const EMAIL = 'Email';
const DISPLAY_NAME = 'Tên hiển thị';

const REG_MATH_UPPERCASE = /(?=.*[A-Z])/;

const getRequireMessage = (name, value) => `${name} không được để trống!`;
const getMinLengMessage = (name, value) => `${name} phải chứa ít nhất ${value} kí tự!`;
const getMaxLengMessage = (name, value) => `${name} chứa nhiều nhất ${value} kí tự!`;
const getMatchesIncludeUpperCase = (name) => `${name} phải chứa ít nhất 1 kí tự chữ Hoa!`;
const getInvalidEmail = () => `Email không hợp lệ`;

const phoneRegExp = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/

export const username = yup
    .string()
    .min(Min_Leng_Username, getMinLengMessage(USERNAME, Min_Leng_Username))
    .max(Max_Leng_Username, getMaxLengMessage(USERNAME, Max_Leng_Username))
    .required(getRequireMessage(USERNAME));

export const usernameSignIn = yup
    .string()
    .required(getRequireMessage(USERNAME));

export const password = yup
    .string()
    .min(Min_Leng_Password, getMinLengMessage(PASSWORD, Min_Leng_Password))
    .max(Max_Leng_Password, getMaxLengMessage(PASSWORD, Max_Leng_Password))
    .matches(
        REG_MATH_UPPERCASE,
        getMatchesIncludeUpperCase(PASSWORD)
    )
    .required(getRequireMessage(PASSWORD));

export const passwordSignIn = yup
    .string()
    .required(getRequireMessage(PASSWORD));

export const rePassword = yup.string()
    .when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Cả hai mật khẩu cần phải giống nhau"
        )
    }).required(getRequireMessage(CONFIRMPASSWORD));

export const confirmPassword = yup
    .string()
    .min(Min_Leng_Password, getMinLengMessage(CONFIRMPASSWORD, Min_Leng_Password))
    .max(Max_Leng_Password, getMaxLengMessage(CONFIRMPASSWORD, Max_Leng_Password))
    .matches(
        REG_MATH_UPPERCASE,
        getMatchesIncludeUpperCase(CONFIRMPASSWORD)
    )
    .required(getRequireMessage(CONFIRMPASSWORD));

export const phoneNumber = yup.string()
    .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
    .required(getRequireMessage(PHONENUMBER));

// export const phoneNumber = yup
//     .string()
//     .min(10, getMinLengMessage(PHONENUMBER, 10))
//     .max(10, getMaxLengMessage(PHONENUMBER, 10))
//     .required(getRequireMessage(PHONENUMBER));

export const firstName = yup
    .string()
    .min(Min_Leng_Stand, getMinLengMessage(FIRST_NAME, Min_Leng_Stand))
    .max(Max_Leng_Stand, getMaxLengMessage(FIRST_NAME, Max_Leng_Stand))
    .required(getRequireMessage(FIRST_NAME));

export const lastName = yup
    .string()
    .min(Min_Leng_Stand, getMinLengMessage(LAST_NAME, Min_Leng_Stand))
    .max(Max_Leng_Stand, getMaxLengMessage(LAST_NAME, Max_Leng_Stand))
    .required(getRequireMessage(LAST_NAME));

export const email = yup
    .string()
    .max(Max_Leng_Stand, getMaxLengMessage(EMAIL, Max_Leng_Stand))
    .email(getInvalidEmail())
    .required(getRequireMessage(EMAIL));

export const displayName = yup
    .string()
    .min(Min_Leng_Stand, getMinLengMessage(DISPLAY_NAME, Min_Leng_Stand))
    .max(Max_Leng_Stand, getMaxLengMessage(DISPLAY_NAME, Max_Leng_Stand))
    .required(getRequireMessage(DISPLAY_NAME));
