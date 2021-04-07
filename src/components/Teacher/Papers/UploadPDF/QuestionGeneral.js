import React, { Component, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, } from 'react-native';
import RippleButton from '../../../libs/RippleButton';
import AppIcon from '../../../../utils/AppIcon';

export default function QuestionGeneral(props) {

    useEffect(() => {

    }, [])

    const onPressButtonChangeTotal = (type) => {

    }

    const onTotalQSChange = (val) => {
        props.onTotalQSChange(val);
    }

    const onTotalPointChange = (val) => {
        props.onTotalPointChange(val);
    }

    const deCrease = () => {
        let { totalQSTN, totalQSTL, type } = props;
        let count = 0;
        if (type === 0) {
            count = totalQSTN - 1;
        } else {
            count = totalQSTL - 1;
        }
        props.onTotalQSChange(count)
    }

    const inCrease = () => {
        let { totalQSTN, totalQSTL, type } = props;
        let count = 0;
        if (type === 0) {
            count = totalQSTN + 1;
        } else {
            count = totalQSTL + 1;
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
            url = urlFilePDFAS;
            title = 'Đáp án PDF';
        }
        props.navigation.navigate('FullViewPDFAssessment', { urlFilePDF: url, text: title });
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
                            style={{ with: 40, height: 30, fontFamily: 'Nunito-bold', color: '#2D9CDB', textAlign: 'center' }}
                            onChangeText={onTotalQSChange}
                            keyboardType={'number-pad'}
                            value={props.type === 0 ? props.totalQSTN.toString() : props.totalQSTL.toString()}
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
                        style={{ height: 30, fontFamily: 'Nunito-bold', color: '#FF6213', textAlign: 'center' }}
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