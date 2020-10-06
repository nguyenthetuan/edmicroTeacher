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
const { width } = Dimensions.get('window');
export default class ModalFillter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false
    }
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

  handleStatistic = () => {
    this.changeStateModale();
    this.props.handleStatistic();
  }

  render() {
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
      <Modal transparent={false} visible={isShowModal}>
        <TouchableWithoutFeedback
          onPressOut={this.changeStateModale}>
          <View style={styles.contain}>
            <SafeAreaView />
            <View style={{flexDirection:'row',}}>
              <Text style={styles.styTitle}>Tuỳ chọn</Text>
            </View>
              <TouchableOpacity style={styles.styBtnClose} onPress={this.changeStateModale}>
                <Image source={AppIcon.close_img} resizeMode={'contain'} style={styles.imgClose} />
              </TouchableOpacity>
            <View style={[styles.wrapSelect, { paddingTop: HEIGHT_TOPBAR }]}>
              <Dropdown
                title="Khối"
                data={dataGade}
                indexSelected={indexSelected.grade}
                onPressItem={onPressItemGrade}
                contentStyle={{ marginHorizontal: 0 }}
              />
              <Dropdown
                title="Môn học"
                data={dataSubject}
                indexSelected={indexSelected.subject}
                onPressItem={onPressItemSubject}
                contentStyle={{ marginHorizontal: 0 }}
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

            <TouchableOpacity style={styles.btnViewStatistic} onPress={this.handleStatistic}>
              <Text style={styles.txtBtn}>Xem thống kê</Text>
              <Icon name='angle-right' size={20} color={'#FFF'} />
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
    alignItems: 'center',
    paddingHorizontal: 40,

  },
  wrapSelect: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    width: width - 80,
  },
  btnViewStatistic: {
    backgroundColor: '#2D9CDB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 3,
    marginTop: 50
  },
  txtBtn: {
    color: '#FFF',
    marginHorizontal: 20,
    marginVertical: 5
  },
  contentStyle: {
    marginVertical: 10,
    width: width - 80,
    marginHorizontal: 0
  },
  imgClose: {
    width: 25,
    height: 25
  },
  styBtnClose: {
    position: 'absolute',
    right: 10,
    top:Platform.isPad?30:Platform.OS=='ios'?50:0
  },
  styTitle: {
    fontFamily: 'Nunito-Bold',
    marginTop: 20,
    fontSize: 16
  }
});
