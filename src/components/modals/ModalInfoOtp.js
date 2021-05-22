import React, { Component, useImperativeHandle } from 'react'
import { View, Text, Image, TouchableOpacity, Platform, Linking, Modal, Dimensions, Clipboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { RFFonsize } from '../../utils/Fonts';
import ZoomAnim from '../anim/ZoomAnim';

const { width } = Dimensions.get('window');

const hitSlop = { top: 10, left: 10, right: 10, bottom: 10 }

const sendSmsCode = (syntaxSMS, navigation) => {
    if (Platform.OS == 'android') {
        Linking.openURL(`sms:8100?body=ONLUYEN MK ${syntaxSMS}`)
    } else {
        Linking.openURL(`sms:8100&body=ONLUYEN MK ${syntaxSMS}`)
    }
    navigation.goBack();
}

const ModalInfoOtp = ({
    navigation,
    syntaxSMS,
    phoneNumber
}, ref) => {

    useImperativeHandle(ref, () => ({
        onSetVisible: () => {
            setVisible(true);
        },
    }));

    const [visible, setVisible] = React.useState(false);

    return (
        <Modal
            transparent={true}
            visible={visible}
        >
            <View style={styles.container}>
                <ZoomAnim>
                    <View style={styles.wrapContent}>
                        <TouchableWithoutFeedback hitSlop={hitSlop} onPress={() => {
                            setVisible(false);
                            navigation.goBack()
                        }}>
                            <Image source={require('../../asserts/icon/icon_arrowLeftv3.png')} />
                        </TouchableWithoutFeedback>
                        <Image source={require('../../asserts/images/otp_image.png')} style={styles.images} />
                        <Text style={styles.txtGuild}>Nhắn tin theo cú pháp</Text>
                        <View style={styles.wrapSynstax}>
                            <Text style={styles.textSytax}>ONLUYEN MK {syntaxSMS}<Text style={{
                                fontFamily: 'Nunito-Regular'
                            }}> gửi </Text>8100</Text>
                            <TouchableOpacity hitSlop={hitSlop}
                                onPress={() => Clipboard.setString(`ONLUYEN MK ${syntaxSMS}`)}
                            >
                                <Image source={require('../../asserts/icon/icon_clipboard.png')} style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.txtDesc}>{`Mật khẩu mới sẽ được gửi về số điện thoại đăng ký của bạn ${phoneNumber} (cước phí tin nhắn `}<Text style={{
                            color: '#2D9CDB'
                        }}>1.500đ</Text>)</Text>
                        <TouchableWithoutFeedback onPress={() => sendSmsCode(syntaxSMS, navigation)}>
                            <View style={styles.wrapButton}>
                                <Text style={styles.textAction}>Gửi ngay</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ZoomAnim>
            </View>
        </Modal>
    );
}

export default React.forwardRef(ModalInfoOtp);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapContent: {
        width: width - 40,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5
    },
    images: {
        width: 100,
        height: 100 * 426 / 381,
        alignSelf: 'center'
    },
    txtGuild: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        alignSelf: 'center',
        marginTop: 10,
        color: '#828282'
    },
    wrapSynstax: {
        flexDirection: 'row',
        backgroundColor: 'rgba(86, 204, 242, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    txtDesc: {
        marginTop: 10,
        marginHorizontal: 20,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        color: '#828282'
    },
    wrapButton: {
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: '#68C721',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 3
    },
    textAction: {
        fontSize: RFFonsize(14),
        fontFamily: 'Nunito-Bold',
        color: '#fff',
        fontWeight: '600'
    },
    textSytax: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        color: '#383838'
    }
});