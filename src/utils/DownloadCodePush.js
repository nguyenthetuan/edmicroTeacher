import React, { Component } from 'react'
import { View, Text, Modal, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as Progress from 'react-native-progress';
import codePush from "react-native-code-push";
const { width, height } = Dimensions.get('window');

const withProgress = width * 0.65;

const STATUS = {
    checkForUpdate: 0,
    downloadPackage: 1,
    instalingUpdate: 2,
    upToDate: 3,
    instaled: 4,
}

class DownloadCodePush extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receivedBytes: 0,
            totalBytes: 0.1,
            status: STATUS.checkForUpdate
        }
    }

    componentDidMount() {
        codePush.disallowRestart();
    }

    codePushStatusDidChange(status) {
        switch (status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Checking for updates.");
                this.setState({ status: STATUS.checkForUpdate });
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Downloading package.");
                this.setState({ status: STATUS.downloadPackage });
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log("Installing update.");
                this.setState({ status: STATUS.instalingUpdate });
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.log("Up-to-date.");
                this.setState({ status: STATUS.upToDate });
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log("Update installed.");
                this.setState({ status: STATUS.instaled });
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
        this.setState({
            receivedBytes: progress.receivedBytes,
            totalBytes: progress.totalBytes
        });
    }

    getProcess = () => {
        const { receivedBytes, totalBytes } = this.state;
        let progress = 0;
        try {
            progress = receivedBytes / totalBytes;
            return progress;
        } catch (error) {
            return 0;
        }
    }

    getCodePushInfo = () => {
        const { status } = this.state;
        switch (status) {
            case STATUS.checkForUpdate:
                return {
                    title: 'Kiểm tra cập nhật',
                    color: '#000'
                };
            case STATUS.downloadPackage:
                return {
                    title: 'Đang cập nhật ...',
                    color: '#000'
                };
            case STATUS.instalingUpdate:
                return {
                    title: 'Đang cài đặt ...',
                    color: '#000'
                };
            case STATUS.instaled:
                return {
                    title: 'Cập nhật thành công',
                    color: '#000'
                };
            default:
                return {
                    title: '',
                    color: '#000'
                };
        }
    }

    render() {
        const { status, receivedBytes, totalBytes } = this.state;
        return (<View />);
        return (
            (status == STATUS.downloadPackage ||
                status == STATUS.instalingUpdate ||
                status == STATUS.instaled
            ) ?
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <Text
                            style={[
                                styles.title, {
                                    color: this.getCodePushInfo().color
                                }]}
                        >{this.getCodePushInfo().title}</Text>
                        <Progress.Bar
                            progress={this.getProcess()}
                            width={withProgress}
                            unfilledColor={'#C4C4C4'}
                            borderWidth={0}
                            height={8}
                            color={'#1bc47d'}
                            borderRadius={3}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
                            <Text style={styles.textBytes}>{(receivedBytes / 1000).toFixed(2)}</Text>
                            <Text style={styles.textBytes}>/</Text>
                            <Text style={styles.textBytes}>{(totalBytes / 1000).toFixed(2)}{' KB'}</Text>
                        </View>
                        <View style={{ height: 20 }} />
                        <Text style={{
                            color: '#757575',
                            fontFamily: 'Nunito-Regular',
                            fontSize: 12,
                            marginBottom: 20
                        }}>Xin vui lòng chờ trong giây lát </Text>
                        {
                            status == STATUS.instaled &&
                            <TouchableWithoutFeedback
                                disabled={status == STATUS.downloadPackage || status == STATUS.instalingUpdate}
                                onPress={() => {
                                    codePush.allowRestart();
                                    codePush.restartApp(true);
                                }}>
                                <View style={styles.containerButton}>
                                    <Text style={[styles.textButton, {
                                        color: (status == STATUS.downloadPackage || status == STATUS.instalingUpdate) ? '#979797' : '#000'
                                    }]}>OK</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                    </View>
                </View>
                :
                null
        );
    }
}

const DownloadCodePushApp = codePush({
    updateDialog: false,
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_START
})(DownloadCodePush);

export default DownloadCodePushApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    contentContainer: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 5,
        paddingTop: 30,
        paddingBottom: 15,
        paddingHorizontal: 30
    },
    title: {
        color: '#000',
        marginBottom: 10,
        fontFamily: 'Nunito-Regular'
    },
    containerButton: {
        paddingVertical: 10,
        alignSelf: 'center',
        paddingHorizontal: 25
    },
    textButton: {
        color: '#000',
        fontFamily: 'Nunito-Regular'
    },
    textBytes: {
        fontFamily: 'Nunito-Regular',
        fontSize: 11
    }
});