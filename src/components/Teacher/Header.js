import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import HeaderMain from '../common-new/HeaderMain';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import AppIcon from '../../utils/AppIcon';
import {HEIGHT_TOPBAR, getAvatarSource} from '../../utils/Common';
export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  openDrawer = () => {
    this.props.navigation.toggleDrawer();
  };

  render() {
    const {avatarSource} = this.props;
    const imgAvatar = !!avatarSource
    ? {uri: getAvatarSource(avatarSource)}
    : AppIcon.avatar_default;
    return (
      <View style={styles.container}>
        <HeaderMain openDrawer={this.openDrawer} />
        <View style={styles.content}>
          {/* {__DEV__ && (
            <Animatable.Image
              iterationCount="infinite"
              animation="swing"
              source={require('../../asserts/icon/notification.png')}
              resizeMode="contain"
            />
          )} */}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ChangInfo', {
                statusbar: 'light-content',
              });
            }}
            style={styles.btnAvatar}>
            <Image
              resizeMode="cover"
              source={imgAvatar}
              style={styles.imgAvatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: HEIGHT_TOPBAR,
    backgroundColor: '#fff',
    zIndex: 99,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingRight: 10,
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
