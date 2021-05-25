import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Animated,
    AppState,
    RefreshControl,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import HeaderMain from '../../common-new/HeaderMain';
import LaboraStyle from './LaboraStyle';
import apiUserHelper from '../../../services/apiUserHelper';
import { LOGIN_TYPE, isExpried, isRefresh } from '../../../utils/AuthCommon';
import dataHelper from '../../../utils/dataHelper';
import { getUserByToken } from '../../../utils/Helper';
import { setProfileUserAction } from '../../../actions/userAction';
import ItemLaborary from './ItemLaborary';
import {
    laboratoryAction
} from '../../../actions/statisticAction';
import ShimerLabora from './ShimerLabora';
import ModalSubject from '../Papers/ModalSubject';
import _ from 'lodash';
import { HEIGHT_DEVICE, } from '../../../constants/const';
const { Value, timing } = Animated;
const dataSubject = [
    {
        code: "TOAN",
        name: "Toán",
        order: 1,
    },
    {
        code: "HOAHOC",
        name: "Hóa học",
        order: 2,
    },
    {
        code: "VATLY",
        name: "Vật lí",
        order: 3,
    },
    {
        code: "SINH",
        name: "Sinh học",
        order: 4
    },
]

class LaboratoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 2, 3],
            appState: AppState.currentState,
            subjectActive: []
        }
        this._scroll_y = new Value(0)
    }

    async componentDidMount() {
        SplashScreen.hide();
        AppState.addEventListener("change", this._handleAppStateChange);
        await this.onRefreshToken();
        this.setTimeoutRefresh();
        this.initData();
        // this.getDataLaboratory();
    }

    initData = async () => {
        const { token } = await dataHelper.getToken();
        const payload = getUserByToken(token);
        this.props.makeRequestProfile(payload);
        this.getDataLaboratory();
    }
    onRefresh = () => {
        this.initData();
    }

    setTimeoutRefresh = () => {
        if (this.timeRefresh != null) {
            clearInterval(this.timeRefresh);
            this.timeRefresh = null;
        }
        this.timeRefresh = setInterval(() => {
            this.onRefreshToken();
        }, 30000);
    }

    onRefreshToken = async () => {
        const value = await AsyncStorage.getItem('@token');
        if (value !== null && value !== '') {
            const curTime = Math.floor(Date.now() / 1000);
            const { iat, exp } = jwtDecode(value);
            let userPost = null;
            let userObj = null;
            let res = null;
            if (isExpried(exp, curTime) == true) {
                userPost = await dataHelper.getUserPost();
                if (userPost == '') {
                    this.props.navigation.navigate('Auth');
                }
                userObj = JSON.parse(userPost);
                switch (userObj.loginType) {
                    case LOGIN_TYPE.PHONE:
                        res = await apiUserHelper.loginPhoneV2(userObj);
                        break;
                    case LOGIN_TYPE.USERNAME:
                        res = await apiUserHelper.loginUserName(userObj);
                        break;
                    default:
                        global.onSignIn(false); // sosical exp
                        break;
                }
                if (res != '' && res.status === 200) {
                    dataHelper.saveToken(res.access_token);
                    return { token: res.access_token }
                }
            } else if (isRefresh(exp, curTime, iat)) {
                console.log("isRefresh");
                userPost = await dataHelper.getUserPost();
                if (userPost == '') {
                    this.props.navigation.navigate('Auth');
                }
                userObj = JSON.parse(userPost);
                res = await apiUserHelper.refreshToken({ token: value });
                if (res != '' && res.status === 200) {
                    dataHelper.saveToken(res.access_token);
                    return { token: res.access_token }
                }
            }
            return { token: value };
        }
    }

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
            this.checkToken();
        }
        this.setState({ appState: nextAppState });
    };

    checkToken = async () => {
        this.onRefreshToken();
        this.setTimeoutRefresh();
    }


    getDataLaboratory = async () => {
        const { token } = await dataHelper.getToken();
        this.props.fetchLaboratory({ token, subjectCode: '' });
    }

    handleFilter = () => {
        this.refModalSubject.onOpen();
    }

    activeSubject = async item => {
        await this.setState({ subjectActive: [item.code] });
        this.onGetPapers();
        this.refModalSubject.onClose();
    };

    onGetPapers = async () => {
        const { subjectActive, } = this.state;
        const { token } = await dataHelper.getToken();
        this.props.fetchLaboratory({ subjectCode: subjectActive[0] || '', token });

    };

    componentWillUnmount() {
        if (this.timeRefresh != null) {
            clearInterval(this.timeRefresh);
            this.timeRefresh = null;
        }
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    render() {
        const { user, isLoadLabora, laboratory, } = this.props;
        const { subjectActive } = this.state;
        return (
            <View style={LaboraStyle.container}>
                <SafeAreaView style={LaboraStyle.top} />
                <HeaderMain
                    {...user}
                    navigation={this.props.navigation}
                    showFillter={true}
                    handleFilter={this.handleFilter}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    style={{ paddingBottom: 50 }}>
                    {isLoadLabora ?
                        <ShimerLabora />
                        :
                        <ItemLaborary
                            navigation={this.props.navigation}
                            isLoadLabora={isLoadLabora}
                            laboratory={laboratory} />
                    }
                </ScrollView>
                <ModalSubject
                    ref={ref => this.refModalSubject = ref}
                    subjectActive={subjectActive}
                    listSubjects={dataSubject}
                    activeSubject={this.activeSubject}
                    marginTop={HEIGHT_DEVICE / 2}
                />
            </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
        isLoadLabora: state.statistic.isLoadLabora,
        laboratory: state.statistic.laboratory,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        makeRequestProfile: payload => dispatch(setProfileUserAction(payload)),
        fetchLaboratory: payload => dispatch(laboratoryAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LaboratoryScreen);




