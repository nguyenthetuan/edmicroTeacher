import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
/**
 * Update version code build grade
 */
export const VERSION_CODE_ANDROID = 13;

/**
 * Update version code push
 */
export const BUILD_NUMBER_CODE_PUSH = {
    ios: '53',
    android: '37'
};

export const APP_VERSION_NAME = DeviceInfo.getVersion();

export const APP_VERSION_CODE = Platform.OS === 'ios' ? DeviceInfo.getBuildNumber() : VERSION_CODE_ANDROID;

export const getVersionName = () => {
    if (Platform.OS == 'android') {
        if (APP_VERSION_CODE == 56 || APP_VERSION_CODE == 2097208) {
            return `${APP_VERSION_NAME}.0`;
        }
        return APP_VERSION_NAME;
    } else {
        return APP_VERSION_NAME+" Beta";
    }
}

export const getBuildNumber = () => {
    let codePushVersion = Platform.OS == 'ios' ? BUILD_NUMBER_CODE_PUSH.ios : BUILD_NUMBER_CODE_PUSH.android;
    let platformName = Platform.OS == 'ios' ? 'S' : 'A';
    return `${APP_VERSION_CODE}${platformName}-${codePushVersion}`;
}


/**
 * Android
 * versionName 2.2    versionCode 56   auto update codepush 2097208
 * versionName 2.1.4  versionCode 55   auto update codepush
 * versionName 2.1.3  versionCode 54   support
 * versionName 2.1.2  versionCode 53
 * versionName 2.1.1  versionCode 52
 */


/**
 * Ios
 * versionName 2.1.2  versionCode 53   support
 * versionName 2.1.1  versionCode 52     
 * versionName 2.1.0  versionCode 51
 */