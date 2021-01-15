import React, {Component} from 'react';
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
  TouchableOpacityBase,
} from 'react-native';
import WebView from 'react-native-webview';
import MathJaxLibs from '../../../utils/WebVIewMockExample';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import RippleButton from '../../libs/RippleButton';
import {isIphoneX} from 'react-native-iphone-x-helper';
import { RFFonsize } from '../../../utils/Fonts';
const message = `Bài kiểm tra vẫn chưa được hoàn thành. Bạn hãy cố gắng hoàn thành nhé!`;
const {width,height} = Dimensions.get('window');
export default class ModalMockExamStart extends Component {
  constructor(props) {
    super(props);
    const {visible} = this.props;
    this.state = {
      visible: visible,
      data: {},
      dataNvigate: {},
    };
  }

  activeModal = (data) => {
    this.setState(
      {
        visible: true,
        dataNvigate: data,
      },
      () => this.getInforMockExam(data),
    );
  };

  hideModal = () => {
    this.setState({visible: false});
  };

  getInforMockExam = async (data) => {
    try {
      const {token} = await dataHelper.getToken();
      const response = await Api.getInforMockExam({
        token,
        assignmentId: data.assignmentId,
      });
      if (response.status === 1) {
        this.setState({data: response.data});
      }
    } catch (error) {}
  };

  _startMockExam = async () => {
    const {token} = await dataHelper.getToken();
    const {dataNvigate} = this.state;
    const response = await Api.startMockExam({
      token,
      assignmentId: dataNvigate.assignmentId,
    });
    if (response.status == 1) {
      this.setState(
        {
          visible: false,
        },
        () =>
          this.props.navigation.navigate('MockExamDrawer', {
            assignId: dataNvigate.assignId,
            classId: dataNvigate.classId,
            assignmentId: dataNvigate.assignmentId,
            statusbar: 'dark-content',
          }),
      );
    }
  };

  render() {
    const {visible, data} = this.state;
    return (
      <Modal visible={visible} transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({visible: false})}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.body}>
                  {Object.keys(data).length !== 0 ? (
                    <>
                      <Text style={styles.name}>{data.name}</Text>
                      <Text style={styles.message}>{message}</Text>
                      <View style={styles.wrapTime}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={require('../../../asserts/appIcon/iconSum.png')}
                          />
                          <Text
                            style={{
                              fontFamily: 'Nunito-Regular',
                              fontSize: 12,
                              marginLeft: 9,
                            }}>
                            Tổng số câu
                          </Text>
                        </View>
                        <View style={styles.stylLine} />
                        <Text style={styles.sum}>{data.totalQuestion}</Text>
                      </View>
                      {data.assignmentType == 1 && (
                        <View style={styles.wrapTime}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={require('../../../asserts/appIcon/iconClock.png')}
                            />
                            <Text style={styles.txtTime}>
                              Thời gian làm bài
                            </Text>
                          </View>
                          <View style={styles.stylLine} />
                          <Text style={styles.time}>
                            {data.duration / 60} phút
                          </Text>
                        </View>
                      )}
                      <View style={styles.wrapTime}>
                        <TouchableOpacity
                          onPress={() => this._startMockExam()}
                          style={styles.btnStart}>
                          <Text style={styles.txtButon}>
                            {true ? 'Bắt đầu' : 'Tiếp tục'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.setState({visible: false})}
                          style={styles.btnBack}>
                          <Text style={styles.txtButon}>Quay lại</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <ActivityIndicator color="blue" />
                  )}
                </View>
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
    minHeight: height / 3,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  name: {
    fontSize: 18,
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FDC214',
  },
  time: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D9CDB',
  },
  txtButon: {
    fontSize: 14,
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
    height: 30,
    backgroundColor: '#55B619',
    borderRadius: 5,
    // paddingHorizontal: 50,
    paddingVertical: 5,
    width:0.4*width,
    alignItems:'center'
  },
  btnBack: {
    height: 30,
    backgroundColor: '#F98E2F',
    borderRadius: 5,
    // paddingHorizontal: 50,
    width:0.4*width,
    alignItems:'center',
    paddingVertical: 5,
  },
  txtTime: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginLeft: 9,
  },
});
