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
  SafeAreaView
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import AppIcon from '../../../utils/AppIcon';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownStudent from './DropdownStudent';
Icon.loadFont();
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
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
    if (new Date(timeEnd).getTime() <= new Date(timeStart).getTime()) {
      props.onToast('Thời gian không hợp lệ!')
      return;
    }
    return true;
  }

  const onAssignment = async () => {
    if (validate()) {
      const body = {
        assignmentId: props.dataItem.assignmentId,
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
      } else {
        props.onToast('Có lỗi xảy ra vui lòng thử lại!')
      }
    }
  }

  return (
    <View style={styles.containerItem}>
      <View style={styles.headerItem}>
        <Text style={styles.txtTitleItem}>{props.item.name}</Text>
      </View>
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
            style={[styles.btnDate, { backgroundColor: item.timeStart ? '#cccccc' : '#D9ebf5' }]}>
            <Text numberOfLines={1} style={styles.txtContentItem}>
              {moment(timeStart).format('DD-MM-YYYY, HH:mm')}</Text>
          </TouchableOpacity>
        </View>
        {/* {isDPVisibleStart &&
          <DateTimePickerModal
            isVisible={isDPVisibleStart}
            mode='datetime'
            date={new Date(timeStart)}
            onConfirm={handleConfirmStart}
            onCancel={() => setDPVisibilityStart(false)}
          />
        } */}
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Kết thúc</Text>
          <TouchableOpacity
            onPress={() => showDatePicker(Stage.end)}
            style={styles.btnDate}>
            <Text numberOfLines={1} style={styles.txtContentItem}>
              {moment(timeEnd).format('DD-MM-YYYY, HH:mm')}</Text>
          </TouchableOpacity>
        </View>
        {/* {isDPVisibleEnd &&
          <DateTimePickerModal
            isVisible={isDPVisibleEnd}
            mode='datetime'
            date={new Date(timeEnd)}
            onConfirm={handleConfirmEnd}
            onCancel={() => setDPVisibilityEnd(false)}
          />
        } */}
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Học sinh</Text>
          <DropdownStudent
            ref={dropdownStudent}
            dataItem={item}
            style={{ width: width - 32 - 54 - 80 }}
            dropdownStyle={{ width: width - 32 - 54 - 80 }}
            options={item.students}
          />
        </View>
        <TouchableOpacity
          onPress={() => setCheck(!isCheck)}
          style={styles.btnCheckAllow}>
          <View style={styles.checkAllow}>
            {
              isCheck ? <Icon name="check" color={'#56CCF2'} size={10} /> : null
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View >
  )
}

export default class Assignment extends Component {
  state = {
    loading: true,
    data: []
  }

  async componentDidMount() {
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

  _renderListHeader = () => {
    return (
      <View style={styles.viewListHeader}>
        <Image source={require('../../../asserts/images/img_assignment.png')}
          style={styles.imgListHeader} />
      </View>
    )
  }

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
          ListHeaderComponent={this._renderListHeader}
          ListEmptyComponent={this._renderListEmpty}
          renderItem={({ item, index }) => {
            return <Item item={item}
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
    borderWidth: 1,
    borderColor: '#56CCF2',
    marginBottom: 16,
    marginHorizontal: 16
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
    paddingHorizontal: 26,
    paddingVertical: 12
  },
  txtTitleItemContent: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#000',
    width: 80
  },
  btnAssignment: {
    alignSelf: 'flex-end',
    marginTop: 11,
    width: 80,
    height: 20,
    backgroundColor: '#56CCF2',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtAssignment: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#fff'
  },
  checkAllow: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#56CCF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    borderRadius: 2,
  },
  btnCheckAllow: {
    marginStart: 80,
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  txtCheckAllow: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#828282'
  },
  viewName: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputName: {
    height: 24,
    flex: 1,
    backgroundColor: '#cccccc',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  txtContentItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#2D9CDB'
  },
  viewDate: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  btnDate: {
    height: 24,
    flex: 1,
    backgroundColor: '#D9EBF5',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8
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
