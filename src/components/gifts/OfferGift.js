import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions
} from 'react-native';
import { imageDefault } from '../../utils/Common';
import Toast from 'react-native-easy-toast';
import { RFFonsize } from '../../utils/Fonts';
import shadowStyle from '../../themes/shadowStyle';
const { width, height } = Dimensions.get('window');

export default class OfferGift extends Component {


    handleClickItem = item => () => {
        const { user } = this.props.screenProps;
        const isGoto = item.point > user.totalEDPoint;
        if (isGoto) {
            Alert.alert('', 'Bạn không đủ điểm tích luỹ cho khuyến mãi này');
            return;
        }
        this.props.screenProps.navigation.navigate('GiftDetail', {
            status: 'light-content',
            dataGift: item
        });
    }

    renderItem = ({ item }) => {
        const { user } = this.props.screenProps;
        const isColor = item.point > user.totalEDPoint;
        item.image = item.image?.includes('http') ? item.image : imageDefault;
        const { shadowBtn } = shadowStyle;
        return (
            <TouchableOpacity
                onPress={this.handleClickItem(item)}
                style={[styles.listSale, shadowBtn]}>
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
                                resizeMode={'contain'}
                            />
                            <Text
                                numberOfLines={1}
                                style={[styles.txtNumber, { color: isColor ? '#FF6213' : '#4776AD' }]}
                            >{item.point}</Text>
                        </View>
                    </View>
                    <View style={styles.limitSala}>
                        <Text style={styles.txtSalaNum}>Số lượng còn lại:</Text>
                        <Text style={[styles.txtSalaNum, { left: 5, color: '#007BFF' }]}>{item.remainQuantity}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        );
    };

    onToast = (text) => {
        this.toastRef.show(text, 3000)
    }

    renderEmpty = () => {
        return (
            <View style={styles.styWrapEmpty}>
                <Text style={styles.styTxtEmpty}>Hiện tại chưa có dữ liệu</Text>
            </View>
        )
    }

    render() {
        const { listItems } = this.props;
        console.log(listItems);
        return (
            <View style={styles.contain}>
                <FlatList
                    data={listItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this.renderEmpty}
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
        width: 75,
        height: 75,
        borderRadius: 16,
        marginTop: 10,
        marginBottom: 10,
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
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(16),
        color: '#000',
        marginTop: 20
    },
    txtNumber: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        color: '#4776AD',
        alignSelf: 'center',
        marginLeft: 5,
        paddingRight: 20,
        marginTop: 2,
        marginBottom: 2,
    },
    txtMark: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        color: '#000',
        alignSelf: 'center'
    },
    widthIcon: {
        width: 20,
        height: 20,
        marginLeft: 16,
        marginBottom: 2,
        alignSelf: 'center'
    },
    flexRight: {
        flexDirection: 'column',
        width: "70%",
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    styWrapEmpty: {
        height: height / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styTxtEmpty: {
        fontFamily: 'Nunito-Regular',
        color: '#828282',
        letterSpacing: 0.5,
        fontSize: RFFonsize(16)
    },
    limitSala: {
        flexDirection: 'row',
        marginVertical: 10
    },
    txtSalaNum: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#000'
    }
})