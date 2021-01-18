import React, { Component } from 'react';
import { Modal, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import _ from 'lodash';
import * as AppIcon from '../../../../utils/AppIcon';

export default class ImageZoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      visible: false,
    };
  }

  _setState = (images) => {
    this.setState({ images, visible: true });
  };

  closeImage = () => {
    this.setState({ visible: false });
  };

  renderHeader = () => (
    <TouchableOpacity
      onPress={this.closeImage}
      style={{
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
      }}>
      <Image source={AppIcon.icon_close_modal} style={{ tintColor: '#FFF' }} />
    </TouchableOpacity>
  );

  render() {
    let { visible, images } = this.state;
    images = images.map((item) => ({
      url: item,
    }));
    return (
      <Modal visible={visible} transparent={true}>
        <ImageViewer
          imageUrls={images}
          enableSwipeDown={true}
          onCancel={this.closeImage}
          renderHeader={this.renderHeader}
          loadingRender={() => (
            <ActivityIndicator
              animating={true}
              color={'#FFF'}
            />
          )}
        />
      </Modal>
    );
  }
}
