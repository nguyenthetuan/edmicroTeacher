import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    Platform,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import Modal from 'react-native-modal';
import RippleButton from '../../common-new/RippleButton';
import _ from 'lodash';
import { RFFonsize } from '../../../utils/Fonts';
import ZoomAnim from '../../anim/ZoomAnim';

const { width, height } = Dimensions.get('window');

export default class ModalAddPaper extends PureComponent {
    render() {
        const {
            visibleModalAdd,
        } = this.props;
        return (
            <Modal
                visible={visibleModalAdd}
                transparent={true}
                style={{ margin: 0, padding: 0 }}
                animationType={'none'}>
                <View
                    style={styles.containerModal}>
                    <ZoomAnim>
                        <View style={styles.contentModal}>
                            <View style={styles.topModal}>
                                <Text style={styles.txtTitleModal}>Tạo bộ đề</Text>
                                <View style={{ position: 'absolute', right: 5, top: 3 }}>
                                    <TouchableWithoutFeedback hitSlop={{
                                        left: 10, right: 10
                                    }} onPress={this.props.closeModal} >
                                        <Image
                                            source={require('../../../asserts/icon/icCloseModal.png')}
                                            style={{ height: 22, width: 22 }}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            <Text style={styles.textTilteModal}>Hãy chọn loại bộ đề muốn tạo</Text>
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <Image
                                    source={require('../../../asserts/icon/icPersonModalCloud.png')}
                                    style={{ width: width * 0.5, height: width * 0.26 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles.bodyModal}>
                                <View style={styles.flexOption}>
                                    <RippleButton onPress={this.props.onPress}>
                                        <View style={styles.columnAdd}>
                                            <Image
                                                source={require('../../../asserts/icon/cloud.png')}
                                            />
                                            <Text style={styles.txtUpload}>Từ câu hỏi có sẵn</Text>
                                        </View>
                                    </RippleButton>
                                    <RippleButton onPress={this.props.onPressCopy}>
                                        <View style={styles.columnAdd}>
                                            <Image
                                                source={require('../../../asserts/icon/icon-saochepbode.png')}
                                            />
                                            <Text style={styles.txtUpload}>Bộ đề có sẵn</Text>
                                        </View>
                                    </RippleButton>
                                </View>

                                <View style={styles.flexOption}>
                                    <RippleButton onPress={this.props.onPressUploadPDF}>
                                        <View style={styles.columnAdd}>
                                            <Image
                                                source={require('../../../asserts/icon/dowload.png')}
                                            />
                                            <Text style={styles.txtUpload}>Upload file .PDF</Text>
                                        </View>
                                    </RippleButton>
                                    <RippleButton onPress={this.props.onPressCamera}>
                                        <View style={styles.columnAdd}>
                                            <Image
                                                source={require('../../../asserts/icon/icon_paperCamera.png')}
                                                style={{ tintColor: '#2D9CDB' }}
                                            />
                                            <Text style={styles.txtUpload}>Tạo bộ đề bằng camera</Text>
                                        </View>
                                    </RippleButton>
                                </View>
                            </View>
                        </View>
                    </ZoomAnim>
                </View>
            </Modal>
        );
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
    contentModal: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        borderRadius: 5,
        overflow: 'hidden',
        paddingBottom: 15,
    },
    buttomMoadal: {
        flex: 1
    },
    columnAdd: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    topModal: {
        backgroundColor: '#7E96EC',
        paddingVertical: 5,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    txtTitleModal: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        color: '#FFF',
        textTransform: 'uppercase',
    },
    bodyModal: {
        marginTop: 20,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        borderRadius: 1,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    txtUpload: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(14),
        color: '#828282',
        marginTop: 8,
    },
    textTilteModal: {
        fontFamily: 'Nunito',
        fontWeight: '700',
        color: '#828282',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    flexOption: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});