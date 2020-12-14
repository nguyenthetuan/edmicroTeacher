import React, { Component } from 'react';
import {
  View, FlatList,
  TouchableOpacity, Text, Platform, Dimensions, TextInput, StyleSheet,
  Image, Modal
} from 'react-native';
import _ from 'lodash';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import InputNumberQuestion from './InputNumberQuestion';

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

      indexSelectingTL: 0,
      questionsTL: [],
      totalAddQuestionTL: 0,
      totalPointTL: 0,
      optionIdAnswer: -1,
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
      totalPoint,
      questions,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { totalQuestion, totalQuestionTL, typeQuestion } = this.props;
    const { totalPointTL, totalPoint } = this.state;

    if (typeQuestion === 1) {
      console.log("prevProps.totalQuestionTL: ", prevProps.totalQuestionTL);
      console.log("totalQuestionTL: ", totalQuestionTL);
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

  onClickItem = (index, optionIdAnswer) => this.props.onClickItem(index, optionIdAnswer);
  onClickItemTL = (index, optionIdAnswer) => this.props.onClickItemTL(index, optionIdAnswer);

  onSelectAnswer = (answer) => {
    const { questions } = this.state;
    const { indexSelecting } = this.props;
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
    const { questions } = this.state;
    const { indexSelecting } = this.props;
    const questionsTmp = questions;
    questionsTmp[indexSelecting].textPoint = point;

    this.setState({
      questions: questionsTmp
    });
  }

  onChangPointTL = (point) => {
    const { questionsTL } = this.state;
    const { indexSelectingTL } = this.props;

    const questionsTmpTL = questionsTL;
    questionsTmpTL[indexSelectingTL].textPoint = point;
    this.setState({
      questionsTL: questionsTmpTL
    })
  }

  onEndEditingPoint = () => {
    const { questions } = this.state;
    const { indexSelecting } = this.props;
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
    const { questionsTL } = this.state;
    const { indexSelectingTL } = this.props;
    const questionsTmpTL = questionsTL;
    let textPoint = questionsTmpTL[indexSelectingTL].textPoint;
    let pointTmp = parseFloat(textPoint);
    if (!Number.isNaN(pointTmp)) {
      pointTmp = pointTmp % 1 === 1 ? (pointTmp > 10 ? 10 : parseInt(pointTmp)) : pointTmp;
    } else {
      pointTmp = 0;
    }
    questionsTmpTL[indexSelectingTL].point = pointTmp;
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
    const { questions, questionsTL, totalAddQuestion, totalAddQuestionTL, totalPoint, totalPointTL } = this.state;
    const { indexSelecting, indexSelectingTL } = this.props;
    let optionIdAnswer = -1;
    const indexOfAnswer = _.indexOf(questions.map(e => e.index), this.props.indexSelecting);
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
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
          <View>
            <Text style={styles.totalAddQuestion}>Tổng số câu</Text>
            <InputNumberQuestion
              containerStyle={[
                { flex: 1, marginBottom: 25 },
                this.props.assignmentType && { marginBottom: 80 },
              ]}
              totalQuestion={
                this.props.totalQuestion
              }
              onChange={this.props.onChange}
            />
          </View>
          <View style={{ justifyContent: 'space-evenly', height: 80 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: 150 }}>
              <Text style={styles.totalAddQuestion}>Tổng điểm:</Text>
              {typeQuestion === 0 ? <TextInput
                style={[styles.inputPoint, { marginTop: 0, width: 60, position: 'absolute', right: 5 }]}
                numberOfLines={1}
                returnKeyType={'done'}
                maxLength={4}
                keyboardType={'numeric'}
                onChangeText={text => this.setState({ totalPoint: text && parseInt(text) || 0 })}
                onEndEditing={() => this.pointSentence(typeQuestion)}
                value={totalPoint && `${totalPoint}` || ''}
              /> :
                <TextInput
                  style={[styles.inputPoint, { marginTop: 0, width: 60, position: 'absolute', right: 5 }]}
                  numberOfLines={1}
                  returnKeyType={'done'}
                  maxLength={4}
                  keyboardType={'numeric'}
                  onChangeText={text => this.setState({ totalPointTL: text && parseInt(text) || 0 })}
                  onEndEditing={() => this.pointSentence(typeQuestion)}
                  value={totalPointTL && `${totalPointTL}` || ''}
                />}
              {/* <Image source={require('../../../asserts/icon/editPoint.png')} style={{ position: 'absolute', right: 3 }} /> */}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: 150 }}>
              <Text style={styles.totalAddQuestion}>Điểm câu {typeQuestion === 0 ? this.props.indexSelecting + 1 : this.props.indexSelectingTL + 1}</Text>
              <TextInput
                style={[styles.inputPoint, { marginTop: 0, width: 60, position: 'absolute', right: 5 }]}
                numberOfLines={1}
                returnKeyType={'done'}
                maxLength={4}
                keyboardType={'numeric'}
                onChangeText={typeQuestion === 0 ? this.onChangePoint : this.onChangPointTL}
                onEndEditing={() => this.editPoint(typeQuestion)}
                value={typeQuestion === 0 ? `${questions[this.props.indexSelecting].textPoint}` : `${questionsTL[this.props.indexSelectingTL].textPoint}`}
              />
            </View>
          </View>
        </View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {typeQuestion === 0 ? <FlatList
            contentContainerStyle={{ paddingHorizontal: 10, alignSelf: 'center', }}
            numColumns={numColumns}
            data={questions}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const isSelected = item.optionIdAnswer !== -1;
              const isSelecting = (this.props.showSelectAnswer && this.props.indexSelecting === item.index);
              const name = (item.index + 1) + this.getNameAnswer(item.optionIdAnswer);
              return (
                <TouchableOpacity
                  onPress={() => { this.onClickItem(item.index, item.optionIdAnswer) }}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 5,
                    borderColor: isSelected || isSelecting ? '#56CCF2' : '#828282',
                    borderWidth: 1,
                    margin: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isSelected ? '#56CCF2' : '#fff'
                  }}>
                  <Text style={{
                    fontFamily: isSelected || isSelecting ? 'Nunito-Bold' : 'Nunito-Regular',
                    fontSize: 12,
                    fontWeight: '700',
                    color: isSelected ? '#fff' : '#000'
                  }}>{name}</Text>
                </TouchableOpacity>
              )
            }}
          /> :
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              numColumns={numColumns}
              data={questionsTL}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const isSelected = item.optionIdAnswer !== -1;
                const isSelecting = this.props.indexSelectingTL === item.index;
                const name = (item.index + 1);
                return (
                  <TouchableOpacity
                    onPress={() => { this.onClickItemTL(item.index, item.optionIdAnswer) }}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 5,
                      borderColor: isSelecting ? '#56CCF2' : '#828282',
                      borderWidth: 1,
                      margin: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#fff'
                    }}>
                    <Text style={{
                      fontFamily: isSelected || isSelecting ? 'Nunito-Bold' : 'Nunito-Regular',
                      fontSize: 12,
                      color: '#000',
                      fontWeight: '700',
                    }}>{name}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          }
        </View>
        {/* <View style={styles.viewPointAndOption}>
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
        </View> */}
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
    fontFamily: 'Nunito', fontWeight: '700', fontSize: 14
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