import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const { width, height } = Dimensions.get('window');
const row_width = width - 150;

export default class ShimerMockExam extends Component {
    renderItem() {
        return (
            <View style={[styles.container]}>
                <View>
                    <ShimmerPlaceHolder visible={false}
                        style={[{
                            width: width,
                            height: 20,
                        }]}
                    />
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
                    <ShimmerPlaceHolder
                        visible={false}
                        style={[{
                            marginVertical: 10,
                            width: 50,
                            height: 15,
                            borderRadius: 3
                        }]} />
                </View>
                {/* <View style={styles.styWrap}>
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
                    <ShimmerPlaceHolder
                        visible={false}
                        style={[{
                            marginVertical: 10,
                            width: 50,
                            height: 15,
                            borderRadius: 3
                        }]} />
                </View> */}
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
        overflow: 'hidden'
    },
    styWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width
    }
});