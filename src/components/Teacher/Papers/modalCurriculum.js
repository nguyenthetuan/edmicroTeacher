import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Animated,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { isIphoneX } from 'react-native-iphone-x-helper';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import HighlightText from '@sanar/react-native-highlight-text';
import _ from 'lodash';
import { removeAccents } from '../../../utils/Common';

const { width, height } = Dimensions.get('window');
let heightTextInput = 0,
  heightContent = 0;
const KEY_TO_FILTERS = ['name'];
export default class ModalCurriculum extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      visible: false,
      dropdownVisible: false,
      selectItem: props.value || {},
      indexItem: '',
      searchKey: '',
      data: data || [],
      dataFilter: [],
      isKeyBoard: false,
      searched: false,
      dataDefault: data || [],
      currentParent: [],
    };
    this.positionY = new Animated.Value(-40);
    this.arrayHistoryFilter = [];
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
    this.handleHome();
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
    this.setState({ isKeyBoard: true });
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.positionY, {
      duration: event.duration,
      toValue: -40,
    }).start();
  };

  selectItem = ({ item, index }) => {
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
    if (!_.isEqual(this.props.data, nextProps.data)) {
      if (!_.isEmpty(nextProps.data)) {
        this.handleHome(nextProps.data);
      }
    }
    return true;
  }

  searchExactly = ({ data, item }) => {
    const dataFilter = this.props.data.filter(ele => ele.parentCode == item.code);
    const { currentParent } = this.state;
    currentParent.push(item.parentCode);
    this.setState({ dataFilter, currentParent, searchKey: '' });
  };

  backBtn = () => {
    let { currentParent } = this.state;
    let parentCode = currentParent.pop();
    if (_.isEmpty(parentCode)) {
      this.setState({ currentParent });
      return;
    }
    const dataFilter = this.props.data.filter(ele => ele.parentCode == parentCode);
    this.setState({ dataFilter, currentParent });
  }

  deleteItem = () => {
    this.setState(
      {
        selectItem: { name: '', code: '' },
      },
      () => this.props.onPress(this.state.selectItem),
    );
  };

  _closeModal = () => {
    const { isKeyBoard } = this.state;
    if (isKeyBoard) {
      this.setState({ isKeyBoard: false });
      Keyboard.dismiss();
      return;
    }
    this.setState({ visible: false });
  };

  renderListEmptyComponent = () => {
    return (
      <View style={styles.wrapEmpty}>
        <Text style={styles.txtEmpty}>Không có dữ liệu hiển thị</Text>
      </View>
    );
  };

  handleHome = (data) => {
    try {
      let arr = [];
      if (_.isEmpty(data)) {
        arr = this.props.data.filter(item => item.parentCode == this.props.curriculumCode);
      } else {
        arr = data.filter(item => item.parentCode == this.props.curriculumCode);
      }
      this.setState({
        dataFilter: arr,
        searchKey: '',
        currentParent: []
      });
    } catch (error) {
      this.setState({
        dataFilter: [],
        searchKey: '',
        currentParent: []
      });
    }
  }

  handleSearchText = (searchKey) => {
    if (_.isEmpty(searchKey.trim())) {
      const arr = this.props.data.filter(item => item.parentCode == this.props.curriculumCode);
      this.setState({ dataFilter: arr, searchKey });
      return;
    }
    const arr = this.props.data.filter(item => removeAccents(item.name).toUpperCase().includes(removeAccents(searchKey).toUpperCase()));
    this.setState({ dataFilter: arr, searchKey });
  }

  renderItem = ({ item, index }) => {
    let name = '';
    if (item.name) {
      name = item.name;
    } else {
      if (item.content?.indexOf('<p>') >= 0) {
        name = item.content?.slice(3, item.content.length - 4);
      }
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => this.selectItem({ item, index })}
        hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
      >
        <View style={styles.wrapElement}>
          {/* <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text> */}
          <HighlightText
            highlightStyle={{ backgroundColor: 'yellow' }}
            searchWords={[this.state.searchKey]}
            textToHighlight={item.name}
            sanitize={removeAccents}
          />
          <View style={{ flexDirection: 'row' }}>
            {/* <TouchableOpacity
              onPress={() => this.selectItem({ item, index })}
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            >
              <IconAntDesign name={'search1'} size={20} color="#BDBDBD" />
            </TouchableOpacity> */}
            {!item.isLeaf && (
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => !item.isLeaf && this.searchExactly({ item })}
                hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
              >
                <IconAntDesign name={'login'} size={20} color="#BDBDBD" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    let {
      visible,
      dropdownVisible,
      selectItem,
      searchKey,
      data,
      dataFilter,
      currentParent
    } = this.state;
    const {
      title,
      value,
      styleTitle,
      borderStyle,
    } = this.props;
    selectItem = _.isEmpty(value) ? selectItem : value;
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => this.setState({ visible: true })}>
          <View style={{ flex: 1 }} >
            <Text style={[styles.txtTitle, styleTitle]}>{title}</Text>
            <View style={[styles.wrapModal, borderStyle]}>
              {!_.isEmpty(selectItem) && selectItem.name ? (
                <View style={styles.wrapElementSelect}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={() => this.deleteItem()}>
                    <Text style={styles.txtSelectItem} numberOfLines={1}>
                      {selectItem.name}
                    </Text>
                    <Image source={AppIcon.close_img} style={styles.clickClose} />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.txtPlaceIn}>Đơn vị kiến thức</Text>
              )}
              <View style={styles.icDow}>
                <Ionicons
                  name={dropdownVisible ? 'ios-arrow-up' : 'ios-chevron-down'}
                  size={18}
                  color="#828282"
                />
              </View>

            </View>

            <Modal visible={visible} transparent={true}>
              <TouchableWithoutFeedback
                style={[styles.container, { height: this.props.height }]}
                onPress={() => this._closeModal()}
              >
                <View style={styles.container}>
                  <TouchableWithoutFeedback >
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#2D9CDB',
                      paddingHorizontal: 16,
                      height: 80,
                      alignContent: 'flex-end',
                      paddingBottom: 10
                    }}>
                      <TouchableOpacity
                        style={{ alignSelf: 'flex-end', marginBottom: 3 }}
                        onPress={() => {
                          this.setState({
                            visible: false,
                            searchKey: '',
                          })
                        }
                        }>
                        <Image
                          style={{ tintColor: '#fff' }}
                          source={require('../../../asserts/icon/icon_arrowLeftv3.png')}
                        />
                      </TouchableOpacity>
                      <View style={{ flexDirection: 'row', overflow: 'hidden', alignSelf: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity
                          style={{ marginRight: 10 }}
                          onPress={() => this.backBtn({ data })}
                          disabled={_.isEmpty(currentParent)}
                        >
                          <AntDesign name='arrowleft' size={22} style={{ color: _.isEmpty(currentParent) ? '#ffffff40' : '#fff' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleHome} >
                          <Image
                            source={require('../../../asserts/icon/iconHome.png')}
                            style={{ height: 20, width: 20, tintColor: '#fff', marginRight: 10 }}
                            resizeMode='contain'
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.TextInput}
                          onChangeText={this.handleSearchText}
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
                          }}>
                          <EvilIcons name="search" size={20} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.content}>
                    <FlatList
                      data={dataFilter}
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
              <SafeAreaView />
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFF',
    borderRadius: 5,
    width: width,
    flex: 1,
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#000',
    marginBottom: 3
  },
  topheader: {
    backgroundColor: '#2D9CDB',
    flexDirection: 'row',
    padding: 30,
    justifyContent: 'space-between',
    paddingLeft: 23,
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
    fontSize: RFFonsize(10),
    paddingRight: 24,
    color: '#FFF',
    paddingVertical: 5,
    fontFamily: 'Nunito-Regular',
    alignContent: 'flex-end'
  },
  name: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#000',
    width: '80%',
  },
  txtSelectItem: {
    color: '#000',
    fontSize: RFFonsize(11),
    fontFamily: 'Nunito-Regular',
    marginLeft: 5,
    marginTop: 3,
    marginBottom: 3
  },
  icDow: {
    width: 25,
    height: 25,
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
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    height: 40
  },
  wrapElementSelect: {
    maxWidth: '50%',
    borderWidth: 0.5,
    borderColor: '#333',
    marginLeft: 5,
    borderRadius: 3
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
    alignItems: 'center',
    paddingLeft: 23,
    paddingVertical: 10,
    paddingRight: 10,
  },
  clickClose: {
    width: 12,
    height: 12,
    marginRight: -5,
    marginTop: -5
  },
  txtPlaceIn: {
    fontFamily: "Nunito",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    paddingLeft: 10,
    color: "#c4c4c4"
  }
});
