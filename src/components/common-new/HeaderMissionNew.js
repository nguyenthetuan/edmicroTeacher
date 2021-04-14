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
        this.props.getListMission({ token });
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
                <RippleButton onPress={this.openDrawer}>
                    <View style={styles.button}>
                        <Image
                            source={require('../../asserts/icon/menu.png')}
                            style={{ tintColor: '#383838' }}
                            tintColor={'#383838'} />
                    </View>
                </RippleButton>
                <View style={{ flex: 1, marginLeft: 10, top: -2  }}>
                    <Image source={require('../../asserts/icon/logo_onluyen.png')} />
                </View>

                {isAccessMission
                    &&
                    <TouchableOpacity
                        style={[styles.addMission, { ...shadowBtn }]}
                        onPress={this.goToSetupMission}>
                        {/* <Image
                            source={require('../../asserts/icon/icon_missionPlus.png')}
                            style={{ width: 25, height: 25 }}
                        /> */}
                        <Text style={styles.txtAdd}>Thêm nhiệm vụ</Text>
                        <Image
                            source={require('../../asserts/icon/icon_plusBox.png')}
                            style={styles.iconFlus}
                        />
                    </TouchableOpacity>
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
        color: '#000',
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
