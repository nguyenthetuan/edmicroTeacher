import React, { Component } from 'react'
import { View, TouchableWithoutFeedback, SafeAreaView, Keyboard, StyleSheet } from 'react-native'

export const Material = (props) => {
    const { backgroundColor } = props;
    return (
        <View style={[
            styles.container, {
                backgroundColor: backgroundColor
            },
            props.style
        ]} >
            <SafeAreaView style={{ flex: 1 }}>
                {props.children}
            </SafeAreaView>
        </View>
    );
}


export const MaterialKeyBoard = (props) => {
    const { backgroundColor } = props;
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={[
                styles.container,
                { backgroundColor: backgroundColor },
                props.style
            ]} >
                <SafeAreaView style={{ flex: 1 }}>
                    {props.children}
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});