import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import Dropdown from '../../../utils/Dropdown';
import AppIcon from '../../../utils/AppIcon';
import { DATA_YEAR } from '../../../constants/const';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';
import HeaderNavigation from '../../common-new/HeaderNavigation';

export default class ModalFillter extends Component {
  state = {
    isShowModal: false
  }

  changeStateModale = () => {
    const { isShowModal } = this.state;
    if (!isShowModal) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
    this.setState({ isShowModal: !isShowModal });
  }

  _selectYear = (index, item) => {
    this.props.fillter('yearIndex', index);
  };

  _selectClass = (index, item) => {
    this.props.fillter('classSubjectIndex', index);
  };

  _selectTest = (index, item) => {
    this.props.fillter('testIndex', index);
  };

  render() {
    const { shadowBtn } = shadowStyle;
    const { payload } = this.props;
    const {
      yearIndex,
      classSubject,
      tests,
      classSubjectIndex,
      testIndex,
    } = payload;
    const { isShowModal } = this.state;
    return (
      <Modal
        visible={isShowModal}
        animationType={'slide'}
        transparent={false}
        presentationStyle={'formSheet'}
      >
        <TouchableWithoutFeedback onPressOut={this.changeStateModale}>
          <View style={styles.contain}>
            {/* <View style={styles.wrapBtn}>
              <TouchableOpacity onPress={this.changeStateModale} style={styles.wrapClose}>
                <Image
                  source={AppIcon.close_img}
                  resizeMode={'stretch'}
                  style={styles.styClose}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.txtHeader}>Tuỳ chọn</Text> */}
            <HeaderNavigation
              title={'Tuỳ chọn'}
              onRightAction={this.changeStateModale}
              actionIcon={AppIcon.close_img}
              isShow={false}
            />
            <Dropdown
              title="Năm học"
              data={DATA_YEAR}
              contentStyle={styles.contentStyle}
              onPressItem={this._selectYear}
              indexSelected={yearIndex}
            />
            <Dropdown
              title="Lớp học"
              data={classSubject}
              contentStyle={styles.contentStyle}
              onPressItem={this._selectClass}
              indexSelected={classSubjectIndex}
            />
            <Dropdown
              title="Bài thi"
              data={tests}
              onPressItem={this._selectTest}
              contentStyle={styles.contentStyle}
              indexSelected={testIndex}
            />

            <TouchableOpacity style={[styles.btnViewStatistic, { ...shadowBtn }]} onPress={this.changeStateModale}>
              <Text style={styles.txtBtn}>Xem thống kê</Text>
              {/* <Icon name='angle-right' size={20} color={'#FFF'} /> */}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#E8F6FF',
    alignItems: 'center'
  },
  txtHeader: {
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    fontSize: RFFonsize(18),
    color: '#4776AD',
  },
  styClose: {
    width: 25,
    height: 25,
    top: 10,
    right: 5
  },
  wrapClose: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapBtn: {
    alignItems: 'flex-end',
    width: '100%'
  },
  contentStyle: {
    width: '90%',
    borderRadius: 5,
    marginTop: 30,
    height: 35,
    paddingLeft: 10,
    fontFamily: 'Nunito',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
  },
  btnViewStatistic: {
    backgroundColor: '#2D9CDB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 50,
  },
  txtBtn: {
    color: '#FFF',
    marginHorizontal: 20,
    marginVertical: 10,
    fontFamily: "Nunito",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    fontWeight: "500"
  },
});
