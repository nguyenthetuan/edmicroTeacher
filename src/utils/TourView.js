import React, { useEffect, useImperativeHandle, useState, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, Modal, TouchableWithoutFeedback, Animated } from 'react-native'
import { StepView } from './StepView';

const tour_size = 300;
const button_size = 40;
const center_size = button_size / 2;

function TourView(props, ref) {
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

    const setMesure = async (index) => {
        hintText.current = dataRef.current[indexRef.current].hint;
        dataRef.current[indexRef.current].reff.measure(async (fx, fy, w, h, px, py) => {
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
        try {
            const anim = Animated.timing(scaleLoop, {
                toValue: 1,
                duration: 640,
                useNativeDriver: false
            });
            scaleLoop.setValue(0.9);
            Animated.loop(anim).start();
        } catch (error) {

        }

    }, [show])

    const onNext = async () => {
        setShow(false);
        indexRef.current++;
        if (indexRef.current < dataRef.current.length) {
            setMesure(indexRef.current);
        }
    }

    const onPreview = async () => {
        setShow(false);
        indexRef.current--;
        if (indexRef.current < dataRef.current.length) {
            setMesure(indexRef.current);
        }
    }

    return (
        show ?
            <View style={styles.container}>
                <View style={[styles.circleContainer, {
                    top: position.top - tour_size / 2 + center_size,
                    left: position.left - tour_size / 2 + center_size,
                }]}>
                    <Animated.View style={[styles.circle, {
                        width: tour_size,
                        height: tour_size,
                        borderRadius: tour_size / 2,
                        borderWidth: tour_size / 2 - 30,
                        borderColor: 'rgba(76, 147, 228, 0.75))',
                        transform: [{
                            scale: scale
                        }]
                    }]}
                    >
                        <TouchableWithoutFeedback>
                            <Animated.View style={[styles.dotCircle, {
                                width: button_size * 2,
                                height: button_size * 2,
                                transform: [{
                                    scale: scaleLoop
                                }],
                            }]} />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </View>
                <StepView
                    {...props}
                    onNext={onNext}
                    onPreview={onPreview}
                    length={dataRef.current.length}
                    index={indexRef.current}
                    hintText={hintText.current} />
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 100
    },
    circleContainer: {
        position: 'absolute',
    },
    circle: {
        borderColor: 'rgba(76, 147, 228, 0.18)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    dotCircle: {
        borderWidth: 10,
        borderRadius: 100,
        borderColor: '#f8f8f8',
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