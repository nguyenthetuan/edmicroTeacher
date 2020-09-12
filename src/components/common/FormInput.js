import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Image, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FormInput extends Component {
  render() {
    const { keyboardType, placeholder, name, value, isShowPassword = false, actionIcon, borderWidth, borderRadius, height, paddingTopContent, inputHeight, editable = true, borderColor, bgColor,width,style,maxLength } = this.props;
    return (
      <View style={[styles.formVertical, borderWidth && { borderWidth, borderBottomWidth: borderWidth }, borderRadius && { borderRadius }, height && { height }, borderColor && { borderColor }, bgColor && { backgroundColor: bgColor },width&&{width:width},style&&style]
      }>
        {
          this.props.label &&
          <Text style={[styles.labelFormHightlight, this.props.styleLabel]}>{this.props.label}</Text>
        }
        < View style={[styles.rowForm, paddingTopContent && { paddingTop: paddingTopContent }]} >
          <View style={styles.wrapFormIcon}>
            {this.props.type && this.props.type == 'image' ?
              <Image source={this.props.icon} style={styles.iconImage} />
              :
              <Icon name={name} size={17} color={'#828282'} style={styles.iconInput} />
            }
            {
              this.props.codeCountry && <Text>84</Text>
            }
          </View>
          <View style={[{ flex: 1, height: 30, textAlign: 'center', alignSelf: 'center' }, inputHeight]}>
            <TextInput
              {...this.props.iii}
              secureTextEntry={this.props.secureTextEntry || false}
              onChangeText={(text) => this.props.onChangeText(text)}
              keyboardType={keyboardType || 'default'}
              placeholder={placeholder || ''}
              value={value}
              onSubmitEditing={this.props.onSubmitEditing || null}
              placeholderTextColor={'#BDBDBD'}
              style={[styles.formTextInput, this.props.styleInput]}
              autoCorrect={false}
              autoCompleteType='off'
              editable={editable}
              autoCapitalize={"none"}
              maxLength={maxLength}
            // returnKeyType={'done'}
            />
          </View>
        </View >
        {isShowPassword &&
          <TouchableOpacity
            onPress={() => this.props.showPassword()}
            style={styles.buttonHide}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image source={actionIcon} style={{ tintColor: this.props.isSecureTextEntry ? "#E0E0E0" : '#444', alignSelf: 'center', width: 20, height: 25 }} resizeMode={'contain'} />
              {/* <Text style={{ fontFamily: 'Nunito-Regular', marginLeft: 5, color: this.props.isSecureTextEntry ? "#E0E0E0" : '#444', alignSelf: 'center', }}>Hiện</Text> */}
            </View>
          </TouchableOpacity>
        }
      </View >
    )
  }
}

const styles = StyleSheet.create({
  buttonHide: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  formVertical: {
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#C4C4C4',
  },
  labelFormHightlight: {
    color: '#828282',
  },
  labelFormDark: {
    color: '#828282',
  },
  rowForm: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapFormIcon: {
    justifyContent: 'flex-end',
  },
  iconImage: {
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  iconInput: {
    alignSelf: 'center',
    marginRight: 10,
    marginTop: Platform.OS == 'ios' ? -5 : 0
  },
  formTextInput: {
    // backgroundColor: 'red',
    flex: 1,
    color: '#000',
    fontFamily: 'Nunito-Regular',
    padding: 0,
    margin: 0,
    height: 30,
    paddingTop: Platform.OS == 'ios' ? 5 : 0,
    // paddingTop: 17,
  }
});

FormInput.propTypes = {
  keyboardType: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func,
  type: PropTypes.oneOf([
    'image', 'font'
  ]),
}