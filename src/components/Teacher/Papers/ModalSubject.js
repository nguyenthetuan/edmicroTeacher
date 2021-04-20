import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';
import Modal from '../../../utils/Modal';
import RippleButton from '../../common-new/RippleButton';
import Icon from 'react-native-vector-icons/Entypo';
import CommonBeta from '../../../utils/CommonBeta';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';
const { width, height } = Dimensions.get('window');

export default class ModalSubject extends Component {

    state = {
        visible: false
    }

    onOpen = () => {
        this.setState({ visible: true });
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
        const { listSubjects } = this.props;
        return (
            <Modal
                ref={ref => this.modalizeRef = ref}
                visible={visible}
                closeModal={this.onClose}
                contentContainerStyle={{ height: height - height / 4 }}
                transparent={true}>
                <View style={{ width: width, flex: 1, backgroundColor: '#fff' }}>
                    <View
                        style={styles.styWrapTitle}
                    >
                        <Text style={styles.styTitle}>Chọn môn</Text>
                        {Platform.OS == 'android' &&
                            < TouchableOpacity
                                onPress={this.onClose}
                            >
                                <Image
                                    source={AppIcon.close_img}
                                    resizeMode={'stretch'}
                                    style={styles.styClose}
                                />
                            </TouchableOpacity>}
                    </View>
                    <FlatList
                        data={listSubjects}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={this.renderHeader}
                        style={styles.contain}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>
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
        flex: 1,
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
        borderColor: '#ECECEC',
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
        const { subjectActive, item } = this.props;
        if (subjectActive.indexOf(item.code) != -1) {
            this.setState({ isCheck: true });
        }
    }

    onCheck = () => {
        const { isCheck } = this.state;
        const { item } = this.props;
        this.props.activeSubject(item);
        this.setState({ isCheck: !isCheck });
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const { item } = this.props;
        const { isCheck } = this.state;
        const icon = CommonBeta.getIconSubject(item.code);
        return (
            <View style={[styles.styWrapElement, { margin: 5, }]}>
                <TouchableWithoutFeedback onPress={this.onCheck} >
                    <View style={styles.styWrapElement}>
                        <Image source={icon} resizeMode={'contain'} style={{ width: 30, height: 30 }} />
                        <Text style={styles.styTxtClass}>{item.name}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <RippleButton onPress={this.onCheck}>
                    <View style={styles.styCheck} >
                        {isCheck ? <Icon name={'check'} size={20} color={'#56BB73'} /> : null}
                    </View>
                </RippleButton>
            </View>
        )
    }
}