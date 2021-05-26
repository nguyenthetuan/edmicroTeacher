import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    FlatList,
    Text,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import _ from 'lodash';
import HeaderPaper from './HeaderPaper';
import Dropdown from '../Homework/Dropdown';
import ModalCurriculum from '../Papers/modalCurriculum';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/Common';
import AppIcon from '../../../utils/AppIcon';
import ListTaskPlaceHolder from '../../shim/ListTaskPlaceHolder';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { RFFonsize } from '../../../utils/Fonts';
import RippleButton from '../../common-new/RippleButton';
import shadowStyle from '../../../themes/shadowStyle';
const { width, height } = Dimensions.get('window');

// let height = Dimensions.get('window').height;
let indexPage = 0;
export default class CopyFromSubjectExists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lerningTarget: [],
            currentCurriculum: '',
            targetLearning: [],
            indexSelected: 0,
            subjectCode: [],
            knowledgeUnits: null,
            isLoading: false,
            listTask: [],
            searchName: ''
        }
    }

    componentDidMount() {
        const { listSubjects } = this.props.navigation.state.params;
        let subjectCode = [listSubjects[0]?.code];
        this.setState({ subjectCode });
        this.getDetailSubject(subjectCode)
    }
    async getDetailSubject(subjectCode) {
        const { token } = await dataHelper.getToken();
        indexPage = 0;
        if (token) {
            const response = await apiPapers.getDetailSubject({
                token: token,
                subjectCode: subjectCode,
            });
            if (_.isEmpty(response)) {
                await this.setState({ lerningTarget: [], currentCurriculum: '' });
                this.findPremadeLib();
                return;
            }
            await this.setState({ lerningTarget: response && response, currentCurriculum: response[0].id });
            this.getLerningTarget(response[0].id);

            this.findPremadeLib();
        }
    }

    renderLoadMoreButton = () => {
        if (this.state.listTask.length > 10) {
            return (
                <View style={styles.loadmoreWrap}>
                    <RippleButton onPress={() => { this.loadMorePress() }} style={styles.loadmoreBtn}>
                        <Text style={styles.textLoadMore}>Xem Thêm...</Text>
                    </RippleButton>
                </View >
            )
        }
        else {
            return null;
        }
    }

    onPressItemSubject = async (index) => {
        const { listSubjects } = this.props.navigation.state.params;
        let subjectCode = [];
        subjectCode = [listSubjects[index].code];
        if (JSON.stringify(subjectCode) === JSON.stringify(this.state.subjectCode)) {
            return;
        }
        await this.setState({ subjectCode: [listSubjects[index].code] });
        this.getDetailSubject(this.state.subjectCode)
    };

    async onPressCurriculum(index) {
        await this.setState({ currentCurriculum: this.state.lerningTarget[index].id })
        this.getLerningTarget(this.state.lerningTarget[index].id);
        indexPage = 0;
        this.findPremadeLib();
    }

    async getLerningTarget(subjectCode) {
        const { token } = await dataHelper.getToken();
        if (token) {
            const response = await apiPapers.getLearingTarget({
                token: token,
                curriculumCode: subjectCode,
            });
            this.setState({ targetLearning: !response ? [] : response });
        }
    }

    async findPremadeLib(indexPage, isSearch) {
        const { token } = await dataHelper.getToken();
        let { listTask } = this.state;
        let curriculumCodes = [this.state.currentCurriculum];
        let pageIndex = indexPage || 1;
        let searchKnowledgeUnitChild = true;
        let subjectCodes = this.state.subjectCode;
        let gradeCodes = null;
        let knowledgeUnits = this.state.knowledgeUnits;
        let name = this.state.searchName;
        if (!indexPage) {
            this.setState({ isLoading: true });
        }
        const rp = await apiPapers.findPremadeLib({ token, curriculumCodes, pageIndex, searchKnowledgeUnitChild, subjectCodes, gradeCodes, knowledgeUnits, name });
        if (listTask) {
            this.setState({ listTask: rp, isLoading: false });
        } else {
            this.setState({ listTask: !rp ? listTask : listTask.concat(rp), isLoading: false });
        }
    }

    loadMorePress() {
        indexPage++;
        this.findPremadeLib(indexPage);
    }

    onPress(data) {
        console.log('onPress: ', data);
        indexPage = 0;
        const { subjectCode, code, curriculumCode } = data;
        this.setState({ knowledgeUnits: code ? [code] : null },
            () => {
                this.findPremadeLib();
            }
        )
    }

    onPressItemTask = async (id) => {
        const { token } = await dataHelper.getToken();
        const data = await apiPapers.premadeLibCopy({ token, id });
        const { listSubjects } = this.props.navigation.state.params;

        this.props.navigation.navigate('ListQuestionCopy', {
            nagigation: this.props.nagigation,
            statusbar: 'light-content',
            data: data,
            listSubjects: listSubjects,
        });
    }

    renderTask = (data) => {
        let { item, index } = data;
        const { shadowBtn } = shadowStyle;
        return (
            <TouchableWithoutFeedback
                onPress={(item) => { this.onPressItemTask(data.item.id) }}
                key={index}
            >
                <View style={[styles.singleTask, shadowBtn]}>
                    <View style={styles.headerTask}>
                        <Text numberOfLines={1}
                            style={styles.titleTask}>
                            {item.name}
                        </Text>
                    </View>
                    <View style={styles.bodyTask}>
                        <View style={styles.pieceBody}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={Common.getIconSubject(item.subjectCodes[0])}
                                    resizeMode="contain"
                                    style={{ height: 22, width: 22, borderRadius: 40, marginLeft: 1 }} />
                                <Text style={styles.textDetail}>{item.subjectNames[0]}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Image
                                    source={require('../../../asserts/icon/icon_remakeClassV3.png')}
                                    resizeMode="contain"
                                    style={{ height: 23, width: 23, tintColor: '#F78E30' }} />
                                <Text style={styles.textDetail}>Lớp {item.gradeCodes[0].slice(1)}</Text>
                            </View>
                        </View>
                        <View style={[styles.pieceBody, { width: "60%", }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={AppIcon.icon_questionV3}
                                    resizeMode="contain"
                                    style={{ height: 20, width: 20, tintColor: '#DB3546' }} />
                                <Text style={styles.textDetail}>Số câu hỏi: {item.totalQuestion}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Image
                                    source={AppIcon.icon_authorV3}
                                    resizeMode="contain"
                                    style={{ height: 20, width: 20, tintColor: '#7E96EC' }} />
                                <Text style={styles.textDetail}>Tác giả:
                             <Text style={styles.colorTG}> {item.author}</Text></Text>
                            </View>
                        </View>
                        <Image source={AppIcon.icon_paperParacV3} style={styles.paperParacV3} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    onPressSearch = () => {
        this.setState({ searchName: this.state.previosSearchText }, () => {
            this.findPremadeLib();
        });
    }

    onChangePreviosSearchText = (text) => {
        this.setState({ previosSearchText: text });
    }

    render() {
        const { listSubjects } = this.props.navigation.state.params;
        const { lerningTarget, isLoading } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}
            >
                <View style={{ backgroundColor: '#56CCF2', flex: 1 }}>
                    <SafeAreaView />
                    <HeaderPaper
                        title={'Bộ đề có sẵn'}
                        navigation={this.props.navigation}
                        color={'#fff'}
                        notRightButton={true}
                        createPaper={true}
                    />
                    <View style={styles.wrapDropdown}>
                        <View style={styles.wrap2Dropdown}>
                            <Dropdown
                                containerStyle={styles.styleDrop}
                                contentStyle={styles.firstTwo}
                                title="Môn Học"
                                data={listSubjects}
                                onPressItem={(index) => this.onPressItemSubject(index)}
                                boldText={{ fontWeight: "700", color: '#55CCF2' }}
                            />
                            <Dropdown
                                containerStyle={styles.styleDrop}
                                contentStyle={styles.firstTwo}
                                title="Giáo trình"
                                data={this.state.lerningTarget}
                                onPressItem={(index) => this.onPressCurriculum(index)}
                                indexSelected={this.state.indexSelected}
                                boldText={{ fontWeight: "700", color: '#55CCF2' }}
                            />
                        </View>
                        <View style={styles.styWrapInput}>
                            <TextInput
                                placeholder={'Tên bộ đề'}
                                placeholderTextColor={'#c4c4c4'}
                                style={styles.nameTest}
                                value={this.state.textPreviosSearch}
                                onChangeText={this.onChangePreviosSearchText}
                            />
                            <TouchableWithoutFeedback
                                onPress={() => { this.onPressSearch() }}>
                                <View style={styles.searchIcon}>
                                    <Image source={require('../../../asserts/icon/icon_searchNamePaper.png')} style={{ width: 15, height: 15 }} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <ModalCurriculum
                            curriculumCode={this.state.currentCurriculum}
                            data={this.state.targetLearning}
                            onPress={(value) => this.onPress(value)}
                            styleTitle={{ color: '#fff' }}
                            borderStyle={styles.boeSty}
                            stylePlace={styles.stylePlace}
                        />

                    </View>
                    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 55 }}>
                        {!isLoading
                            ?
                            <View style={styles.viewStatus}>
                                <FlatList
                                    data={this.state.listTask}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderTask}
                                    style={{ paddingHorizontal: 5 }}
                                    ListFooterComponent={this.renderLoadMoreButton}
                                />
                            </View>
                            :
                            <View style={[styles.viewStatus, { flex: 1 }]}>
                                {isLoading && (<ListTaskPlaceHolder />)}
                            </View>
                        }
                    </View>
                    <SafeAreaView style={{ backgroundColor: '#fff' }} />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

//getDetailSubject lấy danh sách giáo trình

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    header: {
        flex: 1,
        backgroundColor: '#56CCF2',
        paddingHorizontal: 6,
        height: height * 0.3
    },
    wrapDropdown: {
        paddingHorizontal: 16,
        marginTop: 10,
    },
    wrap2Dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    singleTask: {
        height: 100,
        alignSelf: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#56CCF2',
        borderRadius: 5,
        backgroundColor: '#fff'
        // paddingLeft: 16,
        // paddingRight: 16,
    },
    headerTask: {
        backgroundColor: '#56CCF2',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingVertical: 3,
    },
    titleTask: {
        fontFamily: 'Nunito-Bold',
        lineHeight: RFFonsize(16),
        fontSize: RFFonsize(12),
        color: '#fff',
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 12,
        width: 320
    },
    bodyTask: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 14
    },
    pieceBody: {
        width: '40%',
        marginTop: 10.5,
        paddingHorizontal: 10
    },
    textDetail: {
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        fontFamily: 'Nunito',
        color: '#000',
        marginLeft: 5,
    },
    styWrapInput: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#fff',
        flexDirection: "row",
        alignItems: 'center',
        height: 35,
        marginTop: 3,
        marginBottom: 10
    },
    styleDrop: {
        marginBottom: 10,
        height: 35
    },
    styleDrop1: {
        flex: 1,
        marginHorizontal: 0,
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    flexColumn: {
        flex: 1,
        bottom: 16
    },
    viewStatus: {
        backgroundColor: 'transparent',
    },
    paperParacV3: {
        marginLeft: -60,
        marginRight: 10,
        alignItems: 'center',
        alignSelf: 'center'
    },
    imageHeaderLeft: {
        marginLeft: 10
    },
    iconSearch: {
        alignSelf: 'center',
        color: '#828282',
        marginRight: 3,
    },
    colorTG: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(16),
        color: "#7E96EC",
    },
    nameTest: {
        color: '#55CCF2',
        flex: 1,
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        backgroundColor: '#fff',
        paddingVertical: 0,
        paddingHorizontal: 5
    },
    loadmoreWrap: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 5
    },
    loadmoreBtn: {
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLoadMore: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        fontWeight: '500',
        color: '#55CCF2',
        textAlign: 'center',
        alignSelf: "center"
    },
    searchIcon: {
        right: 4,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstTwo: {
        marginHorizontal: 0,
        paddingLeft: 5,
        width: width * 0.4,
        height: 35
    },
    boeSty: {
        height: 35,
        borderRadius: 5,
        borderColor: "#fff",
        paddingRight: 2
    },
    stylePlace: {
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        fontWeight: "500",
        color: "#c4c4c4"
    }
})