import React, { Component } from 'react';
import { Modal, View, PanResponder, StyleSheet, TouchableOpacity } from 'react-native';

export default class FrameModal extends Component {
  componentDidMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
    });
  }

  handleModal() {
    const touchable = this.props.touchable == false ? false : true;
    if (touchable) {
      this.props.hideModal();
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        animationType={this.props.type ? this.props.type : 'fade'}
        onRequestClose={() => {
          const touchable = this.props.touchable == false ? false : true;
          if (touchable) {
            this.props.hideModal();
          }
        }}>
        <TouchableOpacity
          style={styles.containerModal}
          onPress={() => {
            this.handleModal();
          }}>
          <View
            style={this.props.screen ? styles.screen : styles.modal}
            {...this.panResponder.panHandlers}>
            {this.props.children}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: '#rgba(0.0,0.0,0.0,0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    margin: 30,
  },
  screen: {
    flex: 1,
  }
});
