import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFFonsize } from '../../utils/Fonts';
import AppIcon from '../../utils/AppIcon';

const navigateUser = (props) => {
    const { onRightAction } = props;
    if (onRightAction) {
        return onRightAction();
    }
    props.navigation.navigate('ChangInfo', {
        statusbar: 'light-content',
    });
}

const HeaderPrimary = (props) => {
    const { showLead = true, navigation, actionIcon, title, styleTitle, colorBtnBack, } = props;
    return (
        <View style={styles.rowContainer}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                {showLead ?
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <View style={styles.boxAction}>
                            <Image source={AppIcon.icon_arrowLeftv3} style={[styles.leadIcon, { tintColor: colorBtnBack }]} />
                        </View>
                    </TouchableWithoutFeedback>
                    :
                    <View style={styles.boxAction} />
                }
                <Text style={[styles.textTitle, styleTitle]}>{title}</Text>
            </View>
            {actionIcon ?
                <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                    onPress={() => { props.iconAction || navigateUser(props) }}>
                    <View style={[styles.btnAvatar, { backgroundColor: props.actionColor || 'transparent' }]}>
                        <Image
                            source={actionIcon}
                            style={[styles.imgAvatar,
                            props.actionStyle
                            ]}
                        />
                    </View>
                </TouchableWithoutFeedback >
                :
                <View style={styles.btnAvatar} />
            }
        </View>
    );
}

export default HeaderPrimary;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        height: 52,
        alignItems: 'center',
        marginHorizontal: 10,
        justifyContent:'space-between'
    },
    boxAction: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leadIcon: {
        marginRight: 5,
    },
    textTitle: {
        flex: 1,
        color: '#757575',
        fontSize: RFFonsize(16),
        textAlign: 'center'
    },
    btnAvatar: {
        height: 38,
        width: 38,
        marginLeft: 20,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgAvatar: {
        height: 25,
        width: 25,
        borderRadius: 25,
    },
});