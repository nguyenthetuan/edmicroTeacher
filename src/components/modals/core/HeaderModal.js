import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class HeaderModal extends Component {
  render() {
    return (
      <View style={styles.headerContainerModal}>
        <Text style={styles.textHeaderModal}>
          {this.props.title ? this.props.title : 'Thông báo'}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainerModal: {
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  textHeaderModal: {
    color: '#fff',
  }
});
