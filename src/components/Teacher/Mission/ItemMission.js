import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import { getIconSubject } from '../../../utils/Common';
import moment from 'moment';
const { width } = Dimensions.get('window');
const modelStatus = {
  unDelivered: 0,// chưa giao bài.
  delivered: 1,// đã giao bài.
}
export default class ItemMission extends Component {

  goToMissionDetail = () => {
    const { data, token } = this.props;
    this.props.getAssignmentByMission({ token, _id: data._id });
    this.props.navigation.navigate('MissionDetail', { statusbar: 'light-content' });
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
    const { data } = this.props;
    const timeCreateAt = moment(data.createAt * 1000).format('DD/MM/YY hh:mm');
    const textDelivered = data.status == modelStatus.unDelivered ? 'Chưa giao' : 'Đã giao';
    return (
      <TouchableOpacity
        style={styles.contain}
        onPress={this.goToMissionDetail}
      >
        <View style={styles.styWrapHeader}>
          <Text style={styles.styTxtHeader}>{data.title}</Text>
        </View>
        <View style={styles.styFlexDirRow}>
          <View>
            {this.renderElement(AppIcon.iconClassActive, data.gradeName)}
            {this.renderElement(
              AppIcon.task_test,
              'Bài kiểm tra',
              data.countTest,
            )}
          </View>
          <View>
            {this.renderElement(
              getIconSubject(data.subjectCode),
              data.subjectName,
            )}
            {this.renderElement(
              AppIcon.icon_practice,
              'Bài tự luyện',
              data.countPractice,
            )}
          </View>
          <View>
            {this.renderElement(require('../../../asserts/appIcon/iconClock.png'), timeCreateAt)}
            {this.renderElement(AppIcon.icon_handing, textDelivered)}
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
    borderRadius: 5,
  },
  styWrapHeader: {
    padding: 8,
    backgroundColor: '#7E96EC',
  },
  styTxtHeader: {
    color: '#FFF',
    fontFamily: 'Nunito-Bold',
    fontSize: 12
  },
  styFlexDirRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    width: width / 3 - 20
  },
  styTxtLabel: {
    fontFamily: 'Nunito-Regular',
    marginHorizontal: 3,
    fontSize: 12,
  },
  styWrapImg: {
    width: 20,
    height: 20,
  },
});
