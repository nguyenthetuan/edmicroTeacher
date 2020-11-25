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

export default class ModalOption extends PureComponent {

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
                                                source={require('../../../asserts/icon/icDetail.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Chi tiết</Text>
                                        </View>
                                    </RippleItem>
                                    {assignmentContentType !== 1 && (
                                        <RippleItem onPress={this.props._handleClickDetail(2)}>
                                            <View style={styles.wrapElementModal}>
                                                <Image
                                                    source={require('../../../asserts/icon/icBackup.png')}
                                                />
                                                <Text style={styles.txtModalDetail}>Tạo bản sao</Text>
                                            </View>
                                        </RippleItem>
                                    )}
                                    <RippleItem onPress={() => this.props._OpenModal(3)}>
                                        <View style={styles.wrapElementModal}>
                                            <Image
                                                source={require('../../../asserts/icon/icEditName.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Sửa tên</Text>
                                        </View>
                                    </RippleItem>
                                    <RippleItem onPress={() => this.props._OpenModal(4)}>
                                        <View style={styles.wrapElementModal}>
                                            <Image
                                                source={require('../../../asserts/icon/icConfig.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Sửa cấu hình</Text>
                                        </View>
                                    </RippleItem>
                                    {dataSelected && dataSelected.status !== 4 && (
                                        <RippleItem onPress={this.props.deletePaper}>
                                            <View style={styles.wrapElementModal}>
                                                <Image
                                                    source={require('../../../asserts/icon/icDelete.png')}
                                                />
                                                <Text style={styles.txtModalDetail}>Xoá bài tập</Text>
                                            </View>
                                        </RippleItem>
                                    )}
                                    <RippleItem onPress={this.props._handleClickDetail(4)}>
                                        <View style={styles.wrapElementModal}>
                                            <Image
                                                source={require('../../../asserts/icon/icRegistration.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Giao bài tập</Text>
                                        </View>
                                    </RippleItem>
                                    <RippleItem onPress={this.props._handleClickDetail(7)}>
                                        <View style={styles.wrapElementModal}>
                                            <Image
                                                source={require('../../../asserts/icon/icMarkingPoint.png')}
                                            />
                                            <Text style={styles.txtModalDetail}>Chấm điểm</Text>
                                        </View>
                                    </RippleItem>
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
        fontSize: 14,
        fontFamily: 'Nunito-Regular',
        marginLeft: 25,
    },
});