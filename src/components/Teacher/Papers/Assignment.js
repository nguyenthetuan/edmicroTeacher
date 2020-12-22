import React, { Component, useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Alert
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import AppIcon from '../../../utils/AppIcon';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownStudent from './DropdownStudent';
Icon.loadFont();
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import dataHelper from '../../../utils/dataHelper';
import apiPapers from '../../../services/apiPapersTeacher';
import Toast, { DURATION } from 'react-native-easy-toast';
import AnalyticsManager from '../../../utils/AnalyticsManager';
import Globals from '../../../utils/Globals';
import { MaterialKeyBoard } from '../../common/Material';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import HeaderNavigation from '../../common-new/HeaderNavigation';
const { width, height } = Dimensions.get('screen');

const Stage = {
  begin: 1,
  end: 2
}

function Item(props) {
  const dropdownStudent = useRef();
  const item = props.item;
  let [stage, setStage] = useState(Stage.begin);

  const [timeStart, setTimeStart] = useState(
    item.timeStart
      ? item.timeStart * 1000
      : new Date().getTime()
  );
  const [timeEnd, setTimeEnd] = useState(
    item.timeEnd
      ? item.timeEnd * 1000
      : new Date().getTime()
  );
  const [isCheck, setCheck] = useState(item.permissionViewResult === 1);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = (stage) => {
    setStage(stage);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", stage);
    if (_ = stage == Stage.begin) {
      setTimeStart(date);
    } else {
      setTimeEnd(date);
    }
    hideDatePicker();
  };

  const validate = () => {
    if (moment(timeStart).format('DD-MM-YYYY, HH:mm') === moment(timeEnd).format('DD-MM-YYYY, HH:mm')) {
      props.onToast('Thời gian không hợp lệ!')
      return false
    }
    if (timeEnd < Date.now()) {
      props.onToast('Thời gian không hợp lệ!')
      return false
    }
    return true;
  }

  const onAssignment = async () => {
    if (validate()) {
      const body = {
        assignmentId: props.dataItem.assignmentId || props.dataItem.id,
        timeEnd: moment(timeEnd).unix(),
        timeStart: moment(timeStart).unix(),
        name: props.dataItem.name,
        data: [{
          classId: item.classCode,
          permissionViewResult: isCheck ? 1 : 0,
          students: dropdownStudent.current.students()
        }]
      }

      const { token } = await dataHelper.getToken();
      if (token) {
        try {
          const response = await apiPapers.assignment({
            token,
            body
          })
          if (response && response.status === 1) {
            props.onToast('Giao bài thành công!');
            const { subjectCode = '', gradeCode = '' } = props.navigation.state.params.payloadAssignment;
            AnalyticsManager.trackWithProperties('School Teacher', {
              action: 'ASSIGNMENT',
              mobile: Platform.OS,
              grade: gradeCode,
              subject: subjectCode
            });
          } else {
            props.onToast('Có lỗi xảy ra vui lòng thử lại!')
          }
        } catch (error) {
        }

      } else {
        props.onToast('Có lỗi xảy ra vui lòng thử lại!')
      }
    }
  }

  return (
    <View style={styles.containerItem}>
      {/* <View style={styles.headerItem}>
        <Text style={styles.txtTitleItem}>{props.item.name}</Text>
      </View> */}
      <View style={styles.contentItem}>
        <View style={styles.viewName}>
          <Text style={styles.txtTitleItemContent}>Tên bài tập</Text>
          <View style={styles.inputName}>
            <Text numberOfLines={1} style={styles.txtContentItem}>{props.dataItem.name}</Text>
          </View>
        </View>
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Bắt đầu</Text>
          <TouchableOpacity
            disabled={item.timeStart}
            onPress={() => showDatePicker(Stage.begin)}
            style={[styles.btnDate, { backgroundColor: item.timeStart ? 'rgba(86, 204, 242, 0.2)' : '#fa915c' }]}>
            <Text numberOfLines={1} style={styles.txtContentItem}>
              {moment(timeStart).format('DD-MM-YYYY, HH:mm')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Kết thúc</Text>
          <TouchableOpacity
            onPress={() => showDatePicker(Stage.end)}
            style={styles.btnDate}>
            <Text numberOfLines={1} style={styles.txtContentItem}>
              {moment(timeEnd).format('DD-MM-YYYY, HH:mm')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Học sinh</Text>
          <DropdownStudent
            ref={dropdownStudent}
            dataItem={item}
            style={{ width: width - 32, marginTop: 8, height: 40, }}
            dropdownStyle={{ width: width - 32 }}
            options={item.students}
          />
        </View>
        <TouchableOpacity
          onPress={() => setCheck(!isCheck)}
          style={styles.btnCheckAllow}>
          <View style={styles.checkAllow}>
            {
              isCheck ? <Icon name="check" color={'#56CCF2'} size={18} /> : null
            }
          </View>
          <Text style={styles.txtCheckAllow}>Chỉ cho phép xem kết quả khi hết hạn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAssignment}
          style={styles.btnAssignment}>
          <Text style={styles.txtAssignment}>Giao bài</Text>
        </TouchableOpacity>
      </View>
      {__DEV__ ? null : <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />}

    </View >
  )
}

export default class Assignment extends Component {
  state = {
    loading: true,
    data: []
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const dataItem = this.props.navigation.getParam('item');
    const { token } = await dataHelper.getToken();
    if (token) {
      const response = await apiPapers.getAssignment({
        token,
        assignmentId: dataItem.id
      })
      if (response && response.status === 1) {
        this.setState({
          data: response.data,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }
    } else {
      this.setState({
        loading: false
      })
    }
  }

  // _renderListHeader = () => {
  //   return (
  //     <View style={styles.viewListHeader}>
  //       <Image source={require('../../../asserts/images/img_assignment.png')}
  //         style={styles.imgListHeader} />
  //     </View>
  //   )
  // }

  _renderListEmpty = () => {
    const { loading } = this.state;
    return (
      <View style={styles.viewNotFound}>
        <Image source={require('../../../asserts/icon/iconNodata.png')} />
        <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
      </View>
    )
  }

  onToast = (text) => {
    this.refs.toast.show(text, DURATION.LENGTH_LONG);
  }

  _handleGoBack = () => {
    if (this.props.navigation.state.params.checked) {
      Globals.updatePaper();
      this.props.navigation.replace('QuestionLibrary')
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    const { data } = this.state;
    const dataItem = this.props.navigation.getParam('item');
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.container} />
        <HeaderNavigation
          backgroundColor={'#56CCF2'}
          color={'#fff'}
          title={dataItem.name}
          navigation={this.props.navigation}
          goBack={() => this._handleGoBack()}
        />
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={data}
          style={{ backgroundColor: '#fff' }}
          keyExtractor={(item, index) => index.toString()}
          // ListHeaderComponent={this._renderListHeader}
          ListEmptyComponent={this._renderListEmpty}
          renderItem={({ item, index }) => {
            return <Item
              item={item}
              navigation={this.props.navigation}
              onToast={(text) => this.onToast(text)}
              dataItem={dataItem}
            />
          }}
        />
        <Toast ref="toast" position={'bottom'} />
        <SafeAreaView />
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#56CCF2'
  },
  wrapHeader: {
    flexDirection: 'row',
    width,
    justifyContent: 'space-between',
    backgroundColor: '#56CCF2',
    paddingTop: HEIGHT_TOPBAR + 10,
    paddingHorizontal: 20
  },
  btnBack: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  imgBack: {
    width: 14,
    height: 12
  },
  txtBack: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
  viewEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200
  },
  viewListHeader: {
    width,
    height: 170 + getStatusBarHeight(),
    backgroundColor: '#56CCF2',
    marginBottom: 16
  },
  imgListHeader: {
    position: 'absolute',
    bottom: 0,
    right: 20
  },
  containerItem: {
    borderRadius: 5,
    marginBottom: 16,
    marginTop: 16
  },
  headerItem: {
    height: 30,
    backgroundColor: '#56CCF2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtTitleItem: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#fff',
    textTransform: 'capitalize'
  },
  contentItem: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  txtTitleItemContent: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    lineHeight: 19,
    color: '#828282',
  },
  btnAssignment: {
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: '#2D9CDB',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtAssignment: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 76,
    marginRight: 76,
    marginTop: 14,
    marginBottom: 14
  },
  checkAllow: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#56CCF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    borderRadius: 2,
  },
  btnCheckAllow: {
    flexDirection: 'row',
    marginTop: 18,
    alignItems: 'center',
    alignSelf: 'flex-end',

  },
  txtCheckAllow: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#2D9CDB'
  },
  viewName: {
    flexDirection: 'column',
  },
  inputName: {
    height: 40,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: '#56CCF2',
  },
  txtContentItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#2D9CDB',
    marginLeft: 10
  },
  viewDate: {
    flexDirection: 'column',
    marginTop: 10,
  },
  btnDate: {
    height: 40,
    flex: 1,
    backgroundColor: 'rgba(86, 204, 242, 0.2)',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: '#56CCF2'
  },
  viewNotFound: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNotFound: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#000',
    marginTop: 20,
    color: '#828282',
  },
})
