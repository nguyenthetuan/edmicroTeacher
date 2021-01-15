import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFFonsize } from '../../utils/Fonts';

export default class FormInputIcon extends Component {
    render() {
        const { keyboardType, placeholder, name, value, styleIcon } = this.props;
        return (
            <View style={styles.formVertical}>
                {this.props.label &&
                    <Text style={styles.labelFormDark}>{this.props.label}</Text>
                }
                <View style={styles.rowForm}>
                    <View style={styles.wrapFormIcon}>
                        {this.props.type && this.props.type == 'image' ?
                            <Image source={this.props.icon} style={[styles.iconImage, styleIcon]} />
                            :
                            <Icon name={name} size={17} color={'#333'} style={[styles.iconInput, styleIcon]} />
                        }
                    </View>
                    <TextInput
                        secureTextEntry={this.props.secureTextEntry || false}
                        onChangeText={(text) => this.props.onChangeText(text)}
                        underlineColorAndroid="transparent"
                        keyboardType={keyboardType || 'default'}
                        placeholder={placeholder || ''}
                        value={value}
                        onSubmitEditing={this.props.onSubmitEditing || null}
                        placeholderTextColor={'#BDBDBD'}
                        style={styles.formTextInput}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formVertical: {
        marginVertical: 15,
        borderColor: '#E0E0E0',
    },
    labelFormHightlight: {
        color: 'white',
    },
    labelFormDark: {
        color: '#828282',
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(16),
    },
    rowForm: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'flex-end',
    },
    wrapFormIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 15,
    },
    iconImage: {
        width: 20,
        height: 20,
    },
    iconInput: {
        alignSelf: 'center',
        marginBottom: 3
    },
    formTextInput: {
        flex: 1,
        color: '#000',
        position: 'absolute',
        bottom: Platform.OS == 'android' ? -15 : 0,
        left: 20
    }
});