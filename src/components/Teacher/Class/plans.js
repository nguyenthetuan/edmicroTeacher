import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
import _ from 'lodash';
import Globals from '../../../utils/Globals';
import { delay } from '../../../utils/Helper';
import { RFFonsize } from '../../../utils/Fonts';

export default class Plan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studyPlanning: {},
      enableTarger: false,
      enableRequirements: false,
      enableContent: false,
      targer: '',
      requirements: '',
      content: '',
      key: '',
      numberOfLines1: 5,
      numberOfLines2: 5,
      numberOfLines3: 5,
    };
    Globals.updatePlan = this.refreshData.bind(this);
  }

  refreshData = async () => {
    this.fetchData();
  };

  async componentDidMount() {
    await delay(450);
    this.fetchData();
  }

  fetchData = async () => {
    const { classId } = this.props.screenProps;
    try {
      const { token } = await dataHelper.getToken();
      const response = await Api.getListPlan({ token, classId });
      if (
        response &&
        response.status === 1 &&
        !_.isEmpty(response.data.studyPlanning)
      ) {
        this.setState(
          {
            studyPlanning: response.data.studyPlanning,
          },
          () => this.getData(this.state.studyPlanning),
        );
      } else {
        this.getData([]);
      }
    } catch (error) { }
  };

  getData = (studyPlanning) => {
    var listPlan = [];
    _.forEach(studyPlanning, (element) => {
      listPlan.push(element);
    });
    this.setState({ targer: listPlan[0] || 'Chưa được cập nhật' });
    this.setState({ requirements: listPlan[1] || 'Chưa được cập nhật' });
    this.setState({ content: listPlan[2] || 'Chưa được cập nhật' });
  };

  _handleClick = (index, value) => () => {
    const { classId } = this.props.screenProps;
    const {
      targer,
    } = this.state;
    const title = ['', 'Mục Tiêu', 'Yêu cầu cần đạt', 'Nội dung dạy học']
    this.props.screenProps.navigation.navigate('UpdatePlan', {
      title: title[index],
      index,
      value,
      classId: classId,
    });
  }

  _handleClickMore = (index, unMore) => () => {
    if (unMore) {
      const obj = Object.assign({ ['numberOfLines' + index]: 5 });
      this.setState(obj);
      return;
    }
    const obj = Object.assign({ ['numberOfLines' + index]: null });
    this.setState(obj);
  }

  render() {
    const {
      studyPlanning,
      enableTarger,
      targer,
      enableRequirements,
      requirements,
      content,
      enableContent,
      numberOfLines1,
      numberOfLines2,
      numberOfLines3,
    } = this.state;
    const { classId } = this.props.screenProps;
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 14 }}>
          <Text style={styles.txtTitle}>Kế Hoạch Dạy Học</Text>
        </View>
        <View style={styles.body}>
          {/* <Image source={require('../../../asserts/images/Rectangle.png')} resizeMode={'contain'} style={{ marginLeft: -15 }} /> */}

          {/* Muc tieu */}
          <View style={{ position: 'relative' }}>
            <View style={styles.wrapElementPlans}>
              <Image
                source={require('../../../asserts/images/Ripper.png')}
                style={styles.styRipper}
                resizeMode={'contain'}
              />
              <TouchableOpacity
                onPress={this._handleClick(1, targer)}>
                <View>
                  <Text style={styles.txtTitle}>Mục tiêu</Text>
                </View>
                <View style={styles.wrapContent}>
                  {targer ? (
                    <View style={styles.wrapTxtContent}>
                      <Text
                        style={styles.txtEmpty}
                        numberOfLines={numberOfLines1}
                      >
                        {targer}
                      </Text>
                      {
                        targer?.toString()?.split('').length > 500 &&
                        <>
                          {
                            numberOfLines1 ?
                              <TouchableOpacity onPress={this._handleClickMore(1)} >
                                <Text style={styles.styTxtMore}>Xem thêm</Text>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity onPress={this._handleClickMore(1, true)}>
                                <Text style={styles.styTxtMore}>Thu gọn</Text>
                              </TouchableOpacity>
                          }
                        </>
                      }
                    </View>
                  ) : (
                      <ActivityIndicator size={'small'} color={'#333'} />
                    )}
                  <Image
                    source={require('../../../asserts/icon/icEditName.png')}
                    style={styles.imgEdit}
                  />
                </View>
              </TouchableOpacity>
              <Image
                source={require('../../../asserts/images/Rectangle.png')}
                resizeMode={"contain"}
                style={styles.styRect}
              />
            </View>
          </View>

          {/* Yeu cau can dat */}
          <View style={{ position: 'relative' }}>
            <View style={styles.wrapElementPlans}>
              <Image
                source={require('../../../asserts/images/Ripper.png')}
                style={styles.styRipper}
                resizeMode={'contain'}
              />
              <TouchableOpacity onPress={this._handleClick(2, requirements)}>
                <Text style={styles.txtTitle}>Yêu cầu cần đạt</Text>
                <View style={styles.wrapContent}>
                  {requirements ? (
                    <View style={styles.wrapTxtContent}>
                      <Text style={styles.txtEmpty} numberOfLines={numberOfLines2}>{requirements}</Text>
                      {
                        requirements?.split('') > 500 &&
                        <>
                          {
                            numberOfLines2 ?
                              <TouchableOpacity onPress={this._handleClickMore(2)}>
                                <Text style={styles.styTxtMore}>Xem thêm</Text>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity onPress={this._handleClickMore(2, true)}>
                                <Text style={styles.styTxtMore}>Thu gọn</Text>
                              </TouchableOpacity>
                          }
                        </>
                      }
                    </View>
                  ) : (
                      <ActivityIndicator size={'small'} color={'#333'} />
                    )}
                  <Image
                    source={require('../../../asserts/icon/icEditName.png')}
                    style={styles.imgEdit}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Image source={require('../../../asserts/images/Rectangle.png')} resizeMode={'contain'} style={styles.styRect} />
          </View>

          {/* Nội dung dạy học */}
          <View style={{ position: 'relative' }}>
            <View style={styles.wrapElementPlans}>
              <Image
                source={require('../../../asserts/images/Ripper.png')}
                style={styles.styRipper}
                resizeMode={'contain'}
              />
              <TouchableOpacity
                onPress={this._handleClick(3, content)}>
                <Text style={styles.txtTitle}>Nội dung dạy học</Text>
                <View style={styles.wrapContent}>
                  {content ? (
                    <View style={styles.wrapTxtContent}>
                      <Text style={styles.txtEmpty} numberOfLines={numberOfLines3}>{content}</Text>
                      {
                        content?.split('').length > 500 &&
                        <>
                          {
                            numberOfLines3 ?
                              <TouchableOpacity onPress={this._handleClickMore(3)}>
                                <Text style={styles.styTxtMore}>Xem thêm</Text>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity onPress={this._handleClickMore(3, true)}>
                                <Text style={styles.styTxtMore}>Thu gọn</Text>
                              </TouchableOpacity>
                          }
                        </>
                      }
                    </View>
                  ) : (
                      <ActivityIndicator size={'small'} color={'#333'} />
                    )}
                  <Image
                    source={require('../../../asserts/icon/icEditName.png')}
                    style={styles.imgEdit}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Image source={require('../../../asserts/images/Rectangle.png')} resizeMode={"contain"} style={styles.styRect} />
          </View>
        </View >
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: width < 350 ? 10 : 20,
  },
  txtTitle: {
    fontSize: 18,
    color: '#2D9CDB',
    fontFamily: 'Nunito-Bold',
  },
  body: {
    paddingLeft: 25,
    alignItems: 'flex-start',
    marginTop: 14,
  },
  txtEmpty: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#828282',
    flex: 1,
    paddingVertical:10,
  },
  buttonCancel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  imgEdit: {
    tintColor: '#C4C4C4',
  },
  styTxtMore: {
    fontFamily: 'Nunito-Regular',
    color: '#2D9CDB',
    textDecorationLine: 'underline',
    marginVertical: 10
  },
  styRipper: {
    position: 'absolute',
    top: 0,
    left: -25
  },
  styRect: {
    position: 'absolute',
    left: -15,
    top: 30
  },
  wrapElementPlans: {
    flexDirection: 'row',
    minHeight: 100,
    width
  },
  wrapContent: {
    flexDirection: 'row',
    flex: 1
  },
  wrapTxtContent: {
    width: width / 1.2 - 5
  }
});
