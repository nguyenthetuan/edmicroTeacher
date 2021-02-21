import React, { useState, useRef } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import SelectModal from './SelectModal';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');

export default function DropdownMultiSelect(props) {
    const selectModal = useRef();

    const [dropdownVisible, showDropdown] = useState(false);
    // const [indexSelected, setIndex] = useState(props.indexSelected);
    const [indexSelected, setIndex] = useState([]);
    const [dataSelect, setDataSelect] = useState([]);

    const { containerStyle, title, data, contentStyle } = props;
    const isData = data && data[indexSelected[0]];

    const renderSelect = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                {renderItemList()}
            </View>
        )
    }

    const renderItemList = () => {
        let renderList = [];
        for (let i = 0; i < indexSelected.length; i++) {
            let index = indexSelected[i];
            renderList.push(
                <View style={[styles.wrapSelected, !isData && { borderWidth: 0, backgroundColor: 'transparent' }]}>
                    <TouchableOpacity onPress={() => onPressMinus(index)} style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 10, borderColor: 'red', position: 'absolute', right: -10, top: -10, backgroundColor: '#C4C4C4', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '800', color: 'red', top: -6 }}>_</Text>
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={[styles.styTxt, { color: isData ? '#2D9CDB' : '#C4C4C4' }]}>
                        {isData
                            ? data[index].className || data[index].name || ''
                            : title}
                    </Text>
                </View>
            )
        }
        return renderList;
    }

    const onPressItem = (index) => {
        const indexOf = indexSelected.indexOf(index);
        let indexSelectTmp = indexSelected;

        if (indexOf < 0) {
            indexSelectTmp.push(index)
        } else {
            indexSelectTmp.splice(indexOf, 1);
        }
        setIndex(indexSelectTmp);
        if (props.onPressItem) {
            props.onPressItem(indexSelectTmp);
        }
    }

    const onPressMinus = index => {
        const indexOf = indexSelected.indexOf(index);
        let indexSelectTmp = indexSelected;

        if (indexOf < 0) {

        } else {
            indexSelectTmp.splice(indexOf, 1);
        }
        setIndex(indexSelectTmp);
        props.onPressItem(indexSelectTmp);

    }

    return (
        <View style={containerStyle}>
            <TouchableOpacity
                onPress={() => {
                    showDropdown(!dropdownVisible);
                    selectModal.current.onShowModal();
                }}
                style={[styles.styBtn, contentStyle]}>
                {renderSelect()}
            </TouchableOpacity>
            <SelectModal
                onHide={() => showDropdown(false)}
                ref={selectModal}
                data={data}
                title={title}
                indexSelected={indexSelected}
                onPressItem={(i) => {
                    onPressItem(i)
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
    wrapSelected: {
        height: 25,
        borderWidth: 1,
        borderColor: '#2D9CDB',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 2,
        backgroundColor: 'rgba(86, 204, 242, 0.3)',
        marginHorizontal: 5
    }
});
