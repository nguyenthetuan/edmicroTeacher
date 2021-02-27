import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { RFFonsize } from '../../../utils/Fonts';
const { height } = Dimensions.get('window');
export default class ItemElement extends Component {
  renderItem = ({ item }) => {
    return <Item item={item} {...this.props} />;
  };

  render() {
    const { data } = this.props;
    return (
      <FlatList
        data={data.listProblem}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItem}
        style={{ height: height / 3 }}
        nestedScrollEnabled={true}
        extraData={data}
      />
    );
  }
}

class Item extends Component {
  state = {
    isAdd: false,
  };

  handleAdd = item => () => {
    const { isAdd } = this.state;
    this.setState({ isAdd: !isAdd });
    this.props.handleAdd(item);
  };

  handleDele = item => () => {
    const { isAdd } = this.state;
    this.setState({ isAdd: !isAdd });
    this.props.handleDele(item);
  };

  render() {
    const { item } = this.props;
    const { isAdd } = this.state;
    return (
      <View style={styles.styWrapItem}>
        <View style={styles.colobg}>
          <Text
            numberOfLines={1}
            style={styles.styTxtName}>{item.name}</Text>
        </View>
        <View style={styles.createAdd}>
          {!isAdd ? (
            <TouchableOpacity
              style={styles.styWrapBtnAdd}
              onPress={this.handleAdd(item)}>
              <Icon name={'plus'} color={'#fff'} size={8} />
              <Text style={styles.styTxtBtnAdd}>Thêm</Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                style={styles.styWrapBtnDele}
                onPress={this.handleDele(item)}>
                <Icon name={'minus'} color={'#fff'} size={8} />
                <Text style={styles.styTxtBtnAdd}>Hủy</Text>
              </TouchableOpacity>
            )}
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  styWrapBtnAdd: {
    borderRadius: 5,
    backgroundColor: '#56BB73',
    padding: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  styWrapBtnDele: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#FF4457',
    paddingTop: 7.1,
    paddingBottom: 7.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  styTxtBtnAdd: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    marginHorizontal: 5,
    fontSize: RFFonsize(9),
    marginVertical: 8,
  },
  styTxtName: {
    color: '#2D9CDB',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    fontFamily: 'Nunito-Bold',
    flex: 1,
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 8,
    marginBottom: 8
  },
  styWrapItem: {
    margin: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#56BB73',
    marginLeft: 30
  },
  createAdd: {
    width: '15%',
  },
  colobg: {
    backgroundColor: '#fff',
    padding: 5,
    borderColor: '#BDBDBD',
    borderWidth: 0.5,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    width: "85%"
  }
});
