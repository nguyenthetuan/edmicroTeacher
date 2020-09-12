import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class ActionModal extends Component {
  render() {
    return (
      <View style={styles.containerAction}>
        <TouchableOpacity style={styles.actionLeft} onPress={() => this.props.leftAction()}>
          <Text style={styles.textAction}>
            {this.props.left ? this.props.left : 'Cancel'}
          </Text>
        </TouchableOpacity>
        <View style={styles.borderCenter} />
        <TouchableOpacity style={styles.actionRight} onPress={() => this.props.rightAction()}>
          <Text style={styles.textAction}>
            {this.props.right ? this.props.right : 'OK'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerAction: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#cdcdcd',
  },
  actionLeft: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    flex: 1,
    borderBottomLeftRadius: 3
  },
  borderCenter: {
    width: 0.5,
    backgroundColor: '#cdcdcd',
  },
  actionRight: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    flex: 1,
    borderBottomRightRadius: 3
  },
  textAction: {
    textAlign: 'center',
  }
});
