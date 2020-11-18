import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import AppIcon from '../../../utils/AppIcon';
import TabBarTop from './TabBarTop';
export default class MissionDetailScreen extends Component {
    render() {
        const { missionDetail, classList } = this.props;
        console.log("MissionDetailScreen -> render -> classList", classList)
        console.log("MissionDetailScreen -> render -> missionDetail", missionDetail)
        return (
            <View style={styles.contain}>
                <SafeAreaView />
                <HeaderNavigation color={'#FFF'} navigation={this.props.navigation} />
                <Image source={AppIcon.pic_mission}
                    resizeMode={'contain'}
                    style={styles.styImgHeader} />
                <TabBarTop screenProps={this.props} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#2D9CDB'
    },
    styImgHeader: {
        alignSelf: 'center',
        zIndex: -1,
        marginBottom: 10
    },
    styWrapConent: {
        flex: 1,
        backgroundColor: '#FFF'
    }
})