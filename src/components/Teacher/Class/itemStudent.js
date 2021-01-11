import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import ProgressBarClassic from '../../libs/progessBarClassic';
import Common from '../../../utils/Common';
import moment from 'moment';
import ProgressBar from '../../libs/ProgressBar';
const { width, height } = Dimensions.get('window')
export default class ItemStudent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;
    const rate = item.totalAssign === 0
      ?
      0
      :
      Math.ceil(100 * item.totalDoing / item.totalAssign)
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            {
              !item.avatar ?
                <View style={{
                  height: 60, width: 60,
                  borderRadius: 30,
                  backgroundColor: '#2D9CDB',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={styles.txtName}>
                    {Common.convertNameToAvatar(item.name)}
                  </Text>
                </View>
                :
                <Image
                  source={{ uri: Common.getAvatarSourceNew(item.avatar) }}
                  style={{ height: 60, width: 60, borderRadius: 30 }}
                />
            }
            <View style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              height: 7,
              width: 7,
              borderRadius: 3.5,
              backgroundColor: '#91EDC6'
            }} />
          </View>
          <View style={{ marginLeft: 11, flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center'
            }}>
              <View style={{
                marginTop: '3%',
                height: '90%',
                // width: 1,
                // backgroundColor: '#D0EFF9',
                alignContent: 'center'
              }} />
              {/* <View style={{ flex: 1, alignItems: 'center', marginTop: 5 }}>
                <Text style={styles.txtAccess}>Thời gian</Text>
                <Text style={[styles.txtDate]}>{item.totalDoing && moment(item.totalDoing * 1000).format('DD/MM/YYYY') || `Chưa làm`}</Text>
              </View>
              <View style={{ marginTop: '3%', height: '90%', width: 1, backgroundColor: '#D0EFF9' }} /> */}
              <View style={{
                marginLeft: 33,
                flex: 1,
                marginTop: 6,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <Text style={styles.txtNameOne}>{item.name}</Text>
                {/* <Text numberOfLines={1} style={styles.txtAccess}>Tỉ lệ hoàn thành</Text> */}
                <View style={styles.flextime}>
                  <Text style={styles.txtAccess1}>Truy cập</Text>
                  <Text style={styles.txtDate}>
                    {item.lastTimeDoing
                      &&
                      moment(item.lastTimeDoing * 1000).format('DD/MM/YYYY') || `Chưa làm`}
                  </Text>
                </View>
                <View style={styles.marProcess}>
                  <ProgressBar
                    progress={rate ? rate > 100 ? 100 : rate : 1}
                    color="#56BB73"
                    widthProps={width - 190}
                    progressUnfilledColor="#E0E0E0"
                  />
                  <Text numberOfLines={1}
                    style={styles.countToDo}>{item.totalDoing}/{item.totalAssign} bài</Text>
                </View>
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
    paddingLeft: 10,
    paddingRight: 16,
  },
  txtName: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Nunito-Bold'
  },
  txtNameOne: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Nunito-Bold'
  },
  txtAccess: {
    color: '#828282',
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
  },
  txtAccess1: {
    color: '#828282',
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Nunito-Regular',
  },
  txtDate: {
    color: '#2D9CDB',
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    marginLeft: 10,
  },
  flextime: {
    flexDirection: "row",
    marginTop: 5
    // justifyContent: "space-between",
    // marginRight:170
  },
  marProcess: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: width * 0.2,
  },
  countToDo: {
    fontFamily: "Nunito",
    fontSize: 12,
    color: '#2D9CDB',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  }
})