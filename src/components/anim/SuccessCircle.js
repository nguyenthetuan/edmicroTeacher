import React from 'react';
import { Animated, Dimensions, Easing, Platform, View, Text } from 'react-native'
import LottieView from 'lottie-react-native';
import { RFFonsize } from '../../utils/Fonts';
const { width, height } = Dimensions.get('window');

export default class SuccessCircle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(0)
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
            delay: 100,
            useNativeDriver: false
        }).start(sucesss => {
            // this.props.done();
        });
    }


    shouldComponentUpdate = () => {
        if (this.props.visibleSuccess) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <LottieView
                    style={{ width: width * 0.2, alignSelf: 'center' }}
                    progress={this.state.progress}
                    source={require('./json/successIcon.json')}
                />
                <Text
                    style={{
                        fontFamily: "Nunito",
                        fontSize :RFFonsize(14)
                    }}
                >Thành công!</Text>
            </View>
        );
    }
}