import React, { Component } from 'react';
import { Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import RippleButtonAnim from '../anim/RippleButtonAnim';
import { isIphoneX } from 'react-native-iphone-x-helper';
let { width } = Dimensions.get('window');

export default ButtonSquare = (props) => {
    const { color, containerStyle, isLoading, fontFamily } = props;
    return (
        <RippleButtonAnim
            containerStyle={[styles.viewButton, containerStyle]}
            onPress={props.onPress}
        >
            {!isLoading && <Text style={[styles.textButton, { color: color || '#FFF', fontFamily: fontFamily || null }]}>
                {props.title}
            </Text>}
            {isLoading &&
                <ActivityIndicator
                    color={'#ffffff'}
                    size={20}
                    style={styles.ActivityIndicator}
                />
            }
        </RippleButtonAnim>
    )
}


const styles = StyleSheet.create({
    viewButton: {
        width: width / 3,
        marginBottom: isIphoneX() ? 25 : 10,
        alignSelf: 'center',
        backgroundColor: '#55B619',
        borderRadius: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textButton: {
        fontFamily: 'Nunito-Regular',
    },
    ActivityIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 2,
        top: 0,
        bottom: 0
    },
})