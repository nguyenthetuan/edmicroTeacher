import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderDetail from '../../common-new/HeaderDetail';
import { getAvatarSource } from '../../../utils/Common';
import RippleButton from '../../common-new/RippleButton';
import Globals from '../../../utils/Globals';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import { RFFonsize } from '../../../utils/Fonts';
import AwesomeButton from 'react-native-really-awesome-button';
import shadowStyle from '../../../themes/shadowStyle';

const { width, height } = Dimensions.get('window');
export default class UpdatePlan extends Component {
  constructor(props) {
    super(props)
    const { title, value } = this.props.navigation.state.params;
    this.state = {
      value: value === 'Chưa được cập nhật' ? '' : value || '',
      isLoading: false,
    }
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
    const { shadowBtn } = shadowStyle;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        bounces={false}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderNavigation
            navigation={navigation}
            actionIcon={''}
            title={title}
            color={'#2D9CDB'}
          />
          <View style={[styles.body]}>
            <TextInput
              style={[styles.textInput, { ...shadowBtn }]}
              multiline={true}
              placeholder='Nhập nội dung...'
              placeholderTextColor='#828282'
              value={value}
              onChangeText={text => this.onChange(text)}
              editable={!isLoading}
            />
            {/* <RippleButton onPress={this.save}>
              <View style={[styles.btn, { alignSelf: 'center', ...shadowBtn }]}>
                <Text style={styles.txtBtn}>Cập nhật</Text>
              </View>
            </RippleButton> */}
            <AwesomeButton
              onPress={this.save}
              style={[styles.AweBtn]}
              height={43}
              backgroundColor={'#2D9CDB'}
              borderRadius={25}
              backgroundActive={'#2D9DFE'}
              backgroundShadow={'transparent'}
              backgroundDarker={'transparent'}
            >
              <Text style={styles.txtAssignment}>Cập nhật</Text>
            </AwesomeButton>
          </View>
        </SafeAreaView>
        {isLoading && <ActivityIndicator size='small' color='#2D9CDB' style={styles.styActivity} />}
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#E3F3F9',
    backgroundColor: '#fff',
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
    // borderWidth: 1,
    // borderColor: '#2D9CDB',
    textAlignVertical: 'top',

  },
  btn: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D9CDB',
    marginTop: 64,
    width: '50%',
    borderRadius: 25
  },
  txtBtn: {
    color: '#fff',
    fontSize: RFFonsize(18),
    lineHeight: RFFonsize(21),
    fontFamily: 'Nunito-Bold',
    marginTop: 14,
    marginBottom: 14
  },
  styActivity: {
    position: 'absolute',
    width,
    height,
    backgroundColor: '#000',
    opacity: .5
  },
  AweBtn: {
    alignSelf: 'center',
    marginTop: "10%",
    marginBottom: '20%',
  },
  txtAssignment: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(16),
    lineHeight: RFFonsize(20),
    fontWeight: '500',
    color: '#fff',
    marginLeft: 50,
    marginRight: 50,
    marginTop: 6,
    marginBottom: 6
  },
})