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
const { width, height } = Dimensions.get('window');
import { RFFonsize } from '../../utils/Fonts';
import StylePopup from './StylesModal/StylePopup';
import AppIcon from '../../utils/AppIcon';
import shadowStyle from '../../themes/shadowStyle';
import _ from 'lodash';

const Description = (props) => {
    const { setModalVisible, landingPage } = props;
    const { shadowBtn } = shadowStyle;
    const linkApple = () => {
        Linking.openURL("https://apple.co/3mtc38M");
    }
    const linkAndroid = () => {
        Linking.openURL("https://bit.ly/39TVHRy");
    }

    return (
        <View style={StylePopup.rgbaColor}>
            {/* <TouchableWithoutFeedback
                hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
                onPress={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.closeModal}>
                    <Image source={AppIcon.icon_close_modal} style={{ tintColor: '#000' }} />
                </View>
            </TouchableWithoutFeedback> */}
            <View style={[StylePopup.centeredView, shadowBtn]}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View>
                        <Text>Chương trình thúc đẩy </Text>
                        <Text>“Chuyển đổi số ngành giáo dục” </Text>
                        <Text>ÀNH CHO GIÁO VIÊN CÁC TRƯỜNG ĐĂNG KÝ BẢN QUYỀN APP ONLUYEN TẠI HẢI PHÒNG  </Text>
                        <Text>Hoàn thành các tác vụ để nhận kim cương  </Text>
                        <Image source={require('../../asserts/images/images_popupOneG.png')} style={{ width: 100, height: 100 }} />
                        <Image source={require('../../asserts/images/images_popupTwoG.png')} style={{ width: 100, height: 100 }} />
                        <Text>Thời gian bắt đầu từ ngày</Text>
                        <Text style={StylePopup.timeStart}>17/04/2021</Text>
                        <Text>Kết thúc vào ngày:</Text>
                        <Text style={StylePopup.timeEnd}>15/05/2021</Text>
                    </View>
                    {/* <FlatList
                        data={landingPage}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                    /> */}
                    <Text style={StylePopup.allPrices}>Tổng giá trị hơn <Text style={{ color: "#FA7FB8", fontWeight: "bold" }}>66.000.000 Đồng</Text></Text>
                    <View style={StylePopup.optionTitle}>
                        <Text style={StylePopup.actionDia}>Các hoạt động của giáo viên và số Kim cương thưởng</Text>
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
                            <Text style={StylePopup.text}>
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

})