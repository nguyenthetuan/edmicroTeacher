import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import dataHelper from '../../../../utils/dataHelper';
import { RFFonsize } from '../../../../utils/Fonts';
import ProgressBar from '../../../libs/ProgressBar';
import { PieChart } from 'react-native-svg-charts';
// import { Circle, G, Line } from "react-native-svg";
import AwesomeButton from 'react-native-really-awesome-button';
import shadowStyle from '../../../../themes/shadowStyle';
const { width, height } = Dimensions.get('window');

class MissionItem extends React.PureComponent {

    getProgess = (mission) => {
        const { totalMissionAssign = 0, totalMission = 0 } = mission;
        let progress = 0;
        if (totalMission == 0) {
            return progress;
        }
        try {
            progress = ((totalMissionAssign / totalMission) * 100);
        } catch (error) {
            return 0;
        }
        return progress;
    }

    onMissionPress = () => {
        this.props.navigation.navigate('Mission', { statusbar: 'dark-content' });
    }

    render() {
        const { shadowBtn } = shadowStyle;
        const { mission } = this.props;
        let data = [
            {
                key: 1,
                amount: mission.totalMissionAssign,
                svg: { fill: '#FFD044' },
            },
            {
                key: 2,
                amount: mission.totalMissionNotAssign,
                svg: { fill: '#7E96EC' }
            },
        ];

        if ((mission.totalMissionAssign == 0 && mission.totalMissionNotAssign == 0) || !mission.totalMission) {
            data.push({
                key: 3,
                amount: 1,
                svg: { fill: '#c4c4c4' }
            });
        }

        return (
            <View style={styles.shadow}>
                <View style={styles.bodyTask}>
                    <Text style={styles.txtTask}>Thống kê nhiệm vụ trong tuần</Text>
                    <Text style={styles.status}>Số nhiệm vụ Thầy cô đã giao</Text>
                    {/* <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={styles.flexLeft1}>
                            <Text numberOfLines={1}
                                style={styles.sumBig}>{mission?.totalMission}</Text>
                            <Text style={styles.sum}>Tổng</Text>
                        </View>
                    </View>
                    <View style={styles.flexStatitics}>
                        <View style={styles.bottomMiss}>
                            <View style={styles.boxSmall}>
                                <Text numberOfLines={1}
                                    style={styles.numberBig}>{mission?.totalMissionAssign}</Text>
                            </View>
                            <Text numberOfLines={2} style={styles.missionAssed}>Nhiệm vụ đã giao</Text>
                        </View>
                        <View style={styles.bottomMiss}>
                            <View style={[styles.boxSmall, { backgroundColor: '#FF5747' }]}>
                                <Text numberOfLines={1}
                                    style={styles.numberBig}>{mission?.totalMissionNotAssign}</Text>
                            </View>
                            <Text numberOfLines={2} style={styles.missionAssed}>Nhiệm vụ chưa giao</Text>
                        </View>
                    </View> */}
                    <View>
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
                        </View>
                        <View style={styles.Total}>
                            <Text style={[styles.TotalColor, {
                                color: mission?.totalMission == 0 ? '#c4c4c4' : '#ff6213'
                            }]}>{mission?.totalMission}</Text>
                        </View>
                    </View>

                    <View style={styles.note}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.noteColor, { backgroundColor: "#7E96EC" }]} />
                            <Text style={styles.txtNote}>Nhiệm vụ chưa giao</Text>
                        </View>
                        <Text style={[styles.countNumber, { color: '#7E96EC' }]}>{mission?.totalMissionNotAssign}</Text>
                    </View>

                    <View style={[styles.note, { marginTop: 10 }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.noteColor} />
                            <Text style={styles.txtNote}>Hoàn thành</Text>
                        </View>
                        <Text style={styles.countNumber}>{mission?.totalMissionAssign}</Text>
                    </View>


                    <AwesomeButton
                        onPress={this.onMissionPress}
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
                            progress={this.getProgess(mission)}
                            color="#56BB73"
                            widthProps={width - 200}
                            progressUnfilledColor="#BDBDBD"
                            style={{ height: 5, borderRadius: 10 }}
                        />
                        <Text style={styles.rateSub}>
                            {mission?.totalMissionAssign ?
                                Math.ceil((mission?.totalMissionAssign / mission?.totalMission) * 100)
                                : 0
                            }%
                        </Text>
                    </View> */}

                </View>
            </View >
        )
    }
}



const mapStateToProps = state => {
    return {
        mission: state.statistic.mission,
        isLoading: state.statistic.isLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MissionItem);


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
        marginTop: 6,
    },
    txtTask: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        marginTop: 19,
        alignSelf: 'center',
        color: '#000'
    },
    flexStatitics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 16
    },
    flexLeft1: {
        backgroundColor: '#F9B42E',
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
        elevation: 3,
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
    bottomMiss: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
    },
    note: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 50
    },
    noteColor: {
        backgroundColor: '#FFD044',
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
        color: "#FFD044",
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
        marginRight: 20
    },
})