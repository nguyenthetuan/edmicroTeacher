import React, { Component, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');

class SelectModal extends Component {
  state = {
    modalVisible: false,
    animation: 'fadeInUpBig',
  };

  onShowModal = () => {
    this.setState({ modalVisible: true });
  };

  onHideModal = () =>
    this.setState({ animation: 'fadeOutDownBig' }, () => {
      this.myTime = setTimeout(() => {
        this.setState({ modalVisible: false, animation: 'fadeInUpBig' });
        this.props.onHide();
      }, 700);
    });

  getColumns = (title) => {
    switch (title) {
      case 'Khối':
      case 'Môn học':
      case 'Môn Học':
      case 'Dạng Bài':
        return 2;
      default:
        return 1;
    }
  };

  componentWillUnmount() {
    if (this.myTime) {
      clearTimeout(this.myTime);
      this.myTime = null;
    }
  }

  render() {
    const { modalVisible, animation } = this.state;
    const { data, title, indexSelected } = this.props;
    const numColumns = this.getColumns(title);

    return (
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPressOut={this.onHideModal}>
          <View style={styles.fill}>
            <TouchableWithoutFeedback>
              <Animatable.View
                animation={animation} // su dung cho Animatable.View
                duration={700}
                style={styles.modalView}>
                <View
                  style={{
                    height: 35,
                    borderBottomWidth: 0.5,
                    borderColor: '#C4C4C4',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.txtTitle}>{title}</Text>
                </View>
                <View
                  style={{
                    height: height * 0.5,
                  }}>
                  <FlatList
                    contentContainerStyle={{
                      paddingBottom: getBottomSpace(),
                    }}
                    numColumns={numColumns}
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={data}
                    ListEmptyComponent={() => (
                      <Text style={styles.txtEmpty}>
                        Không tìm thấy kết quả
                      </Text>
                    )}
                    renderItem={({ item, index }) => {
                      const name = item.className || item.name;
                      const isSelected = indexSelected === index;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.onPressItem(index);
                            this.onHideModal();
                          }}
                          style={[
                            styles.item,
                            {
                              marginStart: numColumns === 1 ? 22 : 0,
                              alignItems:
                                numColumns === 1 ? 'flex-start' : 'center',
                            },
                          ]}>
                          <Text
                            style={{
                              textDecorationLine: isSelected
                                ? 'underline'
                                : 'none',
                              fontFamily: isSelected
                                ? 'Nunito-Bold'
                                : 'Nunito-Regular',
                              fontSize: 14,
                              color: isSelected ? '#2D9CDB' : '#828282',
                              paddingHorizontal: 6,
                            }}>
                            {name}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </Animatable.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: 'rgba(0,0,0,0.01)',
      android: 'rgba(0,0,0,0.6)',
    }),
    justifyContent: 'flex-end',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#2D9CDB',
  },
  txtEmpty: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    color: '#000',
    marginStart: 2,
    alignSelf: 'center',
    marginTop: height * 0.1,
  },
  item: {
    paddingVertical: 18,
    flex: 1,
    justifyContent: 'center',
  },
});

export default SelectModal;
