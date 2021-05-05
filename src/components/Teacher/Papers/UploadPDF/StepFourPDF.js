import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import Common from '../../../../utils/Common';

const { width } = Dimensions.get('window');

export default class StepFourPDF extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content');
    }

    assignedMission = () => {
        const { item } = this.props.navigation.state.params.data;
        this.props.navigation.pop(1);
        this.props.navigation.navigate('Assignment', {
            item: item,
        });
    }

    getText = () => {
        const { duration, assignmentType, subjectActive } = this.props.navigation.state.params.data;
        let string = 'Bạn đã tạo thành công bộ đề';
        if (assignmentType) {
            string = string + ` \"Kiểm tra ${duration} phút`
        } else {
            string = string + ' \"Tự luyện'
        }
        if (subjectActive.length > 1) {
            string = string + ' liên môn\"'
        } else {
            string = string + ' môn ' + Common.getDisplaySubject(subjectActive[0]) + '\"';
        }
        return string;

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={styles.contain}>
                    <Text style={styles.textDone}>Thành Công!</Text>
                    <Image
                        // source={AppIcon.image_createCompleteV3}
                        source={require('../../../../asserts/images/image_createCompleteV3.png')}
                        style={{ marginTop: 80, width: '80%' }} resizeMode='contain' />
                    <View style={styles.styWrapBtn}>
                        <TouchableOpacity style={styles.styBtn} onPress={this.assignedMission}>
                            <Text style={styles.styTxtBtn}>Giao bài tập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.styBtn, { backgroundColor: '#FF6213', marginTop: 10 }]} onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={styles.styTxtBtn}>Quay lại</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textDes}>{this.getText()}</Text>
                </SafeAreaView>
                <SafeAreaView style={{ flex: 0 }} />
            </View>
        )
    }
}

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
        bottom: 10
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