import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Image,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import Api from '../../../services/apiExamHelper';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/Common';
import _ from 'lodash';
import { RFFonsize } from '../../../utils/Fonts';
import ItemInfo from '../../modals/ItemInfo';
import ZoomAnim from '../../anim/ZoomAnim';
const { width, height } = Dimensions.get('window');
export default class ModalMockExamStart extends Component {
    constructor(props) {
        super(props);
        const { visible } = this.props;
        this.state = {
            visible: visible,
            data: {},
            isLoading: false
        };
    }

    activeModal = (data) => {
        this.setState(
            {
                visible: true,
                isLoading: true
            },
            () => this.getInforMockExam(data),
        );
    };

    hideModal = () => {
        this.setState({ visible: false, data: {}, isLoading: false });
    };

    getInforMockExam = async (data) => {
        try {
            const { token } = await dataHelper.getToken();
            const response = await Api.testInfo(token, data._id);
            if (response && response.testId) {
                this.setState({ data: response, isLoading: false });
            } else {
                throw 'Có lỗi xảy ra';
            }
        } catch (error) {
            Alert.alert(
                '',
                'Có lỗi xảy ra. Vui lòng thử lại sau',
                [
                    { text: 'Thoát', onPress: this.hideModal }
                ]
            );
        }
    };

    _startMockExam = async () => {
        const { testId, status } = this.state.data;
        if (status == 0) {
            const { token } = await dataHelper.getToken();
            await Api.testStart(token, testId);
        }
        this.hideModal();
        this.props.navigation.navigate('MissonTestPlayWebView', { testId, statusbar: 'dark-content' });
    };

    render() {
        const { visible, data, isLoading } = this.state;
        return (
            <Modal visible={visible} transparent={true}>
                <TouchableWithoutFeedback
                    onPress={() => this.setState({ visible: false })}>
                    <View style={styles.container}>
                        <TouchableWithoutFeedback>
                            <ZoomAnim>
                                <View>
                                    <View style={styles.body}>
                                        {!_.isEmpty(data) && !isLoading ? (
                                            <>
                                                <Text style={styles.name}>{data.title}</Text>
                                                <ItemInfo number={data.countQuestion} type={'Total'} />
                                                {data.duration ? (
                                                    <View style={styles.wrapTime}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                            }}>
                                                            <Image
                                                                source={require('../../../asserts/appIcon/iconClock.png')}
                                                            />
                                                            <Text style={styles.txtTime}>
                                                                Thời gian làm bài
                                                        </Text>
                                                        </View>
                                                        <View style={[styles.stylLine, { width: '40%' }]} />
                                                        <Text style={styles.time}>
                                                            {Common.roundNumber(data.duration / 60)} phút
                                                    </Text>
                                                    </View>
                                                ) : null}
                                                <View style={styles.wrapTime}>
                                                    <TouchableOpacity
                                                        onPress={() => this._startMockExam()}
                                                        style={styles.btnStart}>
                                                        <Text style={styles.txtButon}>
                                                            {/* {data.status == 0 ? 'Bắt đầu' : 'Tiếp tục'} */}
                                                        Làm thử
                                                    </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({ visible: false })}
                                                        style={styles.btnBack}>
                                                        <Text style={styles.txtButon}>Quay lại</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        ) : (
                                                <ActivityIndicator color="blue" />
                                            )}
                                    </View>
                                </View>
                            </ZoomAnim>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    body: {
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
        padding: 13,
    },
    name: {
        fontSize: RFFonsize(18),
        fontFamily: 'Nunito-Regular',
        color: '#2D9CDB',
        fontWeight: 'bold',
    },
    message: {
        textAlign: 'center',
        marginTop: 7,
        color: '#828282',
    },
    sum: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        fontWeight: 'bold',
        color: '#FDC214',
    },
    time: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        fontWeight: 'bold',
        color: '#2D9CDB',
    },
    txtButon: {
        fontSize: RFFonsize(14),
        fontFamily: 'Nunito-Regular',
        color: '#fff',
        fontWeight: 'bold',
    },
    stylLine: {
        height: 1,
        borderWidth: 1,
        borderStyle: 'dotted',
        borderColor: '#69D8FC',
        width: '50%',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
        marginBottom: 5,
    },
    wrapTime: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 23,
    },
    btnStart: {
        height: 30,
        backgroundColor: '#55B619',
        borderRadius: 5,
        // paddingHorizontal: 50,
        paddingVertical: 5,
        width: 0.4 * width,
        alignItems: 'center'
    },
    btnBack: {
        height: 30,
        backgroundColor: '#F98E2F',
        borderRadius: 5,
        // paddingHorizontal: 50,
        width: 0.4 * width,
        alignItems: 'center',
        paddingVertical: 5,
    },
    txtTime: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        marginLeft: 9,
    },
});
