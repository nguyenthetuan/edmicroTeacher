import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import SelectModal from './SelectModal';

const { width, height } = Dimensions.get('window');

export default function Dropdown(props) {
  const selectModal = useRef();

  const [dropdownVisible, showDropdown] = useState(false);
  const [indexSelected, setIndex] = useState(props.indexSelected);

  const { containerStyle, title, data, contentStyle } = props;
  const isData = data && data[indexSelected];
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={() => {
          showDropdown(!dropdownVisible);
          selectModal.current.onShowModal();
        }}
        style={[styles.styBtn, contentStyle]}>
        <Text numberOfLines={1} style={[styles.styTxt, { color: isData ? '#2D9CDB' : '#C4C4C4' }]}>
          {isData
            ? data[indexSelected].className || data[indexSelected].name || ''
            : title}
        </Text>
      </TouchableOpacity>
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
    fontSize: 14,
    color: '#2D9CDB',
    paddingHorizontal: 6,
  },
  contain: {
    borderRadius: 10,
  },
});
