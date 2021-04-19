import { StyleSheet, Dimensions, } from 'react-native';
import { RFFonsize } from '../utils/Fonts';
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    shadowBtn: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 1.5
    },

});

export default styles;
