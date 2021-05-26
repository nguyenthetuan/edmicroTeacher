import React from 'react'
import { View, Text, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { RFFonsize } from './Fonts';

const getActionLeft = (index) => {
    return index == 0 ? 'Bỏ qua' : 'Trở lại';
}

const getActionRight = (index, length) => {
    return index == length - 1 ? 'Kết thúc' : 'Tiếp theo';
}

function StepView({
    onPreview,
    onNext,
    hintText,
    length,
    index
}) {
    return (
        // <Modal
        //     visible={true}
        //     transparent={true}
        //     style={{
        //         backgroundColor: 'transparent'
        //     }}
        // >
        <View style={styles.container} >
            <Text style={styles.textTitle}>{hintText}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <TouchableWithoutFeedback
                    onPress={onPreview}
                >
                    <View style={styles.viewAction}>
                        <Text style={styles.textButton}>{getActionLeft(index)}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ width: 20 }} />
                <TouchableWithoutFeedback
                    onPress={onNext}
                >
                    <View style={styles.viewAction}>
                        <Text style={styles.textButton}>{getActionRight(index, length)}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
        // </Modal>
    );
}

export { StepView };

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        paddingVertical: 30,
        paddingHorizontal: 20,
        left: 0,
        right: 0,
        zIndex: 1
    },
    textTitle: {
        color: '#383838',
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(18),
        alignSelf: 'center',
        marginBottom: 20,
        marginHorizontal: 20
    },
    viewAction: {
        alignSelf: 'center',
        width: 100,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(3,102, 214, 1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton: {
        color: '#fff',
        fontFamily: 'Nunito'
    }
});