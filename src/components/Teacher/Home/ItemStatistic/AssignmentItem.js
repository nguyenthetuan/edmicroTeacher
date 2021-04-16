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
import dataHelper from '../../../../utils/dataHelper';
import { RFFonsize } from '../../../../utils/Fonts';
import {
    statisticClassAction,
    statisticMissionAction,
    statisticAssignmentAction
} from '../../../../actions/statisticAction';
const { width } = Dimensions.get('window');
import AppIcon from '../../../../utils/AppIcon';
import ProgressBar from '../../../libs/ProgressBar';

class AssignmentItem extends Component {
    // assignment?.totalAssign ?
    // (assignment?.totalAssign / assignment?.totalAssignment * 100) : 1
    getProgess = (assignment) => {
        const { totalAssign = 0, totalAssignment = 0 } = assignment;
        let progress = 0;
        if (totalAssign == 0) {
            return progress;
        }
        try {
            progress = ((totalAssign / totalAssignment) * 100);
        } catch (error) {
            return 0;
        }
        return progress;
    }
    render() {
        const { assignment } = this.props;
        return (
            <View style={[styles.shadow, { marginBottom: 10 }]}>
                <View style={styles.bodyTask}>
                    <Text style={styles.txtTask}>Thống kê bài tập trong tuần</Text>
                    <Text numberOfLines={1}
                        style={styles.status}>Số bài tập Thầy cô đã giao trong tuần vừa qua</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={styles.flexLeft2}>
                            <Text numberOfLines={1}
                                style={styles.sumBig}>{assignment?.totalAssignment}</Text>
                        </View>
                        <Text style={styles.sum}>Tổng</Text>
                    </View>
                    <View style={styles.flexStatitics}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: 30 }}>
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
                                <Text style={styles.numberBig}>{assignment?.totalAssign}</Text>
                                <Text numberOfLines={1}
                                    style={styles.mission}>Bài tập</Text>
                            </View>
                            <View style={[styles.flexIcon, { marginRight: 26, justifyContent: 'space-between', width: '90%' }]}>
                                <Text style={[styles.numberBig, { color: "#EB5757" }]}>{assignment?.totalAssignmentNotAssign}</Text>
                                <Text numberOfLines={1}
                                    style={styles.mission}>Bài tập</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={[styles.status, { color: '#000', marginTop: 26 }]}>Hoàn thành</Text>
                    <View style={styles.progressBar}>
                        <ProgressBar
                            progress={this.getProgess(assignment)}
                            color="#56BB73"
                            widthProps={width - 185}
                            progressUnfilledColor="#BDBDBD"
                            style={{ height: 5, borderRadius: 10 }}
                        />
                        <Text style={styles.rateSub}>
                            {assignment?.totalAssign ?
                                Math.ceil((assignment?.totalAssign / assignment?.totalAssignment) * 100)
                                : 0
                            }%
                     </Text>
                    </View>
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        assignment: state.statistic.assignment,
        isLoading: state.statistic.isLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentItem);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bgHeader: {
        backgroundColor: '#fff',
    },
    titleTask: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        color: '#000',
        marginLeft: 16,
        marginTop: 20,
    },
    bodyTask: {
        backgroundColor: '#FAFAFA',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        borderRadius: 10
    },
    status: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#2D9CDB',
        marginLeft: 27,
        marginTop: 8,
        marginRight: 10
    },
    txtOnline: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#2D9CDB',
        marginLeft: 27
    },
    txtTask: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        marginTop: 12,
        alignSelf: 'center',
    },
    flexStatitics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
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
        fontSize: RFFonsize(20),
        lineHeight: RFFonsize(24),
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 18,
        marginLeft: 10,
        marginRight: 10,
        color: '#fff'
    },
    sumBig: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(18),
        lineHeight: RFFonsize(24),
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
        fontSize: RFFonsize(18),
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