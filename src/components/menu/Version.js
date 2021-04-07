import React, { Component } from 'react'
import { View, Text } from 'react-native'
import MenuStyle from './MenuStyle';
import {
    getBuildNumber,
    getVersionName
} from '../../constants/buildConfig';

export default function Version(props) {
    return (
        <View style={MenuStyle.versionContainer}>
            <Text style={MenuStyle.textVersion}>Version : {getVersionName()}</Text>
            <Text style={MenuStyle.textVersion}>Build : {getBuildNumber()}</Text>
        </View>
    );
}