import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderDetail from '../../common-new/HeaderDetail';
import { getAvatarSource } from '../../../utils/Common';
import RippleButton from '../../common-new/RippleButton';
import Globals from '../../../utils/Globals';

const { width, height } = Dimensions.get('window');
export default class UpdatePlan extends Component {
  constructor(props) {
    super(props)
    const { title, value } = this.props.navigation.state.params;
    this.state = {
      avatar: '',
      value: value === 'Chưa được cập nhật' ? '' : value || '',
      isLoading: false,
    }
  }

  async componentDidMount() {
    const avatar = await dataHelper.getAvatar();
    this.setState({ avatar });
  }

  save = async (type) => {
    const { classId, index } = this.props.navigation.state.params;
    const { token } = await dataHelper.getToken();
    const { value } = this.state;
    const formData = {
      classId: classId,
      description: value,
      key: `${index}`
    }
    this.setState({ isLoading: true })
    const response = await Api.putPlan({ token, formData })
    if (response && response.status === 1) {
      this.setState({ isLoading: false }, () => {
        Globals.updatePlan();
        this.props.navigation.goBack()
      })
    }
  }

  onChange = (text) => {
    this.setState({
      value: text
    })
  }

  render() {
    const { avatar, value, isLoading } = this.state;
    const { navigation } = this.props;
    const { title, index, classId } = this.props.navigation.state.params;
    const imgAvatar = avatar
      ? { uri: getAvatarSource(avatar) }
      : require('../../../asserts/appIcon/background_game_play.png');
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
      >
        <View style={{ flex: 1 }}>
          <HeaderDetail
            navigation={navigation}
            source={imgAvatar}
            title={title}
          />
          <View style={[styles.body]}>
            <TextInput
              style={[styles.textInput]}
              multiline={true}
              placeholder='Nhập nội dung...'
              placeholderTextColor='#828282'
              value={value}
              onChangeText={text => this.onChange(text)}
              editable={!isLoading}
            />
            <RippleButton onPress={this.save}>
              <View style={[styles.btn, { alignSelf: 'center' }]}>
                <Text style={styles.txtBtn}>Cập nhật</Text>
              </View>
            </RippleButton>
          </View>
        </View>
        {isLoading && <ActivityIndicator size='small' color='#2D9CDB' style={styles.styActivity} />}
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3F3F9',
    flex: 1,
    justifyContent: 'center'
  },
  converBody: {
    backgroundColor: 'blue',
    flex: 1,
  },
  body: {
    paddingHorizontal: 16,
    marginTop: 26,
    justifyContent: 'center',
  },
  textInput: {
    height: 242,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingLeft: 15,
    paddingTop: 11,
    borderWidth: 1,
    borderColor: '#2D9CDB',
    textAlignVertical: 'top',
  },
  btn: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D9CDB',
    marginTop: 70,
    paddingVertical: 8,
    width: '50%',
    borderRadius: 4
  },
  txtBtn: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Regular'
  },
  styActivity: {
    position: 'absolute',
    width,
    height,
    backgroundColor: '#000',
    opacity: .5
  }
})