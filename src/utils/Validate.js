/**
 * 
 *  matchRegexp
    isEmail
    isEmpty
    required
    trim
    isNumber
    isFloat
    isPositive
    minNumber
    maxNumber
    minFloat
    maxFloat
    minStringLength
    maxStringLength
    isString
 */

export const required = value => ((value != '' && value != undefined) ? undefined : 'Vui lòng điền thông tin');
export const isEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(value) ? 'Email không hợp lệ' : undefined;
export const minStringLength = min => value => value && value.length < min ? `Tối thiểu ${min} kí tự` : undefined;
export const maxStringLength = max => value => value && value.length > max ? `Tối đa ${max} kí tự` : undefined;
export const comparePassword = f => value => value != f ? `Xác nhận mật khẩu không đúng` : undefined;
export const isNumber = value => value.match(/^\d+$/g) ? undefined : ' Phải là chữ số';
export const strongPassword = f => (value) => (f.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)[a-zA-Z0-9\S]{8,16}$/) ? undefined : ' must include uppercase and lowercase letters, numbers.');
export const maxSafeInteger = value => Number.parseInt(value) < 1000000 ? undefined : 'Giá trị không hợp lệ';
export const isPhoneNumber = value => (value && value.match(/^\d{10}$/)) ? undefined : 'Vui lòng nhập đúng số điện thoại';