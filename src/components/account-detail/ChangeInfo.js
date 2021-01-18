import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ImageEditor,
  ImageStore,
  Platform,
  Keyboard,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImagePickerCrop from 'react-native-image-crop-picker';
import ImagePickerR from 'react-native-image-picker';
import jwtDecode from 'jwt-decode';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RFFonsize } from '../../utils/Fonts';
import apiHelper from '../../services/apiExamHelper';
import HeaderNavigation from '../common-new/HeaderNavigation';
import {
  getListProvince,
  getDistrictes,
  getListSchool,
  updateAvatar,
} from '../../services/apiPracticeHelper';
import dataHelper from '../../utils/dataHelper';
import global from '../../utils/Globals';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelectBeta';
import FormDate from '../common/FormDateDefault';
import HeaderUserInfo from './HeaderUserInfo';
import { alertMessage, alertConfirmAvatar } from '../../utils/Alert';
import Button from '../common/Button';
import LoadingScreen from '../libs/LoadingScreen';
import ScrollView2Colors from '../common/ScrollView2Colors';
import { saveAvatarAction } from '../../actions/userAction';
import _ from 'lodash';
import { getSourceAvatar } from '../../utils/Helper';

const options = {
  title: 'Chọn Ảnh',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
class ChangeInfo extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      hasCameraPermission: '',
      token: '',
      Birthday: '',
      DisplayName: '',
      DistrictId: -1,
      Email: '',
      GradeId: '',
      imgWidth: 300,
      imgHeight: 300,
      Password: '',
      PhoneNumber: '',
      ProvinceId: -1,
      SchoolId: -1,
      cityId: -1,
      isDateTimePickerVisible: false,
      provines: [],
      provinesMap: [],
      type: '',
      districtes: [],
      districtesMap: [],
      avatarSource: this.props.avatarSource || '',
      schools: [],
      schoolsMap: [],
      typeUpload: 0,
      isUpdate: false,
      isShowKeybroad: false,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    dataHelper
      .getToken()
      .then(({ token }) => {
        const {
          Birthday,
          DisplayName,
          DistrictId,
          Email,
          GradeId,
          PhoneNumber,
          ProvinceId,
          SchoolId,
        } = jwtDecode(token);
        this.setState(
          {
            token,
            Birthday,
            DisplayName,
            Email,
            GradeId,
            PhoneNumber,
            ProvinceId: ProvinceId || -1,
            DistrictId: DistrictId || -1,
            SchoolId: SchoolId || -1,
          },
          () => {
            this.getProvines(token);
            this.getDistrict();
            this.getListSchools();
            // this.getAvatar();
          },
        );
      })
      .catch((err) => console.log(`errors token ${err}`));
    // this.timeInit = setTimeout(() => {}, 250);
  }

  getProvines(token) {
    getListProvince(token)
      .then((resJSON) => {
        var mapProvine = resJSON.map((obj) => {
          return {
            label: obj.cityName,
            value: obj.cityId,
            color: Platform.OS == 'ios' ? '#fff' : '#ddd',
          };
        });
        mapProvine.push({
          label: '',
          value: -1,
        });
        this.setState({
          provines: resJSON,
          provinesMap: mapProvine,
        });
      })
      .catch((err) => console.log(err));
  }

  getDistrict() {
    getDistrictes(this.state.token, this.state.ProvinceId)
      .then((res) => {
        var mapDistrictes = res.map((obj) => {
          return {
            label: obj.districtName,
            value: obj.districtId,
            color: Platform.OS == 'ios' ? '#fff' : '#ddd',
          };
        });
        mapDistrictes.push({
          label: '',
          value: -1,
        });
        this.setState({ districtes: res, districtesMap: mapDistrictes });
      })
      .catch((err) => console.log(err));
  }

  getAvatar = () => {
    //to do code
    // dataHelper
    //   .getAvatar()
    //   .then((path) => {
    //     this.setState({
    //       avatarSource: `${path}`,
    //     });
    //     this.props.saveAvatar(path);
    //   })
    //   .catch((err) => console.log(err));
  };

  updateProfile() {
    if (this.state.DisplayName === '') {
      this.refs.toast.show('Tên hiển thị không được để trống ');
      return;
    }
    this.setState(
      {
        isUpdate: true,
      },
      () => {
        const {
          token,
          Birthday,
          DisplayName,
          DistrictId,
          Email,
          GradeId,
          Password,
          PhoneNumber,
          ProvinceId,
          SchoolId,
        } = this.state;
        apiHelper
          .updateProfile(
            token,
            Birthday,
            DisplayName,
            DistrictId,
            Email,
            GradeId,
            Password,
            PhoneNumber,
            ProvinceId,
            SchoolId,
          )
          .then((res) => {
            this.setState({ isUpdate: false });
            if (res.status === 200) {
              dataHelper.saveToken(res.access_token);
              global.updateUserInfo();
              this.refs.toast.show(
                'Cập nhật thông tin thành công',
                DURATION.LENGTH_LONG,
              );
              this.props.navigation.goBack();
            } else {
              this.refs.toast.show(
                'Cập nhật thông tin thất bại ',
                DURATION.LENGTH_LONG,
              );
            }
          })
          .catch((err) => {
            this.setState({ isUpdate: false });
          });
      },
    );
  }

  changeProvines(value) {
    this.setState(
      {
        ProvinceId: value,
        DistrictId: -1,
        SchoolId: -1,
        schoolsMap: [],
      },
      () => {
        this.getDistrict();
      },
    );
  }

  getListSchools() {
    getListSchool(this.state.token, this.state.DistrictId, 3)
      .then((resJson) => {
        var mapSchools = resJson.map((obj) => {
          return {
            label: obj.schoolName,
            value: obj.schoolId,
            color: Platform.OS == 'ios' ? '#fff' : '#ddd',
          };
        });
        mapSchools.push({
          label: '',
          value: -1,
        });
        this.setState({
          schools: resJson,
          schoolsMap: mapSchools,
        });
      })
      .catch((err) => console.log(err));
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (d) => {
    let month = d.getMonth() + 1;
    let date = d.getDate();
    if (month < 10) {
      month = `0${month}`;
    }
    if (date < 10) {
      date = `0${date}`;
    }
    this.setState({ Birthday: d.getFullYear() + '-' + month + '-' + date });
    this.hideDateTimePicker();
  };

  uploadAvatarIos() {
    ImagePickerR.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        let myUri = response.uri;
        Image.getSize(
          myUri,
          (width, height) => {
            if (width <= 200 || height <= 200) {
              if (width - height >= 0) {
                this.cropImageIOS(height, myUri);
              } else {
                this.cropImageIOS(width, myUri);
              }
            } else {
              this.cropImageIOS(200, myUri);
            }
          },
          (err) => console.log(err),
        );
      }
    });
  }

  async cropImageIOS(cropWidth, myUri) {
    let cropData = {
      offset: { x: 0, y: 0 },
      size: { width: cropWidth, height: cropWidth },
    };
    ImageEditor.cropImage(
      myUri,
      cropData,
      (successURI) => {
        ImageStore.getBase64ForTag(
          successURI,
          (base64Data) => {
            this.postImageBase64(base64Data);
          },
          (error) => console.log(error),
        );
      },
      (error) => {
        console.log(error);
      },
    );
  }

  postImageBase64(b64data) {
    dataHelper
      .getToken()
      .then(({ token }) => {
        updateAvatar(token, this.state.Email, b64data).then((response) => {
          const { status } = response;
          console.log(response);
          if (status == 200) {
            const { urlAvatar, status } = response;
            this.props.saveAvatar({ timeCached: new Date().getTime() });
            // this.getAvatar();
            // global.updateAvatar();
          } else {
            alertMessage('Thông báo', 'upload avatar không thành công');
          }
        });
      })
      .catch((err) => console.log(err));
  }

  cropPickerAndroid() {
    ImagePickerCrop.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then((image) => {
        console.log(image);
        this.postImageBase64(image.data);
        // this.setState({
        //   avatarSource: image.path,
        // });
      })
      .catch((err) => console.log(err));
  }

  convertBase64ByTag = (uri, callback) => {
    ImageStore.getBase64ForTag(uri, (base64String) => {
      callback(base64String);
    });
  };

  async uploadAvatar() {
    // if (Platform.OS == 'ios') {

    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: status === 'granted' });
    // alert(this.state.hasCameraPermission);
    // alertConfirmAvatar((cal) => {
    // this.uploadAvatarIos();
    this.cropPickerAndroid();
    // });
    // this.uploadAvatarIos();
    // } else {
    // this.cropPickerAndroid();
    // }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    if (this.timeInit != null) {
      clearTimeout(this.timeInit);
      this.timeInit = null;
    }
  }
  _keyboardDidShow = () => {
    this.setState({ isShowKeybroad: true });
  };

  _keyboardDidHide = () => {
    this.setState({ isShowKeybroad: false });
  };

  _backButton = () => {
    if (this.props.navigation.state.params.previousScreen) {
      this.props.navigation.goBack();
      // this.props.navigation.replace(`${this.props.navigation.state.params.previousScreen}`)
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    const { avatarSource, user } = this.props;
    const { userId, timeCached } = user;
    const source = getSourceAvatar(userId, timeCached);
    return (
      <View
        style={{ flex: 1, backgroundColor: '#3A608C' }}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}>
        <StatusBar />
        <SafeAreaView style={{ backgroundColor: '#3A608C' }} />
        <HeaderNavigation
          title={'Hồ sơ cá nhân'}
          navigation={this.props.navigation}
          color={'#fff'}
        />
        <View style={{ flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ opacity: 1, width: width, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <HeaderUserInfo
              avatarSource={source}
              {...user}
              onPress={() => this.uploadAvatar()}
            />
            <View style={styles.wrapForm}>
              <FormInput
                editable={false}
                label={'Tên'}
                styleLabel={styles.styleLabel}
                styleInput={styles.styleInputName}
                inputHeight={{ height: 40 }}
                placeholder="Tên hiển thị"
                value={this.state.DisplayName}
                onChangeText={(text) => this.setState({ DisplayName: text })}
              />
              <FormDate
                label={'Ngày sinh'}
                styleLabel={styles.styleLabel}
                value={this.state.Birthday}
                styleInput={styles.styleInputBirthday}
                onPress={() => {
                  // this.showDateTimePicker();
                }}
              />
              <FormInput
                label={'Số điện thoại'}
                styleLabel={styles.styleLabel}
                styleInput={styles.styleInputName}
                editable={false}
                inputHeight={{ height: 40 }}
                placeholder="Số điện thoại"
                onChangeText={() => null}
                value={this.state.PhoneNumber}
              />
              <FormSelect
                label={'Tỉnh/Thành Phố'}
                styleLabel={styles.styleLabel}
                styleText={styles.styleTxtFomselect}
                data={this.state.provinesMap}
                selectedValue={Number.parseInt(this.state.ProvinceId)}
                onValueChange={(value) => {
                  this.changeProvines(value);
                }}
                disable={true}
              />
              <FormSelect
                label={'Quận/Huyện'}
                styleLabel={styles.styleLabel}
                styleText={styles.styleTxtFomselect}
                data={this.state.districtesMap}
                selectedValue={Number.parseInt(this.state.DistrictId)}
                onValueChange={(value) => {
                  this.setState(
                    {
                      DistrictId: value,
                    },
                    () => this.getListSchools(),
                  );
                }}
                disable={true}
              />
              <FormSelect
                label={'Trường'}
                styleLabel={styles.styleLabel}
                styleText={styles.styleTxtFomselect}
                data={this.state.schoolsMap}
                selectedValue={Number.parseInt(this.state.SchoolId)}
                onValueChange={(value) => {
                  this.setState({ SchoolId: value }, () =>
                    this.getListSchools(),
                  );
                }}
                disable={true}
              />
              <View style={{ height: 70, backgroundColor: '#fff' }} />
              {/* <Button
              btn={'rgb'}
              size={100}
              title={'Lưu thay đổi'}
              width={width * 0.7}
              onPress={this.updateProfile.bind(this)}
              circle
              center
              vertical={20}
              styleTitle={{ fontSize: 14, color: '#FFFFFF' }}
              style={{ backgroundColor: '#56CCF2' }}
            /> */}
            </View>
          </ScrollView>
        </View>
        <SafeAreaView style={{ backgroundColor: '#fff' }} />
        {__DEV__ ? null : <DateTimePickerModal
          isVisible={this.state.isDateTimePickerVisible}
          mode="date"
          value={new Date(this.state.Birthday)}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />}
        <Toast ref="toast" position={'bottom'} />
        <LoadingScreen
          isLoading={this.state.isUpdate}
          bgColor={'transparent'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapUpload: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#024A87',
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  wrapForm: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  viewLogin: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapLogin: {
    alignItems: 'center',
    width: width,
    paddingVertical: 20,
  },
  authItem: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
  wrapIcon: {
    // backgroundColor: '#CFD8DC',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  label: {
    color: '#fff',
  },
  inputStyle: {
    color: '#fff',
    width: 200,
    paddingHorizontal: 10,
    minHeight: 50,
  },
  bigButton: {
    height: 40,
    width: 250,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#024A87',
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    // color: '#fff',
    color: 'white',
  },
  dropDown: {
    width: 250,
    paddingHorizontal: 10,
    backgroundColor: '#EFF0F2',
    marginTop: 5,
    marginBottom: 5,
    height: 40,
  },
  textdropDown: {
    width: 250,
    paddingHorizontal: 10,
    backgroundColor: '#EFF0F2',
    marginTop: 5,
    marginBottom: 5,
    height: 40,
    fontSize: RFFonsize(16),
  },
  wrapDropDown: {
    alignItems: 'center',
    width: width,
    borderWidth: 1,
    borderColor: '#fff',
    paddingTop: 10,
  },
  rowItem: {
    marginTop: 20,
  },
  titleHeader: {},
  txtTitle: {
    fontFamily: 'Nunito-Regular',
    color: '#2F80ED',
    fontSize: RFFonsize(14),
  },
  imgChangeinfo: {
    width: width,
    height: (235 * width) / 375,
    marginTop: 30,
    position: 'absolute',
  },
  styleLabel: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito',
    marginStart: 0,
  },
  styleInputName: {
    color: '#396599',
    fontSize: RFFonsize(14),
    marginTop: 13,
    marginStart: -10,
    fontFamily: 'Nunito-Bold',
    flex: 1,
  },
  styleInputBirthday: {
    color: '#396599',
    fontSize: RFFonsize(14),
    marginTop: isAndroid ? 15 : -4,
    marginStart: -30,
    fontFamily: 'Nunito-Bold',
  },
  styleTxtFomselect: {
    color: '#396599',
    fontSize: RFFonsize(14),
    marginStart: -5,
    fontFamily: 'Nunito-Bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: RFFonsize(16),
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    color: '#fff',
  },
});

const mapStateToProps = (state) => {
  return {
    avatarSource: state.user.AvatarSource,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveAvatar: (avatar) => dispatch(saveAvatarAction(avatar)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangeInfo);
