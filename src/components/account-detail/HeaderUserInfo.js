import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import AppIcon from '../../utils/AppIcon';
import _ from 'lodash';
import { getAvatarSource } from '../../utils/Common';
import Avatar from '../common-new/Avatar';
const { width, height } = Dimensions.get('window');
export default class HeaderUserInfo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { style, avatarSource } = this.props;
    return (
      <View horizontal={0} vertical={10} style={[styles.wrapContainer, style]} >
        <Avatar
          source={avatarSource}
          size={118}
          style={{ justifyContent: 'center', alignSelf: 'center', marginBottom: 20 }}
        />
        <View style={{ marginBottom: 20 }}>
          < TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => this.props.onPress()}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../../asserts/icon/camera.png')} />
              <Text style={styles.txtTitle}>Thay đổi ảnh đại diện</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  txtTitle: {
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
    fontSize: 14,
    marginLeft: 5,
  },
  wrapContainer: {
    paddingTop: 50,
    // justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 10,
    elevation: 10,
    flex: 1,
    flexDirection: 'row',
  },
  icon_wrap_avatar: {
    position: 'absolute',
    top: 15,
    width: 118, height: 118,

  }
})