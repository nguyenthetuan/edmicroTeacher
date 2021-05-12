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
        borderRadius: 10
    },
    rgbaColor: {
        backgroundColor: "rgba(0, 0, 0,0.5)",
        flex: 1
    }
});

module.exports = StylesPopup;