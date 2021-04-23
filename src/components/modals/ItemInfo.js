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
        <Animated.Image source={Common.getIconModal(status)} resizeMode={'contain'} style={{ alignSelf: 'center' }} />
        {/* <View style={styles.stylLine} /> */}
        <Text style={[styles.textNumber, { color: Common.getTextColor(status) || '#000' }]}>{number}</Text>
        <Text style={[styles.textItem, { color: '#000' }]}>{`${Common.getLabel(status)}`}</Text>
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
    'UnAttempted', 'Time', 'Point', 'FalseAndSkip',
    'TimePratice', 'TimeTest'
  ]).isRequired,
}

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'column',
    paddingVertical: 7,
    marginTop: 5,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  textItem: {
    color: '#5bc0de',
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    alignSelf: 'center',
    marginTop: 5,
  },
  textNumber: {
    fontFamily: 'Nunito-Bold',
    color: '#000',
    fontSize: RFFonsize(14),
    alignSelf: 'center',
    marginTop: 5,
  },
  stylLine: {
    height: 1,
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#69D8FC',
    width: '50%',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginHorizontal: 5
  },
});

ItemInfo.propTypes = {
  number: PropTypes.string,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf([
    'Total', 'True', 'False', 'Acur', 'Speed', 'Pause', 'Skip', 'Attempted', 'FalseAndSkip', 'TimePratice', 'TimeTest'
  ]).isRequired,
}
