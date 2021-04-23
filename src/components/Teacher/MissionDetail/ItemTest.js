import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import shadowStyle from '../../../themes/shadowStyle';
export default function ItemTest(props) {
    const { item } = props;
    const { shadowBtn } = shadowStyle;
    return (
        <TouchableWithoutFeedback onPress={() => {
            props.show({ _id: item.testId });
        }}>
            <View style={[styles.contain, { ...shadowBtn }]}>
                <Text style={styles.styTxt} numberOfLines={1}>{item.testName}</Text>
                <View style={[styles.styWrapCount, { backgroundColor: '#FD9F4C' }]}>
                    <Text style={styles.styCount}>{item.markDone}đ</Text>
                </View>
                <View style={{ width: 10 }} />
                {/* <View style={styles.styWrapCount}>
                <Text style={styles.styCount}>{item.countDone}</Text>
            </View> */}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    contain: {
        marginHorizontal: 20,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        backgroundColor: '#fff'

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
        marginLeft: 5
    },
    styCount: {
        color: '#fff',
        fontFamily: 'Nunito-Regular',
        letterSpacing: 0
    }
})