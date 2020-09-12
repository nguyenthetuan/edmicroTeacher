import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Dimens from '../../constants/dimens';
import Color from '../../constants/colors';
import MyCardView from '../libs/MyCardView';
import { mainStyle } from '../../themes';
import Common from '../../utils/Common';
import themes from '../../themes/themeStyle';

export default class ItemProcess extends Component {

  render() {
    const { report, data } = this.props;
    return (
      <MyCardView>
        <View style={[mainStyle.contentCard, styles.reportItem]}>
          <Image source={Common.getIconReport(data)} style={styles.iconReport} />
          <View style={styles.userStats}>
            <View style={styles.wrReport}>
              <Text style={themes.textTitle}>{Common.getNumberProcess(data, report)}</Text>
            </View>
            <Text style={styles.textDesc}>{Common.getDescription(data)}</Text>
          </View>
        </View>
      </MyCardView>
    );
  }
}

const styles = StyleSheet.create({
  reportItem: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textNumber: {
    fontSize: Dimens.sizeTitle,
    color: Color.colorHeader,
    fontWeight: Dimens.weightHeader,
  },
  wrReport: {
    flexDirection: 'row',
  },
  descReport: {
    marginHorizontal: 5,
    alignSelf: 'center',
    fontSize: Dimens.sizeDesc,
    color: '#383838',
  },
  iconReport: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  userStats: {
    flex: 1,
    marginHorizontal: 20,
  },
  textDes: {
    color: Color.colorDescMain,
  },
  textDesc: {
    fontSize: Dimens.sizeDesc,
    color: '#383838',
  }
});

