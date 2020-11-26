import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const Row = (props) => {
    const { style, children } = props;
    return (
        <View style={[{ flexDirection: 'row' }, style]}>
            {children}
        </View>
    )
}

export const TextValidate = (props) => {
    const { errors } = props;
    return (
        <Text
            style={[
                styles.textValidate,
                {
                    marginBottom: 15
                }
            ]}
        >
            {errors}
        </Text>
    )
}

export const SizedBox = (props) => {
    const { width, height } = props;
    return (
        <View style={{ width: width, height: height }} />
    );
}

const styles = StyleSheet.create({
    textValidate: {
        alignSelf: 'center',
        color: '#d9534f',
        fontSize: 13,
        fontFamily: 'Nunito-Regular',
    }
})