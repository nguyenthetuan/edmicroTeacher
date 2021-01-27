import React, { Component } from 'react'
import { View, Text } from 'react-native'
import MenuStyle from './MenuStyle';
import { RFFonsize } from '../../utils/Fonts';

export default function Version(props) {
    return (
        <View>
            <Text style={MenuStyle.textVersion}>Version : {props.version}</Text>
            <Text style={{ fontFamily: 'Nunito-Regular', color: '#979797', fontSize: RFFonsize(9), marginBottom: 10, alignSelf: 'center' }}>
                Update At: 18:15 25/01/2021
                </Text>
        </View>
    );
}