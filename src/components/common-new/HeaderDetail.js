import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RippleButton from '../libs/RippleButton';
import { HEIGHT_TOPBAR, } from '../../utils/Common';
import { getSourceAvatar } from '../../utils/Helper';
import { RFFonsize } from '../../utils/Fonts';
export default class HeaderDetail extends Component {
  constructor(props) {
    super(props);
  }

  goBack = () => {
    const { onPress } = this.props;
    if (typeof (onPress) == 'function') {
      onPress();
      return;
    }
    this.props.navigation.goBack();
  };

  goToChangInfo = () => {
    const { onPress } = this.props;
    if (typeof (onPress) == 'function') {
      return;
    }
    this.props.navigation.navigate('ChangInfo', { statusbar: 'light-content' });
  };


  render() {
    const {  title = '', userId } = this.props;
    const source = getSourceAvatar(userId);

    return (
      <View style={styles.contain}>
        <RippleButton
          rippleContainerBorderRadius={90}
          rippleColor={'#999'}
          style={{ paddingHorizontal: 1 }}
          rippleDuration={250}
          onPress={this.goBack}>
          <Icon name="arrow-left" color="#000" size={25} />
        </RippleButton>
        <Text style={styles.txtHeader}>{title}</Text>
        <RippleButton
          rippleContainerBorderRadius={50}
          style={styles.stylAvatar}
          onPress={this.goToChangInfo}>
          <Image
            source={source}
            resizeMode={'contain'}
            style={styles.stylAvatar}
          />
        </RippleButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapHeader: {},
  contain: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: HEIGHT_TOPBAR + 10,
  },
  txtHeader: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(18),
  },
  stylAvatar: {
    width: 25,
    height: 25,
    borderRadius: 15,
    overflow: 'hidden'
  },
});
