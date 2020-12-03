import React, { Component } from 'react';
import { View, Text, Image, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from '../../constants/colors';
import RippleButton from '../libs/RippleButton';
import { mainStyle } from '../../themes';
import AppIcon from '../../utils/AppIcon';

const iconRightSize = 22;

export default class HeaderNavigation extends Component {
    onPress(key) {
        this.props.onPressItem(key);
    }

    render() {
        const { title, bgColor, colorIcon, titleColor, color, styleTitle, isShowKeybroad } = this.props;
        const data = this.props.data || [];
        const back = this.props.back || null;
        const callBack = this.props.callBack || false;
        return (
            <View style={[mainStyle.headerContainer, { backgroundColor: bgColor || '#2F80ED' }]}>
                {(back) &&
                    <RippleButton
                        color={color || 'white'} radius={50} size={100} duration={250}
                        onPress={() => {
                            if (isShowKeybroad) {
                                Keyboard.dismiss();
                            } else if (callBack) {
                                this.props.onPressItem();
                            } else {
                                this.props.navigation.goBack();
                            }
                        }}
                        style={mainStyle.iconContainer}
                    >
                        <Image source={AppIcon.icon_arrowLeftv3} style={{ width: 20, height: 20, tintColor: colorIcon || '#444', }} tintColor={colorIcon || '#444'} resizeMode={'contain'}></Image>
                    </RippleButton>
                }
                <View style={[mainStyle.headerTitle, styleTitle]}>
                    <Text style={[mainStyle.headerTextTitle, { color: titleColor || '#FFF', fontFamily: 'Nunito-Bold', textAlign: 'center' }]} numberOfLines={1}>{title || ''}</Text>
                </View>
                <View style={mainStyle.headerRight}>
                    {data.map((val, key) => {
                        return (
                            <RippleButton
                                key={key}
                                color={'white'} radius={50} size={100} duration={250}
                                style={mainStyle.iconContainer}
                                onPress={() => this.onPress(key)}
                            >
                                <Icon
                                    name={val.name} size={iconRightSize}
                                    color={Color.colorIconHeader}
                                    style={mainStyle.headerIcon} />
                            </RippleButton>
                        );
                    })}
                </View>
            </View >
        );
    }
}



