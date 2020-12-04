import React, { Component } from 'react'
import { View, Text } from 'react-native'
import MenuStyle from './MenuStyle';

export default function Version(props) {
    return (
        <Text style={MenuStyle.textVersion}>Version : {props.version}</Text>
    );
}