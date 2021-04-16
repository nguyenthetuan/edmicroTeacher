import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');
export const INPUT_PHONE = 'INPUT_PHONE';
export const RESULT_UPGRADE = 'RESULT_UPGRADE';
export const STICKEY_HEIGHT = 80;
export const PARAJAX_HEADER_HEIGHT = 200;
export const UP_GRADE = 'UP_GRADE';
export const MULTI_VALUE = 0;
export const SINGLE_VALUE = 1;
export const WIDTH_DEVICE = Dimensions.get('window').width;
export const HEIGHT_DEVICE = Dimensions.get('window').height;
export const SCREEN_WIDTH = width < height ? width : height;
export const SCREEN_HEIGHT = width < height ? height : width;
export const WIDTH_LOGO = HEIGHT_DEVICE / 4;
export const MAGBOT_LOGO = HEIGHT_DEVICE / 20;
export const CONTAINER_FORM_WIDTH = 270;
export const GESTURESENABLED = true;
export const REQUEST_TIME_OUT = 30000;
export const PHONE_DEBUG = ['367851356', '847700356'];
export const WINDOW = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
export const COL_STATISTATIC_WIDTH = 56;

export const DATA_YEAR = [
    { name: '2020-2021', year: '2020' },
    { name: '2019-2020', year: '2019' },
    { name: '2018-2019', year: '2018' },
]

/**
 * Need change when upload store
 */
export const APP_VERSION = Platform.OS == 'ios' ? '1.11' : '1.6';

export const CODE_PUSH_VERSION = 'Update At : 18:00 29/03/2021';

export const TOKEN_EXP = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzdiZTMyYS1kZGQ0LTQ1YWYtYTU4ZS0wNjhkYWY3YjNhYTYiLCJpYXQiOjE2MTYxMDkyNjYsIkVtYWlsIjoiODQzOTY5NDkwODRAb25sdXllbi52biIsImVtYWlsQ29uZmlybWVkIjp0cnVlLCJ1c2VySWQiOiI1ZTZjZjQwNDRmZmQ1MjAwMDEwOGUwZGIiLCJhdmF0YXIiOiJodHRwczovL2F2YXRhci5vbmx1eWVuLnZuLzVlNmNmNDA0NGZmZDUyMDAwMTA4ZTBkYi82MDE5MTM1NzRjMzNmOTQ0NDZiZTdkMWQuanBnIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI1ZTZjZjQwNDRmZmQ1MjAwMDEwOGUwZGIiLCJ1c2VyTmFtZSI6Ijg0Mzk2OTQ5MDg0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6Ijg0Mzk2OTQ5MDg0IiwiaXNWZXJpZmllZCI6dHJ1ZSwidW5pcXVlX25hbWUiOiI4NDM5Njk0OTA4NCIsInN1YiI6Ijg0Mzk2OTQ5MDg0IiwiR3JhZGVJZCI6IkMxIiwiRGlzcGxheU5hbWUiOiJCaeG7h24gVsSDbiBTxqFuIiwiQmlydGhkYXkiOiIyMDIwLTExLTA3IiwiUHJvdmluY2VJZCI6Ii0xIiwiRGlzdHJpY3RJZCI6Ii0xIiwiUGhvbmVOdW1iZXIiOiI4NDg0NzcwMDM1NiIsIlNjaG9vbFllYXIiOjIwMjAsIlJvbGUiOiJTVFVERU5UIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU1RVREVOVCIsIlNjaG9vbElkIjoiLTEiLCJDcmVhdGVCeURPRVQiOi0xLCJjb2RlQXBwIjoiT05MVVlFTiIsImlkTWl4cGFuZWwiOiI5OTQxNmY2MzQwOTNmZWM4NDk0YWYxZGM1NmJlNGE0ZiIsImlkRnJlc2hjaGF0IjoiOWIzYzBiYTUtYTMwNS00NDk2LWE1N2QtZWI5M2FjYmU2MTEyIiwicHJpY2luZyI6ZmFsc2UsInRpbWVQcmljaW5nIjowLCJuZWVkQ2hhbmdlUGFzc3dvcmQiOmZhbHNlLCJwYWNrYWdlcyI6WyI1NTc5NSIsIjY0RTZGIiwiRUM4MDMiXSwibmJmIjoxNjE2MTA5MjY2LCJleHAiOjE2MTYxMzA4NjYsImlzcyI6IkVETUlDUk8iLCJhdWQiOiJPTkxVWUVOLlZOIn0.yJlDRdgGssvidupfG9396ZOnPSizEccxffVrKdYMIbY';