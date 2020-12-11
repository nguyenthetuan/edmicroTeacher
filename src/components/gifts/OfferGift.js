import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';

import Toast, { DURATION } from 'react-native-easy-toast';
export default class OfferGift extends Component {

    renderItem = ({ item }) => {
        // const { missionDetail } = this.props.screenProps;
        // const missionId = missionDetail._id
        // const status = missionDetail.status;
        return (
            <TouchableOpacity style={styles.listSale}>
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
            </TouchableOpacity>
        )
    }

    onToast = (text) => {
        this.toastRef.show(text, 3000)
    }

    render() {
        // const { classList } = this.props.screenProps;
        return (
            <View style={styles.contain}>
                <FlatList
                    // data={classList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    style={{ paddingTop: 10 }}
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
    }
})