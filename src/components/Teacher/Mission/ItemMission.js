import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import { getIconSubject } from '../../../utils/Common';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
const { width } = Dimensions.get('window');
const modelStatus = {
  unDelivered: 0,// chưa giao bài.
  delivered: 1,// đã giao bài.
}
export default class ItemMission extends Component {

  goToMissionDetail = () => {
    const { data, token } = this.props;
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
        <Image source={img} resizeMode={'contain'} style={styles.styWrapImg} />
        <Text style={styles.styTxtLabel} numberOfLines={1}>{txt1}</Text>
        <Text style={styles.styTxtLabel} numberOfLines={1}>{txt2}</Text>
      </View>
    );
  };
  render() {
    const { data, title, navigation } = this.props;
    const timeCreateAt = moment(data.createAt * 1000).format('DD/MM/YY hh:mm');
    const textDelivered = data.status == modelStatus.unDelivered ? 'Chưa giao' : 'Đã giao';
    return (
      <TouchableOpacity
        style={styles.contain}
        onPress={this.goToMissionDetail}
      >
        <View style={styles.styWrapHeader}>
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
                AppIcon.icon_gradeClass1, data.gradeName
              )}
            </View>
            {this.renderElement(
              AppIcon.icon_teacherV3Exam,
              'Bài kiểm tra',
              data.countTest,
            )}
          </View>
          <View style={styles.viewCount}>
            {this.renderElement(
              getIconSubject(data.subjectCode),
              data.subjectName
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
                source={require('../../../asserts/icon/icon_paracComplete.png')}
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
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 15
  },
  styWrapHeader: {
    padding: 8,
    backgroundColor: '#7E96EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styTxtHeader: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    lineHeight: 19,
    // width: "98%",
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  styFlexDirRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    marginLeft: 10,
    width: width / 3 - 20
  },
  styTxtLabel: {
    fontFamily: 'Nunito-Regular',
    marginHorizontal: 3,
    fontSize: 12,
    alignSelf: 'center'
  },
  styWrapImg: {
    width: 25,
    height: 25,
  },
  viewCount: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  txtTime: {
    fontFamily: "Nunito-Regular",
    fontSize: 11,
    lineHeight: 15,
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
    marginTop: 4
    // justifyContent: 'space-between',
  },
  txtButtomPractice: {
    fontFamily: 'Nunito',
    alignSelf: 'center',
    fontSize: 12,
    marginLeft: 5
  },
});
