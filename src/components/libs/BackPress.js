import React, { Component } from 'react';
import { StyleSheet, Platform, Image } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from '../../constants/colors';
import RippleButton from '../libs/RippleButton';
import AppIcon from '../../utils/AppIcon';

const top = isIphoneX() ? 30 : Platform.OS == 'ios' ? 20 : 10;

export default class BackPress extends Component {
  render() {
    const { tintColor } = this.props;
    return (
      <RippleButton color={tintColor || 'white'} radius={50} size={100} duration={250} onPress={() => { this.props.goBack ? this.props.goBack() : this.props.navigation.goBack() }} style={[styles.backFixHeader, this.props.style]}>
        {/* <Icon name={'chevron-left'} size={24} color={Color.colorIconHeader} style={{ marginRight: 2 }} /> */}
        <Image source={AppIcon.arrow_left} style={{ width: 17, height: 16, tintColor }} tintColor={tintColor} resizeMode={'contain'}></Image>
      </RippleButton>
    );
  }
}

const styles = StyleSheet.create({
  backFixHeader: {
    width: 40,
    height: 40,
    top: top,
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
});
