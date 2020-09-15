import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Platform,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
import {isIphoneX} from 'react-native-iphone-x-helper';
import _ from 'lodash';
const {width, height} = Dimensions.get('window');
let heightTextInput = 0,
  heightContent = 0;
const KEY_TO_FILTERS = ['name'];
export default class ModalCurriculum extends Component {
  constructor(props) {
    super(props);
    const {data} = this.props;
    this.state = {
      visible: false,
      dropdownVisible: false,
      selectItem: props.value || {},
      indexItem: '',
      searchKey: '',
      data: data || [],
      isKeyBoard: false,
    };
    this.positionY = new Animated.Value(-40);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.positionY, {
      duration: event.duration - 200,
      toValue: isIphoneX() ? -160 : -80,
    }).start();
    this.setState({isKeyBoard: true});
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.positionY, {
      duration: event.duration,
      toValue: -40,
    }).start();
  };

  selectItem = ({item, index}) => {
    this.setState(
      {
        selectItem: item,
        indexItem: index,
        visible: false,
      },
      () => this.props.onPress(item),
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        selectItem: {name: '', code: ''},
        data: nextProps.data,
      });
    }
    return true;
  }

  searchExactly = ({data, item}) => {
    let reslult = [];
    _.map(data, (element) => {
      if (element.parentCode === item.code) {
        reslult.push(element);
      }
    });
    this.setState({
      searchKey: '',
      data: reslult,
    });
  };

  deleteItem = () => {
    this.setState(
      {
        selectItem: {name: '', code: ''},
      },
      () => this.props.onPress(this.state.selectItem),
    );
  };

  _closeModal = () => {
    const {isKeyBoard} = this.state;
    if (isKeyBoard) {
      this.setState({isKeyBoard: false});
      Keyboard.dismiss();
      return;
    }
    this.setState({visible: false});
  };

  renderListEmptyComponent = () => {
    return (
      <View style={styles.wrapEmpty}>
        <Text style={styles.txtEmpty}>Không có dữ liệu hiển thị</Text>
      </View>
    );
  };

  renderItem = ({item, index}) => {
    const {data} = this.state;
    let name = '';
    if (item.name) {
      name = item.name;
    } else {
      if (item.content?.indexOf('<p>') >= 0) {
        name = item.content?.slice(3, item.content.length - 4);
      }
    }
    return (
      <TouchableOpacity
        style={styles.wrapElement}
        onPress={() => this.selectItem({item, index})}
        onLongPress={() => !item.isLeaf && this.searchExactly({data, item})}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.selectItem({item, index})}>
            <EvilIcons name="search" size={20} color="#BDBDBD" />
          </TouchableOpacity>
          {!item.isLeaf && (
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPress={() => this.searchExactly({data, item})}>
              <Image
                source={require('../../../asserts/appIcon/icSearch.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {visible, dropdownVisible, selectItem, searchKey, data} = this.state;
    const {title, widthItem, colum, value} = this.props;
    let fliter = data.filter(createFilter(searchKey, KEY_TO_FILTERS));
    console.log('fliter', fliter);
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.txtTitle}>{title}</Text>
          <View style={styles.wrapModal}>
            {!_.isEmpty(selectItem) && selectItem.name ? (
              <View style={styles.wrapElementSelect}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.deleteItem()}>
                  <Text style={styles.txtSelectItem} numberOfLines={1}>
                    {selectItem.name}
                  </Text>
                  <Text style={{color: '#757575', fontSize: 10}}>x</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
            <TouchableOpacity onPress={() => this.setState({visible: true})}>
              <View style={styles.icDow}>
                <Ionicons
                  name={dropdownVisible ? 'ios-arrow-up' : 'ios-chevron-down'}
                  size={16}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>

          <Modal visible={visible} transparent={true}>
            <TouchableWithoutFeedback onPress={this._closeModal}>
              <View style={[styles.container, {height: this.props.height}]}>
                <View style={styles.content}>
                  <Animated.View
                    style={[styles.topheader, {top: this.positionY}]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          data: this.props.data,
                          searchKey: '',
                        })
                      }>
                      <MaterialCommunityIcons
                        name="arrow-left"
                        color="#FFF"
                        size={20}
                      />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', overflow: 'hidden'}}>
                      <TextInput
                        style={styles.TextInput}
                        onChangeText={(Text) =>
                          this.setState({searchKey: Text})
                        }
                        value={searchKey}
                        onLayout={(e) =>
                          (heightTextInput = e.nativeEvent.layout.height)
                        }
                      />
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          right: 4,
                          top: 4,
                          height: 18,
                          width: 24,
                          backgroundColor: '#2D9CDB',
                        }}>
                        <EvilIcons name="search" size={20} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                  <FlatList
                    data={fliter}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    onLayout={(e) =>
                      (heightContent = e.nativeEvent.layout.height)
                    }
                  />
                </View>
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
  topheader: {
    backgroundColor: '#2D9CDB',
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'space-between',
    paddingLeft: 23,
    position: 'absolute',
    width,
    top: 0 - 40,
    height: 40,
  },
  TextInput: {
    height: 24,
    borderColor: '#FFF',
    borderWidth: 0.5,
    width: width * 0.5,
    borderRadius: 4,
    paddingLeft: 5,
    fontSize: 10,
    paddingRight: 24,
    color: '#FFF',
    paddingVertical: 5,
    fontFamily: 'Nunito-Regular',
  },
  name: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#000',
    width: '80%',
  },
  txtSelectItem: {
    color: '#828282',
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    marginLeft: 5,
  },
  icDow: {
    width: 24,
    height: 24,
    backgroundColor: '#AAE5F9',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapModal: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  wrapElementSelect: {
    maxWidth: '50%',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    marginLeft: 3,
  },
  wrapEmpty: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  txtEmpty: {
    fontFamily: 'Nunito-Regular',
  },
  wrapElement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 23,
    paddingVertical: 10,
    paddingRight: 10,
  },
});
