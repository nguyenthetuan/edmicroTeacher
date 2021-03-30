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
import { color } from 'react-native-reanimated';
const modelStatus = {
  unDelivered: 1,// chưa giao bài.
  delivered: 0,// đã giao bài.
}
export default class ItemMission extends Component {

  state = {
    colors: [
      "#F66215",
      "#F9C216"
    ]
  };
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
  renderElement = (img, txt1, txt2, color = '#000') => {
    return (
      <View style={styles.styFlexDirRow}>
        <FastImage source={img} resizeMode={'contain'} style={styles.styWrapImg} />
        <Text style={styles.styTxtLabel} numberOfLines={1}>{txt1}</Text>
        <Text style={[styles.styTxtLabel, { color: color, marginLeft: 20 }]} numberOfLines={1}>{txt2}</Text>
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
    const timeCreateAt = moment(data.createAt * 1000).format('DD-MM-YYYY, hh:mm A')
    const { colors } = this.state;
    return (
      <TouchableOpacity
        style={[styles.contain, {
          borderColor: data.status === modelStatus.unDelivered ? '#2D9CDB' : '#C4C4C4',
        }]}
        onPress={this.goToMissionDetail}
      >
        <View style={styles.leftImage}>
          <Image
            source={require('../../../asserts/images/icon_missionOpacity.png')}
            style={styles.widthImage}
          />
          <Text style={styles.gradeClass}>{data.gradeName}</Text>
        </View>
        <View
          style={[styles.styFlexDirRow,
          { flexDirection: 'column', marginLeft: 5 }]}
        >
          <Text
            numberOfLines={1}
            style={styles.styTxtHeader}>
            {data.title}
          </Text>
          <View style={styles.hr} />
          <View style={styles.rightRow}>
            <View style={styles.contentMission}>
              {this.renderElement(
                AppIcon.icon_remakeHatV3,
                'Bài kiểm tra',
                data.countTest,
                colors[0]
              )}
              {this.renderElement(
                AppIcon.icon_paracClass,
                'Bài tự luyện',
                data.countPractice,
                colors[1]
              )}
            </View>

            <View style={styles.subjectColumn}>
              <View style={{ marginLeft: 15 }}>
                {this.renderElement(
                  getIconSubject(data.subjectCode),
                  Common.getDisplaySubject(data.subjectCode)
                )}
              </View>

              <View style={styles.flexDiAction}>
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
          </View>

          <View style={styles.dateDaly}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../../../asserts/icon/icon_delivery.png')} />
              <Text style={styles.txtDeve}>Ngày tạo</Text>
            </View>
            <Text style={styles.txtTime}>{timeCreateAt}</Text>
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
    borderRadius: 5,
    marginTop: 15,
    flexDirection: 'row'
  },
  styTxtHeader: {
    marginTop: 2,
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 10,
  },
  styFlexDirRow: {
    flexDirection: 'row',
    marginVertical: 7,
    marginHorizontal: 0,
    // width: width / 2.5,
    marginLeft: 1,
    width: "80%"
  },
  styTxtLabel: {
    fontFamily: 'Nunito-Regular',
    marginHorizontal: 5,
    fontSize: RFFonsize(12),
    alignSelf: 'center',
    color: "#000"
  },
  styWrapImg: {
    width: 22,
    height: 22,
    borderRadius: 22
  },
  txtTime: {
    fontFamily: "Nunito-Regular",
    fontSize: RFFonsize(10),
    lineHeight: RFFonsize(14),
    alignSelf: "center",
    color: "#2D9CBD"
  },
  flexDiAction: {
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 14,
  },
  txtButtomPractice: {
    fontFamily: 'Nunito',
    alignSelf: 'center',
    fontSize: RFFonsize(12),
    marginLeft: 5
  },
  subjectColumn: {
    flexDirection: 'column',
    marginHorizontal: 20
  },
  contentMission: {
    flexDirection: 'column',
  },
  widthImage: {
    alignSelf: "center",
    marginLeft: 5,
  },
  leftImage: {
    flexDirection: 'column',
    width: '20%',
    alignSelf: 'center',
  },
  txtDeve: {
    fontFamily: 'Nunito',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    color: '#000',
    alignSelf: 'center',
    marginLeft: 6
  },
  hr: {
    backgroundColor: '#E6E6E6',
    height: 1,
    marginLeft: 3.5,
    marginTop: 8,
    marginRight: 18
  },
  dateDaly: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginLeft: 2.5,
    marginTop: 8,
    marginBottom: 5,
    marginHorizontal: 20
  },
  gradeClass: {
    fontFamily: "Nunito-Bold",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    color: '#2D9CBD',
    alignSelf: 'center',
    marginTop: 7,
    marginLeft: 5
  },
  rightRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between'
  }
});

