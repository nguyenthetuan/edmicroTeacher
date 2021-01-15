import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Dimensions
} from 'react-native';
import WebView from 'react-native-webview';
import MathJaxLibs from '../../../utils/WebVIewMockExample';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import RippleButton from '../../libs/RippleButton';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RFFonsize } from '../../../utils/Fonts';

const{width,height } = Dimensions.get('window');
export default class ModalMockExamComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      totalQuestion: 0,
      totalAnswer: 0,
      totalUnAnswer: 0,  
      isLoading: true,
      assignmentId: '',
      nameTest: '',
      isLoadingSubmit: false
    };
  }

  activeModal = (data) => {
    this.setState(
      {
        visible: true,
        assignmentId: data.assignmentId,
        nameTest: data.nameTest,
      },
      () => this.getDataMenu(),
    );
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  continue = () => {
    this.setState({
      visible: false,
    });
  };

  submit = async () => {
    this.setState({ isLoadingSubmit: true });
    const { assignmentId } = this.props.navigation.state.params;
    const { token } = await dataHelper.getToken();
    const { nameTest } = this.state;
    const response = await Api.submitMockExam({ token, assignmentId });
    if (response.status == 1) {
      this.setState(
        {
          visible: false,
          isLoadingSubmit: false
        },
        () => {
          this.props.navigation.navigate('MockResult', {
            assignmentId: assignmentId,
            nameTest,
            statusbar: 'light-content',
          });
        },
      );
    } else {
      this.setState({ isLoadingSubmit: false });
      Alert.alert('Thông báo', 'Nộp bài không thành công bạn vui lòng thử lại!');
    }
  };

  getDataMenu = async () => {
    const {
      assignId,
      classId,
      assignmentId,
    } = this.props.navigation.state.params;
    try {
      this.setState({ isLoading: false });
      const { token } = await dataHelper.getToken();
      const response = await Api.getMockExample({ token, assignmentId });
      if (response && response) {
        const data = response.data;
        let totalQuestion = data.length;
        let totalAnswer = 0;
        _.forEach(data, (e) => {
          if (e.status === 1 || e.status === 4) {
            totalAnswer = totalAnswer + 1;
          }
        });
        let totalUnAnswer = totalQuestion - totalAnswer;
        this.setState({
          totalAnswer,
          totalUnAnswer,
          totalQuestion,
          isLoading: true,
        });
      }
    } catch (error) { }
  };

  render() {
    const {
      visible,
      totalAnswer,
      totalUnAnswer,
      totalQuestion,
      isLoading,
      isLoadingSubmit
    } = this.state;
    return (
      <Modal visible={visible} transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({ visible: false })}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.body}>
                  {isLoading ? (
                    <>
                      <Text style={styles.textPause}>Tạm dừng</Text>
                      <View
                        style={{
                          marginTop: 22,
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={require('../../../asserts/appIcon/icReview.png')}
                          />
                          <Text style={styles.totalReview}>
                            Số câu đã trả lời
                          </Text>
                        </View>
                        <Text style={[styles.totalReview, { marginLeft: 0 }]}>
                          {totalAnswer}
                        </Text>
                      </View>
                      <View style={styles.totalAnswer}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={require('../../../asserts/appIcon/notReview.png')}
                          />
                          <Text
                            style={[styles.totalReview, { color: '#4776AD' }]}>
                            Số câu chưa trả lời
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.totalReview,
                            { marginLeft: 0, color: '#4776AD' },
                          ]}>
                          {totalUnAnswer}
                        </Text>
                      </View>
                      <View style={styles.totalAnswer}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={require('../../../asserts/appIcon/iconSum.png')}
                          />
                          <Text
                            style={[styles.totalReview, { color: '#FFD044' }]}>
                            Tổng số câu
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.totalReview,
                            { marginLeft: 0, color: '#FFD044' },
                          ]}>
                          {totalQuestion}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 34,
                        }}>
                        <Image
                          source={require('../../../asserts/appIcon/icWarning.png')}
                        />
                        <Text style={styles.titleMessage}>
                          Bạn có thể quay lại để làm tiếp{' '}
                        </Text>
                      </View>
                      <Text style={styles.contentMessage}>
                        Bạn nên kiểm tra lại bài một cách chắc chắn . Hãy cố
                        gắng hoàn thành bài thi tốt nhất việc đánh giá kết quả
                        cho bạn sẽ chính xác hơn.{' '}
                      </Text>
                      <View style={styles.footer}>
                        <TouchableOpacity
                          onPress={() => this.continue()}
                          style={styles.wrapBtnContinue}
                          disabled={isLoadingSubmit}
                        >
                          <Text style={styles.txtButon}>Tiếp tục</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.submit()}
                          style={styles.wrapBtnSubmit}
                          disabled={isLoadingSubmit}
                        >
                          {
                            !isLoadingSubmit ?
                              <Text style={styles.txtButon}>Nộp bài</Text>
                              :
                              <View style={{ width: 50 }}>
                                <ActivityIndicator size='small' color={'#FFF'} />
                              </View>
                          }
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                      <ActivityIndicator color="#2D9CDB" size='small' />
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
    height: 380,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  textPause: {
    fontFamily: 'Nunito-Regular',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2D9CDB',
  },
  totalReview: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#56BB73',
  },
  titleMessage: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#FF7C8A',
    marginLeft: 16,
  },
  totalAnswer: {
    marginTop: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  contentMessage: {
    color: '#828282',
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 9,
  },
  txtButon: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
    width: '100%',
  },
  wrapBtnSubmit: {
    height: 30,
    backgroundColor: '#F98E2F',
    borderRadius: 5,
    paddingVertical: 5,
    width:0.4*width,
    alignItems:'center'
  },
  wrapBtnContinue: {
    height: 30,
    backgroundColor: '#55B619',
    borderRadius: 5,
    width:0.4*width,
    paddingVertical: 5,
    alignItems:'center'
  }
});
