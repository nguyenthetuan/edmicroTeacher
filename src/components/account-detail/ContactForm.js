import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Linking,
  Platform,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIon from 'react-native-vector-icons/Ionicons';
import Color from '../../constants/colors';
import {
  descriptionContactForm,
  descriptionContactForm1,
  numberPhone
} from '../../constants/appConst';
import { RFFonsize } from '../../utils/Fonts';
const { width, height } = Dimensions.get('window');

export default class SettingContact extends Component {

  handleClick = () => this.props.closeModal()
  handleClickPhoneNumber = (phone) => () => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log('err', err));
  }
  render() {
    return (
      <Modal
        visible={this.props.modalVisible}
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        animationInTiming={300}
        animationOutTiming={300}
        transparent={true}
      >
        <View style={s.container}>
          <View style={s.modalContent}>
            <View style={s.viewHeader} />
            <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={this.handleClick}>
              <View style={s.btnClose}>
                <IconIon name={'md-close-circle'} size={20} color={'#fff'} />
              </View>
            </TouchableWithoutFeedback>
            <Text style={s.txtLienhe}>LIÊN HỆ</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{descriptionContactForm}</Text>
            <Text style={s.text}>{descriptionContactForm1}</Text>
            <TouchableWithoutFeedback
              onPress={this.handleClickPhoneNumber('0969602660')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name={'phone'} size={15} color={'#03B3F2'} />
                <Text style={{ color: '#03B3F2', fontSize: 18, marginLeft: 5, textDecorationLine: 'underline' }}>{numberPhone}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={s.viewOpacity} />
      </Modal>
    );
  }
}


const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  text: {
    marginBottom: 5,
    color: '#B7B8BA',
    textAlign: 'center'
  },
  vButton: {
    flexDirection: 'row'
  },
  bt: {
    padding: 10,
    borderRadius: 10,
    width: 200,
    backgroundColor: Color.bg_bt_ok,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewOpacity: {
    backgroundColor: '#333',
    width,
    height,
    position: 'absolute',
    zIndex: -1,
    opacity: .5
  },
  viewHeader: {
    borderRadius: 8,
    position: 'absolute',
    height: 80,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Color.modal_header
  },
  btnClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'transparent'
  },
  txtLienhe: {
    fontSize: RFFonsize(16),
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 20,
    height: 80,
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});
