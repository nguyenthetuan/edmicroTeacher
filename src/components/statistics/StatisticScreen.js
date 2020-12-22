import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';
import HeaderNavigation from '../common-new/HeaderNavigation'
const { width, height } = Dimensions.get('window');
import AppIcon from '../../utils/AppIcon';
import ProgressBar from '../libs/ProgressBar';
export default class StatisticScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.bgHeader}>
                    <HeaderNavigation
                        navigation={this.props.navigation}
                        color={'#000'}
                    />
                </View>
                <Text style={styles.titleTask}>
                    Quản lý lớp học
                    </Text>
                <View style={styles.shadow}>
                    <View style={styles.bodyTask}>
                        <Text style={styles.txtTask}>Thống kê số lượng các lớp</Text>
                        <Text style={styles.status}>Số lớp, học sinh Thầy cô đang quản lý</Text>
                        <View style={styles.flexStatitics}>
                            <View style={styles.flexLeft}>
                                <Text style={styles.number}>8 Lớp</Text>
                                <View style={styles.direction}>
                                    <Image source={AppIcon.icon_heroiconV3} style={styles.heroIcon} />
                                    <Text style={styles.countGroup}>700</Text>
                                </View>
                            </View>
                            <View style={styles.flexRight}>
                                <Text style={styles.number}>8 Lớp</Text>
                                <View style={styles.direction}>
                                    <Image source={AppIcon.icon_heroiconV3} style={styles.heroIcon} />
                                    <Text style={styles.countGroup}>00</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.status, { color: '#000' }]}>Số học sinh đang truy cập</Text>
                        <View style={styles.progressBar}>
                            <ProgressBar
                                progress={20}
                                color="#56BB73"
                                widthProps={width - 125}
                                progressUnfilledColor="#BDBDBD"
                            />
                            <Text style={styles.rateSub}>
                                20 %
                             </Text>
                        </View>
                        <TouchableOpacity style={styles.showInfo}>
                            <Text style={styles.txtShowInfo}>Xem chi tiết</Text>
                        </TouchableOpacity>
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
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.flexLeft1}>
                                        <Text style={styles.sumBig}>1</Text>
                                    </View>
                                    <Text style={styles.sum}>Tổng</Text>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <View style={styles.flexIcon}>
                                        <Image source={AppIcon.icon_dagiaoV3} />
                                        <Text style={styles.toSend}>Đã giao</Text>
                                    </View>
                                    <View style={styles.flexIcon}>
                                        <Image source={AppIcon.icon_chuagiaoV3} />
                                        <Text style={styles.toSend}>Chưa giao</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <View style={[styles.flexIcon, { marginRight: 26 }]}>
                                        <Text style={styles.numberBig}>1</Text>
                                        <Text style={styles.mission}>Nhiệm vụ</Text>
                                    </View>
                                    <View style={[styles.flexIcon, { marginRight: 26 }]}>
                                        <Text style={[styles.numberBig, { color: "#EB5757" }]}>0</Text>
                                        <Text style={styles.mission}>Nhiệm vụ</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.status, { color: '#000', marginTop: 26 }]}>Hoàn thành</Text>
                            <View style={styles.progressBar}>
                                <ProgressBar
                                    progress={20}
                                    color="#56BB73"
                                    widthProps={width - 125}
                                    progressUnfilledColor="#BDBDBD"
                                />
                                <Text style={styles.rateSub}>
                                    20 %
                             </Text>
                            </View>
                            <TouchableOpacity style={styles.showInfo}>
                                <Text style={styles.txtShowInfo}>Xem chi tiết</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={styles.titleTask}>
                        Bài tập trong tuần
                    </Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    bgHeader: {
        paddingTop: 40,
        backgroundColor: '#fff'
    },
    titleTask: {
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
        lineHeight: 21,
        color: '#000',
        marginLeft: 16,
        marginTop: 20
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
        fontSize: 14,
        lineHeight: 19,
        color: '#2D9CDB',
        marginLeft: 27,
        marginTop: 8
    },
    txtTask: {
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
        lineHeight: 21,
        marginTop: 12,
        alignSelf: 'center',
    },
    flexStatitics: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flexLeft: {
        backgroundColor: '#23D0F3',
        borderRadius: 4,
        marginTop: 10,
        marginLeft: 50
    },
    flexLeft1: {
        backgroundColor: '#F9B42E',
        borderRadius: 4,
        marginTop: 20,
        marginLeft: 30
    },
    flexRight: {
        backgroundColor: '#F9B42E',
        borderRadius: 4,
        marginTop: 10,
        marginRight: 55
    },
    heroIcon: {
        alignSelf: 'center',
        marginBottom: 5,
        width: 14,
        height: 14,
    },
    number: {
        fontFamily: 'Nunito-Bold',
        fontSize: 26,
        lineHeight: 30,
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 18,
        marginLeft: 10,
        marginRight: 10,
        color: '#fff'
    },
    sumBig: {
        fontFamily: 'Nunito-Bold',
        fontSize: 36,
        lineHeight: 42,
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 19.5,
        marginBottom: 19.5,
        marginLeft: 25,
        marginRight: 25,
        color: '#fff'
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
        fontSize: 16,
        lineHeight: 18,
        color: '#fff',
        fontWeight: '500',
        marginLeft: 3,
        alignSelf: 'center'
    },
    progressBar: {
        marginTop: 7,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 27
    },
    rateSub: {
        fontSize: 12,
        color: '#359CDB',
        fontFamily: 'Nunito-Bold',
        position: 'absolute',
        right: 20
    },
    showInfo: {
        backgroundColor: "#56BB73",
        borderRadius: 20,
        marginTop: 20,
        alignSelf: 'center',
        marginBottom: 12
    },
    txtShowInfo: {
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
        lineHeight: 21,
        color: '#fff',
        marginLeft: 41.5,
        marginRight: 41.5,
        marginTop: 6,
        marginBottom: 6,
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
        fontSize: 36,
        alignSelf: 'center',
        color: '#27AE60'
    },
    mission: {
        alignSelf: 'center',
        marginTop: 10,
        marginLeft: 10
    },
    toSend: {
        marginLeft: 10,
        marginTop: 5,
        marginRight: 10
    }
})