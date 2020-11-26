import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Modal,
    Text,
    Platform,
    Dimensions,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import _ from 'lodash';

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
                animationType={'fade'}>
                <View
                    style={styles.containerModal}>
                    <View style={styles.contentModal}>
                        <View style={styles.topModal}>
                            <Text style={styles.txtTitleModal}>Tạo bộ đề</Text>
                            <View style={{ position: 'absolute', right: 5, top: 3 }}>
                                <RippleButton onPress={this.props.closeModal}>
                                    <Image
                                        source={require('../../../asserts/icon/icCloseModal.png')}
                                        style={{ height: 22, width: 22 }}
                                    />
                                </RippleButton>
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
                            <View style={styles.buttomMoadal}>
                                <RippleButton onPress={this.props.onPress}>
                                    <View style={styles.buttomMoadal}>
                                        <Image
                                            source={require('../../../asserts/icon/cloud.png')}
                                        />
                                        <Text style={styles.txtUpload}>Từ câu hỏi có sẵn</Text>
                                    </View>
                                </RippleButton>
                            </View>

                            <View style={styles.buttomMoadal}>
                                <RippleButton onPress={this.props.onPressCopy}>
                                    <View style={styles.buttomMoadal}>
                                        <Image
                                            source={require('../../../asserts/icon/icon-saochepbode.png')}
                                        />
                                        <Text style={styles.txtUpload}>Bộ đề có sẵn</Text>
                                    </View>
                                </RippleButton>
                            </View>
                            <View style={styles.buttomMoadal}>
                                <RippleButton onPress={this.props.onPressUploadPDF}>
                                    <View style={styles.buttomMoadal}>
                                        <Image
                                            source={require('../../../asserts/icon/dowload.png')}
                                        />
                                        <Text style={styles.txtUpload}>Upload file .PDF</Text>
                                    </View>
                                </RippleButton>
                            </View>
                        </View>
                    </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    topModal: {
        backgroundColor: '#7E96EC',
        paddingVertical: 5,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    txtTitleModal: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        color: '#FFF',
        textTransform: 'uppercase',
    },
    bodyModal: {
        marginTop: 10,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        // borderBottomWidth: 1,
        // borderBottomColor: '#DCDCDC',
        borderRadius: 1,
    },
    txtUpload: {
        fontFamily: 'Nunito-Regular',
        fontSize: 12,
        color: '#828282',
        marginTop: 8,
    },
    textTilteModal: {
        fontFamily: 'Nunito-Regular',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
});