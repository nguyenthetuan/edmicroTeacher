import React, { Component } from 'react';
import { StyleSheet, View, Image, Platform, Text, Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import RippleButton from '../libs/RippleButton';
import AppIcon from '../../utils/AppIcon';
import { RFFonsize } from '../../utils/Fonts';
const { width } = Dimensions.get('window');
export default class BackImageNavigation extends Component {

  shouldComponentUpdate = () => {
    return false;
  }

  goBackTo(navigation) {
    navigation.goBack(null);
  }

  render() {
    const { problemHiearchyId, title, subjectId } = this.props;
    return (
      <View style={homeStyle.wrapHeaderFix}>
        <RippleButton color={'white'} radius={50} size={50} duration={250}
          onPress={() => { this.goBackTo(this.props.navigation); }}
          style={homeStyle.wrapBack}>
          <Image source={AppIcon.arrow_left} style={{ width: 17, height: 15 }} />
        </RippleButton>
        <View style={homeStyle.wrapTitle}>
          <Text style={homeStyle.txtTitle} numberOfLines={1}>{title}</Text>
        </View>
        <View style={{ flexDirection: 'row', position: 'absolute', right: 0 }}>
          <RippleButton style={homeStyle.wrapIcon} color={'white'} radius={50} size={100} duration={250} onPress={() => { this.props.navigation.navigate('ReportScreen', { problemHiearchyId, title, subjectId, statusbar: 'light-content' }) }}>
            <Image source={AppIcon.report_Icon} ></Image>
          </RippleButton>
          <RippleButton style={homeStyle.wrapIcon} radius={50} size={100} duration={250} onPress={() => { this.props.navigation.navigate('LessonScreen', { problemHiearchyId, subjectId, statusbar: 'light-content' }) }}>
            <Image source={AppIcon.lesson_icon} ></Image>
          </RippleButton>
        </View>
      </View>
    );
  }
}

top = 10;
topIcon = 0;
topLogo = 0;
if (Platform.OS == 'ios') {
  top = 20;
  topIcon = 12;
  topLogo = 22;
}
if (isIphoneX()) {
  topIcon = 20;
  top = 30;
  topLogo = 42;
}

const homeStyle = StyleSheet.create({
  wrapBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  wrapIcon: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  wrapHeaderFix: {
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 5,
    height: 56,
    alignItems: 'center',
  },
  txtTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFF',
    alignSelf: 'center',
    textAlign: 'center',
    width: width / 2
  },
  wrapTitle: {
    width: '105%',
    position: 'absolute',
  }
});

