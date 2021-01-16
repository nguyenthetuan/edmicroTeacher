import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import HeaderNavigation from '../common/HeaderNavigation';
import * as Api from '../../services/apiGift';
import dataHelper from '../../utils/dataHelper';
import { formatNumber } from '../../utils/Common';
import IconFeather from 'react-native-vector-icons/Feather';
import { RFFonsize } from '../../utils/Fonts';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    userGiftAction,
    getListGiftAction,
    getListHistoryAction
} from '../../actions/giftAction';
import ModalCard from './ModalCard';
import { DotIndicator } from 'react-native-indicators';

class GiftDetail extends Component {
    state = {
        formData: {},
        resultGift: '1234567812345678',
        visibleModalCard: false,
        isLoading: false
    }
    giftExchange = async () => {
        const { dataGift } = this.props.navigation.state.params;
        if (dataGift.receiveGift == 'DELIVERY' && this.checkInput()) {
            return;
        }
        const { token } = await dataHelper.getToken();
        const { formData } = this.state;
        const { user } = this.props;
        const params = {
            giftId: dataGift.id,
            address: {
                name: user.displayName,
                phoneNumber: formData['phoneNumber'],
                email: formData['email'],
                address: formData['address']
            }
        };
        Alert.alert('Thông báo', 'Bạn có chắc muốn đổi thưởng?', [
            {
                text: 'Xác nhận',
                onPress: async () => {
                    await this.setState({ isLoading: true });
                    const response = await Api.giftExchange({ token, params });
                    await this.setState({ isLoading: false });
                    if (_.isEmpty(response.result)) {
                        Alert.alert('Thông báo', response.errorMessage[0]);
                        return;
                    }
                    await this.setState({ resultGift: response.result });
                    if (dataGift.receiveGift == 'NOW') {
                        this.refModalCard.onVisibleModalCard();
                    } else {
                        Alert.alert('Thông báo', 'Đổi thưởng thành công', [
                            { text: 'Đóng', onPress: this.props.navigation.goBack }
                        ]);
                    }
                    this.props.makeRequestProfile({ token });
                    this.props.getListGiftAction({ token, page: 0 });
                    this.props.getListHistoryGift({ token, page: 0 });
                }
            },
            {
                text: 'Quay lại',
            }
        ])

    }

    onChangeText = key => value => {
        const { formData } = this.state;
        formData[key] = value;
        this.setState({ formData })
    }

    checkInput = () => {
        const { formData } = this.state;
        if (_.isEmpty(formData['phoneNumber']) || formData['phoneNumber'].trim() == '') {
            formData['phoneNumber'] = '';
            this.setState({ formData });
            Alert.alert('Thông báo', 'Bạn chưa điền số điện thoại');
            return true;
        }
        if (_.isEmpty(formData['address']) || formData['address'].trim() == '') {
            formData['address'] = '';
            this.setState({ formData });
            Alert.alert('Thông báo', 'Bạn chưa điền địa chỉ');
            return true;
        }
        if (_.isEmpty(formData['email']) || formData['email'].trim() == '') {
            formData['email'] = '';
            this.setState({ formData });
            Alert.alert('Thông báo', 'Bạn chưa điền Email');
            return true;
        }
        return false;
    }

