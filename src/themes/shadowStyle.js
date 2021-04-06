import { StyleSheet, Dimensions, } from 'react-native';
import { RFFonsize } from '../utils/Fonts';
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    shadowBtn: {
        shadowColor: "#c4c4c4",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.20,
        shadowRadius: 5,
        elevation: 4
    },

});

export default styles;
