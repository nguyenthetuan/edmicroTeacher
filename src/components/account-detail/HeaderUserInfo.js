import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import AppIcon from '../../utils/AppIcon';
import _ from 'lodash';
import { getAvatarSource } from '../../utils/Common';
import Avatar from '../common-new/Avatar';
import { RFFonsize } from '../../utils/Fonts';
const { width, height } = Dimensions.get('window');
export default class HeaderUserInfo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { style, avatarSource } = this.props;
    return (
      <View horizontal={0} vertical={10} style={[styles.wrapContainer, style]} >
        <View>
          <Avatar
            source={avatarSource}
            size={Platform.isPad ? 130 : 118}
            center
            style={{ justifyContent: 'center', alignSelf: 'center' }}
            onEdit={() => this.props.onPress()}
          />
        </View>
        {/* <View style={{ marginBottom: 20 }}>
          < TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => this.props.onPress()}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../../asserts/icon/camera.png')} />
              <Text style={styles.txtTitle}>Thay đổi ảnh đại diện</Text>
            </View>
          </TouchableOpacity>
        </View> */}
      </View >
    )
  }
}

const styles = StyleSheet.create({
  txtTitle: {
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
    fontSize: RFFonsize(14),
    marginLeft: 5,
  },
  wrapContainer: {
    paddingTop: Platform.isPad ? 40 : 20,
    // backgroundColor: '#3A608C',
    paddingBottom: Platform.isPad ? 40 : 20,
  },
  icon_wrap_avatar: {
    position: 'absolute',
    top: 15,
    width: 118, height: 118,

  }
})