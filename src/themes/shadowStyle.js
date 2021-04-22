import { StyleSheet, Dimensions, } from 'react-native';
import { RFFonsize } from '../utils/Fonts';
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    shadowBtn: {
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 3
    },

});

export default styles;
