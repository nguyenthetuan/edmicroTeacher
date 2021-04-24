import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFFonsize } from '../../../utils/Fonts';

export default class ItemSectionListPrac extends Component {

  state = {
    score: '7',
    count: 1,
    percentCount: 100
  }

  changeTextScore = (score) => {
    score = parseFloat(score) || '';
    const { item } = this.props;
    if (score < 0 || score > 10) {
      Alert.alert('Thông báo', 'Điểm nhập nằm trong khoảng 0 đến 10', [
        {
          text: 'Đặt lại',
          onPress: () => {
            item.markDone = '7';
            this.setState({ score: '7' });
          }
        }
      ]);
      return;
    }
    item.markDone = score;
    this.setState({ score });
  }

  changeTextCount = percentCount => {
    percentCount = parseInt(percentCount) || '';
    const { item } = this.props;
    if (percentCount < 0) {
      Alert.alert('Thông báo', 'Số lần làm bài phải lớn hơn 0', [
        {
          text: 'Đặt lại',
          onPress: () => {
            item.countDone = '100';
            item.percentCount = '100',
              this.setState({ percentCount: '100' });
          }
        }
      ]);
      return;
    }
    if (percentCount > 100) {
      Alert.alert('Thông báo', 'Số lần làm bài phải nhỏ hơn 100', [
        {
          text: 'Đặt lại',
          onPress: () => {
            item.countDone = '100';
            item.percentCount = '100',
              this.setState({ percentCount: '100' });
          }
        }
      ]);
      return;
    }
    item.percentCount = percentCount;
    this.setState({ percentCount });
  }

  onEndEditing = () => {
    const { score, percentCount } = this.state;
    if (score == '' || score == 0) {
      this.setState({ score: 7 });
    }
    if (percentCount == '' || percentCount == 0) {
      this.setState({ percentCount: 100 });
    }
  }

  handlePlusCount = () => {
    let { percentCount } = this.state;
    const { item } = this.props;
    percentCount = parseInt(percentCount);
    if (percentCount === 100) {
      return;
    }
    percentCount++;
    item.percentCount = percentCount;
    this.setState({ percentCount });
  }

  handleSubCount = () => {
    let { percentCount } = this.state;
    const { item } = this.props;
    percentCount = parseInt(percentCount);
    percentCount--;
    if (percentCount < 1) {
      return;
    }
    item.percentCount = percentCount;
    this.setState({ percentCount });
  }
  confirmRemove = () => {
    const { item } = this.props;
    Alert.alert(
      '',
      'Bạn có muốn xoá nhiệm vụ' + " " + (item.name || item.testName) + "?",
      [
        {
          text: 'Huỷ',
          onPress: () => { },
          style: 'Huỷ',
        },
        {
          text: 'Xoá',
          onPress: () => { this.props.onPress() }
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    const { item, isTest } = this.props;
    const { score, percentCount } = this.state;
    return (
      <View style={styles.styWrapElement}>
        <Text style={styles.styName} numberOfLines={2}>
          {item.name || item.testName}
        </Text>
        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
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
          {!isTest && <View style={styles.viewCount}>
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={this.handleSubCount}
            >
              <View style={styles.iconLeft} >
                <Icon
                  name={'minus'}
                  size={8}
                  color={Platform.OS == 'android' ? '#FFF' : '#828282'}
                />
              </View>
            </TouchableWithoutFeedback>
            <TextInput
              ref={ref => this.refCount = ref}
              placeholder={'0'}
              value={item.percentCount || percentCount}
              defaultValue={`${item.percentCount || percentCount}`}
              style={styles.styInput}
              keyboardType={'number-pad'}
              onChangeText={this.changeTextCount}
              onEndEditing={this.onEndEditing}
            />
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={this.handlePlusCount}
            >
              <View style={styles.iconRight}>
                <Icon
                  name={'plus'}
                  size={8}
                  color={Platform.OS == 'android' ? '#FFF' : '#828282'}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>}
          <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            onPress={this.confirmRemove}
          >
            <View style={styles.styWrapIcon}>
              <IconFeather name={'delete'} style={styles.styIcon} />
            </View>
          </TouchableWithoutFeedback>
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
    // borderColor: "#828282",
    // borderWidth:0.5,
    // borderBottomLeftRadius:8,
    // borderBottomRightRadius:8,
  },
  styInput: {
    alignSelf: 'flex-end',
    paddingVertical: 3,
    borderRadius: 3,
    color: '#fff',
    width: 30,
    fontSize: RFFonsize(12),
    textAlign: 'center',
    marginHorizontal: 25,
    backgroundColor: '#6ED8FB',
    alignSelf: 'center'
  },
  styName: {
    fontFamily: 'Nunito-Regular',
    color: '#828282',
    flex: 1,
  },
  styIcon: {
    fontSize: RFFonsize(22),
    color: '#FF4457',
    marginLeft: 8,
    marginRight: -6,
  },
  styWrapIcon: {
    alignSelf: 'center',
    marginLeft: 10
  },
  viewCount: {
    flexDirection: 'row',
    backgroundColor: '#DFF7FF',
    borderRadius: 4
  },
  iconLeft: {
    alignSelf: 'center',
    paddingHorizontal: 3,
    marginLeft: 7,
  },
  iconRight: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    marginRight: 7
  }
});
