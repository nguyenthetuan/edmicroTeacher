import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import HeaderPaper from './HeaderPaper';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/CommonBeta';
import AppIcon from '../../../utils/AppIcon';
import htmlHelper from '../../../utils/WebviewListQuestionCopy';
import { WebView } from 'react-native-webview';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

const knowledgeText = { 0: 'Nhận biết', 1: 'Thông hiểu', 2: 'Vận dụng', 3: 'Vận dụng cao' };
export default class ListQuestionCopy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }

    componentDidMount() {
        const { data } = this.props.navigation.state.params;
        this.setState({ data: data.data });
        this.calcLevelKnowledge();
    }

    calcLevelKnowledge() {
        const data = this.props.navigation.state.params.data.data;
        const questions = data.questions;
        let knowledge0 = 0;
        let knowledge1 = 0;
        let knowledge2 = 0;
        let knowledge3 = 0;
        const listQuestionArr = Object.values(questions);
        for (let i = 0; i < listQuestionArr.length; i++) {
            switch (listQuestionArr[i].levelknowledge) {
                case 0:
                    knowledge0++;
                    break;
                case 1:
                    knowledge1++;
                    break;
                case 2:
                    knowledge2++;
                    break;
                case 3:
                    knowledge3++;
                    break;
            }
        }
        console.log('knowledge0, knowledge1, knowledge2, knowledge3: ', knowledge0, knowledge1, knowledge2, knowledge3);
        this.setState({ knowledge0, knowledge1, knowledge2, knowledge3 });
    }

    copySubjectMatter = async () => {
        const data = this.state.data;
        const { token } = await dataHelper.getToken();
        this.props.navigation.navigate('ConfigQuestionCopy', {
            nagigation: this.props.nagigation,
            statusbar: 'light-content',
            data: data,
        });
    }

    filterDataRender(dataSource) {
        let result = dataSource.sort((a, b) => (a.index - b.index));
        return result;
    }

    render() {
        const data = this.props.navigation.state.params.data.data;
        this.filterDataRender(data.questions);
        return (
            <View>
                <SafeAreaView style={{ backgroundColor: '#56CCF2' }} />
                <SafeAreaView style={styles.root}>
                    <View style={styles.header}>
                        <HeaderPaper
                            title={'Bộ đề có sẵn'}
                            navigation={this.props.navigation}
                            color={'#fff'}
                            buttonRightText={'Sao chép bộ đề'}
                            onRightAction={this.copySubjectMatter}
                        />
                        <View>
                            <Text style={styles.textName}>{data.name}</Text>
                        </View>
                        <View style={styles.headerContent}>
                            <View style={styles.headerContentLeft}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.textNormal}>Môn: </Text>
                                    <View style={{ height: 20, borderWidth: 1, paddingHorizontal: 10, borderColor: '#fff' }}>
                                        <Text style={styles.textNormal}>{data.subjectNames[0]}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', top: 5 }}>
                                    <Text style={styles.textNormal}>Lớp: </Text>
                                    <View style={{ height: 20, borderWidth: 1, paddingHorizontal: 10, left: 4.5, borderColor: '#fff' }}>
                                        <Text style={styles.textNormal}>{data.gradeCode[0].slice(1)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.headerContentRight}>
                                <View style={styles.headerLineParams}>
                                    <View style={[styles.leftParams, { borderWidth: 0 }]}>
                                        <Text style={styles.textTitle}>Loại câu hỏi</Text>
                                    </View>
                                    <View style={[styles.rightParams, { borderWidth: 0 }]}>
                                        <Text style={styles.textTitle}>Số câu</Text>
                                    </View>
                                </View>
                                {!!this.state[`knowledge0`] && <View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormal}>{knowledgeText['0']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge0`]}</Text>
                                    </View>
                                </View>}
                                {!!this.state[`knowledge1`] && <View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormal}>{knowledgeText['1']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge1`]}</Text>
                                    </View>
                                </View>}
                                {!!this.state[`knowledge2`] && < View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormal}>{knowledgeText['2']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge2`]}</Text>
                                    </View>
                                </View>}
                                {!!this.state[`knowledge3`] && <View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormal}>{knowledgeText['3']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge3`]}</Text>
                                    </View>
                                </View>}
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 600, backgroundColor: 'red' }}>
                        <WebView
                            ref={(ref) => (this.webview = ref)}
                            source={{
                                html: htmlHelper.renderHtmlListQuestionCopy(this.filterDataRender(data.questions)),
                                baseUrl,
                            }}
                            originWhitelist={['file://']}
                            scalesPageToFit={false}
                            javaScriptEnabled
                            showsVerticalScrollIndicator={false}
                            startInLoadingState={true}
                        />
                    </View>
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
    }
})