import React, { Component } from 'react';
import {
    View, Image, StyleSheet, FlatList, TextInput, Animated, Keyboard,
    Modal, Text, TouchableWithoutFeedback, Dimensions, ScrollView, ActivityIndicator
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import apiPapers from '../../../services/apiPapersTeacher';
import _ from 'lodash';
import Toast, { DURATION } from 'react-native-easy-toast';
import dataHelper from '../../../utils/dataHelper';

const { width, height } = Dimensions.get('window');

export default class ModalEditName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            updating: false,
            loading: false,
            message: ''
        }
        this.paddingInput = new Animated.Value(4);
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }


    keyboardWillShow = (event) => {
        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: event.endCoordinates.height + 4,
        }).start();
    };

    keyboardWillHide = (event) => {
        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: 4,
        }).start();
    };

    componentDidMount() {
        const { data } = this.props;
        if (data) {
            this.setState({
                name: data.name
            });
        }
    }

    setText = ({ key, text }) => {
        var stateCopy = Object.assign({}, this.state);
        stateCopy[key] = text;
        this.setState(stateCopy);
    }

    _validate = () => {
        const { name, time, gradeCode, subjectCode } = this.state;
        const { data } = this.props;

        if (name.trim() === '') {
            this.refs.toast.show('Tên bài tập không được để trống!', DURATION.LENGTH_LONG);
            return;
        }

        return true;
    }

    onUpdate = async () => {
        if (this._validate()) {
            const { data } = this.props;
            const { name } = this.state;
            const body = {
                ...data,
                name
            }

            this.setState({
                updating: true,
                loading: true,
                message: 'Đang đổi tên...'
            })

            const { token } = await dataHelper.getToken();
            if (token) {
                const response = await apiPapers.updateInfo({ token, body });
                if (response && response.status === 1) {
                    this.setState({
                        loading: false,
                        message: 'Thành công!'
                    })
                    this.props.onUpdateItem(body);
                } else {
                    this.setState({
                        loading: false,
                        message: 'Có lỗi xảy ra vui lòng thử lại!'
                    })
                }
            }
        }
    }

    render() {
        const { name, loading, message, updating } = this.state;

        return (
            <Modal
                visible={true}
                transparent={true}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.props.onVisible(false)}
                >
                    <View style={styles.container}>
                        <Animated.View style={{
                            marginBottom: this.paddingInput,
                            borderRadius: 4
                        }}>
                            <View>
                                {
                                    updating
                                        ?
                                        <View style={{
                                            height: 100,
                                            backgroundColor: '#fff',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {loading && <ActivityIndicator size='small' color='#56CCF2' />}
                                            <Text style={{
                                                color: '#000',
                                                fontSize: 12,
                                                fontFamily: 'Nunito-Bold',
                                                marginTop: 4
                                            }}>{message}</Text>
                                            {
                                                !loading &&
                                                <RippleButton
                                                    style={{ marginTop: 10 }}
                                                    onPress={() => {
                                                        this.props.onVisible(false);
                                                    }}>
                                                    <View style={styles.buttomSave}>
                                                        <Text style={styles.txtButtom}>Đóng</Text>
                                                    </View>
                                                </RippleButton>
                                            }
                                        </View>
                                        :
                                        <View style={{
                                            backgroundColor: '#D1D5DB',
                                            borderRadius: 5,
                                            paddingVertical: 6,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 16
                                        }}>
                                            <View style={{
                                                height: 40,
                                                backgroundColor: '#fff',
                                                borderRadius: 4,
                                                justifyContent: 'center',
                                                flex: 1
                                            }}>
                                                <TextInput
                                                    autoFocus
                                                    value={name}
                                                    style={styles.txtTexinput}
                                                    onChangeText={text => this.setText({ key: 'name', text })}
                                                />
                                            </View>
                                            <RippleButton
                                                onPress={this.onUpdate}>
                                                <View style={styles.buttomSave}>
                                                    <Text style={styles.txtButtom}>LƯU</Text>
                                                </View>
                                            </RippleButton>
                                        </View>
                                }
                            </View>
                        </Animated.View>
                        <Toast ref="toast" position={'center'} />
                    </View>
                </TouchableWithoutFeedback>
            </Modal >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: 200,
        flex: 1,
        justifyContent: 'flex-end'
    },
    txtTexinput: {
        paddingLeft: 10,
        fontSize: 14,
        color: '#000',
        fontFamily: 'Nunito-Bold'
    },
    txtButtom: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        color: '#FFF',
    },
    buttomSave: {
        backgroundColor: '#2D9CDB',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 5,
        height: 40,
        marginStart: 16
    },
    buttomClass: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        paddingVertical: 3,
        paddingHorizontal: 5
    },
    buttomActive: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0085FF',
        backgroundColor: '#89EAFF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    txtItemActive: {
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        fontSize: 10,
        color: '#000'
    },
    txtItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: 10,
        color: '#828282'
    }
})