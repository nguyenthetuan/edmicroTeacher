import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import HeaderNavigation from '../common/HeaderNavigation';
import LinearGradient from 'react-native-linear-gradient';
import AppIcon from '../../utils/AppIcon';
const { width, height } = Dimensions.get('window');
export default class GiftDetail extends Component {
    render() {
        return (
            <View style={[styles.container, { backgroundColor: '#FFF' }]} >
                <HeaderNavigation
                    title={'Sách kiến thức'}
                    navigation={this.props.navigation}
                    bgColor={'#2D9CDB'} colorIcon={'#FFF'}
                    back={true}
                />
                {/* <Image
                    source={require('../../asserts/icon/icon_elipHeaderV3.png')}
                    resizeMode={'stretch'}
                    style={styles.iconElip}
                /> */}

                <Image
                    source={require('../../asserts/icon/icon_bookTitle.png')}
                    style={styles.contrain}
                />
                <Text style={styles.titleCate}>
                    Sách kiến thức
                </Text>
                {/* <TouchableOpacity style={styles.listSale}>
                    <View style={styles.flexLeft}>
                        <Image
                            source={require('../../asserts/icon/icon_bookTitle.png')}
                            style={styles.sizeIcon}
                        />
                    </View>
                    <View style={styles.flexRight}>
                        <Text style={styles.txtTitle}>Sách kiến thức</Text>
                        <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <Text style={styles.txtMark}>Đổi điểm</Text>
                            <View style={styles.changeCoin}>
                                <Image
                                    style={styles.widthIcon}
                                    source={require('../../asserts/icon/icon_coinCountV3.png')}
                                />
                                <Text style={styles.txtNumber}>30</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity> */}
                <View style={styles.changeCoin1}>
                    <Image
                        style={styles.widthIcon}
                        source={require('../../asserts/icon/icon_coinCountV3.png')}
                    />
                    <Text style={styles.txtNumber}>50</Text>
                </View>
                <TouchableOpacity style={styles.bgSubmit}>
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
    backbg: {
        backgroundColor: '#2D9CDB',
        height: height * 0.3
    },
    iconElip: {
        width: 150,
        height: height * 0.2,
        color: '#fff',
        alignSelf: 'flex-end',
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
        borderRadius: 10,
        width: 70,
        marginLeft: 10
    },
    changeCoin1: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#56CCF2',
        borderRadius: 10,
        width: 70,
        marginLeft: 10,
        marginTop: 28,
        alignSelf: 'center',
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
        marginRight: 15
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
    },
    flexRight: {
        flexDirection: 'column',
        width: "70%"
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
        marginTop: 18
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
        marginTop: 14,
        marginBottom: 14,
        marginLeft: 76,
        marginRight: 76,
    }
})

