import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import RippleButton from '../libs/RippleButton';
import { RFFonsize } from '../../utils/Fonts';

export default class HeaderModal extends React.PureComponent {
    render() {
        const { icon, visibleClose, backgroundColor } = this.props;
        return (
            <View style={[styles.wrapHeader, { backgroundColor }]}>
                <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Image
                        source={icon ? icon : require('../../asserts/icon/thongke_icon.png')}
                        size={16} tintColor={this.props.color || '#333'}
                        style={{ tintColor: this.props.color || '#333' }}
                        resizeMode="contain"
                    /> */}
                </View>
                <Text style={[styles.textTitle]}>
                    {this.props.title ? this.props.title : ''}
                </Text>
                {visibleClose != 0 &&
                    <RippleButton color={'#fff'} size={60} onPress={() => this.props.hideModal()}
                        style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../asserts/icon/close_popup.png')}
                            name="close" size={22}
                            resizeMode="contain"
                            tintColor={this.props.color || '#333'} style={{ tintColor: this.props.color || '#333' }}
                        />
                    </RippleButton>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapHeader: {
        paddingHorizontal: 6,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    textTitle: {
        fontFamily: 'Nunito-Bold',
        color: '#FFF',
        flex: 1,
        alignSelf: 'center',
        fontSize: RFFonsize(16)
    }
});
