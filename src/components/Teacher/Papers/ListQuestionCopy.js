import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import Header from '../../common-new/Header';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/CommonBeta';
import AppIcon from '../../../utils/AppIcon';
import htmlHelper from '../../../utils/WebviewListQuestionCopy';
import Toast, { DURATION } from 'react-native-easy-toast';
import { WebView } from 'react-native-webview';
import WarningModal from '../../modals/WarningModal';
import { RFFonsize } from '../../../utils/Fonts';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window');

const knowledgeText = { 0: '0', 1: '1', 2: '2', 3: '3' };
// 0. Nhận biết, 1.Thông hiểu, 2. Vân dụng, 3. Vận dụng cao
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

        this.props.navigation.navigate('ConfigQuestion', {
            nagigation: this.props.nagigation,
            statusbar: 'light-content',
            curriculumCode: data.subjectCode,
            data: data,
        });
    }

    filterDataRender(dataSource) {
        let result = dataSource.sort((a, b) => (a.index - b.index));
        return result;
    }
    showToast() {
        // if() {
        // }
    }
    render() {
        const data = this.props.navigation.state.params.data.data;
        this.filterDataRender(data.questions);
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ backgroundColor: '#2D9CDB' }} />
                {/* <View style={styles.root}> */}
                <View style={styles.header}>
                    <Header
                        ref={ref => this.refHeader = ref}
                        title={data.name}
                        color={'#fff'}
                        navigation={this.props.navigation}
                        onRightAction={this.copySubjectMatter}
                        styleTitle={styles.styleTitle}
                        colorBtnBack={'#ffffff'}
                        centerTitle={false}
                        createPaper={false}
                        btnCopy={true}
                    />
                    <View style={styles.headerContent}>
                        <View style={styles.headerContentLeft}>
                            <View style={styles.flexRow}>
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <Text style={[styles.textNormalName, { fontSize: RFFonsize(14) }]}>Lớp: </Text>
                                    <View style={{ height: 20, paddingHorizontal: 0, left: 4.5, borderColor: '#fff' }}>
                                        <Text style={styles.textNormal}>{data.gradeCode[0].slice(1)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', right: 16 }}>
                                    <Text style={[styles.textNormalName, { fontSize: RFFonsize(14) }]}>Môn: </Text>
                                    <View style={{ height: 20, paddingHorizontal: 0, borderColor: '#fff' }}>
                                        <Text numberOfLines={2}
                                            style={[styles.textNormal, { width: width - 320 }]}>{data.subjectNames[0]}</Text>
                                    </View>
                                </View>
                                {/* <TouchableWithoutFeedback
                                        hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                        onPress={this.copySubjectMatter}
                                    >
                                        <View style={styles.rightHeader}>
                                            <Text style={styles.txtRightHeader}>{`Sao chép bộ đề` || `Lưu cấu hình`}</Text>
                                        </View>
                                    </TouchableWithoutFeedback> */}
                            </View>
                        </View>
                        <View style={styles.headerContentRight}>
                            {!!this.state[`knowledge0`] &&
                                <TouchableWithoutFeedback onPress={this.showToast}>
                                    <View style={styles.headerLineParams}>
                                        {/* <View style={styles.leftParams}>
                                    <Text style={styles.textNormalName}>{knowledgeText['0']}</Text>
                                </View> */}
                                        <View style={styles.leftParams}>
                                            <Image source={require('../../../asserts/icon/icon_testDemoCopy.png')} />
                                        </View>
                                        <View style={styles.rightParams}>
                                            <Text style={styles.txtQuestion}>{this.state[`knowledge0`]} câu</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            }
                            {!!this.state[`knowledge1`] &&
                                <TouchableWithoutFeedback onPress={this.showToast}>
                                    <View style={styles.headerLineParams}>
                                        <View style={styles.leftParams}>
                                            <Image source={require('../../../asserts/icon/icon_testDemoCopy.png')} />
                                        </View>
                                        <View style={styles.rightParams}>
                                            <Text style={styles.txtQuestion}>{this.state[`knowledge1`]} câu</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>}
                            {!!this.state[`knowledge2`] &&
                                <TouchableWithoutFeedback onPress={this.showToast}>
                                    < View style={styles.headerLineParams}>
                                        <View style={styles.leftParams}>
                                            <Image source={require('../../../asserts/icon/icon_testDemoCopy.png')} />
                                        </View>
                                        <View style={styles.rightParams}>
                                            <Text style={styles.txtQuestion}>{this.state[`knowledge2`]} câu</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            }
                            {!!this.state[`knowledge3`] &&
                                <TouchableWithoutFeedback onPress={this.showToast}>
                                    <View style={styles.headerLineParams}>
                                        <View style={styles.leftParams}>
                                            <Image source={require('../../../asserts/icon/icon_testDemoCopy.png')} />
                                        </View>
                                        <View style={styles.rightParams}>
                                            <Text style={styles.txtQuestion}>{this.state[`knowledge3`]} câu</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>}
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', flex: 1 }}>
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
                <Toast ref="toast" position={'top'} />
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
        backgroundColor: '#2D9CDB',
        height: height * 0.2,
    },
    headerContent: {
        flexDirection: 'column',
        flex: 1,
        paddingHorizontal: 10,
    },
    headerContentLeft: {
        justifyContent: 'center',
        marginVertical: 8
    },
    headerContentRight: {
        marginVertical: height * 0.02,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    headerLineParams: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingHorizontal: 10,
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
        justifyContent: 'center',
        marginLeft: 5
    },
    textTitle: {
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontFamily: 'Nunito-bold',
        color: '#fff',
    },
    textNormal: {
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
        textAlign: 'center',
        fontFamily: 'Nunito-bold',
        color: '#fff',
    },
    textNormalName: {
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(18),
        fontFamily: 'Nunito',
        color: '#fff'
    },
    txtQuestion: {
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        fontFamily: 'Nunito-Bold',
        color: '#fff'
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
        alignItems: 'center',
        paddingHorizontal: 5
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
        borderColor: '#fff',
    },
    styleTitle: {
        flex: 0,
        color: '#fff',
        fontSize: RFFonsize(14),
        fontWeight: 'bold',
    },
})