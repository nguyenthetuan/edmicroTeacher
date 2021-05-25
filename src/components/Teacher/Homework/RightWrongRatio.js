import React from 'react';
import { Text, StyleSheet, View, Dimensions, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Svg, Line } from 'react-native-svg';
import _ from 'lodash';
import { RFFonsize } from '../../../utils/Fonts';
import ProgressRefresh from './ProgressRefresh';
const { width, height } = Dimensions.get('window');

export default function RightWrongRatio(props) {
  const data = !!props.screenProps.data && !_.isEmpty(props.screenProps.data.data) ? Object.keys(props.screenProps.data?.data?.questionResult).sort((a, b) => {
    return a.localeCompare(b);
  }).map(k => props.screenProps?.data?.data?.questionResult[k]) : [];
  let widthChart = width - 60;

  if (40 * (data.length + 0.5) > width - 60) {
    widthChart = 40 * (data.length + 0.5);
  }
  return (
    <View style={styles.container}>
      <ProgressRefresh isRefresh={props.screenProps.isRefresh} />
      {
        props.screenProps.isLoading
          ? <ActivityIndicator size='small' color='#04C6F1' />
          :
          props.screenProps.data.data?.assignmentContentType == 3 ?
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../../../asserts/icon/iconNodata.png')} />
              <Text style={{ color: '#828282', fontFamily: 'Nunito-Regular', marginTop: 30, marginHorizontal: 60, textAlign: 'center' }}>{`Dạng bài này không thống kê tỷ lệ đúng sai.`}

              </Text>
            </View>
            :
            _.isEmpty(data) ? (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../asserts/icon/iconNodata.png')} />
                <Text style={{ color: '#828282', fontFamily: 'Nunito-Regular', marginTop: 30 }}>Không đủ dữ liệu thống kê</Text>
              </View>
            )
              : (<View style={{ flex: 1 }}>
                <Text style={styles.title}>Biểu đồ đánh giá câu hỏi</Text>
                <View style={styles.chart} >
                  <View style={styles.viewChart}>
                    <View style={{ paddingEnd: 3 }}>
                      {
                        [100, 80, 60, 40, 20, 0].map((e, i) => {
                          return (
                            <Text
                              key={`a${i.toString()}`}
                              style={{
                                marginTop: i === 0 ? 15 : 31,
                                fontFamily: 'Nunito-Regular',
                                fontSize: RFFonsize(6),
                                color: '#000',
                                textAlign: 'right'
                              }}>{e}%</Text>
                          )
                        })
                      }
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View>
                        <Svg height="220" width={`${widthChart}`}>
                          <Line x1="0" y1="10" x2="0" y2="220" stroke="#000" strokeWidth="2" />
                          <Line x1="0" y1="220" x2={`${widthChart}`} y2="220" stroke="#000" strokeWidth="2" />

                          <Line x1="1" y1="180" x2={`${widthChart}`} y2="180" stroke="#C4C4C4" strokeWidth="0.5" />
                          <Line x1="1" y1="140" x2={`${widthChart}`} y2="140" stroke="#C4C4C4" strokeWidth="0.5" />
                          <Line x1="1" y1="100" x2={`${widthChart}`} y2="100" stroke="#C4C4C4" strokeWidth="0.5" />
                          <Line x1="1" y1="60" x2={`${widthChart}`} y2="60" stroke="#C4C4C4" strokeWidth="0.5" />
                          <Line x1="1" y1="20" x2={`${widthChart}`} y2="20" stroke="#C4C4C4" strokeWidth="0.5" />
                          {
                            data.map((e, i) => {
                              // const total = e.countSkip + e.countRight + e.countWrong;

                              // const x2 = 40 * (i + 1) - 10;
                              // const y2Skip = e.countSkip ? 220 - ((e.countSkip / total) * 200) : 219;
                              // const y2Wrong = e.countWrong ? ((e.countWrong / total) * 200) + 20 : 20;
                              // const lineChart = [];

                              const total = e.countSkip + e.countRight + e.countWrong;
                              // const countSkip = total - (e.countRight + e.countWrong);
                              const countSkip = e.countSkip;
                              const x2 = 40 * (i + 1) - 10;
                              const y2Skip = countSkip ? 220 - ((countSkip / total) * 200) : 219;
                              const y2Wrong = e.countWrong ? ((e.countWrong / total) * 200) + 20 : 20;
                              const lineChart = [];

                              if (total === 0) {
                                return null
                              }
                              lineChart.push(<Line
                                key={`b${i.toString()}`}
                                x1={`${x2}`} y1="219"
                                x2={`${x2}`} y2="20"
                                stroke="#4EBE3C" strokeWidth="20" />);
                              lineChart.push(<Line
                                key={`c${i.toString()}`}
                                x1={`${x2}`} y1="219"
                                x2={`${x2}`} y2={`${y2Skip}`}
                                stroke="#B1D8EE" strokeWidth="20" />);
                              lineChart.push(<Line
                                key={`d${i.toString()}`}
                                x1={`${x2}`} y1="20"
                                x2={`${x2}`} y2={`${y2Wrong}`}
                                stroke="#FF3D3D" strokeWidth="20" />);
                              return lineChart;
                            })
                          }
                        </Svg>
                        <View style={{ flexDirection: 'row', height: 20 }}>
                          {
                            data.map((e, i) => {
                              return (
                                <Text
                                  key={`e${i.toString()}`}
                                  numberOfLines={1}
                                  style={{
                                    position: 'absolute',
                                    marginStart: 40 * (i + 1) - 20,
                                    width: 20,
                                    bottom: 2,
                                    fontFamily: 'Nunito-Regular',
                                    fontSize: RFFonsize(10),
                                    color: '#000',
                                    textAlign: 'center'
                                  }}>{i + 1}</Text>
                              )
                            })
                          }
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </View>
                <View style={styles.contentNote}>
                  <View style={styles.viewSkip}>
                    <View style={{ height: 15, width: 15, backgroundColor: '#B1D8EE' }} />
                    <Text style={styles.txtNote}>Bỏ qua</Text>
                  </View>
                  <View style={[styles.viewSkip, { marginStart: 24 }]}>
                    <View style={{ height: 15, width: 15, backgroundColor: '#FF3D3D' }} />
                    <Text style={styles.txtNote}>Làm sai</Text>
                  </View>
                  <View style={[styles.viewSkip, { marginStart: 24 }]}>
                    <View style={{ height: 15, width: 15, backgroundColor: '#4EBE3C' }} />
                    <Text style={styles.txtNote}>Làm đúng</Text>
                  </View>
                </View>
              </View>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#000',
    padding: 16
  },
  chart: {
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  viewChart: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    paddingHorizontal: 2
  },
  contentNote: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center'
  },
  viewSkip: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtNote: {
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Regular',
    color: '#000',
    marginStart: 15
  }
})
