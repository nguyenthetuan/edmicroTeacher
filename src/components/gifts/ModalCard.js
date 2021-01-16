import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Linking
} from 'react-native';
import { formatNumber } from '../../utils/Common';
import { RFFonsize } from '../../utils/Fonts';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { copyToClipboard } from '../../utils/Common';
import Toast, { DURATION } from 'react-native-easy-toast';

export default class ModalCard extends Component {

    state = {
        visibleModalCard: false
    }

    onVisibleModalCard = () => {
        const { visibleModalCard } = this.state;
        this.setState({ visibleModalCard: !visibleModalCard });
    }

    onclickCopyToClipboard = () => {
        const { dataGift } = this.props;
        const resultGift = dataGift.resultGift
        const isCopy = copyToClipboard(resultGift);
        if (isCopy) {
            this.refsToast.show('Copy thành công');
        }
    }

    handleRechargeNow = () => {
        const { dataGift } = this.props;
        let phoneNumber = '';
        let code = dataGift.resultGift;
        code = code.replace(/[ -]+/g, '');
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:*100*${code}\%23`;
        }
        else {
            phoneNumber = `tel://*100*${code}\%23`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log('err', err));
    }

    render() {
        const { dataGift } = this.props;
        const { visibleModalCard } = this.state;
        return (
            <Modal visible={visibleModalCard} transparent={true}>
                <View style={styles.contain}>
                    <View style={styles.styWrapCont}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', margin: 5 }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={this.onVisibleModalCard}
                        >
                            <IconAntDesign name={'closecircleo'} style={{ fontSize: RFFonsize(20) }} />
                        </TouchableOpacity>
                        <View style={styles.styWrapHead}>
                            <View style={styles.styWrapImg}>
                                <Image
                                    source={{ uri: dataGift.image }}
                                    style={styles.styImg}
                                    resizeMode={'contain'}
                                />
                            </View>
                            <View>
                                <Text style={styles.styLabel}>{dataGift.name}</Text>
                                <Text style={[styles.styLabel, { color: '#993BE3' }]}>
                                    {formatNumber(parseInt(dataGift.point))}
                                </Text>
                                <Text style={styles.styDay}>{moment(dataGift.create).format('HH:MM DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                        <View style={styles.styWrapCode}>
                            <Text style={styles.styCode}>{dataGift.resultGift}</Text>
                            <TouchableOpacity
                                onPress={this.onclickCopyToClipboard}
                            >
                                <Icon name={'copy'} style={{ color: '#828282', fontSize: RFFonsize(20) }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.styBtn}
                            onPress={this.handleRechargeNow}
                        >
                            <Text style={styles.styTxtBtn}>Nạp ngay</Text>
                        </TouchableOpacity>
                    </View>
                    <Toast ref={ref => this.refsToast = ref} position={'bottom'} />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    styWrapCont: {
        borderRadius: 10,
        minHeight: 200,
        width: 350,
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    styImg: {
        width: 80,
        height: 80,
    },
    styWrapImg: {
        borderRadius: 10,
        overflow: 'hidden',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15
    },
    styWrapHead: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLabel: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(18),
    },
    styDay: {
        fontFamily: 'Nunito-Regular',
        color: '#828282',
        letterSpacing: 1,
        fontSize: RFFonsize(12)
    },
    styWrapCode: {
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
        borderRadius: 5,
        justifyContent: 'space-between',
        marginHorizontal: 10,
        alignItems: 'center'
    },
    styTxtBtn: {
        fontFamily: 'Nunito-Bold',
        fontWeight: '800',
        color: '#FF6213',
        margin: 5
    },
    styBtn: {
        alignSelf: 'flex-end',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FF6213',
        margin: 10
    },
    styCode: {
        fontFamily: 'Nunito-Regular',
        letterSpacing: 0.5
    }
})