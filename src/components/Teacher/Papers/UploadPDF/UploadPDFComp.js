import { View, Text, StyleSheet, Image } from 'react-native';
import RippleButton from '../../../common-new/RippleButton';
import React, { Component } from 'react';
import shadowStyle from '../../../../themes/shadowStyle';
export default function UploadPDFComp(props) {
    const { fileName } = props;
    const { shadowBtn } = shadowStyle;
    return (
        <View style={[styles.wrap, props.marginTop && { marginTop: props.marginTop }]}>
            <Text style={styles.titleText}>{props.title}</Text>
            <RippleButton style={styles.areaFileName} onPress={() => { props.buttons.callback1(props.buttons.typePDF) }}>
                <Text style={styles.fileName} ellipsizeMode="tail" maxLength={100} numberOfLines={1}>{fileName || '...'}</Text>
            </RippleButton>
            <View style={[styles.wrapButton, { ...shadowBtn }]}>
                <RippleButton style={styles.button1} onPress={() => { props.buttons.callback1(props.buttons.typePDF) }}>
                    <Image source={fileName ? props.buttons.icon1_2 : props.buttons.icon1} style={{ tintColor: props.buttons.titleColor }} />
                    <Text style={[styles.textButton, { color: props.buttons.titleColor }]}>{fileName ? props.buttons.titleButton1_2 : props.buttons.titleButton1}</Text>
                </RippleButton>
                <RippleButton style={[styles.button2, { backgroundColor: fileName ? '#fff' : '#E0E0E0', borderColor: fileName ? '#56CCF2' : '#828282' }]} onPress={() => { props.buttons.callback2(props.buttons.typePDF) }} >
                    <Image source={props.buttons.icon2} style={{ tintColor: props.buttons.titleColor }} />
                    <Text style={[styles.textButton, { color: props.buttons.titleColor }]}>{props.buttons.titleButton2}</Text>
                </RippleButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        width: '100%',
        height: 125,
        paddingHorizontal: 16
    },
    textButton: {
        fontFamily: 'Nunito',
        fontSize: 14
    },
    fileName: {
        color: '#2D9CDB',
        fontSize: 14,
        fontFamily: 'Nunito',
        maxWidth: '80%',
    },
    titleText: {
        fontSize: 14,
        fontFamily: 'Nunito',
        fontWeight: '700',
    },
    areaFileName: {
        height: 40,
        width: '100%',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#56CCF2',
        justifyContent: 'center',
        marginTop: 8,
        backgroundColor: 'rgba(86, 204, 242, 0.1)'
    },
    wrapButton: {
        marginTop: 24,
        height: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    button2: {
        width: 100,
        height: 30,
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#828282',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
    },
    button1: {
        width: 100,
        height: 30,
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#2D9CDB',
        marginRight: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10
    },

})