import React, { useEffect, useState, useRef } from 'react';
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
    ActivityIndicator,
    Alert,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';
import * as Progress from 'react-native-progress';
import ProgressBar from '../../libs/ProgressBar';
import apiHomework from '../../../services/apiHomeworkTeacher';
import Toast from 'react-native-easy-toast';
import dataHelper from '../../../utils/dataHelper';
import _ from 'lodash';
import { AssignmentContentType } from '../../../utils/Utils';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';
import ToastSuccess from '../../common-new/ToastSuccess';
import ToastFaild from '../../common-new/ToastFaild';
import FastImage from 'react-native-fast-image'
import ProgressRefresh from './ProgressRefresh';
import Global from '../../../utils/Globals';
const { width, height } = Dimensions.get('window');

const nameToAvatar = (name) => {
    return name.toUpperCase().split(' ').splice(0, 2)
        .map(item => item.split('').splice(0, 1)).join('');;
}

const getProcess = (item) => {
    if (!item.totalPoint) {
        return 0;
    }
    return (item.point / item.totalPoint) * 100;
}

const getStatus = (item, point) => {
    switch (item.status) {
        case 0:
            return {
                title: 'Chưa làm',
                color: '#fff',
                backgroundColor: "#FF6213",
                result: 'Chưa có'
            };
        case 1:
            return {
                title: 'Chưa làm',
                color: '#fff',
                backgroundColor: "#FF6213",
                result: 'Chưa có'
            };
        case 2:
            return {
                title: 'Đang làm',
                color: '#fff',
                backgroundColor: '#2D9CDB',
                result: 'Chưa có'
            };
        case 3:
            return {
                title: 'Đang gửi bài',
                color: '#fff',
                backgroundColor: "#FF6213",
                result: 'Chưa có'
            };
        case 4:
            let result = (item.point / item.totalPoint) * 10;
            result = result % 1 === 0 ? result : result.toFixed(2);
            return {
                title: 'Hoàn thành',
                color: '#fff',
                backgroundColor: '#4EBE3B',
                borderRadius: 10
                // result: `Đã hoàn thành`
            };
        case 6:
            return {
                title: 'Chờ chấm điểm',
                color: '#fff',
                backgroundColor: "#d89a29",
                result: 'Chưa có'
            };
        default:

            return {
                title: 'Chưa làm',
                color: '#fff',
                backgroundColor: "#FF6213",
                result: 'Chưa có'
            };
    }
}

const retryCheckPoint = async ({ assignId, studentId }) => {
    const { token } = await dataHelper.getToken();
    if (token) {
        const response = await apiHomework.retryCheckPoint({
            token,
            assignId,
            studentId
        });
        if (response && response.status === 1) {
            return '';
        } else {
            return response.message;
        }
    }
    return 'Có lỗi xảy ra vui lòng thử lại!';
}

const rework = async ({ assignId, studentId }) => {
    const { token } = await dataHelper.getToken();
    if (token) {
        const response = await apiHomework.rework({
            token,
            assignId,
            studentId
        });
        if (response && response.data) {
            return '';
        } else {
            return response.message
        }
    }
    return 'Có lỗi xảy ra vui lòng thử lại!';
}

