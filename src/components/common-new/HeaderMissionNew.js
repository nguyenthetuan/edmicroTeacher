import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Text
} from 'react-native';
import RippleButton from '../common-new/RippleButton';
import dataHelper from '../../utils/dataHelper';
import Api from '../../services/apiMission';
import { RFFonsize } from '../../utils/Fonts';
import shadowStyle from '../../themes/shadowStyle';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

export default class HeaderMissionNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listMission: this.props.listMission,
            listMissionSearch: this.props.listMission,
            isAccessMission: false,
        }
        this.token = null;
    }
    openDrawer = () => {
        requestAnimationFrame(() => {
            this.props.navigation.toggleDrawer();
        });
    };
    componentDidMount() {
        this.getToken();
    }

    async getToken() {
        const { token } = await dataHelper.getToken();
        const res = await Api.checkPermission(token);
        const { isAccessMission } = res;
        this.setState({ isAccessMission })
        this.props.getListMission && this.props.getListMission({ token });
        this.props.getCommonSubjectMission({ token });
    }
    goToSetupMission = () => {
        this.props.navigation.navigate('MissionStepByStep');
    };

    render() {
        const { shadowBtn } = shadowStyle;
        const { isAccessMission } = this.state;
        return (
            <View style={styles.container}>
                <RippleButton
                    hitSlop={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    onPress={this.openDrawer}>
                    <View style={styles.button}>
                        <Image
                            source={require('../../asserts/icon/menu.png')}
                            style={{ tintColor: '#383838' }}
                            tintColor={'#383838'} />
                    </View>
                </RippleButton>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Image source={require('../../asserts/appIcon/logo_TearcherTxt.png')} />
                </View>

                {isAccessMission
                    &&
                    <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                        onPress={this.goToSetupMission}>
                        <View style={[styles.addMission, { ...shadowBtn }]}>
                            {/* <Image
                            source={require('../../asserts/icon/icon_missionPlus.png')}
                            style={{ width: 25, height: 25 }}
                        /> */}
                            <Text style={styles.txtAdd}>Thêm nhiệm vụ</Text>
                            <Image
                                source={require('../../asserts/icon/icon_plusBox.png')}
                                style={styles.iconFlus}
                            />
                        </View>
                    </TouchableWithoutFeedback>
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
        marginLeft: 10,
        marginRight: 12,
    },
    button: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMission: {
        justifyContent: 'flex-end',
        marginRight: 10,
        flexDirection: 'row',
        backgroundColor: '#ededed',
        borderRadius: 5,
    },
    txtAdd: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        fontWeight: '500',
        color: '#383838',
        alignSelf: 'center',
        padding: 5,
        paddingLeft: 10
    },
    iconFlus: {
        tintColor: '#2D9CDB',
        alignSelf: 'center',
        marginLeft: 2,
        marginRight: 10
    }
});
