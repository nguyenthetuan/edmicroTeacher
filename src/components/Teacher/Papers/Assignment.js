import React, { Component, useState, useRef, useEffect, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import AppIcon from '../../../utils/AppIcon';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownStudent from './DropdownStudent';
import { RFFonsize } from '../../../utils/Fonts';
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
import ModalSelectStudent from './ModalSelectStudent';
import { connect } from 'react-redux';
import { updateExamListAction } from '../../../actions/paperAction';
// import classIcon from '../../../asserts/appIcon/icon_class.png';
import shadowStyle from '../../../themes/shadowStyle';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AwesomeButton from 'react-native-really-awesome-button';
import ToastSuccess from '../../common-new/ToastSuccess';
import ToastFaild from '../../common-new/ToastFaild';
import ToastApi from '../../common-new/ToastApi';
import { ButtonLoading } from '../../common/ButtonBeta';
const { width, height } = Dimensions.get('screen');
const horizontalMargin = 10;
const slideWidth = width - 95;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = height;


const Stage = {
  begin: 1,
  end: 2,
  activeSlide: 1
}

function Item(props) {
  const { shadowBtn } = shadowStyle;
  const pickStudent = useRef();
  const item = props.item;
  let [stage, setStage] = useState(Stage.begin);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
  let student = item.students.length;
  const [isCheck, setCheck] = useState(item.permissionViewResult === 1);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showPickSutdent, setShowPickSutdent] = useState(false);
  const [buttonText, setButtonText] = useState(student ? `${student} học sinh` : 'Tất cả học sinh');

  // useEffect(() => {
  //   setIsDisable(false);
  // }, [shadowBtn])


  const showDatePicker = (stage) => {
    setStage(stage);
    setDatePickerVisibility(true);
  };

  const handlePickStudent = (text) => {
    setShowPickSutdent(!showPickSutdent);
    if (text) {
      // alert(text);
      setButtonText(text);
    }
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  checkDisable = (date) => {
    if (date > Date.now() && date > item.timeEnd * 1000 && date !== timeEnd) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }

  const handleConfirm = (date) => {
    if (_ = stage == Stage.begin) {
      setTimeStart(date);
    } else {
      setTimeEnd(date);
      checkDisable(date);
    }
    hideDatePicker();
  };

  const validate = () => {
    if (isDisable) {
      return false;
    }
    if (moment(timeStart).format('DD-MM-YYYY, HH:mm') === moment(timeEnd).format('DD-MM-YYYY, HH:mm')) {
      props.onToast(
        <ToastFaild title="Thời gian không hợp lệ!" />
      )
      return false
    }
    if (timeEnd < Date.now()) {
      props.onToast(
        <ToastFaild title="Thời gian không hợp lệ!" />
      )
      return false
    }
    return true;
  }

  onShowToast = () => {
    props.onRefToast((<ToastApi title={"Giao bài thành công!"} />), 3000);
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
          students: pickStudent.current.students()
        }]
      }

      const { token } = await dataHelper.getToken();
      if (token) {
        setIsLoading(true);
        try {
          const response = await apiPapers.assignment({
            token,
            body
          })
          setIsLoading(false);
          if (response && response.status === 1) {
            // props.onToast('Giao bài thành công!');
            props.onRefToast((<ToastApi title={"Giao bài thành công!"} />), 3000);
            props.getData(true);
            props.needUpdate(true);
            setIsDisable(true);
            const { subjectCode = '', gradeCode = '' } = props.navigation.state.params.payloadAssignment;
            AnalyticsManager.trackWithProperties('School Teacher', {
              action: 'ASSIGNMENT',
              mobile: Platform.OS,
              grade: gradeCode,
              subject: subjectCode
            });
          } else {
            props.onToast(<ToastFaild title="Có lỗi xảy ra vui lòng thử lại!" />)
          }
        } catch (error) {
          setIsLoading(false);
        }

      } else {
        props.onToast(<ToastFaild title="Có lỗi xảy ra vui lòng thử lại!" />)
      }
    }
  }

  return (
    <View style={styles.containerItem}>
      <View style={styles.contentItem}>
        <View style={[styles.boxStatus, {
          backgroundColor: props.item.isAssign ? 'green' : '#FF5242',
        }]}>
          <Text style={{
            fontFamily: 'Nunito',
            color: '#fff',
            fontSize: RFFonsize(14)
          }}>{props.item.isAssign ? 'Đã giao' : 'Chưa giao'}</Text>
        </View>
        <View style={styles.viewName}>
          <Text numberOfLines={1} style={styles.titleClass}>{props.item.name}</Text>
        </View>
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Ngày bắt đầu</Text>
          <TouchableWithoutFeedback
            disabled={item.timeStart}
            onPress={() => showDatePicker(Stage.begin)}
          >
            <View
              style={[styles.btnDate, { backgroundColor: item.timeStart ? '#f0f0f0' : '#f0f0f0' }]}>
              <Text numberOfLines={1} style={styles.txtContentItem}>
                {moment(timeStart).format('DD-MM-YYYY, HH:mm A')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Ngày kết thúc</Text>
          <TouchableWithoutFeedback
            onPress={() => showDatePicker(Stage.end)}
          >
            <View style={styles.btnDate}>
              <Text numberOfLines={1} style={styles.txtContentItem}>
                {moment(timeEnd).format('DD-MM-YYYY, HH:mm A')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.viewDate}>
          <Text style={styles.txtTitleItemContent}>Học sinh được giao bài tập</Text>
          <TouchableWithoutFeedback onPress={() => { handlePickStudent() }}>
            <View style={styles.dropZuCha}>
              <View style={styles.borDropRight}>
                <Icon name={showPickSutdent ? "chevron-up" : "chevron-down"} color={'#fff'} size={13} />
              </View>
              <Text style={{ color: '#2D9CDB', left: 15 }}>{buttonText}</Text>
            </View>
          </TouchableWithoutFeedback>
          <ModalSelectStudent
            ref={pickStudent}
            dataItem={item}
            style={{ width: width - 32, marginTop: 8, height: 40, }}
            dropdownStyle={{ width: width - 32 }}
            options={item.students}
            visibleModal={showPickSutdent}
            handlePickStudent={handlePickStudent}
          />
        </View>
        <TouchableWithoutFeedback onPress={() => setCheck(!isCheck)}>
          <View
            style={styles.btnCheckAllow}>
            <View style={styles.checkAllow}>
              {
                isCheck ? <Icon name="check" color={'#56CCF2'} size={18} /> : null
              }
            </View>
            <Text style={styles.txtCheckAllow}>Chỉ cho phép xem kết quả khi hết hạn</Text>
          </View>
        </TouchableWithoutFeedback>
        <ButtonLoading
          title='Giao bài'
          buttonStyle={[styles.AweBtn, { height: 45, width: 200, padding: 0, backgroundColor: isDisable ? '#DADADA' : '#2D9DFE' }]}
          textStyle={styles.txtAssignment}
          color={isDisable ? '#DADADA' : '#2D9DFE'}
          bgColor='#642ED'
          onPress={onAssignment}
          disabled={true}
          isLoading={isLoading}
          rippleSize={isDisable ? 1 : 200}
        />

      </View>
      {/* {__DEV__ ? null : */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        date={stage === Stage.begin ? timeStart : timeEnd}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {/* } */}
    </View >
  )
}

class Assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    }
    this.dataItem = {};
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  async getData(isLoading) {
    if (isLoading) {
      await this.setState({ loading: true });
    }
    const dataItem = this.props.navigation.state.params.item;
    const { token } = await dataHelper.getToken();
    if (token) {
      const response = await apiPapers.getAssignment({
        token,
        assignmentId: dataItem.id || dataItem.assignmentId
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
        <Text style={styles.txtNotFound}>Không tìm lớp giao bài.</Text>
      </View>
    )
  }

  onToast = (text) => {
    this.toast.show(text)
  }
  onRefToast = (text, duaration = 2000) => {
    this.refToast.show(text, duaration)
  }

  _handleGoBack = () => {
    try {
      this._carousel?.snapToItem(0);
      this.timeMount = setTimeout(() => {
        const pop = this.props.navigation.state.params.pop;
        if (pop) {
          Globals.updatePaper();
          this.props.navigation.pop(pop);
        } else {
          this.props.navigation.goBack();
        }
      }, 350);
    } catch (error) {
      console.log(error);
      this.props.navigation.goBack();
    }
  }

  componentWillUnmount() {
    if (this.timeMount != null) {
      clearTimeout(this.timeMount);
      this.timeMount = null;
    }
  }



  render() {
    const { data, loading, activeSlide } = this.state;
    const dataItem = this.props.navigation.getParam('item');
    const backgroundColor = this.props;
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.container} />
        <HeaderNavigation
          // goBack={() => {
          //   try {
          //     this._carousel.snapToItem(0);
          //     this.timeMount = setTimeout(() => {
          //       this.props.navigation.goBack();
          //     }, 350);
          //   } catch (error) {
          //     this.props.navigation.goBack();
          //   }
          // }}
          goBack={this._handleGoBack}
          backgroundColor={'#359CDB'}
          color={'#fff'}
          title={dataItem.name}
          navigation={this.props.navigation}
          iconAction={() => { this.props.navigation.pop(4) }}
        />
        {
          loading ? <ActivityIndicator style={{ flex: 1 }} /> : (data && data.length > 0)
            ?
            <>
              <Pagination
                dotsLength={data.length}
                activeDotIndex={activeSlide || 0}
                containerStyle={{
                  height: height * 0.1
                }}
                dotStyle={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: '#359CDB',
                }}
                inactiveDotStyle={{
                  backgroundColor: '#c4c4c4'
                }}
                inactiveDotOpacity={0.6}
                inactiveDotScale={0.7}
              />
              <Carousel
                ref={(c) => { this._carousel = c; }}
                layout={'default'}
                layoutCardOffset={14}
                data={data}
                renderItem=
                {({ item, index }) => {
                  return <Item
                    item={item}
                    navigation={this.props.navigation}
                    onToast={(text) => this.onToast(text)}
                    onRefToast={(text, duration) => this.onRefToast(text, duration)}
                    dataItem={dataItem}
                    getData={this.getData}
                    needUpdate={this.props.needUpdate}
                  />
                }}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
                activeSlideOffset={1}
                inactiveSlideOpacity={0.7}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                loopClonesPerSide={2}
                autoplayDelay={500}
                autoplayInterval={3000}
                activeAnimationType='spring'
                activeSlideAlignment='center'
                onSnapToItem={(index) => this.setState({ activeSlide: index })}
              />

            </>
            :
            this._renderListEmpty()
        }
        <Toast ref={(ref) => (this.refToast = ref)} position={'top'} style={styles.styleTostSuccess} />
        <Toast ref={(ref) => (this.toast = ref)} position={'top'} />
        <SafeAreaView />
      </View >
    )
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    needUpdate: (payload) => dispatch(updateExamListAction(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Assignment);


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#359CDB'
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
    fontSize: RFFonsize(16),
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
    // marginTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flex: 1,
    // backgroundColor: "#fff"
  },
  headerItem: {
    height: 30,
    backgroundColor: '#56CCF2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtTitleItem: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#fff',
    textTransform: 'capitalize'
  },
  contentItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5
  },
  txtTitleItemContent: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18),
    color: '#828282',
    marginTop: 10
  },
  btnAssignment: {
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: '#2D9CDB',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  AweBtn: {
    alignSelf: 'center',
    marginTop: "10%",
    marginBottom: '20%',
  },
  txtAssignment: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(16),
    lineHeight: RFFonsize(20),
    fontWeight: '500',
    color: '#fff',
    // marginLeft: 50,
    // marginRight: 50,
    // marginTop: 6,
    // marginBottom: 6
  },
  checkAllow: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#56CCF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    borderRadius: 4,
  },
  btnCheckAllow: {
    flexDirection: 'row',
    marginTop: 18,
    alignItems: 'center',
    alignSelf: 'flex-end',

  },
  txtCheckAllow: {
    fontFamily: 'Nunito-LightItalic',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    color: '#2D9CDB'
  },
  viewName: {
    flexDirection: 'column',
  },
  inputName: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 5,
    borderWidth: 0.5,
    borderColor: '#56CCF2',
  },
  txtContentItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    color: '#2D9CDB',
    marginLeft: 10
  },
  titleClass: {
    fontFamily: 'Nunito-SemiBoldItalic',
    fontSize: RFFonsize(18),
    lineHeight: RFFonsize(22),
    color: '#2D9CDB',
    alignSelf: 'center',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0.8,
    textShadowColor: '#f0f0f0',
    marginTop: 6,
    marginBottom: 10
  },
  viewDate: {
    flexDirection: 'column',
    marginTop: 5,
  },
  btnDate: {
    height: 40,
    backgroundColor: 'rgba(86, 204, 242, 0.2)',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 5,
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
    fontSize: RFFonsize(14),
    color: '#000',
    marginTop: 20,
    color: '#828282',
  },
  dropZuCha: {
    marginTop: 5,
    height: 40,
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: 'rgba(86, 204, 242, 0.2)',
    borderColor: '#56CCF2',
    justifyContent: 'center'
  },
  borDropRight: {
    width: 40,
    height: 40,
    backgroundColor: '#56CCF2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5
  },
  slider: {
    overflow: 'visible'
  },
  sliderContentContainer: {
    paddingVertical: 10
  },
  styleTostSuccess: {
    flex: 1,
    height: 70,
    width: 280,
    backgroundColor: '#16BDA9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: "center",
    borderRadius: 10,
  },
  styleWarning: {
    flex: 1,
    height: 60,
    width: width - 90,
    backgroundColor: '#16BDA9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: "center",
    borderRadius: 10,
  },
  txtSuccess: {
    color: '#fff',
    fontFamily: "Nunito-Bold",
    fontSize: RFFonsize(13),
    lineHeight: RFFonsize(17)
  },
  xstoast: {
    fontFamily: "Nunito",
    fontSize: RFFonsize(12),
    color: "#fff",
    top: -12,
    right: 10
  },
  boxStatus: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    paddingVertical: 2
  }
})
