import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import HeaderNavigation from '../common-new/HeaderNavigation';

export default class TermsOfUse extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <SafeAreaView style={styes.container}>
                <HeaderNavigation
                    navigation={this.props.navigation}
                    title="Chính sách và Điều khoản"
                    colorIcon={'#FFF'}
                    back={true}
                />
                <WebView source={{ uri: 'https://www.edmicro.vn/privacy-policy/' }} />
            </SafeAreaView>
        )
    }
}

const styes = StyleSheet.create({
    container: {
        flex: 1,
    }
})