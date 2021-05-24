import React, { useState, useRef } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import SelectModal from './SelectModal';
import AppIcon from '../utils/AppIcon';
import { RFFonsize } from '../utils/Fonts';
import { getAssigmentStatus } from '../models/Assigment';
const { width, height } = Dimensions.get('window');

export default function Dropdown(props) {
    const selectModal = useRef();

    const [dropdownVisible, showDropdown] = useState(false);
    const [indexSelected, setIndex] = useState(props.indexSelected);

    const { containerStyle, title, data, contentStyle, status } = props;
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
                    <Text numberOfLines={1} style={[styles.styTxt, { color: isData ? '#2D9CDB' : '#828282' }]}>
                        {isData
                            ? data[indexSelected].className || data[indexSelected].name || data[indexSelected].subjectName || data[indexSelected].studentName + " " + `(${getAssigmentStatus(status)})` || ''
                            : title}
                    </Text>
                    {props.isShowIcon && <Image source={require('../asserts/icon/icon_down.png')} resizeMode='stretch' style={styles.styArrowDown} />}
                </View>
            </TouchableWithoutFeedback>
            <SelectModal
                onHide={() => showDropdown(false)}
                ref={selectModal}
                data={data}
                title={title}
                indexSelected={indexSelected}
                onPressItem={(i, item) => {
                    setIndex(i);
                    if (props.onPressItem) {
                        props.onPressItem(i, item);
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
        borderRadius: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 20,
        overflow: 'hidden'
    },
    styTxt: {
        flex: 1,
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        color: '#2D9CDB',
        paddingHorizontal: 6,
    },
    contain: {
        borderRadius: 10,
    },
    styArrowDown: {
        // width: 30,
        // height: 30,
        // position: 'absolute',
        // right: 0,
        // top: 0,
        // borderWidth: 1,
        // borderColor: '#AAE5F9',
        alignSelf: 'center',
        marginRight: 5
    }
});
