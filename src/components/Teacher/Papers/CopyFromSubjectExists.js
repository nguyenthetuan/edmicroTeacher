import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    FlatList,
    ScrollView,
    Modal,
    Text,
    Platform,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Animated,
    SafeAreaView,
} from 'react-native';
import _ from 'lodash';
import HeaderPaper from './HeaderPaper';
import Dropdown from '../Homework/Dropdown';
import ModalCurriculum from '../Papers/modalCurriculum';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/CommonBeta';
import AppIcon from '../../../utils/AppIcon';

let height = Dimensions.get('window').height;

export default class CopyFromSubjectExists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lerningTarget: [],
            currentCurriculum: '',
            targetLearning: [],
        }
    }

    componentDidMount() {

    }
    async getDetailSubject(subjectCode) {
        const { token } = await dataHelper.getToken();
        if (token) {
            const response = await apiPapers.getDetailSubject({
                token: token,
                subjectCode: subjectCode,
            });
            await this.setState({ lerningTarget: response && response, currentCurriculum: response[0].id });
            this.findPremadeLib();
        }
    }

    onPressItemSubject = async (index) => {
        const { listSubjects } = this.props.navigation.state.params;
        await this.setState({ subjectCode: [listSubjects[index].code] });
        this.getDetailSubject(this.state.subjectCode)
    };

    async onPressCurriculum(index) {
        await this.setState({ currentCurriculum: this.state.lerningTarget[index].id })
        this.getLerningTarget(this.state.lerningTarget[index].id);
        this.findPremadeLib();
    }

    async getLerningTarget(subjectCode) {
        const { token } = await dataHelper.getToken();
        if (token) {
            const response = await apiPapers.getLearingTarget({
                token: token,
                subjectCode: subjectCode,
            });
            this.setState({ targetLearning: response });
        }
    }

    async findPremadeLib() {
        const { token } = await dataHelper.getToken();
        console.log("this.state.subjectCode: ", this.state.subjectCode);
        let curriculumCodes = [this.state.currentCurriculum];
        let pageIndex = 1;
        let searchKnowledgeUnitChild = true;
        let subjectCodes = this.state.subjectCode;
        let gradeCodes = null;
        let knowledgeUnits = null;
        let name = '';
        const rp = await apiPapers.findPremadeLib({ token, curriculumCodes, pageIndex, searchKnowledgeUnitChild, subjectCodes, gradeCodes, knowledgeUnits, name });
        this.setState({ listTask: rp });
    }

    renderTask(data) {
        let { item, index } = data;
        return (
            <View style={styles.singleTask}>
                <View style={styles.headerTask}>
                    <Text style={styles.titleTask}>{item.name}</Text>
                </View>
                <View style={styles.bodyTask}>
                    <View style={[styles.pieceBody, { width: '40%' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Image
                                source={Common.getIconSubject(item.subjectCodes[0])}
                                resizeMode="contain"
                                style={{ height: 20, width: 20 }} />
                            <Text>{item.subjectNames[0]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Image
                                source={AppIcon.iconClassActive}
                                resizeMode="contain"
                                style={{ height: 20, width: 20 }} />
                            <Text>Lớp {item.gradeCodes[0].slice(1)}</Text>
                        </View>
                    </View>
                    <View style={[styles.pieceBody, { width: '60%' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Image
                                source={AppIcon.totalQuestion}
                                resizeMode="contain"
                                style={{ height: 20, width: 20 }} />
                            <Text>Số câu hỏi: {item.totalQuestion}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Image
                                source={AppIcon.icon_person}
                                resizeMode="contain"
                                style={{ height: 20, width: 20 }} />
                            <Text style={{ fontSize: 12 }}>Tác giả: {item.author}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { listSubjects } = this.props.navigation.state.params;
        const { lerningTarget } = this.state;
        return (
            <View>
                <SafeAreaView style={{ backgroundColor: '#56CCF2' }} />
                <SafeAreaView style={styles.root}>
                    <View style={styles.header}>
                        <HeaderPaper
                            title={'Bộ đề có sẵn'}
                            navigation={this.props.navigation}
                            color={'#fff'}
                        // onRightAction={this.assignmentContent}
                        />
                        <View style={styles.wrapDropdown}>
                            <View style={styles.wrap2Dropdown}>
                                <Dropdown
                                    containerStyle={{
                                        flex: 1,
                                        marginHorizontal: 0,
                                    }}
                                    contentStyle={{ marginHorizontal: 0 }}
                                    title="Môn Học"
                                    data={listSubjects}
                                    onPressItem={(index) => this.onPressItemSubject(index)}
                                />
                                <Dropdown
                                    containerStyle={{
                                        flex: 1,
                                        marginHorizontal: 0,
                                    }}
                                    contentStyle={{ marginHorizontal: 0 }}
                                    title="Giáo trình"
                                    data={this.state.lerningTarget}
                                    onPressItem={(index) => this.onPressCurriculum(index)}
                                    indexSelected={0}
                                />

                            </View>
                            <ModalCurriculum
                                title="Đơn vị kiến thức"
                                // height={this.state.height}
                                data={this.state.targetLearning}
                            // onPress={(value) => this.onPress(4, value)}
                            />
                        </View>
                    </View>
                    <View style={{ width: '100%', alignItems: 'center', height: height - 200 }}>
                        <FlatList
                            data={this.state.listTask}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderTask.bind(this)}
                        />
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}

//getDetailSubject lấy danh sách giáo trình

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        backgroundColor: '#56CCF2',
        height: 150
    },
    wrapDropdown: {
        width: '100%',
        height: 100,
        // justifyContent:'space-around',
        // paddingHorizontal: 30,
        paddingHorizontal: 20,
    },
    wrap2Dropdown: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    singleTask: {
        width: '95%',
        height: 100,
        alignSelf: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    headerTask: {
        width: '100%',
        height: 40,
        backgroundColor: '#2D9CDB',
        flexWrap: 'nowrap',
        paddingHorizontal: 5,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingVertical: 2
    },
    titleTask: {
        lineHeight: 15,
        fontSize: 12,
        fontFamily: 'Nunito',
        color: '#fff',
        fontWeight: '600'
    },
    bodyTask: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        paddingHorizontal: 5
    },
    pieceBody: {
        width: '50%',
        height: '100%',
    }
})