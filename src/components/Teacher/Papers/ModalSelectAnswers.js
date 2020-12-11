import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default class ModalSelectAnswers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionIdAnswer: -1,
        }
    }

    componentDidMount() {
        this.setState({ optionIdAnswer: this.props.optionIdAnswer });
    }

    setIdAnswer(optionIdAnswer) {
        this.setState({ optionIdAnswer: optionIdAnswer });
    }

    onSelectAnswer = (answer) => {
        this.props.onSelectAnswer(answer)
        this.setState({ optionIdAnswer: answer });
    }

    close = () => {
        this.props.close()
    }

    render() {
        let { indexSelecting } = this.props;
        return (
            <>
                {this.props.showSelectAnswer && <View style={styles.modal}>
                    <Text style={{
                        fontFamily: 'Nunito-Bold',
                        fontSize: 14,
                        color: '#fff',
                    }}>Câu {indexSelecting + 1}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 30, height: 30, width: width, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.onSelectAnswer(0)}
                            style={[styles.btnAnswer, {
                                backgroundColor: this.state.optionIdAnswer === 0 ? '#56CCF2' : '#fff',
                                borderColor: this.state.optionIdAnswer === 0 ? '#2D9CDB' : '#828282'
                            }]}>
                            <Text style={[styles.txtAnswer, {
                                color: this.state.optionIdAnswer === 0 ? '#fff' : '#828282'
                            }]}>A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onSelectAnswer(1)}
                            style={[styles.btnAnswer, {
                                backgroundColor: this.state.optionIdAnswer === 1 ? '#56CCF2' : '#fff',
                                borderColor: this.state.optionIdAnswer === 1 ? '#2D9CDB' : '#828282'
                            }]}>
                            <Text style={[styles.txtAnswer, {
                                color: this.state.optionIdAnswer === 1 ? '#fff' : '#828282'
                            }]}>B</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onSelectAnswer(2)}
                            style={[styles.btnAnswer, {
                                backgroundColor: this.state.optionIdAnswer === 2 ? '#56CCF2' : '#fff',
                                borderColor: this.state.optionIdAnswer === 2 ? '#2D9CDB' : '#828282'
                            }]}>
                            <Text style={[styles.txtAnswer, {
                                color: this.state.optionIdAnswer === 2 ? '#fff' : '#828282'
                            }]}>C</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onSelectAnswer(3)}
                            style={[styles.btnAnswer, {
                                backgroundColor: this.state.optionIdAnswer === 3 ? '#56CCF2' : '#fff',
                                borderColor: this.state.optionIdAnswer === 3 ? '#2D9CDB' : '#828282'
                            }]}>
                            <Text style={[styles.txtAnswer, {
                                color: this.state.optionIdAnswer === 3 ? '#fff' : '#828282'
                            }]}>D</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.close}
                            style={{ width: 90, height: 30, position: 'absolute', right: 40, backgroundColor: '#FFFFFF', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '700', fontFamily: 'Nunito', fontSize: 14, color: '#56BB73' }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
            </>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        width: width,
        height: 160,
        backgroundColor: '#2D9CDB',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        position: 'absolute',
        bottom: 0,
        padding: 10
    },
    btnAnswer: {
        height: 30,
        width: 30,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 7
    },
    txtAnswer: {
        fontFamily: 'Nunito-Bold',
        fontSize: 18,
        color: '#828282'
    },
})