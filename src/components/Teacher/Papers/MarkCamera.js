import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet
} from 'react-native';

export default class MarkCamera extends Component {
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView />
                <Text>MarkCamera</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
