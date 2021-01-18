import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFFonsize } from '../../utils/Fonts';

export default class FormDateDefault extends Component {
    render() {
        const { keyboardType, placeholder, name, value, styleLabel, styleInput } = this.props;
        return (
            <View style={styles.formVertical}>
                {this.props.label &&
                    <Text style={[styles.labelFormHightlight, styleLabel]}>{this.props.label}</Text>
                }
                <View style={styles.rowForm}>
                    <View style={styles.wrapFormIcon}>
                        {this.props.type && this.props.type == 'image' ?
                            <Image source={this.props.icon} style={styles.iconImage} />
                            :
                            <Icon name={name} size={17} color={'#333'} style={styles.iconInput} />
                        }
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
                        <View style={{ flex: 1, alignSelf: 'center' }}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                editable={false}
                                selectTextOnFocus={false}
                            />
                            <View style={[styles.inputDate,
                            { width: this.props.width || 150, height: this.props.height || 35 }]}>
                                <Text style={[styles.textDate, styleInput]}>
                                    {this.props.value}
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    formVertical: {
        marginVertical: 15,
        borderColor: '#E0E0E0',
    },
    labelFormHightlight: {
        color: '#828282',
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(16)
    },
    labelFormDark: {
        color: '#828282',
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(16)
    },
    rowForm: {
        position: 'relative',
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#C4C4C4',
    },
    wrapFormIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        paddingTop: 10
    },
    iconImage: {
        width: 20,
        height: 20
    },
    iconInput: {
        alignSelf: 'center',
    },
    formTextInput: {
        flex: 1,
        height: 40,
        color: '#f8f8f8',
    },
    inputDate: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    textDate: {
        color: '#000',
        fontSize: RFFonsize(16),
        fontFamily: 'Nunito-Regular'
    }
});