import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import RippleButton from '../../libs/RippleButton';
import ProgressBar from '../../libs/ProgressBar';
import Common from '../../../utils/Common';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { RFFonsize } from '../../../utils/Fonts';

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
        <View style={[styles.top, { backgroundColor: bg }]}>
          <View style={styles.titleName}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.textStatus}>
              {this._Status(item.status)}
            </Text>
            {(item.status === 1 || item.status === 2) && (
              <View style={styles.iconStatus} />
            )}
          </View>
        </View>
        <View style={styles.body}>
          <View style={{ marginTop: 5 }}>
            <Text
              style={styles.viewSubmit}>
              Tỉ lệ nộp bài
              </Text>
            <View style={styles.progressBar}>
              <ProgressBar
                progress={item.rateSubmit
                  ? item.rateSubmit > 100
                    ? 100 : item.rateSubmit : 1}
                color="#56BB73"
                widthProps={width - 100}
                progressUnfilledColor="#E0E0E0"
              />
              <Text
                style={styles.rateSub}>
                {item.rateSubmit}%
                </Text>
            </View>
          </View>

          <View
            style={styles.viewInfo}>
            <View style={{ justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <FastImage
                  source={Common.getIconSubject(item.subjectCode)}
                  style={styles.getIcon}
                />
                <View style={styles.showSubjectCode}>
                  <Text style={styles.txtInfoDetail}>
                    Môn học
                    </Text>
                  <Text numberOfLines={1}
                    style={styles.txtQuestion}>{item.subjectName}</Text>
                </View>
              </View>
              <View style={styles.viewImageExcer}>
                <Image
                  source={require('../../../asserts/icon/icon_remakeParacV3.png')}
                  style={{ width: 23, height: 23 }}
                />
                <Text style={styles.txtInfoDetail}>Số bài tập</Text>
                <Text style={styles.txtThree}>{item.totalAssign}</Text>
              </View>
            </View>
            <View style={{ justifyContent: 'space-between' }}>
              <View style={styles.iconClass}>
                <Image
                  source={require('../../../asserts/icon/icon_remakeClassV3.png')}
                  style={{ width: 22, height: 22 }}
                />
                <Text style={styles.txtRight}>Khối lớp </Text>
                <Text style={[styles.indexOne, { marginLeft: 30 }]}>
                  {item.gradeId.slice(1, 3)}
                </Text>
              </View>
              <View style={styles.iconPopu}>
                <Image
                  source={require('../../../asserts/icon/icon_remakePeopleV3.png')}
                  style={{ width: 22, height: 22 }}
                />
                <Text style={styles.txtRightFoot}>Sĩ số</Text>
                <Text style={styles.indexTwo}>{item.totalStudent}</Text>
              </View>
            </View>
          </View>
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    // flex: 1,
    borderWidth: 0,
    marginTop: 20,
    borderRadius: 5,
    // overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  top: {
    // flex: 1,
    flexDirection: 'row',
    paddingVertical: 3,
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#FFF',
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Bold',
    marginLeft: 5,
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
  body: {
    paddingLeft: 10,
    paddingRight: 5,
    paddingBottom: 7,
    marginTop: 9,
    justifyContent: 'space-between',
  },
  progressBar: {
    marginTop: 5,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
  },
  txtbtn: {
    color: '#FFF',
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Bold',
    textTransform: 'uppercase',
    marginLeft: 5,
    textAlign: 'center',
  },
  txtInfoDetail: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    marginLeft: 5,
    alignSelf: 'center',
  },
  txtRight: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    marginLeft: 5,
    marginRight: 16,
    alignSelf: 'center'
  },
  txtRightFoot: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    // marginLeft: 5,
    marginRight: 48,
    alignSelf: 'center'
  },
  indexOne: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    // marginLeft: 16,
  },
  txtThree: {
    color: '#F16219',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    marginLeft: 25,
    alignSelf: 'center'
  },
  indexTwo: {
    color: '#FF6213',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    marginLeft: 15,
  },
  wrapBtn: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    paddingVertical: 3,
  },
  viewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flex: 1,
    paddingVertical: 15,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  txtQuestion: {
    fontFamily: 'Nunito',
    fontSize: RFFonsize(11),
    lineHeight: RFFonsize(14),
    color: "#2D9CDB",
    alignSelf: 'center',
    marginTop: 2,
    textAlign: 'center',
    width: 60,
    marginLeft: 5,
    alignSelf: 'center',
  },
  showSubjectCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleName: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%'
  },
  viewSubmit: {
    fontSize: RFFonsize(12),
    color: '#000',
    fontFamily: 'Nunito-Regular',
  },
  rateSub: {
    fontSize: RFFonsize(12),
    color: '#F16219',
    fontFamily: 'Nunito-Regular',
    marginLeft: 10,
    position: 'absolute',
    right: 0
  },
  getIcon: {
    width: 21,
    height: 21,
    borderRadius: 20,
    marginLeft: 1
  },
  viewImageExcer: {
    flexDirection: 'row',
    marginTop: 13
  },
  iconClass: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconPopu: {
    flexDirection: 'row',
    marginTop: 13,
    justifyContent: 'space-between'
  }
});
