import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import {getIconSubject} from '../../../utils/Common';
export default class ItemMission extends Component {
  renderElement = (img, txt1, txt2) => {
    return (
      <View style={styles.styFlexDirRow}>
        <Image source={img} resizeMode={'contain'} style={styles.styWrapImg} />
        <Text style={styles.styTxtLabel}>{txt1}</Text>
        <Text style={styles.styTxtLabel}>{txt2}</Text>
      </View>
    );
  };

  render() {
    const {data} = this.props;
    return (
      <TouchableOpacity style={styles.contain}>
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
            {this.renderElement('')}
            {this.renderElement(AppIcon.icon_handing, 'Đã giao')}
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
  },
  styFlexDirRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
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
