import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  Platform
} from 'react-native';
import Dropdown from './Dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppIcon from '../../../utils/AppIcon';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';
import HeaderNavigation from '../../common-new/HeaderNavigation';
const { width } = Dimensions.get('window');
export default class ModalFillter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
    }
  }

  changeStateModale = () => {
    const { isShowModal } = this.state;
    if (!isShowModal) {
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('light-content');
    }
    this.setState({ isShowModal: !isShowModal });
  }

  handleStatistic = () => {
    this.changeStateModale();
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
    const { isShowModal } = this.state;
    return (
      <Modal transparent={false} visible={isShowModal} tintColor='#000'>
        <SafeAreaView style={{ backgroundColor: '#E8F6FF' }} />
        <View style={styles.contain}>
          {/* <View style={styles.headerNav}>
            <Text style={styles.styTitle}>Tuỳ chọn</Text>
            <TouchableOpacity style={styles.styBtnClose} onPress={this.changeStateModale}>
              <Image source={AppIcon.close_img} resizeMode={'contain'} style={styles.imgClose} />
            </TouchableOpacity>
          </View> */}
          <HeaderNavigation
            title={'Tuỳ chọn'}
            onRightAction={this.changeStateModale}
            actionIcon={AppIcon.close_img}
            isShow={false}
          />
          <View style={[styles.wrapSelect1, { paddingTop: HEIGHT_TOPBAR, marginTop: 50 }]}>
            <Dropdown
              title="Khối"
              data={dataGade}
              indexSelected={indexSelected.grade}
              onPressItem={onPressItemGrade}
              contentStyle={styles.contentDrop}
            />
            <Dropdown
              title="Môn học"
              data={dataSubject}
              indexSelected={indexSelected.subject}
              onPressItem={onPressItemSubject}
              contentStyle={styles.contentDrop}
            />
          </View>
          <View style={[styles.wrapSelect, { flexDirection: 'column' }]}>
            <Dropdown
              title="Bài tập"
              data={dataHomeWork}
              indexSelected={indexSelected.homework}
              onPressItem={onPressItemHomework}
              contentStyle={styles.contentStyle}
            />
            <Dropdown
              title="Lớp"
              data={dataClass}
              indexSelected={indexSelected.class}
              onPressItem={onPressItemClass}
              contentStyle={styles.contentStyle}
            />
          </View>

          <TouchableOpacity style={[styles.btnViewStatistic, { ...shadowBtn }]} onPress={this.handleStatistic}>
            <Text style={styles.txtBtn}>Xem thống kê</Text>
            {/* <Icon name='angle-right' size={20} color={'#FFF'} /> */}
          </TouchableOpacity>
        </View>
      </Modal >
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#E8F6FF',
  },
  wrapSelect: {
    flexDirection: 'row',
    marginVertical: 8,
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
    backgroundColor: '#2D9CDB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 50,
    marginHorizontal: "30%"
  },
  txtBtn: {
    color: '#FFF',
    marginHorizontal: 20,
    marginVertical: 10
  },
  contentStyle: {
    marginVertical: 16,
    width: width - 40,
    marginHorizontal: 0,
    height: 35,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5
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
    height: 35,
    borderRadius: 5,
    fontFamily: "Nunito",
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    paddingLeft: 5
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
});
