import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import SelectModal from './SelectModal';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');

export default function Dropdown(props) {
  const selectModal = useRef();

  const [dropdownVisible, showDropdown] = useState(false);
  const [indexSelected, setIndex] = useState(props.indexSelected || 0);
  console.log("indexSelected: ", props.type, indexSelected);
  const { containerStyle, title, data, contentStyle, boldText } = props;
  const isData = data && data[indexSelected];
  return (
    <View style={containerStyle}>
      <TouchableWithoutFeedback
        onPress={() => {
          showDropdown(!dropdownVisible);
          selectModal.current.onShowModal();
        }}
      >
        <View style={[styles.styBtn, contentStyle]}>
          <Text numberOfLines={1} style={[styles.styTxt, { color: isData ? '#2D9CDB' : '#C4C4C4' }, boldText]}>
            {isData
              ? data[indexSelected].className || data[indexSelected].name || ''
              : title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <SelectModal
        onHide={() => showDropdown(false)}
        ref={selectModal}
        data={data}
        title={title}
        indexSelected={indexSelected}
        onPressItem={(i) => {
          setIndex(i);
          if (props.onPressItem) {
            props.onPressItem(i);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  styBtn: {
    width: width / 3,
    height: 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 20,
  },
  styTxt: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#2D9CDB',
    paddingHorizontal: 6,
  },
  contain: {
    borderRadius: 10,
  },
});
