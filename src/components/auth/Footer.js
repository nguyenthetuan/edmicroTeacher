import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RFFonsize } from '../../utils/Fonts';
const Footer = ({ title, link, onPress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.textLink}>{link}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 30,
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 10,
    },
    title: {
        color: '#828282',
        fontSize: RFFonsize(12),
        fontFamily: 'Nunito-Regular',
    },
    textLink: {
        color: "#56CCF2",
        alignSelf: 'center',
        fontFamily: 'Nunito-Regular',
        textDecorationLine: 'underline',
        fontSize: RFFonsize(12)
    }
});

export default Footer;