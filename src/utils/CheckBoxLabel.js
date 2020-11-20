import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default class CheckBox extends Component {
  render() {
    const {Label, isCheck} = this.props;
    return (
      <TouchableOpacity
        style={styles.contain}
        onPress={this.props.changeCheckBox(Label)}>
        <View style={[styles.styWrapCheck]}>
          {isCheck ? <View style={styles.styCheckBox} /> : <View />}
        </View>
        <Text style={styles.styTxtLabel}>{Label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  styCheckBox: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#62ACE1',
  },
  styWrapCheck: {
    width: 15,
    height: 15,
    padding: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderColor: '#999',
  },
  styTxtLabel: {
    fontFamily: 'Nunito-Regular',
    marginHorizontal: 5,
  },
});
