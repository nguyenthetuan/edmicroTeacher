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
    // listClass?.totalStudentOnline
    // ?
    // (listClass?.totalStudentOnline / listClass?.totalStudent) >
    //     100 ? 100 : (listClass?.totalStudentOnline / listClass?.totalStudent) : 1
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
    _renderItem = ({ item, index }) => {
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
        const { listClass, classArray } = this.props;
        return (
            <View style={styles.shadow}>
                <View style={styles.bodyTask}>
                    <Text style={styles.txtTask}>Thống kê số lượng các lớp</Text>
                    <Text style={styles.status}>Số lớp, học sinh Thầy cô đang quản lý</Text>
                    <View style={{ alignSelf: 'center', height: height * 0.25 }}>
                        <FlatList
                            data={[...classArray]}
                            extraData={classArray}
                            numColumns={2}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            stickyHeaderIndices={[0]}
                            renderItem={this._renderItem}
                            style={{ backgroundColor: 'transparent', flexDirection: 'row' }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={[styles.txtOnline, { color: '#000' }]}>Số học sinh đang truy cập:</Text>
                        <Text style={styles.txtCount}>
                            {listClass?.totalStudentOnline}/{listClass?.totalStudent}
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <ProgressBar
                            progress={this.getProgess(listClass)}
                            color="#56BB73"
                            widthProps={width - 185}Î
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
        borderRadius: 10,
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
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
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
    direction: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 14,
        marginRight: 5,
        marginBottom: 5,
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
        marginTop: 7,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 27,
        marginBottom: 10
    },
    rateSub: {
        fontSize: RFFonsize(12),
        color: '#359CDB',
        fontFamily: 'Nunito-Bold',
        position: 'absolute',
        right: 20,
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