import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import RippleButton from '../common-new/RippleButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HeaderNavigation extends React.PureComponent {
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
        const { actionIcon, title, color, backgroundColor } = this.props;
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
                {actionIcon ?
                    <TouchableOpacity
                        onPress={this.navigateUser}
                        style={styles.btnAvatar}>
                        <Image
                            resizeMode="cover"
                            source={actionIcon}
                            style={styles.imgAvatar}
                        />
                    </TouchableOpacity>
                    :
                    <View style={styles.btnAvatar} />
                }
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
        marginLeft: 10,
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
});
