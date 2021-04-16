import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
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
import ProgressBar from '../../../libs/ProgressBar';

class AssignmentItem extends Component {

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
                        style={styles.status}>Số nhiệm vụ thầy cô giao</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={styles.flexLeft2}>
                            <Text numberOfLines={1}
                                style={styles.sumBig}>{assignment?.totalAssignment}</Text>
                            <Text style={styles.sum}>Tổng</Text>
                        </View>
                    </View>
                    <View style={styles.flexStatitics}>
                        <View style={styles.bottomMiss}>
                            <View style={styles.boxSmall}>
                                <Text numberOfLines={1}
                                    style={styles.numberBig}>{assignment?.totalAssign}</Text>
                            </View>
                            <Text numberOfLines={2} style={styles.missionAssed}>Bài tập đã giao</Text>
                        </View>
                        <View style={[styles.bottomMiss, { marginRight: 18 }]}>
                            <View style={[styles.boxSmall, { backgroundColor: '#FF5747' }]}>
                                <Text numberOfLines={1}
                                    style={styles.numberBig}>{assignment?.totalAssignmentNotAssign}</Text>
                            </View>
                            <Text numberOfLines={2} style={styles.missionAssed}>Bài tập chưa giao</Text>
                        </View>
                    </View>
                    <Text style={[styles.status, { color: '#828282', marginTop: 20, textAlign: 'left', marginLeft: 27 }]}>Hoàn thành</Text>
                    <View style={styles.progressBar}>
                        <ProgressBar
                            progress={this.getProgess(assignment)}
                            color="#56BB73"
                            widthProps={width - 230}
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
        textAlign: 'center',
        marginTop: 6
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
        marginTop: 20
    },
    flexLeft2: {
        backgroundColor: '#BB6BD9',
        borderRadius: 10,
        marginTop: 20,
        alignSelf: 'center',
        flexDirection: 'column',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    sumBig: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(36),
        lineHeight: RFFonsize(49),
        textAlign: 'center',
        alignSelf: 'center',
        marginHorizontal: 23,
        marginTop: 16,
        color: '#fff',
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
        lineHeight: RFFonsize(16),
        color: '#56BB73',
        fontFamily: 'Nunito-Bold',
        position: 'absolute',
        right: 20,
        textAlign: 'center',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.30,
        shadowRadius: 8,
        elevation: 5,
        flex: 1
    },
    sum: {
        alignSelf: 'flex-end',
        right: 5,
        bottom: 5,
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        textAlign: 'center',
        color: '#fff',
    },
    numberBig: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(18),
        lineHeight: RFFonsize(25),
        alignSelf: 'center',
        textAlign: 'center',
        color: '#fff',
        marginHorizontal: 9,
        marginVertical: 7.5
    },
    bottomMiss: {
        flexDirection: 'row',
        flex: 1,
        marginLeft: 19,
    },
    boxSmall: {
        backgroundColor: '#1BC763',
        borderRadius: 10,
        padding: 7,
    },
    missionAssed: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        width: width * 0.18,
        paddingHorizontal: 6,
        marginTop: 25
    },
})