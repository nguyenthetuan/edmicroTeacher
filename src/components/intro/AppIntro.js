import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, Dimensions, SafeAreaView, Image } from 'react-native';
import Swiper from 'react-native-swiper'
import RippleButton from '../libs/RippleButton';
import LinearGradient from 'react-native-linear-gradient';
import AppIcon from '../../utils/AppIcon';
import Button from '../common/Button';
import FastImage from 'react-native-fast-image';
import { RFSquare, RFFonsize } from '../../utils/Fonts';
const { width } = Dimensions.get("window");


export default class AppIntro extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        console.log("INTRO");
    }

    renderDot = () => {
        return (
            <View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 10, height: 10, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
        )
    }

    renderActiveDot = () => {
        return (
            <View style={{ backgroundColor: '#007aff', width: 20, height: 10, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
        )
    }

    onPressNext = () => {
        this.props.navigation.navigate('V_SignIn', { statusbar: 'dark-content' });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.wrapSwiper}>
                    <Swiper
                        autoplay={true}
                        dot={this.renderDot()}
                        activeDot={this.renderActiveDot()}
                    >
                        <View style={styles.wrapPage}>
                            <Text style={styles.textTitle}>Lớp học</Text>
                            <Text style={styles.textDes}>Giúp thầy cô quản lý lớp học từ bao quát đến chi tiết để đánh giá năng lực, định hướng mục tiêu học tập cho từng học sinh </Text>
                            <Image
                                source={AppIcon.image_class}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={styles.wrapPage}>
                            <Text style={styles.textTitle}>Bộ đề</Text>
                            <Text style={styles.textDes}>Tạo, quản lý bộ đề dễ dàng. Tự động xây dựng ma trận, đảo đề, trộn đề, chấm điểm. Giúp thầy cô giảm bớt khối lượng công việc. </Text>
                            <Image
                                source={AppIcon.image_assessment}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={styles.wrapPage}>
                            <Text style={styles.textTitle}>Nhiệm vụ</Text>
                            <Text style={styles.textDes}>Giao nhiệm vụ cho học sinh hàng ngày, hàng tuần theo chuyên đề kiến thức. Đồng thời rèn luyện tinh thần tự giác học tập cho học sinh.</Text>
                            <Image
                                source={AppIcon.image_misson}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={styles.wrapPage}>
                            <Text style={styles.textTitle}>Thống kê</Text>
                            <Text style={styles.textDes}>Báo cáo từ tổng quan đến chi tiết tiến trình, mức độ hoàn thành, kết quả học tập của từng lớp và từng học sinh. </Text>
                            <Image
                                source={AppIcon.image_statistical}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                    </Swiper>
                </View>
                <View style={styles.wrapEnd}>
                    <Button
                        center={true}
                        title="Bắt đầu"
                        width={width - 50}
                        circle={40}
                        style={styles.btnLogin}
                        styleTitle={styles.styleTitle}
                        onPress={this.onPressNext}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1
    },
    wrapSwiper: {
        width: '100%',
        height: '80%',
        top: 20
    },
    immage: {
        position: 'absolute',
        bottom: 80,
        width: 250 * 283 / 281,
        height: 250,
    },
    wrapButton: {
        width: width - 60,
        height: RFSquare(50),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'

    },
    wrapEnd: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTitle: {
        fontSize: RFFonsize(26),
        fontFamily: 'Nunito-bold',
        lineHeight: 40,
        fontWeight: '800'
    },
    textStyle: {
        color: '#fff',
        fontSize: RFFonsize(16),
        lineHeight: 21,
        fontFamily: 'Nunito-Bold',
    },
    wrapPage: {
        flex: 1,
        alignItems: 'center'
    },
    textDes: {
        fontFamily: 'Nunito',
        fontSize: 14,
        lineHeight: 17,
        fontWeight: '400',
        color: 'rgba(117, 117, 117, 1)',
        width: '70%',
        textAlign: 'center',
        top: 10
    },
    btnLogin: {
        backgroundColor: '#54CEF5',
        height: 40,
        zIndex: 10,
        borderRadius: 5,
        marginTop: 10,
        borderWidth: 0
    },
    styleTitle: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        color: '#FFF'
    },
})