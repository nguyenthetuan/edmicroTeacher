import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import OfferGift from '../OfferGift';
import HistoryGift from '../HistoryGift';
const { width, height } = Dimensions.get('window');
const TabTop = createMaterialTopTabNavigator({
    OfferGift: {
        screen: OfferGift,
        navigationOptions: {
            title: 'Đề xuất',
        }
    },
    HistoryGift: {
        screen: HistoryGift,
        navigationOptions: {
            title: 'Lịch sử đổi quà'
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
            marginTop: 10,
            marginLeft: width - (width / 1.5),
        },
        tabStyle: {
            width: width / 3,
            height: 25,
            justifyContent: 'flex-start',
            padding: 0,
        },
        labelStyle: {
            fontFamily: 'Nunito-Bold',
            color: '#2D9CDB',
            fontSize: 12,
            lineHeight: 16,
            textAlign: 'center',
        },
        indicatorStyle: {
            backgroundColor: '#2D9CDB',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 1,
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