import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const { width, height } = Dimensions.get('window');
const row_width = width - 150;

export default class ShimerLabora extends Component {
    render() {
        return (
            <View>
                <View style={[styles.bgheader]}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            marginBottom: 10,
                            marginHorizontal: 10,
                            alignItems: 'center',
                        }}>
                            <ShimmerPlaceHolder visible={false}
                                style={[{
                                    width: width * 0.9,
                                    height: height * 0.15,
                                    borderRadius: 5
                                }]}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.container]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                            }}>
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: width * 0.35,
                                        height: height * 0.12,
                                        borderRadius: 5
                                    }]}
                                />
                                <ShimmerPlaceHolder visible={false}
                                    style={[{
                                        width: 90,
                                        height: 10,
                                        marginTop: 10
                                    }]}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
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
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#FFF',
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    styWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width
    },
    bgheader: {
        flex: 1,
        borderWidth: 2,
        marginVertical: 8,
        borderColor: '#eee',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#FFF',
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    }
});