import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import dataHelper from '../../utils/dataHelper';
import HeaderNavigation from '../common-new/HeaderNavigation';
import { RFFonsize } from '../../utils/Fonts';
import {
    statisticClassAction,
    statisticMissionAction,
    statisticAssignmentAction
} from '../../actions/statisticAction';
const { width } = Dimensions.get('window');
import AppIcon from '../../utils/AppIcon';
import ProgressBar from '../libs/ProgressBar';
class StatisticScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bgBox: [
                "#00CFF5",
                "#FAB50F",
                "#BC88FF",
                "#E34D5C",
                "#EB9CA8",
                "#7C878E",
                "#8A004F",
                "#000000",
                "#10069F",
                "#00a3e0",
                "#4CC1A1"
            ]
        };
    }
    componentDidMount() {
        this.getDataStatistics();
    }

    getDataStatistics = async () => {
        const { token, enumType } = await dataHelper.getToken();
        const schoolYear = new Date().getFullYear();
        this.props.fetchClassAction({ token, schoolYear });
        this.props.fetchMissionAction({ token, enumType, schoolYear });
        this.props.fetchAssignmentAction({ token, enumType, schoolYear });
    }
    _renderItem = ({ item, index }) => {
        const {
            data,
            navigation,
            isLoading,
            listClass,
            classArray
        } = this.props;
        // const bgBox = this.bgBox;
        return (
            <View style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10
            }}>
                <View style={{
                    flexDirection: 'column',
                    backgroundColor: this.state.bgBox[index % this.state.bgBox.length],
                    borderRadius: 5
                }}>
                    <Text numberOfLines={2}
                        style={styles.number}>
                        {item.totalClass ?
                            (item.totalClass) : 0
                        } Lớp
                     </Text>
                    <View style={styles.direction}>
                        <Image source={AppIcon.icon_heroiconV3} style={styles.heroIcon} />
                        <Text style={styles.countGroup}>
                            {item.totalStudent ?
                                (item.totalStudent) : 0
                            }
                        </Text>
                    </View>
                </View>
            </View>

        )
    }

    render() {
        const {
            assignment,
            mission,
            listClass,
            isLoading,
            classArray
        } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.bgHeader}>
                    <HeaderNavigation
                        navigation={this.props.navigation}
                        color={'#000'}
                        title={'Thống kê'}
                        back={true}
                    />
                </View>
                {isLoading
                    ?
                    <ActivityIndicator size='small' color='gray' style={styles.isLoading} />
                    :
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ flex: 1 }}>
                        <Text style={styles.titleTask}>
                            Quản lý lớp học
                    </Text>
                        <View style={styles.shadow}>
                            <View style={styles.bodyTask}>
                                <Text style={styles.txtTask}>Thống kê số lượng các lớp</Text>
                                <Text style={styles.status}>Số lớp, học sinh Thầy cô đang quản lý</Text>
                                <View style={{ marginLeft: 20, marginRight: 20 }}>
                                    <FlatList
                                        data={classArray}
                                        horizontal
                                        extraData={classArray}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsHorizontalScrollIndicator={false}
                                        stickyHeaderIndices={[0]}
                                        renderItem={this._renderItem}
                                        style={{ backgroundColor: 'transparent' }}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={[styles.txtOnline, { color: '#000' }]}>Số học sinh đang truy cập:</Text>
                                    <Text style={styles.txtCount}>
                                        {listClass.totalStudentOnline}/{listClass.totalStudent}
                                    </Text>
                                </View>
                                <View style={styles.progressBar}>
                                    <ProgressBar
                                        progress={listClass.totalStudentOnline
                                            ?
                                            (listClass.totalStudentOnline / listClass.totalStudent) >
                                                100 ? 100 : (listClass.totalStudentOnline / listClass.totalStudent) : 1}
                                        color="#56BB73"
                                        widthProps={width - 125}
                                        progressUnfilledColor="#BDBDBD"
                                        style={{ height: 5, borderRadius: 10 }}
                                    />
                                    <Text style={styles.rateSub}>
                                        {listClass.totalStudentOnline ?
                                            Math.ceil((listClass.totalStudentOnline / listClass.totalStudent) * 100)
                                            : 0
                                        }%
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.titleTask}>
                                Nhiệm vụ theo tuần
                             </Text>
                            <View style={styles.shadow}>
                                <View style={styles.bodyTask}>
                                    <Text style={styles.txtTask}>Thống kê nhiệm vụ trong tuần</Text>
                                    <Text style={styles.status}>Số nhiệm vụ Thầy cô đã giao</Text>
                                    <View style={styles.flexStatitics}>
                                        <View style={{ flexDirection: 'row', width: '40%' }}>
                                            <View style={styles.flexLeft1}>
                                                <Text numberOfLines={1}
                                                    style={styles.sumBig}>{mission.totalMission}</Text>
                                            </View>
                                            <Text style={styles.sum}>Tổng</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', width: '25%' }}>
                                            <View style={styles.flexIcon}>
                                                <Image source={AppIcon.icon_dagiaoV3} />
                                                <Text style={styles.toSend}>Đã giao</Text>
                                            </View>
                                            <View style={styles.flexIcon}>
                                                <Image source={AppIcon.icon_chuagiaoV3} />
                                                <Text style={styles.toSend}>Chưa giao</Text>
                                            </View>
                                        </View>
                                        <View style={styles.countRight}>
                                            <View style={[styles.flexIcon, { marginRight: 26, justifyContent: 'space-between', width: '90%' }]}>
                                                <Text numberOfLines={1}
                                                    style={styles.numberBig}>{mission.totalMissionAssign}</Text>
                                                <Text numberOfLines={1}
                                                    style={styles.mission}>Nhiệm vụ</Text>
                                            </View>
                                            <View style={[styles.flexIcon, { marginRight: 26, justifyContent: 'space-between', width: '90%' }]}>
                                                <Text style={[styles.numberBig, { color: "#EB5757" }]}>{mission.totalMissionNotAssign}</Text>
                                                <Text numberOfLines={1}
                                                    style={styles.mission}>Nhiệm vụ</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={[styles.status, { color: '#000', marginTop: 26 }]}>Hoàn thành</Text>
                                    <View style={styles.progressBar}>
                                        <ProgressBar
                                            progress={mission.totalMissionAssign ?
                                                (mission.totalMissionAssign / mission.totalMission * 100) : 1
                                            }
                                            color="#56BB73"
                                            widthProps={width - 125}
                                            progressUnfilledColor="#BDBDBD"
                                            style={{ height: 5, borderRadius: 10 }}
                                        />
                                        <Text style={styles.rateSub}>
                                            {mission.totalMissionAssign ?
                                                Math.ceil((mission.totalMissionAssign / mission.totalMission) * 100)
                                                : 0
                                            }%
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.titleTask}>
                                Bài tập trong tuần
                              </Text>
                            <View style={[styles.shadow, { marginBottom: 10 }]}>
                                <View style={styles.bodyTask}>
                                    <Text style={styles.txtTask}>Thống kê bài tập trong tuần</Text>
                                    <Text numberOfLines={1}
                                        style={styles.status}>Số bài tập Thầy cô đã giao trong tuần vừa qua</Text>
                                    <View style={styles.flexStatitics}>
                                        <View style={{ flexDirection: 'row', width: '40%' }}>
                                            <View style={styles.flexLeft2}>
                                                <Text numberOfLines={1}
                                                    style={styles.sumBig}>{assignment.totalAssignment}</Text>
                                            </View>
                                            <Text style={styles.sum}>Tổng</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', width: '25%' }}>
                                            <View style={styles.flexIcon}>
                                                <Image source={AppIcon.icon_dagiaoV3} />
                                                <Text style={styles.toSend}>Đã giao</Text>
                                            </View>
                                            <View style={styles.flexIcon}>
                                                <Image source={AppIcon.icon_chuagiaoV3} />
                                                <Text style={styles.toSend}>Chưa giao</Text>
                                            </View>
                                        </View>
                                        <View style={styles.countRight}>
                                            <View style={[styles.flexIcon, { paddingRight: 26, justifyContent: 'space-between', width: '90%' }]}>
                                                <Text style={styles.numberBig}>{assignment.totalAssign}</Text>
                                                <Text numberOfLines={1}
                                                    style={styles.mission}>Bài tập</Text>
                                            </View>
                                            <View style={[styles.flexIcon, { marginRight: 26, justifyContent: 'space-between', width: '90%' }]}>
                                                <Text style={[styles.numberBig, { color: "#EB5757" }]}>{assignment.totalAssignmentNotAssign}</Text>
                                                <Text numberOfLines={1}
                                                    style={styles.mission}>Bài tập</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={[styles.status, { color: '#000', marginTop: 26 }]}>Hoàn thành</Text>
                                    <View style={styles.progressBar}>
                                        <ProgressBar
                                            progress={assignment.totalAssign ?
                                                (assignment.totalAssign / assignment.totalAssignment * 100) : 1
                                            }
                                            color="#56BB73"
                                            widthProps={width - 125}
                                            progressUnfilledColor="#BDBDBD"
                                            style={{ height: 5, borderRadius: 10 }}
                                        />
                                        <Text style={styles.rateSub}>
                                            {assignment.totalAssign ?
                                                Math.ceil((assignment.totalAssign / assignment.totalAssignment) * 100)
                                                : 0
                                            }%
                                         </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bgHeader: {
        backgroundColor: '#fff',
        // flex: 1
    },
    titleTask: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(21),
        color: '#000',
        marginLeft: 16,
        marginTop: 20,
    },
    bodyTask: {
        backgroundColor: '#FAFAFA',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        borderRadius: 4
    },
    status: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        color: '#2D9CDB',
        marginLeft: 27,
        marginTop: 8,
        marginRight: 10
    },
    txtOnline: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        color: '#2D9CDB',
        marginLeft: 27
    },
    txtTask: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(21),
        marginTop: 12,
        alignSelf: 'center',
    },
    flexStatitics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    flexLeft: {
        backgroundColor: '#23D0F3',
        borderRadius: 4,
        marginTop: 10,
        marginLeft: 50,
        width: '30%'
    },
    flexLeft1: {
        backgroundColor: '#F9B42E',
        borderRadius: 4,
        marginTop: 20,
        marginLeft: 30
    },
    flexLeft2: {
        backgroundColor: '#BB6BD9',
        borderRadius: 4,
        marginTop: 20,
        marginLeft: 30
    },
    flexRight: {
        backgroundColor: '#F9B42E',
        borderRadius: 4,
        marginTop: 10,
        width: '30%',
        marginRight: 30
    },
    heroIcon: {
        alignSelf: 'center',
        marginBottom: 5,
        width: 14,
        height: 14,
    },
    number: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(24),
        lineHeight: RFFonsize(30),
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 18,
        marginLeft: 10,
        marginRight: 10,
        color: '#fff'
    },
    sumBig: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(32),
        lineHeight: RFFonsize(42),
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 19.5,
        marginBottom: 19.5,
        marginLeft: 25,
        marginRight: 25,
        color: '#fff',
    },
    direction: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 14,
        marginRight: 5,
        marginBottom: 5,
    },
    countGroup: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(18),
        color: '#fff',
        fontWeight: '500',
        marginLeft: 3,
        alignSelf: 'center',
        marginRight: 5
    },
    progressBar: {
        marginTop: 7,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 27,
        marginBottom: 15
    },
    rateSub: {
        fontSize: RFFonsize(12),
        color: '#359CDB',
        fontFamily: 'Nunito-Bold',
        position: 'absolute',
        right: 20
    },
    txtCount: {
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#359CDB',
        fontFamily: 'Nunito-Bold',
        alignSelf: 'center',
        marginLeft: 5
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
        flex: 1
    },
    sum: {
        alignSelf: 'flex-end',
        marginLeft: 3
    },
    flexIcon: {
        flexDirection: 'row',
    },
    numberBig: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(32),
        alignSelf: 'center',
        textAlign: 'center',
        color: '#27AE60',

    },
    mission: {
        alignSelf: 'center',
        marginTop: 10,
        marginLeft: 10,
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        paddingRight: 30,
    },
    toSend: {
        marginLeft: 10,
        marginTop: 5,
        marginRight: 10,
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12)
    },
    isLoading: {
        flex: 1
    },
    countRight: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: '35%',
        marginLeft: 5
    }
})

const mapStateToProps = state => {
    return {
        listClass: state.statistic.listClass,
        mission: state.statistic.mission,
        assignment: state.statistic.assignment,
        isLoading: state.statistic.isLoading,
        classArray: state.statistic.classArray,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchClassAction: payload => dispatch(statisticClassAction(payload)),
        fetchMissionAction: payload => dispatch(statisticMissionAction(payload)),
        fetchAssignmentAction: payload => dispatch(statisticAssignmentAction(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatisticScreen);