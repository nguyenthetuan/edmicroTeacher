import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import RippleButton from '../../common-new/RippleButton';
import Icon from 'react-native-vector-icons/Entypo';
const { width, height } = Dimensions.get('window');

export default class ModalClass extends Component {

    state = {
        visible: false
    }

    onOpen = () => {
        this.setState({ visible: true }, () => {
            this.modalizeRef.open();
        });
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
        const {
            gradeActive,
            listGrades
        } = this.props;
        return (
            <Modal visible={visible} transparent={true}>
                <Modalize
                    ref={ref => this.modalizeRef = ref}
                    onClose={this.onClose}
                    modalStyle={{ marginTop: height / 3 }}
                    scrollViewProps={
                        {
                            scrollEnabled: false
                        }
                    }
                >
                    <View style={styles.styWrapTitle}>
                        <Text style={styles.styTitle}>Chọn lớp</Text>
                    </View>
                    <FlatList
                        data={listGrades}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={this.renderHeader}
                        style={styles.contain}
                        showsVerticalScrollIndicator={false}
                    />
                </Modalize>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        marginHorizontal: 10,
        height: height - height / 3 - 40
    },
    styTitle: {
        fontFamily: 'Nunito-Regular',
        fontSize: 16
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
        borderColor: '#E0E0E0'
    }
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
            <View style={[styles.styWrapElement, { margin: 5, }]}>
                <TouchableOpacity onPress={this.onCheck} style={styles.styWrapElement}>
                    <Image source={require('../../../asserts/appIcon/icon_class.png')} resizeMode={'contain'} style={{ width: 30, height: 30 }} />
                    <Text style={styles.styTxtClass}>{item.name}</Text>
                </TouchableOpacity>
                <RippleButton onPress={this.onCheck}>
                    <View style={styles.styCheck} >
                        {isCheck ? <Icon name={'check'} size={20} color={'#56BB73'} /> : null}
                    </View>
                </RippleButton>
            </View>
        )
    }
}