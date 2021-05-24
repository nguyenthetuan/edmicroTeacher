import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';
const { width } = Dimensions.get('window');
const ItemQuestion = ({ item, index, onHandleNext, answer, backgroundColor, color, style }) => {
    const isAnswered = item.status === 1;
    if (!_.isEmpty(item)) {
        return (
            <TouchableWithoutFeedback onPress={onHandleNext}>
                <View
                    style={[styles.btnAnswerFlatlis,
                    {
                        backgroundColor: backgroundColor ? backgroundColor : '#FFF',
                        borderRadius: item.typeAnswer === 3 ? 50 : 5
                    }, style]}
                >
                    <Text style={[styles.txtNumberQuestion, { color: color ? color : '#000', }]}>
                        {index + 1}
                        {
                            item.typeAnswer !== 3 && _.isArray(item.userOptionId) && (item.userOptionId[0] == 0 || item.userOptionId[0]) ?
                                <Text>
                                    .{answer}
                                </Text>
                                :
                                isAnswered ?
                                    <Text>*</Text>
                                    : null
                        }
                    </Text>
                </View>
            </TouchableWithoutFeedback >
        )
    } else {
        return <View />
    }
}

export default React.memo(ItemQuestion);

const styles = StyleSheet.create({
    btnAnswerFlatlis: {
        width: width / 9,
        height: width / 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    txtNumberQuestion: {
        fontFamily: 'Nunito-Bold',
        color: '#000',
        fontSize: 12
    },
});