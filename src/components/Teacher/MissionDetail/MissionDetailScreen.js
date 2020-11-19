import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import AppIcon from '../../../utils/AppIcon';
import TabBarTop from './TabBarTop';
const { width, height } = Dimensions.get('window');
export default class MissionDetailScreen extends Component {
    render() {
        const { isLoading, } = this.props;
        return (
            <View style={styles.contain}>
                <SafeAreaView />
                <HeaderNavigation color={'#FFF'} navigation={this.props.navigation} />
                <Image source={AppIcon.pic_mission}
                    resizeMode={'contain'}
                    style={styles.styImgHeader} />
                {
                    isLoading ?
                        <ActivityIndicator style={styles.styLoading} color={'#fff'} />
                        :
                        <TabBarTop screenProps={this.props} />
                }
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
        marginBottom: 10,
        height: 100,
    },
    styWrapConent: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    styLoading: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.1)',
        width, height
    }
})