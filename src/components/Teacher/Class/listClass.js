import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Text,
  RefreshControl,
} from 'react-native';
import ItemCLass from './itemClass';
import FastImage from 'react-native-fast-image';

export default class listClass extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = ({item, index}) => {
    return (
      <ItemCLass item={item} index={index} navigation={this.props.navigation} />
    );
  };

  _renderHeader = () => {
    return (
      <View>
        <View style={{alignItems: 'center'}}>
          <FastImage
            style={styles.imageHome}
            source={require('../../../asserts/icon/imageHome.png')}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={styles.txtTitle}>danh sách lớp học</Text>
        </View>
      </View>
    );
  };

  render() {
    const {data, isRefresh, onRefresh} = this.props;
    return (
      <FlatList
        data={data}
        initialNumToRender={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItem}
        removeClippedSubviews={false}
        ListEmptyComponent={() => (
          <View style={styles.viewNotFound}>
            <Image source={require('../../../asserts/icon/iconNodata.png')} />
            <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
          </View>
        )}
        ListHeaderComponent={() => this._renderHeader()}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            tintColor={'#333'}
            enabled={true}
            onRefresh={onRefresh}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    position: 'relative',
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
  viewNotFound: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNotFound: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#000',
    marginTop: 20,
    color: '#828282',
  },
  imageHome: {
    width: 200,
    height: (200 * 156) / 276,
  },
});
