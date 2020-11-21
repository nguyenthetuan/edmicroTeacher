import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import AppIcon from '../../../utils/AppIcon';
import TabBarTop from './TabBarTop';
const { width, height } = Dimensions.get('window');
export default class MissionDetailScreen extends Component {
    goBack = () => {
        this.props.navigation.pop(2);
    }
    render() {
        const { isLoading, } = this.props;
        return (
            <View style={styles.contain}>
                <View style={{ backgroundColor: '#2D9CDB' }}>
                    <SafeAreaView />
                    <HeaderNavigation color={'#FFF'} navigation={this.props.navigation} goBack={this.goBack} />
                    <Image source={AppIcon.pic_mission}
                        resizeMode={'contain'}
                        style={styles.styImgHeader} />
                </View>
                {
                    isLoading ?
                        <ActivityIndicator style={styles.styLoading} color={'#000'} />
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
        backgroundColor: '#FFF'
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
        width, height,
        top: '15%'
    }
})