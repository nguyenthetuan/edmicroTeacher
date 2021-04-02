import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import UploadPDFComp from './UploadPDFComp';
import AppIcon from '../../../../utils/AppIcon';
import RippleButton from '../../../libs/RippleButton';
import DocumentPicker from 'react-native-document-picker';
import dataHelper from '../../../../utils/dataHelper';
import Toast from 'react-native-easy-toast';
import apiPapers from '../../../../services/apiPapersTeacher';



export default class StepOnePDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingUpload: false,
            fileNameQS: '',
            fileNameAS: '',
            urlFilePDFQS: '',
            urlFilePDFAS: ''
        }
    }
    onPressNextButton = () => {
        this.handleNextStepTwo()
    }

    getBlob = async (fileUri) => {
        const resp = await fetch(fileUri);
        const file = await resp.blob();
        return file;
    };

    onPressZoom = (type) => {
        console.log("🚀 ~ file: StepOnePDF.js ~ line 35 ~ StepOnePDF ~ type", type)
        if (type === 1) {
            if (!this.state.urlFilePDFAS) {
                this.toast.show('Chưa có tài liệu PDF');
                return;
            }
        } else {
            if (!this.state.urlFilePDFQS) {
                this.toast.show('Chưa có tài liệu PDF');
                return;
            }
        }
        this.props.screenProps.navigation.navigate('FullViewPDFAssessment', { urlFilePDF: type === 1 ? this.state.urlFilePDFAS : this.state.urlFilePDFQS, text: type == 1 ? 'Lời Giải' : 'Bộ đề PDF' });
    }

    handleNextStepTwo = () => {
        // Keyboard.dismiss();
        // const {
        //     valueClass,
        //     valueSubject,
        //     nameMission,
        //     htmlContent
        // } = this.state;
        // if (
        //     _.isEmpty(valueClass) ||
        //     _.isEmpty(valueSubject) ||
        //     _.isEmpty(nameMission)
        // ) {
        //     this.refToast.show('Bạn chưa điền đầy đủ thông tin', 3000);
        //     return;
        // }
        // const gradeId = `C${valueClass.split(' ')[1]}`;
        // let { listSubject } = this.props.screenProps;
        // let subjectId = '';
        // subjectId = listSubject.find(item => item.name == valueSubject).code;
        // const formData = {
        //     gradeId,
        //     subjectId,
        //     nameMission,
        // };
        // this.props.screenProps.getCategoryHirachyMission({
        //     token: this.token,
        //     gradeId: formData.gradeId,
        //     subjectId: formData.subjectId,
        // });
        // this.props.screenProps.getCategoryTest({
        //     token: this.token,
        //     gradeId: formData.gradeId,
        //     subjectId: formData.subjectId,
        // });
        // this.props.navigation.navigate('StepTwo');
        // const data = {
        //     ...this.props.screenProps.data,
        //     nameMission,
        //     valueSubject,
        //     valueClass,
        //     valueDes: htmlContent,
        //     subjectCode: subjectId,
        //     gradeId
        // };
        this.props.screenProps.handleNextStep(1);
        this.props.navigation.navigate('StepTwo');
    };

    onPressUpload = async (type) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            if (res) {
                let url = res.uri;
                let split = url.split('/');
                let name = split.pop();
                if (type === 0) {
                    this.setState({
                        loadingUpload: true,
                        fileNameQS: name,
                    });
                } else {
                    this.setState({
                        loadingUpload: true,
                        fileNameAS: name,
                    });
                }
                this.setState({
                    loadingUpload: true,
                });
                const { token } = await dataHelper.getToken();
                if (token) {
                    const resSignedUrl = await apiPapers.signedUrlContentPDF({ token });
                    if (resSignedUrl) {
                        let file = await this.getBlob(url);
                        const resUpload = await apiPapers.uploadPDF({
                            url: resSignedUrl.preSignedUrl,
                            file,
                        });

                        if (resUpload && resUpload.status === 200) {
                            if (type === 0) {
                                this.setState({
                                    urlFilePDFQS: resSignedUrl.urlFile,
                                    loadingUpload: false,
                                });
                            } else {
                                this.setState({
                                    urlFilePDFAS: resSignedUrl.urlFile,
                                    loadingUpload: false,
                                });
                            }
                        } else {
                            this.toast.show('Tải lên PDF thất bại');
                            this.setState({ loadingUpload: false });
                        }
                    }
                }
            }
        } catch (err) {
            this.toast.show('Tải lên PDF thất bại');
            this.setState({ loadingUpload: false });
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    render() {
        const buttonConfig1 = {
            icon1: AppIcon.upload_icon,
            icon2: AppIcon.search_pdf,
            icon1_2: AppIcon.pencil_pdf,
            titleButton1: 'Upload',
            titleButton2: 'Xem',
            titleColor: '#828282',
            titleButton1_2: 'Chỉnh sửa',
            callback1: this.onPressUpload,
            callback2: this.onPressZoom,
            typePDF: 0
        }
        const buttonConfig2 = {
            icon1: AppIcon.upload_icon,
            icon2: AppIcon.search_pdf,
            titleButton1: 'Upload',
            titleButton1_2: 'Chỉnh sửa',
            titleButton2: 'Xem',
            titleColor: '#828282',
            icon1_2: AppIcon.pencil_pdf,
            callback1: this.onPressUpload,
            callback2: this.onPressZoom,
            typePDF: 1
        }
        const { loadingUpload, fileNameQS, fileNameAS } = this.state;
        return (
            <View style={styles.container}>
                {loadingUpload &&
                    <View>
                        <ActivityIndicator />
                        <Text style={styles.txtUploadingPDF}>Đang tải lên file PDF...</Text>
                    </View>}
                <UploadPDFComp title='Bộ đề PDF' marginTop={24} buttons={buttonConfig1} fileName={fileNameQS} />
                <UploadPDFComp title='Lời giải' marginTop={10} buttons={buttonConfig2} fileName={fileNameAS} />
                <Text style={styles.textWarning}>Lưu ý dung lượng không quá 5Mb!</Text>
                <Toast ref={(ref) => (this.toast = ref)} position={'center'} />
                <View style={{ width: '100%', height: 80, position: 'absolute', bottom: 0 }}>
                    <RippleButton style={styles.buttonNext} size={40} onPress={() => { this.onPressNextButton() }}>
                        <Text style={styles.textNext}>Tiếp tục</Text>
                    </RippleButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        backgroundColor: '#fff',
        // alignItems: 'center'
    },
    textWarning: {
        color: '#DB3546',
        fontFamily: 'Nunito-Regular',
        fontSize: 12,
        marginTop: 40,
        alignSelf: 'center'
    },
    textNext: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Nunito-bold',
        color: "#fff"
    },
    buttonNext: {
        width: 160,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2D9CDB',
        justifyContent: 'center',
        alignItems: 'center',
        // bottom: 50,
        alignSelf: 'center',
    },
    txtUploadingPDF: {
        marginTop: 10,
        marginVertical: 3,
        color: '#000',
        fontFamily: 'Nunito-Bold',
        fontSize: 12,
        textAlign: 'center',
    },
})