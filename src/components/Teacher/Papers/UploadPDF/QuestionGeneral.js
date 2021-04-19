import React, { Component, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, } from 'react-native';
import RippleButton from '../../../libs/RippleButton';
import AppIcon from '../../../../utils/AppIcon';

const MAX_QS = 100;

export default function QuestionGeneral(props) {

    const [totalQSTL, setTotalQSTL] = useState(0);
    const [totalQSTN, setTotalQSTN] = useState(0);

    useEffect(() => {
        setTotalQSTL(props.totalQSTL);
        setTotalQSTN(props.totalQSTN);
    }, [])

    const onPressButtonChangeTotal = (type) => {

    }

    const onTotalQSChange = (val) => {
        let { type } = props;
        if (type === 0) {
            props.onTotalQSChange(totalQSTN);
        } else {
            props.onTotalQSChange(totalQSTL);
        }
    }

    const chekValMax = (num) => {
        let { type } = props;
        // let num = type === 0 ? totalQSTN : totalQSTL;
        if (num >= MAX_QS) {
            props.toast.show('Tổng số câu tối đa 100 câu!')
        }
        return (num <= MAX_QS);
    }

    const _onTotalQSChangeInside = (val) => {
        if (validateIsNotNum(Number(val))) {
            props.toast.show('Số câu nhập vào phải là số tự nhiên!');
            return;
        }
        if (!chekValMax(Number(val))) {
            return false;
        }

        let { type } = props;
        if (type === 0) {
            setTotalQSTN(val);
        } else {
            setTotalQSTL(val);
        }
        return true;
    }

    const validateIsNotNum = (num) => {
        let isInteger = Number.isInteger(num);
        return !isInteger;
    }

    const onTotalPointChange = (point) => {
        if (point[point.length - 1] == ',') {
            point = `${point.substring(0, point.length - 1)}.`
        }
        props.onTotalPointChange(point);
    }

    const deCrease = () => {
        let { totalQSTN, totalQSTL, type } = props;
        let count = 0;
        if (type === 0) {
            if (totalQSTN == 0) {
                return;
            }
            count = totalQSTN - 1;
        } else {
            if (totalQSTL == 0) {
                return;
            }
            count = totalQSTL - 1;
        }
        let countinue = _onTotalQSChangeInside(count);
        if (!countinue) {
            return;
        }
        props.onTotalQSChange(count)
    }

    const inCrease = () => {
        let { totalQSTN, totalQSTL, type } = props;
        let count = 0;
        if (type === 0) {
            count = Number(totalQSTN) + 1;
        } else {
            count = Number(totalQSTL) + 1;
        }
        let countinue = _onTotalQSChangeInside(count);
        if (!countinue) {
            return;
        }
        props.onTotalQSChange(count)
    }

    const viewPDF = (typePDF) => {
        const { urlFilePDFQS, urlFilePDFAS } = props.screenProps.data;
        let url, title;
        if (typePDF === 0) {
            url = urlFilePDFQS;
            title = 'Câu hỏi PDF';
        } else {
            if (!urlFilePDFAS) {
                props.toast.show('Không có file PDF đáp án!');
                return;
            }
            url = urlFilePDFAS;
            title = 'Đáp án PDF';
        }
        props.navigation.navigate('FullViewPDFAssessment', { urlFilePDF: url, text: title, statusbar: 'dark-content' });
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapEachArea}>
                <Text style={styles.textTitle}>Tổng số câu</Text>
                <View style={styles.wrapCofigTotalQS}>
                    <RippleButton style={styles.buttonChangeTotal} onPress={deCrease}>
                        <Image source={AppIcon.icon_minus} />
                    </RippleButton>
                    <View style={{ width: 40, height: 30, }}>
                        <TextInput
                            style={{ with: 40, height: 30, fontFamily: 'Nunito-bold', color: '#2D9CDB', textAlign: 'center', paddingVertical: 0 }}
                            onChangeText={_onTotalQSChangeInside}
                            keyboardType={'number-pad'}
                            onBlur={onTotalQSChange}
                            value={props.type === 0 ? totalQSTN.toString() : totalQSTL.toString()}
                        />
                    </View>
                    <RippleButton style={styles.buttonChangeTotal} onPress={inCrease}>
                        <Image source={AppIcon.icon_plus} />
                    </RippleButton>
                </View>
            </View>
            <View style={[styles.wrapEachArea, { paddingLeft: 10 }]}>
                <Text style={styles.textTitle}>Tổng điểm</Text>
                <View style={styles.wrapTotalPoint}>
                    <TextInput
                        style={{ height: 30, fontFamily: 'Nunito-bold', color: '#FF6213', textAlign: 'center', paddingVertical: 0 }}
                        onChangeText={onTotalPointChange}
                        keyboardType={'decimal-pad'}
                        value={props.type === 0 ? props.totalPointTN.toString() : props.totalPointTL.toString()}
                    />
                </View>
            </View>
            <View style={[styles.wrapEachArea, { alignItems: 'center' }]}>
                <RippleButton style={styles.buttonPDF} radius={15} onPress={() => { viewPDF(0) }}>
                    <Text style={styles.textInButton}>
                        Xem đề PDF
                    </Text>
                </RippleButton>
                <RippleButton style={styles.buttonPDF} radius={15} onPress={() => { viewPDF(1) }}>
                    <Text style={styles.textInButton}>
                        Xem lời giải
                    </Text>
                </RippleButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 90,
        paddingHorizontal: 16,
        flexDirection: 'row',
    },
    wrapEachArea: {
        width: '33%',
        height: 100,
        justifyContent: 'space-evenly'
    },
    wrapCofigTotalQS: {
        width: 100,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#2D9CDB',
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row'
    },
    buttonChangeTotal: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapTotalPoint: {
        borderColor: '#2D9CDB',
        backgroundColor: '#fff',
        width: 77,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
    },
    buttonPDF: {
        borderColor: '#2D9CDB',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#fff',
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInButton: {
        fontFamily: 'Nunito-bold',
        fontSize: 12,
        color: '#2D9CDB',

    },
    textTitle: {
        fontSize: 14,
        fontFamily: 'Nunito-bold',
        lineHeight: 19,
    }
})