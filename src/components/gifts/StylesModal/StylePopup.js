import { StyleSheet, Dimensions } from 'react-native';
import { RFFonsize } from "../../../utils/Fonts";
const { width, height } = Dimensions.get('window');

const StylesPopup = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: '#f0f0f0',
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
        textAlign: 'center',
        marginTop: 16,
    },
    header: {
        marginHorizontal: 16,
        marginTop: 20
    },
    titleFirst: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(20),
        color: "#000",
    },
    titleTwo: {
        fontFamily: 'Nunito-Italic',
        fontSize: RFFonsize(16),
        fontWeight: "700",
        lineHeight: RFFonsize(20),
        color: "#F9408F",
    },
    titleThree: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        color: "#316ECE",
        marginTop: 8
    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
        alignItems: 'center'
    },
    txtTuto: {
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        fontFamily: "Nunito-Bold",
        color: "#000",
    },
    txtCount: {
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        fontFamily: "Nunito",
        color: "#000",
        marginTop: 10
    },
    viewTables: {
        paddingHorizontal: 16,
    }
});

module.exports = StylesPopup;