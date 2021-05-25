import React, { useEffect, useState, useRef } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    Platform,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import moment from 'moment';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { connect } from 'react-redux';
import { fetchHomeworkAction } from '../../../actions/homeworkTeacherAction';
import { updateExamListAction } from '../../../actions/paperAction';
import { createAppContainer } from 'react-navigation';
import LevelCompletion from '../../../containers/teacher/homework/LevelCompletion';
import RightWrongRatio from '../../../containers/teacher/homework/RightWrongRatio';
import StudentDetail from '../../../containers/teacher/homework/StudentDetail';
import dataHelper from '../../../utils/dataHelper';
import apiHomework from '../../../services/apiHomeworkTeacher';
import Toast from 'react-native-easy-toast';
import { HEIGHT_TOPBAR } from '../../../utils/Common';
import AppIcon from '../../../utils/AppIcon';
import ModalFillter from '../../Teacher/Homework/ModalFillter';
import { convertTimeHMDMY } from '../../../utils/Utils';
import _ from 'lodash';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import Global from '../../../utils/Globals';
import { RFFonsize } from '../../../utils/Fonts';
import AsyncStorage from '@react-native-community/async-storage';
import TourView from '../../../utils/TourView';

const { width, height } = Dimensions.get('window');

const initTab = createMaterialTopTabNavigator(
    {
        LevelComplete: {
            screen: (props) => <LevelCompletion {...props} />,
            navigationOptions: {
                title: 'Độ hoàn thành',
                tabBarLabel: ({ focused }) => {
                    return !focused ? (
                        <Text numberOfLines={1} style={styles.labelTab}>
                            Độ hoàn thành
                        </Text>
                    ) : (
                            <Text numberOfLines={1} style={styles.labelTabActive}>
                                Độ hoàn thành
                            </Text>
                        );
                },
            },
        },
        RightWrongRatio: {
            screen: (props) => <RightWrongRatio {...props} />,
            navigationOptions: {
                title: 'Tỉ lệ Đ/S',
                tabBarLabel: ({ focused }) => {
                    return !focused ? (
                        <Text numberOfLines={1} style={styles.labelTab}>
                            Tỉ lệ Đ/S
                        </Text>
                    ) : (
                            <Text numberOfLines={1} style={styles.labelTabActive}>
                                Tỉ lệ Đ/S
                            </Text>
                        );
                },
            },
        },
        StudentDetail: {
            screen: (props) => <StudentDetail
                {...props}
            />,
            navigationOptions: {
                title: 'Học sinh',
                tabBarLabel: ({ focused }) => {
                    return !focused ? (
                        <Text numberOfLines={1} style={styles.labelTab}>
                            Học sinh
                        </Text>
                    ) : (
                            <Text numberOfLines={1} style={styles.labelTabActive}>
                                Học sinh
                            </Text>
                        );
                },
            },
        },
    },
    {
        backBehavior: false,
        swipeEnabled: false,
        animationEnabled: false,
        lazy: Platform.OS == 'ios',
        tabBarPosition: 'top',
        tabBarOptions: {
            scrollEnabled: false,
            upperCaseLabel: false,
            style: {
                backgroundColor: '#FFF',
                borderBottomWidth: 1,
                borderBottomColor: '#56CCF2',
                height: 40,
                elevation: 0,
                shadowOffset: { height: 0, width: 0 },
                justifyContent: 'space-between',
            },
            indicatorStyle: {
                backgroundColor: '#56CCF2',
                height: 5,
                width: Platform.isPad ? 200 : 100,
                borderBottomWidth: 1,
                borderBottomColor: '#56CCF2',
                borderBottomWidth: 1,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                marginLeft: width < 350 ? 20 : 15,
                marginRight: width < 350 ? 20 : 15,
            },
        },
    },
);

const Tab = createAppContainer(initTab);

const indexSelected = {
    grade: -1,
    subject: -1,
    homework: 0,
    class: 0,
};


