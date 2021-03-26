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
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../../libs/ProgressBar';
import apiHomework from '../../../services/apiHomeworkTeacher';
import Toast from 'react-native-easy-toast';
import dataHelper from '../../../utils/dataHelper';
import _ from 'lodash';
import { AssignmentContentType } from '../../../utils/Utils';
import Global from '../../../utils/Globals';
import { RFFonsize } from '../../../utils/Fonts';
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
                color: '#828282',
                result: 'Chưa có'
            };
        case 1:
            return {
                title: 'Chưa làm',
                color: '#828282',
                result: 'Chưa có'
            };
        case 2:
            return {
                title: 'Đang làm',
                color: '#828282',
                result: 'Chưa có'
            };
        case 3:
            return {
                title: 'Đang gửi bài',
                color: '#828282',
                result: 'Chưa có'
            };
        case 4:
            let result = (item.point / item.totalPoint) * 10;
            result = result % 1 === 0 ? result : result.toFixed(2);
            return {
                title: 'Đã hoàn thành',
                color: '#55B619',
                // result: `Đã hoàn thành`
            };
        case 6:
            return {
                title: 'Chờ chấm điểm tự luận',
                color: '#828282',
                result: 'Chưa có'
            };
        default:

            return {
                title: 'Chưa làm',
                color: '#828282',
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

function ModalDetail(props) {
    const item = props.data;
    const progress = getProcess(item);
    const status = getStatus(item);
    const point = props.point;

    const goToResult = () => {
        const { assignmentContentType } = props.dataResult.data;
        props.onClose();
        if (assignmentContentType == AssignmentContentType.pdf) {
            props.navigation.navigate('SchoolResultPDF', {
                responseJson: props.dataResult,
                nameTest: item.nameStudent,
                statusbar: 'light-content',
            });
        } else if (assignmentContentType == AssignmentContentType.regular) {
            props.navigation.navigate('HomeWorkResult', {
                responseJson: props.dataResult,
                nameTest: item.nameStudent,
                statusbar: 'light-content',
            });
        }
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => props.onClose()} />
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.viewAvatarModal}>
                                {
                                    item.avatar && !item.avatar.includes('no-avatar')
                                        ?
                                        <Image source={{ uri: item.avatar.indexOf('http') != 0 ? `http:${item.avatar}` : item.avatar }} style={styles.imgAvatarItem} resizeMode={'contain'} />
                                        :
                                        <Text style={styles.txtAvatarModal}>{nameToAvatar(item.nameStudent)}</Text>
                                }
                                <View style={[styles.dotOnlineModal, { backgroundColor: '#E0E0E0' }]} />
                            </View>
                            <View style={styles.contentModal}>
                                <Text style={styles.txtNameModal}>{item.nameStudent}</Text>
                                <View style={styles.viewContentModal}>
                                    <View>
                                        <Text style={styles.txtTitleItem}>Mức độ hoàn thành</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                            <Text style={styles.txtProcess}>{item.point}/{item.totalPoint}</Text>
                                            <View style={{ width: 1, height: 14, backgroundColor: '#D0EFF9' }} />
                                            <Text style={styles.txtPercentProcess}>{Number.parseFloat(progress).toFixed(2)}%</Text>
                                        </View>
                                    </View>
                                    <View style={styles.viewResult} />
                                    <View>
                                        <Text style={styles.txtTitleItem}>Điểm số</Text>
                                        <Text style={[styles.txtPoint, { marginTop: 2 }]}>{point}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: 25 }}
                            data={Object.values(item.questionResult)}
                            numColumns={5}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                const colors = ['#B1D8EE', '#4EBE3C', '#FF3D3D'];
                                return (
                                    <View style={{
                                        marginHorizontal: 8,
                                        marginBottom: 6,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: item > -1 && item < 3 ? colors[item] : colors[0]
                                    }} />
                                )
                            }}
                        />
                        <TouchableOpacity
                            onPress={goToResult}
                        >
                            <Text style={[styles.txtBtn, { fontSize: 14, color: '#000' }]}>Xem kết quả</Text>
                        </TouchableOpacity>
                        <View style={styles.viewOptionModal}>
                            <TouchableOpacity
                                onPress={() => props.onRetryPoint(item.studentId)}
                                style={[styles.btnChamlai, { borderRadius: 4, paddingHorizontal: 12, alignItems: 'center', height: 30 }]}>
                                <Image source={require('../../../asserts/icon/ic_chamlai.png')} />
                                <Text style={[styles.txtBtn, { fontSize: RFFonsize(14) }]}>Chấm lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => props.onRework(item.studentId)}
                                style={[styles.btnLamlai, { borderRadius: 4, paddingHorizontal: 12, alignItems: 'center', height: 30 }]}>
                                <Image source={require('../../../asserts/icon/ic_lamlai.png')} />
                                <Text style={[styles.txtBtn, { fontSize: RFFonsize(14) }]}>Làm lại</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => props.onClose()} />
                </View>
            </Modal>
        </View >
    )
}

