import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default InputPrimary = (props) => {
    getLabel = () => {
        try {
            const { label, isValid, error } = props;
            if (!isValid && error) {
                return error;
            }
            return label;
        } catch (error) {
            return label;
        }
    }

    getBorderColor = () => {
        try {
            const { label, isValid, error } = props;
            if (!isValid && error) {
                return '#FF7300';
            }
            return '#B5B5B5';
        } catch (error) {
            return '#B5B5B5';
        }
    }

    getLabelColor = () => {
        try {
            const { label, isValid, error } = props;
            if (!isValid && error) {
                return '#FF7300';
            }
            return '#000';
        } catch (error) {
            return '#000';
        }
    }

    return (
        <View style={[
            styles.containerStyle,
            {
                borderColor: this.getBorderColor()
            },
            props.containerStyle]}>
            <Text numberOfLines={1} style={[styles.labelStyle,
            { color: this.getLabelColor() },
            props.labelStyle]}>{this.getLabel()}</Text>
            <TextInput
                {...props}
                value={props.value}
                placeholderTextColor={'#BDBDBD'}
                style={[styles.textInput, props.textInputStyle]} />
        </View>
    );
}


const styles = StyleSheet.create({
    containerStyle: {
        height: 54,
        borderWidth: 1,
        borderColor: '#B5B5B5',
        justifyContent: 'center',
        borderRadius: 54,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    labelStyle: {
        position: 'absolute',
        top: -10,
        left: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        fontFamily: 'Nunito-Regular',
        fontSize: 16
    },
    textInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 16,
        paddingHorizontal: 10,
        color: '#000',
        fontFamily: 'Nunito-Regular'
    },
});