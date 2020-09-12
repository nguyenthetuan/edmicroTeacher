import React, {Component} from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import RippleButton from '../common-new/RippleButton';

export default class HeaderMain extends Component {
  openDrawer = () => {
    requestAnimationFrame(() => {
      this.props.openDrawer();
    });
  };

  goToQuestion = () => {
    this.props.navigation.navigate('quesstionScreen', {
      statusbar: 'light-content',
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <RippleButton onPress={this.openDrawer}>
          <View style={styles.button}>
            <Image source={require('../../asserts/icon/menu.png')} />
          </View>
        </RippleButton>
        <View style={{flex: 1, marginLeft: 10}}>
          <Image source={require('../../asserts/icon/logo_onluyen.png')} />
        </View>
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
    marginRight: 10,
  },
  button: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
