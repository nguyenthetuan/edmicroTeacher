import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RippleButton from '../libs/RippleButton';
import themes from '../../themes/themeStyle';

export default class Button extends Component {
    getStyle = () => {
        const { btn } = this.props;
        switch (btn) {
            case 'primary':
                return themes.btnPrimary;
            case 'primary-lg':
                return themes.btnPrimary_lg;
            case 'success':
                return themes.btnSuccess;
            case 'success-lg':
                return themes.btnSuccess_lg;
            case 'info':
                return themes.btnInfo;
            case 'info-lg':
                return themes.btnInfo_lg;
            case 'warning':
                return themes.btnWarning;
            case 'warning-lg':
                return themes.btnWarning_lg;
            case 'danger':
                return themes.btnDanger;
            case 'danger-lg':
                return themes.btnDanger_lg;
            case 'rgb':
                return themes.btnRgb;
            case 'rgb-lg':
                return themes.btnRgb_lg;
            default:
                return themes.btnDefault;
        }
    }

    getTextStyle = () => {
        const { btn } = this.props;
        if (btn != 'default') {
            return themes.textButton;
        } else {
            return themes.texButtonDefault;
        }
    }

    getRippleColor = () => {
        return 'white';
    }

    render() {
        return (
            <RippleButton
                onPress={() => this.props.onPress()}
                size={this.props.width || 500}
                color={this.props.color || this.getRippleColor()}
                radius={this.props.radius}
                disabled={this.props.disabled}
                style={[
                    this.getStyle(),
                    { width: this.props.width, borderRadius: this.props.circle && 20 },
                    { alignSelf: this.props.center && 'center', marginVertical: this.props.vertical || 0 },
                    { ...this.props.style },
                ]}>
                <Text style={[this.getTextStyle(), this.props.styleTitle]}>{this.props.title}</Text>
            </RippleButton>
        )
    }
}

