import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default Nav = ({ title }) => {
    return (
        <View style={styles.nav}>
            <Text style={styles.textNav}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    nav: {
        paddingLeft: 20,
        borderColor: '#ececec',
        justifyContent: 'center',
        height: 20
    },
    textNav: {
        fontSize: 16,
        color: '#828282',
        fontWeight: 'bold',
        fontFamily: 'Nunito-Bold'
    },
});
