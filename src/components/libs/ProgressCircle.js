import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { Text } from 'react-native'
import Color from '../../constants/colors';
import { RFFonsize } from '../../utils/Fonts';
const { width } = Dimensions.get('window');


export default class ProgressCircle extends Component {
    render() {
        const { style, progress } = this.props;
        return (
            <>
                <Progress.Circle
                    color={'#90EA59'}
                    borderColor={'#FFF'}
                    unfilledColor={'#FFF'}
                    thickness={1}
                    showsText={true}
                    formatText={() => progress}
                    textStyle={{ fontSize: RFFonsize(10), fontFamily: 'Nunito-Bold', color: '#FFF' }}
                    progress={progress / 100}
                    style={{ marginVertical: 6, ...style }}
                    size={28}
                />
                <Text style={{ color: '#FFF', alignSelf: 'flex-end', fontFamily: 'Nunito-Regular', fontSize: RFFonsize(12), marginBottom: 3 }}> %</Text>
            </>
        );
    }
}