import React, {Component} from 'react';
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
const {height} = Dimensions.get('window');
export default class ItemElement extends Component {
  renderItem = ({item}) => {
    return <Item item={item} {...this.props} />;
  };

  render() {
    const {data} = this.props;
    return (
      <FlatList
        data={data.listProblem}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItem}
        style={{height: height / 3}}
        nestedScrollEnabled={true}
        extraData={data}
      />
      // data ? (
      //   data.listProblem.map((item, index) => (
      //     <View style={styles.styWrapItem} key={index}>
      //       <Text style={styles.styTxtName}>{item.name}</Text>
      //       <TouchableOpacity style={styles.styWrapBtnAdd}>
      //         <Icon name={'plus'} color={'#fff'} />
      //         <Text style={styles.styTxtBtnAdd}>Thêm</Text>
      //       </TouchableOpacity>
      //     </View>
      //   ))
      // ) : (
      //   <View />
      // )
    );
  }
}

class Item extends Component {
  state = {
    isAdd: false,
  };

  handleAdd = item => () => {
    const {isAdd} = this.state;
    this.setState({isAdd: !isAdd});
    this.props.handleAdd(item);
  };

  handleDele = item => () => {
    const {isAdd} = this.state;
    this.setState({isAdd: !isAdd});
    this.props.handleDele(item);
  };

  render() {
    const {item} = this.props;
    const {isAdd} = this.state;
    return (
      <View style={styles.styWrapItem}>
        <Text style={styles.styTxtName}>{item.name}</Text>
        {!isAdd ? (
          <TouchableOpacity
            style={styles.styWrapBtnAdd}
            onPress={this.handleAdd(item)}>
            <Icon name={'plus'} color={'#fff'} />
            <Text style={styles.styTxtBtnAdd}>Thêm</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.styWrapBtnDele}
            onPress={this.handleDele(item)}>
            <Icon name={'minus'} color={'#fff'} />
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
    backgroundColor: '#28a745',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styTxtBtnAdd: {
    color: '#FFF',
    fontFamily: 'Nunito-Regular',
    marginHorizontal: 5,
  },
  styTxtName: {
    color: '#007bff',
    fontFamily: 'Nunito-Bold',
    flex: 1,
  },
  styWrapItem: {
    borderWidth: 1,
    borderColor: '#efefef',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  styWrapBtnDele: {
    borderRadius: 5,
    backgroundColor: '#FF4457',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
