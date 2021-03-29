import React, { Component } from 'react'
import { View, Text, SafeAreaView, Platform, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import { renderHtml } from './Common';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}


export default class MarkingCamera extends Component {

    constructor(props){
        super(props);
        this.inputHS = Dimensions.get('window').width; 
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <Icon name="chevron-left" size={20} style={{ paddingVertical: 10, paddingHorizontal: 12 }} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, fontSize: 16, fontFamily: 'Nunito-Bold', textAlign: 'center' }}>Bài kiểm tra bằng camera</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View style={styles.viewRNPicker}>
                        <RNPickerSelect
                            placeholder={{
                                label: 'Chọn học sinh',
                                value: null,
                            }}
                            placeholderTextColor="#979797"
                            underlineColorAndroid="rgba(0,0,0,0)"
                            items={[{ label: 'dsadsa', value: 'hsadjkhasÏ' }]}
                            style={{ ...pickerSelectStyles }, {
                                inputIOS: {
                                    width: 180,
                                    paddingLeft:10
                                }
                            }}
                            onValueChange={value => {
                                this.setState({ valueClass: value });
                            }}
                            value={[]}
                            hideIcon={true}
                        />
                        <Icon
                            name={'angle-down'}
                            size={25}
                            color={Platform.OS == 'android' ? '#979797' : '#000'}
                            style={styles.icon}
                        />
                    </View>
                    <View style={styles.viewRNPicker}>
                        <RNPickerSelect
                            placeholder={{
                                label: 'Chọn lớp',
                                value: null,
                            }}
                            placeholderTextColor="#979797"
                            underlineColorAndroid="rgba(0,0,0,0)"
                            items={[{ label: 'dsadsa', value: 'hsadjkhasÏ' }]}
                            style={{ ...pickerSelectStyles }, {
                                inputIOS: {
                                    width: 140,
                                    paddingLeft:10
                                }
                            }}
                            onValueChange={value => {
                                this.setState({ valueClass: value });
                            }}
                            value={[]}
                            hideIcon={true}
                        />
                        <Icon
                            name={'angle-down'}
                            size={25}
                            color={Platform.OS == 'android' ? '#979797' : '#000'}
                            style={styles.icon}
                        />
                    </View>

                </View>

                <WebView
                    showsVerticalScrollIndicator={false}
                    ignoreSsError={false}
                    scalesPageToFit={false}
                    originWhitelist={['*']}
                    scrollEnabled
                    useWebKit={true}
                    source={{
                        html: renderHtml(),
                        baseUrl
                    }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    viewRNPicker: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: Platform.OS == 'android' ? '#B5B5B5' : '#B5B5B5',
        justifyContent: 'center',
        borderWidth: 0.5,
        height: 45,
        marginHorizontal: 10,
        marginTop: 8,
        marginBottom: 10
    },
    icon: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingRight: 15,
        color: '#979797'
    },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderRadius: 5,
        color: '#000',
        fontFamily: 'Nunito-Regular',
        height: 35,
        margin: 16,
    },
    underline: {
        borderTopWidth: 0,
    },
    inputAndroid: {
        borderRadius: 5,
        borderTopWidth: 0,
        color: '#000',
        height: 45,
        fontFamily: 'Nunito-Regular',
    }
});