import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import RippleButton from '../common-new/RippleButton';
import { getSourceAvatar } from '../../utils/Helper';

export default class HeaderMain extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  openDrawer = () => {
    requestAnimationFrame(() => {
      this.props.navigation.toggleDrawer();
    });
  };

  navigateUser = () => {
    this.props.navigation.navigate('ChangInfo', {
      statusbar: 'light-content',
    });
  }

  render() {
    const { userId } = this.props;
    const source = getSourceAvatar(userId);
    return (
      <View style={styles.container}>
        <RippleButton onPress={this.openDrawer}>
          <View style={styles.button}>
            <Image source={require('../../asserts/icon/menu.png')} />
          </View>
        </RippleButton>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Image source={require('../../asserts/icon/logo_onluyen.png')} />
        </View>
        <TouchableOpacity
          onPress={this.navigateUser}
          style={styles.btnAvatar}>
          <Image
            resizeMode="cover"
            source={source}
            style={styles.imgAvatar}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 12,
  },
  button: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    marginLeft: 10,
  },
  imgAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
  },
});