    render() {
        const { dataGift } = this.props.navigation.state.params;
        const { formData, resultGift, visibleModalCard, isLoading } = this.state;
        dataGift.resultGift = resultGift;
        return (
            <View style={[styles.container, { backgroundColor: '#FFF' }]} >
                <HeaderNavigation
                    title={dataGift.name}
                    navigation={this.props.navigation}
                    bgColor={'#2D9CDB'} colorIcon={'#FFF'}
                    back={true}
                />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
                    <ScrollView
                        keyboardDismissMode={'on-drag'}
                    >
                        <Image
                            source={{ uri: dataGift.image }}
                            style={styles.contrain}
                        />
                        <Text style={styles.titleCate}>
                            {dataGift.giftName}
                        </Text>
                        <Text style={styles.description}>
                            {dataGift.description}
                        </Text>
                        <View style={styles.changeCoin1}>
                            <Image
                                style={styles.widthIcon}
                                source={require('../../asserts/icon/icon_coinGiftV3.png')}
                            />
                            <Text style={styles.txtNumber}>
                                {formatNumber(parseInt(dataGift.point))}
                            </Text>
                        </View>
                        {dataGift.receiveGift == 'DELIVERY' && <>
                            <FormInput
                                lable={'Số điện thoại người nhận'}
                                placeholder={'+84903456789'}
                                icon={'phone'}
                                keyboardType='phone-pad'
                                onChangeText={this.onChangeText('phoneNumber')}
                                value={formData['phoneNumber']}
                                letterSpacing={0.5}
                            />

                            <FormInput
                                lable={'Địa chỉ người nhận'}
                                placeholder={'Lý thường Kiệt, Hà Nội'}
                                icon={'map-pin'}
                                onChangeText={this.onChangeText('address')}
                                value={formData['address']}
                            />

                            <FormInput
                                lable={'Email người nhận'}
                                placeholder={'onluyenvn@gmail.com'}
                                icon={'mail'}
                                onChangeText={this.onChangeText('email')}
                                value={formData['email']}
                            />
                        </>}

                        {isLoading
                            ?
                            <View style={{ marginTop: 40 }}>
                                <DotIndicator color={'#2D9CDB'} size={6} count={8} />
                            </View>
                            :
                            <TouchableOpacity
                                style={styles.bgSubmit}
                                onPress={this.giftExchange}
                            >
                                <Text style={styles.txtSub}>Đổi quà</Text>
                            </TouchableOpacity>

                        }

                    </ScrollView>
                </KeyboardAvoidingView>
                <ModalCard
                    ref={ref => this.refModalCard = ref}
                    dataGift={dataGift}
                    visible={visibleModalCard}
                />
            </View >
        )
    }
}

class FormInput extends Component {
    render() {
        const {
            lable,
            placeholder,
            icon,
            keyboardType,
            onChangeText,
            value,
            letterSpacing
        } = this.props;
        return (
            <View style={styles.viewForm}>
                <Text style={styles.styLabel}>{lable}</Text>
                <View style={styles.styInput}>
                    <IconFeather name={icon} style={styles.styIcon} />
                    <TextInput
                        placeholder={placeholder}
                        style={{ color: '#000', fontFamily: 'Nunito-Regular', flex: 1, letterSpacing }}
                        keyboardType={keyboardType ? keyboardType : 'default'}
                        onChangeText={onChangeText}
                        value={value}
                        placeholderTextColor={'#c2c2c2'}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProp = (state) => {
    return {
        user: state.gift.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        makeRequestProfile: payload => dispatch(userGiftAction(payload)),
        getListGiftAction: payload => dispatch(getListGiftAction(payload)),
        getListHistoryGift: payload => dispatch(getListHistoryAction(payload))
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(GiftDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    changeCoin: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#56CCF2',
        borderRadius: 10,
        width: 70,
        marginLeft: 10
    },
    changeCoin1: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#56CCF2',
        borderRadius: 20,
        marginLeft: 10,
        marginTop: 28,
        alignSelf: 'center',
    },
    txtNumber: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        color: '#4776AD',
        alignSelf: 'center',
        marginLeft: 10,
        marginRight: 15,
        marginTop: 2,
        marginBottom: 2,
    },
    widthIcon: {
        width: 20,
        height: 20,
        marginLeft: 16,
        marginTop: 2,
        marginBottom: 2
    },
    contrain: {
        alignSelf: 'center',
        width: 100,
        height: 100,
        marginTop: 28,
        borderWidth: 1,
        borderColor: '#c4c4c4'
    },
    titleCate: {
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(16),
        alignSelf: 'center',
        marginTop: 18,
        textAlign: 'center',
    },
    bgSubmit: {
        backgroundColor: '#2D9CDB',
        borderColor: 25,
        alignSelf: 'center',
        borderRadius: 25,
        marginTop: 20
    },
    txtSub: {
        fontFamily: 'Nunito-Bold',
        color: '#fff',
        fontSize: RFFonsize(16),
        marginTop: 14,
        marginBottom: 14,
        marginLeft: 76,
        marginRight: 76,
    },
    description: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        color: "#000",
        textAlign: 'center',
        marginHorizontal: 50
    },
    styInput: {
        padding: 10,
        borderRadius: 5,
        borderColor: '#56CCF2',
        borderWidth: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
    },
    styLabel: {
        fontFamily: 'Nunito-Bold',
        marginVertical: 5,
        color: '#828282'
    },
    styIcon: {
        color: '#56CCF2',
        fontSize: RFFonsize(16),
        marginRight: 10
    },
    viewForm: {
        marginHorizontal: 15,
        marginTop: 10
    }
})

