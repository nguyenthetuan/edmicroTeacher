import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    FlatList,
    SafeAreaView,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';
import dataHelper from '../../../utils/dataHelper';
import apiPapers from '../../../services/apiPapersTeacher';
import { connect } from 'react-redux';
import AppIcon from '../../../utils/AppIcon';
import ModalFillter from '../../Teacher/Evaluate/ModalFillter';
import { DATA_YEAR, COL_STATISTATIC_WIDTH } from '../../../constants/const';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import { RFFonsize } from '../../../utils/Fonts';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import ItemName, { HeaderName } from '../../Teacher/Evaluate/ItemName';
import RenderItem, { HeaderItem } from '../../Teacher/Evaluate/ItemStatistatic';

const { width, height } = Dimensions.get('window');
const row_item_width = COL_STATISTATIC_WIDTH;
const row_name_width = width - (Platform.isPad ? 5 : 3) * row_item_width;

class EvaluateDraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: [],
            classSubject: [],
            tests: [],
            isShowFillter: false,
            yearIndex: -1,
            classSubjectIndex: -1,
            testIndex: -1,
            scores: [],
            currentExamTest: {},
        };
    }
    renderHeader = () => {
        const { currentExamTest } = this.state;
        return (
            <View style={styles.wrapContain}>
                {!_.isEmpty(currentExamTest.examName) && (
                    <View style={styles.wrapTitle}>
                        <Text style={styles.styTxtExaName}>{currentExamTest.examName}</Text>
                        <Text style={styles.styTxtName}>{currentExamTest.name}</Text>
                    </View>
                )}

                <View style={styles.containerHeader}>
                    <View style={[styles.itemHeader, { flex: 1 }]}>
                        <Image
                            source={require('../../../asserts/icon/ic_name_evaluate.png')}
                        />
                        <Text style={styles.txtHeader}>Họ và tên</Text>
                    </View>
                    <View style={styles.itemHeader}>
                        <Image
                            source={require('../../../asserts/icon/ic_time_evaluate.png')}
                        />
                        <Text style={styles.txtHeader}>Thời gian</Text>
                    </View>
                    <View style={styles.itemHeader}>
                        <Image
                            source={require('../../../asserts/icon/ic_right_evaluate.png')}
                        />
                        <Text style={styles.txtHeader}>Câu đúng</Text>
                    </View>
                    <View style={styles.itemHeader}>
                        <Image
                            source={require('../../../asserts/icon/ic_wrong_evaluate.png')}
                        />
                        <Text style={styles.txtHeader}>Câu sai</Text>
                    </View>
                    {/* <View style={styles.itemHeader}>
            <Image
              source={require('../../../asserts/icon/ic_skip_evaluate.png')}
            />
            <Text style={styles.txtHeader}>Bỏ qua</Text>
          </View> */}
                    <View style={styles.itemHeader}>
                        <Image
                            source={require('../../../asserts/icon/ic_point_evaluate.png')}
                        />
                        <Text style={styles.txtHeader}>Điểm</Text>
                    </View>
                </View>
            </View>
        );
    };

    goToStatisticsPoints = () => {
        this.props.navigation.navigate('StatisticsPoints', {
            navigation: this.props.navigation,
            statusbar: 'light-content',
            scores: this.state.scores,
        });
    };

    componentDidMount() {
        this.getDataStaticExam();
    }

    _fillter = (key, value) => {
        const obj = Object.assign({ [key]: value });
        this.setState(obj, () => {
            console.log(this.state.classSubjectIndex);
            this.getDataStaticExam();
        });
    };

    getDataStaticExam = async () => {
        const { token } = await dataHelper.getToken();
        const {
            yearIndex,
            classSubjectIndex,
            testIndex,
            classSubject,
            tests,
        } = this.state;
        const classSubjectId = classSubject[classSubjectIndex]?.classSubjectId || 0;
        const testId = tests[testIndex]?.testId || 0;
        const year = DATA_YEAR[yearIndex]?.year || '2020';
        try {
            const response = await apiPapers.getStaticExam({
                token,
                yearCurrent: year,
                classSubjectId,
                testId,
            });
            if (response.status == 1) {
                this.setState({
                    student: response.data.students || [],
                    classSubject: response.data.classSubject || [],
                    tests: response.data.tests || [],
                    scores: response.data.scores || [],
                    currentExamTest: response.data.currentExamTest || {},
                });
                return;
            }
        } catch (error) { }
    };

    renderEmpty = () => {
        return (
            <View style={styles.wrapEmpty}>
                <Image source={require('../../../asserts/icon/iconNodata.png')} />
                <Text style={styles.txtEmpty}>Chưa có dữ liệu thống kê</Text>
            </View>
        );
    };

    _handleClickFillter = () => {
        this.refs.ModalFillter.changeStateModale();
    };

    render() {
        const {
            isShowFillter,
            classSubject,
            classSubjectIndex,
            tests,
            testIndex,
            yearIndex,
            scores,
            currentExamTest
        } = this.state;
        console.log('classSubject', classSubjectIndex)
        const payload = {
            classSubject,
            tests,
            yearIndex,
            classSubjectIndex,
            testIndex,
            scores,
        };
        const { user } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <HeaderNavigation
                    title={'Kiểm tra đánh giá'}
                    navigation={this.props.navigation}
                    actionIcon={AppIcon.ic_analytics}
                    actionIconTwo={AppIcon.icons_filter}
                    iconAction={this.goToStatisticsPoints}
                    iconActionTwo={this._handleClickFillter}
                />
                <ScrollView
                    style={{ zIndex: 1, flex: 1 }}
                    contentContainerStyle={{ paddingTop: 5 }}
                    showsVerticalScrollIndicator={false}>
                    <View style={[styles.body]}>
                        {/* <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                            onPress={this.goToStatisticsPoints}>
                            <View style={styles.btnStatistics}>
                                <Image
                                    source={require('../../../asserts/icon/ic_analytics.png')}
                                />
                                <Text style={styles.txtStatistics}>Thống kê điểm</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                            onPress={this._handleClickFillter}>
                            <View style={[styles.btnStatistics, { marginTop: 10 }]}>
                                <Image source={AppIcon.icons_filter} />
                                <Text style={styles.txtStatistics}>Tuỳ chọn</Text>
                            </View>
                        </TouchableWithoutFeedback> */}
                        {/* <FastImage
                            source={require('../../../asserts/images/banner_evaluate.png')}
                            resizeMode={FastImage.resizeMode.contain}
                            style={styles.imgStatistics}
                        /> */}

                        {/* <FastImage
                            source={require('../../../asserts/images/banner_evaluate.png')}
                            resizeMode={FastImage.resizeMode.contain}
                            style={styles.imgStatistics}
                        /> */}
                    </View>
                    <View style={styles.header}>
                        <Text style={{ color: '#1181C1' }}>{currentExamTest.examName}</Text>
                        <Text style={{ color: '#424242', fontSize: 12, marginTop: 7, marginBottom: 30 }}>{currentExamTest.name}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row' }}>
            <FlatList
              scrollEnabled={false}
              style={styles.list}
              data={this.state.student}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={3}
              ListHeaderComponent={this.renderHeader}
              ListEmptyComponent={this.renderEmpty}
              renderItem={({ item }) => <ItemName item={item} {...payload} />}
            />
            <ScrollView
              onScroll={this.onScroll.bind(this)}
              horizontal={true}
              bounces={false}
              scrollEventThrottle={1}
              containerStyle={{ flex: 3 }}
              showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'column', backgroundColor: 'red' }}>
                <Text>dsadsa</Text>
                <FlatList
                  directionalLockEnabled={true}
                  scrollEnabled={false}
                  data={this.state.student}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <RenderItem item={item} {...payload} />}
                />
              </View>
            </ScrollView>

          </View> */}

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <FlatList
                                style={{ width: row_name_width }}
                                scrollEnabled={false}
                                data={this.state.student}
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={() => <HeaderName currentExamTest={this.state.currentExamTest} />}
                                renderItem={({ item }) => <ItemName item={item} {...payload} />}

                            />
                        </View>
                        <ScrollView
                            // onScroll={this.onScroll.bind(this)}
                            horizontal={true}
                            bounces={false}
                            scrollEventThrottle={1}
                            showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'column' }}>
                                <FlatList
                                    directionalLockEnabled={true}
                                    ListHeaderComponent={() => <HeaderItem />}
                                    scrollEnabled={false}
                                    data={this.state.student}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => <RenderItem row_item_width={row_item_width} item={item} {...payload} />}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
                <ModalFillter
                    ref={'ModalFillter'}
                    getDataStaticExam={this.getDataStaticExam}
                    payload={payload}
                    fillter={this._fillter}
                />
            </SafeAreaView>
        );
    }
}



