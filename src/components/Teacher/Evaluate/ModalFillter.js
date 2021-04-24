import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import Dropdown from '../../../utils/Dropdown';
import AppIcon from '../../../utils/AppIcon';
import { DATA_YEAR } from '../../../constants/const';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';
import HeaderNavigation from '../../common-new/HeaderNavigation';
// import Modal from 'react-native-modal';
import Modal from '../../../utils/Modal';
const { height, width } = Dimensions.get('window');
export default class ModalFillter extends Component {
  state = {
    isShowModal: false
  }

  changeStateModale = () => {
    const { isShowModal } = this.state;
    this.modalizeRef.onOpen();
    // this.setState({ isShowModal: !isShowModal });
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
        ref={ref => this.modalizeRef = ref}
        visible={isShowModal}
        modalHeight={height - height / 8}
        // title={'Tuỳ chọn'}
        closeModal={this.changeStateModale}
      >
        <View style={styles.contain}>
          <HeaderNavigation
            title={'Tuỳ chọn'}
            // onRightAction={this.changeStateModale}
            // actionIcon={require('../../../asserts/icon/icon_closeXmodal.png')}
            isShow={false}
          />
          <Text style={styles.placeText}>Năm học</Text>
          <Dropdown
            title="Năm học"
            data={DATA_YEAR}
            contentStyle={styles.contentStyle}
            onPressItem={this._selectYear}
            indexSelected={yearIndex}
          />
          <Text style={styles.placeText}>Lớp học</Text>
          <Dropdown
            title="Lớp học"
            data={classSubject}
            contentStyle={styles.contentStyle}
            onPressItem={this._selectClass}
            indexSelected={classSubjectIndex}
          />
          <Text style={styles.placeText}>Bài thi</Text>
          <Dropdown
            title="Bài thi"
            data={tests}
            onPressItem={this._selectTest}
            contentStyle={styles.contentStyle}
            indexSelected={testIndex}
          />

          <TouchableWithoutFeedback onPress={this.changeStateModale}>
            <View style={[styles.btnViewStatistic, { ...shadowBtn }]}>
              <Text style={styles.txtBtn}>Xem thống kê</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    height: height - 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
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
    marginTop: 5,
    height: 40,
    paddingLeft: 10,
    fontFamily: 'Nunito',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
  },
  btnViewStatistic: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 50,
    marginHorizontal: "30%",
    borderWidth: .5,
    borderColor: '#2D9CDB'
  },
  txtBtn: {
    color: '#2D9CDB',
    marginHorizontal: 20,
    marginVertical: 10,
    fontFamily: "Nunito",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    fontWeight: "500"
  },
  placeText: {
    fontFamily: "Nunito-LightItalic",
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18),
    color: "#A1A1A3",
    alignSelf: 'flex-start',
    paddingLeft: width * 0.05,
    marginTop: 16
  }
});
