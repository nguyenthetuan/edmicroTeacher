import Config from 'react-native-config';

const getHeaders = (token) => (
    {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Referer': 'https://app.onluyen.vn'
    }
);

module.exports = {
    API_BASE: Config.API_BASE,
    API_BASE_OAUTH: Config.API_BASE_OAUTH,
    API_PROVIDER: Config.API_PROVIDER,
    API_GIFT: Config.API_GIFT,
    SITE_KEY: '6LcMZR0UAAAAALgPMcgHwga7gY5p8QMg1Hj-bmUv',
    BASE_URL: 'https://onluyen-a2989.firebaseapp.com',
    getHeaders
};