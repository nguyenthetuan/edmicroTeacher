/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 04:20:50
 * @modify date 2018-04-17 04:20:50
 * @desc [description]
*/

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
 * false Production
 */
export const HIDDEN_PACKAGE = false;

/**
 * false Production
 */
export const TEST_IN_APP_PURCHASE = false;

/**
 * Need change when upload store
 */
export const APP_VERSION = Platform.OS == 'ios' ? '1.0' : '1.3';

/**
 * 0 Production
 * 1 Alpha
 * 2 Staging
 * 3 Develop
 */
export const API_TYPE = 0;


/**
 * Add react-native-chart-kit
 */



