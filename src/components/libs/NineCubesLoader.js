import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
// import { NineCubesLoader } from 'react-native-indicator';

export default class NineCubesLoaderScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { style, color, size } = this.props;
        return (
            <View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', zIndex: 2, elevation: 5, alignItems: 'center' }, style]}>
                <ActivityIndicator color={color || '#ccc'} size={40} />
            </View>
        )
    }
}