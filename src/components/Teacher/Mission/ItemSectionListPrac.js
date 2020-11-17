import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';

export default class ItemSectionListPrac extends Component {

  state = {
    score: '7',
    count: 1
  }

  changeTextScore = (score) => {
    score = parseFloat(score) || '';
    if (score < 0 || score > 10) {
      Alert.alert('Thông báo', 'Điểm nhập nằm trong khoảng 0 đến 10', [
        {
          text: 'Đặt lại',
          onPress: () => {
            this.setState({ score: '7' });
          }
        }
      ]);
      return;
    }
    const { item } = this.props;
    item.markDone = score;
    this.setState({ score });
  }

  changeTextCount = count => {
    count = parseInt(count) || '';
    if (count < 0) {
      Alert.alert('Thông báo', 'Số lần làm bài phải lớn hơn 0', [
        {
          text: 'Đặt lại',
          onPress: () => {
            this.setState({ count: '1' });
          }
        }
      ]);
      return;
    }
    const { item } = this.props;
    item.countDone = count;
    this.setState({ count });
  }

  onEndEditing = () => {
    const { score, count } = this.state;
    if (score == '' || score == 0) {
      this.setState({ score: 7 });
    }
    if (count == '' || count == 0) {
      this.setState({ count: 1 });
    }
  }

  render() {
    const { item, isTest } = this.props;
    const { score, count } = this.state;
    return (
      <View style={styles.styWrapElement}>
        <Text style={styles.styName} numberOfLines={2}>
          {item.name || item.testName}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {isTest && <TextInput
            ref={ref => this.refScore = ref}
            placeholder={'0'}
            value={item.markDone || score}
            defaultValue={`${item.markDone || score}`}
            style={styles.styInput}
            keyboardType={'number-pad'}
            onChangeText={this.changeTextScore}
            onEndEditing={this.onEndEditing}
          />}
          <TextInput
            ref={ref => this.refCount = ref}
            placeholder={'0'}
            value={item.countDone || count}
            defaultValue={`${item.countDone || count}`}
            style={styles.styInput}
            keyboardType={'number-pad'}
            onChangeText={this.changeTextCount}
            onEndEditing={this.onEndEditing}
          />
          <TouchableOpacity
            style={styles.styWrapIcon}
            onPress={this.props.onPress}
          >
            <IconFeather name={'delete'} style={styles.styIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styWrapElement: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  styInput: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    // paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    borderColor: '#999',
    color: '#000',
    width: 25,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  styName: {
    fontFamily: 'Nunito-Regular',
    flex: 1,
  },
  styIcon: {
    fontSize: 20,
    color: '#FF4457',
  },
  styWrapIcon: {
    alignSelf: 'center',
  },
});
