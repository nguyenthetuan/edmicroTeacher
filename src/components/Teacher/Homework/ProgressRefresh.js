import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import * as Progress from 'react-native-progress';
const { width } = Dimensions.get('window');

const ProgressRefresh = (props) => {
    return (
        props.isRefresh ?
            <Progress.Bar
                style={{ marginTop: 1, marginBottom: 8 }}
                indeterminate={true}
                width={width}
                indeterminateAnimationDuration={900}
                unfilledColor={'#ECECEC'}
                color={'#fff'}
                borderRadius={0}
                height={6}
                borderWidth={0}
            />
            :
            <View style={{ height: 15 }} />
    );
}

export default ProgressRefresh;