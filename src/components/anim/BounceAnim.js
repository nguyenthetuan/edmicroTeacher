import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class BounceAnim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: new Animated.Value(0),
		};
	}

	componentDidMount() {
		// this.startAnimation();
	}

	startAnimation = async () => {
		await this.setState({ value: new Animated.Value(0) })
		await Animated.spring(
			this.state.value,
			{
				toValue: 6,
				duration: this.props.duration ? this.props.duration : 2000,
			}
		).start();

	}

	render() {
		const top = this.state.value.interpolate({
			inputRange: [0, 1, 2, 3, 4, 5, 6],
			outputRange: [0, 5, 0, 5, 0, 5, 0],
		});
		return (
			<Animated.View
				style={{ ...this.props.style, top }}>
				{this.props.children}
			</Animated.View>
		);
	}
}
