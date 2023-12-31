import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';
export default function ItemPactice(props) {
    const { item } = props;
    const { shadowBtn } = shadowStyle;
    return (
        <TouchableWithoutFeedback onPress={() => {
            props.show({ _id: item.problemId });
        }}>
            <View style={[styles.contain, { ...shadowBtn }]}>
                <Text style={styles.styTxt} numberOfLines={1}>{item.problemName}</Text>
                <View style={{}} />
                <Text style={styles.styCount}> Yêu cầu hoàn thành: <Text style={{ color: '#6ED8FB' }}>{item.percentDone}%</Text></Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    contain: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'column',
    },
    styTxt: {
        fontFamily: 'Nunito-Regular',
        color: '#828282',
        flex: 1
    },
    styWrapCount: {
        backgroundColor: '#6ED8FB',
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    styCount: {
        color: '#828282',
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        letterSpacing: 0,
        alignSelf: 'flex-end',
        marginTop: 5
    }
})