import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { RFFonsize } from '../utils/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class PaginationUtils extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexStart: 0,
      indexEnd: 3,
      indexCurrent: 0,
    };
  }

  resetState = () => {
    this.setState({
      indexStart: 0,
      indexEnd: 3,
      indexCurrent: 0,
    });
  };

  renderPagination = () => {
    const { totalQuestion } = this.props;
    const length = Math.round(totalQuestion / 10);
    const { indexStart, indexEnd, indexCurrent } = this.state;
    const arrElement = new Array();
    let element;
    const elementDotEnd = (
      <TouchableWithoutFeedback
        key={'elementDotEnd'}
        onPress={this.handleClickDot('+')}
        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      >
        <View style={styles.wrapElement}>
          <Text style={styles.txtNumber}>...</Text>
        </View>
      </TouchableWithoutFeedback>
    );
    const elementDotStart = (
      <TouchableWithoutFeedback
        key={'elementDotStart'}
        onPress={this.handleClickDot('-')}
        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      >
        <View style={styles.wrapElement}>
          <Text style={styles.txtNumber}>...</Text>
        </View>
      </TouchableWithoutFeedback>
    );
    if (indexStart >= indexEnd - 3 && indexStart) {
      arrElement.push(elementDotStart);
    }
    for (let i = 0; i < length; i++) {
      if (i < indexEnd && indexStart <= i) {
        element = (
          <TouchableWithoutFeedback
            key={i}
            onPress={this.handleClickIndex(i)}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <View style={[
              styles.wrapElement,
              { backgroundColor: indexCurrent == i ? '#107CB9' : '#FFF',borderColor: indexCurrent ==i ? '#107CB9' : "#c4c4c4"} ,
            ]}>
              <Text
                style={[
                  styles.txtNumber,
                  { color: indexCurrent == i ? '#fff' : 'rgba(2, 31, 47, 0.4)' },
                ]}>
                {i + 1}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
        arrElement.push(element);
      }
    }
    if (length > indexEnd) {
      arrElement.push(elementDotEnd);
    }
    return arrElement;
  };

  handleClickDot = (status) => () => {
    const numberPage = 3;
    const { totalQuestion } = this.props;
    const length = Math.round(totalQuestion / 10);
    let { indexStart, indexEnd } = this.state;
    if (indexEnd < length && status == '+') {
      indexStart += numberPage;
      indexEnd += numberPage;
      this.setState({ indexStart, indexEnd, indexCurrent: indexStart });
      this.props.handleNextPage(indexStart);
    }
    if (indexStart <= indexEnd && indexStart > 0 && status == '-') {
      indexEnd -=
        indexStart < numberPage ? numberPage - indexStart - 1 : numberPage;
      indexStart -=
        indexStart < numberPage ? numberPage - indexStart - 1 : numberPage;
      this.setState({ indexStart, indexEnd, indexCurrent: indexStart });
      this.props.handleNextPage(indexStart);
    }
  };

  handleClickRight = () => {
    const { totalQuestion } = this.props;
    const length = Math.round(totalQuestion / 10);
    let { indexStart, indexEnd } = this.state;
    if (indexEnd < length) {
      indexEnd += 1;
      indexStart += 1;
      this.setState({ indexEnd, indexStart, indexCurrent: indexStart });
      this.props.handleNextPage(indexStart);
    }
  };

  handleClickLeft = () => {
    let { indexStart, indexEnd } = this.state;
    if (indexStart > 0) {
      indexEnd -= 1;
      indexStart -= 1;
      this.setState({ indexEnd, indexStart, indexCurrent: indexStart });
      this.props.handleNextPage(indexStart);
    }
  };

  handleClickIndex = (index) => () => {
    const { indexCurrent } = this.state;
    if (index == indexCurrent) {
      return;
    }
    this.setState({ indexCurrent: index });
    this.props.handleNextPage(index);
  };

  render() {
    const { totalQuestion, countQuestion } = this.props;
    return (
      <View style={styles.contain}>
        <View style={styles.header}>
          <Text style={styles.totalAddQuestion}>
            Số câu hỏi đã thêm: <Text style={{ color: '#159FDA' }}>
              {countQuestion}
            </Text>
          </Text>
          <Text style={styles.txtTotal}>
            Tổng số câu hỏi: <Text style={{ color: '#159FDA' }} num>{totalQuestion || 0}    </Text>
          </Text>
        </View>
        {totalQuestion ? (
          <View style={styles.wrapPagination}>
            <TouchableWithoutFeedback
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              onPress={this.handleClickLeft}>
              <View style={styles.wrapElement}>
                <Icon name={'angle-left'} size={23} color={'rgba(2, 31, 47, 0.4)'} />
              </View>
            </TouchableWithoutFeedback>
            {this.renderPagination()}
            <TouchableWithoutFeedback
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              onPress={this.handleClickRight}>
              <View style={styles.wrapElement}>
                <Icon name={'angle-right'} size={23} color={'rgba(2, 31, 47, 0.4)'} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
            <></>
          )}
      </View>
    );
  }
}

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  contain: {
    justifyContent: 'center',
    marginRight: 10,
    alignItems: 'flex-end',
  },
  wrapPagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtTotal: {
    fontFamily: 'Nunito-Bold',
    color: '#000',
    fontSize: RFFonsize(12),
    marginBottom: 10
  },
  wrapElement: {
    borderWidth: 1,
    borderColor: '#C4C4C4',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 2,
    borderStyle: 'solid',
  },
  txtNumber: {
    color: '#159FDA',
    fontFamily: 'Nunito-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    paddingLeft: 10
  },
  totalAddQuestion: {
    marginLeft: 16,
    fontSize: RFFonsize(12),
    fontFamily: 'Nunito-Bold',
    color: '#000000',
  },
});
