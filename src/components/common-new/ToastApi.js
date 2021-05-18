import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import { RFFonsize } from '../../utils/Fonts';
import SuccessAnim from '../anim/SuccessAnim';
import * as Progress from 'react-native-progress';
const { width } = Dimensions.get('window');

const ToastApi = (props) => {
    const { title } = props;
    const [progress, setProgress] = React.useState(1);

    React.useEffect(() => {
        const timeProgress = setInterval(() => {
            setProgress(progress + 1);
        }, 20);
        return () => {
            clearInterval(timeProgress);
        }
    })

    return (
        <View style={styles.styleTostSuccess}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1, alignItems: 'center'
            }}>
                <View style={{ marginLeft: 20 }}>
                    <SuccessAnim />
                </View>
                <View>
                    <Text style={[styles.txtSuccess, {
                        fontSize: RFFonsize(16),
                        lineHeight: RFFonsize(24)
                    }]}>Thành công!</Text>
                    <Text style={styles.txtSuccess}>{title}</Text>
                </View>
                <Text style={styles.xstoast}></Text>
            </View>

            <Progress.Bar
                unfilledColor={'#16BDA9'}
                color={'#fff'}
                borderWidth={0}
                progress={progress / 100}
                width={260}
                style={{ alignSelf: 'center' }} />
        </View>
    );
}

export default ToastApi;

const styles = StyleSheet.create({
    styleTostSuccess: {
        flex: 1,
        height: 70,
        width: 199,
        backgroundColor: '#16BDA9',
        borderRadius: 10,
        paddingBottom: 5
    },
    txtSuccess: {
        color: '#fff',
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(13),
        lineHeight: RFFonsize(17)
    },
    xstoast: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        color: "#fff",
        top: -15,
        right: 10
    }
})