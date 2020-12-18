import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import HeaderNavigation from '../common/HeaderNavigation';
import LinearGradient from 'react-native-linear-gradient';
import AppIcon from '../../utils/AppIcon';
import TabOfferHis from '../gifts/tabTop/TabOfferHis';
const { width, height } = Dimensions.get('window');
class SaleGift extends Component {


    renderItem = ({ item, index }) => {
        const { user } = this.props;
        const isColor = item.point > user.totalExpPoint;
        const { listGift } = this.props.navigation.state.params;
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('GiftDetail',
                        {
                            status: 'light-content',
                            listGift: item
                        })
                }}
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
                                source={require('../../asserts/icon/icon_coinCountV3.png')}
                            />
                            <Text
                                numberOfLines={1}
                                style={[styles.txtNumber, { color: isColor ? '#FF6213' : '#4776AD' }]}
                            >
                                {item.point}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        );
    };

    render() {
        return (
            <View style={[styles.container, { backgroundColor: '#FFF' }]} >
                <HeaderNavigation
                    title={'Đổi quà'}
                    navigation={this.props.navigation}
                    bgColor={'#2D9CDB'} colorIcon={'#FFF'}
                    back={true}
                />
                <TabOfferHis screenProps={this.props} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        marginLeft: -20
    },
    changeCoin: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#56CCF2',
        borderRadius: 20,
        marginLeft: 10
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
        fontSize: 14,
        color: '#4776AD',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 15,
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
        width: 18,
        height: 18,
        marginLeft: 16,
        marginTop: 2,
        marginBottom: 2
    },
    flexRight: {
        flexDirection: 'column',
        width: "70%"
    }
})

const mapStateToProps = (state) => {
    return {
        listGift: state.gift.listGift,
        listHistory: state.gift.listHistory,
        user: state.gift.user,
    }
}

export default connect(mapStateToProps, null)(SaleGift)