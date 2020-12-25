import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import OfferGift from '../OfferGift';
import HistoryGift from '../HistoryGift';
const { width, height } = Dimensions.get('window');
const TabTop = createMaterialTopTabNavigator({
    HistoryGift: {
        screen: HistoryGift,
        navigationOptions: {
            title: 'Lịch sử đổi quà'
        }
    },
    OfferGift: {
        screen: OfferGift,
        navigationOptions: {
            title: 'Đề xuất',
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
            marginTop: 10,
            marginLeft: width - (width / 1.5),
            elevation: 0,
            shadowOffset: { height: 0, width: 0 },
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