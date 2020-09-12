import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FormDateBg extends Component {
    render() {
        const { keyboardType, placeholder, name, value } = this.props;
        return (
            <View style={styles.formVertical}>
                {this.props.label &&
                    <Text style={styles.labelFormHightlight}>{this.props.label}</Text>
                }
                <View style={styles.rowForm}>
                    <View style={styles.wrapFormIcon}>
                        {this.props.type && this.props.type == 'image' ?
                            <Image source={this.props.icon} style={styles.iconImage} />
                            :
                            <Icon name={name} size={17} color={'#fff'} style={styles.iconInput} />
                        }
                    </View>
                    <TouchableOpacity onPress={() => this.props.onPress()} style={{ flex: 1 }}>
                        <TextInput
                            underlineColorAndroid='transparent'
                            editable={false}
                            selectTextOnFocus={false}
                        />
                        <View style={[styles.inputDate,
                        { width: this.props.width || 100, height: this.props.height || 40 }]}>
                            <Text style={styles.textDate}>
                                {this.props.value}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formVertical: {
        marginVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    labelFormHightlight: {
        color: 'white',
    },
    labelFormDark: {
        color: '#999',
    },
    rowForm: {
        position: 'relative',
        flexDirection: 'row',
        height: 40,
    },
    wrapFormIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50
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
        color: '#fff',
        fontSize: 13
    }
});