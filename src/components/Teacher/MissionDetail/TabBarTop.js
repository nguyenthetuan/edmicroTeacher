import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import TabClass from './TabClass';
import TabMission from './TabMission';
import { RFFonsize } from '../../../utils/Fonts';
const TabTop = createMaterialTopTabNavigator({
    TabMission: {
        screen: TabMission,
        navigationOptions: {
            title: 'Cấu hình',
        }
    },
    TabClass: {
        screen: TabClass,
        navigationOptions: {
            title: 'Giao nhiệm vụ'
        }
    },
}, {
    activeTintColor: '#fff',
    inactiveTintColor: '#828282',
    style: {
        backgroundColor: '#FFF',
    },
    tabBarOptions: {
        style: {
            backgroundColor: '#fff',
            elevation: 0,
            marginTop: 10
        },
        tabStyle: {
            width: 120,
            height: 25,
            justifyContent: 'flex-start',
            padding: 0,
        },
        labelStyle: {
            fontFamily: 'Nunito-Bold',
            color: '#56CCF2',
            fontSize: 12,
            lineHeight: 16,
            textAlign: 'center',
        },
        indicatorStyle: {
            backgroundColor: '#56CCF2',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 5,
        },
        upperCaseLabel: false,
    }
});

export default createAppContainer(TabTop)

const styles = StyleSheet.create({
    styNode: {
        width: 110,
        height: 5,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    styWrapNode: {
        justifyContent: 'center',
        marginHorizontal: 2
    },
    row: {
        flexDirection: 'row'
    },
    styTxtNode: {
        color: '#C4C4C4',
        textAlign: 'center',
        fontFamily: 'Nunito-Regular'
    },
    styTxtNodeActive: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Nunito-Bold'
    }
})