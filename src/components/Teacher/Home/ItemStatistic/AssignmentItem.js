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
const { width, height } = Dimensions.get('window');
import ProgressBar from '../../../libs/ProgressBar';
import AwesomeButton from 'react-native-really-awesome-button';
import shadowStyle from '../../../../themes/shadowStyle';
import { PieChart } from 'react-native-svg-charts';

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
        const { shadowBtn } = shadowStyle;
        const { assignment } = this.props;
        let data = [
            {
                key: 1,
                amount: assignment.totalAssign,
                svg: { fill: '#F2B27C' },
            },
            {
                key: 2,
                amount: assignment.totalAssignmentNotAssign,
                svg: { fill: '#40BCDF' }
            },
        ];

        if ((assignment.totalAssign == 0 && assignment.totalAssignmentNotAssign == 0) || !assignment.totalAssignment) {
            data.push({
                key: 3,
                amount: 1,
                svg: { fill: '#c4c4c4' }
            });
        }
        return (
            <View style={[styles.shadow, { marginBottom: 10 }]}>
                <View style={styles.bodyTask}>
                    <Text style={styles.txtTask}>Thống kê bài tập trong tuần</Text>
                    <Text numberOfLines={1}
                        style={styles.status}>Số nhiệm vụ thầy cô giao</Text>
                    {/* <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
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
                        <View style={styles.bottomMiss}>
                            <View style={[styles.boxSmall, { backgroundColor: '#FF5747' }]}>
                                <Text numberOfLines={1}
                                    style={styles.numberBig}>{assignment?.totalAssignmentNotAssign}</Text>
                            </View>
                            <Text numberOfLines={2} style={styles.missionAssed}>Bài tập chưa giao</Text>
                        </View>
                    </View> */}
                    <View style={styles.shaodowPie}>
                        <PieChart
                            style={{ height: height * 0.2 }}
                            valueAccessor={({ item }) => item.amount}
                            data={data}
                            spacing={10}
                            outerRadius={'80%'}
                            innerRadius={'45%'}
                            labelRadius={10}
                        />
                        <View style={styles.Total}>
                            <Text style={styles.TotalColor}>{assignment?.totalAssignment}</Text>
                        </View>
                    </View>

                    <View style={styles.note}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.noteColor, { backgroundColor: "#40BCDF" }]} />
                            <Text style={styles.txtNote}>Bài tập chưa giao</Text>
                        </View>
                        <Text style={[styles.countNumber, { color: '#40BCDF' }]}>{assignment?.totalAssignmentNotAssign}</Text>
                    </View>
                    <View style={[styles.note, { marginTop: 10 }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.noteColor} />
                            <Text style={styles.txtNote}>Hoàn thành</Text>
                        </View>
                        <Text style={styles.countNumber}>{assignment?.totalAssign}</Text>
                    </View>



                    <AwesomeButton
                        // onPress={onAssignment}
                        style={[styles.AweBtn, { ...shadowBtn }]}
                        height={35}
                        backgroundColor={'#2D9CDB'}
                        borderRadius={25}
                        backgroundActive={'#2D9DFE'}
                        backgroundShadow={'transparent'}
                        backgroundDarker={'transparent'}
                    >
                        <Text style={styles.txtAssignment}> Xem chi tiết</Text>
                    </AwesomeButton>
                    {/* <Text style={[styles.status, { color: '#828282', marginTop: 20, textAlign: 'left', marginLeft: 27 }]}>Hoàn thành</Text>
                    <View style={styles.progressBar}>
                        <ProgressBar
                            progress={this.getProgess(assignment)}
                            color="#56BB73"
                            widthProps={width - 200}
                            progressUnfilledColor="#BDBDBD"
                            style={{ height: 5, borderRadius: 10 }}
                        />
                        <Text style={styles.rateSub}>
                            {assignment?.totalAssign ?
                                Math.ceil((assignment?.totalAssign / assignment?.totalAssignment) * 100)
                                : 0
                            }%
                     </Text>
                    </View> */}
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
        marginTop: 19,
        alignSelf: 'center',
    },
    flexStatitics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 16,
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
        marginTop: 5,
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
        shadowRadius: 6,
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
        justifyContent: 'center',
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
    Total: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TotalColor: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(24),
        lineHeight: RFFonsize(34),
        color: "#FF6213",
    },
    note: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 50
    },
    noteColor: {
        backgroundColor: '#F2B27C',
        width: 16,
        height: 16
    },
    txtNote: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        color: "#828282",
        alignSelf: 'center',
        marginLeft: 16
    },
    countNumber: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: "#F2B27C",
    },
    shaodowPie: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    AweBtn: {
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    txtAssignment: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        color: '#fff',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 6,
        marginBottom: 6
    },
})