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
import AppIcon from '../../../../utils/AppIcon';
import ProgressBar from '../../../libs/ProgressBar';

const { width, height } = Dimensions.get('window');

class ClassItem extends Component {

    getProgess = (listClass) => {
        const { totalStudentOnline = 0, totalStudent = 0 } = listClass;
        let progress = 0;
        if (totalStudentOnline == 0) {
            return progress;
        }
        try {
            progress = ((totalStudentOnline / totalStudent) * 100);
        } catch (error) {
            return 0;
        }
        return progress;
    }

    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 1,
            isLoading: true,
            bgBox: [
                "#FF7630",
                "#C699FF",
                "#43A9E2",
                "#2ABA67",
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
    _renderItem = ({ item, index }) => {
        const str = item.gradeId;
        const res = str.substring(1, 4);
        return (
            <View style={styles.shadowFlat}>
                <View style={{
                    flexDirection: 'column',
                    backgroundColor: this.state.bgBox[index % this.state.bgBox.length],
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 3,
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
                <Text style={[styles.color, { color: this.state.bgBox[index % this.state.bgBox.length] }]}> Lớp {res}</Text>
            </View>

        )
    }
    _listTestEmpty = () => {
        const { isLoading } = this.props;
        return (isLoading ?
            <ActivityIndicator
                size={'small'}
                style={{ flex: 1 }}
                color="#F98E2F"
            />
            :
            <Text style={styles.styTxtEmpty}>Hiện tại không có lớp lớp quản lí</Text>
        );
    };
    render() {
        const { listClass, classArray } = this.props;
        return (
            <View style={styles.shadow}>
                <View style={styles.bodyTask}>
                    <Text style={styles.txtTask}>Thống kê số lượng các lớp</Text>
                    <Text style={styles.status}>Số lớp, học sinh Thầy cô đang quản lí</Text>
                    <View style={{ alignSelf: 'center', height: height * 0.25 }}>
                        <FlatList
                            data={[...classArray]}
                            extraData={classArray}
                            numColumns={2}
                            ListEmptyComponent={this._listTestEmpty}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            stickyHeaderIndices={[0]}
                            renderItem={this._renderItem}
                            style={{ backgroundColor: 'transparent', flexDirection: 'row' }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={[styles.txtOnline, { color: '#828282' }]}>Số học sinh đang truy cập:</Text>
                        <Text style={styles.txtCount}>
                            {listClass?.totalStudentOnline}/{listClass?.totalStudent}
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <ProgressBar
                            progress={this.getProgess(listClass)}
                            color="#56BB73"
                            widthProps={width - 200}
                            progressUnfilledColor="#BDBDBD"
                            style={{ height: 5, borderRadius: 10 }}
                        />
                        <Text style={styles.rateSub}>
                            {listClass?.totalStudentOnline ?
                                Math.floor((listClass?.totalStudentOnline / listClass?.totalStudent) * 100)
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
        listClass: state.statistic.listClass,
        classArray: state.statistic.classArray,
        isLoading: state.statistic.isLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClassItem);

const styles = StyleSheet.create({
    bodyTask: {
        backgroundColor: '#FAFAFA',
        marginTop: 8,
        borderRadius: 10,
    },
    status: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#2D9CDB',
        textAlign: 'center',
        marginTop: 6,
    },
    txtOnline: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        color: '#2D9CDB',
        marginLeft: 27,
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
        width: '100%',
    },
    heroIcon: {
        alignSelf: 'center',
        width: 14,
        height: 14,
    },
    number: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(18),
        lineHeight: RFFonsize(25),
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        color: '#fff'
    },
    sumBig: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(28),
        lineHeight: RFFonsize(38),
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 19.5,
        marginBottom: 19.5,
        marginLeft: 25,
        marginRight: 25,
        color: '#fff',
    },
    countGroup: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#fff',
        fontWeight: '500',
        marginLeft: 3,
        alignSelf: 'center',
        marginRight: 5
    },
    progressBar: {
        marginTop: 5,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 27,
        marginBottom: 10
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
    txtCount: {
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        color: '#359CDB',
        fontFamily: 'Nunito',
        alignSelf: 'center',
        marginLeft: 7
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
        marginLeft: 3
    },
    shadowFlat: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    direction: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 6,
        marginRight: 5,
        marginBottom: 5,
    },
    color: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        textAlign: 'center',
        marginTop: 4
    }


})