import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const { width } = Dimensions.get('window');

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default class ShimmerAssigment extends React.Component {

    render() {
        return (
            <View style={{
                alignSelf: 'center', marginTop: 50, shadowColor: "#000",
            }}>
                <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 120,
                        height: 38,
                        marginBottom: 10,
                        alignSelf: 'center'
                    }}
                />
                <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 120,
                        height: 20,
                        marginBottom: 10
                    }}
                />
                <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 320,
                        height: 40,
                        marginBottom: 10
                    }}
                />
                 <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 120,
                        height: 20,
                        marginBottom: 10
                    }}
                />
                <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 320,
                        height: 40,
                        marginBottom: 10
                    }}
                />
                 <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 120,
                        height: 20,
                        marginBottom: 10
                    }}
                />
                <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 320,
                        height: 40,
                        marginBottom: 10
                    }}
                />
                <ShimmerPlaceHolder visible={false}
                    style={{
                        width: 120,
                        height: 38,
                        marginBottom: 10,
                        alignSelf: 'center'
                    }}
                />
            </View>
        );
    }
}