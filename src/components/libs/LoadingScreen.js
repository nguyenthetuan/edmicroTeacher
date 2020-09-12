import React, { Component } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';

const BG_DEFAULT = 'white';
const COLOR_DEFAULT = '#9C9C9C';

export default class LoadingScreen extends Component {

  shouldComponentUpdate = (prevProps) => {
    if (this.props.isLoading != prevProps.isLoading) {
      return true;
    }
    return false;
  }

  render() {
    const { isLoading, bgColor } = this.props;
    return (
      <View
        style={[isLoading ? styles.container2 : styles.none,
        { backgroundColor: bgColor || BG_DEFAULT }, this.props.style,
        ]}
      >
        {this.props.isLoading &&
          <ActivityIndicator color={'white'} size={35} color={this.props.color || COLOR_DEFAULT} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  container2: {
    position: 'absolute',
    justifyContent: 'center',
    top: Platform.OS == 'ios' ? 80 : 60,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
  },
  none: {
    display: 'none',
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -2,
  }
});
