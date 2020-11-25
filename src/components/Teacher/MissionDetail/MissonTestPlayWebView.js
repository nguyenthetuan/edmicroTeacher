import React, { PureComponent } from 'react';
import { View, SafeAreaView, StyleSheet, Text, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as dataHelper from '../../../utils/dataHelper';
import Config from 'react-native-config';
import LearnPlaceholder from '../../shim/LearnPlaceholder';
import global from '../../../utils/Globals';
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

let PREFIX_URL = Config.PREFIX_URL;

export default class MissonPlayWebView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            testId: this.props.navigation.state.params.testId,
            token: null,
            myInjectedJs: '',
            isLoading: true
        }
    }

    componentDidMount() {
        const { testId } = this.state;
        if (Platform.OS === 'android') this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackPressed.bind(this));

        dataHelper.getToken().then(({ token }) => {
            let myInjectedJs = `
            let tk = window.localStorage.getItem('token');
            if (tk != '${token}') {
                window.localStorage.setItem('token', '${token}');
                window.location.href='https://app.onluyen.vn/tests/step/${testId}';
                window.ReactNativeWebView.postMessage("loginDone");
            }
            var oldURL = "";
            var currentURL = window.location.href;
            if(currentURL != 'https://app.onluyen.vn/login'){
                window.ReactNativeWebView.postMessage("loginDone");
            }
            var myTimeOut = null;
            function checkURLchange(currentURL){
                if(!currentURL.includes('https://app.onluyen.vn/tests/step')){
                    if(currentURL){
                        clearInterval(myTimeOut);
                        window.ReactNativeWebView.postMessage("done");
                    }
                    oldURL = currentURL;
                }
                oldURL = window.location.href;
            }

            if(myTimeOut == null){
                myTimeOut = setInterval(function() {
                    checkURLchange(window.location.href);
                }, 500);
            }
            checkURLchange();
            `;
            this.setState({
                token: token,
                myInjectedJs
            });
        });
    }



    _onURLChanged = (e) => {
        console.log(e);
        return false;
    }

    _goBack = () => {
        this.props.navigation.goBack();
        if (typeof (global.updateDataCompetitionStep) == 'function') global.updateDataCompetitionStep();
    }

    _onMessage = (event) => {
        const data = event.nativeEvent.data;
        if (data && data.includes('done')) {
            this._goBack();
        }
        if (data && data.includes('loginDone')) {
            setTimeout(() => this.setState({ isLoading: false }), 1000);

        }
    }

    onBackPressed() {
        Alert.alert('Thông báo',
            'Bạn có chắc chắn muốn rời khỏi ?',
            [
                { text: "Có", onPress: this._goBack },
                { text: "Không", onPress: () => { return true }, style: 'cancel' },
            ],
            { cancelable: false }
        );
        return true;
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') this.backHandler.remove();
    }

    render() {
        const {
            testId,
            token,
            myInjectedJs,
            isLoading
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView />
                <LearnPlaceholder visible={!isLoading} />
                {token &&
                    <WebView
                        ref={webView => { this.webref = webView; }}
                        style={styles.styleWebView}
                        javaScriptEnabled={true}
                        injectedJavaScript={myInjectedJs}
                        onMessage={this._onMessage.bind(this)}
                        source={{ uri: `https://app.onluyen.vn/tests/step/${testId}` }}
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    styleWebView: {
        backgroundColor: Platform.OS == 'ios' ? '#000' : 'transparent',
        flex: 1,
    },
})