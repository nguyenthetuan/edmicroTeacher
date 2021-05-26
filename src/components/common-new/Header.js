import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { RFFonsize } from '../../utils/Fonts';
import AppIcon from '../../utils/AppIcon';
import shadowStyle from '../../themes/shadowStyle';
const navigateUser = (props) => {
    const { onRightAction } = props;
    if (onRightAction) {
        return onRightAction();
    }
    props.navigation.navigate('ChangInfo', {
        statusbar: 'light-content',
    });
}

const HeaderPrimary = forwardRef((props, ref) => {
    const { showLead = true, navigation, actionIcon, title, styleTitle, colorBtnBack, centerTitle, createPaper, onRightAction } = props;
    const { bgColorActive, disabled } = props;
    const { shadowBtn } = shadowStyle;
    return (
        <View style={[styles.rowContainer, bgColorActive]}>
            {
                centerTitle ?
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {showLead ?
                                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                                    <View style={styles.boxAction}>
                                        <Image source={AppIcon.icon_arrowLeftv3} style={[styles.leadIcon, { tintColor: colorBtnBack }]} />
                                    </View>
                                </TouchableWithoutFeedback>
                                :
                                <View style={styles.boxAction} />
                            }
                        </View>
                        <Text style={[styles.textTitle, styleTitle]}>{title}</Text>
                    </>
                    :
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    </>
            }
            {actionIcon ?
                <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                    onPress={() => { props.iconAction || navigateUser(props) }}>
                    <View
                        ref={ref}
                        style={[styles.btnAvatar,
                        {
                            backgroundColor: props.actionColor || 'transparent'
                        }
                        ]}
                    >
                        <Image
                            source={actionIcon}
                            style={[styles.imgAvatar,
                            props.actionStyle
                            ]}
                        />
                    </View>
                </TouchableWithoutFeedback >
                :
                <View style={styles.boxAction} />
            }
            {createPaper
                ?
                <TouchableWithoutFeedback
                    onPress={onRightAction}
                    disabled={disabled}
                >
                    <View style={[styles.buttonCreateAssessment, shadowBtn]} >
                        <Text style={styles.textCreateAssessment}>Tạo bộ đề</Text>
                    </View>
                </TouchableWithoutFeedback>
                :
                null
            }
        </View >
    );
});

export default HeaderPrimary;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        height: 52,
        alignItems: 'center',
        marginHorizontal: 10,
        justifyContent: 'space-between',
    },
    boxAction: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leadIcon: {
        marginRight: 5,
    },
    textTitle: {
        // flex: 1,
        color: '#757575',
        fontSize: RFFonsize(16),
        textAlign: 'center',
        fontFamily: 'Nunito-Bold',
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
    buttonCreateAssessment: {
        width: 80,
        height: 25,
        borderRadius: 5,
        backgroundColor: '#FDC214',
        justifyContent: 'center',
        right: 10,
        zIndex: 1,
    },
    textCreateAssessment: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        color: '#fff',
        alignSelf: 'center'
    },
});