const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EvaluateDraScreen);

const styles = StyleSheet.create({
    header: {
        marginTop: 32,
        marginLeft: 16,
    },
    container: {
        flex: 1,
        minHeight: 200,
    },
    body: {
        // flex: 1,
        // minHeight: 200,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    btnStatistics: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    txtStatistics: {
        fontSize: RFFonsize(14),
        color: '#2D9CDB',
        marginStart: 8,
        fontFamily: 'Nunito-Regular',
    },
    imgStatistics: {
        alignSelf: 'flex-end',
        marginEnd: 16,
        width: 220,
        height: 200,
        // position: 'absolute',
    },
    list: {
        flex: 1,
        backgroundColor: 'gray'
    },
    containerHeader: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: '#2D9CDB',
        borderTopStartRadius: 11,
        borderTopEndRadius: 11,
    },
    txtHeader: {
        fontSize: RFFonsize(8),
        color: '#fff',
        fontFamily: 'Nunito-Regular',
    },
    itemHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width * (1 / 8),
    },
    containerItem: {
        backgroundColor: '#C6F1FF',
        marginBottom: 10,
        flexDirection: 'row',
        height: 32,
    },
    txtItemName: {
        marginStart: 10,
        fontSize: RFFonsize(10),
        color: '#000',
        fontFamily: 'Nunito-Bold',
        borderWidth: 1,
    },
    viewItemName: {
        justifyContent: 'space-between',
        alignItems: 'center',
        // width: width * (2.9 / 8),
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingRight: 10,
        zIndex: 10,
    },
    txtItem: {
        textAlign: 'center',
        alignSelf: 'center',
        width: COL_STATISTATIC_WIDTH,
        fontSize: RFFonsize(10),
        color: '#000',
        fontFamily: 'Nunito-Regular',
    },
    dotOnline: {
        position: 'absolute',
        bottom: 0,
        right: -3,
        height: 4,
        width: 4,
        borderRadius: 2,
    },
    txtName: {
        fontSize: RFFonsize(12),
        color: '#000',
        fontFamily: 'Nunito-Regular',
    },
    txtNameShow: {
        fontSize: RFFonsize(12),
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: width,
        borderRadius: 5,
    },
    wrapEmpty: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtEmpty: {
        fontFamily: 'Nunito-Regular',
        color: '#828282',
        marginTop: 20,
    },
    wrapTitle: {
        marginHorizontal: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#FFF',
    },
    styTxtExaName: {
        color: '#FFF',
        fontFamily: 'Nunito-Regular',
    },
    styTxtName: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
    },
    wrapContain: {
        backgroundColor: '#2D9CDB',
        borderRadius: 11,
        paddingTop: 5,
    },
});
