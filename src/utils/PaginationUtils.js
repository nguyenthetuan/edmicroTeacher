import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
      <TouchableOpacity
        key={'elementDotEnd'}
        onPress={this.handleClickDot('+')}
        style={styles.wrapElement}>
        <Text style={styles.txtNumber}>...</Text>
      </TouchableOpacity>
    );
    const elementDotStart = (
      <TouchableOpacity
        key={'elementDotStart'}
        onPress={this.handleClickDot('-')}
        style={styles.wrapElement}>
        <Text style={styles.txtNumber}>...</Text>
      </TouchableOpacity>
    );
    if (indexStart >= indexEnd - 3 && indexStart) {
      arrElement.push(elementDotStart);
    }
    for (let i = 0; i < length; i++) {
      if (i < indexEnd && indexStart <= i) {
        element = (
          <TouchableOpacity
            key={i}
            onPress={this.handleClickIndex(i)}
            style={[
              styles.wrapElement,
              { backgroundColor: indexCurrent == i ? '#159FDA' : '#FFF' },
            ]}>
            <Text
              style={[
                styles.txtNumber,
                { color: indexCurrent == i ? '#FFF' : '#159FDA' },
              ]}>
              {i + 1}
            </Text>
          </TouchableOpacity>
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
    const { totalQuestion } = this.props;
    return (
      <View style={styles.contain}>
        <Text style={styles.txtTotal}>
          Tổng số câu hỏi: {totalQuestion || 0}
        </Text>
        {totalQuestion ? (
          <View style={styles.wrapPagination}>
            <TouchableOpacity
              style={styles.wrapElement}
              onPress={this.handleClickLeft}>
              <Icon name={'angle-left'} size={23} color={'#159FDA'} />
            </TouchableOpacity>
            {this.renderPagination()}
            <TouchableOpacity
              style={styles.wrapElement}
              onPress={this.handleClickRight}>
              <Icon name={'angle-right'} size={23} color={'#159FDA'} />
            </TouchableOpacity>
          </View>
        ) : (
            <></>
          )}
      </View>
    );
  }
}

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
    color: '#159FDA',
    fontSize: 12,
    marginVertical: 5,
  },
  wrapElement: {
    borderWidth: 1,
    borderColor: '#159FDA',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  txtNumber: {
    color: '#159FDA',
    fontFamily: 'Nunito-Regular',
  },
});
