import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import moment from 'moment';
import { imageDefault } from '../../utils/Common';
import Icon from 'react-native-vector-icons/Feather';
import Toast, { DURATION } from 'react-native-easy-toast';
export default class HistoryGift extends Component {

    renderItem = ({ item, index }) => {
        const { user } = this.props.screenProps;
        const isColor = item.point > user.totalEDPoint;
        item.image = item.image?.includes('http') ? item.image : imageDefault;
        return (
            <TouchableOpacity
                style={styles.listSale}
                onPress={() => this.refModalCard.changeStateVisible(item)}
            >
                <View style={styles.flexLeft}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.sizeIcon}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={styles.flexRight}>
                    <Text style={styles.txtTitle}>{item.giftName}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 16 }}>
                        <Text style={styles.txtMark}>Đổi điểm</Text>
                        <View style={styles.changeCoin}>
                            <Image
                                style={styles.widthIcon}
                                source={require('../../asserts/icon/icon_coinGiftV3.png')}
                            />
                            <Text
                                numberOfLines={1}
                                style={[styles.txtNumber, { color: isColor ? '#FF6213' : '#4776AD' }]}
                            >{item.point}</Text>
                        </View>
                    </View>
                    <Text
                        style={[styles.txtMark, { alignSelf: 'flex-start', marginTop: 8 }]}
                    >
                        {moment(item.time).format('HH:MM - DD/MM/YYYY')}
                    </Text>
                </View>
            </TouchableOpacity >
        );
    };

    onToast = (text) => {
        this.toastRef.show(text, 3000)
    }

    render() {
        const { listHistory } = this.props.screenProps;
        return (
            <View style={styles.contain}>
                <FlatList
                    data={listHistory}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                />
                <ModalCard ref={ref => this.refModalCard = ref} />
                <Toast
                    ref={ref => this.toastRef = ref}
                    position={'center'}
                />
            </View>
        );
    }
}

class ModalCard extends Component {

    state = {
        visible: false,
        item: {}
    }

    changeStateVisible = item => {
        const { visible } = this.state;
        this.setState({ visible: !visible, item });
    }

    render() {
        const { visible, item } = this.state;
        return (
            <Modal visible={visible} transparent={true} >
                <View style={styles.styWrapModal}>
                    <View style={styles.styWrapContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.styWrapImg}>
                                <Image
                                    source={{ uri: item.image }}
                                    resizeMode={'contain'}
                                    style={styles.styImageModal}
                                />
                            </View>
                            <View style={{ marginHorizontal: 5 }}>
                                <Text style={{ fontFamily: 'Nunito-Bold' }}>{item.giftName}</Text>
                                <Text style={[styles.txtMark, { alignSelf: 'flex-start', marginTop: 8 }]}>
                                    {moment(item.time).format('HH:MM - DD/MM/YYYY')}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.stWrapGiftCode}>
                            <Text style={{ flex: 1 }}>{item.gift}</Text>
                            <TouchableOpacity>
                                <Icon name={'copy'} style={{ color: '#828282', fontSize: 20 }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end' }}
                            onPress={() => alert(1)}
                        >
                            <Text style={styles.styTxtBtn}>Nạp ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },
    backbg: {
        backgroundColor: '#2D9CDB',
    },
    iconElip: {
        width: 150,
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
    },
    styWrapModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    styWrapContent: {
        minHeight: 150,
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10
    },
    styImageModal: {
        width: 50,
        height: 50,
    },
    styWrapImg: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        borderRadius: 5,
        overflow: 'hidden'
    },
    stWrapGiftCode: {
        flexDirection: 'row',
        padding: 5,
        borderRadius: 3,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    styTxtBtn: {
        fontWeight: 'bold',
        color: '#FF6213',
        margin: 5
    }
})