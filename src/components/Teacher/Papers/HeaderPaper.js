import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HeaderPaper extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    onGoback = () => {
        requestAnimationFrame(() => {
            const { goBack } = this.props;
            if (goBack) {
                this.props.goBack();
            } else {
                this.props.navigation.goBack();
            }
        });
    };

    navigateUser = () => {
        this.props.navigation.navigate('ChangInfo', {
            statusbar: 'light-content',
        });
    }

    render() {
        const { onRightAction, title, color, backgroundColor } = this.props;
        return (
            <View style={[styles.container, { backgroundColor: backgroundColor }]}>
                <RippleButton onPress={this.onGoback}>
                    <View style={styles.button}>
                        <Icon name="arrow-left" color={color || "#383838"} size={25} />
                    </View>
                </RippleButton>
                <View style={styles.viewTitle}>
                    <Text style={[styles.textTitleHeader, {
                        color: color || '#383838'
                    }]}>{title}</Text>
                </View>
                <TouchableOpacity
                    style={styles.rightHeader}
                    onPress={onRightAction}>
                    <Text style={styles.txtRightHeader}>Tạo bộ đề</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    viewTitle: {
        flex: 1,
        marginLeft: 60,
    },
    button: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitleHeader: {
        fontFamily: 'Nunito-Bold',
        textAlign: 'center',
        fontSize: 16
    },
    btnAvatar: {
        height: 38,
        width: 38,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgAvatar: {
        height: 25,
        width: 25,
        borderRadius: 12.5,
    },
    rightHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        backgroundColor: '#F49A31',
        borderRadius: 5,
        marginEnd: 5,
    },
    txtRightHeader: {
        paddingHorizontal: 13,
        fontSize: 12,
        fontFamily: 'Nunito-Regular',
        color: '#FFF',
    },
});
