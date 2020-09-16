import React, {Component} from 'react';
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
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
const {width, height} = Dimensions.get('window');

export default class ModalConfigLibrary extends Component {
  constructor(props) {
    super(props);
    const {value} = this.props;
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
        selectItem: {name: '', code: ''},
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

  selectItem = ({item, index}) => {
    const {indexItem} = this.state;
    if (index == indexItem) {
      return;
    }
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
        selectItem: {name: '', code: ''},
      },
      () => this.props.onPress(this.state.selectItem),
    );
  };

  render() {
    const {visible, dropdownVisible, selectItem, indexItem, value} = this.state;
    const {title, data, widthItem, colum, activeButtom} = this.props;
    const converData =
      data && (data.length % 2 !== 0 ? [...data, {name: ''}] : data);
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.txtTitle}>{title}</Text>
          <TouchableOpacity 
          style={styles.btnModal}
          onPress={() => this.setState({visible: true})}
          >
            {(!_.isEmpty(selectItem) && selectItem.name) ||
            (!_.isEmpty(value) && value.name) ? (
              <Text style={styles.txtSelectItem} numberOfLines={1}>
                {selectItem.name || value.name}
              </Text>
            ) : (
              <View />
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {activeButtom && !_.isEmpty(selectItem) && selectItem.name ? (
                <TouchableOpacity onPress={() => this.deleteItem()}>
                  <Text
                    style={{fontSize: 12, color: '#757575', marginRight: 5}}>
                    x
                  </Text>
                </TouchableOpacity>
              ) : null}
              {
                <View
                  >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#AAE5F9',
                      borderRadius: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Ionicons
                      name={dropdownVisible ? 'ios-arrow-up' : 'ios-chevron-down'}
                      size={16}
                      color="#fff"
                    />
                  </View>
                </View>
              }
            </View>
          </TouchableOpacity>
          
          <Modal visible={visible} transparent={true}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({visible: false});
              }}>
              <View style={styles.container}>
                <TouchableWithoutFeedback>
                  <View style={styles.content}>
                    <View style={styles.topModal}>
                      <Text numberOfLines={1} style={styles.txtTitleModal}>
                        {title}
                      </Text>
                    </View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={{flex: 1}}>
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
                        renderItem={({item, index}) => {
                          return selectItem && selectItem.name === item.name ? (
                            <TouchableOpacity
                              onPress={() => this.selectItem({item, index})}
                              style={{
                                marginHorizontal: 15,
                                width: (widthItem && `${widthItem}%`) || '100%',
                                marginTop: 25,
                                alignItems: 'center',
                              }}>
                              <Text style={styles.txtActive}>{item.name}</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => this.selectItem({item, index})}
                              style={{
                                marginHorizontal: 15,
                                width: (widthItem && `${widthItem}%`) || '100%',
                                marginTop: 25,
                                alignItems: 'center',
                              }}>
                              <Text style={styles.txtItem}>{item.name}</Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
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
    fontSize: 12,
    color: '#FFF',
  },
  txtTitleModal: {
    color: '#2D9CDB',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  topModal: {
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomColor: '#C4C4C4',
  },
  txtSelectItem: {
    color: '#828282',
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    marginLeft: 5,
    // width: '50%'
  },
  txtActive: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#2D9CDB',
    textAlign: 'center',
  },
  txtItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#828282',
    textAlign: 'center',
  },
  btnModal: {
    backgroundColor: '#FFF',
    height: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
