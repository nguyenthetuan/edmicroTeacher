import { StyleSheet, Dimensions } from 'react-native';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');
const HomeStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    top: {
        flex: 0,
        backgroundColor: "transparent",
    },
    body: {
        flex: 1
    },
    backGrou: {
        marginVertical: 16,
        marginHorizontal: 16,
        borderRadius: 5,
        flexDirection: "column",
    },
    titleWell: {
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        textAlign: "center",
        color: "#fff",

    },
    descript: {
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        textAlign: "center",
        color: "#fff",
        marginHorizontal: 14.5,
        marginVertical: 8,

    },
    iconDes: {
        alignSelf: 'flex-end',
        right: 10,
        top: 10,
        tintColor: '#fff',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 2,
    },
    header: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        right: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: '#fff',
    }

});

module.exports = HomeStyle;