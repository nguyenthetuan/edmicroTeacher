import React, { Component } from 'react';
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

class RippleMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pressColor: 'transparent',
            backgroundAnim: new Animated.Value(0)
        }
    }

    onPressIn = () => {
        Animated.timing(
            this.state.backgroundAnim,
            {
                toValue: 1,
                duration: this.props.duration ? this.props.duration : 650,
            }
        ).start();
    }

    onPressOut = () => {
        Animated.timing(
            this.state.backgroundAnim,
            {
                toValue: 0,
                duration: this.props.duration ? this.props.duration : 650,
            }
        ).start();
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
                // rippleColor={this.props.rippleColor ? this.props.rippleColor : '#999'}
                rippleColor={'#999'}
                rippleDuration={this.props.duration ? this.props.duration : Dimens.rippleDurationDefault}
                rippleSize={this.props.size ? this.props.size : 300}
                rippleOpacity={this.props.opacity ? this.props.opacity : Dimens.rippleOpacityDefault}
                rippleContainerBorderRadius={this.props.radius ? this.props.radius : 40}
                rippleSequential={false}
                rippleCentered={true}
                disabled={this.props.disabled ? this.props.disabled : false}
                {...this.props}
            >
                <Animated.View style={{
                    backgroundColor: backgroundColor
                }}>
                    {this.props.children}
                </Animated.View>
            </RippleMaterial>
        );
    }
}

export default Platform.OS == 'ios' ? RippleMenu : TouchAndroid;
