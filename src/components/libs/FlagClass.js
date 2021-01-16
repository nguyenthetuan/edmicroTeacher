import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Color from '../../constants/colors';
import RippleButton from '../libs/RippleButton';
import { RFFonsize } from '../../utils/Fonts';

const top = isIphoneX() ? 32 : Platform.OS == 'ios' ? 22 : 10;

export default class FlagClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    }
  }

  // onRefresh() {
  //   this.setState({ disabled: true }, () => {
  //     this.props.onRefresh();
  //   });
  //   setTimeout(() => {
  //     this.setState({ disabled: false });
  //   }, 1000);
  // }

  onPress(type){
    this.setState({ disabled: true }, () => {
      if(type == 1) this.props.onRefresh();
      else this.props.gotoChangeClass();
    });
    setTimeout(() => {
      this.setState({ disabled: false });
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <RippleButton disabled={this.state.disabled} color={'white'} radius={250} size={500} onPress={() => this.onPress(1)} style={styles.backFixHeader}>
          <Icon name={'refresh'} size={20} color={Color.colorIconHeader} />
        </RippleButton>
        <RippleButton disabled={this.state.disabled} color={'white'} radius={250} size={500} onPress={() => this.onPress(2)} style={styles.backFixHeader}>
          <Icon name={'flag'} size={24} color={Color.colorIconHeader} />
          <Text style={styles.textFlag}>{this.props.gradeId}</Text>
        </RippleButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    top: top,
    right: 10,
  },
  textFlag: {
    position: 'absolute',
    color: Color.bgMainGrad2,
    fontWeight: 'bold',
    left: 12,
    top: 12,
    fontSize: RFFonsize(10)
  },
  backFixHeader: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
