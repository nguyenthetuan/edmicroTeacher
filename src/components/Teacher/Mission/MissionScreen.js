import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import HeaderMain from '../../common-new/HeaderMain';
import AppIcon from '../../../utils/AppIcon';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import ItemMission from './ItemMission';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiMission';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RFFonsize } from '../../../utils/Fonts';
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

  handleSearch = keyWord => {
    let { listMission, listMissionSearch } = this.state;
    listMissionSearch = listMission.filter(item =>
      item.title.includes(keyWord),
    );
    this.setState({ listMissionSearch });
  };

  renderItem = ({ item }) => {
    return <ItemMission data={item} {...this.props} token={this.token} />;
  };

  renderHeader = () => {
    const { isAccessMission } = this.state;
    return (
      <View style={styles.styWrapHeader}>
        <View style={styles.styWrapSearch}>
          <TextInput
            placeholder={'Tìm kiếm'}
            placeholderTextColor={'#757575'}
            style={styles.styTxtInput}
            onChangeText={this.handleSearch}
          />
          <IconAntDesign
            name={'search1'}
            style={styles.iconSearch}
          />
        </View>
        {isAccessMission && <TouchableOpacity
          style={styles.styWrapBtn}
          onPress={this.goToSetupMission}>
          <Text style={styles.styTxtBtn}>Thêm nhiệm vụ</Text>
        </TouchableOpacity>}
      </View>
    );
  };

  renderEmpty = () => (
    <View style={styles.styWrapEmpty}>
      <Text style={styles.styTxtEmpty}>Hiện tại không có nhiệm vụ nào</Text>
    </View>
  );

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
    const { user } = this.props;
    const {
      positionY,
      listMissionSearch
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
              <HeaderMain
                {...user}
                navigation={this.props.navigation}
              />
              {this.renderHeader()}
            </Animated.View>
          </Animated.View>
          {/* <View style={{ backgroundColor: '#fff' }}>
          <HeaderMain
            {...user}
            navigation={this.props.navigation} />
        </View> */}
          <AnimatedFlatList
            data={listMissionSearch}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            initialNumToRender={6}
            bounces={false}
            scrollEventThrottle={1}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={<View style={{ height: 120 }} />}
            ListEmptyComponent={this.renderEmpty}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([
              {
                nativeEvent: { contentOffset: { y: this._scroll_y } }
              }
            ],
              { useNativeDriver: true }
            )}
            style={[
              styles.scroll_view,
              {
              }
            ]}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  styWrapSearch: {
    borderWidth: 1,
    borderColor: '#DADADA',
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginTop: 10,
    height: 36,
    borderRadius: 3,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  styTxtInput: {
    color: '#757575',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    lineHeight: 16,
    alignSelf: 'center',
    flex: 1,
    padding: 8
  },
  styWrapBtn: {
    backgroundColor: '#56BB73',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 36,
    borderRadius: 2,
    marginHorizontal: 5,
    marginTop: 10
  },
  styTxtBtn: {
    color: '#FFF',
    fontFamily: 'Nunito',
    fontSize: 12,
    lineHeight: 14,
    marginLeft: 10,
    marginRight: 10,
  },
  styWrapHeader: {
    height: 46,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 12
  },
  styWrapEmpty: {
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styTxtEmpty: {
    fontFamily: 'Nunito-Regular',
    color: '#999',
  },
  iconSearch: {
    marginRight: -5,
    alignSelf: 'center'
  },
  safe_area_view: {
    flex: 1,
  },
  header: {
    height: 100,
    position: 'absolute',
    right: 0,
    left: 0,
    top: isIphoneX() ? 40 : Platform.OS == 'ios' ? 20 : 0,
    zIndex: 1,
    backgroundColor: '#fff',
    zIndex: 1
  },
  scroll_view: {
    flex: 1,
    paddingTop: 100,
  },
});
