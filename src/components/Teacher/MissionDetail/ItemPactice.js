import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ItemPactice(props) {
    const { item } = props;
    return (
        <TouchableOpacity style={styles.contain} onPress={() => {
            props.show({ _id: item.problemId });
        }}>
            <Text style={styles.styTxt} numberOfLines={1}>{item.problemName}</Text>
            <View style={{}} />
            <Text style={styles.styCount}> Yêu cầu hoàn thành: <Text style={{color:'#6ED8FB'}}>{item.percentDone} %</Text></Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    contain: {
        borderWidth: 1,
        marginHorizontal: 20,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        borderColor: '#56CCF2',
        flexDirection: 'column',
    },
    styTxt: {
        fontFamily: 'Nunito-Regular',
        color: '#828282',
        flex: 1
    },
    styWrapCount: {
        backgroundColor: '#6ED8FB',
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    styCount: {
        color: '#828282',
        fontFamily: 'Nunito-Regular',
        fontSize: 12,
        letterSpacing: 0,
        alignSelf: 'flex-end',  
        marginTop: 5
    }
})