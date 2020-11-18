import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import TabClass from './TabClass';
import TabMission from './TabMission';

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
    inactiveTintColor: '#C4C4C4',
    style: {
        backgroundColor: '#FFF',
    },
    tabBarOptions: {
        style: {
            backgroundColor: '#2D9CDB',
        },
        tabStyle: {
            width: 120,
            height: 25,
            justifyContent: 'flex-start',
            padding: 0
        },
        labelStyle: {
            fontFamily: 'Nunito-Regular'
        },
        indicatorStyle: {
            backgroundColor: '#FFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 5
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