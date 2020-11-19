import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import dataHelper from '../../../utils/dataHelper';
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
        this.props.navigation.navigate('StepOne');
        this.props.screenProps.handleNextStep(0);
    }

    render() {
        return (
            <View style={styles.contain}>
                <Image source={AppIcon.pic_mission} />
                <Text style={styles.styTxtAlert}>Tạo nhiệm vụ thành công! Bạn muốn làm gì tiếp theo?</Text>
                <View style={styles.styWrapBtn}>
                    <TouchableOpacity style={[styles.styBtn, { backgroundColor: '#28a745' }]} onPress={this.createMissionOther}>
                        <Text style={styles.styTxtBtn}>Tạo nhiệm vụ khác</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.styBtn}>
                        <Text style={styles.styTxtBtn}>Giao nhiệm vụ vừa tạo</Text>
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
        borderRadius: 5,
        padding: 10,
        margin: 3,
        alignItems: 'center',
        backgroundColor: '#007bff',
        width: width / 2 - 20
    },
    styWrapBtn: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 20
    },
    styTxtAlert: {
        fontFamily: 'Nunito-Bold',
        color: '#f86c6b',
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    styTxtBtn: {
        color: '#FFF',
        fontFamily: 'Nunito-Regular',
    }
})