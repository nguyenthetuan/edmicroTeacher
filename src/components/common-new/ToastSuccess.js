import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
const { width } = Dimensions.get('window');
import { RFFonsize } from '../../utils/Fonts';

const ToastSuccess = (props) => {
    const { title } = props;
    return (
        <View style={styles.styleTostSuccess}>
            <Image source={require('../../asserts/images/Exclude.png')} style={{ width: 50, height: 50, marginLeft: 20 }} />
            <View>
                <Text style={styles.txtSuccess}>Thành công!</Text>
                <Text style={styles.txtSuccess}>{title}</Text>
            </View>
            <Text style={styles.xstoast}>X</Text>
        </View>
    );
}

export default ToastSuccess;

const styles = StyleSheet.create({
    styleTostSuccess: {
        flex: 1,
        height: 70,
        width: width - 70,
        backgroundColor: '#16BDA9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: "center",
        borderRadius: 10,
    },
    txtSuccess: {
        color: '#fff',
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(13),
        lineHeight: RFFonsize(17)
    },
    xstoast: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        color: "#fff",
        top: -15,
        right: 15
    }
})