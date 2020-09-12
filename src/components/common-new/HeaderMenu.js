import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RippleButton from '../common-new/RippleButton';
import AppIcon from '../../utils/AppIcon';
import { getAvatarSource } from '../../utils/Common';
import dataHelper from '../../utils/dataHelper';
import { connect } from 'react-redux';
class HeaderMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AvatarSource: '',
    };
  }
  onBuyPackage = () => {
    this.props.navigation.navigate('PayUpgrade', { statusbar: 'light-content' });
  };

  getAvatar() {
    //to do code
    dataHelper
      .getAvatar()
      .then((path) => {
        this.setState(
          {
            AvatarSource: `${path}`,
          },
          () => console.log('avataMenuTab', this.state.AvatarSource),
        );
      })
      .catch((err) => console.log(err));
  }

  ChangePassword = () =>
    this.props.navigation.navigate('ChangePassword', {
      statusbar: 'light-content',
    });

  componentDidMount = () => {
    this.getAvatar();
  };

  render() {
    const { gradeId, PhoneNumber, userName, displayName } = this.props;
    const { AvatarSource } = this.state;
    return (
      <View style={styles.wrapUser}>
        <View style={styles.wrapInfo}>
          {AvatarSource != '' &&
            AvatarSource != null &&
            AvatarSource != '/img/no-avatar.png' ? (
              <Image
                style={styles.avatar}
                source={{ uri: getAvatarSource(AvatarSource) }}
              />
            ) : (
              <View style={styles.avatar}>
                <Image
                  style={styles.avatarDefault}
                  source={AppIcon.avatar_default}
                  resizeMode="contain"
                />
              </View>
            )}
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{ color: '#FFF', fontSize: 11, fontFamily: 'Nunito-Bold' }}>
              {displayName}
            </Text>
            {PhoneNumber && PhoneNumber.length >= 10 ? (
              <View>
                <Text style={styles.txtInfo}>{PhoneNumber}</Text>
              </View>
            ) : null}
            <Text style={styles.txtInfo} numberOfLines={1}>
              {userName}
            </Text>
          </View>
        </View>
        <View
          style={[styles.changeClass]}
        >
          <RippleButton
            onPress={this.ChangePassword}
          >
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                color: '#FFF',
                fontSize: 12,
              }}>
              Đổi mật khẩu
          </Text>
          </RippleButton>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    avatarSource: state.user.AvatarSource,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenu);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  wrapUser: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    height: 100,
    backgroundColor: '#3A608C',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  avatar: {
    borderColor: '#fff',
    borderRadius: 100,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAcount: {
    flexDirection: 'row',
  },
  textUsername: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    fontFamily: 'Nunito-Bold',
  },

  changeClass: {
    backgroundColor: '#4776AD',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
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
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#C4C4C4',
    marginTop: 2,
  },
});
