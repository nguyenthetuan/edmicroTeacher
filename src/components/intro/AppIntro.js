import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, Dimensions, SafeAreaView, Image } from 'react-native';
import Swiper from 'react-native-swiper'
import RippleButton from '../libs/RippleButton';
import LinearGradient from 'react-native-linear-gradient';
import AppIcon from '../../utils/AppIcon';
import FastImage from 'react-native-fast-image';


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
                            <Text style={styles.textDes}>Giải thử tất cả các bài kiểm tra, các mẫu đề thi hoặc tự mình tạo một bài kiểm tra và thi đua cùng bạn bè</Text>
                            <Image
                                source={AppIcon.image_class}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={styles.wrapPage}>
                            <Text style={styles.textTitle}>Bộ đề</Text>
                            <Text style={styles.textDes}> Giải thử tất cả các bài kiểm tra, các mẫu đề thi hoặc tự mình tạo một bài kiểm tra và thi đua cùng bạn bè</Text>
                            <Image
                                source={AppIcon.image_assessment}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={styles.wrapPage}>
                            <Text style={styles.textTitle}>Nhiệm vụ</Text>
                            <Text style={styles.textDes}>Giải thử tất cả các bài kiểm tra, các mẫu đề thi hoặc tự mình tạo một bài kiểm tra và thi đua cùng bạn bè</Text>
                            <Image
                                source={AppIcon.image_misson}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={styles.wrapPage}>
                            <Text style={styles.textTitle}>Thống kê</Text>
                            <Text style={styles.textDes}>Giải thử tất cả các bài kiểm tra, các mẫu đề thi hoặc tự mình tạo một bài kiểm tra và thi đua cùng bạn bè</Text>
                            <Image
                                source={AppIcon.image_statistical}
                                style={styles.immage}
                                resizeMode={'contain'}
                            />
                        </View>
                    </Swiper>
                </View>
                <View style={styles.wrapEnd}>
                    <RippleButton style={styles.wrapButton} onPress={this.onPressNext}>
                        <LinearGradient colors={['rgba(27, 125, 217, 1)', 'rgba(45, 156, 219, 1)']} style={styles.wrapButton} start={[0, 1]} end={[1, 0]}>
                            <Text style={styles.textStyle}>Tiếp tục</Text>
                        </LinearGradient>
                    </RippleButton>
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
        bottom: 80
    },
    wrapButton: {
        width: 320,
        height: 50,
        borderRadius: 25,
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
        fontSize: 28,
        fontFamily: 'Nunito-bold',
        lineHeight: 40,
        fontWeight: '800'
    },
    textStyle: {
        color: '#fff',
        fontSize: 18,
        lineHeight: 21,
        fontFamily: 'Nunito',
        fontWeight: '500'
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
    }
})