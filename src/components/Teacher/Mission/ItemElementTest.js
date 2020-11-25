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

const { height } = Dimensions.get('window');

export default class ItemElement extends Component {
  handleAdd = item => () => {
    const { isAdd } = this.state;
    this.setState({ isAdd: !isAdd });
    item.id = this.props.id;
    this.props.handleAdd(item);
  };

  handleDele = item => () => {
    const { isAdd } = this.state;
    this.setState({ isAdd: !isAdd });
    this.props.handleDele(item);
  };

  renderItem = ({ item }) => {
    return <Item item={item} {...this.props} />;
  };

  render() {
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItem}
        style={{ height: height / 3 }}
        nestedScrollEnabled={true}
      />
    );
  }
}

class Item extends Component {
  state = {
    isAdd: true,
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
          <Text style={styles.styTxtName}
            numberOfLines={1}>
            {item.testName}
          </Text>
        </View>
        {isAdd ? (
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
    );
  }
}

const styles = StyleSheet.create({
  styWrapBtnAdd: {
    borderRadius: 5,
    backgroundColor: '#56BB73',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styTxtBtnAdd: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    marginHorizontal: 5,
    fontSize: 9,
    marginVertical: 8,
  },
  styTxtName: {
    color: '#007bff',
    fontFamily: 'Nunito-Bold',
    flex: 1,
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 8,
    marginBottom: 8
  },
  styTxtCate: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    fontStyle: 'italic',
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
  styWrapBtnDele: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#FF4457',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colobg: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 5,
    borderColor: '#BDBDBD',
    borderWidth: 0.5,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  }
});
