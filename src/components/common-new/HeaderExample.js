import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import RippleButton from '../common-new/RippleButton';
import {getSourceAvatar} from '../../utils/Helper';
import Global from '../../utils/Globals';
import { RFFonsize } from '../../utils/Fonts';
export default class HeaderExample extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  openDrawer = () => {
    requestAnimationFrame(() => {
      if (typeof Global.updateMenuQuestion == 'function') {
        Global.updateMenuQuestion();
      }
      this.props.navigation.toggleDrawer();
    });
  };

  render() {
    const {onActionPress} = this.props;
    return (
      <View style={styles.container}>
        <RippleButton onPress={this.openDrawer}>
          <View style={styles.button}>
            <Image
              source={require('../../asserts/icon/menu.png')}
              style={{tintColor: '#383838'}}
              tintColor={'#383838'}
            />
          </View>
        </RippleButton>
        <View style={{flex: 1, marginLeft: 10}} />
        <TouchableOpacity
          onPress={onActionPress}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            resizeMode="contain"
            source={require('../../asserts/appIcon/submit.png')}
          />
          <Text style={styles.txtSubmit}>Nộp bài</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 12,
    borderBottomWidth: 0.5,
    borderColor: '#828282',
  },
  button: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    marginLeft: 10,
  },
  imgAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
  },
  txtSubmit: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#2D9CDB',
    marginLeft: 6,
  },
});
