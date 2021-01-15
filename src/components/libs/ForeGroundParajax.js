import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default class ForeGroundParajax extends Component {
  render() {
    return (
      <View style={styles.pcontainer}>
        <View style={styles.avatar}>
          <Image source={this.props.icon} style={styles.icon_test} />
        </View>
        <Text style={styles.title}>{this.props.title}</Text>
        <View style={styles.viewInfo}>
          <Text style={styles.textHello}>{this.props.hello}</Text>
          <Text style={styles.titleInfo}>{this.props.name}</Text>
          <Text style={styles.textDescription}>{this.props.desc}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pcontainer: {
    height: 200,
    justifyContent: 'center'
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 5,
    width: 55,
    height: 55,
    borderRadius: (55) / 2,
    backgroundColor: 'rgba(141, 206, 234, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon_test: {
    width: 40,
    height: 40,
  },
  title: {
    alignSelf: 'center',
    color: 'white',
    fontSize: RFFonsize(16),
    fontFamily: 'Nunito-Bold',
    paddingVertical: 5,
  },
  viewInfo: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  titleInfo: {
    alignSelf: 'center',
    fontFamily: 'Nunito-Bold',
    color: 'white',
    fontSize: RFFonsize(13),
    paddingHorizontal: 3
  },
  textHello: {
    color: 'white',
    alignSelf: 'center',
    fontSize: RFFonsize(12)
  },
  textDescription: {
    color: 'white',
    alignSelf: 'center',
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
  }
});