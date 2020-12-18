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
import _ from 'lodash';
import { connect } from 'react-redux';
class GiftDetail extends Component {

    state = {
        formData: {}
    }

    componentDidMount() {
        const { dataGift } = this.props.navigation.state.params;
    }

    giftExchange = async () => {
        if (this.checkInput()) {
            return;
        }
        const { token } = await dataHelper.getToken();
        const { dataGift } = this.props.navigation.state.params;
        const { formData } = this.state;
        const { user } = this.props;
        const params = {
            giftId: dataGift.receiveGift,
            address: {
                name: user.displayName,
                phoneNumber: formData['phoneNumber'],
                email: formData['email'],
                address: formData['address']
            }
        };
        const response = await Api.giftExchange({ token, params });
        console.log("🚀 ~ file: GiftDetail.js ~ line 49 ~ GiftDetail ~ giftExchange= ~ response", response)
        if (_.isEmpty(response.result)) {
            Alert.alert('Thông báo', response.errorMessage[0]);
            return;
        }
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
        const { formData } = this.state;
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
                            {dataGift.name}
                        </Text>
                        <Text style={styles.description}>
                            {dataGift.description}
                        </Text>
                        <View style={styles.changeCoin1}>
                            <Image
                                style={styles.widthIcon}
                                source={require('../../asserts/icon/icon_coinGiftV3.png')}
                            />
                            <Text style={styles.txtNumber}>{formatNumber(parseInt(dataGift.point))}</Text>
                        </View>
                        {dataGift.receiveGift == 'DELIVERY' && <>
                            <FormInput
                                lable={'Số điện thoại người nhận'}
                                placeholder={'+8490 3456789'}
                                icon={'phone'}
                                keyboardType='phone-pad'
                                onChangeText={this.onChangeText('phoneNumber')}
                                value={formData['phoneNumber']}
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

                        <TouchableOpacity
                            style={styles.bgSubmit}
                            onPress={this.giftExchange}
                        >
                            <Text style={styles.txtSub}>Đổi quà</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View >
        )
    }
}

class FormInput extends Component {
    render() {
        const { lable, placeholder, icon, keyboardType, onChangeText, value } = this.props;
        return (
            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <Text style={styles.styLabel}>{lable}</Text>
                <View style={styles.styInput}>
                    <IconFeather name={icon} style={styles.styIcon} />
                    <TextInput
                        placeholder={placeholder}
                        style={{ color: '#000', fontFamily: 'Nunito-Regular', flex: 1 }}
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

export default connect(mapStateToProp, null)(GiftDetail);

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
        fontSize: 16,
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
        fontSize: 16,
        marginTop: 14,
        marginBottom: 14,
        marginLeft: 76,
        marginRight: 76,
    },
    description: {
        fontFamily: 'Nunito',
        fontSize: 14,
        lineHeight: 18,
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
        fontSize: 16,
        marginRight: 10
    }
})

