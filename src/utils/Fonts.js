
import { RFValue } from "react-native-responsive-fontsize";
import { Platform, Dimensions } from 'react-native';
import { WINDOW } from '../constants/const';
const { width, height } = WINDOW;
import DeviceInfo from 'react-native-device-info';

export const RFFonsize = (value, standardScreenHeight = 680) => {
    return (Platform.isPad || DeviceInfo.isTablet()) ? value : RFValue(value, standardScreenHeight)
}

export const RFLineHeight = (value, standardScreenHeight = 680) => {
    return (Platform.isPad || DeviceInfo.isTablet()) ? value : RFValue(value, standardScreenHeight)
}

export const RFSquare = (value, standardScreenHeight = 680) => {
    return (Platform.isPad || DeviceInfo.isTablet()) ? value : (height / standardScreenHeight * value);
}

export const RFWidth = (value, standardScreenWidth = 375) => {
    return (Platform.isPad || DeviceInfo.isTablet()) ? value : (width / standardScreenWidth * value);
}

export const RFHeight = (value, standardScreenHeight = 680) => {
    return Platform.isPad ? value : (height / standardScreenHeight * value);
}