export default function StudentDetail(props) {
    const toast = useRef();

    const [dataDetail, setDetail] = useState(null);
    const [point, setPoint] = useState(0);
    const [dataResult, setDataResult] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const handleRetryCheckPoint = async (studentId) => {
        if (dataDetail) {
            setDetail('');
        }
        const res = await retryCheckPoint({ assignId: props.screenProps?.data?.data.assignId, studentId });
        if (!res) {
            props.screenProps.onRefresh();
            setTimeout(() => {
                toast.current.show('Yêu cầu chấm lại thành công!');
            }, 500)
        } else {
            toast.current.show(res);
        }
    }

    const handleRework = (studentId) => {
        Alert.alert(
            '',
            'Bạn có chắc chắn cho học sinh này làm lại?',
            [
                {
                    text: 'Có', onPress: handleReworkCallApi(studentId)
                },
                { text: 'Không', onPress: () => { } },
            ],
            { cancelable: false }
        );
    }

    const handleReworkCallApi = (studentId) => async () => {
        if (dataDetail) {
            setDetail('');
        }
        const res = await rework({ assignId: props.screenProps?.data?.data.assignId, studentId });
        if (!res) {
            props.screenProps.refreshData();
            toast.current.show(<ToastSuccess title={'Yêu cầu làm lại bài tập thành công!'} />, 3000);
        } else {
            // Global.updateHomeWork();
            // toast.current.show(res);
            toast.current.show(<ToastFaild title={res} />, 3000);
        }
    }

    Global.handleRework = handleReworkCallApi;

    const goToResult = item => async () => {
        setisLoading(true);
        const { token } = await dataHelper.getToken();
        const response = await apiHomework.getStudentDetail({ token, assignId: props.screenProps?.data?.data.assignId, studentId: item.studentId });
        setDataResult(response);
        const { assignmentContentType } = response.data;
        setisLoading(false);
        if (assignmentContentType == AssignmentContentType.pdf) {
            props.screenProps.navigation.navigate('SchoolResultPDF', {
                responseJson: response,
                nameTest: item.nameStudent,
                statusbar: 'light-content',
                studentId: item.studentId
            });
        } else if (assignmentContentType == AssignmentContentType.regular) {
            props.screenProps.navigation.navigate('HomeWorkResult', {
                responseJson: response,
                nameTest: item.nameStudent,
                statusbar: 'light-content',
            });
        }
    }

    const getScore = (point, totalPoint) => {
        if (totalPoint == 0) return '';
        try {
            return (point / totalPoint * 10).toFixed(1);
        } catch (error) {
            return '';
        }
    }

    const onNavigate = (item) => {
        const { status } = item;
        const assignmentId = props.screenProps?.data?.data.assignmentId;
        const name = props.screenProps?.data?.data.name;
        const dataSelected = { assignmentId, name };
        switch (status) {
            case 6:
                props.screenProps.navigation.navigate('MarkingView', {
                    item: dataSelected,
                    statusbar: 'light-content'
                });
                return;
            default:
                return;

        }
    }

    const renderItem = ({ item, index }) => {
        const progress = getProcess(item);
        const status = getStatus(item, point);
        const { shadowBtn } = shadowStyle;
        return (
            <View style={[styles.containerItem, { marginTop: index === 0 ? 5 : 0 }, shadowBtn]}>
                <View style={styles.viewAvatar}>
                    {
                        item.avatar && !item.avatar.includes('no-avatar')
                            ?
                            <FastImage source={{ uri: item.avatar.indexOf('http') != 0 ? `http:${item.avatar}` : item.avatar }} style={styles.imgAvatarItem} resizeMode={'contain'} />
                            :
                            <Text style={styles.txtAvatar}>{nameToAvatar(item.nameStudent)}</Text>
                    }
                </View>
                <View style={styles.contentItem}>
                    <TouchableWithoutFeedback onPress={() => onNavigate(item)}>
                        <View style={[styles.bgStatus, { backgroundColor: status.backgroundColor }]}>
                            <Text style={[styles.txtStatus,
                            { color: status.color }]}>
                                {status.title}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={styles.txtNameItem}>{item.nameStudent}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <View>
                            <ProgressBar
                                progress={progress || 1}
                                height={4}
                                color='#2D9CDB'
                                widthProps={width - 200}
                                progressUnfilledColor='#C4C4C4'
                            />
                        </View>
                        <Text style={[styles.txtProcess, { flex: 1, textAlign: 'right', marginEnd: 20 }]}>{Number.parseFloat(progress).toFixed(2)}%</Text>
                    </View>
                    <View style={styles.viewContent}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={styles.txtTitleItem}>Hoàn thành</Text>
                            <Text style={[styles.txtProcess, { marginStart: 5 }]} numberOfLines={1}>{item.point}/{item.totalPoint}</Text>
                        </View>

                    </View>
                    {
                        item.status == 4 ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableWithoutFeedback onPress={() => handleRework(item.studentId)} >
                                    <View style={[styles.remakeWork, { ...shadowBtn }]}>
                                        <Text style={styles.txtRemake}>Làm lại</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 5 }}>
                                    <Text style={styles.txtTitleItem}>Kết quả</Text>
                                    <Text style={styles.txtPoint}>{status.result}</Text>
                                    {
                                        item.status === 4
                                            ?
                                            <View style={styles.viewOption}>
                                                <View style={{ flexDirection: 'row', paddingRight: 17 }}>
                                                    <Text style={styles.pointNew}>{getScore(item.point, item.totalPoint)}</Text>
                                                    <Text style={styles.pointNew}>Điểm</Text>
                                                </View>
                                            </View>
                                            : null}
                                </View>
                            </View>
                            : null
                    }
                </View>
                {
                    item.status == 4 && 2
                        ?
                        <TouchableWithoutFeedback
                            onPress={goToResult(item)}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <ActivityIndicator style={{ alignSelf: 'center', right: 10 }} />
                                : <Image source={require('../../../asserts/icon/icon_rightStud.png')}
                                    style={{ alignSelf: 'center', right: 12 }} />
                            }
                        </TouchableWithoutFeedback>
                        : <Image source={require('../../../asserts/icon/icon_rightStud.png')}
                            style={{ alignSelf: 'center', right: 12, opacity: 0 }} />
                }
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ProgressRefresh isRefresh={props.screenProps.isRefresh} />
            {
                props.screenProps.isLoading
                    ? <ActivityIndicator size='small' color='#04C6F1' />
                    :
                _.isEmpty(props.screenProps.data) ?
                    (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../../asserts/icon/iconNodata.png')} />
                            <Text style={{ color: '#828282', fontFamily: 'Nunito-Regular', marginTop: 30 }}>Không đủ dữ liệu thống kê</Text>
                        </View>
                    )
                    : (<View style={styles.container}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={!_.isEmpty(props.screenProps.data) ? props.screenProps?.data?.data.students : []}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={props.data}
                            renderItem={renderItem}
                        />
                    </View>)


            }
            <Toast ref={toast} position={'top'} style={{ backgroundColor: 'transparent' }} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerItem: {
        backgroundColor: '#fff',
        borderRadius: 2,
        margin: 16,
        flexDirection: 'row',
        paddingVertical: 12
    },
    viewAvatar: {
        alignSelf: 'center',
        marginLeft: 10,
        width: 55,
        height: 55,
        borderRadius: 28,
        backgroundColor: '#56CCF2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtAvatar: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(20),
        color: '#fff'
    },
    dotOnline: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 7,
        height: 7,
        borderRadius: 4
    },
    contentItem: {
        paddingHorizontal: 11,
        flex: 1,
    },
    txtStatus: {
        // position: 'absolute',
        // top: 0,
        // right: 6,
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    txtNameItem: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        color: '#000'
    },
    viewContent: {
        flexDirection: 'row',
        marginTop: 4,
        paddingRight: 15
    },
    txtTitleItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#828282',
        marginLeft: 5,
        alignSelf: 'center'
    },
    btnLamlai: {
        marginStart: 23,
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 1,
        backgroundColor: '#F49A31',
        borderRadius: 4,
        marginEnd: 6,
    },
    btnChamlai: {
        flexDirection: 'row',
        paddingHorizontal: 3,
        paddingVertical: 1,
        backgroundColor: '#56CCF2',
        borderRadius: 2
    },
    txtBtn: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#fff',
        textAlign: 'center',
        marginStart: 4
    },
    txtNew: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#fff',
        textAlign: 'center',
        alignSelf: 'center',
        marginLeft: 5,
        marginTop: 3,
        marginBottom: 3,
        marginRight: 3
    },
    icRemake: {
        alignSelf: 'center'
    },
    btnDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8
    },
    txtDetail: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#DB422D',
        textAlign: 'center'
    },
    txtProcess: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(9),
        flex: 1,
        color: '#2D9CDB',
    },
    txtPercentProcess: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#2D9CDB',
        flex: 1,
        textAlign: 'right'
    },
    viewResult: {
        width: 1,
        height: 30,
        backgroundColor: '#D0EFF9',
        marginHorizontal: 15
    },
    txtPoint: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#DB422D',
        textAlign: 'center',
        marginStart: 5
    },
    viewOption: {
        flexDirection: 'row',
        marginTop: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // justifyContent: 'space-between'
    },
    modalView: {
        margin: 16,
        backgroundColor: "white",
        borderRadius: 5,
        alignItems: "center"
    },
    viewAvatarModal: {
        marginTop: 19,
        marginLeft: 23,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#56CCF2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtAvatarModal: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(28),
        color: '#fff'
    },
    contentModal: {
        marginStart: 30,
        marginTop: 30,
        flex: 1
    },
    txtNameModal: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        color: '#000'
    },
    viewContentModal: {
        flexDirection: 'row',
        marginTop: 16
    },
    dotOnlineModal: {
        width: 11,
        height: 11,
        borderRadius: 6,
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    viewOptionModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 18
    },
    imgAvatarItem: {
        width: 55,
        height: 55,
        borderRadius: 28
    },
    bgStatus: {
        alignSelf: 'flex-end',
        backgroundColor: '#FF6213',
        borderRadius: 10
    },
    remakeWork: {
        backgroundColor: '#FF6213',
        paddingHorizontal: 25,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        marginTop: 7,
        borderRadius: 4
    },
    txtRemake: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(10),
        lineHeight: RFFonsize(14),
        alignSelf: 'center',
        color: '#fff'
    },
    pointNew: {
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        paddingHorizontal: 3,
        color: "#DB422D",
        alignSelf: 'center'
    }
})
