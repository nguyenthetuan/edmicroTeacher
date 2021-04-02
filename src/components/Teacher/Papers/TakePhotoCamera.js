import React, { PureComponent } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions } from 'react-native';
import { RNCamera, } from 'react-native-camera';

const { width, height } = Dimensions.get('window');

class TakePhotoCamera extends PureComponent {

    state = {
        uri: null,
    }

    render() {
        const { uri } = this.state;
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        console.log(barcodes);
                    }}
                />
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> Back </Text>
                    </TouchableOpacity>
                </View>
                <Modal visible={uri != null} style={{ flex: 1, width, height }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ uri: null })}
                    >
                        <Text>close</Text>
                    </TouchableOpacity>
                    <Image source={{ uri }} resizeMode={'contain'} style={{ width: width, height: height }} />
                </Modal>
            </View>
        );
    }

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            console.log(data.uri);
            this.setState({ uri: data.uri });
        }
    };
}

export default TakePhotoCamera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
