import React, { Component } from 'react';
import { View } from 'react-native';

export default class MyCardView extends Component {
  render() {
    const { horizontal, bgColor, vertical } = this.props;
    return (
      <View
        style={[{
          backgroundColor: 'bgColor' || 'transparent',
          marginHorizontal: horizontal && horizontal,
          marginVertical: vertical || 0,
          borderBottomColor: '#f8f8f8',
        }, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}
