import React, { Component } from 'react';
import {
  View, FlatList,
  TouchableOpacity, Text, Platform, Dimensions, TextInput, StyleSheet,
  Image, Modal
} from 'react-native';
import _ from 'lodash';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import InputNumberQuestion from './InputNumberQuestion';
import { RFFonsize } from '../../../utils/Fonts';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window')

export default class SelectAnswer extends Component {
  constructor(props) {
    super(props);
    const { totalPointTN, totalQuestionTL } = this.props
    this.state = {
      indexSelectingTN: 0,
      questionsTN: [],
      totalAddQuestion: 0,
      totalPointTN: totalPointTN || 0,

      indexSelectingTL: 0,
      questionsTL: [],
      totalAddQuestionTL: 0,
      totalPointTL: 0,
      optionIdAnswer: -1,
      totalQuestionTL: totalQuestionTL || 0,
    }
  }

  getTotalPoint() {
    return (this.state.totalPointTN + this.state.totalQuestionTL);
  }

  getListQuestions = () => {
    const { questionsTN, totalPointTN, questionsTL, totalPointTL } = this.state;
    return {
      data: questionsTN.map(e => {
        return {
          index: e.index,
          point: e.point,
          optionIdAnswer: e.optionIdAnswer,
          typeAnswer: e.typeAnswer,
          totalQption: e.totalQption
        }
      }),
      totalPointTN,
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
    const { totalQuestionTN, totalQuestionTL } = this.props;
    let totalPointTN = 0;
    let totalPointTL = 0;
    const questionsTN = new Array(totalQuestionTN).fill({
      index: 0,
      point: +(10 / totalQuestionTN).toFixed(2),
      optionIdAnswer: -1,
      typeAnswer: 0,
      totalQption: 4,
      textPoint: `${(10 / totalQuestionTN).toFixed(2)}`,
    }).map((value, index) => { return { ...value, index } });
    questionsTN.map(e => {
      totalPointTN += e.point;
    });

    const questionsTL = new Array(totalQuestionTL).fill({
      index: 0,
      point: +(10 / totalQuestionTL).toFixed(2),
      optionIdAnswer: -1,
      typeAnswer: 0,
      textPoint: `${(10 / totalQuestionTL).toFixed(2)}`,
    }).map((value, index) => { return { ...value, index } });
    questionsTL.map(e => {
      totalPointTL += e.point;
    });
    this.props.getTotalPoint(totalPointTN + totalPointTL);

    this.setState({
      totalPointTN,
      questionsTN,
      totalPointTL,
      questionsTL,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { totalQuestionTN, totalQuestionTL, typeQuestion } = this.props;
    const { totalPointTL, totalPointTN } = this.state;

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
      if (prevProps.totalQuestionTN !== totalQuestionTN) {
        const { questionsTN } = this.state;
        let questionsTmpTN = questionsTN;
        const difference = prevProps.totalQuestionTN - totalQuestionTN;
        if (difference > 0) {
          questionsTmpTN = questionsTmpTN.slice(0, totalQuestionTN)
        } else {
          let listTmp = new Array(Math.abs(difference)).fill({
            index: 0,
            point: parseFloat((totalPointTN / totalQuestionTN).toFixed(2)),
            optionIdAnswer: -1,
            typeAnswer: 0,
            totalQption: 4,
            textPoint: `${(totalPointTN / totalQuestionTN).toFixed(2)}`
          }).map((value, index) => { return { ...value, index: questionsTmpTN.length + index } });
          questionsTmpTN = questionsTmpTN.concat(listTmp);
        }

        questionsTmpTN = questionsTmpTN.map(e => {
          return {
            ...e,
            point: parseFloat((totalPointTN / totalQuestionTN).toFixed(2)),
            textPoint: `${(totalPointTN / totalQuestionTN).toFixed(2)}`
          }
        })
        this.setQuestion(typeQuestion, questionsTmpTN)
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
        questionsTN: question
      })
    }
  }

  onClickItem = (index, optionIdAnswer, point) => this.props.onClickItem(index, optionIdAnswer, point);
  onClickItemTL = (index, optionIdAnswer, point) => this.props.onClickItemTL(index, optionIdAnswer, point);

  onSelectAnswer = (answer) => {
    const { questionsTN } = this.state;
    const { indexSelectingTN } = this.props;
    const questionsTmpTN = questionsTN;
    let count = 0;
    questionsTmpTN[indexSelectingTN].optionIdAnswer = answer;
    questionsTmpTN.map(e => {
      if (e.optionIdAnswer > -1) { count++; }
    })
    this.setState({
      questionsTN: questionsTmpTN,
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
    if (isNaN(point) || point == '') {
      return;
    }
    const { questionsTN, totalPointTL } = this.state;
    const { indexSelectingTN } = this.props;
    const questionsTmpTN = questionsTN;
    questionsTmpTN[indexSelectingTN].textPoint = point;
    questionsTmpTN[indexSelectingTN].point = parseFloat(point);

    let totalPointTN = 0;

    questionsTmpTN.map(e => {
      totalPointTN += e.point;
    });

    this.setState({
      questionsTN: questionsTmpTN,
      totalPointTN
    });
    console.log("🚀 ~ file: SelectAnswer.js ~ line 233 ~ SelectAnswer ~ totalPointTN", totalPointTN)

    this.props.getTotalPoint(totalPointTN + totalPointTL);

  }

  onChangPointTL = (point) => {
    const { questionsTL, totalPointTN } = this.state;
    const { indexSelectingTL } = this.props;

    const questionsTmpTL = questionsTL;
    questionsTmpTL[indexSelectingTL].textPoint = point;
    questionsTmpTL[indexSelectingTL].point = parseFloat(point);

    let totalPointTL = 0;
    questionsTmpTL.map(e => {
      totalPointTL += e.point;
    })

    this.setState({
      questionsTL: questionsTmpTL,
      totalPointTL
    })

    this.props.getTotalPoint(totalPointTN + totalPointTL);
  }

  onEndEditingPoint = () => {
    const { questionsTN, totalPointTL } = this.state;
    const { indexSelectingTN } = this.props;
    const questionsTmpTN = questionsTN;
    let textPoint = questionsTmpTN[indexSelectingTN].textPoint;
    let pointTmp = parseFloat(textPoint);
    if (!Number.isNaN(pointTmp)) {
      pointTmp = pointTmp % 1 === 0 ? (pointTmp > 10 ? 10 : parseInt(pointTmp)) : pointTmp;
    } else {
      pointTmp = 0;
    }
    questionsTmpTN[indexSelectingTN].point = pointTmp;
    let totalPointTN = 0;
    questionsTmpTN.map(e => {
      totalPointTN += e.point;
    });
    this.setState({
      questionsTN: questionsTmpTN,
      totalPointTN
    });
    this.props.getTotalPoint(totalPointTN + totalPointTL);

  }

  onEndEditingPointTL = () => {
    const { questionsTL, totalPointTN } = this.state;
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
    this.props.getTotalPoint(totalPointTN + totalPointTL);
  }

  editPoint = () => {
    const { typeQuestion } = this.props;

    if (typeQuestion === 0) {
      this.onEndEditingPoint();
    } else {
      this.onEndEditingPointTL()
    }
  }

  renderFlatlist = (typeQuestion, numColumns, questionsTN, questionsTL) => {
    if (typeQuestion === 0) {
      return (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {(questionsTN.length > 0) ? <FlatList
            contentContainerStyle={{ paddingHorizontal: 10, alignSelf: 'center', }}
            numColumns={numColumns}
            data={questionsTN}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const isSelected = item.optionIdAnswer !== -1;
              const isSelecting = (this.props.showSelectAnswer && this.props.indexSelectingTN === item.index);
              const name = (item.index + 1) + this.getNameAnswer(item.optionIdAnswer);
              return (
                <TouchableOpacity
                  onPress={() => { this.onClickItem(item.index, item.optionIdAnswer, questionsTN[index].textPoint) }}
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
                    fontSize: RFFonsize(12),
                    fontWeight: '700',
                    color: isSelected ? '#fff' : '#000'
                  }}>{name}</Text>
                </TouchableOpacity>
              )
            }}
          />
            :
            <View></View>
          }
        </View>
      )
    } else {
      return (
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
                onPress={() => { this.onClickItemTL(item.index, item.optionIdAnswer, questionsTL[index].textPoint) }}
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
                  fontSize: RFFonsize(12),
                  color: '#000',
                  fontWeight: '700',
                }}>{name}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )
    }

  }

  pointSentence = () => {
    const { typeQuestion, totalQuestionTN, totalQuestionTL } = this.props;
    const { questionsTN, questionsTL, totalPointTN, totalPointTL } = this.state;
    if (typeQuestion === 0) {

      let questionsTmpTN = questionsTN.map(e => {
        return {
          ...e,
          point: parseFloat((totalPointTN / totalQuestionTN).toFixed(2)),
          textPoint: `${(totalPointTN / totalQuestionTN).toFixed(2)}`
        }
      })
      this.setState({
        questionsTN: questionsTmpTN,
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
    this.props.getTotalPoint(totalPointTN + totalPointTL);
  }

  onChangeText = (point) => {
    console.log("🚀 ~ file: SelectAnswer.js ~ line 432 ~ SelectAnswer ~ point", point)
    const { typeQuestion } = this.props;
    if (typeQuestion === 0) {
      this.onChangePoint(point);
    } else {
      this.onChangPointTL(point);
    }
  }

  render() {
    const { numColumns, isVisible, typeQuestion } = this.props;
    const { questionsTN, questionsTL, totalAddQuestion, totalAddQuestionTL, totalPointTN, totalPointTL } = this.state;
    const { indexSelectingTN, indexSelectingTL } = this.props;
    let optionIdAnswer = -1;
    const indexOfAnswer = _.indexOf(questionsTN.map(e => e.index), this.props.indexSelectingTN);
    if (!isVisible) {
      return null;
    } else {
      optionIdAnswer = questionsTN[indexOfAnswer]?.optionIdAnswer;
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
          <View style={{ top: 10 }}>
            <Text style={styles.totalAddQuestion}>Tổng số câu</Text>
            <InputNumberQuestion
              containerStyle={[
                { flex: 1, marginBottom: 25 },
                this.props.assignmentType && { marginBottom: 80 },
              ]}
              totalQuestionTN={
                typeQuestion == 0
                  ?
                  this.props.totalQuestionTN
                  :
                  this.props.totalQuestionTL
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
                onChangeText={text => this.setState({ totalPointTN: text && parseInt(text) || 0 })}
                onEndEditing={() => this.pointSentence(typeQuestion)}
                value={totalPointTN && `${totalPointTN}` || ''}
                editable={true}
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
                  editable={true}
                />}
              {/* <Image source={require('../../../asserts/icon/editPoint.png')} style={{ position: 'absolute', right: 3 }} /> */}
            </View>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: 150 }}>
              <Text style={styles.totalAddQuestion}>Điểm câu {typeQuestion === 0 ? this.props.indexSelectingTN + 1 : this.props.indexSelectingTL + 1}</Text>
              <TextInput
                style={[styles.inputPoint, { marginTop: 0, width: 60, position: 'absolute', right: 5 }]}
                numberOfLines={1}
                returnKeyType={'done'}
                maxLength={4}
                keyboardType={'numeric'}
                onChangeText={this.onChangeText}
                onEndEditing={() => this.editPoint(typeQuestion)}
                value={typeQuestion === 0 ? `${questionsTN[this.props.indexSelectingTN].textPoint}` : `${questionsTL[this.props.indexSelectingTL].textPoint}`}
                editable={false}
              />
            </View> */}
          </View>
        </View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {this.renderFlatlist(typeQuestion, numColumns, questionsTN, questionsTL)}
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
    fontSize: RFFonsize(14),
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
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: RFFonsize(14),
    left: -10
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
    fontSize: RFFonsize(12),
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
    fontSize: RFFonsize(18),
    color: '#828282'
  },
  txtNotAdd: {
    color: '#FF6213',
    fontSize: RFFonsize(14),
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
    fontSize: RFFonsize(12),
    textAlign: 'center'
  },
  txtEnterAnswer: {
    marginVertical: 3,
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(12),
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
    fontSize: RFFonsize(9),
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
    fontSize: RFFonsize(12)
  },
  txtNoActive: {
    color: '#C4C4C4',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12)
  },
  txtActive: {
    color: '#fff',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12)
  },
  inputName: {
    height: 24,
    backgroundColor: '#fff',
    color: '#828282',
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(12),
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
    fontSize: RFFonsize(14),
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
    fontSize: RFFonsize(12),
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
    backgroundColor: '#fff',
  }
})