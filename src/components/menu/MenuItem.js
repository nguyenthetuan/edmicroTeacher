import React, { Component } from 'react';
import { View, Text, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import RippleButton from '../../components/common-new/RippleMenu';
import MenuStyle from './MenuStyle';

export const MenuItem = (props) => {
    const { onPress, rippleColor, source, title } = props;
    return (
        <RippleButton
            color={rippleColor}
            onPress={onPress}
        >
            <View style={MenuStyle.wrapComponent}>
                <Image
                    source={source}
                    style={MenuStyle.styleImage}
                    resizeMode={'contain'}
                />
                <Text style={MenuStyle.txtComponent}>{title}</Text>
                <Icon
                    name={'angle-right'}
                    color={'#4776AD'}
                    size={16}
                    style={[MenuStyle.angle]}
                />
            </View>
        </RippleButton>
    );
}