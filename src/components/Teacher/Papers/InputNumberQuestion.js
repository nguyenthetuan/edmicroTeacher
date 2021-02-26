import React, { Component } from 'react';
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window')

export default class InputNumberQuestion extends Component {
  state = {
    total: 0
  }

  componentDidMount() {
    const { totalQuestionTN } = this.props;
    this.setState({ total: totalQuestionTN })
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.totalQuestionTN !== this.props.totalQuestionTN) {
      this.setState({
        total: this.props.totalQuestionTN
      })
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate() {
  }

  onChangeText = (text) => {
    this.setState({
      total: text
    })
  }

  increase = () => {
    const { onChange } = this.props;
    const { total } = this.state;
    if (total < 100) {
      this.setState({
        total: total + 1
      }, () => onChange(total + 1))
    }
  }

  decrease = () => {
    const { onChange } = this.props;
    const { total } = this.state;
    if (total < 100 && total > 0) {
      this.setState({
        total: total - 1
      }, () => onChange(total - 1))
    }
  }

  onEndEditing = () => {
    const { total } = this.state;
    const { onChange } = this.props;
    let totalTmp = parseInt(total);
    if (Number.isNaN(totalTmp)) {
      totalTmp = 0;
    } else if (total > 100) {
      totalTmp = 100;
    }

    onChange(totalTmp);
  }

  render() {
    const { containerStyle, title } = this.props;
    const { total } = this.state;
    return (
      <View style={containerStyle}>
        <Text style={{
          fontFamily: 'Nunito-Bold',
          fontSize: RFFonsize(12),
          color: '#fff',
          borderRadius: 1
        }}>{title}</Text>
        <View
          style={{
            width: width / 3,
            height: 24,
            backgroundColor: '#fff',
            borderRadius: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <TouchableOpacity
            onPress={this.decrease}
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#AAE5F9',
              borderRadius: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Image source={AppIcon.icon_minus} />
          </TouchableOpacity>
          <TextInput
            value={`${total}`}
            style={{
              flex: 1,
              fontFamily: 'Nunito',
              fontSize: RFFonsize(14),
              fontWeight: '700',
              textAlign: 'center',
              paddingVertical: 0
            }}
            keyboardType={'number-pad'}
            onChangeText={this.onChangeText}
            onEndEditing={this.onEndEditing}
            returnKeyType={'done'}
          // editable={false}
          />
          <TouchableOpacity
            onPress={this.increase}
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#AAE5F9',
              borderRadius: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Image source={AppIcon.icon_plus} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
