import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';
export default class HeaderPaper extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onGoback = () => {
    requestAnimationFrame(() => {
      const { goBack } = this.props;
      if (goBack) {
        this.props.goBack();
      } else {
        this.props.navigation.goBack();
      }
    });
  };

  navigateUser = () => {
    this.props.navigation.navigate('ChangInfo', {
      statusbar: 'light-content',
    });
  }

  render() {
    const {
      onRightAction,
      title,
      color,
      backgroundColor,
      loading,
      buttonRightText,
      notRightButton,
      iconColor,
      marginLeft
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <RippleButton
          onPress={this.onGoback}
          style={styles.button}
        >
          <Image
            source={AppIcon.icon_arrowLeftv3}
            style={{ tintColor: iconColor || '#fff', alignSelf: 'center' }}
          />
        </RippleButton>
        <View style={styles.viewTitle}>
          <Text numberOfLines={1}
            style={[styles.textTitleHeader, {
              color: color || '#383838',
            }]}>{title}</Text>
        </View>
        {!notRightButton
          ?
          <TouchableOpacity
            onPress={onRightAction}
            style={styles.octiconSetting}>
            <Image source={AppIcon.icon_octiconSettingsV3} />
          </TouchableOpacity>
          :
          <View style={{ width: 10 }} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  viewTitle: {
    // alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  button: {
    alignSelf: 'center'
  },
  textTitleHeader: {
    marginLeft: 15,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    fontSize: RFFonsize(16),
  },
  btnAvatar: {
    height: 38,
    width: 38,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
  },
  rightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#F49A31',
    borderRadius: 5,
    marginEnd: 5,
  },
  txtRightHeader: {
    paddingHorizontal: 13,
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
    color: '#FFF',
  },
  octiconSetting: {
    paddingRight: 5,
  },
  btnLeft: {
    color: '#fff'
  }
});
