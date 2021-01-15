import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import {withSelfMeasure} from './SelfMeasureBehavior';
import {compose} from 'recompose';
import buildTransform from './BuildTransform';
import { RFFonsize } from '../../utils/Fonts';

const AnimatedText2 = ({
    animationRange,
    onLayoutSetMeasurements,
    elementX,
    elementY,
    elementHeight,
    title,
    elementWidth,}) => {

        const animateText = buildTransform(animationRange, elementX, elementY, elementHeight, elementWidth, 20, 70, 0.7);
        const animateOpacity = {
            opacity: animationRange.interpolate({
                inputRange: [0, 0.9, 1],
                outputRange: [1, 0, 0],
            }),
        };
        return (
            <Animated.Text 
                style={[styles.text, animateText, animateOpacity]}
                onLayout={event => onLayoutSetMeasurements(event)} >
                {title}
            </Animated.Text>
        )        
}

const styles = StyleSheet.create({
    text: {        
        fontSize: 16,
        color: '#fff'
    }
});

const enhance = compose(withSelfMeasure);

export default enhance(AnimatedText2);