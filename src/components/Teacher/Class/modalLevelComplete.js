import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import ItemStudent from './itemStudent';
import { Svg, Line, Rect } from 'react-native-svg';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
import _ from 'lodash';
import ZoomAnim from '../../anim/ZoomAnim';
import AppIcon from '../../../utils/AppIcon';
import RadarChart from '../../common/RadarChart';

const { width, height } = Dimensions.get('window');
export default class ModalLevelComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataReview: [],
      visible: true,
      isLoading: false,
    };
  }

  _renderLevelComplete = () => {
    const { data } = this.state;
    const { assignmentTimeline } = data;
    let widthChart = (width / 4) * (data.assignmentTimeline.length + 0.5);
    const maxTime = !_.isEmpty(data.assignmentTimeline)
      ? Math.max(...data.assignmentTimeline.map((e, i) => e.timeDoing))
      : 0;
    let avgPercentComplete = 0;
    let avgTimeComplete = 0;
    let dataChart = [];

    if (!_.isEmpty(data.assignmentTimeline)) {
      let totalPercentComplete = 0;
      let totalTimeComplete = 0;
      var totalPoint = 0;
      data.assignmentTimeline.forEach((element) => {
        if (element.points !== 'NaN') {
          totalPoint += parseInt(element.points);
        }
      });

      dataChart = data.assignmentTimeline.map((e) => {
        let percentComplete =
          (totalPoint === 0 || e.points === 'NaN') ? 0 : (e.points / totalPoint) * 100;
        let averageTime = e.timeDoing;
        totalPercentComplete += percentComplete;
        totalTimeComplete += averageTime;

        return {
          name: e.assignmentName,
          percentComplete,
          averageTime,
        };
      });
      avgPercentComplete = (
        totalPoint / data.assignmentTimeline.length
      ).toFixed(2);
      avgTimeComplete = totalTimeComplete / data.assignmentTimeline.length;
    }


    return (
      <View style={{ marginTop: 15, flex: 1 }}>
        {assignmentTimeline && assignmentTimeline.length <= 0 ?
          <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 12, color: '#828282' }}>Không có dữ liệu :(( </Text>
          </View>
          :
          <View style={styles.containerChart}>
            <View style={{ width: 14, height: 220 }}>
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 9,
                  color: '#FF6213',
                  transform: [
                    { rotate: '-90deg' },
                    { translateX: -45 },
                    { translateY: -105 },
                  ],
                  width: 220,
                  height: 14,
                }}>
                Tỷ lệ làm đúng (%)
            </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#E8F8FD',
                flexDirection: 'row',
                borderRadius: 4,
                paddingHorizontal: 2,
              }}>
              <View style={{ paddingEnd: 3 }}>
                {[100, 80, 60, 40, 20, 0].map((e, i) => {
                  return (
                    <Text
                      key={`a${i.toString()}`}
                      style={{
                        marginTop: i === 0 ? 15 : 31,
                        fontFamily: 'Nunito-Regular',
                        fontSize: 6,
                        color: '#000',
                        textAlign: 'right',
                      }}>
                      {e}%
                    </Text>
                  );
                })}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ zIndex: 200 }}
                bounces={false}>
                <View style={{ zIndex: -1, elevation: -1 }}>
                  <Svg height="220" width={`${widthChart}`}>
                    <Rect width="100%" height="100%" fill="#E8F8FD" />
                    <Line
                      x1="0"
                      y1="10"
                      x2="0"
                      y2="220"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <Line
                      x1="0"
                      y1="220"
                      x2={`${widthChart}`}
                      y2="220"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <Line
                      x1="0"
                      y1="5"
                      x2={`${widthChart}`}
                      y2="5"
                      stroke="#04C6F1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <Line
                      x1="1"
                      y1="180"
                      x2={`${widthChart}`}
                      y2="180"
                      stroke="#C4C4C4"
                      strokeWidth="0.5"
                    />
                    <Line
                      x1="1"
                      y1="140"
                      x2={`${widthChart}`}
                      y2="140"
                      stroke="#C4C4C4"
                      strokeWidth="0.5"
                    />
                    <Line
                      x1="1"
                      y1="100"
                      x2={`${widthChart}`}
                      y2="100"
                      stroke="#C4C4C4"
                      strokeWidth="0.5"
                    />
                    <Line
                      x1="1"
                      y1="60"
                      x2={`${widthChart}`}
                      y2="60"
                      stroke="#C4C4C4"
                      strokeWidth="0.5"
                    />
                    <Line
                      x1="1"
                      y1="20"
                      x2={`${widthChart}`}
                      y2="20"
                      stroke="#C4C4C4"
                      strokeWidth="0.5"
                    />
                    {data.assignmentTimeline.map((e, i) => {
                      const x = (width / 4) * (i + 1);
                      return (
                        <Line
                          key={`b${i.toString()}`}
                          x1={`${x}`}
                          y1="10"
                          x2={`${x}`}
                          y2="220"
                          stroke="#000"
                          strokeWidth="0.5"
                        />
                      );
                    })}
                    {data.assignmentTimeline.map((e, i) => {
                      const x = (width / 4) * (i + 1);
                      const y2 = (e.points !== 'NaN' && e.points) ? 220 - (e.points / 100) * 200 : 219;
                      const stroke =
                        (e.points !== 'NaN' && e.points) >= 70
                          ? '#04C6F1'
                          :
                          (e.points === 'NaN' || e.points)
                      e.points < 50
                        ? '#a55'
                        : '#FFA500';
                      return (
                        <Line
                          key={`c${i.toString()}`}
                          x1={`${x}`}
                          y1="219"
                          x2={`${x}`}
                          y2={`${y2}`}
                          stroke={stroke}
                          strokeWidth="20"
                        />
                      );
                    })}
                    {data.assignmentTimeline.map((e, i) => {
                      const x1 = i === 0 ? 1 : (width / 4) * i;
                      const y1 =
                        i === 0
                          ? 219
                          : 220 -
                          (data.assignmentTimeline[i - 1].timeDoing /
                            (maxTime || 1)) *
                          200;
                      const x2 = (width / 4) * (i + 1);
                      const y2 = e.timeDoing
                        ? 220 - (e.timeDoing / maxTime) * 200
                        : 219;
                      return (
                        <>
                          <Line
                            key={`d${i.toString()}`}
                            x1={`${x1}`}
                            y1={`${y1}`}
                            x2={`${x2}`}
                            y2={`${y2}`}
                            stroke="#F45200"
                            strokeWidth="1.5"
                            strokeDasharray="1.5 3"
                          />
                          <Line
                            key={`e${i.toString()}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#F45200"
                            strokeWidth="1.5"
                            strokeDasharray="1.5 3"
                          />
                        </>
                      );
                    })}
                  </Svg>
                  <View style={{ flexDirection: 'row', height: 20 }}>
                    {data.assignmentTimeline.map((e, i) => {
                      return (
                        <Text
                          key={`e${i.toString()}`}
                          numberOfLines={1}
                          style={{
                            position: 'absolute',
                            marginStart: (width / 4) * (i + 1) - width / 8,
                            width: width / 4,
                            bottom: 4,
                            fontFamily: 'Nunito-Regular',
                            fontSize: 8,
                            color: '#828282',
                            textAlign: 'center',
                          }}>
                          {e.assignmentName}
                        </Text>
                      );
                    })}
                  </View>
                </View>
                <View
                  style={{
                    witdh: 100,
                    height: 100,
                    zIndex: 300,
                    backgroundColor: 'blue',
                  }}
                />
              </ScrollView>
              <View style={{ marginHorizontal: 2 }}>
                {[
                  convertNumberToTime(maxTime),
                  convertNumberToTime(maxTime / 2),
                  '0m 0s',
                ].map((e, i) => {
                  return (
                    <Text
                      key={`f${i.toString()}`}
                      style={{
                        marginTop: i === 0 ? 15 : 90,
                        fontFamily: 'Nunito-Regular',
                        fontSize: 6,
                        color: '#000',
                        textAlign: 'right',
                      }}>
                      {e}
                    </Text>
                  );
                })}
              </View>
            </View>
            <View style={{ width: 14, height: 220 }}>
              <Text
                style={{
                  fontFamily: 'Nunito-Regular',
                  fontSize: 9,
                  color: '#FF6213',
                  transform: [
                    { rotate: '90deg' },
                    { translateX: 200 },
                    { translateY: 102 },
                  ],
                  width: 220,
                  height: 14,
                }}>
                Thời gian
            </Text>
            </View>
          </View>
        }
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={[styles.viewTimeAverage]}>
              <View
                style={[styles.dotTimeAverage, { backgroundColor: '#04C6F1' }]}
              />
              <Text style={styles.txtTimeAverage}>
                Tỷ lệ làm đúng {avgPercentComplete}(%)
              </Text>
            </View>
            <View style={[styles.viewTimeAverage, { marginLeft: 20 }]}>
              <View style={styles.dotTimeAverage} />
              <Text style={styles.txtTimeAverage}>
                Thời gian làm bài : {convertNumberToTime(avgTimeComplete)}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <View style={[styles.viewTimeAverage, { marginTop: 0 }]}>
              <View
                style={[styles.dotTimeAverage, { backgroundColor: '#04C6F1' }]}
              />
              <Text style={styles.txtTimeAverage}>Tỷ lệ đúng ≥ 70%</Text>
            </View>
            <View
              style={[
                styles.viewTimeAverage,
                { paddingHorizontal: 10, marginTop: 0 },
              ]}>
              <View
                style={[styles.dotTimeAverage, { backgroundColor: '#FFA500' }]}
              />
              <Text
                style={styles.txtTimeAverage}>{`50% ≤ Tỷ lệ đúng < 70%`}</Text>
            </View>
            <View style={[styles.viewTimeAverage, { marginTop: 0 }]}>
              <View
                style={[styles.dotTimeAverage, { backgroundColor: '#a55' }]}
              />
              <Text style={styles.txtTimeAverage}> {`Tỷ lệ đúng < 50%`} </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _closeModal = () => {
    this.props.closeModal();
  };

  getData = async () => { };

  async componentDidMount() {
    const { classID, idStudent } = this.props;
    try {
      this.setState({ isLoading: true });
      const { token } = await dataHelper.getToken();
      const response = await Api.getClassReport({ token, classID, idStudent });
      this.setState({
        data: response && response.data,
        isLoading: false,
      });
      const res = await Api.getMastery({ token, classID });

      const finndStudent = _.find(res, (e) => e.studentId === idStudent);
      this.setState({
        dataReview: res && finndStudent.data,
        isLoading: false,
      });
    } catch (error) { }
  }

  convertNameToAvatar(name) {
    return name
      .toUpperCase()
      .split(' ')
      .splice(0, 2)
      .map((item) => item.split('').splice(0, 1))
      .join('');
  }

  renderRadaChart = () => {
    const { data, visible, dataReview } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <RadarChart data={dataReview} />
      </View>
    );
  };

  render() {
    const { data, visible, dataReview, isLoading } = this.state;
    console.log(data);
    return (
      <Modal transparent={true} visible={true}>
        <View style={styles.container}>
          <ZoomAnim>
            {Object.keys(data).length !== 0 ? (
              <View style={styles.body}>
                <View style={styles.topModal}>
                  <Text style={styles.txtTitle}>
                    Biểu đồ tỷ lệ hoàn thành bài tập
                  </Text>
                  <TouchableOpacity
                    style={styles.imageClose}
                    onPress={() => this._closeModal()}>
                    <Image source={AppIcon.icon_close_modal} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 24,
                    marginTop: 7,
                  }}>
                  <View style={styles.avatarImage}>
                    {!data.avatar ? (
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 30,
                          backgroundColor: '#2D9CDB',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.txtNameOne}>
                          {this.convertNameToAvatar(data.studentName)}
                        </Text>
                      </View>
                    ) : (
                        <Image
                          source={{
                            uri:
                              data.avatar.indexOf('http') != 0
                                ? `http:${data.avatar}`
                                : data.avatar,
                          }}
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 30,
                            marginTop: 12,
                          }}
                        />
                      )}
                    <Text style={styles.txtName}>{data.studentName}</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => this.setState({ visible: !visible })}
                      style={styles.radioBottom}>
                      <View
                        style={[
                          styles.contentRadio,
                          !visible && { backgroundColor: '#E0E0E0' },
                        ]}>
                        {visible && (
                          <View
                            style={{
                              backgroundColor: '#fff',
                              height: 8,
                              width: 8,
                              borderRadius: 4,
                            }}></View>
                        )}
                      </View>
                      <Text style={styles.txtComplete}>Tỉ lệ hoàn thành</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.radioBottom, { marginTop: 11 }]}
                      onPress={() => this.setState({ visible: !visible })}>
                      <View
                        style={[
                          styles.contentRadio,
                          visible && { backgroundColor: '#E0E0E0' },
                        ]}>
                        {!visible && (
                          <View
                            style={{
                              backgroundColor: '#fff',
                              height: 8,
                              width: 8,
                              borderRadius: 4,
                            }}></View>
                        )}
                      </View>
                      <Text style={styles.txtComplete}>Đánh giá tự luyện</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {isLoading ? (
                  <ActivityIndicator style={{ marginTop: 80 }} />
                ) : !visible ? (
                  !_.isEmpty(dataReview) ? (
                    this.renderRadaChart()
                  ) : (
                      <Text style={styles.txtTitle}>
                        Hiện tại không có dữ liệu
                      </Text>
                    )
                ) : (
                      this._renderLevelComplete()
                    )}
              </View>
            ) : (
                <ActivityIndicator size={'small'} color={'#FFF'} />
              )}
          </ZoomAnim>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  avatarImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtComplete: {
    fontFamily: 'Nunito-Regular',
    fontSize: 9,
    color: '#424242',
    marginLeft: 3,
  },
  radioBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentRadio: {
    height: 18,
    width: 18,
    borderRadius: 12,
    backgroundColor: '#2D9CDB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    backgroundColor: '#FFF',
    height: height / 2,
    borderRadius: 5,
    height: 440,
  },
  imageClose: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  topModal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    color: '#2D9CDB',
    fontSize: width < 380 ? 11 : 14,
    textAlign: 'center',
  },
  txtName: {
    fontFamily: 'Nunito-Bold',
    color: '#000',
    fontSize: 12,
    marginHorizontal: 10,
  },
  txtNameOne: {
    fontFamily: 'Nunito-Bold',
    color: '#FFF',
    fontSize: 9,
    marginTop: 2,
  },
  containerChart: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    backgroundColor: '#E8F8FD',
    borderRadius: 4,
  },
  txtTimeAverage: {
    fontSize: 9,
    fontFamily: 'Nunito-Regular',
    color: '#000',
    marginStart: 8,
  },
  dotTimeAverage: {
    width: 12,
    height: 12,
    backgroundColor: '#F45200',
  },
  viewTimeAverage: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
});
