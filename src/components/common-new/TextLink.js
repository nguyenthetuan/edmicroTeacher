import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { RFFonsize } from '../../utils/Fonts';

const TextLink = (props) => {
    const { title, onPress } = props;
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.textLink, {
                textDecorationLine: 'underline',
                color: '#757575',
                fontFamily: 'Nunito-Regular'
            }]}>{title}</Text>
        </TouchableOpacity>
    );
}

export default TextLink;

const styles = StyleSheet.create({
    textLink: {
        color: "#828282",
        alignSelf: 'center',
        fontSize: 14,
        fontFamily: 'Nunito-Regular',
    },
});