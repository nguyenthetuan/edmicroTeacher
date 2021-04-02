import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, } from 'react-native';
import ItemMultipleChoice from './ItemMultipleChoice';
import ItemEssay from './ItemEssay';

export default function TotalQuestionConfig(props) {
    useEffect(() => {
        setQuestions(props.questionList)
    }, [props.questionList])
    const [questions, setQuestions] = useState(props.questionList)
    const onChangeOptionAnswer = (index, option) => {
        props.onChangeOptionAnswer(index, option)
    }
    console.log(props.questionList)

    const onChangePointEachQS = (index, val) => {
        props.onChangePointEachQS(index, val);
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
                data={props.questionList}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ width: '100%' }}
                renderItem={({ item, index }) => {
                    if (props.typeQuestion === 0) {
                        return (
                            <ItemMultipleChoice
                                data={item}
                                onChangeOptionAnswer={onChangeOptionAnswer}
                                onChangePointEachQS={onChangePointEachQS}
                            />
                        )
                    } else {
                        return (
                            <ItemEssay
                                data={item}
                                onChangeOptionAnswer={onChangeOptionAnswer}
                                onChangePointEachQS={onChangePointEachQS}
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