import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { imageDefault } from '../../utils/Common';
import Toast from 'react-native-easy-toast';
export default class OfferGift extends Component {


    handleClickItem = item => () => {
        const { user } = this.props.screenProps;
        const isGoto = item.point > user.totalExpPoint;
        if (isGoto) {
            Alert.alert('Thông báo', 'Bạn không đủ điểm tích luỹ cho khuyến mãi này');
            return;
        }
        this.props.screenProps.navigation.navigate('GiftDetail', {
            status: 'light-content',
            dataGift: item
        });
    }

    renderItem = ({ item }) => {
        const { user } = this.props.screenProps;
        const isColor = item.point > user.totalExpPoint;
        item.image = item.image?.includes('http') ? item.image : imageDefault;
        return (
            <TouchableOpacity
                onPress={this.handleClickItem(item)}
                style={styles.listSale}>
                <View style={styles.flexLeft}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.sizeIcon}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={styles.flexRight}>
                    <Text style={styles.txtTitle}>{item.description}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 16 }}>
                        <Text style={styles.txtMark}>Đổi điểm</Text>
                        <View style={styles.changeCoin}>
                            <Image
                                style={styles.widthIcon}
                                source={require('../../asserts/icon/icon_coinGiftV3.png')}
                                resizeMode={'contain'}
                            />
                            <Text
                                numberOfLines={1}
                                style={[styles.txtNumber, { color: isColor ? '#FF6213' : '#4776AD' }]}
                            >{item.point}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        );
    };

    onToast = (text) => {
        this.toastRef.show(text, 3000)
    }

    render() {
        const { listGift } = this.props.screenProps;
        return (
            <View style={styles.contain}>
                <FlatList
                    data={listGift}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                />
                <Toast
                    ref={ref => this.toastRef = ref}
                    position={'center'}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },
    listSale: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
        marginTop: 16,
        marginRight: 16,
        borderRadius: 4
    },
    flexLeft: {
        width: '30%'
    },
    sizeIcon: {
        alignSelf: 'center',
        width: 100,
        height: 100
    },
    changeCoin: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#56CCF2',
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 100
    },
    txtTitle: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        lineHeight: 16,
        color: '#000',
        marginTop: 16
    },
    txtNumber: {
        fontFamily: 'Nunito-Bold',
        fontSize: 12,
        color: '#4776AD',
        alignSelf: 'center',
        marginLeft: 5,
        paddingRight: 20,
        marginTop: 2,
        marginBottom: 2,
    },
    txtMark: {
        fontFamily: 'Nunito',
        fontSize: 12,
        color: '#828282',
        alignSelf: 'center'
    },
    widthIcon: {
        width: 20,
        height: 20,
        marginLeft: 16,
        marginTop: 2,
        marginBottom: 2,
        alignSelf: 'center'
    },
    flexRight: {
        flexDirection: 'column',
        width: "70%",
        marginLeft: 10,
    }
})