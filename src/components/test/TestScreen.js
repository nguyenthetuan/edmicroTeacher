import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
const { event, ValueXY } = Animated;

class TestScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerLayout: {
                height: 0,
            },
            topReached: true,
            endReached: false,
            stickyHeaderEndReached: false,
            stickyHeaderTopReached: true,
        };

        this.scrollY = new ValueXY();
    }

    setHeaderSize = (headerLayout) => this.setState({ headerLayout });

    renderHeader = (props) => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#999' }}>
                <Text>renderHeader</Text>
            </View>
        );
    }

    renderForeground = () => {
        return (
            <View style={{
                height: 200,
                backgroundColor: '#ddd'
            }}>
                <Text>renderForeground</Text>
            </View>
        );
    }

    renderBody = (props) => {
        return (
            <View style={{ paddingTop: 200 }}>
                <Text>renderBody</Text>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }} >
                <StickyParallaxHeader
                    foreground={this.renderForeground()}
                    headerSize={this.setHeaderSize}
                    scrollEvent={event([{ nativeEvent: { contentOffset: { y: this.scrollY.y } } }], {
                        useNativeDriver: false,
                    })}
                    header={this.renderHeader()}
                >
                    {this.renderBody()}
                </StickyParallaxHeader>
            </SafeAreaView >
        );
    }
}

export default TestScreen;