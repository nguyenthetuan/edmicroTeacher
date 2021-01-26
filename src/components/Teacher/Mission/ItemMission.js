import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import { getIconSubject } from '../../../utils/Common';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import dataHelper from '../../../utils/dataHelper';
const { width } = Dimensions.get('window');
import Common from '../../../utils/Common';
import { RFFonsize } from '../../../utils/Fonts';
const modelStatus = {
  unDelivered: 1,// chưa giao bài.
  delivered: 0,// đã giao bài.
}
export default class ItemMission extends Component {

  goToMissionDetail = async () => {
    const { data } = this.props;
    const { token } = await dataHelper.getToken();
    this.props.getAssignmentByMission({
      token,
      _id: data._id
    });
    this.props.navigation.navigate('MissionDetail',
      {
        title: data.title,
        statusbar: 'dark-content'
      });
  }
  renderElement = (img, txt1, txt2) => {
    return (
      <View style={styles.styFlexDirRow}>
        <FastImage source={img} resizeMode={'contain'} style={styles.styWrapImg} />
        <Text style={styles.styTxtLabel} numberOfLines={1}>{txt1}</Text>
        <Text style={styles.styTxtLabel} numberOfLines={1}>{txt2}</Text>
      </View>
    );
  };

  shouldComponentUpdate = (prevProps) => {
    if (prevProps.data != this.props.data) {
      return true;
    }
    return false;
  }

  render() {
    const { data } = this.props;
    const timeCreateAt = moment(data.createAt * 1000).format('DD-MM-YYYY, HH:MM')
    return (
      <TouchableOpacity
        style={[styles.contain, {
          borderColor: Common.getBackroundSubject(data.subjectCode)
        }]}
        onPress={this.goToMissionDetail}
      >
        <View style={[styles.styWrapHeader, {
          backgroundColor: Common.getBackroundSubject(data.subjectCode),
        }]}>
          <Text
            numberOfLines={1}
            style={styles.styTxtHeader}>
            {data.title}
          </Text>
          <Text style={styles.txtTime}>{timeCreateAt}</Text>
        </View>
        <View style={styles.styFlexDirRow}>
          <View>
            <View style={styles.imageSize}>
              {this.renderElement(
                AppIcon.icon_remakeClassV3, data.gradeName
              )}
            </View>
            {this.renderElement(
              AppIcon.icon_remakeHatV3,
              'Bài kiểm tra',
              data.countTest,
            )}
          </View>
          <View style={styles.viewCount}>
            {this.renderElement(
              getIconSubject(data.subjectCode),
              Common.getDisplaySubject(data.subjectCode)
            )}
            {this.renderElement(
              AppIcon.icon_paracClass,
              'Bài tự luyện',
              data.countPractice,
            )}
          </View>
          <View style={styles.flexDiAction}>
            {/* {this.renderElement(AppIcon.icon_paracComplete, textDelivered)} */}
            <></>
            {/* {this.renderElement(require('../../../asserts/appIcon/iconClock.png'), timeCreateAt)} */}
            {data.status === modelStatus.unDelivered
              ?
              <FastImage
                source={require('../../../asserts/icon/icon_toSendV3.png')}
                style={{ height: 25, width: 25 }}
              />
              :
              <FastImage
                source={require('../../../asserts/icon/icon_paractoFinish.png')}
                style={{ height: 25, width: 25 }}
              />
            }
            {data.status === modelStatus.unDelivered
              ?
              <Text style={[styles.txtButtomPractice, { color: "#000" }]}>
                {data.status === modelStatus.unDelivered ? 'Đã giao' : 'Chưa giao'}
              </Text>
              :
              <Text style={[styles.txtButtomPractice,
              { color: data.stattus === 4 ? '#000' : '#c4c4c4' }]}>
                {data.status === modelStatus.unDelivered ? 'Đã giao' : 'Chưa giao'}
              </Text>
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    borderColor: '#7E96EC',
    margin: 5,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 15,
    flex: 1,
    // backgroundColor: '#fff'
  },
  styWrapHeader: {
    flex: 1,
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: '#7E96EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styTxtHeader: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    // width: "98%",
    flexDirection: "row",
    justifyContent: 'space-between',
    maxWidth: '65%'
  },
  styFlexDirRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    marginHorizontal: 0,
    marginLeft: 5,
    width: width / 3 - 15,
    flex: 1
  },
  styTxtLabel: {
    fontFamily: 'Nunito-Regular',
    marginHorizontal: 3,
    fontSize: RFFonsize(12),
    alignSelf: 'center',
    color: "#000"
  },
  styWrapImg: {
    width: 22,
    height: 22,
    borderRadius: 22
  },
  viewCount: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  txtTime: {
    fontFamily: "Nunito-Regular",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(15),
    alignSelf: "center",
    color: "#FFF"
  },
  imageSize: {
    // width: 20,
    // height: 20
  },
  flexDiAction: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 4,
    // justifyContent: 'space-between',
  },
  txtButtomPractice: {
    fontFamily: 'Nunito',
    alignSelf: 'center',
    fontSize: RFFonsize(12),
    marginLeft: 5
  },
});
