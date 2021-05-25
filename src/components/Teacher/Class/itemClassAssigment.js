import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import ProgressBar from '../../libs/ProgressBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';
const { width, height } = Dimensions.get('window');

export default class ItemClassAssigment extends Component {
  constructor(props) {
    super(props);
  }

  _Status = (status) => {
    switch (status) {
      case 1:
        return 'Đang mở';
      case 2:
        return 'Đang chờ';
      case 3:
        return 'Đang đóng';
      default:
        break;
    }
  };

  render() {
    const { shadowBtn } = shadowStyle;
    const {
      item,
      subjectCode,
      assignmentId
    } = this.props;
    // const bg = Common.getBackroundSubject(subjectCode);
    const bg = '#56CCF2';
    const rate =
      item.totalUserSubmit === 0 || item.totalUser === 0
        ? 0
        : ((100 * item.totalUserSubmit) / item.totalUser).toFixed(2);
    return (
      <View style={[styles.container, { borderColor: bg }]}>
        <View style={[styles.top, { backgroundColor: bg }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <Text style={styles.name}>{item.className}</Text>
            {/* <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textStatus}>{this._Status(item.status)}</Text>
              {item.status === 1 ? (
                <View style={styles.iconStatus} />
              ) : (
                  <View style={styles.iconStatusOne} />
                )}
            </View> */}
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
                color={'#56BB73'}
                style={{ marginTop: 0 }}
              />
              <Text style={styles.txtDate}>
                {moment(item.timeStart * 1000).format('DD/MM/YYYY')}
              </Text>
              <MaterialCommunityIcons
                name={'calendar-range'}
                size={23}
                color={'#FF6213'}
                style={{ marginLeft: 20 }}
              />
              <Text style={styles.txtDate}>
                {moment(item.timeEnd * 1000).format('DD/MM/YYYY')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../../asserts/icon/icon_remakePeopleV3.png')}
              />
              <Text style={styles.txtDate}>
                {item.totalUserSubmit}/
                {item.totalUser}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text
              style={styles.toucSub}>
              Tỉ lệ nộp bài
            </Text>
            <View style={styles.progressBar}>
              <View
                style={styles.proView}>
                <ProgressBar
                  progress={rate ? rate > 100 ? 100 : rate : 1}
                  color="#28A745"
                  widthProps={width - 125}
                  progressUnfilledColor="#E0E0E0"
                />
                <Text
                  style={styles.viewRate}>
                  {rate}%
                </Text>
              </View>
              <View
                style={styles.ripButton}>
                <RippleButton
                  onPress={() => {
                    this.props.navigation.navigate({
                      routeName: 'MainHomeWork', key: 'd', params: {
                        navigation: this.props.navigation,
                        hideBackButtom: true,
                        assignId: this.props.item.assignId,
                        statusbar: 'dark-content',
                      }
                    });
                  }}
                  style={[styles.buttomRevew, { ...shadowBtn }]}
                >
                  <Text style={styles.txtbuttom}>
                    Xem báo cáo
                      </Text>

                </RippleButton>
              </View>
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
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#FFF',
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Bold',
  },
  textStatus: {
    fontSize: RFFonsize(12),
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
  iconStatusOne: {
    backgroundColor: '#E0E0E0',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  body: {
    paddingLeft: 13,
    paddingRight: 13,
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
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
    marginLeft: 5,
    // marginLeft: width < 350 ? 0 : 5,
  },
  buttomRevew: {
    backgroundColor: '#56CCF2',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 8,
    marginBottom: 8,
  },
  txtbuttom: {
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(18),
    fontFamily: 'Nunito-Bold',
    color: '#FFF',
    paddingHorizontal: 10,
  },
  buttomTry: {
    backgroundColor: '#7E96EC',
    justifyContent: 'center',
    paddingHorizontal: 35,
    borderRadius: 4,
    paddingVertical: 5,
  },
  progressBar: {
    marginTop: 5,
    justifyContent: 'space-between',
  },
  proView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toucSub: {
    fontSize: RFFonsize(12),
    color: '#000',
    fontFamily: 'Nunito-Regular',
  },
  viewRate: {
    fontSize: RFFonsize(11.5),
    color: '#F16219',
    fontFamily: 'Nunito-Regular',
    marginLeft: 10,
    position: 'absolute',
    right: 0,
    alignSelf: 'center'
  },
  ripButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 13,
    marginLeft: 10
  }
});
