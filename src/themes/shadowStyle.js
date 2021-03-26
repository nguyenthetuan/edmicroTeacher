import { StyleSheet, Dimensions, } from 'react-native';
import { RFFonsize } from '../utils/Fonts';
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    shadowBtn: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5
    },

});

export default styles;
