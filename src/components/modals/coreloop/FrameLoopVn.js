import React, { Component } from 'react';
import { Modal, View, PanResponder, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

export default class FrameModal extends Component {
  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
    });
  }

  handleModal(touch) {
    const touchable = touch || true;
    if (touchable) {
      this.props.hideModal();
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        hardwareAccelerated
        animationType={this.props.type ? this.props.type : 'fade'}
        onRequestClose={() => {
          if (this.props.types === 2) {
            this.props.goBack();
          } else {
            this.props.hideModal();
          }
        }
        }>
        <StatusBar barStyle={'dark-content'} />
        <TouchableOpacity
          style={this.props.screen ? styles.containerScreen : styles.containerModal}
          onPress={() => this.handleModal(this.props.touchable)}>
          <View
            style={{ flex: 1 }}>
            <View
              style={this.props.screen ? styles.screen : styles.modal}
              {...this.panResponder.panHandlers}>
              {this.props.children}
            </View>
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
  containerScreen: {
    backgroundColor: '#fff',
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
