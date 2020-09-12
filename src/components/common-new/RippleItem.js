import React, { Component, useState } from 'react';
import { Animated, TouchableNativeFeedback, Platform } from 'react-native';
import RippleMaterial from 'react-native-material-ripple';
import Dimens from '../../constants/dimens';

const TouchAndroid = (props) => {
    return (
        <TouchableNativeFeedback
            onPress={() => {
                props.onPress();
            }}
            background={TouchableNativeFeedback.Ripple('#ddd', false)}
        >
            {props.children}
        </TouchableNativeFeedback>
    );
}

class RippleItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pressColor: 'transparent',
            backgroundAnim: new Animated.Value(0)
        }
    }

    onPressIn = () => {
        requestAnimationFrame(() => {
            Animated.timing(
                this.state.backgroundAnim,
                {
                    toValue: 1,
                    duration: this.props.duration ? this.props.duration : 650,
                }
            ).start();
        });
    }

    onPressOut = () => {
        requestAnimationFrame(() => {
            Animated.timing(
                this.state.backgroundAnim,
                {
                    toValue: 0,
                    duration: this.props.duration ? this.props.duration : 650,
                }
            ).start();
        })
    }

    render() {
        const backgroundColor = this.state.backgroundAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#fff', '#ddd'],
        });
        return (
            <RippleMaterial
                onPressIn={this.onPressIn}
                onPressOut={this.onPressOut}
                rippleColor={this.props.rippleColor ? this.props.rippleColor : '#ccc'}
                rippleDuration={this.props.duration ? this.props.duration : Dimens.rippleDurationDefault}
                rippleSize={this.props.rippleSize || 250}
                rippleOpacity={this.props.opacity ? this.props.opacity : Dimens.rippleOpacityDefault}
                rippleContainerBorderRadius={this.props.radius ? this.props.radius : 40}
                rippleSequential={false}
                rippleCentered={false}
                disabled={this.props.disabled ? this.props.disabled : false}
                {...this.props}
            >
                <Animated.View style={{
                    backgroundColor: backgroundColor,
                    borderRadius: this.props.borderRadius || 0,
                }}>
                    {this.props.children}
                </Animated.View>
            </RippleMaterial>
        );
    }
}

export default Platform.OS == 'ios' ? RippleItem : TouchAndroid;
