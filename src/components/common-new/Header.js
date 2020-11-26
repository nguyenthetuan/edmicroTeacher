import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import leadIcon from '../../asserts/icon/back_arrow.png';
import Ripple from 'react-native-material-ripple';
import RippleButton from '../libs/RippleButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const HeaderPrimary = (props) => {
    const { showLead = true, navigation, title } = props;
    return (
        <View style={styles.rowContainer}>
            {showLead ?
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <View style={styles.boxAction}>
                        <Image source={leadIcon} style={styles.leadIcon} />
                    </View>
                </TouchableWithoutFeedback>
                :
                <View style={styles.boxAction} />
            }
            <Text style={styles.textTitle}>{title}</Text>
            <View style={styles.boxAction}>
            </View>
        </View>
    );
}

export default HeaderPrimary;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        height: 52,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    boxAction: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leadIcon: {
        marginRight: 5
    },
    textTitle: {
        flex: 1,
        color: '#757575',
        fontSize: 16,
        textAlign: 'center'
    }
});