import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class ConerEfect extends Component {
  render() {
    return (
      <View
        style={[styles.conner,
        {
          backgroundColor: this.props.color,
          width: this.props.size,
          height: this.props.size,
          opacity: this.props.opacity,
          borderRadius: this.props.size / 2,
          top: this.props.top && this.props.top,
          bottom: this.props.bottom && this.props.bottom,
          left: this.props.left && this.props.left,
          right: this.props.top && this.props.right
        }]} />
    );
  }
}

const styles = StyleSheet.create({
  conner: {
    position: 'absolute',
    borderRadius: 30,
    alignSelf: 'center',
  }
});
