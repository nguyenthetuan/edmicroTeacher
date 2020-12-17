import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import HeaderNavigation from '../common/HeaderNavigation';
import * as Api from '../../services/apiGift';
import dataHelper from '../../utils/dataHelper';
const { width, height } = Dimensions.get('window');

export default class OfferGiftDetail extends Component {


    componentDidMount() {
        const { dataGift } = this.props.navigation.state.params;
    }

    giftExchange = async () => {
        const { token } = await dataHelper.getToken();
        const { dataGift } = this.props.navigation.state.params;
        const params = {
            giftId: dataGift.receiveGift,
            "address": {
                "name": "string",
                "phoneNumber": "string",
                "email": "string",
                "address": "string"
            }
        }
        const response = await Api.giftExchange({ token, params });
    }

    render() {
        const { dataGift } = this.props.navigation.state.params;
        return (
            <View style={[styles.container, { backgroundColor: '#FFF' }]} >
                <HeaderNavigation
                    title={dataGift.name}
                    navigation={this.props.navigation}
                    bgColor={'#2D9CDB'} colorIcon={'#FFF'}
                    back={true}
                />
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
                    <Text style={styles.txtNumber}>{dataGift.point}</Text>
                </View>
                <TouchableOpacity
                    style={styles.bgSubmit}
                    onPress={this.giftExchange}
                >
                    <Text style={styles.txtSub}>Đổi quà</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

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
        marginTop: 28
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
        marginTop: 58
    },
    txtSub: {
        fontFamily: 'Nunito-Bold',
        color: '#fff',
        fontSize: 16,
        marginTop: 14,
        marginBottom: 14,
        marginLeft: 76,
        marginRight: 76,
        fontSize: 16,
    },
    description: {
        fontFamily: 'Nunito',
        fontSize: 14,
        lineHeight: 18,
        color: "#000",
        textAlign: 'center',
        marginHorizontal: 50
    }
})

