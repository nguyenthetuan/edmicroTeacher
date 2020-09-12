import { Platform, ToastAndroid } from 'react-native';
import {
    API_BASE_EDMICRO, API_BASE_OAUTH_EDMICRO, API_BASE_ONLUYEN, API_BASE_OAUTH_ONLUYEN, API_PROVIDER,
    API_BASE_OAUTH_STAGING, API_BASE_STAGING, API_BASE_ONLUYEN_DEV, API_BASE_OAUTH_ONLUYEN_DEV
} from './http';
import { API_TYPE } from './const';

const getHeaders = (token) => (
    {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Referer': 'https://m.k12.onluyen.vn'
    }
);

switch (API_TYPE) {
    case 1:
        Platform.OS == 'android' && ToastAndroid.show('App API developer !', ToastAndroid.SHORT);
        module.exports = {
            API_BASE: API_BASE_EDMICRO,
            API_BASE_OAUTH: API_BASE_OAUTH_EDMICRO,
            API_PROVIDER: API_PROVIDER,
            getHeaders
        };
        break;
    case 2:
        Platform.OS == 'android' && ToastAndroid.show('App API staging !', ToastAndroid.SHORT);
        module.exports = {
            API_BASE: API_BASE_STAGING,
            API_BASE_OAUTH: API_BASE_OAUTH_STAGING,
            API_PROVIDER: API_PROVIDER,
            getHeaders
        };
        break;
    case 3:
        Platform.OS == 'android' && ToastAndroid.show('App API DEV !', ToastAndroid.SHORT);
        module.exports = {
            API_BASE: API_BASE_ONLUYEN_DEV,
            API_BASE_OAUTH: API_BASE_OAUTH_ONLUYEN_DEV,
            API_PROVIDER: API_PROVIDER,
            getHeaders
        };
        break;
    default:
        module.exports = {
            API_BASE: API_BASE_ONLUYEN,
            API_BASE_OAUTH: API_BASE_OAUTH_ONLUYEN,
            API_PROVIDER: API_PROVIDER,
            getHeaders
        };
        break;
}