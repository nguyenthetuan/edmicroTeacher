import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import Dropdown from './Dropdown';
import AppIcon from '../../../utils/AppIcon';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import { RFFonsize } from '../../../utils/Fonts';
import Modal from '../../../utils/Modal';
import shadowStyle from '../../../themes/shadowStyle';
import HeaderNavigation from '../../common-new/HeaderNavigation';
const { width, height } = Dimensions.get('window');
export default class ModalFillter extends Component {
  constructor(props) {
    super(props);
  }

  changeStateModale = () => {
    this.modalizeRef.onOpen();
  }

  handleStatistic = () => {
    this.modalizeRef.onClose();
    this.props.handleStatistic();
  }

  render() {
    const { shadowBtn } = shadowStyle;
    const { isShow } = this.props;
    const {
      dataGade,
      dataSubject,
      dataHomeWork,
      dataClass,
      indexSelected,
      onPressItemGrade,
      onPressItemSubject,
      onPressItemHomework,
      onPressItemClass,
    } = this.props;
    return (
      <Modal
        ref={ref => this.modalizeRef = ref}
        modalHeight={height - height / 8}
      >
        <SafeAreaView style={{ backgroundColor: '#F6F7F9' }} />
        <View style={styles.contain}>
          <HeaderNavigation
            title={'Tuỳ chọn'}
            isShow={false}
          />
          <View style={[styles.wrapSelect1, { paddingTop: HEIGHT_TOPBAR, marginTop: 50 }]}>
            <View style={styles.teCoPlace}>
              <Text style={styles.placeText}>Khối</Text>
              <Dropdown
                title="Khối"
                data={dataGade}
                indexSelected={indexSelected.grade}
                onPressItem={onPressItemGrade}
                contentStyle={styles.contentDrop}
              />
            </View>
            <View style={styles.teCoPlace}>
              <Text style={styles.placeText}>Môn học</Text>
              <Dropdown
                title="Môn học"
                data={dataSubject}
                indexSelected={indexSelected.subject}
                onPressItem={onPressItemSubject}
                contentStyle={styles.contentDrop}
              />
            </View>
          </View>
          <View style={[styles.wrapSelect, { flexDirection: 'column' }]}>

            <Text style={styles.placeText}>Bài tập</Text>
            <Dropdown
              title="Bài tập"
              data={dataHomeWork}
              indexSelected={indexSelected.homework}
              onPressItem={onPressItemHomework}
              contentStyle={styles.contentStyle}
            />
            <Text style={[styles.placeText, { marginTop: 20 }]}>Lớp học</Text>
            <Dropdown
              title="Lớp"
              data={dataClass}
              indexSelected={indexSelected.class}
              onPressItem={onPressItemClass}
              contentStyle={styles.contentStyle}
            />
          </View>

          <TouchableWithoutFeedback onPress={this.handleStatistic}>
            <View style={[styles.btnViewStatistic, { ...shadowBtn }]}>
              <Text style={styles.txtBtn}>Xem thống kê</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal >
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    // backgroundColor: '#E8F6FF',
    backgroundColor: '#F6F7F9',
  },
  wrapSelect: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    width: width - 40,
    paddingHorizontal: 16,
    marginLeft: 5
  },
  wrapSelect1: {
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'space-between',
    width: width - 10,
    paddingHorizontal: 16,
    marginLeft: 5
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
    marginVertical: 10
  },
  contentStyle: {
    width: width - 40,
    marginHorizontal: 0,
    height: 40,
    borderRadius: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: "#E6EBF1",
    backgroundColor: '#fff',
    marginTop: 5
  },
  imgClose: {
    width: 25,
    height: 25,
    alignSelf: 'center'
  },
  styBtnClose: {
    right: 10,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    // top: Platform.isPad ? 30 : Platform.OS == 'ios' ? 30 : 0
  },
  styTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(16),
    lineHeight: RFFonsize(20),
    flex: 1,
  },
  contentDrop: {
    marginHorizontal: 0,
    height: 40,
    borderRadius: 8,
    fontFamily: "Nunito",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    paddingLeft: 5,
    borderWidth: 1,
    borderColor: "#E6EBF1",
    width: width * 0.4,
    backgroundColor: '#fff',
    marginTop: 5
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E8F6FF',
    top: 10,
    width: "55%",
    // marginLeft: Platform.isPad ? "45%" : Platform.OS == 'ios' ? "45%" : 0
    // top: Platform.isPad ? 10 : Platform.OS == 'ios' ? 30 : 0
  },
  teCoPlace: {
    flexDirection: 'column'
  },
  placeText: {
    fontFamily: "Nunito-LightItalic",
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18),
    color: "#A1A1A3"
  }
});