function HomeWorkDraScreen(props) {
    const toast = useRef();
    const modalFillter = useRef();
    const refHeaderNavigation = useRef();
    const refTourView = useRef();
    const [data, setData] = useState({
        grade: [],
        subject: [],
        homework: [],
        class: [],
    });

    const [timeExport, setTimeExport] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefresh, setRefresh] = useState(false);
    // const [isMounted, setMonted] = useState(false)

    useEffect(() => {
        handlerShowTourView();
        const showPopup = setTimeout(() => {
            onClickFillter();
        }, 500);
        return () => {
            clearTimeout(showPopup);
        }
    }, []);

    const handlerShowTourView = async () => {
        // await AsyncStorage.removeItem('@Onluye_TourView_HomeWorkDraScreen');
        const isShow = await AsyncStorage.getItem('@Onluye_TourView_HomeWorkDraScreen');
        if (isShow) return;

        setTimeout(() => {
            try {
                const dataRef = [
                    {
                        reff: refHeaderNavigation.current.ref,
                        hint: 'Lọc thống kê bài tập theo khối lớp, môn học, bài tập và lớp học'
                    },
                ];
                refTourView.current.onMeasure(dataRef);
                AsyncStorage.setItem('@Onluye_TourView_HomeWorkDraScreen', '1');
            } catch (error) {
                console.log(error);
            }
        }, 1000);
    }

    const onPressItemGrade = async (index) => {
        indexSelected.grade = index;

        const { token } = await dataHelper.getToken();
        if (token) {
            let listHomework = [];
            let listClass = [];

            const resHomework = await apiHomework.getHomework({
                token,
                body: {
                    gradeCode: [data.grade[index].gradeId],
                    subjectCode:
                        indexSelected.subject > -1
                            ? [data.subject[indexSelected.subject].code]
                            : [],
                },
            });
            if (resHomework && resHomework.data) {
                indexSelected.homework = 0;
                listHomework = resHomework.data;
            }

            if (listHomework.length) {
                const status = {
                    ToDo: 0,
                    Doing: 1,
                    Submit: 2,
                    Done: 3,
                    NotOpen: 4,
                    Paused: 5,
                    TimeOut: 6,
                    TimeOutDontDo: 7,
                };
                const resClass = await apiHomework.getClass({
                    token,
                    classId: listHomework[0].assignmentId,
                    status: status.ToDo,
                    indexPage: 0,
                });
                if (resClass && resClass.data) {
                    indexSelected.class = 0;
                    listClass = resClass.data;
                }
            }

            setData({
                ...data,
                homework: listHomework,
                class: listClass,
            });
        }
    };

    const onPressItemSubject = async (index) => {
        indexSelected.subject = index;

        const { token } = await dataHelper.getToken();
        if (token) {
            let listHomework = [];
            let listClass = [];

            const resHomework = await apiHomework.getHomework({
                token,
                body: {
                    gradeCode: indexSelected.grade
                        ? [data.grade[indexSelected.grade].gradeId]
                        : [],
                    subjectCode: [data.subject[index].code],
                },
            });
            if (resHomework && resHomework.data) {
                indexSelected.homework = 0;
                listHomework = resHomework.data;
            }

            if (listHomework.length) {
                const status = {
                    ToDo: 0,
                    Doing: 1,
                    Submit: 2,
                    Done: 3,
                    NotOpen: 4,
                    Paused: 5,
                    TimeOut: 6,
                    TimeOutDontDo: 7,
                };
                const resClass = await apiHomework.getClass({
                    token,
                    classId: listHomework[0].assignmentId,
                    status: status.ToDo,
                    indexPage: 0,
                });
                if (resClass && resClass.data) {
                    indexSelected.class = 0;
                    listClass = resClass.data;
                }
            }

            setData({
                ...data,
                homework: listHomework,
                class: listClass,
            });
        }
    };

    const onPressItemHomework = async (index) => {
        indexSelected.homework = index;

        let listClass = [];

        const { token } = await dataHelper.getToken();
        if (token) {
            const status = {
                ToDo: 0,
                Doing: 1,
                Submit: 2,
                Done: 3,
                NotOpen: 4,
                Paused: 5,
                TimeOut: 6,
                TimeOutDontDo: 7,
            };
            const resClass = await apiHomework.getClass({
                token,
                classId: data.homework[index].assignmentId,
                status: status.ToDo,
                indexPage: 0,
            });
            if (resClass && resClass.data) {
                indexSelected.class = 0;
                listClass = resClass.data;
            }

            setData({
                ...data,
                class: listClass,
            });
        }
    };

    const onPressItemClass = async (index) => {
        indexSelected.class = index;
    };

    const handleStatistic = async () => {
        setIsLoading(true);
        if (data.class.length > 0) {
            const { token } = await dataHelper.getToken();
            if (token) {
                await props.fetchHomework({
                    token,
                    assignId: data.class[indexSelected.class].assignId,
                });
                props.needUpdate(true);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            toast.current.show('Không tìm thấy lớp nào!');
        }
    };

    const fetchData = async () => {
        const { token } = await dataHelper.getToken();
        if (token) {
            let listGrade = [];
            let listSubject = [];
            let listHomework = [];
            let listClass = [];

            const resGrade = await apiHomework.getGrade({ token });
            if (resGrade) {
                listGrade = resGrade;
            }
            const resSubject = await apiHomework.getSubject({ token });
            if (resSubject) {
                listSubject = resSubject;
            }

            const resHomework = await apiHomework.getHomework({
                token, body: {
                    indexPage: 0,
                    isShare: true,
                    status: [],
                    subjectCode: [],
                    text: "",
                }
            });
            if (resHomework && resHomework.data) {
                indexSelected.homework = 0;
                listHomework = resHomework.data;
            }
            if (listHomework.length) {
                const status = {
                    ToDo: 0,
                    Doing: 1,
                    Submit: 2,
                    Done: 3,
                    NotOpen: 4,
                    Paused: 5,
                    TimeOut: 6,
                    TimeOutDontDo: 7,
                };

                const resClass = await apiHomework.getClass({
                    token,
                    classId: listHomework[0].assignmentId,
                    status: status.ToDo,
                    indexPage: 0,
                });
                if (resClass && resClass.data) {
                    indexSelected.class = 0;
                    listClass = resClass.data;
                }
            }

            const params = props.navigation.state.params;
            if (params !== undefined && params.assignId) {
                props.fetchReportAction({
                    token,
                    assignId: props.navigation.state.params.assignId,
                }, 2000);
            } else {
                if (listClass.length) {
                    props.fetchHomework({
                        token,
                        assignId: listClass[0].assignId,
                    });
                } else {
                    props.fetchHomework({
                        token,
                        assignId: '',
                    });
                }
            }

            setData({
                grade: listGrade,
                subject: listSubject,
                homework: listHomework,
                class: listClass,
            });
            setRefresh(false);
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        // await setRefresh(true);
    }

    Global.updateHomeWork = refreshData;
    useEffect(() => {
        fetchData();
        let timeExportTmp = props.data?.data.timeExport;
        timeExportTmp = convertTimeHMDMY(timeExport);
        setTimeExport(timeExportTmp);
    }, []);

    const onClickFillter = () => {
        modalFillter.current.changeStateModale();
    }

    const isShow = !!props.navigation.state.params && props.navigation.state.params.hideBackButtom;
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <HeaderNavigation
                ref={refHeaderNavigation}
                title={'Thống kê bài tập'}
                navigation={props.navigation}
                onRightAction={onClickFillter}
                actionIcon={!isShow ? AppIcon.icons_filter : null}
                isShow={isShow}
            />
            <View style={styles.header}>
                {
                    !isLoading ?
                        _.isEmpty(props.data) ?
                            null
                            : <View style={styles.wrapInfo}>
                                <Text style={styles.txtAssignment}>{props.data?.data.name || ''}</Text>
                                <Text style={styles.txtTitle}>{props.data?.data.className || ''}</Text>
                                {/* <Text style={styles.txtTime}>Kết thúc lúc {timeEnd}</Text> */}
                                <Text style={styles.txtTime}>Hệ thống đang tổng hợp kết quả {timeExport ? `(${timeExport})` : ''}</Text>
                                <Text style={{
                                    fontFamily: 'Nunito-Regular', fontSize: RFFonsize(12), marginHorizontal: 10,
                                    color: '#4EBE3C'
                                }}>Dữ liệu được làm mới lúc: {moment(data.timeRefresh).format('HH:mm DD/MM/YYYY')}</Text>
                            </View>
                        :
                        <View style={styles.wrapInfo}>
                            <ActivityIndicator size={'small'} color={'#2D9CDB'} />
                        </View>
                }
            </View>
            <Tab
                screenProps={{
                    onRefresh: handleStatistic,
                    data: props.data,
                    isLoading: isLoading,
                    isRefresh: isRefresh,
                    refreshData: refreshData,
                    navigation: props.navigation
                }}
            />
            <Toast ref={toast} position={'top'} />
            <ModalFillter
                ref={modalFillter}
                dataGade={data.grade || []}
                dataSubject={data.subject || []}
                dataHomeWork={data.homework}
                dataClass={data.class || []}
                indexSelected={indexSelected}
                onPressItemGrade={(index) => onPressItemGrade(index)}
                onPressItemSubject={(index) => onPressItemSubject(index)}
                onPressItemHomework={(index) => onPressItemHomework(index)}
                onPressItemClass={(index) => onPressItemClass(index)}
                handleStatistic={handleStatistic}
            />
            <TourView ref={refTourView} />
        </SafeAreaView>
    );
}

