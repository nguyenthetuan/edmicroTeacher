import { Dimensions, Platform } from 'react-native';
export const INPUT_PHONE = 'INPUT_PHONE';
export const RESULT_UPGRADE = 'RESULT_UPGRADE';
export const STICKEY_HEIGHT = 80;
export const PARAJAX_HEADER_HEIGHT = 200;
export const UP_GRADE = 'UP_GRADE';
export const MULTI_VALUE = 0;
export const SINGLE_VALUE = 1;
export const WIDTH_DEVICE = Dimensions.get('window').width;
export const HEIGHT_DEVICE = Dimensions.get('window').height;
export const WIDTH_LOGO = HEIGHT_DEVICE / 4;
export const MAGBOT_LOGO = HEIGHT_DEVICE / 20;
export const CONTAINER_FORM_WIDTH = 270;
export const GESTURESENABLED = true;
export const REQUEST_TIME_OUT = 30000;
export const PHONE_DEBUG = ['367851356', '847700356'];
export const DATA_YEAR = [
    { name: '2020-2021', year: '2020' },
    { name: '2019-2020', year: '2019' },
    { name: '2018-2019', year: '2018' },
]

/**
 * Need change when upload store
 */
export const APP_VERSION = Platform.OS == 'ios' ? '1.0' : '1.0';