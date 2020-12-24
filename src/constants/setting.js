import Config from 'react-native-config';

const getHeaders = (token) => (
    {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Referer': 'https://m.k12.onluyen.vn'
    }
);

module.exports = {
    API_BASE: Config.API_BASE,
    API_BASE_OAUTH: Config.API_BASE_OAUTH,
    API_PROVIDER: Config.API_PROVIDER,
    API_GIFT: Config.API_GIFT,
    getHeaders
};