import React, { PureComponent } from 'react';
import { View, SafeAreaView, StyleSheet, Text, BackHandler, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as dataHelper from '../../../utils/dataHelper';
import LearnPlaceholder from '../../shim/LearnPlaceholder';
import Config from 'react-native-config';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import global from '../../../utils/Globals';
export default class MarkingWebScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            myInjectedJs: '',
            isLoading: true,
            url: '',
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackPressed.bind(this));
        const { assignmentId } = this.props.navigation.state.params.item;
        let url = `${Config.PREFIX_URL}school/teacher/assessment/${assignmentId}/grade-mobi`;
        this.setState({ url: url });
        dataHelper.getToken().then(({ token }) => {
            let myInjectedJs = `
                let tk = window.localStorage.getItem('token');
                if (tk != '${token}') {
                    window.localStorage.setItem('token', '${token}');
                    window.location.href='${url}';
                    window.ReactNativeWebView.postMessage("loginDone");
                }

                var oldURL = "";
                var currentURL = window.location.href;
                if(currentURL != 'https://app.onluyen.vn/login'){
                    window.ReactNativeWebView.postMessage("loginDone");
                }
        
                var isHeader = true;
                var timeHeader = null;

                function initLoad(){
                    window.ReactNativeWebView.postMessage("loadend");
                }
                timeHeader = setTimeout(function() {
                    initLoad();
                }, 1000);
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
        if (typeof (global.updatePaper) == 'function') global.updatePaper();
    }

    _onMessage = (event) => {
        const data = event.nativeEvent.data;
        if (data && data.includes('done')) {
            this._goBack();
        }
        if (data && data.includes('loadend')) {
            this.setState({ isLoading: false });
        }
        if (data && data.includes('loginDone')) {
            console.log("_onMessage -> data", data)
        }
    }

    onBackPressed() {
        Alert.alert('Thông báo',
            'Bạn có chắc chắn muốn rời khỏi trang này ',
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
        const { token, myInjectedJs, isLoading } = this.state;
        const { name } = this.props.navigation.state.params.item;
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView />
                <HeaderNavigation
                    title={name || ''}
                    navigation={this.props.navigation}
                    actionIcon={false}
                    goBack={this._goBack}
                    color={'#979797'}
                />
                <View style={{ flex: 1 }}>
                    <LearnPlaceholder visible={!isLoading} />
                    {(token && this.state.url != '') &&
                        <WebView
                            ref={webView => { this.webref = webView; }}
                            style={styles.styleWebView}
                            javaScriptEnabled={true}
                            injectedJavaScript={myInjectedJs}
                            domStorageEnabled={true}
                            onMessage={this._onMessage.bind(this)}
                            source={{ uri: `${this.state.url}` }}
                        />
                    }
                </View>
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
