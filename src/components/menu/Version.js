import React, { Component } from 'react'
import { View, Text } from 'react-native'
import MenuStyle from './MenuStyle';
import { RFFonsize } from '../../utils/Fonts';
import { CODE_PUSH_VERSION } from '../../constants/const';

export default function Version(props) {
    return (
        <View>
            <Text style={MenuStyle.textVersion}>Version : {props.version}</Text>
            <Text style={{ fontFamily: 'Nunito-Regular', color: '#979797', fontSize: RFFonsize(9), marginBottom: 10, alignSelf: 'center' }}>
                {CODE_PUSH_VERSION}
            </Text>
        </View>
    );
}