import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import Color from '../../constants/colors';

const { width } = Dimensions.get('window');


export default class ProgressBar extends Component {
    render() {
        const { progress, widthProps } = this.props;
        return (
            <Progress.Bar
                color={this.props.color ? this.props.color : Color.progressColor}
                width={widthProps ? widthProps : 160}
                height={this.props.height || 5}
                borderRadius={20}
                borderWidth={0}
                borderColor={Color.progressBorderColor}
                unfilledColor={this.props.unfilledColor || Color.progressUnfilledColor}
                progress={progress / 100}
                style={{ marginVertical: 10, ...this.props.style, opacity: 0.7 }} />
        );
    }
}
