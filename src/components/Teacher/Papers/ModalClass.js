import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import Modal from '../../../utils/Modal';
import RippleButton from '../../common-new/RippleButton';
import Icon from 'react-native-vector-icons/Entypo';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';

const { width, height } = Dimensions.get('window');

const outSideHeight = height / 4;
const modalHeight = height - outSideHeight;

export default class ModalClass extends Component {

    state = {
        visible: false
    }

    onOpen = () => {
        // this.setState({ visible: true });
        this.modalizeRef.onOpen();
    };

    onClose = () => {
        this.setState({ visible: false });
    }

    renderItem = ({ item }) => <Item item={item} {...this.props} />

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const { visible } = this.state;
        const { listGrades } = this.props;
        return (
            <Modal
                ref={ref => this.modalizeRef = ref}
                visible={visible}
                closeModal={this.onClose}
                modalHeight={modalHeight}
                title={'Chọn lớp'}
                transparent={false}
            >
                <View style={{ width: width, flex: 1, backgroundColor: '#fff' }}>
                    <FlatList
                        data={listGrades}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.contain}
                        ListFooterComponent={() => <View style={{ height: outSideHeight }} />}
                        showsVerticalScrollIndicator={false}
                        style={{ marginBottom: 20 }}
                    />
                </View>
            </Modal >
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        marginHorizontal: 10,
        height: height / 1.5 - 43
    },
    styTitle: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(16),
        flex: 1
    },
    styCheck: {
        width: 20,
        height: 20,
        borderWidth: 0.5,
        borderColor: '#2D9CDB',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styWrapElement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        flex: 1,
    },
    styTxtClass: {
        flex: 1,
        fontFamily: 'Nunito-Regular',
        marginHorizontal: 10
    },
    styWrapTitle: {
        paddingVertical: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
    },
    styClose: {
        width: 25,
        height: 25,
    },
});

class Item extends Component {

    state = {
        isCheck: false
    }

    componentDidMount() {
        const { gradeActive, item } = this.props;
        if (gradeActive.indexOf(item.gradeId) != -1) {
            this.setState({ isCheck: true });
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    onCheck = () => {
        const { isCheck } = this.state;
        const { item } = this.props;
        this.props.activeClass(item);
        this.setState({ isCheck: !isCheck });
    }

    render() {
        const { item } = this.props;
        const { isCheck } = this.state;
        return (
            <View style={[styles.styWrapElement, { margin: 5, marginHorizontal: 16 }]}>
                <TouchableWithoutFeedback onPress={this.onCheck}>
                    <View style={styles.styWrapElement}>
                        <Image source={require('../../../asserts/icon/icon_remakeClassV3.png')} resizeMode={'contain'} style={{ width: 30, height: 30 }} />
                        <Text style={styles.styTxtClass}>{item.name}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <RippleButton onPress={this.onCheck} hitSlop={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <View style={styles.styCheck}>
                        {isCheck ? <Icon name={'check'} size={20} color={'#56BB73'} /> : null}
                    </View>
                </RippleButton>
            </View>
        )
    }
}