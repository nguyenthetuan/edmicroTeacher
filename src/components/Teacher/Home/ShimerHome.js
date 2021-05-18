import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const { width, height } = Dimensions.get('window');
const row_width = width - 150;

export default class ShimerMockExam extends Component {
    render() {
        return (
            <View style={[styles.container]}>
                <View style={{ alignItems: 'center', marginBottom: 10, }}>
                    <ShimmerPlaceHolder visible={false}
                        style={[{
                            width: width / 2,
                            height: 10,
                            marginBottom: 10,
                            borderRadius: 3,
                        }]}
                    />
                    <ShimmerPlaceHolder visible={false}
                        style={[{
                            width: width / 2 + 10,
                            height: 10,
                            borderRadius: 3,
                        }]}
                    />
                </View>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            marginBottom: 10,
                            marginHorizontal: 10,
                            alignItems: 'center',
                        }}>
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                }]}
                            />
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 20,
                                    height: 8,
                                    marginTop: 5
                                }]}
                            />
                        </View>
                        <View style={{
                            marginBottom: 10,
                            marginHorizontal: 10,
                            alignItems: 'center',
                        }}>
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                }]}
                            />
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 20,
                                    height: 8,
                                    marginTop: 5
                                }]}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            marginBottom: 10,
                            marginHorizontal: 10,
                            alignItems: 'center',
                        }}>
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                }]}
                            />
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 20,
                                    height: 8,
                                    marginTop: 5
                                }]}
                            />
                        </View>
                        <View style={{
                            marginBottom: 10,
                            marginHorizontal: 10,
                            alignItems: 'center',
                        }}>
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                }]}
                            />
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: 20,
                                    height: 8,
                                    marginTop: 5
                                }]}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-start', marginBottom: 10, }}>
                    <ShimmerPlaceHolder visible={false}
                        style={[{
                            width: width / 3,
                            height: 10,
                            marginBottom: 10,
                            borderRadius: 3,
                        }]}
                    />
                    <ShimmerPlaceHolder visible={false}
                        style={[{
                            width: width / 2 + 10,
                            height: 10,
                            borderRadius: 3,
                        }]}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 60,
        marginVertical: 15,
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 5,
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#FFF',
        paddingVertical: 30,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    styWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width
    }
});