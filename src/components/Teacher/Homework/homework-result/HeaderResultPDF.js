import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import RippleButton from '../../../libs/RippleButton';
import { mainStyle } from '../../../../themes';
import AppIcon from '../../../../utils/AppIcon';
import shadowStyle from '../../../../themes/shadowStyle';
import Globals from '../../../../utils/Globals';
export default class HeaderNavigation extends Component {
    onPress = () => {
        Alert.alert(
            '',
            'Bạn có chắc chắn cho học sinh này làm lại?',
            [
                {
                    text: 'Có', onPress: () => {
                        this.goBack();
                        const { studentId } = this.props.navigation.state.params;
                        Globals.handleRework(studentId)();
                    }
                },
                { text: 'Không', onPress: () => { } },
            ],
            { cancelable: false }
        );

    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        const { title, bgColor, colorIcon, titleColor, color, isShowKeybroad, } = this.props;
        const callBack = this.props.callBack || false;
        return (
            <View style={[mainStyle.headerContainer, { backgroundColor: bgColor || '#2F80ED' }]}>
                <RippleButton
                    color={color || 'white'} radius={50} size={100} duration={250}
                    onPress={this.goBack}
                    style={mainStyle.iconContainer}
                >
                    <Image source={AppIcon.icon_arrowLeftv3} style={{ width: 20, height: 20, tintColor: colorIcon || '#444', }} tintColor={colorIcon || '#444'} resizeMode={'contain'}></Image>
                </RippleButton>
                <View style={[mainStyle.headerTitle,]}>
                    <Text style={[mainStyle.headerTextTitle, { color: titleColor || '#FFF', fontFamily: 'Nunito-Bold', textAlign: 'left', fontSize: 16 }]} numberOfLines={1}>{title || ''}</Text>
                </View>
                <TouchableWithoutFeedback onPress={this.onPress}>
                    <View style={[styles.headerRight, shadowStyle.shadowBtn]}>
                        <Text style={styles.styTxtBtn}>Cho phép làm lại</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    headerRight: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#F49A31',
        marginVertical: 4,
    },
    styTxtBtn: {
        color: "#FFF",
        fontFamily: 'Nunito-Regular',
        fontSize: 13,
    },
});


