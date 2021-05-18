import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import Api from '../../../services/apiPracticeHelper';
import dataHelper from '../../../utils/dataHelper';
import _ from 'lodash';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');
import ItemInfo from '../../modals/ItemInfo';
import AppIcon from '../../../utils/AppIcon';
import shadowStyle from '../../../themes/shadowStyle';
import ZoomAnim from '../../anim/ZoomAnim';
export default class ModalMockExamStart extends Component {
  constructor(props) {
    super(props);
    const { visible } = this.props;
    this.state = {
      visible: visible,
      data: {},
      dataNvigate: {},
      isLoading: false
    };
  }

  activeModal = (data) => {
    this.setState(
      {
        visible: true,
        dataNvigate: data,
        isLoading: true
      },
      () => this.getInforMockExam(data),
    );
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  getInforMockExam = async (data) => {
    try {
      const { token } = await dataHelper.getToken();
      const response = await Api.getPracticeInfo(token, data._id);
      if (response && response.problemId) {
        this.setState({ data: response, isLoading: false });
      } else {
        throw 'Có lỗi xảy ra';
      }
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Có lỗi xảy ra. Vui lòng thử lại sau',
        [
          { text: 'Thoát', onPress: this.hideModal }
        ]
      );
    }
  };

  _startMockExam = async () => {
    const { problemId, stepIdNow, subjectId } = this.state.data;
    this.hideModal();
    this.props.navigation.navigate('MissionPlayWebView', { problemId, stepIdNow, subjectId, statusbar: 'dark-content' });
  };

  render() {
    const { visible, data, isLoading } = this.state;
    const { shadowBtn } = shadowStyle;
    return (
      <Modal visible={visible} transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({ visible: false })}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <ZoomAnim>
                <View style={styles.body}>
                  {!_.isEmpty(data) && !isLoading ? (
                    <>
                      <Text style={styles.name}>{data.title}</Text>
                      <Image source={require('../../../asserts/images/image_modalStart.png')}
                        style={{ alignSelf: 'center', marginTop: 16 }} />
                      <View style={styles.totalView}>
                        <ItemInfo number={data.totalQuestion} type={'Total'} />
                        <ItemInfo number={data.totalDurationDoing} type={'TimePratice'} />
                        <ItemInfo number={(data.speed).toFixed(2)} type={'Speed'} />
                        <ItemInfo number={(data.accuracy).toFixed(2)} type={'Acur'} />
                      </View>
                      <View style={styles.boxRow}>
                        <View style={styles.cusStatis}>
                          <View style={{ flexDirection: "row" }}>
                            <Image source={AppIcon.r_correct} style={{ alignSelf: 'center' }} />
                            <Text style={styles.txtTitle}>Số câu đúng</Text>
                          </View>
                          <Text style={styles.numberCount}>
                            {data.correctAnswer}</Text>
                        </View>
                        <View style={styles.cusStatis}>
                          <View style={{ flexDirection: "row" }}>
                            <Image source={AppIcon.r_false} style={{ alignSelf: 'center' }} />
                            <Text style={styles.txtTitle}>Số câu sai</Text>
                          </View>
                          <Text style={styles.numberCount}>{data.inCorrectAnswer}</Text>
                        </View>
                        <View style={styles.cusStatis}>
                          <View style={{ flexDirection: "row" }}>
                            <Image source={AppIcon.icon_number_of_skip} style={{ alignSelf: 'center' }} />
                            <Text style={styles.txtTitle}>Số câu bỏ qua</Text>
                          </View>
                          <Text style={styles.numberCount}>{data.totalSkip}</Text>
                        </View>

                      </View>
                      <View style={styles.wrapTime}>
                        <TouchableWithoutFeedback onPress={() => this._startMockExam()}>
                          <View style={[styles.btnStart, { ...shadowBtn }]}>
                            <Text style={styles.txtButon}>
                              Làm thử
                        </Text>
                          </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.setState({ visible: false })}>
                          <View style={[styles.btnBack, { ...shadowBtn }]}>
                            <Text style={styles.txtButon}>Quay lại</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </>
                  ) : (
                      <ActivityIndicator color="blue" />
                    )}
                </View>
              </ZoomAnim>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  body: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 13,
  },
  name: {
    fontSize: RFFonsize(18),
    lineHeight: RFFonsize(22),
    fontFamily: 'Nunito-Bold',
    color: '#2D9CDB',
    textAlign: 'center',
    marginTop: 6
  },
  message: {
    textAlign: 'center',
    marginTop: 7,
    color: '#828282',
  },
  sum: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    fontWeight: 'bold',
    color: '#FDC214',
  },
  time: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    fontWeight: 'bold',
    color: '#2D9CDB',
  },
  txtButon: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18),
    color: '#fff',
    marginVertical: 3
  },
  stylLine: {
    height: 1,
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#69D8FC',
    width: '50%',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  wrapTime: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 23,
    marginBottom: 5
  },
  btnStart: {
    backgroundColor: '#55B619',
    borderRadius: 5,
    paddingVertical: 5,
    width: 0.4 * width,
    alignItems: 'center'
  },
  btnBack: {
    backgroundColor: '#F98E2F',
    borderRadius: 5,
    width: 0.4 * width,
    alignItems: 'center',
    paddingVertical: 5,
  },
  txtTime: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    marginLeft: 9,
  },
  boxRow: {
    flexDirection: 'column',
    marginTop: 16
  },
  totalView: {
    flexDirection: 'row',
    // marginHorizontal: 16,
    alignSelf: 'center',
    marginTop: 10
  },
  cusStatis: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: 10
  },
  txtTitle: {
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    marginLeft: 10,
    alignSelf: 'center',
  },
  numberCount: {
    fontFamily: 'Nunito-Bold',
    color: '#2D9CDB',
    fontSize: RFFonsize(14),
    alignSelf: 'center'
  }
});
