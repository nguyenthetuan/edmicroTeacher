import React, { Component } from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import HomeStyle from './HomeStyle';
import LinearGradient from 'react-native-linear-gradient';

export default class WellcomeTxt extends Component {
    render() {
        return (
            <View style={HomeStyle.shadow}>
                <LinearGradient colors={["#56CCF2", "#7CD1EC"]} style={HomeStyle.backGrou}>
                    <Image source={require('../../../asserts/appIcon/logo_TearcherTxt.png')} style={HomeStyle.iconDes} />
                    <Text style={HomeStyle.titleWell}>Kính chào quý Thầy Cô</Text>
                    <Text style={HomeStyle.descript}>
                        Onluyen.vn hỗ trợ giáo viên có thể dễ dàng tạo và giao bài tập,
                        nhiệm vụ từ ngân hàng đề có sẵn của Onluyen.vn hoặc ngân hàng đề riêng bộ môn trong trường học.
                        Onluyen.vn cho phép giáo viên theo dõi, đánh giá được năng lực học sinh thông qua hệ thống báo cáo chi tiết.
                </Text>
                </LinearGradient>
            </View>

        )
    }
}