import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { RFFonsize } from '../../utils/Fonts';

export default function TextFormField(props) {
    const { formStyle, error, isShowPassword, secureTextEntry = false, suffixIconAction, suffixIcon } = props;
    const inputDecoration = formStyle == 'bottom' ? styles.inputDecorationBottomBorder : styles.inputDecorationBorder;
    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>{props.label}</Text>
            <View style={[styles.inputDecoration, inputDecoration]}>
                <TextInput
                    style={styles.textInput}
                    placeholderTextColor={'#BDBDBD'}
                    autoCorrect={false}
                    autoCompleteType='off'
                    autoCapitalize={"none"}
                    {...props}
                />
                {suffixIcon &&
                    <TouchableOpacity onPress={suffixIconAction}>
                        <Image
                            source={props.suffixIcon}
                            style={[styles.suffixIcon, {
                                tintColor: secureTextEntry ? '#E0E0E0' : '#54CEF5'
                            }]} />
                    </TouchableOpacity>
                }
            </View>
            {error &&
                <Text style={[styles.textInvalid]}>{error}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#222222',
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: 19,
    },
    inputDecoration: {
        height: 42,
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderColor: '#54CEF5',
        alignItems: 'center'
    },
    inputDecorationBorder: {
        marginTop: 5,
        borderWidth: 0.5,
        borderRadius: 5, 
        flexDirection: 'row'
    },
    inputDecorationBottomBorder: {
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    textInput: {
        fontFamily: 'Nunito-Regular',
        flex: 1,
        color: '#000'
    },
    suffixIcon: {
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    textInvalid: {
        color: '#D22D3F',
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(11),
        marginTop: 5
    }
});
