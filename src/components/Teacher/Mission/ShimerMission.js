import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const { width, height } = Dimensions.get('window');

export default class ShimerMockExam extends Component {
    renderItem() {
        return (
            <View style={[styles.container]}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <ShimmerPlaceHolder visible={false}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 15
                        }}
                    />
                    <ShimmerPlaceHolder visible={false}
                        style={[{
                            width: 30,
                            height: 8,
                            marginTop: 10,
                            borderRadius: 3
                        }]}
                    />
                </View>

                <View style={{ width: width - 100 }}>
                    <ShimmerPlaceHolder
                        visible={false}
                        style={{
                            width: width / 2,
                            height: 15,
                            borderRadius: 3,
                            alignSelf: 'center'
                        }} />

                    <View style={styles.styWrap}>
                        <ShimmerPlaceHolder
                            visible={false}
                            style={[{
                                width: 50,
                                height: 15,
                                borderRadius: 3
                            }]} />
                        <ShimmerPlaceHolder
                            visible={false}
                            style={[{
                                marginVertical: 10,
                                width: 50,
                                height: 15,
                                borderRadius: 3
                            }]} />
                    </View>
                    <View style={styles.styWrap}>
                        <ShimmerPlaceHolder
                            visible={false}
                            style={[{
                                width: 50,
                                height: 15,
                                borderRadius: 3
                            }]} />
                        <ShimmerPlaceHolder
                            visible={false}
                            style={[{
                                marginVertical: 10,
                                width: 50,
                                height: 15,
                                borderRadius: 3
                            }]} />
                    </View>
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
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 5,
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 10,
    },
    styWrap: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width,

    }
});