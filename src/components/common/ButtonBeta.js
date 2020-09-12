import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import RippleButton from '../libs/RippleButton';
import { isIphoneX } from 'react-native-iphone-x-helper';

export const ButtonLoading = (props) => {
    const {
        title = '',
        buttonStyle = '',
        textStyle = '',
        color = '#999',
        bgColor = '#64B2ED',
        rippleSize = 200,
        onPress = () => null,
        rippleDuration = 600,
        disabled = false,
        isLoading = false
    } = props;
    return (
        <RippleButton
            disabled={isLoading}
            onPress={onPress}
            size={rippleSize}
            rippleDuration={rippleDuration}
            color={color}
            style={[styles.buttonStyle, {
                borderWidth: 0,
                borderColor: bgColor
            }, buttonStyle]}>
            {isLoading ?
                <ActivityIndicator color={'white'} />
                :
                <Text style={[
                    styles.textButton,
                    textStyle
                ]}>{title}</Text>
            }
        </RippleButton>
    );
}

export default ButtonBeta = ({
    title = '',
    buttonStyle = '',
    textStyle = '',
    color = '#999',
    bgColor = '#64B2ED',
    rippleSize = 200,
    onPress = () => null,
    rippleDuration = 600,
    disabled = false
}) => {
    return (
        <RippleButton
            disabled={disabled}
            onPress={onPress}
            size={rippleSize}
            rippleDuration={rippleDuration}
            color={color}
            style={[styles.buttonStyle, {
                backgroundColor: 'red',
                borderWidth: 0,
                borderColor: bgColor
            }, buttonStyle]}>
            <Text style={[
                styles.textButton,
                // styles.buttonSolid,
                textStyle
            ]}>{title}</Text>
        </RippleButton>
    )
}


export const ButtonSecondaryBeta = ({
    title = '',
    buttonStyle = '',
    textStyle = '',
    color = '#BDBDBD',
    bgColor = '#fff',
    rippleSize = 200,
    onPress = () => null,
    rippleDuration = 600,
    disabled = false
}) => {
    return (
        <RippleButton
            disabled={disabled}
            onPress={onPress}
            size={rippleSize}
            rippleDuration={rippleDuration}
            color={color}
            style={[styles.buttonStyle, {
                backgroundColor: bgColor,
                borderWidth: 1,
                borderColor: '#bdbdbd'
            }, buttonStyle]}>
            <Text style={[
                styles.textButton,
                textStyle
            ]}>{title}</Text>
        </RippleButton>
    )
}

const styles = StyleSheet.create({
    textButton: {
        fontFamily: 'Nunito-Bold',
        color: '#fff',
        fontSize: 14,
    },
    buttonStyle: {
        paddingVertical: 10,
        marginVertical: 3,
        backgroundColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 30,
        width: '90%',
    },
    buttonSolid: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    }
});

