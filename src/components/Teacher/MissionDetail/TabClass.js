import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class TabClass extends Component {
    render() {
        console.log(this.props);
        const { classList, isLoading, missionDetail } = this.props.screenProps;
        return (
            <View>
                <Text>
                    TabClass
                </Text>
            </View>
        );
    }
}