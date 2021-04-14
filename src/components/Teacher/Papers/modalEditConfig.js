import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Animated,
  Keyboard,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import apiPapers from '../../../services/apiPapersTeacher';
import _ from 'lodash';
import Toast, { DURATION } from 'react-native-easy-toast';
import dataHelper from '../../../utils/dataHelper';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');

export default class ModalConfigPaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      grade: '',
      subject: '',
      time: '',
      gradeCode: [],
      listGrades: [],
      subjectCode: [],
      listSubjects: [],
      updating: false,
      loading: false,
      message: '',
    };
    this.paddingInput = new Animated.Value(16);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = event => {
    Animated.timing(this.paddingInput, {
      duration: event.duration,
      toValue: event.endCoordinates.height + 16,
    }).start();
  };

  keyboardWillHide = event => {
    Animated.timing(this.paddingInput, {
      duration: event.duration,
      toValue: 16,
    }).start();
  };

  componentDidMount() {
    const { data, listGrades, listSubjects } = this.props;
    if (data) {
      let listGradeTmp = listGrades;
      let listSubjectTmp = listSubjects;

      data.gradeCode
        .sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)))
        .map(gradeId => {
          const index = _.indexOf(listGradeTmp.map(e => e.gradeId), gradeId);
          if (index > -1) {
            listGradeTmp[index].isActive = true;
            listGradeTmp = this.moveArrayItem(listGradeTmp, index, 0);
          }
        });

      data.subjectCode.map(subjectId => {
        const index = _.indexOf(listSubjectTmp.map(e => e.code), subjectId);
        if (index > -1) {
          listSubjectTmp[index].isActive = true;
          listSubjectTmp = this.moveArrayItem(listSubjectTmp, index, 0);
        }
      });

      this.setState({
        ...this.state,
        name: data.name,
        grade: data.gradeCode[0],
        subject: data.subjectCode[0],
        time: `${data.duration / 60}`,
        gradeCode: data.gradeCode,
        subjectCode: data.subjectCode,
        listGrades: listGradeTmp,
        listSubjects: listSubjectTmp,
      });
    }
  }

  moveArrayItem = (array, fromIndex, toIndex) => {
    const arr = [...array];
    arr.splice(toIndex, 0, ...arr.splice(fromIndex, 1));
    return arr;
  };

  setText = ({ key, text }) => {
    var stateCopy = Object.assign({}, this.state);
    stateCopy[key] = text;
    this.setState(stateCopy);
  };

  activeGrade = item => {
    const { gradeCode } = this.state;
    const { listGrades } = this.props;

    let gradeCodeTmp = gradeCode;
    let listGradeTmp = listGrades.map(e => {
      return { ...e, isActive: false };
    });

    const index = _.indexOf(gradeCodeTmp, item.gradeId);

    index < 0
      ? (gradeCodeTmp = [...gradeCodeTmp, ...[item.gradeId]])
      : (gradeCodeTmp = [
        ...gradeCodeTmp.slice(0, index),
        ...gradeCodeTmp.slice(index + 1),
      ]);

    gradeCodeTmp
      .sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)))
      .map(gradeId => {
        const i = _.indexOf(listGradeTmp.map(e => e.gradeId), gradeId);
        if (i > -1) {
          listGradeTmp[i].isActive = true;
          listGradeTmp = this.moveArrayItem(listGradeTmp, i, 0);
        }
      });

    this.setState({
      gradeCode: gradeCodeTmp,
      listGrades: listGradeTmp,
    });
  };

  _renderGrade = () => {
    const { listGrades } = this.state;
    return (
      <FlatList
        style={{ marginTop: 8 }}
        data={listGrades}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return !item.isActive ? (
            <RippleButton
              style={styles.buttomClass}
              onPress={() => this.activeGrade(item)}>
              <Text style={styles.txtItem}>{item.name}</Text>
            </RippleButton>
          ) : (
              <RippleButton
                style={styles.buttomActive}
                onPress={() => this.activeGrade(item)}>
                <View>
                  <Text style={styles.txtItemActive}>{item.name}</Text>
                </View>
              </RippleButton>
            );
        }}
        removeClippedSubviews={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  activeSubject = item => {
    const { subjectCode } = this.state;
    const { listSubjects } = this.props;

    let subjectCodeTmp = subjectCode;
    let listSubjectsTmp = listSubjects.map(e => {
      return { ...e, isActive: false };
    });

    const index = _.indexOf(subjectCodeTmp, item.code);
    index < 0
      ? (subjectCodeTmp = [...subjectCodeTmp, ...[item.code]])
      : (subjectCodeTmp = [
        ...subjectCodeTmp.slice(0, index),
        ...subjectCodeTmp.slice(index + 1),
      ]);

    subjectCodeTmp.map(subjectId => {
      const i = _.indexOf(listSubjectsTmp.map(e => e.code), subjectId);
      if (i > -1) {
        listSubjectsTmp[i].isActive = true;
        listSubjectsTmp = this.moveArrayItem(listSubjectsTmp, i, 0);
      }
    });

    this.setState({
      subjectCode: subjectCodeTmp,
      listSubjects: listSubjectsTmp,
    });
  };

  _renderSubject = () => {
    const { listSubjects } = this.state;
    return (
      <FlatList
        style={{ marginTop: 8 }}
        data={listSubjects}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return !item.isActive ? (
            <RippleButton
              style={styles.buttomClass}
              onPress={() => this.activeSubject(item)}>
              <View>
                <Text style={styles.txtItem}>{item.name}</Text>
              </View>
            </RippleButton>
          ) : (
              <RippleButton
                style={Platform.OS === 'ios' ? styles.buttomActive : null}
                onPress={() => this.activeSubject(item)}>
                <View
                  style={Platform.OS === 'android' ? styles.buttomActive : null}>
                  <Text style={styles.txtItemActive}>{item.name}</Text>
                </View>
              </RippleButton>
            );
        }}
        removeClippedSubviews={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  _validate = () => {
    const { name, time, gradeCode, subjectCode } = this.state;
    const { data } = this.props;

    if (name.trim() === '') {
      this.refs.toast.show(
        'Tên bài tập không được để trống!',
        DURATION.LENGTH_LONG,
      );
      return;
    }

    if (!gradeCode.length) {
      this.refs.toast.show('Vui lòng chọn khối lớp!', DURATION.LENGTH_LONG);
      return;
    }

    if (!subjectCode.length) {
      this.refs.toast.show('Vui lòng chọn môn học!', DURATION.LENGTH_LONG);
      return;
    }

    if (data.assignmentType === 1 && time.trim() === '') {
      this.refs.toast.show('Vui lòng nhập thời gian!', DURATION.LENGTH_LONG);
      return;
    }

    return true;
  };

  onUpdate = async () => {
    if (this._validate()) {
      const { data } = this.props;
      const { name, time, gradeCode, subjectCode } = this.state;
      const body = {
        ...data,
        assignmentId: data.assignmentId,
        assignmentType: data.assignmentType,
        duration: data.duration,
        gradeCode,
        isShare: data.isShare,
        name,
        subjectCode,
      };

      if (data.assignmentType) {
        body['duration'] = parseInt(time) * 60;
      }

      this.setState({
        updating: true,
        loading: true,
        message: 'Đang cấu hình lại bộ đề...',
      });

      const { token } = await dataHelper.getToken();
      if (token) {
        const response = await apiPapers.updateInfo({ token, body });
        if (response && response.status === 1) {
          this.setState({
            loading: false,
            message: 'Thành công!',
          });
          this.props.onUpdateItem(body);
        } else {
          this.setState({
            loading: false,
            message: 'Có lỗi xảy ra vui lòng thử lại!',
          });
        }
      }
    }
  };

  render() {
    const { name, loading, time, success, message, updating } = this.state;
    const { data } = this.props;

    return (
      <Modal visible={true} transparent={true}>
        <TouchableWithoutFeedback onPress={() => this.props.onVisible(false)}>
          <View style={styles.container}>
            <Animated.View
              style={[
                styles.bodyModal,
                {
                  marginBottom: this.paddingInput,
                },
              ]}>
              <TouchableWithoutFeedback>
                <View style={styles.bodyModal}>
                  <View style={styles.topModal}>
                    <Text style={styles.txtTitle}>Sao chép bộ đề</Text>
                  </View>
                  {updating ? (
                    <View
                      style={{
                        height: 100,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {loading && (
                        <ActivityIndicator size="small" color="#56CCF2" />
                      )}
                      <Text style={[styles.styTxtLabel, { marginTop: 4 }]}>
                        {message}
                      </Text>
                      {!loading && (
                        <RippleButton
                          style={{ marginTop: 10 }}
                          onPress={() => {
                            this.props.onVisible(false);
                          }}>
                          <View style={styles.buttomSave}>
                            <Text style={styles.txtButtom}>Đóng</Text>
                          </View>
                        </RippleButton>
                      )}
                    </View>
                  ) : (
                      <View
                        style={{
                          backgroundColor: '#FFF',
                          paddingHorizontal: 16,
                          paddingVertical: 13,
                        }}>
                        <View>
                          <Text style={styles.styTxtLabel}>
                            Tên bài tập
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#D9EBF5',
                              borderRadius: 4,
                              marginTop: 8,
                              justifyContent: 'center',
                              height: 35,
                            }}>
                            <TextInput
                              numberOfLines={1}
                              value={name}
                              style={styles.txtTexinput}
                              onChangeText={text =>
                                this.setText({ key: 'name', text })
                              }
                            />
                          </View>
                        </View>
                        <View style={{ marginTop: 8 }}>
                          <Text style={styles.styTxtLabel}>
                            Khối lớp
                        </Text>
                          {this._renderGrade()}
                        </View>
                        <View style={{ marginTop: 8 }}>
                          <Text style={styles.styTxtLabel}>
                            Môn học
                        </Text>
                          {this._renderSubject()}
                        </View>
                        {data && data.assignmentType ? (
                          <View style={{ marginTop: 8 }}>
                            <Text style={styles.styTxtLabel}>
                              Thời gian (phút)
                          </Text>
                            <View
                              style={{
                                backgroundColor: '#D9EBF5',
                                borderRadius: 4,
                                marginTop: 8,
                                justifyContent: 'center',
                                height: 35,
                              }}>
                              <TextInput
                                value={time}
                                style={styles.txtTexinput}
                                onChangeText={text =>
                                  this.setText({ key: 'time', text })
                                }
                              />
                            </View>
                          </View>
                        ) : null}
                        <View style={styles.footer}>
                          <RippleButton
                            onPress={() => this.props.onVisible(false)}>
                            <View style={styles.buttomCancel}>
                              <Text style={styles.txtButtom}>Huỷ</Text>
                            </View>
                          </RippleButton>
                          <View style={{ marginStart: 40 }}>
                            <RippleButton onPress={this.onUpdate}>
                              <View style={styles.buttomSave}>
                                <Text style={styles.txtButtom}>Lưu</Text>
                              </View>
                            </RippleButton>
                          </View>
                        </View>
                      </View>
                    )}
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
            <Toast ref="toast" position={'center'} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 200,
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  bodyModal: {
    justifyContent: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  topModal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#56CCF2',
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#FFF',
  },
  txtTexinput: {
    paddingLeft: 12,
    fontSize: RFFonsize(12),
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  buttomCancel: {
    backgroundColor: '#F49A31',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 5,
    paddingVertical: 3,
  },
  txtButtom: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
    color: '#FFF',
  },
  buttomSave: {
    backgroundColor: '#56CCF2',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 5,
    paddingVertical: 3,
  },
  buttomClass: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  buttomActive: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0085FF',
    backgroundColor: '#89EAFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  txtItemActive: {
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    fontSize: RFFonsize(10),
    color: '#000',
  },
  txtItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(10),
    color: '#828282',
  },
  styTxtLabel: {
    color: '#000',
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold',
  }
});
