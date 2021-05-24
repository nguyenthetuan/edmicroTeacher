import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
const { width } = Dimensions.get('window');
import { RFFonsize } from '../../utils/Fonts';

const ToastFaild = (props) => {
    const { title } = props;
    return (
        <View style={styles.styleTostFaild}>
            <Text style={styles.txtFaild}>{title}</Text>
        </View>
    );
}

export default ToastFaild;

const styles = StyleSheet.create({
    styleTostFaild: {
        // flex: 1,
        height: 30,
        // width: width - 150,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        // flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 10,
    },
    txtFaild: {
        color: '#fff',
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
    },
})