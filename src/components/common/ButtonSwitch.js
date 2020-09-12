import React, {Component} from 'react';
import {TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
export default class ButtonSwitch extends Component {
  render() {
    const {isCheck, onPress, stylebtnOnOff, styleCircle} = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={[
            styles.btnOnOff,
            {backgroundColor: !isCheck ? '#FFF' : '#63DF17'},
            stylebtnOnOff,
          ]}>
          <View
            style={[
              styles.circle,
              {
                left: !isCheck ? 0 : null,
                right: !isCheck ? null : 0,
                shadowOffset: {width: !isCheck ? 2 : -2, height: 0},
              },
              styleCircle,
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  btnOnOff: {
    width: 40,
    height: 22,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#E0E0E0',
    backgroundColor: '#999',
    position: 'relative',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(201, 201, 201, 1)',
    backgroundColor: '#fff',
    position: 'absolute',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowRadius: 1,
    shadowOpacity: 1,
    alignSelf: 'center',
    elevation:10,
    shadowOffset: {
      width: 10,
      height: 12,
    },
  },
});
