import { StyleSheet, Dimensions, } from 'react-native';
import { RFFonsize } from '../utils/Fonts';
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    shadowBtn: {
        shadowColor: "#f0f0f0",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 1.5
    },

});

export default styles;
