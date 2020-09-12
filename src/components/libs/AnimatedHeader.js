import React from 'react';
import { StyleSheet, Text, View, Animated, ImageBackground } from 'react-native';
import AnimatedText from './AnimatedText';
import AnimatedImage from './AnimatedImage';
import AppIcon from '../../utils/AppIcon';

const HeaderBackground = ({ animationRange }) => {
    const animateHeader = {
        transform: [
            {
                translateY: animationRange.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                }),
            },
        ],
    };

    return (
        <Animated.View style={[styles.headerBackground, animateHeader]}>
            {/* <ImageBackground source={AppIcon.bg_wrap_account} style={{ width: '100%', height: 200 }}>
            </ImageBackground> */}
        </Animated.View>
    );
};


const AnimatedHeader = ({ animationRange, avatarIcon, displayName }) =>
    <View style={styles.container} pointerEvents="none">
        <HeaderBackground animationRange={animationRange} />
        <Animated.View style={styles.container} pointerEvents="none">
            <AnimatedImage animationRange={animationRange} avatarIcon={avatarIcon} />
            <AnimatedText animationRange={animationRange} title={displayName} />
        </Animated.View>
    </View>

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 0,
        zIndex: 2,
        height: 200,
        width: '100%',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerBackground: {
        position: 'absolute',
        flex: 0,
        height: 200,
        width: '100%',
        zIndex: 2,
    }
});

export default AnimatedHeader;