import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import RippleButton from '../../libs/RippleButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressBar from '../../libs/ProgressBar';
import Common from '../../../utils/Common';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

export default class itemClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDetail: false,
    };
  }

  _Status = status => {
    switch (status) {
      case 1:
        return 'Đang mở';
      case 0:
        return 'Đang đóng';
      case 2:
        return 'Đang chờ';
      default:
        break;
    }
  };

  _classDetail = item => {
    this.props.navigation.navigate('ClassDetail', {
      navigation: this.props.navigation,
      subjectCode: item.subjectCode,
      classId: item.id,
      title: item.name,
      statusbar: 'dark-content',
    });
  };

  shouldComponentUpdate = (prevProps, nextState) => {
    if (
      prevProps.item != this.props.item ||
      this.state.activeDetail != nextState.activeDetail
    ) {
      return true;
    }
    return false;
  };

  render() {
    const { item } = this.props;
    const { activeDetail } = this.state;
    const bg = Common.getBackroundSubject(item.subjectCode);
    return (
      <View style={[styles.container, { borderColor: bg }]}>
        <View style={{ flex: 1 }}>
          <View style={[styles.top, { backgroundColor: bg }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <View style={{ height: 26, width: 26, borderRadius: 13, borderColor: '#FFF', borderWidth: .5, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Common.getIconSubject(item.subjectCode)} style={{ width: 25, height: 25 }} resizeMode='contain' />
              </View> */}
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textStatus}>{this._Status(item.status)}</Text>
              {(item.status === 1 || item.status === 2) && (
                <View style={styles.iconStatus} />
              )}
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.topBody}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <MaterialCommunityIcons
                  name={'calendar-range'}
                  size={23}
                  color={'#0E5FCD'}
                  style={{ marginTop: 0 }}
                />
                {item.timeStart && <Text style={styles.txtDate}>
                  {moment(item.timeStart * 1000).format('DD/MM/YYYY')}
                </Text>}
                <MaterialCommunityIcons
                  name={'calendar-range'}
                  size={23}
                  color={'#EB5757'}
                  style={{ marginLeft: 30 }}
                />
                {item.timeEnd && <Text style={styles.txtDate}>
                  {moment(item.timeEnd * 1000).format('DD/MM/YYYY')}
                </Text>}
              </View>
              {!activeDetail && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../../../asserts/icon/person.png')} />
                  <Text style={[styles.txtDate]}>{item.totalStudent}</Text>
                  <View
                    style={{
                      height: '100%',
                      width: 1,
                      marginHorizontal: 3,
                      backgroundColor: '#E0E0E0',
                    }}
                  />
                  <Image
                    source={require('../../../asserts/icon/registration.png')}
                  />
                  <Text style={[styles.txtDate, { paddingHorizontal: 5 }]}>
                    {item.totalAssign}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ marginTop: 5 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#000',
                  fontFamily: 'Nunito-Regular',
                }}>
                Tỉ lệ nộp bài
              </Text>
              <View style={styles.progressBar}>
                <ProgressBar
                  progress={item.rateSubmit}
                  color="#F16219"
                  widthProps={width * 0.75}
                  progressUnfilledColor="#E0E0E0"
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#F16219',
                    fontFamily: 'Nunito-Regular',
                    marginLeft: 10,
                    position: 'absolute',
                    right: 0,
                  }}>
                  {item.rateSubmit} %
                </Text>
              </View>
            </View>

            <View>
              <RippleButton
                onPress={() => this.setState({ activeDetail: !activeDetail })}>
                <View>
                  {!activeDetail && (
                    <Text style={styles.txtDetail}>Xem Chi Tiết</Text>
                  )}
                  <View
                    style={[
                      { flexDirection: 'row', justifyContent: 'space-between' },
                      activeDetail && { marginTop: 9, alignItems: 'flex-end' },
                    ]}>
                    <View style={styles.line} />
                    {(!activeDetail && (
                      <Image
                        source={require('../../../asserts/icon/icondow.png')}
                      />
                    )) || (
                        <Image source={require('../../../asserts/icon/up.png')} />
                      )}
                    <View style={styles.line} />
                  </View>
                </View>
              </RippleButton>
              {activeDetail && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                    paddingVertical: 15,
                    paddingLeft: 8,
                    paddingRight: 8,
                    backgroundColor: 'rgba(190, 205, 255, 0.19)',
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                  }}>
                  <View style={{ justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={require('../../../asserts/icon/edu.png')}
                      />
                      <Text style={styles.txtInfoDetail}>Khối Lớp</Text>
                      <Text style={[styles.indexOne, { marginLeft: 30 }]}>
                        {item.gradeId.slice(1, 3)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 13 }}>
                      <Image
                        source={require('../../../asserts/icon/person.png')}
                      />
                      <Text style={styles.txtInfoDetail}>Số Học Sinh</Text>
                      <Text style={styles.txtFour}>{item.totalStudent}</Text>
                    </View>
                  </View>

                  <View style={{ justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={require('../../../asserts/icon/registration.png')}
                      />
                      <Text style={styles.txtRight}>Số Bài Tập</Text>
                      <Text style={styles.txtThree}>{item.totalAssign}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 13 }}>
                      <Image
                        source={require('../../../asserts/icon/check.png')}
                      />
                      <Text style={styles.txtRightFoot}>Tỉ Lệ Nộp Bài</Text>
                      <Text style={styles.indexTwo}>{item.rateSubmit} %</Text>
                    </View>
                  </View>
                </View>
              )}
              <RippleButton
                onPress={() => this._classDetail(item)}
                rippleDuration={150}
                rippleSize={250}
                rippleColor={'#FFF'}
                style={styles.btn}>
                <View style={[styles.wrapBtn, { backgroundColor: bg }]}>
                  <FastImage
                    style={{ width: 12 }}
                    source={require('../../../asserts/icon/book.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text style={styles.txtbtn}>Vào Lớp</Text>
                </View>
              </RippleButton>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 3,
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginLeft: 5,
  },
  textStatus: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
  },
  iconStatus: {
    backgroundColor: '#91EDC6',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  body: {
    paddingLeft: 10,
    paddingRight: 5,
    paddingBottom: 7,
    marginTop: 9,
    justifyContent: 'space-between',
  },
  topBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  txtDate: {
    color: '#4F4F4F',
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    marginLeft: width < 350 ? 0 : 5,
  },
  progressBar: {
    marginTop: 5,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    borderWidth: 1,
    flex: 1,
    height: 1,
    width: '50%',
    borderColor: '#E0E0E0',
  },
  txtDetail: {
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#828282',
    marginTop: 5,
    paddingBottom: 5,
  },
  btn: {
    alignItems: 'center',
    width: '90%',
    marginTop: 18,
    alignSelf: 'center',
  },
  txtbtn: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    textTransform: 'uppercase',
    marginLeft: 5,
    textAlign: 'center',
  },
  txtInfoDetail: {
    color: '#828282',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 10,
  },
  txtRight: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 16,
  },
  txtRightFoot: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 10,
  },
  indexOne: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 16,
  },
  txtThree: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 25,
  },
  txtFour: {
    color: '#FF6213',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 16,
  },
  indexTwo: {
    color: '#FF6213',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 15,
  },
  wrapBtn: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    paddingVertical: 3,
  },
});
