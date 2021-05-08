import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Modal,
    Linking,
    Dimensions,
    TouchableWithoutFeedback,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import dataHelper from '../../utils/dataHelper';
import { userGiftAction, getListGiftAction, getListHistoryAction } from '../../actions/giftAction';
import moment from 'moment';
import { imageDefault } from '../../utils/Common';
import Icon from 'react-native-vector-icons/Feather';
import Toast, { DURATION } from 'react-native-easy-toast';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { copyToClipboard } from '../../utils/Common';
import { RFFonsize } from '../../utils/Fonts';
import shadowStyle from '../../themes/shadowStyle';
const { width, height } = Dimensions.get('window');

class HistoryGift extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHistory: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.getHistory();
    }

    getHistory = async () => {
        const { token } = await dataHelper.getToken();
        this.props.getListHistoryGift({ token, page: 0 });
    }



    renderItem = ({ item, index }) => {
        const { user } = this.props;
        const isColor = item.point > user.totalEDPoint;
        item.image = item.image?.includes('http') ? item.image : imageDefault;
        const { shadowBtn } = shadowStyle;
        return (
            <TouchableWithoutFeedback
                onPress={this.handleClickItem(item)}
            >
                <View style={[styles.listSale, shadowBtn]}>
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
                </View>
            </TouchableWithoutFeedback>
        );
    };

    handleClickItem = item => () => {
        if (item.receiveGift == 'NOW') {
            this.refModalCard.changeStateVisible(item);
            return;
        }
    }

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
        const { listHistory, isLoading } = this.props;
        return (
            <View style={styles.contain}>
                {
                    isLoading ?
                        <ActivityIndicator size="small" style={{ flex: 1 }} />
                        :
                        <FlatList
                            data={listHistory}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={this.renderEmpty}
                        />
                }

                {/* <ModalCard
                    ref={ref => this.refModalCard = ref}
                    refsToast={() => this.toastRef.show('Copy thành công')}
                /> */}
                <Toast
                    ref={ref => this.toastRef = ref}
                    position={'center'}
                />
            </View>
        );
    }
}

// class ModalCard extends Component {

//     state = {
//         visible: false,
//         item: {}
//     }

//     changeStateVisible = (item = {}) => {
//         const { visible } = this.state;
//         this.setState({ visible: !visible, item });
//     }

//     handleRechargeNow = () => {
//         const { item } = this.state;
//         let phoneNumber = '';
//         let code = item.gift;
//         code = code.replace(/[ -]+/g, '');
//         if (Platform.OS !== 'android') {
//             phoneNumber = `telprompt:*100*${code}\%23`;
//         }
//         else {
//             phoneNumber = `tel://*100*${code}\%23`;
//         }
//         Linking.canOpenURL(phoneNumber)
//             .then(supported => {
//                 if (!supported) {
//                     Alert.alert('Phone number is not available');
//                 } else {
//                     return Linking.openURL(phoneNumber);
//                 }
//             })
//             .catch(err => console.log('err', err));
//     }

//     onclickCopyToClipboard = () => {
//         const { item } = this.state;
//         const isCopy = copyToClipboard(item.gift);
//         if (isCopy) {
//             this.props.refsToast();
//         }
//     }

//     render() {
//         const { visible, item } = this.state;
//         return (
//             <Modal visible={visible} transparent={true} >
//                 <View style={styles.styWrapModal}>
//                     <View style={styles.styWrapContent}>
//                         <TouchableWithoutFeedback
//                             hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//                             onPress={this.changeStateVisible}
//                         >
//                             <View style={{ alignSelf: 'flex-end' }}>
//                                 <IconAntDesign name={'closecircleo'} style={{ fontSize: 20 }} />
//                             </View>
//                         </TouchableWithoutFeedback>
//                         <View style={{ flexDirection: 'row' }}>
//                             <View style={styles.styWrapImg}>
//                                 <Image
//                                     source={{ uri: item.image }}
//                                     resizeMode={'contain'}
//                                     style={styles.styImageModal}
//                                 />
//                             </View>
//                             <View style={{ marginHorizontal: 5 }}>
//                                 <Text style={{ fontFamily: 'Nunito-Bold' }}>{item.giftName}</Text>
//                                 <Text style={[styles.txtMark, { alignSelf: 'flex-start', marginTop: 8 }]}>
//                                     {moment(item.time).format('HH:MM - DD/MM/YYYY')}
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={styles.stWrapGiftCode}>
//                             <Text style={styles.styTxtGift}>{item.gift}</Text>
//                             <TouchableWithoutFeedback
//                                 onPress={this.onclickCopyToClipboard}
//                                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                             >
//                                 <Icon name={'copy'} style={{ color: '#828282', fontSize: 20 }} />
//                             </TouchableWithoutFeedback>
//                         </View>
//                         <TouchableWithoutFeedback
//                             onPress={this.handleRechargeNow}
//                         >
//                             <View style={{ alignSelf: 'flex-end' }}>
//                                 <Text style={styles.styTxtBtn}>Nạp ngay</Text>
//                             </View>
//                         </TouchableWithoutFeedback>
//                     </View>
//                 </View>
//             </Modal>
//         )
//     }
// }

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },
    listSale: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
        marginVertical: 8,
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
    },
    txtTitle: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
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
    },
    txtMark: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
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
        bottom: 10
    },
    styWrapModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    styWrapContent: {
        minHeight: 200,
        width: 350,
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
    styTxtGift: {
        flex: 1,
        letterSpacing: 0.5,
        fontFamily: 'Nunito-Regular'
    }
})



const mapStateToProps = state => {
    return {
        user: state.gift.user,
        listHistory: state.gift.listHistory,
        isLoading: state.gift.isLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getListHistoryGift: payload => dispatch(getListHistoryAction(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryGift);