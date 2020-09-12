import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default class StickeyHeader extends Component {
  render() {
    return (
      <View style={[styles.wrapStickey, { backgroundColor: this.props.bgColor }]}>
        {Platform.OS == 'ios' &&
          <View style={styles.viewStatusIos} />
        }
        <Text style={[styles.viewStickey]}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStatusIos: {
    height: 20,
  },
  wrapStickey: {
    height: isIphoneX() ? 83 : 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewStickey: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
