import { StyleSheet, Dimensions } from 'react-native';
import { RFFonsize } from "../../../utils/Fonts";
const { width, height } = Dimensions.get('window');

const StylesPopup = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: '#fff',
        marginVertical: height * 0.1,
        marginHorizontal: width * 0.05,
        flexDirection: 'column',
        borderRadius: 10,
        zIndex: 1
    },
    rgbaColor: {
        backgroundColor: "rgba(0, 0, 0,0.4)",
        flex: 1
    },
    timeStart: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(20),
        lineHeight: RFFonsize(24),
        color: '#F9408F'
    },
    timeEnd: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
        color: '#01CFFF'
    },
    imageAction: {
        width: width - 90,
        alignSelf: 'center'
    },
    actionDia: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#1F87DD',
        textAlign: 'center'
    },
    viewExample: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginHorizontal: 16
    },
    text: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: "#000",
        paddingHorizontal: 16,
        marginVertical: 3,
    },
    optionTitle: {
        marginTop: 16
    },
    allPrices: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
        color: "#000",
        textAlign: 'center'
    }
});

module.exports = StylesPopup;