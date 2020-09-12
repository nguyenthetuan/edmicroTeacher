import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { withSelfMeasure } from './SelfMeasureBehavior';
import { compose } from 'recompose';
import buildTransform from './BuildTransform';
import AppIcon from '../../utils/AppIcon';


const AnimatedImage = ({
    animationRange,
    onLayoutSetMeasurements,
    elementX,
    elementY,
    elementHeight,
    avatarIcon,
    elementWidth, }) => {

    const animateImage = buildTransform(animationRange, elementX, elementY, elementHeight, elementWidth, 20, 20, 0.5);
    return (

        (avatarIcon != '' && avatarIcon != 'http:' && avatarIcon != null) ?

            <Animated.Image
                source={{ uri: (avatarIcon !== '' && avatarIcon !== 'http:') ? avatarIcon : '' }}
                style={[styles.image, animateImage]}
                onLayout={event => onLayoutSetMeasurements(event)} 
                />
            :
            <Animated.Image
                source={AppIcon.ic_account}
                style={[styles.image, animateImage]}
                onLayout={event => onLayoutSetMeasurements(event)} />
    )
}

const styles = StyleSheet.create({
    image: {
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 40,
        width: 80,
        height: 80,
    }
});

const enhance = compose(withSelfMeasure);

export default enhance(AnimatedImage);