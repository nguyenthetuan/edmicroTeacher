import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { getSourceAvatar } from '../../utils/Helper';
import Avatar from './Avatar';
import { RFFonsize } from '../../utils/Fonts';
const { height } = Dimensions.get('window');

class HeaderMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      AvatarSource: '',
    };
  }

  ChangePassword = () => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate('ChangePassword', {
      statusbar: 'light-content',
    });
  }

  render() {
    const {
      phoneNumber,
      userName,
      displayName,
      userId,
      timeCached,
      userGift
    } = this.props;
    const source = getSourceAvatar(userId, timeCached);
    return (
      <ImageBackground source={require('../../asserts/images/banner_drawerMenu.png')}
        style={styles.wrapUser}
        resizeMode="stretch"
      >
        <View style={styles.wrapInfo}>
          <View style={styles.borderAva}>
            <Avatar
              source={source}
              size={50}
            />
          </View>
          {/* {source ? (
            <Image
              style={styles.avatar}
              source={source}
            />
          ) : (
              <View style={styles.avatar}>
                <Image
                  style={styles.avatarDefault}
                  source={AppIcon.avatar_default}
                  resizeMode="contain"
                />
              </View>
            )} */}
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{ color: '#FFF', fontSize: RFFonsize(14), fontFamily: 'Nunito-Bold' }}>
              {displayName}
            </Text>
            {phoneNumber && phoneNumber.length >= 10 ? (
              <View>
                <Text style={styles.txtInfo}>{phoneNumber}</Text>
              </View>
            ) : null}
            <Text style={styles.txtInfo} numberOfLines={1}>
              {userName}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          {
            userGift?.totalEDPoint
              ?
              <View style={styles.styWrapEDPoint}>
                <Image
                  source={require('../../asserts/appIcon/icon_point_gift.png')}
                  resizeMode={'contain'}
                  style={{ width: 25, height: 25 }}
                />
                <Text
                  style={styles.styTxtEDPoint}
                >
                  {
                    userGift?.totalEDPoint > 1000
                      ?
                      parseFloat(userGift?.totalEDPoint / 1000) + 'k'
                      :
                      userGift?.totalEDPoint}
                </Text>
              </View>
              : null
          }
        </View>

        <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          onPress={this.ChangePassword}
        >
          <View style={styles.changeClass}>
            <Text
              style={styles.txtChange}>
              Đổi mật khẩu
          </Text>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
}

export default HeaderMenu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  wrapUser: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    height: height * 0.22,
    // backgroundColor: '#3A608C',
    alignItems: 'center',
  },
  avatar: {
    borderColor: '#fff',
    borderRadius: 100,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAcount: {
    flexDirection: 'row',
  },
  textUsername: {
    flex: 1,
    fontSize: RFFonsize(14),
    color: '#000000',
    lineHeight: RFFonsize(20),
    fontFamily: 'Nunito-Bold',
  },
  changeClass: {
    backgroundColor: '#ffff',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    right: 15
  },
  wrapChangeClass: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDefault: {
    width: 30.75,
    height: 32,
  },
  wrapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 20,
  },
  txtInfo: {
    fontSize: RFFonsize(11),
    fontFamily: 'Nunito',
    color: '#fff',
    marginTop: 2,
  },
  styTxtEDPoint: {
    color: '#FFF',
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Bold',
    marginHorizontal: 5
  },
  styWrapEDPoint: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtChange: {
    fontFamily: 'Nunito-Regular',
    color: '#FF6213',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    paddingHorizontal: 5,
  },
  borderAva: {
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderRadius: 50
  }
});
