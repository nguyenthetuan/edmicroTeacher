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
} from 'react-native';
import HeaderMain from '../../common-new/HeaderMain';
import AppIcon from '../../../utils/AppIcon';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import ItemMission from './ItemMission';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiMission';
const { width, height } = Dimensions.get('window');
export default class MissionScreen extends Component {
  state = {
    positionY: new Animated.Value(0),
    listMission: this.props.listMission,
    listMissionSearch: this.props.listMission,
    isAccessMission: false
  };
  token = null;

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
    this.token = token;
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
    const positionYDiff = Animated.diffClamp(positionY, 0, 150);
    const posY = positionYDiff.interpolate({
      inputRange: [0, 150],
      outputRange: [0, -150],
    });
    return (
      <View style={styles.contain}>
        <SafeAreaView style={{ backgroundColor: '#fff' }} />
        <View style={{ backgroundColor: '#fff' }}>
          <HeaderMain
            {...user}
            navigation={this.props.navigation} />
        </View>
        {/* <Animated.Image
          source={AppIcon.pic_mission}
          resizeMode={'contain'}
          style={{
            alignSelf: 'center',
            zIndex: -1,
            transform: [{ translateY: posY }],
          }}
        /> */}
        {/* <Animated.View style={{ transform: [{ translateY: posY }] }}> */}
        <FlatList
          data={listMissionSearch}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          initialNumToRender={6}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={<View style={{ height: 20 }} />}
          ListEmptyComponent={this.renderEmpty}
          // stickyHeaderIndices={[0]}
          // onScroll={this.changePosition}
          // scrollEventThrottle={16}
          // keyboardDismissMode={'on-drag'}
          showsVerticalScrollIndicator={false}
        // windowSize={21}
        />
        {/* </Animated.View> */}
      </View>
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
    padding: 10,
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
    flexDirection: 'row',
    backgroundColor: '#FFF'
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
  }
});
