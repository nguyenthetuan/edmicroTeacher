import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default class StepFourPDF extends Component {
    constructor(props) {
        super(props);
    }

    assignedMission = () => {
        const { item } = this.props.screenProps.data;
        this.props.screenProps.navigation.navigate('Assignment', {
            item: item,
        });
    }

    render() {
        return (
            <View style={styles.contain}>
                <Image
                    // source={AppIcon.image_createCompleteV3}
                    source={require('../../../../asserts/images/image_createCompleteV3.png')}
                    style={{ marginTop: 20 }} />
                <View style={styles.styWrapBtn}>
                    <TouchableOpacity style={styles.styBtn} onPress={this.assignedMission}>
                        <Text style={styles.styTxtBtn}>Giao bài tập</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.styBtn, { backgroundColor: '#FF6213' }]} onPress={this.props.screenProps.goback}>
                        <Text style={styles.styTxtBtn}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    styBtn: {
        backgroundColor: '#2D9CDB',
        borderRadius: 25,
        width: 160,
        height: 30,
        marginHorizontal: 10

    },
    styWrapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 50,
    },
    styTxtBtn: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: (14),
        alignSelf: 'center',
        fontWeight: "700",
        top: 5,
    }
})