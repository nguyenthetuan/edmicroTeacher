import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, } from 'react-native';
import ItemMultipleChoice from './ItemMultipleChoice';
import ItemEssay from './ItemEssay';
import BounceAnim from '../../../anim/BounceAnim';

const ITEM_HEIGHT = 35;

const { height } = Dimensions.get('window').height;

export default function TotalQuestionConfig(props) {
    useEffect(() => {
        setQuestions(props.questionList);
        let numberQuestion = props.questionList?.length;
        if (numberQuestion) {
            itemsMultiChoiceRef.current = itemsMultiChoiceRef.current.slice(0, numberQuestion);
            itemsEsaayRef.current = itemsEsaayRef.current.slice(0, numberQuestion);
            let flatlistHeightTmp = numberQuestion * ITEM_HEIGHT;
            setFlatlistHeight(flatlistHeightTmp + 5);
        }
    }, [props.questionList])

    useEffect(() => {
        if (props.indexConditionFailed > -1) {
            startAnimation(props.indexConditionFailed);
        }
    }, [props.indexConditionFailed])

    const itemsMultiChoiceRef = useRef([]);
    const itemsEsaayRef = useRef([]);

    const [questions, setQuestions] = useState(props.questionList)
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [flatlistHeight, setFlatlistHeight] = useState(height);

    const flatList = useRef();
    const onChangeOptionAnswer = (index, option) => {
        props.onChangeOptionAnswer(index, option)
    }

    const onChangePointEachQS = (index, val) => {
        props.onChangePointEachQS(index, val);
    }

    const onKeyBoardShow = async (index) => {
        if (!isShowKeyboard) {
            let flatlistHeightTmp = flatlistHeight + 200;
            setFlatlistHeight(flatlistHeightTmp);
            setIsShowKeyboard(true);
        }
        setTimeout(() => {
            flatList.current.scrollToIndex({ animated: true, index: index });
        }, 0)
    }

    const onKeyBoardBlur = () => {
        if (isShowKeyboard) {
            let flatlistHeightTmp = flatlistHeight - 200;
            setFlatlistHeight(flatlistHeightTmp);
        }
        setIsShowKeyboard(false);
    }

    const startAnimation = (index) => {
        console.log("startAnimation: ");
        if (props.typeQuestion === 0) {
            itemsMultiChoiceRef.current[index].startAnimation()
        } else {
            itemsEsaayRef.current[index].startAnimation()
        }
    }

    return (
        <View style={styles.rootView}>
            <View style={styles.itemWrap}>
                <View style={styles.wrapLeft}>
                    <Text style={styles.textColumn}>Câu hỏi</Text>
                    <View style={{
                        width: 77,
                        height: 30,
                    }}>
                        <Text style={styles.textColumn}>Số điểm</Text>
                    </View>
                </View>
                <View style={styles.wrapRight}>
                    <Text style={styles.textColumn}>{props.typeQuestion === 0 ? 'Đáp án' : ''}</Text>
                </View>
            </View>
            <FlatList
                ref={flatList}
                data={props.questionList}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ width: '100%', height: flatlistHeight }}
                onLayout={(e) => {
                    console.log(e.nativeEvent.layout);
                }}
                renderItem={({ item, index }) => {
                    if (props.typeQuestion === 0) {
                        return (
                            <BounceAnim duration={2000} ref={el => itemsMultiChoiceRef.current[index] = el}>
                                <ItemMultipleChoice
                                    data={item}
                                    onChangeOptionAnswer={onChangeOptionAnswer}
                                    onChangePointEachQS={onChangePointEachQS}
                                    onKeyBoardShow={onKeyBoardShow}
                                    onKeyBoardBlur={onKeyBoardBlur}
                                />
                            </BounceAnim>
                        )
                    } else {
                        return (
                            <BounceAnim duration={2000} ref={el => itemsEsaayRef.current[index] = el}>
                                <ItemEssay
                                    data={item}
                                    onChangeOptionAnswer={onChangeOptionAnswer}
                                    onChangePointEachQS={onChangePointEachQS}
                                    onKeyBoardShow={onKeyBoardShow}
                                    onKeyBoardBlur={onKeyBoardBlur}
                                />
                            </BounceAnim>
                        )
                    }
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        width: '100%',
    },
    itemWrap: {
        width: '100%',
        paddingHorizontal: 16,
        flexDirection: 'row',
        height: 16,
        marginTop: 5
    },
    wrapLeft: {
        flexDirection: 'row',
        height: 16,
        justifyContent: 'space-between',
        width: '50%'
    },
    wrapRight: {
        flexDirection: 'row',
        height: 16,
        width: '50%',
        paddingLeft: 30
    },
    textColumn: {
        color: '#828282',
        fontFamily: 'Nunito',
        fontSize: 12,
        lineHeight: 16,
    }
})