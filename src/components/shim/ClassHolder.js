import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const { width } = Dimensions.get('window');

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const row_width = width - 40;
const row_height = row_width / 2;

export default class ClassHolder extends React.Component {

    renderItem = () => {
        return (
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                <ShimmerPlaceHolder visible={false} style={{ width: row_width, marginBottom: 10 }} />
                <ShimmerPlaceHolder visible={false} style={{ width: row_width, height: row_height }} />
            </View>
        );
    }

    render() {
        return (
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={Array.from({ length: 5 }, (v, i) => i)}
                renderItem={this.renderItem}
                scrollEnabled={false}
            />
        );
    }
}