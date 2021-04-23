import React, { Component } from 'react';
import { Platform } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { View } from 'react-native';
import debounce from 'lodash.debounce';
import Color from '../../constants/colors';
import Dimens from '../../constants/dimens';
import shadowStyle from '../../themes/shadowStyle';
export default class RippleButton extends Component {
	render() {
		const { shadowBtn } = shadowStyle;
		return (
			<View style={Platform.OS == 'ios' ? shadowBtn : null}>
				<Ripple
					style={[{ borderRadius: 300 }]}
					rippleColor={this.props.color ? this.props.color : Color.colorRippleMain}
					// rippleColor={Color.colorRippleMain}
					rippleDuration={this.props.duration ? this.props.duration : Dimens.rippleDurationDefault}
					rippleSize={this.props.size ? this.props.size : Dimens.rippleSizeDefault}
					rippleOpacity={this.props.opacity ? this.props.opacity : Dimens.rippleOpacityDefault}
					rippleContainerBorderRadius={this.props.radius ? this.props.radius : 0}
					rippleSequential={false}
					rippleCentered={true}
					disabled={this.props.disabled ? this.props.disabled : false}
					{...this.props}>
					{this.props.children}
				</Ripple>
			</View>
		);
	}
}
