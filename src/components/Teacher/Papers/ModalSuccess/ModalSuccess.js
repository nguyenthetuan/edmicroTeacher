import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback
} from 'react-native';
const { width } = Dimensions.get('window');
import { RFFonsize } from '../../../../utils/Fonts';
import AppIcon from '../../../../utils/AppIcon';
import Common from '../../../../utils/Common';
import _ from 'lodash';
import ZoomAnim from '../../../anim/ZoomAnim';

const getText = (duration, subjectActive, assignmentType, name) => {
    let string = 'Bạn đã tạo thành công bộ đề';
    if (assignmentType) {
        string = string + ` kiểm tra ${duration} phút: \"`
    } else {
        string = string + ' tự luyện: \"'
    }
    string += name;
    string += '\"'
    return string;
}

const ModalSuccess = (props) => {
    const {
        data,
    } = props;
    const { subjectCode, duration, assignmentType, name } = data;

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={styles.contain}>
                <Image
                    source={require('../../../../asserts/images/image_createCompleteV3.png')}
                    style={{ marginTop: 100, width: "80%" }} resizeMode='contain' />
                <ZoomAnim>
                    <Text style={styles.textDes}>{getText(duration / 60, subjectCode, assignmentType, name)}</Text>
                </ZoomAnim>

                <View style={styles.styWrapBtn}>
                    <TouchableWithoutFeedback onPress={props.goToAssigned}>
                        <View style={styles.styBtn} >
                            <Text style={styles.styTxtBtn}>Giao bài tập</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => { props.navigation.navigate('TestKit') }}
                    >
                        <View style={[styles.styBtn, { backgroundColor: '#FF6213', marginTop: 10 }]}>
                            <Text style={styles.styTxtBtn}>Quay lại</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
            {/* <SafeAreaView style={{ flex: 0 }} /> */}
        </View>
    );
}

export default ModalSuccess;

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    textDone: {
        fontSize: 31,
        lineHeight: 40,
        fontFamily: 'Nunito-bold',
        fontWeight: '400',
        color: '#2D9CDB',
        top: 40
    },
    textDes: {
        fontWeight: '400',
        fontFamily: 'Nunito',
        fontSize: 16,
        color: '#828282',
        top: 20,
        maxWidth: width / 2
    },
    styBtn: {
        backgroundColor: '#36B9FD',
        borderRadius: 5,
        width: 0.9 * width,
        height: 45,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 2.5,
        justifyContent: 'center',
        alignItems: 'center'

    },
    styWrapBtn: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 50
    },
    styTxtBtn: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: (14),
        alignSelf: 'center',
        fontWeight: "800",
        // top: 5,
    }
})