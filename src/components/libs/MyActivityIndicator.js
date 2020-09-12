/**
 * ActivityIndicator screen
 * 
 * Props 
 * isLoading required
 * color no required
 * size no required
 * bgColor no required
 */


import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { BallIndicator, } from 'react-native-indicators';
// import { UIActivityIndicator, } from 'react-native-indicators';

const BG_DEFAULT = 'white';
const COLOR_DEFAULT = '#9C9C9C';
const SIZE_DEFAULT = 'large'; //or number

export default class MyActivityIndicator extends Component {
  render() {
    const { isLoading, bgColor } = this.props;
    return (
      <View
        style={[isLoading ? styles.container : styles.none,
        { backgroundColor: bgColor || BG_DEFAULT },
        { marginBottom: this.props.bottom || 0 }
        ]}>
        {/* <BallIndicator color={'#1CAFF6'} size={60} count={10} /> */}
        {this.props.isLoading && <ActivityIndicator
          color={this.props.color || COLOR_DEFAULT}
          size={this.props.size || 35} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  none: {
    display: 'none',
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -2,
  }
});
