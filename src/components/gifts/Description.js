import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback,
    ScrollView,
    FlatList,
    Linking
} from 'react-native';
import {
    Table,
    TableWrapper,
    Row,
    Rows,
    Col
} from 'react-native-table-component';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import moment from 'moment';
import { RFFonsize } from '../../utils/Fonts';
import StylePopup from './StylesModal/StylePopup';
import AppIcon from '../../utils/AppIcon';
import shadowStyle from '../../themes/shadowStyle';
import _ from 'lodash';
const { width, height } = Dimensions.get('screen');
const horizontalMargin = 10;
const slideWidth = width - 100;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = height;

const Description = (props) => {
    const { setModalVisible, landingPage, setCloseModal } = props;
    const { shadowBtn } = shadowStyle;
    console.log('landingPage',landingPage);
    const linkApple = () => {
        Linking.openURL("https://apple.co/3mtc38M");
    }
    const linkAndroid = () => {
        Linking.openURL("https://bit.ly/39TVHRy");
    }

    const renderItem = ({ item, index }) => {
        console.log('item', item);
        let name = [];
        let coin = [];
        if (item?.giftsCampaign.length > 0) {
            name = item?.giftsCampaign.map((val) => {
                return val?.giftName + "\n";
            });
        }
        if (item?.giftsCampaign.length > 0) {
            coin = item?.giftsCampaign.map((val) => {
                return val?.point + "\n";
            });
        }
        const CONTENT = {
            tableHead: ['PHẦN QUÀ', 'SỐ KIM CƯƠNG'],
            tableTitle: [name],
            tableData: [name],
            tableCoin: [coin]
        };
        const dateStart = moment(item.startDate).format('L');
        const dateEnd = moment(item.endDate).format('L');

        return (
            <View style={StylePopup.viewTables}>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={StylePopup.txtCount}>Thời gian bắt đầu từ ngày</Text>
                    <Text style={StylePopup.timeStart}>{dateStart}</Text>
                    <Text style={StylePopup.txtCount}>Kết thúc vào ngày:</Text>
                    <Text style={StylePopup.timeEnd}>{dateEnd}</Text>
                </View>
                <Text style={[StylePopup.actionDia, { color: '#000', marginVertical: 10 }]}>{item.name}</Text>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#c4c4c4' }}>
                    <Row
                        data={CONTENT.tableHead}
                        style={styles.head}
                        textStyle={styles.text}
                    />
                    <TableWrapper style={styles.wrapper}>
                        <Rows
                            data={CONTENT.tableData}
                            flexArr={[1]}
                            style={styles.title}
                            textStyle={styles.text}
                        />
                        <Rows
                            data={CONTENT.tableCoin}
                            flexArr={[1]}
                            style={styles.title}
                            textStyle={styles.text}
                        />
                    </TableWrapper>
                </Table>
                <Text style={StylePopup.allPrices}>Tổng giá trị hơn <Text style={{ color: "#FA7FB8", fontWeight: "bold" }}>{item.totalAmount} Đồng</Text></Text>
            </View>
        )
    }



    return (
        <View style={StylePopup.rgbaColor}>
            <View style={[StylePopup.centeredView, shadowBtn]}>
                <TouchableWithoutFeedback
                    hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}

                    onPress={props.setCloseModal}
                >
                    <View style={styles.closeModal}>
                        <Image source={AppIcon.icon_close_modal} style={{ tintColor: '#000' }} />
                    </View>
                </TouchableWithoutFeedback>
                <ScrollView style={{ flex: 1, marginTop: 20 }} showsVerticalScrollIndicator={false}>
                    <View style={StylePopup.header}>
                        <Text style={StylePopup.titleFirst}>Chương trình thúc đẩy </Text>
                        <Text style={StylePopup.titleTwo}>“Chuyển đổi số ngành giáo dục” </Text>
                        <Text style={StylePopup.titleThree}>DÀNH CHO GIÁO VIÊN CÁC TRƯỜNG ĐĂNG KÝ BẢN QUYỀN APP ONLUYEN TẠI HẢI PHÒNG  </Text>
                        <View style={{ flexDirection: 'column', flex: 1, marginTop: 16 }}>
                            <View style={StylePopup.flexView}>
                                <Text style={StylePopup.txtTuto}>Nhận kim cương</Text>
                                <Text style={StylePopup.txtTuto}>Chọn và đổi quà</Text>
                            </View>
                            <View style={StylePopup.flexView}>
                                <Image source={require('../../asserts/images/images_popupOneG.png')} style={{ width: 100, height: 100, marginTop: 8 }} />
                                <Image source={require('../../asserts/images/images_popupTwoG.png')} style={{ width: 100, height: 100, marginTop: 8 }} />
                            </View>
                        </View>
                    </View>

                    <Carousel
                        data={landingPage}
                        layout={'default'}
                        renderItem={renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        itemHeight={itemHeight}
                        activeSlideOffset={1}
                        inactiveSlideOpacity={0.7}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        activeAnimationType='spring'
                        activeSlideAlignment='center'
                    />
                    <View style={StylePopup.optionTitle}>
                        <Text style={[StylePopup.actionDia, { color: '#000' }]}>Các hoạt động của giáo viên và số Kim cương thưởng</Text>
                        <Image source={require('../../asserts/images/teacher-action.png')} resizeMode="contain" style={StylePopup.imageAction} />
                        <View style={[StylePopup.viewExample, shadowBtn]}>
                            <View>
                                <Text style={[StylePopup.text, { color: "#94DEF6", marginTop: 10 }]}>Ví dụ 1:</Text>
                                <Text style={StylePopup.text}>{`Nếu giáo viên giao 01 đề/tuần và 01 nhiệm vụ tự học/01 tháng cho 03 lớp mình quản lý trong thời gian 02 tháng: + > 60% học sinh trong lớp hoàn thành bài tập+ >10% học sinh trong lớp hoàn thành nhiệm vụ tự học Giáo viên sẽ dành được 420 kim cương -> có thể đổi được 01 chuột không dây + 01 bình uống nước hoặc 01 sạc dự phòng + 01 áo mưa + 01 bình uống nước`}</Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={[StylePopup.text, { color: "#94DEF6", marginTop: 10 }]}>Ví dụ 2:</Text>
                                <Text style={StylePopup.text}>{`Nếu giáo viên giao 02 đề/tuần và giao 01 nhiệm vụ tự học/01 tháng cho 05 lớp mình quản lý trong thời gian 02 tháng:+ > 60% học sinh trong lớp hoàn thành bài tập+ >10% học sinh trong lớp hoàn thành nhiệm vụ tự học Giáo viên sẽ dành được 1.100 kim cương -> có thể đổi được 01 vali + 01 áo mưa`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[StylePopup.viewExample, shadowBtn, { marginTop: 16, marginBottom: 30 }]}>
                        <View style={StylePopup.optionTitle}>
                            <Text style={StylePopup.actionDia}>Thông tin chi tiết về chương trình</Text>
                            <Text style={StylePopup.text}>
                                1. Số Kim Cương được cập nhật ngay trên tài khoản của giáo viên trên APP Onluyen dành cho giáo viên:
                                iPhone, iPad cài đặt tại link sau:
                                <TouchableWithoutFeedback
                                    onPress={linkApple}
                                >
                                    <Text style={{ color: '#0056B3' }}> https://apple.co/3mtc38M </Text>
                                </TouchableWithoutFeedback>
                                 Android – Google Play cài đặt tại link sau:
                                <TouchableWithoutFeedback onPress={linkAndroid} >
                                    <Text style={{ color: "#0056B3" }}> https://bit.ly/39TVHRy </Text>
                                </TouchableWithoutFeedback>
                            </Text>
                            <Text style={StylePopup.text}>
                                2. Chương trình bắt đầu từ ngày <Text style={{ color: "#F96A7C" }}>01/05/2021</Text> và kết thúc vào ngày <Text style={{ color: "#F96A7C" }}>30/06/2021</Text> hoặc có thể kết thúc sớm hơn khi các giáo viên đã quy đổi Kim cương trên tài khoản hết 300 phần quà tặng từ chương trình. Tổng giá trị chương trình = 66 Triệu Đồng.
                           </Text>
                            <Text style={[StylePopup.text, { paddingBottom: 10 }]}>
                                3. Giáo viên chưa quy đổi hết Kim cương có thể tích lũy lại để quy đổi cho các chương trình khác trong năm học tới.
                        </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default Description;

const styles = StyleSheet.create({
    head: {
        fontFamily: "Nunito-Bold",
    },
    slider: {
        overflow: 'visible'
    },
    sliderContentContainer: {
        paddingVertical: 10
    },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    wrapper: { flexDirection: 'row' },
    title: {
        flex: 1,
        backgroundColor: '#f6f8fa',
        flexDirection: 'column',
    },
    // row: { height: height * 0.05 },
    text: {
        textAlign: 'center',
        color: "#316ECE",
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14)
    },
    closeModal: {
        alignSelf: 'flex-end',
        right: 10,
        top: 10,
        bottom: 10,
    }

})