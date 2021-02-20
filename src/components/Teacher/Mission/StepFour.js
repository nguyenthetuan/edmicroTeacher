import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import dataHelper from '../../../utils/dataHelper';
import Global from '../../../utils/Globals';
import { RFFonsize } from '../../../utils/Fonts';
const { width } = Dimensions.get('window');
export default class StepFour extends Component {

    componentDidMount() {
        this.getToken();
    }

    async getToken() {
        const { token } = await dataHelper.getToken();
        this.props.screenProps.getListMission({ token });
    }

    createMissionOther = () => {
        this.reset();
        this.props.navigation.navigate('StepOne');
        this.props.screenProps.handleNextStep(0);
    }

    assignedMission = () => {
        this.reset();
        this.props.screenProps.navigation.navigate('MissionDetail', {
            statusbar: 'dark-content'
        });
    }

    reset = () => {
        Global.resetDataTestAdd();
        Global.resetDataPracticeAdd();
        this.props.screenProps.resetDataMission();
    }

    render() {
        return (
            <View style={styles.contain}>
                <Image source={AppIcon.image_createCompleteV3} style={{ marginTop: 20 }} />
                <Text style={styles.styTxtAlert}>Tạo nhiệm vụ thành công! Bạn muốn làm gì tiếp theo?</Text>
                <View style={styles.styWrapBtn}>
                    <TouchableOpacity
                        style={[styles.styBtn, { backgroundColor: '#28A745' }]}
                        onPress={this.createMissionOther}
                    >
                        <Text style={styles.styTxtBtn}>Tạo nhiệm vụ khác</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.styBtn} onPress={this.assignedMission}>
                        <Text style={styles.styTxtBtn}>Giao nhiệm vụ vừa tạo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.styBtn, { backgroundColor: '#ffbe70' }]} onPress={this.props.screenProps.goback}>
                        <Text style={styles.styTxtBtn}>Màn hình chính</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        alignItems: 'center',
    },
    styBtn: {
        // borderRadius: 25,
        // padding: 10,
        // margin: 3,
        // alignItems: 'center',
        // backgroundColor: '#2D9CDB',
        // width: width / 2 - 20,
        backgroundColor: '#2D9CDB',
        borderRadius: 25,
        marginBottom: 10,
        marginLeft: 27,
        marginRight: 27,
        paddingHorizontal: 60
    },
    styWrapBtn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 20,
        marginTop: 10
    },
    styTxtAlert: {
        fontFamily: 'Nunito-Bold',
        color: '#28A745',
        fontSize: RFFonsize(16),
        textAlign: 'center',
        margin: 20,
    },
    styTxtBtn: {
        // color: '#FFF',
        // fontFamily: 'Nunito',
        // fontWeight: "500",
        // alignSelf: 'center',
        // lineHeight: 21
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(18),
        lineHeight: RFFonsize(21),
        alignItems: 'center',
        alignSelf: 'center',
        fontWeight: "500",
        marginTop: 14,
        marginBottom: 14
    }
})