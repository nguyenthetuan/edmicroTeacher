import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Animated,
    AppState,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import HeaderMain from '../../common-new/HeaderMain';
import HomeStyle from './HomeStyle';
import WellcomeTxt from './WellcomeTxt';
import StatisticHome from './StatisticHome';
import DiaryActive from './DiaryActive';
import apiUserHelper from '../../../services/apiUserHelper';
import { LOGIN_TYPE, isExpried, isRefresh } from '../../../utils/AuthCommon';
import dataHelper from '../../../utils/dataHelper';
import { getUserByToken } from '../../../utils/Helper';
import { setProfileUserAction } from '../../../actions/userAction';
import {
    statisticClassAction,
    statisticMissionAction,
    statisticAssignmentAction,
    diaryActiveAction
} from '../../../actions/statisticAction';
const { height } = Dimensions.get('window');
const { Value, timing } = Animated;


class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 2, 3],
            appState: AppState.currentState
        }
        this._scroll_y = new Value(0)
    }

    async componentDidMount() {
        SplashScreen.hide();
        AppState.addEventListener("change", this._handleAppStateChange);
        await this.onRefreshToken();
        this.setTimeoutRefresh();
        this.initData();
        // this.getDataStatistics();
    }

    initData = async () => {
        const { token } = await dataHelper.getToken();
        const payload = getUserByToken(token);
        this.props.makeRequestProfile(payload);
        this.getDataStatistics();
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


    getDataStatistics = async () => {
        const { token } = await dataHelper.getToken();
        const schoolYear = new Date().getFullYear();
        const enumType = 0;
        this.props.fetchClassAction({ token, schoolYear });
        this.props.fetchMissionAction({ token, enumType, schoolYear });
        this.props.fetchAssignmentAction({ token, enumType, schoolYear });
        this.props.fetchDiaryActiveAction({ token, enumType, schoolYear });
    }

    componentWillUnmount() {
        if (this.timeRefresh != null) {
            clearInterval(this.timeRefresh);
            this.timeRefresh = null;
        }
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    render() {
        const { user, isLoading, diaryActive, countdiaryActive } = this.props;
        const { data } = this.state;
        return (
            <View style={HomeStyle.container}>
                <SafeAreaView style={HomeStyle.top} />
                <HeaderMain
                    {...user}
                    navigation={this.props.navigation}
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
                    <WellcomeTxt />
                    <View style={HomeStyle.body}>
                        {
                            isLoading ?
                                <ActivityIndicator size="small" style={{ flex: 1, height: height * 0.5 }} />
                                :
                                <StatisticHome
                                    data={data}
                                    navigation={this.props.navigation}
                                />
                        }
                    </View>
                    <View style={HomeStyle.bodyDiaryAc}>
                        <DiaryActive diaryActive={diaryActive} countdiaryActive={countdiaryActive} />
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
        listClass: state.statistic.listClass,
        mission: state.statistic.mission,
        assignment: state.statistic.assignment,
        isLoading: state.statistic.isLoading,
        classArray: state.statistic.classArray,
        diaryActive: state.statistic.diaryActive,
        countdiaryActive: state.statistic.countdiaryActive
    };
};

const mapDispatchToProps = dispatch => {
    return {
        makeRequestProfile: payload => dispatch(setProfileUserAction(payload)),
        fetchClassAction: payload => dispatch(statisticClassAction(payload)),
        fetchMissionAction: payload => dispatch(statisticMissionAction(payload)),
        fetchAssignmentAction: payload => dispatch(statisticAssignmentAction(payload)),
        fetchDiaryActiveAction: payload => dispatch(diaryActiveAction(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);




