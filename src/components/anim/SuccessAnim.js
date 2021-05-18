import React from 'react';
import { Animated, Easing, Platform } from 'react-native'
import LottieView from 'lottie-react-native';

export default class SuccessAnim extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.start();
    }

    start = async () => {
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            delay: 300,
            useNativeDriver: false
        }).start(sucesss => {
            try {
                this.props.done();
            } catch (error) {

            }
        });
    }

    render() {
        return (
            <LottieView
                style={{
                    width: 40,
                    height: 40,
                    opacity:0.92
                }}
                progress={this.state.progress}
                source={require('./json/success_white.json')}
            />
        );
    }
}