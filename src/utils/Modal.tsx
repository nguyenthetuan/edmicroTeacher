import React, { forwardRef, useImperativeHandle } from 'react'
import { View, Text, Button, Animated } from 'react-native';
import { StyleSheet, Platform, Dimensions, ViewStyle } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { RFFonsize } from './Fonts';

const { height, width } = Dimensions.get('window');

const renderHeader = (title) => {
    return title ? <View style={{
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
        marginHorizontal: 10
    }}>
        <Text style={{
            fontFamily: 'Nunito-Regular',
            fontSize: RFFonsize(16)
        }}>{title}</Text>
    </View>
        : null
}


interface Props {
    children: Node;
    visible: boolean;
    contentContainerStyle: ViewStyle,
    modalHeight: Number,
    title: String
}

const ModalLize = (props: Props, ref) => {
    const { title, children, contentContainerStyle, modalHeight } = props;
    const modalizeRef = React.useRef(null);

    useImperativeHandle(ref, () => ({
        onOpen: onOpened,
        onClose: onClosed
    }));

    const onOpened = () => {
        modalizeRef.current?.open();
    }

    const onClosed = () => {
        modalizeRef.current?.close();
    }

    return (
        <Modalize
            ref={modalizeRef}
            handlePosition={'outside'}
            modalHeight={modalHeight || height - height / 4}
            snapPoint={modalHeight}
            disableScrollIfPossible={false}
            HeaderComponent={renderHeader(title)}
            closeSnapPointStraightEnabled={true}
            tapGestureEnabled={true}
            style={styles.styModal}
        >
            <View style={{
                flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent',
            }}>
                <View style={[styles.contain, contentContainerStyle]}>
                    {children}
                </View>
            </View>
        </Modalize>
    );
}

export default forwardRef(ModalLize);
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
        width: 56,
        alignSelf: 'center',
        borderRadius: 5,
        marginBottom: 8
    }
});
