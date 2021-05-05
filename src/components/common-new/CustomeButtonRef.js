import React, { Component, forwardRef } from 'react'
import { TouchableWithoutFeedback, View, Image, StyleSheet } from 'react-native'

const button_size = 40;

const CustomeButton = (props, ref) => {
    return (
        <TouchableWithoutFeedback
            ref={ref}
            onPress={props.onPress}
        >
            <View
                style={[styles.button, props.style]}>
                <Image source={props.icon} style={{ tintColor: props.tintColor || '#383838' }} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const CustomeButtonRef = forwardRef(CustomeButton);

export { CustomeButtonRef };

const styles = StyleSheet.create({
    button: {
        width: button_size,
        height: button_size,
        justifyContent: 'center',
        alignItems: 'center',
    },
});