const mapStateToProps = state => {
    return {
        data: state.homeworkTeacher.data,
        loading: state.homeworkTeacher.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchHomework: (payload) => { dispatch(fetchHomeworkAction(payload)) },
        needUpdate: (payload) => dispatch(updateExamListAction(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkDraScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#FFF',
        paddingTop: HEIGHT_TOPBAR - 10,
        zIndex: 99,
    },
    headerNavigation: {
        flexDirection: 'row',
        paddingVertical: 22,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    txtHeaderNavigation: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(16),
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    labelTab: {
        fontSize: RFFonsize(12),
        fontFamily: 'Nunito-Regular',
        color: '#c4c4c4',
    },
    labelTabActive: {
        fontSize: RFFonsize(11),
        fontFamily: 'Nunito-Bold',
        color: '#56CCF2',
    },
    btnViewStatistic: {
        height: 20,
        backgroundColor: '#fff',
        width: 90,
        borderRadius: 2,
        marginTop: 20,
        alignSelf: 'flex-end',
        marginEnd: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    txtStatistic: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        color: '#2D9CDB',
        borderRadius: 1,
    },
    wrapInfo: {
        marginHorizontal: 20,
        marginBottom: 10,
        minHeight: 50,
        justifyContent: 'center'
    },
    txtAssignment: {
        color: '#2D9CDB',
        fontSize: RFFonsize(18),
        marginLeft: 10,
        fontFamily: 'Nunito-Bold',
        marginBottom: 5,
    },
    txtTitle: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(16),
        color: '#2D9CDB',
        marginLeft: 10,
        marginBottom: 5,
    },
    txtTime: {
        fontFamily: 'Nunito-Regular',
        color: '#828282',
        marginLeft: 10,
        marginBottom: 5,
    },
});
