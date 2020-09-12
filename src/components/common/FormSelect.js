import React, { Component } from 'react';
import { Picker } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, View, TextInput, Text, Image, TouchableHighlight, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FormSelect extends Component {
    constructor(props) {
        super(props);
        this.inputRefs = {};
    }
    render() {
        const { label, items } = this.props;
        return (
            <View style={styles.formVertical}>
                {this.props.label &&
                    <Text style={styles.labelFormHightlight}>{label}</Text>
                }
                {(Platform.OS == 'android' && items && items.length > 0) ?
                    <View style={styles.rowForm}>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name={'angle-down'} color={'#383838'} size={12} />}
                            headerStyle={{ backgroundColor: "#f8f8f8" }}
                            headerBackButtonTextStyle={{ color: "#333" }}
                            headerTitleStyle={{ color: "#383838" }}
                            style={{ color: '#fff' }}
                            selectedValue={this.props.selected}
                            onValueChange={(text) => this.props.onValueChange(text)}
                        >
                            {(items && items.length > 0) &&
                                items.map((val, key) => {
                                    return (
                                        <Picker.Item key={key} label={val.label} value={val.value} />
                                    );
                                })
                            }

                        </Picker>
                    </View>
                    : <View style={{ height: 40 }} />
                }
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
        flexDirection: 'row',
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
        color: '#f8f8f8',
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 4,
        color: '#fff',
    },
});
