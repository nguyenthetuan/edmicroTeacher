import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator, Alert
} from 'react-native';
import HeaderPaper from './HeaderPaper';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/CommonBeta';
import AppIcon from '../../../utils/AppIcon';
import htmlHelper from '../../../utils/WebviewListQuestionCopy';
import { WebView } from 'react-native-webview';
import WarningModal from '../../modals/WarningModal';
import { RFFonsize } from '../../../utils/Fonts';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window');

const knowledgeText = { 0: 'Nhận biết', 1: 'Thông hiểu', 2: 'Vận dụng', 3: 'Vận dụng cao' };
export default class ListQuestionCopy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            numberQuestion: 0,
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
        console.log(
            'knowledge0, knowledge1, knowledge2, knowledge3: ',
            knowledge0, knowledge1, knowledge2, knowledge3
        );
        this.setState({ knowledge0, knowledge1, knowledge2, knowledge3 });
    }

    displayWarning(b) {
        this.refs.warningModal.showModal();
    }

    onHandleMessage(event) {
        const data = event.nativeEvent.data.split('---');
        if (data[0] == 'warningWeb') {
            let number = data[1];
            this.setState({ numberQuestion: number }, () => {
                this.displayWarning(true);
            });
        }
    }

    copySubjectMatter = async () => {
        const data = this.state.data;
        const { token } = await dataHelper.getToken();
        const { listSubjects } = this.props.navigation.state.params;
        this.props.navigation.navigate('ConfigQuestionCopy', {
            nagigation: this.props.nagigation,
            statusbar: 'light-content',
            data: data,
            listSubjects: listSubjects,
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
                {/* <View style={styles.root}> */}
                    <View style={styles.header}>
                        <HeaderPaper
                            // title={'Bộ đề có sẵn'}
                            navigation={this.props.navigation}
                            color={'#fff'}
                            buttonRightText={'Cấu hình bộ đề'}
                            onRightAction={this.copySubjectMatter}
                            title={data.name}
                        />
                        <View style={styles.headerContent}>
                            <View style={styles.headerContentLeft}>
                                <View style={styles.flexRow}>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Text style={styles.textNormalName}>Môn: </Text>
                                        <View style={{ height: 20, paddingHorizontal: 0, borderColor: '#fff' }}>
                                            <Text style={styles.textNormal}>{data.subjectNames[0]}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Text style={styles.textNormalName}>Lớp: </Text>
                                        <View style={{ height: 20, paddingHorizontal: 0, left: 4.5, borderColor: '#fff' }}>
                                            <Text style={styles.textNormal}>{data.gradeCode[0].slice(1)}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.rightHeader}
                                        // onPress={() => { this.}}
                                        onPress={this.copySubjectMatter}
                                    >
                                        <Text style={styles.txtRightHeader}>{`Cấu hình bộ đề` || `Lưu cấu hình`}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.headerLineTitle}>
                                <Text style={styles.textTitle}>Loại câu hỏi</Text>
                            </View>
                            <View style={styles.headerContentRight}>
                                {!!this.state[`knowledge0`] && <View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormalName}>{knowledgeText['0']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge0`]} câu</Text>
                                    </View>
                                </View>}
                                <View style={styles.borderWidthColumn} />
                                {!!this.state[`knowledge1`] && <View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormalName}>{knowledgeText['1']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge1`]} câu</Text>
                                    </View>
                                </View>}
                                <View style={styles.borderWidthColumn} />
                                {!!this.state[`knowledge2`] && < View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormalName}>{knowledgeText['2']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge2`]} câu</Text>
                                    </View>
                                </View>}
                                {!!this.state[`knowledge3`] && <View style={styles.headerLineParams}>
                                    <View style={styles.leftParams}>
                                        <Text style={styles.textNormalName}>{knowledgeText['3']}</Text>
                                    </View>
                                    <View style={styles.rightParams}>
                                        <Text style={styles.textNormal}>{this.state[`knowledge3`]} câu</Text>
                                    </View>
                                </View>}
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: height - 220 }}>
                        <WebView
                            ref={(ref) => (this.webview = ref)}
                            source={{
                                html: htmlHelper.renderHtmlListQuestionCopy
                                    (this.filterDataRender(data.questions)),
                                baseUrl,
                            }}
                            onMessage={this.onHandleMessage.bind(this)}
                            originWhitelist={['file://']}
                            scalesPageToFit={false}
                            javaScriptEnabled
                            showsVerticalScrollIndicator={false}
                            startInLoadingState={true}
                        />
                    </View>
                    <WarningModal
                        ref={'warningModal'}
                        navigation={this.props.navigation}
                        visible={this.state.visibleModalWarning}
                        hideModal={() => this.displayWarning(false)}
                        numberQuestion={this.state.numberQuestion}
                        subjectId={'TOAN'}
                    />
                {/* </View> */}
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 10
    },
    headerContentLeft: {
        // width: 150,
        justifyContent: 'center',
        marginBottom: 10
    },
    headerContentRight: {
        flex: 1,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#fff',
        marginBottom: 10,
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    headerLineParams: {
        borderColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    headerLineTitle: {
        height: 25,
        borderColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    leftParams: {
        justifyContent: 'center',
        alignSelf: 'center'
    },
    rightParams: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTitle: {
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontFamily: 'Nunito-bold',
        color: '#fff',
    },
    textNormal: {
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(22),
        textAlign: 'center',
        fontFamily: 'Nunito-bold',
        color: '#fff',
    },
    textNormalName: {
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontFamily: 'Nunito',
        color: '#fff',
        top: 2,
    },
    textName: {
        fontSize: RFFonsize(14),
        fontWeight: '800',
        fontFamily: 'Nunito-bold',
        color: '#fff',
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txtRightHeader: {
        paddingHorizontal: 13,
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontFamily: 'Nunito-Bold',
        color: '#FFF',
        marginTop: 5.5,
        marginBottom: 5.5,
        marginLeft: 17,
        marginRight: 17
    },
    rightHeader: {
        alignSelf: 'center',
        backgroundColor: '#FFD044',
        borderRadius: 4,
    },
    borderWidthColumn: {
        flexDirection: 'row',
        borderWidth: 1,
        marginTop: 13,
        marginBottom: 13,
        borderColor: '#fff'
    }
})