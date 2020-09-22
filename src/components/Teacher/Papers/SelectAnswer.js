import React, { Component } from 'react';
import {
  View, FlatList,
  TouchableOpacity, Text, Platform, Dimensions, TextInput, StyleSheet,
  Image,
} from 'react-native';
import _ from 'lodash';
import { getBottomSpace } from 'react-native-iphone-x-helper';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window')

export default class SelectAnswer extends Component {
  constructor(props) {
    super(props);
    const { totalPoint, totalQuestionTL } = this.props
    this.state = {
      indexSelecting: 0,
      questions: [],
      totalAddQuestion: 0,
      totalPoint: totalPoint || 0,

      indexSlelectingTL: 0,
      questionsTL: [],
      totalAddQuestionTL: 0,
      totalPointTL: 0,

      totalQuestionTL: totalQuestionTL || 0,
    }
  }

  getListQuestions = () => {
    const { questions, totalPoint, questionsTL, totalPointTL } = this.state;
    return {
      data: questions.map(e => {
        return {
          index: e.index,
          point: e.point,
          optionIdAnswer: e.optionIdAnswer,
          typeAnswer: e.typeAnswer,
          totalQption: e.totalQption
        }
      }),
      totalPoint,
      dataTL: questionsTL.map(e => {
        return {
          index: e.index,
          point: e.point,
          optionIdAnswer: e.optionIdAnswer,
          typeAnswer: e.typeAnswer,
          totalQption: e.totalQption
        }
      }),
      totalPointTL,
    }
  }

  onResetIndexSelect = () => {
    this.setState({ indexSelecting: 0 });
  }

  onResetIndexSelectTL = () => {
    this.setState({ indexSlelectingTL: 0 });
  }

