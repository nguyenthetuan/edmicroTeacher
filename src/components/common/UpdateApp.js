import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import * as AppIcon from '../../utils/AppIcon';
import { WINDOW } from '../../constants/const';
const { width, height } = WINDOW;
import { urlCHPlay, urlAppStore } from '../../constants/appConst';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { RFFonsize } from '../../utils/Fonts';
export default class UpdateApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      isCheckBox: false,
      messageAndroid: null,
      messageIOS: null,
      titleAndroid: null,
      titleIOS: null,
      isRequiredUpdate: false
    };
  }

  async componentDidMount() {
    try {
      const usersCollection = await firestore()
        .collection('version')
        .doc('versionAppOnluyen')
        .get();
      const {
        messageAndroid,
        messageIOS,
        titleAndroid,
        titleIOS,
      } = usersCollection?._data;
      this.setState({ messageAndroid, messageIOS, titleAndroid, titleIOS });
    } catch (error) { }
  }

  _handleClose = () => {
    this.setState({ isShow: false });
  };

  _handleShow = (version, isRequiredUpdate) => {
    this.setState({ isShow: true, version, isRequiredUpdate });
  };

  _handleCheckBox = () => {
    const { isCheckBox } = this.state;
    this.setState({ isCheckBox: !isCheckBox }, () => {
      if (!isCheckBox) {
        AsyncStorage.setItem('UpdateAppOnluyen', 'NoNeverShowUpdate');
      } else {
        AsyncStorage.removeItem('UpdateAppOnluyen');
      }
    });
  };

  _handleUpdateNow = () => {
    this._handleClose();
    if (Platform.OS == 'android') {
      Linking.canOpenURL(urlCHPlay)
        .then((supported) => {
          if (!supported) {
            Alert.alert(
              'Thông báo',
              'Cửa hàng CHPlay không thể truy cập. Bạn vui lòng thử lại!',
            );
          } else {
            return Linking.openURL(urlCHPlay);
          }
        })
        .catch((err) => console.log('err', err));
    } else {
      Linking.canOpenURL(urlAppStore)
        .then((supported) => {
          if (!supported) {
            Alert.alert(
              'Thông báo',
              'Cửa hàng Apple Store không thể truy cập. Bạn vui lòng thử lại!',
            );
          } else {
            return Linking.openURL(urlAppStore);
          }
        })
        .catch((err) => console.log('err', err));
    }
  };

  render() {
    const {
      isShow,
      isCheckBox,
      version,
      messageAndroid,
      messageIOS,
      titleAndroid,
      titleIOS,
      isRequiredUpdate
    } = this.state;
    return (
      <Modal transparent={true} animationType={'fade'} visible={isShow}>
        <View style={styles.container}>
          <View style={styles.containerView}>
            {!isRequiredUpdate ? <TouchableOpacity
              style={styles.btnClose}
              onPress={this._handleClose}>
              <Image source={AppIcon.icon_close_modal} />
            </TouchableOpacity> : null}
            <Text style={styles.txtTitle}>
              {Platform.OS == 'ios' ? titleIOS : titleAndroid}
            </Text>
            <ImageBackground
              source={require('../../asserts/images/background_updateapp.png')}
              style={styles.ImageBackground}
              resizeMode={'contain'}>
              <Image source={AppIcon.icon_app} resizeMode={'contain'} />
              <Text style={styles.txtVersion}>
                {Platform.OS == 'ios' ? messageIOS : messageAndroid}
              </Text>
            </ImageBackground>
            <View style={styles.wrapViewBtn}>
              <TouchableOpacity style={styles.wrapBtn}>
                <Text style={styles.txtBtn} onPress={this._handleUpdateNow}>
                  Cập nhật ngay
                </Text>
              </TouchableOpacity>
              {!isRequiredUpdate ? <TouchableOpacity
                style={[styles.wrapBtn, { backgroundColor: '#5096BD' }]}
                onPress={this._handleClose}>
                <Text style={styles.txtBtn}>Lúc khác</Text>
              </TouchableOpacity> : null}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerView: {
    width: width - 20,
    minHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
  },
  txtTitle: {
    color: '#FF6213',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(20),
    marginVertical: 20,
  },
  btnClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  txtVersion: {
    fontSize: RFFonsize(14),
    fontStyle: 'italic',
    color: '#828282',
    marginHorizontal: 40,
    position: 'absolute',
    bottom: 10,
  },
  wrapBtn: {
    borderRadius: 8,
    width: 120,
    height: 30,
    backgroundColor: '#FF6213',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtn: {
    color: '#FFF',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(16),
  },
  wrapViewBtn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width - 40,
    marginVertical: 10,
  },
  checkBox: {
    width: 15,
    height: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    marginHorizontal: 5,
  },
  wrapCheckBox: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  txtCheckBox: {
    // fontFamily: 'Nunito-Regular',
    color: '#828282',
    fontStyle: 'italic',
  },
  ImageBackground: {
    width: width - 40,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
