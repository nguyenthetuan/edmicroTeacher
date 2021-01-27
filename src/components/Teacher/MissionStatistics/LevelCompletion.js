import React, { useState } from 'react';
import { Text, StyleSheet, View, Dimensions, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Svg, Line, Rect } from 'react-native-svg';
import _ from 'lodash';
import { RFFonsize } from '../../../utils/Fonts';
import Common from '../../../utils/Common';
const { width, height } = Dimensions.get('window');

const chartConfig = {
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
};

export default function LevelCompletion(props) {
  convertNumberToTime = (number) => {
    return Math.floor(number / 60) + 'm ' + Math.floor(number % 60) + 's';
  }

  const renderChartCircle = () => {
    const { data } = props.screenProps;
    let count = 0;
    let total = 0;

    if (data && data.length > 0) {
      total = data.length;
      data.map(e => {
        if (e.data?.status) {
          count++;
        }
      })
    }

    const dataChart = [
      {
        students: total !== 0 ? count / total * 100 : 0,
        color: "#04C6F1"
      },
      {
        students: total !== 0 ? 100 - (count / total * 100) : 100,
        color: "#6C7988"
      }
    ]

    return (
      <View style={styles.containerChartCircle}>
        <View style={styles.viewChartCircle1}>
          <View style={styles.viewChartCircle2}>
            <PieChart
              data={dataChart}
              width={125}
              height={125}
              chartConfig={chartConfig}
              accessor="students"
              backgroundColor="transparent"
              paddingLeft="19"
              hasLegend={false}
            />
          </View>
          <View style={styles.viewPercentChartCircle}>
            <Text style={styles.txtPercentChartCircle}>
              {data && (count / total * 100) % 1 === 0
                ? (count / total * 100)
                : Math.round((count / total * 100)) || 0}%
                            </Text>
          </View>
        </View>
        <Text style={styles.txtLeftChartCircle}>{count} trong số {total} học sinh</Text>
      </View>
    )
  }

  compareName = (a, b) => {
    if (!a || !b) {
      return 1
    }
    const arrayA = a.slice(0, -1).split(' ');
    const arrayB = b.slice(0, -1).split(' ');

    const firstName1 = arrayA[arrayA.length - 1];
    const firstName2 = arrayB[arrayB.length - 1];
    if (firstName1 !== firstName2) {
      return firstName1.localeCompare(firstName2);

    }
    const lastName1 = arrayA[0];
    const lastName2 = arrayB[0];
    if (lastName1 !== lastName2) {
      return lastName1.localeCompare(lastName2);

    }
    const surName1 = arrayA.slice(1, arrayA.length - 1).join(' ')
    const surName2 = arrayB.slice(1, arrayB.length - 1).join(' ')
    return surName1.localeCompare(surName2);
  }


  sort = () => {
    array.forEach(element => {
      element.name
    });
  }

  const renderChartLevelComplete = () => {
    const { data } = props.screenProps;
    let dataChart = [];
    let avgPercentComplete = 0;
    if (data && data.length > 0) {
      let totalCompletePractice = 0;
      let totalCompleteTest = 0;
      let name = '';
      let id = '';
      let arrayCurrentId = [];
      let dataTemp1 = {};
      let dataTemp2 = {};
      let dataChartTemp2 = [];
      data.map((e, index) => {
        if (e.data.listProblem.length > 0) {
          const { listProblem } = e.data;
          listProblem.map(item => {
            name = item.problemName;
            id = item.problemId;
            if (arrayCurrentId.indexOf(id) >= 0) {
              dataTemp1[id].total += 1;
              if (item.isDone) {
                dataTemp1[id].doneCount += 1;
              }
            } else {
              arrayCurrentId.push(id);
              let doneCount = 0;
              if (item.isDone) {
                doneCount = 1;
              }
              dataTemp1[id] = { id, name, total: 1, doneCount };
            }
            if (item.isDone) {
              totalCompletePractice += 1;
            }
          })
        }
      });
      let dataChartTemp1 = [];
      dataChartTemp1 = Object.values(dataTemp1).map(item => {
        let name = item.name;
        let id = item.id;
        let percentComplete = item.doneCount / item.total;
        return {
          name, id, percentComplete
        }
      })

      data.map(e => {
        if (e.data.listTest.length > 0) {
          const { listTest } = e.data;
          listTest.map(item => {
            name = item.problemName;
            id = item.problemId;
            if (arrayCurrentId.indexOf(id) >= 0) {
              dataTemp2[id].total += 1;
              if (item.isDone) {
                dataTemp2[id].doneCount += 1;
              }
            } else {
              arrayCurrentId.push(id);
              let doneCount = 0;
              if (item.isDone) {
                doneCount = 1;
              }
              dataTemp2[id] = { id, name, total: 1, doneCount };
            }
            if (item.isDone) {
              totalCompleteTest += 1;
            }
          })
        }
      });

      dataChartTemp2 = Object.values(dataTemp2).map(item => {
        let name = item.name;
        let id = item.id;
        let percentComplete = item.doneCount / item.total;
        return {
          name, id, percentComplete
        }
      })

      dataChart = dataChartTemp1.concat(dataChartTemp2);

      dataChart.map(item => {

      })

      // console.log("renderChartLevelComplete -> dataChartTemp", dataChartTemp1);
      // console.log("renderChartLevelComplete -> dataChartTemp", dataChartTemp2);

      avgPercentComplete = ((totalCompletePractice + totalCompleteTest) / data.length).toFixed(4) * 100 / 2;
      avgPercentComplete = Common.roundToTwo(avgPercentComplete);
      // let result = _.chain([...dataChartTemp1, ...dataChartTemp2])
      //   // Group the elements of Array based on color property
      //   .groupBy('id')
      //   // key is group's name (color), value is the array of objects
      //   .map((value, key) => ({ title: value[0].name, data: value }))
      //   .value();

      // console.log('result', result);

    }

    const widthChart = width / 4 * (dataChart.length + 0.5);
    const maxTime = Math.max(...dataChart.map(e => e.averageTime));

    dataChart = dataChart.sort((a, b) => compareName(a.name, b.name))
    return (
      <View>
        <View style={styles.containerChart}>
          <View style={{ width: 14, height: 220 }}>
            <Text style={{
              fontFamily: 'Nunito-Regular',
              fontSize: RFFonsize(9),
              color: '#FF6213',
              transform: [
                { rotate: "-90deg" },
                { translateX: -45 },
                { translateY: -105 }
              ],
              width: 220,
              height: 14
            }}>Tỷ lệ hoàn thành nhiệm vụ(%)</Text>
          </View>
          <View style={{
            flex: 1,
            backgroundColor: '#E8F8FD',
            flexDirection: 'row',
            borderRadius: 4,
            paddingHorizontal: 2
          }}>
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
                  <Rect width="100%" height="100%" fill="#E8F8FD" />
                  <Line x1="0" y1="10" x2="0" y2="220" stroke="#000" strokeWidth="2" />
                  <Line x1="0" y1="220" x2={`${widthChart}`} y2="220" stroke="#000" strokeWidth="2" />

                  {/* <Line x1="0" y1="5" x2={`${widthChart}`} y2="5" stroke="#04C6F1" strokeWidth="3" strokeLinecap="round" /> */}

                  <Line x1="1" y1="180" x2={`${widthChart}`} y2="180" stroke="#C4C4C4" strokeWidth="0.5" />
                  <Line x1="1" y1="140" x2={`${widthChart}`} y2="140" stroke="#C4C4C4" strokeWidth="0.5" />
                  <Line x1="1" y1="100" x2={`${widthChart}`} y2="100" stroke="#C4C4C4" strokeWidth="0.5" />
                  <Line x1="1" y1="60" x2={`${widthChart}`} y2="60" stroke="#C4C4C4" strokeWidth="0.5" />
                  <Line x1="1" y1="20" x2={`${widthChart}`} y2="20" stroke="#C4C4C4" strokeWidth="0.5" />
                  {
                    dataChart.map((e, i) => {
                      const x = width / 4 * (i + 1);
                      return (
                        <Line
                          key={`b${i.toString()}`}
                          x1={`${x}`} y1="10" x2={`${x}`} y2="220" stroke="#000" strokeWidth="0.5" />
                      )
                    })
                  }
                  {
                    dataChart.map((e, i) => {
                      const x = width / 4 * (i + 1);
                      const y2 = e.percentComplete ? 220 - ((e.percentComplete) * 220) : 219;
                      const stroke = e.percentComplete >= 70 ? '#04C6F1' : (e.percentComplete < 50 ? '#a55' : '#FFA500');
                      return (
                        <Line
                          key={`c${i.toString()}`}
                          x1={`${x}`} y1="219" x2={`${x}`} y2={`${y2}`} stroke={stroke} strokeWidth="20" />
                      )
                    })
                  }
                  {/* {
                    dataChart.map((e, i) => {
                      const x1 = i === 0 ? 1 : (width / 4 * i);
                      const y1 = i === 0 || maxTime === 0 ? 219 : 220 - ((dataChart[i - 1].averageTime / maxTime) * 220);
                      const x2 = width / 4 * (i + 1);
                      const y2 = e.averageTime || maxTime !== 0 ? 220 - ((e.averageTime / maxTime) * 220) : 219;
                      return (
                        <Line
                          key={`d${i.toString()}`}
                          x1={`${x1}`} y1={`${y1}`}
                          x2={`${x2}`} y2={`${y2}`}
                          stroke="#F45200"
                          strokeWidth="1.5"
                          strokeDasharray="1.5 3" />
                      )
                    })
                  } */}
                </Svg>
                <View style={{ flexDirection: 'row', height: 20 }}>
                  {
                    dataChart.map((e, i) => {
                      return (
                        <Text
                          key={`e${i.toString()}`}
                          numberOfLines={1}
                          style={{
                            position: 'absolute',
                            marginStart: width / 4 * (i + 1) - width / 8,
                            width: width / 4,
                            bottom: 4,
                            fontFamily: 'Nunito-Regular',
                            fontSize: RFFonsize(8),
                            color: '#828282',
                            textAlign: 'center'
                          }}>{e.name}</Text>
                      )
                    })
                  }
                </View>
              </View>
            </ScrollView>
            {data && !_.isEmpty(data.students) && <View style={{ marginHorizontal: 2 }}>
              {
                [convertNumberToTime(maxTime ? maxTime : 2), convertNumberToTime((maxTime ? maxTime : 2) / 2), '0m 0s'].map((e, i) => {
                  return (
                    <Text
                      key={`f${i.toString()}`}
                      style={{
                        marginTop: i === 0 ? 15 : 90,
                        fontFamily: 'Nunito-Regular',
                        fontSize: RFFonsize(6),
                        color: '#000',
                        textAlign: 'right'
                      }}>{e}</Text>
                  )
                })
              }
            </View>}
          </View>
        </View>
        <View style={{ flex: 1, alignSelf: 'center', paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, paddingHorizontal: 5 }}>
            <View style={[styles.viewTimeAverage]}>
              <View style={[styles.dotTimeAverage, { backgroundColor: '#04C6F1' }]} />
              <Text style={styles.txtTimeAverage}>Mức độ hoàn thành trung bình {avgPercentComplete}%</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.txtTitleChart}>Biểu đồ mức độ hoàn thành của học sinh</Text>
        </View>
      </View>
    )
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {
        props.screenProps.isLoading
          ? <ActivityIndicator size='small' color='#04C6F1' />
          :
          _.isEmpty(props.screenProps.data) ?
            (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../../asserts/icon/iconNodata.png')} />
                <Text style={{ color: '#828282', fontFamily: 'Nunito-Regular', marginTop: 30 }}>Không đủ dữ liệu thống kê</Text>
              </View>
            )
            : (<ScrollView style={styles.container}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                {renderChartCircle()}
                <View style={{ marginLeft: -10, alignItems: 'center', marginTop: 20 }}>
                  <Text style={styles.txtTitleChart}>
                    Tỷ lệ học sinh tham gia làm bài
              </Text>
                </View>
                {renderChartLevelComplete()}
              </View>
            </ScrollView>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerChartCircle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 25,
    marginStart: width / 3 + (Platform.isPad ? 60 : 0)
  },
  txtLeftChartCircle: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(10),
    color: '#828282'
  },
  txtPercentChartCircle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(18),
    color: '#2A8DC6'
  },
  viewPercentChartCircle: {
    height: 70,
    width: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewChartCircle1: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  viewChartCircle2: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: -12.5,
  },
  txtTitleChart: {
    marginTop: 34,
    marginStart: 16,
    marginBottom: 23,
    color: '#000',
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold'
  },
  txtTitleChart: {
    // marginTop: 34,
    marginStart: 16,
    marginBottom: 23,
    color: '#000',
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold'
  },
  containerChart: {
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  txtTimeAverage: {
    fontSize: RFFonsize(10),
    fontFamily: 'Nunito-Regular',
    color: '#000',
    marginStart: 8
  },
  dotTimeAverage: {
    width: 12,
    height: 12,
    backgroundColor: '#F45200'
  },
  viewTimeAverage: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  }
})
