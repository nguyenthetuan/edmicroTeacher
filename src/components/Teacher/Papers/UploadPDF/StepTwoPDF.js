import { stubArray } from 'lodash-es';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RippleButton from '../../../libs/RippleButton';
import QuestionGeneral from './QuestionGeneral';
import TotalQuestionConfig from './TotalQuestionConfig';
import Toast from 'react-native-easy-toast';

const WIDTH_WRAP_BUTTON = 0.4 * Dimensions.get('window').width;
export default class StepTwoPDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeButtonIndex: 0,
            totalPoint: 100,
            totalQSTN: 10,
            totalQSTL: 0,
            totalPointTN: 0,
            totalPointTL: 0,
        }
    }

    componentDidMount() {
        const { totalQSTN, totalQSTL } = this.state;
        let totalPointTN = 0;
        let totalPointTL = 0;
        const questionsTN = new Array(totalQSTN).fill({
            index: 0,
            point: +(10 / totalQSTN),
            optionIdAnswer: -1,
            typeAnswer: 0,
            totalQption: 4,
            textPoint: `${(10 / totalQSTN)}`,
        }).map((value, index) => { return { ...value, index } });
        questionsTN.map(e => {
            totalPointTN += e.point;
        });

        const questionsTL = new Array(totalQSTL).fill({
            index: 0,
            point: +(10 / totalQSTL),
            optionIdAnswer: -1,
            typeAnswer: 0,
            textPoint: `${(10 / totalQSTL)}`,
        }).map((value, index) => { return { ...value, index } });
        questionsTL.map(e => {
            totalPointTL += e.point;
        });
        // this.props.getTotalPoint(totalPointTN + totalPointTL);

        this.setState({
            totalPointTN,
            questionsTN,
            totalPointTL,
            questionsTL,
        })
    }

    caculatePointTotal = () => {
        const { questionsTN, questionsTmpTL, activeButtonIndex } = this.state;
        let questionsTmp = activeButtonIndex === 0 ? questionsTN : questionsTL;
        let totalPointTmp = 0;
        questionsTmp.forEach(e => {
            totalPointTmp += e.point;
        });
        if (activeButtonIndex === 0) {
            this.setState({ totalPointTN: totalPointTmp })
        } else {
            this.setState({ totalPointTL: totalPointTmp })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { totalQSTN, totalQSTL, activeButtonIndex, totalPointTL, totalPointTN } = this.state;

        if (activeButtonIndex === 1) {
            if (prevState.totalQSTL !== totalQSTL) {
                const { questionsTL } = this.state;
                let questionsTmpTL = questionsTL;
                const differenceTL = prevState.totalQSTL - totalQSTL
                if (differenceTL > 0) {
                    questionsTmpTL = questionsTL.slice(0, totalQSTL)
                } else {
                    let listTmpTL = new Array(Math.abs(differenceTL)).fill({
                        index: 0,
                        point: `${(totalPointTL / totalQSTL)}`,
                        optionIdAnswer: null,
                        typeAnswer: 3,
                        totalQption: 0,
                        textPoint: `${(totalPointTL / totalQSTL)}`,
                    }).map((value, index) => { return { ...value, index: questionsTmpTL.length + index } });
                    questionsTmpTL = questionsTmpTL.concat(listTmpTL);
                }
                questionsTmpTL = questionsTmpTL.map(e => {
                    return {
                        ...e,
                        point: parseFloat((totalPointTL / totalQSTL)),
                        textPoint: `${(totalPointTL / totalQSTL)}`
                    }
                })
                this.setState({
                    questionsTL: questionsTmpTL,
                })
            }

        } else {
            if (prevState.totalQSTN !== totalQSTN) {
                const { questionsTN } = this.state;
                let questionsTmpTN = questionsTN;
                const difference = prevState.totalQSTN - totalQSTN;
                if (difference > 0) {
                    questionsTmpTN = questionsTmpTN.slice(0, totalQSTN)
                } else {
                    let listTmp = new Array(Math.abs(difference)).fill({
                        index: 0,
                        point: parseFloat((totalPointTN / totalQSTN)),
                        optionIdAnswer: -1,
                        typeAnswer: 0,
                        totalQption: 4,
                        textPoint: `${(totalPointTN / totalQSTN)}`
                    }).map((value, index) => { return { ...value, index: questionsTmpTN.length + index } });
                    questionsTmpTN = questionsTmpTN.concat(listTmp);
                }

                questionsTmpTN = questionsTmpTN.map(e => {
                    return {
                        ...e,
                        point: parseFloat((totalPointTN / totalQSTN)),
                        textPoint: `${(totalPointTN / totalQSTN)}`
                    }
                })
                this.setState({
                    questionsTN: questionsTmpTN,
                })
            }
        }
    }

    onPressButtonType = (type) => {
        this.setState({ activeButtonIndex: type });
    }

    onTotalPointChange = (num) => {
        if (this.validateIsNotNum(num)) {
            this.toast.show('Điểm nhập vào không đúng định dạng!');
            return;
        }
        const { activeButtonIndex, questionsTN, questionsTL, totalQSTN, totalQSTL } = this.state;
        let questionsTmp = activeButtonIndex === 0 ? questionsTN : questionsTL;

        if (activeButtonIndex === 0) {
            questionsTmp.map(item => {
                item.point = (num / totalQSTN).toFixed(2);
                item.textPoint = (num / totalQSTN).toFixed(2).toString();
                return item;
            })
            this.setState({ totalPointTN: num, questionsTN: questionsTmp })
        } else {
            questionsTmp.map(item => {
                item.point = (num / totalQSTN).toFixed(2);
                item.textPoint = (num / totalQSTN).toFixed(2).toString();
                return item;
            })
            this.setState({ totalPointTL: num, questionsTL: questionsTmp })
        }
    }

    validateIsNotNum = (num) => {
        return isNaN(num);
    }

    onTotalQSChange = (num) => {
        if (this.validateIsNotNum(num)) {
            this.toast.show('Số câu nhập vào không đúng định dạng!');
            return;
        }
        const { activeButtonIndex } = this.state;
        if (activeButtonIndex === 0) {
            this.setState({ totalQSTN: num })
        } else {
            this.setState({ totalQSTL: num })
        }
    }

    onChangeOptionAnswer = (index, option) => {
        const { activeButtonIndex, questionsTN, questionsTL } = this.state;
        let questionsTmp = activeButtonIndex === 0 ? questionsTN : questionsTL;
        questionsTmp.map((item) => {
            if (item.index === index) {
                item.optionIdAnswer = option;
                return item;
            } else {
                return item;
            }
        })
        if (activeButtonIndex === 0) {
            this.setState({ questionsTN: questionsTmp })
        } else {
            this.setState({ questionsTL: questionsTmp })
        }
    }

    onChangePointEachQS = (index, val) => {
        const { activeButtonIndex, questionsTN, questionsTL } = this.state;
        if (this.validateIsNotNum(val)) {
            this.toast.show('Điểm nhập vào không đúng định dạng!');
            return;
        }
        let questionsTmp = activeButtonIndex === 0 ? questionsTN : questionsTL;
        questionsTmp.map((item) => {
            if (item.index === index) {
                item.point = Number(val);
                item.textPoint = (val);
                return item;
            } else {
                return item;
            }
        })
        console.log("🚀 ~ file: StepTwoPDF.js ~ line 153 ~ StepTwoPDF ~ questionsTmp", questionsTmp)
        if (activeButtonIndex === 0) {
            this.setState({ questionsTN: questionsTmp })
        } else {
            this.setState({ questionsTL: questionsTmp })
        }
        this.caculatePointTotal();
    }

    render() {
        const { activeButtonIndex, totalPoint, questionsTN, questionsTL, totalPointTL, totalPointTN } = this.state;
        console.log("questionsTN: ", questionsTN);
        return (
            <View style={styles.container} onTouchStart={() => { Keyboard.dismiss(); }}>
                <View style={styles.wrapTextOnTop}>
                    <Text style={styles.textTitleTotalPoint}>Tổng số điểm trắc nghiệm và tự luận</Text>
                    <View style={styles.textInput}>
                        <TextInput
                            value={(Number(totalPointTL) + Number(totalPointTN)).toString().replace(/^0+/, '')}
                            style={{ color: '#FF6213', fontFamily: 'Nunito-bold', fontSize: 18, lineHeight: 25, textAlign: 'center' }}
                            keyboardType='decimal-pad'
                            editable={false}
                        />
                    </View>
                </View>
                <View style={styles.wrapContent}>
                    <View style={styles.wrapTypeButtons}>
                        <View style={[activeButtonIndex === 0 ? styles.wrapTypeButtonActive : styles.wrapTypeButtonInActive, activeButtonIndex === 0 && { borderTopRightRadius: 10 }]}>
                            <RippleButton style={activeButtonIndex === 0 ? styles.buttonTypeActive : styles.buttonTypeInActive} radius={15} onPress={() => { this.onPressButtonType(0) }}>
                                <Text style={styles.textButtonType}>Trắc nghiệm</Text>
                            </RippleButton >
                        </View>
                        <View style={[activeButtonIndex === 1 ? styles.wrapTypeButtonActive : styles.wrapTypeButtonInActive, activeButtonIndex === 1 && { borderTopLeftRadius: 10 }, { alignItems: 'flex-end' }]}>
                            <RippleButton style={activeButtonIndex === 1 ? styles.buttonTypeActive : styles.buttonTypeInActive} radius={15} onPress={() => { this.onPressButtonType(1) }}>
                                <Text style={styles.textButtonType}>Tự luận</Text>
                            </RippleButton>
                        </View>
                    </View>
                    <View style={[styles.wrapQS, activeButtonIndex === 0 ? { borderTopRightRadius: 10 } : { borderTopLeftRadius: 10 }]}>
                        <QuestionGeneral
                            onTotalPointChange={this.onTotalPointChange}
                            onTotalQSChange={this.onTotalQSChange}
                            totalPointTN={this.state.totalPointTN}
                            totalPointTL={this.state.totalPointTL}
                            totalQSTL={this.state.totalQSTL}
                            totalQSTN={this.state.totalQSTN}
                            type={this.state.activeButtonIndex}
                        />
                        <TotalQuestionConfig questionList={activeButtonIndex === 0 ? questionsTN : questionsTL} onChangeOptionAnswer={this.onChangeOptionAnswer} onChangePointEachQS={this.onChangePointEachQS} typeQuestion={activeButtonIndex} />
                        <View style={styles.wrapEnd}>
                            <RippleButton style={styles.buttonNext} radius={15}>
                                <Text style={styles.textNext}>Tiếp tục</Text>
                            </RippleButton>
                        </View>
                    </View>
                </View>
                <Toast ref={(ref) => (this.toast = ref)} position={'center'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        backgroundColor: '#fff',
        // alignItems: 'center',
    },
    buttonNext: {
        width: 160,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2D9CDB',
        justifyContent: 'center',
        alignItems: 'center',
        // bottom: 50,
        alignSelf: 'center',
    },
    textNext: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Nunito-bold',
        color: "#fff"
    },
    wrapEnd: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapContent: {
        flex: 1,
    },
    wrapQS: {
        flex: 1,
        backgroundColor: 'rgba(86,204,242,0.1)',
    },
    textTitleTotalPoint: {
        fontFamily: 'Nunito-bold',
        fontSize: 14,
        lineHeight: 19,
        color: '#FF6213'
    },
    wrapTextOnTop: {
        width: '100%',
        paddingHorizontal: 16,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonTypeActive: {
        height: 30,
        width: 0.8 * WIDTH_WRAP_BUTTON,
        backgroundColor: '#2D9CDB',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTypeInActive: {
        height: 30,
        width: 0.8 * WIDTH_WRAP_BUTTON,
        backgroundColor: '#C4C4C4',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapTypeButtonActive: {
        width: WIDTH_WRAP_BUTTON,
        height: 60,
        backgroundColor: 'rgba(86,204,242,0.1)',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    wrapTypeButtonInActive: {
        width: WIDTH_WRAP_BUTTON,
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    wrapTypeButtons: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textButtonType: {
        fontFamily: 'Nunito-bold',
        fontSize: 14,
        lineHeight: 19,
        color: '#fff'
    },
    textInput: {
        width: 77,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#D7F5FF',
        borderColor: '#2D9CDB',
        paddingHorizontal: 10
    }
})