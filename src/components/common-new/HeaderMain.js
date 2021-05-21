import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import RippleButton from '../common-new/RippleButton';
import { getSourceAvatar } from '../../utils/Helper';
import Avatar from '../common-new/Avatar';
import { RFFonsize } from '../../utils/Fonts';

export default class HeaderMain extends React.Component {
  constructor(props) {
    super(props);
  }

  openDrawer = () => {
    requestAnimationFrame(() => {
      this.props.navigation.toggleDrawer();
    });
  };

  navigateUser = () => {
    this.props.navigation.navigate('ChangInfo', {
      statusbar: 'light-content',
    });
  }

  render() {
    const { userId, timeCached } = this.props;
    const source = getSourceAvatar(userId, timeCached);
    return (
      <View style={styles.container}>
        <RippleButton
          hitSlop={{ top: 5, right: 5, left: 5, bottom: 5 }}
          onPress={this.openDrawer}>
          <View style={styles.button}>
            <Image
              source={require('../../asserts/icon/menu.png')}
              style={{ tintColor: '#383838' }}
              tintColor={'#383838'}
            />
          </View>
        </RippleButton>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Image source={require('../../asserts/appIcon/logo_TearcherTxt.png')} />
        </View>
        <View style={{
          backgroundColor: '#DB3546',
          paddingHorizontal: 10,
          paddingVertical: 2,
          borderRadius: 5,
          marginRight: 5
        }}>
          <Text style={{
            color: '#fff',
            fontFamily: 'Nunito',
            fontSize: RFFonsize(14)
          }}>Beta</Text>
        </View>
        <TouchableWithoutFeedback
          hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onPress={this.navigateUser}>
          <View style={styles.btnAvatar}>
            <Avatar
              source={source}
              size={25}
            />
          </View>
        </TouchableWithoutFeedback>
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
});
