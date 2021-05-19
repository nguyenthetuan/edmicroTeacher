import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
  Dimensions,
  Platform,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import ItemMission from './ItemMission';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiMission';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RFFonsize } from '../../../utils/Fonts';
import HeaderMissionNew from '../../common-new/HeaderMissionNew';
import ShimerMission from './ShimerMission';
import { SearchBar } from 'react-native-elements';
const { width, height } = Dimensions.get('window');
const { Value, timing } = Animated;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class MissionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionY: new Animated.Value(0),
      listMission: this.props.listMission,
      listMissionSearch: this.props.listMission,
      isAccessMission: false,
      onSearchClear: '',
      textSearch: '',
    }
    this._scroll_y = new Value(0)
    this.token = null;
  }


  static getDerivedStateFromProps(props, state) {
    if (props.listMission != state.listMission) {
      return {
        listMission: props.listMission,
        listMissionSearch: props.listMission,
      };
    }
  }

  componentDidMount() {
    this.getToken();
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    try {
      this.refFlatlist.scrollToIndex({ animated: true, index: 0 });
    } catch (error) {

    }
  }

  _keyboardDidHide() {
  }


  async getToken() {
    const { token } = await dataHelper.getToken();
    const res = await Api.checkPermission(token);
    const { isAccessMission } = res;
    this.setState({ isAccessMission })
    this.props.getListMission({ token });
    this.props.getCommonSubjectMission({ token });
  }

  goToSetupMission = () => {
    this.props.navigation.navigate('MissionStepByStep');
  };

  onSearchClear = () => {
    this.setState({ textSearch: '' });
    if (this.textSearch) {
      clearTimeout(this.textSearch);
      this.textSearch = null;
    }
    this.textSearch = setTimeout(this.handleSearch, 500);
  }

  handleSearch = () => {
    const { textSearch } = this.state;
    let { listMission, listMissionSearch } = this.state;
    listMissionSearch = listMission.filter(item =>
      item.title.includes(textSearch),
    );
    this.setState({ listMissionSearch });
  };

  onChangeText = e => {
    const textSearch = e?.nativeEvent?.text;
    this.setState({ textSearch });
    if (this.timeSearch) {
      clearTimeout(this.timeSearch);
      this.timeSearch = null;
    }
    this.timeSearch = setTimeout(this.handleSearch, 500);
  }

  renderItem = ({ item }) => {
    return <ItemMission data={item} {...this.props} token={this.token} />;
  };

  renderHeader = () => {
    const {
      textSearch
    } = this.state;
    const { isLoadingMission } = this.props;
    return (
      <View style={{ width: '100%' }}>
        {isLoadingMission ?
          null
          :
          <SearchBar
            placeholder="Tìm kiếm"
            value={textSearch}
            placeholderTextColor="#828282" 
            onChange={this.onChangeText}
            onClear={this.onSearchClear}
            onCancel={this.onSearchClear}
            containerStyle={{
              backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
            inputContainerStyle={{ backgroundColor: '#F6F6F6', borderColor: '#F6F6F6', borderRadius: 15, marginHorizontal: 5 }}
          // customCancelTextStyle={styles.txtCan}
          />
        }
      </View>
    );
  };

  _listTestEmpty = () => {
    const { isLoadingMission } = this.props;
    return (isLoadingMission ?
      <ActivityIndicator
        size={'small'}
        style={{ height: height / 1.5 }}
        color="#F98E2F"
      />
      :
      <View style={styles.styWrapEmpty}>
        <Text style={styles.styTxtEmpty}>Hiện tại không có nhiệm vụ nào</Text>
      </View>
    );
  };

  changePosition = event => {
    const { positionY } = this.state;
    const { height } = event.nativeEvent.contentSize;
    const { y } = event.nativeEvent.contentOffset;
    if (y > height / 2 || y < 0) {
      return;
    }
    positionY.setValue(y);
  };

  render() {
    const { user, isLoadingMission } = this.props;
    const {
      positionY,
      listMissionSearch,
    } = this.state;
    const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 150);
    const _header_opacity = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.5],
      extrapolate: 'clamp'
    })
    let translateY = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 150],
      outputRange: [0, -150],
      extrapolate: 'clamp',
    });

    return (
      <>
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
          <HeaderMissionNew
            navigation={this.props.navigation}
          />
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <Animated.View
              style={[
                styles.header,
                {
                  transform: [{ translateY: translateY }],
                }
              ]}
            >
              <Animated.View style={{
                opacity: _header_opacity
              }}>
                {this.renderHeader()}
              </Animated.View>
            </Animated.View>
            {
              isLoadingMission ?
                <View style={styles.scroll_view}>
                  <ShimerMission />
                </View>
                :
                <AnimatedFlatList
                  ref={(fl) => this.refFlatlist = fl}
                  data={listMissionSearch}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderItem}
                  initialNumToRender={3}
                  bounces={false}
                  scrollEventThrottle={1}
                  ListEmptyComponent={this._listTestEmpty}
                  ListFooterComponent={<View style={{ height: 70 }} />}
                  showsVerticalScrollIndicator={true}
                  onScroll={Animated.event([
                    {
                      nativeEvent: { contentOffset: { y: this._scroll_y } }
                    }
                  ],
                    { useNativeDriver: true }
                  )}
                  style={styles.scroll_view}
                />
            }
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  styWrapEmpty: {
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styTxtEmpty: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    color: '#999',
  },
  header: {
    height: 60,
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    zIndex: 1
  },
  scroll_view: {
    flex: 1,
    paddingTop: 50,
  },
  txtCan: {
    fontFamily: 'Nunito',
    fontSize: RFFonsize(16),
    lineHeight: RFFonsize(20)
  },
  textSear: {
    paddingRight: 35,
    fontFamily: 'Nunito',
    fontSize: RFFonsize(16),
    lineHeight: RFFonsize(20)
  }
});
