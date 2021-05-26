
import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const { width, height } = Dimensions.get('window');

export default class ClassHolder extends Component {
    renderItem() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.top, { marginTop: 0 }]}>
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.6,
                            height: 15,
                            borderRadius: 1,
                            alignSelf: 'center',
                        }} />
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.2,
                            height: 15,
                            borderRadius: 1,
                            alignSelf: 'center',
                        }} />
                </View>
                <View style={[styles.top]}>
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.3,
                            height: 8,
                            borderRadius: 1,
                            alignSelf: 'center',
                            top: 6
                        }} />
                </View>
                <View style={styles.top}>
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.7,
                            height: 3,
                            borderRadius: 1,
                            alignSelf: 'center',
                            top: 6
                        }} />
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.1,
                            height: 3,
                            borderRadius: 1,
                            alignSelf: 'center',
                            top: 6
                        }} />
                </View>
                <View style={[styles.top, { paddingTop: 10 }]}>
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.35,
                            height: 20,
                            borderRadius: 5,
                            alignSelf: 'center',
                            top: 9
                        }} />
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.35,
                            height: 20,
                            borderRadius: 5,
                            alignSelf: 'center',
                            top: 9
                        }} />
                </View>
                <View style={styles.top}>
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.35,
                            height: 20,
                            borderRadius: 5,
                            alignSelf: 'center',
                            top: 9
                        }} />
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.35,
                            height: 20,
                            borderRadius: 5,
                            alignSelf: 'center',
                            top: 9
                        }} />
                </View>
                <View style={styles.btn}>
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width * 0.7,
                            height: 30,
                            borderRadius: 30,
                            alignSelf: 'center',
                        }} />
                </View>
            </View>
        );
    }

    render() {
        return (
            <FlatList
                data={Array.from(Array(5).keys())}
                renderItem={this.renderItem}
                keyExtractor={(i, index) => index.toString()}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginTop: 10,
    },
    btn: {
        flex: 1,
        marginTop: 30,
    }
});