import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, StatusBar
} from 'react-native';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/FontAwesome';
import iconLogo from '../../asserts/appIcon/logov2.png';
import logo from '../../asserts/appIcon/logo.png';
import ScaleAnim from '../anim/ScaleAnim';
import dataHelper from '../../utils/dataHelper';
import apiService from '../../services/apiPracticeHelper';
import GradesList from './GradesList';
import Color from '../../constants/colors';
import global from '../../utils/Globals';
import AppIcon from '../../utils/AppIcon';
import apiHelper from '../../services/apiExamHelper';
import LoadingScreen from '../libs/LoadingScreen';
import Button from '../common/Button';
import RippleButton from '../libs/RippleButton';
import { RFFonsize } from '../../utils/Fonts';

const { width, height } = Dimensions.get('window')
export default class Grades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      grades: [],
      isTitleVisible: false,
      isVisibleModal: false,
      displayName: '',
      disabledBtn: true,
      gradeId: null,
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.getGrades();
    this.getProfile();
  }

  gotoUserInfo(GradeId) {
    this.setState({
      modalVisible: true,
    })
  }

  onChangeHeaderVisibility(isBolean) {
    if (!isBolean) {
      this.setState({
        isTitleVisible: true
      });
    } else {
      this.setState({
        isTitleVisible: false
      });
    }
  }

  _buttomStart = (GradeId) => {
    this.setState({
      isLoading: true,
      modalVisible: true,
    }, () => {
      dataHelper.getToken().then(({ token }) => {
        const { Birthday, DisplayName, DistrictId, Email, PhoneNumber, ProvinceId, SchoolId } = jwtDecode(token);
        apiHelper.updateProfile(token, Birthday, DisplayName, DistrictId, Email, GradeId, '', PhoneNumber, ProvinceId, SchoolId)
          .then(res => {
            if (res.status == 200) {
              dataHelper.saveToken(res.access_token);
              // global.updateGrades(true);
              const { CreateBySchool } = jwtDecode(res.access_token);
              this.props.navigation.navigate(CreateBySchool ? 'App' : 'AppStudent', { statusbar: 'dark-content' });
            }
          });
      }).catch(err => {
        this.setState({
          isLoading: false
        });
      });
    });
  }

  getGrades() {
    dataHelper.getToken().then(({ token }) => {
      apiService.getGrades(token).then(resJSON => {
        const { grades } = resJSON;
        this.setState({
          grades,
        });
      }).catch(err => console.log(err));
    }).catch(err => console.log(`errors token ${err}`));
  }

  getProfile() {
    dataHelper.getToken().then(({ token }) => {
      const displayName = jwtDecode(token).DisplayName;
      this.setState({
        displayName
      });
    }).catch(err => console.log(`errors token ${err}`));
  }

  chonseClass(gradeId) {
    this.setState({
      gradeId,
      disabledBtn: false
    });
  }

  _closeModal = () => {
    this.setState({ modalVisible: false })
  }

  renderBackground() {
    return (
      <View>
        {!this.state.isTitleVisible &&
          <View style={homeStyle.wrapBackground}>
            <ScaleAnim>
              <View>
                <Image source={iconLogo} style={[homeStyle.iconLogo, homeStyle.mg]} />
                <Text style={homeStyle.textHead}>Chào {this.state.displayName} </Text>
                <Text style={[homeStyle.textHead, homeStyle.bold]}>Mời chọn lớp học</Text>
              </View>
            </ScaleAnim>
          </View>
        }
      </View>
    );
  }

  renderStickyHeader() {
    return (
      <View style={homeStyle.wrapHeaderFix}>
        <TouchableOpacity
          onPress={() => this.scrollView.getScrollResponder()
            .scrollTo({ x: 0, y: 0, animated: true })}>
          <Icon name={'comments-o'} size={24} color={Color.transparent} />
        </TouchableOpacity>
        <ScaleAnim>
          <Image source={iconLogo} style={homeStyle.logoStyle} />
        </ScaleAnim>
        <Icon name={'cog'} size={24} color={Color.transparent} />
      </View>
    );
  }

  _renderModalStart = () => {
    const { modalVisible } = this.state;
    return (
      <Modal
        visible={modalVisible}
        transparent={true}
      >
        <StatusBar barStyle={'dark-content'} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'#FFF' }}>
          <Image source={logo} style={{ width: width * 0.5, height: width * 0.5 - 20, resizeMode: 'contain' }} />
          <Text style={styles.textContent}>chào mừng bạn đến với ôn luyện</Text>
          <RippleButton
            style={styles.btnStart}
            onPress={() => this._buttomStart(this.state.gradeId)}
          >
            <Text style={styles.txtButtom}>BẮT ĐẦU</Text>
          </RippleButton>
          <Image source={AppIcon.bottomChangeGrade} style={styles.iconOpacity}></Image>
        </View>
      </Modal>
    );
  }

  render() {
    const { grades, displayName, disabledBtn } = this.state;
    return (
      <View style={{ backgroundColor: '#E3F6FE', height: height, alignItems: 'center' }}>
        <StatusBar barStyle={'dark-content'} />
        {/* <ImageBackground source={AppIcon.bg_sla} style={{ width: '100%', height: '100%' }}> */}
        <View style={{ marginTop: 60, alignSelf: 'center' }}>
          <View style={styles.wrapAvatar}>
            <Image source={AppIcon.avatar_default} style={{ width: 30, height: 35 }}></Image>
          </View>
          <Text style={[styles.txtTitle1, { marginTop: 15 }]}>Chào {displayName}</Text>
        </View>
        <View>

          <Text style={{ marginLeft: '5%', marginTop: 30 }}>Học Lớp</Text>
          <GradesList
            gotoUserInfo={this.gotoUserInfo.bind(this)}
            chonseClass={this.chonseClass.bind(this)}
            navigation={this.props.navigation}
            listClass={grades}
            gradeId={this.state.gradeId}
          />
        </View>
        <Image source={AppIcon.bottomChangeGrade} style={styles.iconOpacity}></Image>
        <View style={styles.wrapBtn}>
          <Button
            onPress={
              () => {
                this.gotoUserInfo();
              }
            }
            title={"TIẾP TỤC"}
            btn={'rgb-lg'}
            center
            circle
            radius={25}
            disabled={disabledBtn}
            style={{
              backgroundColor: disabledBtn ? '#999999' : '#00A3FF',
              alignSelf: 'center',
              height: 40,
              width: '80%',
              borderRadius: 5,
            }}
            styleTitle={{ fontSize: RFFonsize(16), fontFamily: 'Nunito-Bold' }}
          />
        </View>
        <LoadingScreen isLoading={this.state.isLoading} bgColor={'transparent'} color={'transparent'} />
        {this._renderModalStart()}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  wrapAvatar: {
    width: 60, height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#fff',
    alignSelf: 'center'
  },
  btnStart: {
    backgroundColor: '#00A3FF',
    alignSelf: 'center',
    height: 40,
    width: '80%',
    borderRadius: 5,
    justifyContent: 'center'
  },
  txtButtom: {
    fontSize: RFFonsize(16),
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    color: '#FFF'
  },
  textContent: {
    textTransform: 'uppercase',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#000',
    marginVertical: width * 0.23
  },
  txtTitle1: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(18),
    alignSelf: 'center',
  },
  iconOpacity: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: -1
  },
  wrapBtn: {
    flex: 3,
    zIndex: 100,
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },

})

const homeStyle = StyleSheet.create({
  wrapBackground: {
    height: 190,
    justifyContent: 'center'
  },
  wrapText: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center'
  },
  iconLogo: {
    width: 140,
    height: 30,
    alignSelf: 'center'
  },
  mg: {
    marginBottom: 5
  },
  textHead: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: RFFonsize(16)
  },
  bold: {
    fontWeight: 'bold',
  },
  logoStyle: {
    width: 120,
    height: 30
  },
  wrapHeaderFix: {
    backgroundColor: '#55BBEB',
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  effectGround: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: Color.bgMainGrad1,
    opacity: 0.3,
    borderRadius: 30,
    alignSelf: 'center',
  }
});
