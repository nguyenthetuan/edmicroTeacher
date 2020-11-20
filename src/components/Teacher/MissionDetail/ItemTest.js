import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ItemTest(props) {
    const { item } = props;
    return (
        <TouchableOpacity style={styles.contain} onPress={() => {
            props.show({ _id: item.testId });
        }}>
            <Text style={styles.styTxt} numberOfLines={1}>{item.testName}</Text>
            <View style={styles.styWrapCount}>
                <Text style={styles.styCount}>{item.countDone}</Text>
            </View>
        </TouchableOpacity>
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
    },
    styCount: {
        color: '#fff',
        fontFamily: 'Nunito-Regular',
        letterSpacing: 0
    }
})