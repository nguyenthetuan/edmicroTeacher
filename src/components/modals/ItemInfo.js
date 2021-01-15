import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { RFFonsize } from '../../utils/Fonts';
import Common from '../../utils/Common';
export default class ItemInfo extends Component {

  constructor(props) {
    super(props);
    const { type, number } = this.props;
    this.state = {
      type: type || '',
      number: number || '',
      scaleText: new Animated.Value(0)
    }
  }

  scaleIn() {
    Animated.timing(this.state.scaleText, {
      toValue: 1,
      duration: 500
    }).start();
  }

  componentDidMount() {
    this.scaleIn();
  }

  componentWillReceiveProps(nextProps) {
    const { type, number } = this.props;
    if (nextProps !== type) {
      this.setState({ type: nextProps.type })
    }
    if (nextProps.number !== number) {
      this.setState({ number: nextProps.number })
    }
  }

  render() {
    const { type, number } = this.props;
    let status = type.toString();
    if (number === undefined) {
      return null
    }
    return (
      <Animated.View style={[styles.rowItem, { transform: [{ scale: this.state.scaleText }] }]}>
        <Animated.Image source={Common.getIconModal(status)} resizeMode={'contain'} />
        <Text style={[styles.textItem, { color: '#000' }]}>{`${Common.getLabel(status)}`}</Text>
        <Text style={[styles.textNumber, { color: Common.getTextColor(status) || '#000' }]}>{number}</Text>
      </Animated.View>
    );
  }
}

ItemInfo.propTypes = {
  number: PropTypes.string,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf([
    'Total', 'True',
    'False', 'Acur', 'Speed',
    'Pause', 'Skip', 'Attempted', 'ResiveLaster',
    'UnAttempted', 'Time', 'Point', 'FalseAndSkip'
  ]).isRequired,
}

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    // borderBottomWidth: 1,
    paddingVertical: 7,
    marginTop: 5,
    // borderColor: '#D3D3D3',
  },
  textItem: {
    flex: 1,
    color: '#5bc0de',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  textNumber: {
    fontFamily: 'Nunito-Bold',
    color: '#000',
    fontSize: 14,
    alignSelf: 'flex-end'
  }
});

ItemInfo.propTypes = {
  number: PropTypes.string,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf([
    'Total', 'True', 'False', 'Acur', 'Speed', 'Pause', 'Skip', 'Attempted', 'FalseAndSkip'
  ]).isRequired,
}
