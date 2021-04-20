import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, } from 'react-native';
import ItemMultipleChoice from './ItemMultipleChoice';
import ItemEssay from './ItemEssay';

const ITEM_HEIGHT = 35;

const { height } = Dimensions.get('window').height;

export default function TotalQuestionConfig(props) {
    useEffect(() => {
        setQuestions(props.questionList);
        let numberQuestion = props.questionList?.length;
        if (numberQuestion) {
            let flatlistHeightTmp = numberQuestion * ITEM_HEIGHT;
            setFlatlistHeight(flatlistHeightTmp);
        }
    }, [props.questionList])


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
                            <ItemMultipleChoice
                                data={item}
                                onChangeOptionAnswer={onChangeOptionAnswer}
                                onChangePointEachQS={onChangePointEachQS}
                                onKeyBoardShow={onKeyBoardShow}
                                onKeyBoardBlur={onKeyBoardBlur}
                            />
                        )
                    } else {
                        return (
                            <ItemEssay
                                data={item}
                                onChangeOptionAnswer={onChangeOptionAnswer}
                                onChangePointEachQS={onChangePointEachQS}
                                onKeyBoardShow={onKeyBoardShow}
                                onKeyBoardBlur={onKeyBoardBlur}
                            />
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