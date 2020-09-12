import React, { Component } from 'react'
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

import ShimePlaceholder from '../anim/ShimePlaceholder';
const { width, height } = Dimensions.get('window');

export default class LearnPlaceholder extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.runPlaceHolder();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.currentStepIndex != nextProps.currentStepIndex) {
            return true;
        }
        if (this.props.visible != nextProps.visible) {
            return true
        }
        return false;
    }

    runPlaceHolder() {
        if (Array.isArray(this.loadingAnimated) && this.loadingAnimated.length > 0) {
            Animated.parallel(
                this.loadingAnimated.map(animate => {
                    if (animate && animate.getAnimated) {
                        return animate.getAnimated();
                    }
                    return null;
                }),
                {
                    stopTogether: false,
                }
            ).start(() => {
                this.runPlaceHolder();
            })
        }
    }

    _renderList(loadingAnimated, numberRow, uniqueKey) {
        let visible = !!this.props.visible ? this.props.visible : false;
        let shimmerRows = [];

        shimmerRows.push(
            <View key={'question'} style={[styles.rowItem, { marginTop: 20, marginBottom: 20 }]}>
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textID}
                />
                <View style={{ flex: 1 }} />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textID}
                />
            </View>
        )
        // question
        shimmerRows.push(
            <View key={'question2'} style={{ marginHorizontal: 10, marginVertical: 20 }}>
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
            </View>
        )

        for (let index = 0; index < numberRow; index++) {
            shimmerRows.push(
                <View key={`options${index}`} style={styles.rowItem}>
                    <View style={styles.rowAnswer}>
                        <ShimePlaceholder
                            autoRun={true}
                            visible={visible}
                            ref={(ref) => loadingAnimated.push(ref)}
                            style={styles.textAlpha}
                        />
                        <View>
                            <ShimePlaceholder
                                autoRun={true}
                                visible={visible}
                                ref={(ref) => loadingAnimated.push(ref)}
                                style={styles.textShimmer}
                            />
                            <ShimePlaceholder
                                autoRun={true}
                                visible={visible}
                                ref={(ref) => loadingAnimated.push(ref)}
                                style={styles.textShimmer}
                            />
                            <ShimePlaceholder
                                autoRun={true}
                                visible={visible}
                                ref={(ref) => loadingAnimated.push(ref)}
                                style={styles.textShimmer}
                            />
                        </View>
                    </View>
                </View>
            )
        }
        // explain
        shimmerRows.push(
            <View key={'explain'} style={{ marginHorizontal: 10, marginVertical: 20 }}>
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
            </View>
        )
        shimmerRows.push(
            <View key={'explain2'} style={{ marginHorizontal: 10, marginVertical: 20 }}>
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
                <ShimePlaceholder
                    autoRun={true}
                    visible={visible}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={styles.textShimmerQuestion}
                />
            </View>
        )
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: this.props.visible ? -1 : 1, backgroundColor: '#FFF' }}>
                {!this.props.visible &&
                    shimmerRows
                }
            </View>
        )
    }

    render() {
        this.loadingAnimated = [];
        return (
            this._renderList(this.loadingAnimated, 4, '3rows')
        )
    }
}

const styles = StyleSheet.create({
    rowItem: {
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: 10,
        marginVertical: 10
    },
    colLeft: {
        flex: 1, marginRight: 5
    },
    colRight: {
        flex: 1, marginLeft: 5
    },
    rowAnswer: {
        flexDirection: 'row',
        marginVertical: 10
    },
    textAlpha: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 10
    },
    textShimmerQuestion: {
        marginBottom: 7,
        width: width - 20,
        height: 6
    },
    textShimmer: {
        marginBottom: 7,
        width: width - 60,
        height: 6
    },
    textQuestion: {
        width: 40,
        height: 6
    },
    textID: {
        marginHorizontal: 10,
        width: 40,
        height: 6
    },
    expandShimmer: {
        marginVertical: 10,
        alignSelf: 'center',
        width: width - 20,
        height: 6,
    }
});