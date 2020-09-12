import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Modal,
    Dimensions,
    TouchableOpacity,
    Platform,
    Linking
} from 'react-native';
import AppIcon from '../../utils/AppIcon';
import Rate, { AndroidMarket } from 'react-native-rate';
import AsyncStorage from '@react-native-community/async-storage';
import ZoomAnim from '../anim/ZoomAnim';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS == 'ios';

const optionsAndroid = {
    GooglePackageName: "vn.onluyen.app",
    OtherAndroidURL: "https://play.google.com/store/apps/details?id=vn.onluyen.app&hl=vn",
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp: true,
    fallbackPlatformURL: "https://play.google.com/store/apps/details?id=vn.onluyen.app&hl=vn",
}
const optionsIOS = {
    AppleAppID: "1506873010",
    preferInApp: true,
    inAppDelay: 5.0,
    openAppStoreIfInAppFails: true,
    fallbackPlatformURL: "https://apps.apple.com/us/app/onluyen/id1506873010",
}
export default class RateApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            arrStar: []
        }
    }

    _handleNotNow = () => {
        this.setState({ isShow: false });
        AsyncStorage.setItem('RateAppOnluyen', 'nonShowRating');
    }

    _handleRateNow = () => {
        this._handleNotNow();
        const options = isIOS ? optionsIOS : optionsAndroid;
        if (isIOS) {
            Linking.openURL("https://apps.apple.com/us/app/onluyen/id1506873010");
            return;
        }
        Rate.rate(options, success => {
            if (success) {
                console.log("RateApp -> _handleRateNow -> success", success)
                // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
            }
        })
    }

    _showRateApp = () => this.setState({ isShow: true });

    _handleRateStar = (index) => () => {
        let arrStar = [];
        switch (index) {
            case 1: arrStar.push(1),
                this.setState({ arrStar });
                break;
            case 2:
                arrStar.push(1, 2);
                this.setState({ arrStar });
                break;
            case 3: arrStar.push(1, 2, 3),
                this.setState({ arrStar });
                break;
            case 4: arrStar.push(1, 2, 3, 4),
                this.setState({ arrStar });
                break;
            case 5: arrStar.push(1, 2, 3, 4, 5),
                this.setState({ arrStar });
                break;
            default:
                break;
        }
        setTimeout(() => this._handleRateNow(), 1000);
    }

    render() {
        const { isShow, arrStar } = this.state;
        const { isClose = false } = this.props;
        return (
            <Modal
                // animationType="fade"
                transparent={true}
                visible={isShow}
            >
                <View style={styles.container}>
                    <ZoomAnim>

                        <View style={styles.containerView}>
                            {isClose && <TouchableOpacity
                                style={styles.btnClose}
                                onPress={() => { this.setState({ isShow: false }) }}
                            >
                                <Image source={AppIcon.icon_close_modal} resizeMode='contain' style={{ tintColor: '#FFF' }} tintColor='#FFF' />
                            </TouchableOpacity>}
                            <Image source={AppIcon.icon_app} resizeMode={'contain'} />
                            <Text style={styles.txtRateApp}>
                                Bạn thấy ứng dụng
                                <Text style={styles.txtOnluyen}> OnluyenVn </Text>
                                như thế nào?
                            </Text>
                            <View style={styles.wrapStar}>
                                <TouchableOpacity
                                    onPress={this._handleRateStar(1)}
                                >
                                    <Image source={arrStar.includes(1) ? AppIcon.Star_Active : AppIcon.Star_nonActive} resizeMode={'contain'} style={styles.star} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={this._handleRateStar(2)}
                                >
                                    <Image source={arrStar.includes(2) ? AppIcon.Star_Active : AppIcon.Star_nonActive} resizeMode={'contain'} style={styles.star} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={this._handleRateStar(3)}
                                >
                                    <Image source={arrStar.includes(3) ? AppIcon.Star_Active : AppIcon.Star_nonActive} resizeMode={'contain'} style={styles.star} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={this._handleRateStar(4)}
                                >
                                    <Image source={arrStar.includes(4) ? AppIcon.Star_Active : AppIcon.Star_nonActive} resizeMode={'contain'} style={styles.star} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={this._handleRateStar(5)}
                                >
                                    <Image source={arrStar.includes(5) ? AppIcon.Star_Active : AppIcon.Star_nonActive} resizeMode={'contain'} style={styles.star} />
                                </TouchableOpacity>

                            </View>

                            <View style={styles.containerBtn}>
                                <TouchableOpacity
                                    style={styles.wrapBtn}
                                    onPress={this._handleRateNow}
                                >
                                    <Text style={styles.txtRateNow}>Đánh giá ngay</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.wrapBtn, { backgroundColor: '#0E4E72' }]}
                                    onPress={this._handleNotNow}
                                >
                                    <Text style={styles.txtNonRate}>Không hiển thị lại</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ZoomAnim>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerView: {
        width: width - 20,
        minHeight: 300,
        backgroundColor: '#015280',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    txtRateApp: {
        color: '#BDBDBD',
        fontSize: 14,
        fontFamily: 'Nunito-Regular'
    },
    txtOnluyen: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Nunito-Bold'
    },
    wrapStar: {
        flexDirection: 'row',
        marginVertical: 10
    },
    star: { marginHorizontal: 5 },
    wrapBtn: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#839098',
        backgroundColor: '#2D9CDB',
        minHeight: 30,
        minWidth: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    txtRateNow: {
        fontFamily: 'Nunito-Regular',
        color: '#FFF',
        fontSize: 16
    },
    containerBtn: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: width - 20
    },
    txtNonRate: {
        fontFamily: 'Nunito-Regular',
        color: '#C4C4C4',
        fontSize: 16
    },
    btnClose: {
        position: 'absolute',
        top: 10,
        right: 10
    }
})