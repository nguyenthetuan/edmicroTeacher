import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    FlatList,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    TouchableWithoutFeedback,
    ImageBackground,
    Modal,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import HeaderNavigation from '../common/HeaderNavigation';
import LinearGradient from 'react-native-linear-gradient';
import AppIcon from '../../utils/AppIcon';
import {
    userGiftAction,
    getListGiftAction,
    getListHistoryAction,
    getLandingCampaignAction,
    topCampaignAction
} from '../../actions/giftAction';
import dataHelper from '../../utils/dataHelper';
import { getSourceAvatar } from '../../utils/Helper';
import { imageDefault, formatNumber } from '../../utils/Common';
import { RFFonsize } from '../../utils/Fonts';

import Description from './Description';
import shadowStyle from '../../themes/shadowStyle';
const { width, height } = Dimensions.get('window');
let pageIndex = 0;
class ExchangeGiftScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGift: [],
            listItems: [],
            page: 1,
            isLoading: false,
            modalVisible: false,
        }
    }

    componentDidMount() {
        this.getDataInfo();
        this.showPopup();
    }
    showPopup = () => {
        setTimeout(() => {
            this.setState({ modalVisible: true })
        }, 1000)
    }

    getDataInfo = async () => {
        const { token } = await dataHelper.getToken();
        this.props.makeRequestProfile({ token });
        this.props.getListGiftAction({ token, page: 0 });
        this.props.getListHistoryGift({ token, page: 0 });
        this.props.getLandingCampaignAction({ token });
        this.props.topCampaignAction({ token });
    }

    handleClickItem = item => () => {
        const { user } = this.props;
        const isGoto = item.point > user.totalEDPoint;
        if (isGoto) {
            Alert.alert('Thông báo', 'Bạn không đủ điểm tích luỹ cho khuyến mãi này');
            return;
        }
        this.props.navigation.navigate('GiftDetail', {
            status: 'light-content',
            dataGift: item
        });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    setCloseModal = (visible) => {
        this.setState({ modalVisible: false })
    }

    renderItem = ({ item, index }) => {
        const { user } = this.props;
        const isColor = item.point > user.totalEDPoint;
        const { shadowBtn } = shadowStyle;
        item.image = item.image?.includes('http') ? item.image : imageDefault;
        return (
            <TouchableWithoutFeedback onPress={this.handleClickItem(item)}>
                <View style={[styles.listSale, shadowBtn]}>
                    <View style={styles.flexLeft}>
                        <Image
                            source={{
                                uri: item.image
                            }}
                            style={styles.sizeIcon}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={styles.flexRight}>
                        <Text style={styles.txtTitle}>{item.giftName}</Text>
                        <View style={styles.btnChange}>
                            <Text style={styles.txtMark}>Điểm</Text>
                            <View style={styles.changeCoin}>
                                <Image
                                    style={styles.widthIcon}
                                    source={require('../../asserts/icon/icon_coinGiftV3.png')}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={[styles.txtNumber, { color: isColor ? '#FF6213' : '#4776AD' }]}
                                >{formatNumber(parseInt(item.point))}</Text>
                            </View>
                        </View>
                        <View style={styles.limitSala}>
                            <Text style={styles.txtSalaNum}>Số lượng còn lại:</Text>
                            <Text style={[styles.txtSalaNum, { left: 5, color: '#007BFF' }]}>{item.remainQuantity}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    renderHeader = () => {
        const {
            navigation,
            user,
        } = this.props;
        const { uri } = getSourceAvatar(user.userId);
        return (
            <ImageBackground source={require('../../asserts/images/banner_drawerMenu.png')}
                style={styles.draWer}
                resizeMode="stretch">
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.navigate('SaleGift',
                            { statusbar: 'light-content' }
                        );
                    }}
                >
                    <View style={styles.sale}>
                        <Image source={AppIcon.icon_diamondV3} style={styles.icon_diamondV3} />
                        <Text style={styles.txtDiamond}>Lịch sử</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.flexSpace}>
                    <View style={styles.viewUser}>
                        <View style={styles.avatar}>
                            <Image source={AppIcon.icon_diamondV3} style={styles.sizeAvar} />
                            <Image source={{ uri }} style={styles.afterAvar} />
                        </View>
                        <View style={styles.description}>
                            <Text numberOfLines={1}
                                style={styles.txtName}>{user.displayName}</Text>
                            <View style={styles.rowCoin}>
                                <Image
                                    source={require('../../asserts/icon/icon_coinCountV3.png')}
                                    style={{ alignSelf: 'center' }} />
                                <Text
                                    numberOfLines={1}
                                    style={styles.countCoin}>
                                    {formatNumber(parseInt(user.totalEDPoint))}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Image
                        source={require('../../asserts/icon/icon_elipHeaderV3.png')}
                        resizeMode={'stretch'}
                        style={styles.iconElip}
                    />
                </View>
            </ImageBackground>

        );
    }

    renderEmpty = () => {
        const { isLoading } = this.props;
        return (
            <>
                {
                    isLoading ?
                        <ActivityIndicator color={'#2D9CDB'} size={'small'} style={styles.ActivityIndicator} />
                        :
                        <View style={styles.styWrapEmpty}>
                            <Text style={styles.styTxtEmpty}>Hiện tại chưa có dữ liệu</Text>
                        </View>
                }
            </>
        )
    }

    render() {
        const {
            navigation,
            isLoading,
            listGift,
            listItems,
            landingPage,
            itemCampa
        } = this.props;
        const { modalVisible } = this.state;
        return (
            <View style={[styles.container]} >
                <HeaderNavigation
                    title={'Đổi quà'}
                    navigation={navigation}
                    bgColor={'#2D9CDB'}
                    colorIcon={'#FFF'}
                    back={true}
                />
                {/* {isLoading ?
                    <ActivityIndicator color={'#2D9CDB'}
                        size={'small'}
                        style={styles.ActivityIndicator} />
                    : */}
                <View>
                    <View style={styles.backbg}>
                    </View>
                    <FlatList
                        data={listItems}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.renderHeader}
                        stickyHeaderIndices={[0]}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={this.renderEmpty}
                    // onEndReached={this.handleLoadMore}
                    // onEndReachedThreshold={0}
                    // ListFooterComponent={this.renderFooter}
                    />
                </View>
                {/* } */}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <Description
                        navigation={this.props.navigation}
                        setModalVisible={this.props.setModalVisible}
                        setCloseModal={this.setCloseModal}
                        modalVisible={this.state.modalVisible}
                        landingPage={this.props.landingPage}
                        itemCampa={this.props.itemCampa}
                    />
                </Modal>
                <SafeAreaView />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backbg: {
        backgroundColor: '#2D9CDB',
        height: height / 3.8,
        width,
        zIndex: -1,
        elevation: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    iconElip: {
        width: 150,
        height: 100,
        marginLeft: -50
    },
    cardUser: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fff',
        marginHorizontal: 16,
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
        marginRight: 15,
        // flexGrow: 1
    },
    icon_diamondV3: {
        alignSelf: 'center',
    },
    txtDiamond: {
        alignSelf: 'center',
        marginTop: 6,
        marginBottom: 4,
        fontSize: 12,
        lineHeight: RFFonsize(16),
        color: '#FF6213',
        marginLeft: 9,
    },
    avatar: {
        width: 90,
        height: 90,
        borderWidth: 5,
        borderColor: '#FFF',
        borderRadius: 50,
        marginLeft: 14,
        marginTop: 10,
        marginBottom: 10
    },
    flexSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sizeAvar: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#FF6213'
    },
    txtName: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(18),
        lineHeight: RFFonsize(25),
        color: '#fff',
    },
    countCoin: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(18),
        lineHeight: RFFonsize(25),
        color: '#fff',
        marginLeft: 17,
        alignSelf: 'center',
    },
    rowCoin: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    description: {
        flexDirection: 'column',
        marginLeft: 24,
        marginTop: 30,
        marginRight: 10,
        width: 190,
    },
    viewUser: {
        flexDirection: 'row',
    },
    afterAvar: {
        marginTop: -80,
        width: 80,
        height: 80,
        borderRadius: 90
    },
    listSale: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
        marginVertical: 8,
        marginRight: 16,
        borderRadius: 4,
        flex: 1
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
        marginRight: 15,
        marginTop: 2,
        marginBottom: 2,
        paddingRight: 10
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
        marginTop: 2,
        marginBottom: 2,
        alignSelf: 'center'
    },
    flexRight: {
        flexDirection: 'column',
        width: "70%",
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    ActivityIndicator: {
        flex: 1
    },
    gadient: {
        height: 10,
    },
    btnChange: {
        flexDirection: 'row',
        marginTop: 16,
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
    },
    loader: {
        marginTop: 10,
        alignItems: 'center',
    },
    draWer: {
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#fff',
        marginHorizontal: 16,
    },
    closeModal: {
        alignItems: 'flex-end',
        right: 10,
        top: 10
    }
})



const mapStateToProps = state => {
    return {
        user: state.gift.user,
        listGift: state.gift.listGift,
        listItems: state.gift.listItems,
        listHistory: state.gift.listHistory,
        landingPage: state.gift.landingPage,
        topCampaign: state.gift.topCampaign,
        isLoading: state.gift.isLoading,
        itemCampa: state.gift.itemCampa,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        makeRequestProfile: payload => dispatch(userGiftAction(payload)),
        getListGiftAction: payload => dispatch(getListGiftAction(payload)),
        getListHistoryGift: payload => dispatch(getListHistoryAction(payload)),
        getLandingCampaignAction: payload => dispatch(getLandingCampaignAction(payload)),
        topCampaignAction: payload => dispatch(topCampaignAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeGiftScreen);