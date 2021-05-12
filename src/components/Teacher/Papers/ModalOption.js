import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Modal,
    Text,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import RippleItem from '../../common-new/RippleItem';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import { RFFonsize } from '../../../utils/Fonts';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
export default class ModalOption extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            totalUserDoing: 0,
        }
    }
    async componentDidUpdate() {
        const { dataSelected } = this.props;
        const assignmentId = dataSelected.assignmentId;
        try {
            const { token } = await dataHelper.getToken();
            const response = await Api.getListClassAssigment({ token, assignmentId });
            this.setState({
                totalUserDoing: response?.data[0]?.totalUserDoing,
            });
        } catch (error) { }
    }

    openModal = () => {
        alert(1);
    }

    render() {
        const { visibleEdit, animation, assignmentContentType, dataSelected } = this.props;
        return (
            <Modal visible={visibleEdit} transparent={true}>
                <TouchableWithoutFeedback onPressOut={this.props._handleCloseModal}>
                    <View style={styles.containerModal}>
                        <TouchableWithoutFeedback>
                            <Animatable.View
                                style={styles.wrapModal}
                                animation={animation}
                                duration={500}>
                                <View>
                                    <RippleItem onPress={this.props._handleClickDetail(1)}>
                                        <View style={styles.wrapElementModal}>
                                            <Image
                                                source={require('../../../asserts/icon/icon_optionDetail.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Chi tiết</Text>
                                        </View>
                                    </RippleItem>
                                    {assignmentContentType !== 1 && (
                                        <>
                                            <View style={styles.hr} />
                                            <RippleItem onPress={this.props._handleClickDetail(2)}>
                                                <View style={styles.wrapElementModal}>
                                                    <Image
                                                        source={require('../../../asserts/icon/icon_optionCopy.png')}
                                                    />
                                                    <Text style={styles.txtModalDetail}>Tạo bản sao</Text>
                                                </View>
                                            </RippleItem>
                                        </>
                                    )}
                                    <View style={styles.hr} />
                                    <RippleItem onPress={() => this.props._OpenModal(3)}>
                                        <View style={styles.wrapElementModal}>
                                            <Image
                                                source={require('../../../asserts/icon/icon_optionEdit.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Sửa tên</Text>
                                        </View>
                                    </RippleItem>
                                    {/* {!this.state.totalUserDoing && <RippleItem onPress={() => this.props._OpenModal(4)}> */}
                                    {true && <RippleItem onPress={() => this.props._OpenModal(4)}>
                                        <>
                                            <View style={styles.hr} />
                                            <View style={styles.wrapElementModal}>
                                                <Image
                                                    source={require('../../../asserts/icon/icon_optionSetting.png')}
                                                />
                                                <Text style={styles.txtModalDetail}>Sửa cấu hình</Text>
                                            </View>
                                        </>
                                    </RippleItem>}
                                    {dataSelected && dataSelected.status !== 4 && (
                                        <>
                                            <View style={styles.hr} />
                                            <RippleItem onPress={this.props.deletePaper}>
                                                <View style={styles.wrapElementModal}>
                                                    <Image
                                                        source={require('../../../asserts/icon/icon_optionDelete.png')}
                                                    />
                                                    <Text style={styles.txtModalDetail}>Xóa bài tập</Text>
                                                </View>
                                            </RippleItem>
                                        </>
                                    )}
                                    <View style={styles.hr} />
                                    <RippleItem onPress={this.props._handleClickDetail(4)}>
                                        <View style={styles.wrapElementModal}>
                                            <Image
                                                source={require('../../../asserts/icon/icon_optionSendPaper.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Giao bài tập</Text>
                                        </View>
                                    </RippleItem>
                                    {dataSelected?.countCheckPoint > 0 &&
                                        <>
                                            <View style={styles.hr} />
                                            <RippleItem onPress={this.props._handleClickDetail(7)}>
                                                <View style={styles.wrapElementModal}>
                                                    <Image
                                                        source={require('../../../asserts/icon/icMarkingPoint.png')}
                                                    />
                                                    <Text style={styles.txtModalDetail}>Chấm điểm ({dataSelected.countCheckPoint} bài)</Text>
                                                </View>
                                            </RippleItem>
                                        </>
                                    }
                                </View>
                            </Animatable.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    containerModal: {
        height: 200,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Platform.select({
            ios: 'rgba(0,0,0,0.3)',
            android: 'rgba(0,0,0,0.6)',
        }),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        elevation: 24,
        zIndex: 10,
    },
    wrapModal: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        paddingVertical: 23,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,

        elevation: 24,
    },
    wrapElementModal: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    txtModalDetail: {
        fontSize: RFFonsize(14),
        fontFamily: 'Nunito-Regular',
        marginLeft: 25,
    },
    hr: {
        backgroundColor: '#DADADA',
        height: 0.5
    }
});