export default function StudentDetail(props) {
    const toast = useRef();

    const [dataDetail, setDetail] = useState(null);
    const [point, setPoint] = useState(0);
    const [dataResult, setDataResult] = useState(null);

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
            'Thông báo',
            'Bạn có chắc chắn cho học sinh này làm lại?',
            [
                { text: 'Không', onPress: () => { }, style: 'cancel' },
                {
                    text: 'Có', onPress: async () => {
                        if (dataDetail) {
                            setDetail('');
                        }
                        const res = await rework({ assignId: props.screenProps?.data?.data.assignId, studentId });
                        if (!res) {
                            props.screenProps.onRefresh();
                            setTimeout(() => {
                                toast.current.show('Yêu cầu làm lại thành công!');
                                props.screenProps.navigation.pop(2);
                            }, 500)
                        } else {
                            // Global.updateHomeWork();
                            // toast.current.show(res);
                            Alert.alert('Thông báo', res);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const detailStudent = async (item) => {
        const { token } = await dataHelper.getToken();
        const response = await apiHomework.getStudentDetail({ token, assignId: props.screenProps?.data?.data.assignId, studentId: item.studentId })
        setPoint(response.data.totalScore);
        setDetail(item);
        setDataResult(response);
    }

    const renderItem = ({ item, index }) => {
        console.log("🚀 ~ file: StudentDetail.js ~ line 291 ~ renderItem ~ item", item)
        const progress = getProcess(item);
        const status = getStatus(item, point);
        return (
            <View style={[styles.containerItem, { marginTop: index === 0 ? 16 : 0 }]}>
                <View style={styles.viewAvatar}>
                    {
                        item.avatar && !item.avatar.includes('no-avatar')
                            ?
                            <Image source={{ uri: item.avatar.indexOf('http') != 0 ? `http:${item.avatar}` : item.avatar }} style={styles.imgAvatarItem} resizeMode={'contain'} />
                            :
                            <Text style={styles.txtAvatar}>{nameToAvatar(item.nameStudent)}</Text>
                    }
                    <View style={[styles.dotOnline, { backgroundColor: '#E0E0E0' }]} />
                </View>
                <View style={styles.contentItem}>
                    <Text style={[styles.txtStatus, { color: status.color }]}>{status.title}</Text>
                    <Text style={styles.txtNameItem}>{item.nameStudent}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <View>
                            <ProgressBar
                                progress={progress || 1}
                                height={4}
                                color='#2D9CDB'
                                widthProps={width - 180}
                                progressUnfilledColor='#C4C4C4'
                            />
                        </View>
                        <Text style={[styles.txtProcess, { flex: 1, textAlign: 'right', marginEnd: 8 }]}>{Number.parseFloat(progress).toFixed(2)}%</Text>
                    </View>
                    <View style={styles.viewContent}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={styles.txtTitleItem}>Hoàn thành</Text>
                            <Text style={[styles.txtProcess, { marginStart: 5 }]} numberOfLines={1}>{item.point}/{item.totalPoint}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginEnd: 7 }}>
                            <Text style={styles.txtTitleItem}>Kết quả bài tập</Text>
                            <Text style={styles.txtPoint}>{status.result}</Text>
                            {
                                item.status === 4
                                    ?
                                    <View style={styles.viewOption}>
                                        {/* <TouchableOpacity
                            onPress={() => handleRework(item.studentId)}
                            style={styles.btnLamlai}>
                            <Image source={require('../../../asserts/icon/ic_lamlai.png')} style={styles.icRemake} />
                            <Text style={styles.txtNew}>Làm lại</Text>
                        </TouchableOpacity> */}
                                        <TouchableOpacity style={styles.btnDetail}
                                            onPress={() => { detailStudent(item) }}>
                                            <Text style={styles.txtDetail}>Chi tiết</Text>
                                            <Ionicons
                                                name='ios-arrow-forward'
                                                color='#DB422D'
                                                size={14}
                                                style={{ marginStart: 5 }}
                                            />
                                        </TouchableOpacity>

                                    </View>
                                    : null
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
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
                            {
                                dataDetail ? <ModalDetail
                                    onRetryPoint={(studentId) => handleRetryCheckPoint(studentId)}
                                    onRework={(studentId) => handleRework(studentId)}
                                    data={dataDetail}
                                    dataResult={dataResult}
                                    onClose={() => setDetail(null)}
                                    point={point}
                                    navigation={props.screenProps.navigation}
                                /> : null
                            }
                        </View>)
            }
            <Toast ref={toast} position={'center'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerItem: {
        borderRadius: 2,
        borderColor: '#56CCF2',
        borderWidth: 0.5,
        margin: 16,
        flexDirection: 'row',
        paddingVertical: 5
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
        marginStart: 11,
        flex: 1
    },
    txtStatus: {
        position: 'absolute',
        top: 0,
        right: 6,
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10)
    },
    txtNameItem: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        color: '#000'
    },
    viewContent: {
        flexDirection: 'row',
        marginTop: 4
    },
    txtTitleItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#828282'
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
        marginStart: 12
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
    }
})
