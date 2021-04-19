import { View } from 'native-base';
import React from 'react'
import { StyleSheet, Platform, Dimensions, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
const { height, width } = Dimensions.get('window');
interface Props {
    children: Node;
    visible: boolean;
    contentContainerStyle: ViewStyle,
    closeModal: () => void;
}

const ModalFillter = (props: Props) => {
    const { visible, closeModal, children, contentContainerStyle } = props;
    return (
        <Modal
            isVisible={visible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            swipeDirection={'down'}
            swipeThreshold={300}
            onSwipeComplete={closeModal}
            useNativeDriver={Platform.OS == 'android'}
            propagateSwipe={true}
            style={styles.styModal}
        >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={styles.indicator}></View>
                <View style={[styles.contain, contentContainerStyle]}>
                    {children}
                </View>
            </View>
        </Modal>
    );
}
export default ModalFillter;
const styles = StyleSheet.create({
    styModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    contain: {
        backgroundColor: '#E8F6FF',
        alignItems: 'flex-end',
        height: height - height / 8,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    indicator: {
        backgroundColor: '#E8F6FF',
        height: 6,
        width: width / 6,
        alignSelf: 'center',
        borderRadius: 5,
        marginBottom: 1
    }
});
