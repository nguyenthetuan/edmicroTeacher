import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

export default class itemExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  _Status = status => {
    switch (status) {
      case 1:
        return (
          <View style={styles.status}>
            <Text style={styles.txtActive}>Đang mở</Text>
          </View>);
      case 2:
        return (<View style={styles.statusHide}>
          <Text style={[styles.txtActive, { color: '#E0E0E0' }]}>Đang Chờ</Text>
        </View>);
      case 3:
        return (<View style={styles.statusHide}>
          <Text style={[styles.txtActive, { color: '#E0E0E0' }]}>Đang đóng</Text>
        </View>);

      default: break;
    }
  }


  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.body}>

          <View style={styles.topBody}>
            <View style={styles.flexAll}>
              <MaterialCommunityIcons
                name={'calendar-range'}
                size={23}
                color={'#0E5FCD'}
              />
              <View style={styles.txtStart}>
                <Text style={styles.timeStart}>
                  Bắt đầu
                  </Text>
                <Text style={styles.txtDate}>
                  {moment(item.timeStart * 1000).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>

            <View style={styles.viewIcon}>
              <Image
                source={require('../../../asserts/icon/icon_popuClass.png')}
                style={{ width: 20, height: 20 }}
              />
              <View style={styles.fleImaTxt}>
                <Text style={styles.txtInfoDetail}>Số Học Sinh</Text>
                <Text style={styles.txtFour}>{item.totalUser}</Text>
              </View>
            </View>
          </View>

          <View style={styles.topBody}>
            <View style={styles.flexAll}>
              <MaterialCommunityIcons
                name={'calendar-range'}
                size={23}
                color={'#EB5757'}
                style={{ marginRight: 8 }}
              />
              <View style={{ flexDirection: 'row', paddingBottom: 3, marginLeft: 0 }}>
                <Text style={styles.timeStart}>Kết thúc</Text>
                <Text style={styles.txtDate1}>{moment(item.timeEnd * 1000).format('DD/MM/YYYY')}</Text>
              </View>
            </View>
            <View style={styles.viewIcon}>
              <View style={styles.fleImaTxt1}>
                <Image
                  source={require('../../../asserts/icon/icon_submitExcer.png')}
                  style={{ width: 20, height: 20, marginLeft: 1 }}
                />
                <Text style={styles.txtRight}>Nộp bài</Text>
                <Text style={styles.txtThree}>{item.totalUserSubmit}</Text>
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
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#56CCF2',
    paddingBottom: 18,
    marginHorizontal: 16,
  },
  top: {
    backgroundColor: '#56CCF2',
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingLeft: 11
  },
  status: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 15,
  },
  statusHide: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 8,
  },
  txtStatus: {
    fontSize: 12,
    color: '#3DA059'
  },
  statusActive: {
    backgroundColor: '#FFF',
    paddingHorizontal: 5,
    paddingBottom: 2,
    borderRadius: 12,
    marginRight: 3,
    alignItems: 'center'
  },
  txtActive: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#3DA059',
    textAlign: 'center'
  },
  name: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#FFF'
  },
  body: {
    backgroundColor: '#FFF',
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeStart: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#828282',
    alignSelf: 'center'
  },
  txtDate: {
    fontSize: 10,
    color: '#0E5FCD',
    marginLeft: 5
  },
  txtDate1: {
    fontSize: 10,
    color: '#EB5757',
    marginLeft: 5
  },
  topBody: {
    flexDirection: 'column',
    paddingTop: 10,
  },
  txtClass: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#828282',
    marginLeft: 5,
  },
  indexOne: {
    color: '#2D9CDB',
    fontSize: 10,
    position: 'absolute',
    right: 0
  },
  txtRight: {
    marginLeft: 9.5,
    color: '#000000',
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    alignSelf: 'center',
    marginRight: 50,
  },
  txtInfoDetail: {
    color: '#000',
    fontSize: 10,
    marginLeft: 8,
    alignSelf: 'center',
  },
  txtFour: {
    fontSize: 10,
    color: '#FF6213',
    paddingHorizontal: 25,
    marginRight: 16
  },
  txtRightFoot: {
    fontSize: 10,
    color: '#000',
    marginLeft: 10
  },
  txtThree: {
    fontSize: 10,
    color: '#FF6213',
    alignSelf:'center'
  },
  indexTwo: {
    fontSize: 10,
    color: '#56CCF2',
    marginLeft: 15
  },
  fleImaTxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fleImaTxt1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexAll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  txtStart: {
    flexDirection: 'row',
    paddingBottom: 5,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:16
  }
});