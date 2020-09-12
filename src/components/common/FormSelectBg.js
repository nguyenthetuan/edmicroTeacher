import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker, Icon } from 'native-base';
import * as AppConst from '../../constants/const';

export default class FormSelectBeta extends Component {
    render() {
        return (
            <View style={styles.rowForm}>
                <Text style={styles.label}>{this.props.label}</Text>
                <View style={styles.viewInput}>
                    {this.props.data &&
                        <Picker
                            iosIcon={<Icon name="ios-arrow-down-outline" color={'white'} style={{color:'#fff'}}/>}
                            note
                            mode="dropdown"
                            textStyle={{ color: 'white' }}
                            style={{ color: '#333', width: AppConst.CONTAINER_FORM_WIDTH, height: 40 }}
                            selectedValue={this.props.selectedValue}
                            onValueChange={(value) => {
                                this.props.onValueChange(value);
                            }}
                        >
                            {this.props.data.map((val, key) => {
                                return (
                                    <Picker.Item key={key} label={val.label} value={val.value} />
                                );
                            })}
                        </Picker>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowForm: {
        marginVertical: 15,
    },
    label: {
        color: '#fff',
        marginLeft: 5
    },
    viewInput: {
        height: 40,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#cdcdcd',
        marginTop: 10,
    }
});
