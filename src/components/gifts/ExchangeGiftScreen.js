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
const { width, height } = Dimensions.get('window');
export default class ExchangeGiftScreen extends Component {

    // renderItem = ({ item, index }) => {
    //     return (
    //         <View style={styles.listSale}>
    //             <View>
    //                 <Image source={require('../../asserts/icon/icon_bookTitle.png')} />
    //             </View>
    //         </View>
    //     );
    // };

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={[styles.container, { backgroundColor: '#FFF' }]} >
                <View style={styles.backbg}>
                    <HeaderNavigation
                        title={'Đổi quà'}
                        navigation={this.props.navigation}
                        bgColor={'transparent'} colorIcon={'#FFF'}
                        styleTitle={styles.styleTitle}
                        back={true}
                    />
                    <Image
                        source={require('../../asserts/icon/icon_elipHeaderV3.png')}
                        resizeMode={'stretch'}
                        style={styles.iconElip}
                    />
                    <LinearGradient
                        colors={['#56CCF2', '#20BDFF']} style={styles.cardUser}
                    >
                        <TouchableOpacity style={styles.sale} onPress={() => {
                            this.props.navigation.navigate('SaleGift',
                                { status: 'light-content' });
                        }}>
                            <Image source={AppIcon.icon_diamondV3} style={styles.icon_diamondV3} />
                            <Text style={styles.txtDiamond}>Ưu đãi</Text>
                        </TouchableOpacity>
                        <View style={styles.flexSpace}>
                            <View style={styles.viewUser}>
                                <View style={styles.avatar}>
                                    <Image source={AppIcon.icon_diamondV3} style={styles.sizeAvar} />
                                    <Image source={require('../../asserts/icon/icon_afterbgAvar.png')} style={styles.afterAvar} />
                                </View>
                                <View style={styles.description}>
                                    <Text style={styles.txtName}>Trịnh Đình Quang</Text>
                                    {/* <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.63)', 'rgba(255, 255, 255, 0)']}
                                        style={styles.rowCoin}
                                    > */}
                                    <View style={styles.rowCoin}>
                                        <Image
                                            source={require('../../asserts/icon/icon_coinCountV3.png')}
                                            style={{ alignSelf: 'center' }} />
                                        <Text style={styles.countCoin}>40</Text>
                                    </View>
                                    {/* </LinearGradient> */}
                                </View>
                            </View>
                            <Image
                                source={require('../../asserts/icon/icon_elipHeaderV3.png')}
                                resizeMode={'stretch'}
                                style={styles.iconElip}
                            />

                        </View>
                    </LinearGradient>

                    <View>
                        {/* <FlatList
                            // testID={this.props.testID}
                            // data={this.state.dataSource}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={this.renderItem}
                        /> */}
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('GiftDetail',
                                    { status: 'light-content' })
                            }}
                            style={styles.listSale}>
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
                                        <Text numberOfLines={1}
                                            style={styles.txtNumber}>30</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
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
    cardUser: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fff',
        marginTop: -160,
        marginLeft: 16,
        marginRight: 16,
    },
    sale: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        borderColor: '#FF6214',
        borderWidth: 0.3,
        width: 100,
        borderRadius: 20,
        alignSelf: 'flex-end',
        marginTop: 13,
        marginRight: 15
    },
    icon_diamondV3: {
        alignSelf: 'center',
    },
    txtDiamond: {
        alignSelf: 'center',
        marginTop: 6,
        marginBottom: 4,
        fontSize: 12,
        lineHeight: 16,
        color: '#FF6213',
        marginLeft: 9,
    },
    avatar: {
        width: 100,
        height: 100,
        borderWidth: 5,
        borderColor: '#FFF',
        borderRadius: 50,
        marginLeft: 14,
        marginTop: 50
    },
    flexSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sizeAvar: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: '#FF6213'
    },
    txtName: {
        fontFamily: 'Nunito',
        fontSize: 18,
        lineHeight: 25,
        color: '#fff'
    },
    countCoin: {
        fontFamily: 'Nunito-Bold',
        fontSize: 18,
        lineHeight: 25,
        color: '#fff',
        marginLeft: 17,
        alignSelf: 'center'
    },
    rowCoin: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    description: {
        flexDirection: 'column',
        marginLeft: 24,
        marginTop: 100
    },
    viewUser: {
        flexDirection: 'row',
    },
    afterAvar: {
        marginTop: -100,
        marginLeft: -30,
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
        marginLeft: 10,
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
    },
    txtMark: {
        fontFamily: 'Nunito',
        fontSize: 12,
        color: '#828282',
        alignSelf: 'center'
    },
    widthIcon: {
        width: 17,
        height: 17,
        marginLeft: 16,
        marginTop: 2,
        marginBottom: 3
    },
    flexRight: {
        flexDirection: 'column',
        width: "70%"
    }

})



const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        makeRequestProfile: payload => {
            dispatch(userGiftAction(payload));
        },
    };
};
