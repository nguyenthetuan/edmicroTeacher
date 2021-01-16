import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { mainStyle } from '../../../themes';
import RippleButton from '../../libs/RippleButton';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';

export default class HeaderLoopModal extends Component {
  render() {
    return (
      <View style={[mainStyle.wrapHeader, { backgroundColor: this.props.bgColor || 'white' }]}>
        {/* <View style={mainStyle.borderTop} /> */}
        <View style={mainStyle.bodyHeader}>
          {/* <Icon
            name={this.props.nameIcon ? this.props.nameIcon : 'stop'}
            style={mainStyle.iconHeader} size={16} color={this.props.color || '#333'} /> */}
          {!this.props.isHideAleartIcon && <Image source={AppIcon.icon_warning} style={mainStyle.iconHeader} resizeMode={'contain'} />}
          <View style={{ flex: 1, paddingTop: 10 }}>
            <Text style={[mainStyle.textHeader, mainStyle.textHeaderModal, { color: this.props.color, alignSelf: 'center', fontSize: RFFonsize(14), fontFamily: 'Nunito-Bold' }]}>
              {this.props.title ? this.props.title : ''}
            </Text>
          </View>
          {this.props.visibleClose != 0 &&
            <RippleButton color={'#fff'} size={60} onPress={() => this.props.hideModal()} style={{ paddingVertical: 7, paddingHorizontal: 10, }}>
              {/* <Icon style={mainStyle.iconClose} name="close" size={22} color={this.props.color || '#333'} /> */}
              <Image source={require('../../../asserts/icon/close_popup.png')} resizeMode={'contain'} style={[mainStyle.iconClose, { tintColor: this.props.color }]} tintColor={this.props.color}></Image>
            </RippleButton>
          }
        </View>
      </View >
    );
  }
}
