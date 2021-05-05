import React, { useEffect, useImperativeHandle, useState, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native'
const { width, height } = Dimensions.get('window');
const step_view_width = 200;
const step_view_height = 80;
const r_button = 20;

function StepView({
    tour_size,
    onPress,
    hintText,
    position,
    scale
}) {
    const getLeftPosition = () => {
        const minX = position.left - (tour_size / 2 - r_button);
        const maxX = position.left + (tour_size / 2 + r_button);
        if (position.left + r_button <= width / 2) {
            return (0 + Math.abs(minX)) + (maxX - step_view_width) / 2;
        } else {
            return 0 + (width - Math.abs(minX) - step_view_width) / 2;
        }
    }

    const getTopPosition = () => {
        const minY = position.top - (tour_size / 2 - r_button);
        const maxY = position.top + (tour_size / 2 + r_button);
        const centerY = position.top + r_button;
        if (centerY >= height / 2) {
            return centerY - step_view_height / 2 - minY - (centerY - minY) / 2;
        } else {
            return (0 + Math.abs(minY)) + (maxY - step_view_height) / 2;
        }
    }

    return (
        <Animated.View style={{
            width: step_view_width,
            height: step_view_height,
            position: 'absolute',
            alignSelf: 'center',
            left: getLeftPosition(),
            top: getTopPosition(),
            transform: [{ scale: scale }],
            zIndex: 2,
        }}>
            <Text style={{
                alignSelf: 'center',
                color: '#fff',
                fontFamily: 'Nunito-Regular'
            }}>{hintText}</Text>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.buttonNextStep}>
                    <Text style={{ color: '#383838', fontFamily: 'Nunito-Regular' }}>Tiếp theo</Text>
                </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
}

function TourView(props, ref) {
    const { tour_size, button_size } = props;
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const dataRef = useRef(null);
    const indexRef = useRef(0);
    let hintText = useRef(null);
    const [show, setShow] = useState(false);

    const scale = useRef(new Animated.Value(0)).current;
    const scaleLoop = useRef(new Animated.Value(0.9)).current;

    useImperativeHandle(ref, () => ({
        onMeasure: (dataRefs) => {
            dataRef.current = dataRefs;
            indexRef.current = 0;
            setMesure(indexRef.current);
        },
    }));

    const setMesure = (index) => {
        hintText.current = dataRef.current[index].hint;
        console.log(hintText.current);
        console.log(dataRef.current[index].reff);
        alert(dataRef.current[index].reff);
        dataRef.current[index].reff.measure(async (fx, fy, w, h, px, py) => {
            alert(px);
            await setShow(true);
            await setPosition({ ...position, top: py, left: px });
        }, err => {
            console.log(err);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        if (show) {
            Animated.timing(scale, {
                toValue: 0,
                duration: 1,
                useNativeDriver: true
            }).start(() => {
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 640,
                    useNativeDriver: true
                }).start();
            });
        }
    }, [show])

    useEffect(() => {
        const anim = Animated.timing(scaleLoop, {
            toValue: 1,
            duration: 640,
            useNativeDriver: false
        });
        scaleLoop.setValue(new Animated.Value(0.9));
        Animated.loop(anim).start();
    }, [show])

    const onPress = async () => {
        setShow(false);
        indexRef.current++;
        if (indexRef.current < dataRef.current.length) {
            setMesure(indexRef.current);
        } else {
            indexRef.current = 0;
            setMesure(indexRef.current);
        }
    }

    return (
        show ?
            <View style={styles.container}>
                <View style={[styles.circleContainer, {
                    top: position.top - tour_size / 2 + 20,
                    left: position.left - tour_size / 2 + 20,
                }]}>
                    <Animated.View style={[styles.circle, {
                        width: tour_size,
                        height: tour_size,
                        borderRadius: tour_size / 2,
                        borderWidth: tour_size / 2 - 30,
                        borderColor: indexRef.current % 2 == 0 ? '#EA2C46' : 'rgba(3,102, 214, 1)',
                        transform: [{
                            scale: scale
                        }]
                    }]}
                    >
                        <TouchableWithoutFeedback onPress={onPress}>
                            <Animated.View style={[styles.dotCircle, {
                                width: button_size * 2,
                                height: button_size * 2,
                                transform: [{
                                    scale: scaleLoop
                                }],
                            }]} />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                    {/* <StepView {...props}
                        onPress={onPress}
                        position={position}
                        scale={scale}
                        hintText={hintText.current} /> */}
                </View>
            </View>
            :
            null
    );
}

export default React.forwardRef(TourView);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    circleContainer: {
        position: 'absolute',
    },
    circle: {
        borderColor: 'rgba(3,102, 214, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    dotCircle: {
        borderWidth: 10,
        borderRadius: 100,
        borderColor: 'orange',
        alignSelf: 'center',
        backgroundColor: 'transparent'
    },
    buttonNextStep: {
        width: 90,
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});