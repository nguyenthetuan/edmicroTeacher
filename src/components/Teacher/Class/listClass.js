import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import ItemCLass from './itemClass';

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
          <Image
            style={styles.imageHome}
            source={require('../../../asserts/icon/imageHome.png')}
            resizeMode="contain"
          />
          <Text style={styles.txtTitle}>danh sách lớp học</Text>
        </View>
      </View>
    );
  };

  render() {
    const {data} = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItem}
        removeClippedSubviews={false}
        ListEmptyComponent={() => (
          <View style={styles.viewNotFound}>
            <Image source={require('../../..//asserts/icon/iconNodata.png')}/>
            <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
          </View>
        )}
        ListHeaderComponent={() => this._renderHeader()}
        style={styles.container}
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
    color:'#828282'
  },
});
