import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Animated,
  Keyboard,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFFonsize } from '../../../utils/Fonts';
import _ from 'lodash';
const { width, height } = Dimensions.get('window');

export default class ModalConfigLibrary extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      visible: false,
      dropdownVisible: false,
      selectItem: (!_.isEmpty(value) && value) || {},
      indexItem: '',
      value: (!_.isEmpty(value) && value) || {},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        selectItem: { name: '', code: '' },
      });
    }
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value: nextProps.value,
        selectItem: nextProps.value,
        indexItem: 0,
      });
    }
    return true;
  }

  selectItem = ({ item, index }) => {
    const { indexItem } = this.state;
    // if (index === indexItem) {
    //   return;
    // }
    this.setState(
      {
        selectItem: item,
        indexItem: index,
        visible: false,
      },
      this.props.onPress(item),
    );
  };

  deleteItem = () => {
    this.setState(
      {
        selectItem: { name: '', code: '' },
      },
      () => this.props.onPress(this.state.selectItem),
    );
  };

  render() {
    const { visible, dropdownVisible, selectItem, indexItem, value } = this.state;
    const { title, data, widthItem, colum, activeButtom } = this.props;
    const converData =
      data && (data.length % 2 !== 0 ? [...data, { name: '' }] : data);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.txtTitle}>{title}</Text>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ visible: true })}
          >
            <View style={styles.btnModal}>
              {(!_.isEmpty(selectItem) && selectItem.name) ||
                (!_.isEmpty(value) && value.name) ? (
                  <Text style={styles.txtSelectItem} numberOfLines={1}>
                    {selectItem.name || value.name}
                  </Text>
                ) : (
                  <Text style={styles.txtPlaceIn}>-------</Text>
                )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {activeButtom && !_.isEmpty(selectItem) && selectItem.name ? (
                  <TouchableWithoutFeedback onPress={() => this.deleteItem()}>
                    <Text
                      style={{ fontSize: RFFonsize(12), color: '#757575', marginRight: 5 }}>
                      x
                  </Text>
                  </TouchableWithoutFeedback>
                ) : null}
                {
                  <View
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Ionicons
                        name={dropdownVisible ? 'ios-arrow-up' : 'ios-chevron-down'}
                        size={16}
                        color="#828282"
                      />
                    </View>
                  </View>
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Modal visible={visible} transparent={true}>
            <View style={styles.container}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ visible: false });
                }}>
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>
              <View style={styles.content}>
                <View style={styles.topModal}>
                  <Text numberOfLines={1} style={styles.txtTitleModal}>
                    {title}
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  style={{ flex: 1 }}>
                  <FlatList
                    numColumns={colum}
                    data={converData}
                    keyExtractor={(item, index) => index}
                    contentContainerStyle={{
                      flex: 1,
                      alignContent: 'center',
                      alignItems: 'center',
                      paddingBottom: 20,
                    }}
                    renderItem={({ item, index }) => {
                      return selectItem && selectItem.name === item.name && selectItem.id === item.id ? (
                        <TouchableWithoutFeedback onPress={() => this.selectItem({ item, index })}>
                          <View style={{
                            marginHorizontal: 15,
                            width: (widthItem && `${widthItem}%`) || '100%',
                            marginTop: 25,
                            alignItems: 'center',
                          }}>
                            <Text style={styles.txtActive}>{item.name}</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      ) : (
                          <TouchableWithoutFeedback onPress={() => this.selectItem({ item, index })}>
                            <View style={{
                              marginHorizontal: 15,
                              width: (widthItem && `${widthItem}%`) || '100%',
                              marginTop: 25,
                              alignItems: 'center',
                            }}>
                              <Text style={styles.txtItem}>{item.name}</Text>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                    }}
                  />
                </ScrollView>
              </View>
            </View>
            <SafeAreaView />
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFF',
    height: 220,
    borderRadius: 5,
    position: 'absolute',
    width: width,
    right: 0,
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#000',
    marginBottom: 3,
  },
  txtTitleModal: {
    color: '#2D9CDB',
    fontSize: RFFonsize(18),
    fontFamily: 'Nunito-Bold',
  },
  topModal: {
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomColor: '#C4C4C4',
  },
  txtSelectItem: {
    color: '#000',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18),
    fontFamily: 'Nunito',
    marginLeft: 10,
  },
  txtActive: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#2D9CDB',
    textAlign: 'center',
  },
  txtItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#828282',
    textAlign: 'center',
  },
  btnModal: {
    backgroundColor: '#FFF',
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderStyle: 'solid'
  },
  txtPlaceIn: {
    fontFamily: "Nunito",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    paddingLeft: 10,
    color: "#c4c4c4"
  }
});
