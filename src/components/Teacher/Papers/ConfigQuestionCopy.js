import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import HeaderPaper from './HeaderPaper';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/CommonBeta';
import AppIcon from '../../../utils/AppIcon';
import htmlHelper from '../../../utils/WebviewListQuestionCopy';
import { WebView } from 'react-native-webview';
import { result } from 'lodash';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Toast, { DURATION } from 'react-native-easy-toast';


const { width, height } = Dimensions.get('window');
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

export default class ConfigQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listChecked: [],
            toggleCheckBox: false,
            data: null,
            eachQSPoint: [],
            totalPoint: 10,
        }
    }

    componentDidMount() {
        const data = this.props.navigation.state.params.data;
        this.setState({ data });
        let eachQSPoint = [];
        this.resetListCheckedAndPoint(data.questions);
        for (let i = 0; i < data.questions.length; i++) {
            eachQSPoint.push(Math.round(10 / data.questions.length * 10000) / 10000);
        }
        this.setState({ eachQSPoint });

    }

    onPressDecidePoint() {
        let totalPoint = 10;
        let eachQSPoint = [];
        let eachPoint = Math.round(10 / this.state.data.questions.length * 10000) / 10000;
        let questions = this.state.data.questions;
        for (let i = 0; i < questions.length; i++) {
            eachQSPoint.push(eachPoint);
        }
        this.setState({ eachQSPoint, totalPoint: 10 });
    }

    resetListCheckedAndPoint(data) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            result.push(false);
        }
        console.log('resetListCheckedAndPoint: ', JSON.stringify(result));
        this.setState({ listChecked: result });
    }

    onHandleMessage(event) {
        const data = event.nativeEvent.data.split('---');
        if (data[0] === 'checked') {
            let listChecked = this.state.listChecked;
            listChecked[data[1]] = !listChecked[data[1]];
            console.log("listChecked: ", JSON.stringify(listChecked));
            this.setState({ listChecked: listChecked })
        }
        if (data[0] == 'newPoints') {
            let newPoints = JSON.parse(data[1]);
            let totalPoint = newPoints.reduce((a, b) => (a + b));
            totalPoint = Math.round(totalPoint * 10000) / 10000;
            this.setState({ eachQSPoint: newPoints, totalPoint: totalPoint });
        }
    }

    onCheckTotal(newValue) {
        this.setState({ toggleCheckBox: newValue });
        if (newValue) {
            this.webview.postMessage('tickAll');
        } else {
            this.webview.postMessage('untickAll');
        }
    }

    deleteCheckedQs() {
        const { data, eachQSPoint } = this.state;
        let questionList = data.questions;
        let listChecked = this.state.listChecked;
        let count = listChecked.filter((a) => (a == true)).length;
        if (!count) {
            return;
        }
        for (let i = listChecked.length - 1; i >= 0; i--) {
            if (listChecked[i]) {
                questionList.splice(i, 1);
                eachQSPoint.splice(i, 1);
            }
        }
        for (let j = 0; j < questionList.length; j++) {
            questionList[j].index = j;
        }
        console.log("eachQSPoint: ", JSON.stringify(eachQSPoint));
        let totalPoint = eachQSPoint.reduce((a, b) => (a + b));
        totalPoint = Math.round(totalPoint * 10000) / 10000;
        data.questions = questionList;
        this.setState({ data, totalPoint, eachQSPoint }, () => {
            this.resetListCheckedAndPoint(data.questions);
        });
    }

    onChangePosition() {
        const { listChecked } = this.state;
        let count = listChecked.filter((a) => (a == true)).length;
        if (count > 1 || count == 0) {
            this.refs.toast.show('Xin vui lòng chọn 1 câu hỏi');
        }
    }

    onPressRoot() {
        this.webview.postMessage('blurInput');
    }

    render() {
        const data = this.props.navigation.state.params.data;
        return (
            <View >
                <SafeAreaView style={{ backgroundColor: '#56CCF2' }} />
                <SafeAreaView style={styles.root}>
                    <View style={styles.header} >
                        <TouchableWithoutFeedback onPress={() => { this.onPressRoot() }} style={styles.header}>
                            <HeaderPaper
                                title={'Cấu hình câu hỏi'}
                                navigation={this.props.navigation}
                                color={'#fff'}
                                notRightButton={true}
                            />
                            <View>
                                <Text style={styles.textName}>{data.name}</Text>
                            </View>
                            <View style={styles.headerContent}>
                                <View>
                                    <Text style={styles.textHeader}>Tổng số câu: {data.questions.length}</Text>
                                    <Text style={styles.textHeader}>Tổng số điểm: {this.state.totalPoint}</Text>
                                </View>
                                <View style={styles.bottomOfHeader}>
                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 10 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 10 }} onPress={() => { this.onPressDecidePoint() }}>
                                            <Text style={styles.textHeader}>Chia đều điểm</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 10 }} onPress={() => { this.onChangePosition() }}>
                                            <Text style={styles.textHeader}>Sắp xếp lại</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 10 }} onPress={() => { this.deleteCheckedQs() }}>
                                            <Text style={styles.textHeader}>Xóa câu đã chọn</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.onCheckTotal(!this.state.toggleCheckBox) }}>
                                            <Text style={styles.textHeader}>Chọn tất cả</Text>
                                            <CheckBox
                                                disabled={false}
                                                value={this.state.toggleCheckBox}
                                                onValueChange={(newValue) => { this.onCheckTotal(newValue) }}
                                                boxType="square"
                                                style={{ width: 20, height: 20, marginLeft: 10 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ width: '100%', height: height - 220, backgroundColor: 'red' }}>
                        <WebView
                            onMessage={this.onHandleMessage.bind(this)}
                            ref={(ref) => (this.webview = ref)}
                            source={{
                                html: htmlHelper.renderHtmlListQuestionCopy(data.questions, this.state.eachQSPoint),
                                baseUrl,
                            }}
                            originWhitelist={['file://']}
                            scalesPageToFit={false}
                            javaScriptEnabled
                            showsVerticalScrollIndicator={false}
                            startInLoadingState={true}
                        />
                    </View>
                    <Toast ref="toast" position={'center'} />
                </SafeAreaView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        backgroundColor: '#56CCF2',
        height: 200,
        paddingHorizontal: 5
    },
    headerContent: {
        flexDirection: 'row',
        flex: 1,
    },
    headerContentLeft: {
        width: 150,
        justifyContent: 'center',
    },
    headerContentRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLineParams: {
        height: 25,
        flexDirection: 'row'
    },
    leftParams: {
        width: '60%',
        height: 25,
        justifyContent: 'center'
    },
    rightParams: {
        width: '40%',
        height: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTitle: {
        fontSize: 14,
        fontFamily: 'Nunito-bold',
        fontWeight: '800',
        color: '#fff'
    },
    textNormal: {
        fontSize: 12,
        fontFamily: 'Nunito',
        color: '#fff',
        fontWeight: '400',
    },
    textName: {
        fontSize: 14,
        fontWeight: '800',
        fontFamily: 'Nunito-bold',
        color: '#fff'
    },
    textHeader: {
        fontSize: 12,
        fontWeight: '800',
        fontFamily: 'Nunito-bold',
        color: '#fff'
    },
    bottomOfHeader: {
        position: 'absolute',
        height: 40,
        bottom: 0,
        right: 0,
        width: '100%',
    }
})