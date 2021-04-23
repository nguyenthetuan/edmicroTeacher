import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function ItemEssay(props) {

    useEffect(() => {
        setTextPoint(props.data.textPoint.substring(0, props.data.textPoint.indexOf('.') + 3));
    }, [props.data.textPoint])

    const [textPoint, setTextPoint] = useState(props.data.textPoint.substring(0, props.data.textPoint.indexOf('.') + 3));

    const { index } = props.data;

    const onPressAS = (option) => {
        props.onChangeOptionAnswer(index, option);
    }

    const onChangePointEachQS = () => {
        props.onKeyBoardBlur();
        if (isNaN(textPoint)) {
            setTextPoint(props.data.textPoint);
        }
        props.onChangePointEachQS(index, textPoint)
    }

    const onFocus = () => {
        props.onKeyBoardShow(props.data.index);
    }

    const onChangePoint = (point) => {
        if (point[point.length - 1] == ',') {
            point = `${point.substring(0, point.length - 1)}.`
        }
        setTextPoint(point.substring(0, point.indexOf('.') + 3));
    }

    return (
        <View style={styles.itemWrap}>
            <View style={styles.wrapLeft}>
                <View style={styles.numQs}>
                    <Text style={styles.textNumQS}>{(props.data.index + 1)}</Text>
                </View>
                <View style={styles.inputPoint}>
                    <TextInput
                        style={{ fontFamily: 'Nunito-bold', fontSize: 12, lineHeight: 16, color: '#FF6213', paddingVertical: 0, paddingHorizontal: 10 }}
                        textAlign={'center'}
                        value={(Math.round(Number(textPoint) * 100) / 100).toString()}
                        keyboardType='decimal-pad'
                        onChangeText={(val) => onChangePoint(val)}
                        onBlur={onChangePointEachQS}
                        onFocus={onFocus}
                        maxLength={3}
                    />
                </View>
            </View>
            <View style={styles.wrapRight}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemWrap: {
        width: '100%',
        paddingHorizontal: 16,
        flexDirection: 'row',
        height: 30,
        marginTop: 5
    },
    wrapLeft: {
        flexDirection: 'row',
        height: 30,
        justifyContent: 'space-between',
        width: '50%'
    },
    wrapRight: {
        flexDirection: 'row',
        height: 30,
        justifyContent: 'space-between',
        width: '50%',
        paddingLeft: 30,
    },
    numQs: {
        width: 63,
        height: 30,
        backgroundColor: '#56CCF2',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputPoint: {
        width: 77,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#DADADA',
        borderWidth: Platform.OS == 'android' ? 1 : 0.5,
        borderColor: '#828282',
        justifyContent: 'center'
    },
    answerInActive: {
        width: 30,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#DADADA',
        justifyContent: 'center',
        alignItems: 'center'
    },
    answerActive: {
        width: 30,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#4EBE3C',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAS: {
        fontFamily: 'Nunito-bold',
        fontSize: 12,
        color: '#fff',
        lineHeight: 16,
        textAlign: 'center'
    },
    textNumQS: {
        color: '#fff',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Nunito-bold',
    }
})