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
    return (
      <Modal visible={visible} transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({ visible: false })}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={styles.body}>
                {!_.isEmpty(data) && !isLoading ? (
                  <>
                    <Text style={styles.name}>{data.title}</Text>
                    {/* <View style={styles.wrapTime}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          source={require('../../../asserts/appIcon/iconSum.png')}
                        />
                        <Text
                          style={{
                            fontFamily: 'Nunito-Regular',
                            fontSize: RFFonsize(12),
                            marginLeft: 9,
                          }}>
                          Tổng số câu
                          </Text>
                      </View>
                      <View style={styles.stylLine} />
                      <Text style={styles.sum}>{data.totalQuestion}</Text>
                    </View> */}
                    <View>
                      <ItemInfo number={data.totalQuestion} type={'Total'} />
                      <ItemInfo number={data.correctAnswer} type={'True'} />
                      <ItemInfo number={data.inCorrectAnswer} type={'False'} />
                      <ItemInfo number={data.totalSkip} type={'Skip'} />
                      <ItemInfo number={data.speed} type={'Speed'} />
                      <ItemInfo number={data.totalDurationDoing} type={'TimePratice'} />
                      <ItemInfo number={data.accuracy} type={'Acur'} />
                    </View>
                    <View style={styles.wrapTime}>
                      <TouchableOpacity
                        onPress={() => this._startMockExam()}
                        style={styles.btnStart}>
                        <Text style={styles.txtButon}>
                          {/* {data.status == 0 ? 'Bắt đầu' : 'Tiếp tục'} */}
                          Làm thử
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({ visible: false })}
                        style={styles.btnBack}>
                        <Text style={styles.txtButon}>Quay lại</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                    <ActivityIndicator color="blue" />
                  )}
              </View>
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
    alignItems: 'center',
    padding: 13,
  },
  name: {
    fontSize: RFFonsize(18),
    fontFamily: 'Nunito-Regular',
    color: '#2D9CDB',
    fontWeight: 'bold',
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
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Regular',
    color: '#fff',
    fontWeight: 'bold',
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
  },
  btnStart: {
    height: 35,
    backgroundColor: '#55B619',
    borderRadius: 5,
    // paddingHorizontal: 50,
    paddingVertical: 5,
    width: 0.4 * width,
    alignItems: 'center'
  },
  btnBack: {
    height: 35,
    backgroundColor: '#F98E2F',
    borderRadius: 5,
    // paddingHorizontal: 50,
    width: 0.4 * width,
    alignItems: 'center',
    paddingVertical: 5,
  },
  txtTime: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    marginLeft: 9,
  },
});
