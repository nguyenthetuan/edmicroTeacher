import { Platform } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const top = isIphoneX() ? 30 : Platform.OS == 'ios' ? 15 : 5;

module.exports = {
    activityIndicator: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderRadius: 25,
        borderTopLeftRadius: 25,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderColor: '#fff'
    },
    wrapItem: {
        marginHorizontal: 10,
        paddingTop: 7,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    backPress: {
        paddingHorizontal: 10,
    },
    wrapBackPress: {
        position: 'absolute',
        top: top
    }
}