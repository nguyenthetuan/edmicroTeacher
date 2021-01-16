import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFFonsize } from '../../utils/Fonts';

export const Checked = (props) => {
    const { checked, onPress } = props;
    return (
        <TouchableOpacity
            style={styles.rowContainer}
            onPress={onPress}
        >
            <View style={styles.rowChecked}>
                {checked ?
                    <Icon name="check" color={'#828282'} size={12} /> :
                    <View />
                }
            </View>
            <Text style={styles.textLabel}>
                {props.label}
            </Text>
        </TouchableOpacity>
    );
}

export default Checked;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rowChecked: {
        width: 16,
        height: 16,
        borderWidth: 0.5,
        borderColor: '#828282',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
        borderRadius: 5,
    },
    textLabel: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(14),
        color: '#757575'
    }
});