  componentDidMount() {
    const { totalQuestion } = this.props;
    const questions = new Array(totalQuestion).fill({
      index: 0,
      point: +(10 / totalQuestion).toFixed(2),
      optionIdAnswer: -1,
      typeAnswer: 0,
      totalQption: 4,
      textPoint: `${(10 / totalQuestion).toFixed(2)}`,
    }).map((value, index) => { return { ...value, index } });

    let totalPoint = 0;
    questions.map(e => {
      totalPoint += e.point;
    });

    this.setState({
      questions,
      totalPoint
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { totalQuestion, totalQuestionTL, typeQuestion } = this.props;
    const { totalPointTL, totalPoint } = this.state;

    if (typeQuestion === 1) {
      if (prevProps.totalQuestionTL !== totalQuestionTL) {
        const { questionsTL } = this.state;
        let questionsTmpTL = questionsTL;
        const differenceTL = prevProps.totalQuestionTL - totalQuestionTL
        if (differenceTL > 0) {
          questionsTmpTL = questionsTL.slice(0, totalQuestionTL)
        } else {
          let listTmpTL = new Array(Math.abs(differenceTL)).fill({
            index: 0,
            point: `${(totalPointTL / totalQuestionTL).toFixed(2)}`,
            optionIdAnswer: null,
            typeAnswer: 3,
            totalQption: 0,
            textPoint: `${(totalPointTL / totalQuestionTL).toFixed(2)}`,
          }).map((value, index) => { return { ...value, index: questionsTmpTL.length + index } });
          questionsTmpTL = questionsTmpTL.concat(listTmpTL);
        }
        questionsTmpTL = questionsTmpTL.map(e => {
          return {
            ...e,
            point: parseFloat((totalPointTL / totalQuestionTL).toFixed(2)),
            textPoint: `${(totalPointTL / totalQuestionTL).toFixed(2)}`
          }
        })
        this.setState({
          questionsTL: questionsTmpTL,
        })
      }

    } else {
      if (prevProps.totalQuestion !== totalQuestion) {
        const { questions } = this.state;
        let questionsTmp = questions;
        const difference = prevProps.totalQuestion - totalQuestion;
        if (difference > 0) {
          questionsTmp = questionsTmp.slice(0, totalQuestion)
        } else {
          let listTmp = new Array(Math.abs(difference)).fill({
            index: 0,
            point: parseFloat((totalPoint / totalQuestion).toFixed(2)),
            optionIdAnswer: -1,
            typeAnswer: 0,
            totalQption: 4,
            textPoint: `${(totalPoint / totalQuestion).toFixed(2)}`
          }).map((value, index) => { return { ...value, index: questionsTmp.length + index } });
          questionsTmp = questionsTmp.concat(listTmp);
        }

        questionsTmp = questionsTmp.map(e => {
          return {
            ...e,
            point: parseFloat((totalPoint / totalQuestion).toFixed(2)),
            textPoint: `${(totalPoint / totalQuestion).toFixed(2)}`
          }
        })
        this.setQuestion(typeQuestion, questionsTmp)
      }
    }
  }

  setQuestion = (typeQuestion, question) => {
    if (typeQuestion === 1) {
      this.setState({
        questionsTL: question
      })
    } else {
      this.setState({
        questions: question
      })
    }
  }

  onClickItem = (index) => this.setState({ indexSelecting: index });
  onClickItemTL = (index) => this.setState({ indexSlelectingTL: index });

  onSelectAnswer = (answer) => {
    const { indexSelecting, questions } = this.state;
    const questionsTmp = questions;
    let count = 0;
    questionsTmp[indexSelecting].optionIdAnswer = answer;
    questionsTmp.map(e => {
      if (e.optionIdAnswer > -1) { count++; }
    })
    this.setState({
      questions: questionsTmp,
      totalAddQuestion: count
    });
  }

  getNameAnswer = (number) => {
    switch (number) {
      case 0:
        return 'A';
      case 1:
        return 'B';
      case 2:
        return 'C';
      case 3:
        return 'D';
      default:
        return '';
    }
  }

  onChangePoint = (point) => {
    const { indexSelecting, questions } = this.state;
    const questionsTmp = questions;
    questionsTmp[indexSelecting].textPoint = point;

    this.setState({
      questions: questionsTmp
    });
  }

  onChangPointTL = (point) => {
    const { indexSlelectingTL, questionsTL } = this.state;

    const questionsTmpTL = questionsTL;
    questionsTmpTL[indexSlelectingTL].textPoint = point;
    this.setState({
      questionsTL: questionsTmpTL
    })
  }

  onEndEditingPoint = () => {
    const { indexSelecting, questions } = this.state;
    const questionsTmp = questions;
    let textPoint = questionsTmp[indexSelecting].textPoint;
    let pointTmp = parseFloat(textPoint);
    if (!Number.isNaN(pointTmp)) {
      pointTmp = pointTmp % 1 === 0 ? (pointTmp > 10 ? 10 : parseInt(pointTmp)) : pointTmp;
    } else {
      pointTmp = 0;
    }
    questionsTmp[indexSelecting].point = pointTmp;
    let totalPoint = 0;
    questionsTmp.map(e => {
      totalPoint += e.point;
    });
    this.setState({
      questions: questionsTmp,
      totalPoint
    });
  }

  onEndEditingPointTL = () => {
    const { indexSlelectingTL, questionsTL } = this.state;
    const questionsTmpTL = questionsTL;
    let textPoint = questionsTmpTL[indexSlelectingTL].textPoint;
    let pointTmp = parseFloat(textPoint);
    if (!Number.isNaN(pointTmp)) {
      pointTmp = pointTmp % 1 === 1 ? (pointTmp > 10 ? 10 : parseInt(pointTmp)) : pointTmp;
    } else {
      pointTmp = 0;
    }
    questionsTmpTL[indexSlelectingTL].point = pointTmp;
    let totalPointTL = 0;
    questionsTmpTL.map(e => {
      totalPointTL += e.point;
    })
    this.setState({
      questionsTL: questionsTmpTL,
      totalPointTL
    })
  }

  editPoint = (typeQuestion) => {
    if (typeQuestion === 0) {
      this.onEndEditingPoint();
    } else {
      this.onEndEditingPointTL()
    }
  }

  pointSentence = () => {
    const { typeQuestion, totalQuestion, totalQuestionTL } = this.props;
    const { questions, questionsTL, totalPoint, totalPointTL } = this.state;
    if (typeQuestion === 0) {

      let questionsTmp = questions.map(e => {
        return {
          ...e,
          point: parseFloat((totalPoint / totalQuestion).toFixed(2)),
          textPoint: `${(totalPoint / totalQuestion).toFixed(2)}`
        }
      })
      this.setState({
        questions: questionsTmp,
      })
    } else {
      let questionsTLTmp = questionsTL.map(e => {
        return {
          ...e,
          point: parseFloat((totalPointTL / totalQuestionTL).toFixed(2)),
          textPoint: `${(totalPointTL / totalQuestionTL).toFixed(2)}`
        }
      })
      this.setState({
        questionsTL: questionsTLTmp,
      })
    }
  }

  render() {
    const { numColumns, isVisible, typeQuestion } = this.props;
    const { questions, questionsTL, indexSelecting, indexSlelectingTL, totalAddQuestion, totalAddQuestionTL, totalPoint, totalPointTL } = this.state;
    let optionIdAnswer = -1;
    const indexOfAnswer = _.indexOf(questions.map(e => e.index), indexSelecting);

    if (questions.length <= 0 || !isVisible || typeQuestion === 1 && questionsTL.length <= 0) {
      return null;
    } else {
      optionIdAnswer = questions[indexOfAnswer].optionIdAnswer;
    }
    return (
      <View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 15,
          paddingHorizontal: 16
        }}>
          {/* {typeQuestion === 0 && <Text style={styles.totalAddQuestion}>Số câu hỏi đã thêm: <Text style={{ color: '#159FDA' }}>
            {totalAddQuestion}
          </Text></Text>} */}

          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Text style={styles.totalAddQuestion}>Tổng điểm:</Text>
            {typeQuestion === 0 ? <TextInput
              style={[styles.inputPoint, { marginTop: 0, width: 60, marginLeft: 5 }]}
              numberOfLines={1}
              returnKeyType={'done'}
              maxLength={4}
              keyboardType={'numeric'}
              editable={false}
              onChangeText={text => this.setState({ totalPoint: text && parseInt(text) || 0 })}
              onEndEditing={() => this.pointSentence(typeQuestion)}
              value={totalPoint && `${totalPoint}` || ''}
            /> :
              <TextInput
                style={[styles.inputPoint, { marginTop: 0, width: 60, marginLeft: 5 }]}
                numberOfLines={1}
                returnKeyType={'done'}
                maxLength={4}
                editable={false}
                keyboardType={'numeric'}
                onChangeText={text => this.setState({ totalPointTL: text && parseInt(text) || 0 })}
                onEndEditing={() => this.pointSentence(typeQuestion)}
                value={totalPointTL && `${totalPointTL}` || ''}
              />}
            {/* <Image source={require('../../../asserts/icon/editPoint.png')} style={{ position: 'absolute', right: 3 }} /> */}
          </View>
        </View>
        <View
          style={{
            marginBottom: 15,
            paddingHorizontal: 16
          }}
        >
          <Text style={styles.totalAddQuestion}>Tổng số điểm trắc nghiệm và tự luận <Text style={{ color: '#FF6213' }}>
            {totalPoint + totalPointTL}
          </Text></Text></View>
        <View style={{
          maxHeight: 92,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {typeQuestion === 0 ? <FlatList
            contentContainerStyle={{ paddingHorizontal: 8 }}
            numColumns={numColumns}
            data={questions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const { indexSelecting } = this.state;
              const isSelected = item.optionIdAnswer !== -1;
              const isSelecting = indexSelecting === item.index;
              const name = (item.index + 1) + this.getNameAnswer(item.optionIdAnswer);
              return (
                <TouchableOpacity
                  onPress={() => { this.onClickItem(item.index) }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 2,
                    borderColor: isSelected || isSelecting ? '#56CCF2' : '#828282',
                    borderWidth: 1,
                    margin: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isSelected ? '#56CCF2' : '#fff'
                  }}>
                  <Text style={{
                    fontFamily: isSelected || isSelecting ? 'Nunito-Bold' : 'Nunito-Regular',
                    fontSize: 12,
                    color: isSelected ? '#fff' : '#000'
                  }}>{name}</Text>
                </TouchableOpacity>
              )
            }}
          /> :
            <FlatList
              contentContainerStyle={{ paddingHorizontal: 8 }}
              numColumns={numColumns}
              data={questionsTL}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const { indexSlelectingTL } = this.state;
                const isSelected = item.optionIdAnswer !== -1;
                const isSelecting = indexSlelectingTL === item.index;
                const name = (item.index + 1);
                return (
                  <TouchableOpacity
                    onPress={() => { this.onClickItemTL(item.index) }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 2,
                      borderColor: isSelecting ? '#56CCF2' : '#828282',
                      borderWidth: 1,
                      margin: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#fff'
                    }}>
                    <Text style={{
                      fontFamily: isSelected || isSelecting ? 'Nunito-Bold' : 'Nunito-Regular',
                      fontSize: 12,
                      color: '#000'
                    }}>{name}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          }
        </View>
        <View style={styles.viewPointAndOption}>
          <View>
            <Text style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 14,
              color: '#000'
            }}>Điểm câu 1000</Text>
            <View>
              <TextInput
                style={styles.inputPoint}
                numberOfLines={1}
                returnKeyType={'done'}
                maxLength={4}
                keyboardType={'numeric'}
                onChangeText={typeQuestion === 0 ? this.onChangePoint : this.onChangPointTL}
                onEndEditing={() => this.editPoint(typeQuestion)}
                value={typeQuestion === 0 ? `${questions[indexSelecting].textPoint}` : `${questionsTL[indexSlelectingTL].textPoint}`}
              />
              <Image source={require('../../../asserts/icon/editPoint.png')} style={{ position: 'absolute', right: 3, bottom: 6 }} />
            </View>
          </View>
          {this.props.typeQuestion === 0 && <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 14,
              color: '#000'
            }}>Đáp án câu {indexSelecting + 1}</Text>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <TouchableOpacity onPress={() => this.onSelectAnswer(0)}
                style={[styles.btnAnswer, {
                  backgroundColor: optionIdAnswer === 0 ? '#56CCF2' : '#fff',
                  borderColor: optionIdAnswer === 0 ? '#2D9CDB' : '#828282'
                }]}>
                <Text style={[styles.txtAnswer, {
                  color: optionIdAnswer === 0 ? '#fff' : '#828282'
                }]}>A</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onSelectAnswer(1)}
                style={[styles.btnAnswer, {
                  backgroundColor: optionIdAnswer === 1 ? '#56CCF2' : '#fff',
                  borderColor: optionIdAnswer === 1 ? '#2D9CDB' : '#828282'
                }]}>
                <Text style={[styles.txtAnswer, {
                  color: optionIdAnswer === 1 ? '#fff' : '#828282'
                }]}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onSelectAnswer(2)}
                style={[styles.btnAnswer, {
                  backgroundColor: optionIdAnswer === 2 ? '#56CCF2' : '#fff',
                  borderColor: optionIdAnswer === 2 ? '#2D9CDB' : '#828282'
                }]}>
                <Text style={[styles.txtAnswer, {
                  color: optionIdAnswer === 2 ? '#fff' : '#828282'
                }]}>C</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onSelectAnswer(3)}
                style={[styles.btnAnswer, {
                  backgroundColor: optionIdAnswer === 3 ? '#56CCF2' : '#fff',
                  borderColor: optionIdAnswer === 3 ? '#2D9CDB' : '#828282'
                }]}>
                <Text style={[styles.txtAnswer, {
                  color: optionIdAnswer === 3 ? '#fff' : '#828282'
                }]}>D</Text>
              </TouchableOpacity>
            </View>
          </View>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#56CCF2'
  },
  header: {
    backgroundColor: '#56CCF2',
    zIndex: 99
  },
  imgHeader: {
    width: width * 0.24,
    height: 0 + (width * 0.35),
    position: 'absolute',
    bottom: 0,
    left: 16
  },
  topheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: width < 380 ? 20 : 15,
    height: 56,
  },
  bodyHeader: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 18,
    height: 170,
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#FFF'
  },
  rightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: width < 380 ? 5 : 5,
    paddingBottom: 2,
    backgroundColor: '#F49A31',
    borderRadius: 5,
    marginEnd: 16
  },
  totalAddQuestion: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#828282'
  },
  buttomTop: {
    backgroundColor: '#0091EA',
    marginTop: 20,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    right: 16,
    bottom: 48 + getBottomSpace(),
    height: 24,
    width: 24
  },
  txtRightHeader: {
    paddingHorizontal: 13,
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#FFF'
  },
  btnAnswer: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7
  },
  txtAnswer: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#828282'
  },
  txtNotAdd: {
    color: '#FF6213',
    fontSize: 14,
    fontFamily: 'Nunito-Bold'
  },
  viewPdf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pdf: {
    width,
    flex: 1
  },
  btnZoomPDF: {
    backgroundColor: 'rgba(47, 47, 46, 0.5)',
    marginTop: 20,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    right: 16,
    bottom: 16 + getBottomSpace(),
    height: 24,
    width: 24
  },
  txtUploadingPDF: {
    marginTop: 10,
    marginVertical: 3,
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center'
  },
  txtEnterAnswer: {
    marginVertical: 3,
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center'
  },
  btnEnterAnswer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 15,
  },
  txtNoteUploadPDF: {
    marginVertical: 3,
    color: '#FF0000',
    fontFamily: 'Nunito-Regular',
    fontSize: 9,
    textAlign: 'center'
  },
  btnAddPDF: {
    width: width / 3.5,
    backgroundColor: '#fff',
    borderRadius: 2,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtAddPDF: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
    fontSize: 12
  },
  txtNoActive: {
    color: '#C4C4C4',
    fontFamily: 'Nunito-Regular',
    fontSize: 12
  },
  txtActive: {
    color: '#fff',
    fontFamily: 'Nunito-Regular',
    fontSize: 12
  },
  inputName: {
    height: 24,
    backgroundColor: '#fff',
    color: '#828282',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    paddingStart: 5,
    marginBottom: 7,
    borderRadius: 1,
    paddingVertical: 0
  },
  inputPoint: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#828282',
    height: 20,
    marginTop: 9,
    textAlign: 'center',
    color: '#FF6213',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    paddingVertical: 0
  },
  viewPointAndOption: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 16,
    marginBottom: 0,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#C4C4C4'
  },
  btnShowPDF: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#0091EA',
    height: 30,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f1fa'
  },
  txtShowPDF: {
    marginStart: 8,
    color: '#0091EA',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    textAlign: 'center'
  },
  dotViewPDF: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#0091EA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})