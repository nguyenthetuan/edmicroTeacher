import React, { Component } from 'react';
import { TouchableNativeFeedback, Platform } from 'react-native'
import Ripple from 'react-native-material-ripple';
import Color from '../../constants/colors';
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

class RippleButton extends Component {
  render() {
    return (
      <Ripple
        // rippleColor={this.props.color ? this.props.color : '#999'}
        rippleColor={this.props.color ? this.props.color : Color.colorRippleMain}
        rippleDuration={this.props.duration ? this.props.duration : Dimens.rippleDurationDefault}
        rippleSize={this.props.size ? this.props.size : 80}
        rippleOpacity={this.props.opacity ? this.props.opacity : Dimens.rippleOpacityDefault}
        rippleContainerBorderRadius={this.props.radius ? this.props.radius : 40}
        rippleSequential={false}
        rippleCentered={true}
        disabled={this.props.disabled ? this.props.disabled : false}
        {...this.props}
      >
        {this.props.children}

      </Ripple>
    );
  }
}

export default Platform.OS == 'ios' ? RippleButton : TouchAndroid;
