import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import UploadPDFComp from './UploadPDFComp';
import AppIcon from '../../../../utils/AppIcon';
import RippleButton from '../../../libs/RippleButton';
import DocumentPicker from 'react-native-document-picker';
import dataHelper from '../../../../utils/dataHelper';
import Toast from 'react-native-easy-toast';
import apiPapers from '../../../../services/apiPapersTeacher';
import { RFFonsize } from '../../../../utils/Fonts';
import ToastSuccess from '../../../common-new/ToastSuccess';
import ToastFaild from '../../../common-new/ToastFaild';
const { width, height } = Dimensions.get('window')

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
        if (type === 1) {
            if (!this.state.urlFilePDFAS) {
                this.toast.show(<ToastFaild title={'Chưa có file lời giải!'} />);
                return;
            }
        } else {
            if (!this.state.urlFilePDFQS) {
                this.toast.show(<ToastFaild title={'Chưa có file bộ đề!'} />);
                return;
            }
        }
        this.props.screenProps.navigation.navigate('FullViewPDFAssessment', { urlFilePDF: type === 1 ? this.state.urlFilePDFAS : this.state.urlFilePDFQS, text: type == 1 ? 'Lời Giải' : 'Bộ đề PDF', statusbar: 'dark-content' });
    }

    validate = () => {
        const { urlFilePDFQS, urlFilePDFAS } = this.state;
        // if (!urlFilePDFQS || !urlFilePDFAS) {
        if (!urlFilePDFQS) {
            this.refToast.show(
                // <View style={styles.styleTostFaild}>
                //     <Text style={styles.txtSuccess}>Chưa Upload Pdf!!</Text>
                // </View>
                <ToastFaild title="Chưa Upload Pdf!!" />
            );
            return false;
        }
        return true;
    }

    handleNextStepTwo = () => {
        const { urlFilePDFQS, urlFilePDFAS } = this.state;
        const data = {
            ...this.props.screenProps.data,
            urlFilePDFQS,
            urlFilePDFAS
        };
        const condition = this.validate();
        if (condition) {
            this.props.screenProps.handleNextStep(1, data, this.props.navigation);
            this.props.navigation.navigate('StepTwo');
        } else {

        }
    };

    onPressUpload = async (type) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            if (res) {
                let url = res.uri;
                let split = url.split('/');
                let name = split.pop().replace(/%/g, ' ').replace(/20/g, '');
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
                                this.toast.show(<ToastSuccess title={"Tải lên PDF thành công!"} />, 1000);
                            } else {
                                this.setState({
                                    urlFilePDFAS: resSignedUrl.urlFile,
                                    loadingUpload: false,
                                });
                                this.toast.show(<ToastSuccess title={"Tải lên PDF thành công!"} />)
                            }
                        } else {
                            this.refToast.show(
                                <ToastFaild title="Tải lên PDF thất bại!" />
                            );
                            this.setState({ loadingUpload: false });
                        }
                    }
                }
            }
        } catch (err) {
            //null
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
                <UploadPDFComp title='Bộ đề PDF *' marginTop={24} buttons={buttonConfig1} fileName={fileNameQS} />
                <UploadPDFComp title='Lời giải' marginTop={10} buttons={buttonConfig2} fileName={fileNameAS} />
                <Text style={styles.textWarning}>Lưu ý dung lượng không quá 5Mb!</Text>
                <Toast ref={(ref) => (this.toast = ref)} position={'top'} style={{backgroundColor :'transparent'}} />
                <Toast ref={(ref) => (this.refToast = ref)} position={'top'} />
                <View style={{ width: '100%', height: 50, position: 'absolute', bottom: 0 }}>
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
        fontSize: 16,
        lineHeight: 18,
        fontFamily: 'Nunito-bold',
        color: "#fff",
        top: 2
    },
    buttonNext: {
        width: 200,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2D9CDB',
        justifyContent: 'center',
        alignItems: 'center',
        // bottom: 50,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 2.5,
    },
    txtUploadingPDF: {
        marginTop: 10,
        marginVertical: 3,
        color: '#000',
        fontFamily: 'Nunito-Bold',
        fontSize: 12,
        textAlign: 'center',
    },
    xstoast: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        color: "#fff",
        top: -15,
        right: 15
    },
    styleTostFaild: {
        height: 60,
        width: width - 70,
        backgroundColor: '#c4c4c4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: "center",
        borderRadius: 10,
        padding: 0,
        flex: 1
    },
    styleTostSuccess: {
        flex: 1,
        height: 70,
        width: width - 70,
        backgroundColor: '#16BDA9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: "center",
        borderRadius: 10,
    },
    txtSuccess: {
        color: '#fff',
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(13),
        lineHeight: RFFonsize(17),
        marginLeft: 20
    },
})