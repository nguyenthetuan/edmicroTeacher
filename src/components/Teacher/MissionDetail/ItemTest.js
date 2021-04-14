import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export default function ItemTest(props) {
    const { item } = props;
    return (
        <TouchableWithoutFeedback onPress={() => {
            props.show({ _id: item.testId });
        }}>
            <View style={styles.contain}>
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
        borderWidth: 1,
        marginHorizontal: 20,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        borderColor: '#56CCF2',
        flexDirection: 'row',
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