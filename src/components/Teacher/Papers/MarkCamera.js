import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    SafeAreaView,
    FlatList,
    ScrollView,
    Keyboard,
    TouchableOpacity,
    Text,
    Platform,
    Dimensions,
    TextInput,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Pressable
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RippleButton from '../../common-new/RippleButton';
import DropdownMultiSelect from '../Homework/DropdownMultiSelect';
import Dropdown from '../Homework/Dropdown';
import _ from 'lodash';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Toast from 'react-native-easy-toast';
import AppIcon from '../../../utils/AppIcon';
import AnalyticsManager from '../../../utils/AnalyticsManager';
import { RFFonsize } from '../../../utils/Fonts';
import { connect } from 'react-redux';
import { updateExamListAction } from '../../../actions/paperAction';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import shadowStyle from '../../../themes/shadowStyle';
import { setListGrades, setListSubject } from '../../../actions/paperAction';
import ModalAddPaper from './ModalAddPaper';
import RNImageToPdf from 'react-native-image-to-pdf';
import ImagePickerCrop from 'react-native-image-crop-picker';
import TakePhotoCamera from './TakePhotoCamera';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window');

const options = {
    title: 'Chọn Ảnh',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class MarkCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModalAdd: false,
            visibleViewAnswer: true,
            totalQuestionTN: 10,
            totalQuestionTL: 0,
            viewFileFDF: true,
            urlFilePDF: '',
            urlImage: '',
            urlFileAnswerPDF: '',
            loadingUpload: false,
            pathFileAnswerPDF: null,
            indexSelectingTN: 0,
            assignmentTypes: [
                {
                    id: 0,
                    name: 'Bài tự luyện',
                },
                {
                    id: 1,
                    name: 'Bài kiểm tra',
                },
            ],
            gradeCode: [],
            subjectCode: [],
            name: '',
            assignmentType: 0,
            duration: '',
            typeQuestion: 0,
            indexSelectingTL: 0,
            pdfFile: '',
            pdfFileTL: '',
            totalPoint: 0,
            modalVisible: false,
            imgWidth: "100%",
            imgHeight: "100%",
            pdfFromImage: ''
        };
    }

    takeCamera = () => {
        this.setModalVisible(false);
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchCamera(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                console.log('response', JSON.stringify(response));
                this.setState({
                    filePath: response,
                    fileData: response.data,
                    fileUri: response.uri
                });
                this.convertImageToPdf(response.uri);
            }
        });
        // this.props.navigation.navigate("TakePhotoCamera");
    }


    cropPickerAndroid() {
        ImagePickerCrop.openPicker({
            // width: 500,
            // height: 900,
            cropping: true,
            includeBase64: true,
        })
            .then((image) => {
                this.myAsyncPDFFunction(image.sourceURL);

            })
            .catch((err) => console.log(err));
    }
    convertBase64ByTag = (uri, callback) => {
        ImageStore.getBase64ForTag(uri, (base64String) => {
            callback(base64String);
        });
    };

    // uploadImage = () => {
    //     this.action = 'uploadImage';
    //     this.cropPickerAndroid();
    // }
    launchImageLibrary = () => {
        this.setModalVisible(false);
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    filePath: response,
                    fileData: response.data,
                    fileUri: response.uri
                });
                this.convertImageToPdf(response.uri);
            }
        });

    }

    convertImageToPdf = async (sourceURL) => {
        try {
            const options = {
                imagePaths: [sourceURL],
                name: 'PDFName',
                maxSize: {
                    // optional maximum image dimension - larger images will be resized
                    width: 300,
                    height: 300,
                },
                quality: .7, // optional compression paramter
            };

            const pdf = await RNImageToPdf.createPDFbyImages(options);
            console.log('pdfdata', pdf);
            let url = pdf.filePath;
            let name = 'pdffile';
            this.uploadFileToServer({ url, name });

        } catch (e) {
            console.log('error pdf', e);
        }

    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    onClickItem = async (index, optionIdAnswer, point) => {
        await this.setState({
            indexSelectingTN: index,
            optionIdAnswer: isNaN(optionIdAnswer) ? -1 : optionIdAnswer,
            showSelectAnswer: true, currentPoint: point
        });
        await this.modalSelectAnswers.setIdAnswer(isNaN(optionIdAnswer) ? -1 : optionIdAnswer);
        setTimeout(() => {
            this.scrollview.scrollToEnd();
        }, 0)
    };

    onClickItemTL = (index, optionIdAnswer, point) => {
        this.setState({ indexSelectingTL: index, optionIdAnswer: optionIdAnswer || -1, currentPoint: point, showSelectAnswer: true, });
        this.modalSelectAnswers.setIdAnswer(optionIdAnswer || -1);
        setTimeout(() => {
            this.scrollview.scrollToEnd();
        }, 0)
    };

    closeModalSelectAnswer = () => {
        this.setState({ showSelectAnswer: false })
    }

    changeTotalQuestion = (totalQuestion) => {
        const { typeQuestion } = this.state;
        if (typeQuestion === 0) {
            this.setState({ totalQuestionTN: totalQuestion, indexSelectingTN: 0 });
        } else {
            this.setState({ totalQuestionTL: totalQuestion, indexSelectingTL: 0 });
        }
    };

    _onTop = () => {
        try {
            if (this.pdf) {
                this.pdf.setPage(1);
            }
        } catch (error) {
            console.log(error);
        }
    };

    _onFullView = (type) => {
        if (type == 1) {
            if (!this.state.urlFileAnswerPDF) {
                this.toast.show('Chưa có tài liệu PDF');
                return;
            }
        } else {
            if (!this.state.urlFilePDF) {
                this.toast.show('Chưa có tài liệu PDF');
                return;
            }
        }
        this.props.navigation.navigate('FullViewPDFAssessment', { urlFilePDF: type === 1 ? this.state.urlFileAnswerPDF : this.state.urlFilePDF, text: type == 1 ? 'Lời Giải' : 'Bộ đề PDF' });
    };

    getNumColumns = () => {
        return Math.floor((width - 20) / 65);
    };

    getBlob = async (fileUri) => {
        const resp = await fetch(fileUri);
        const file = await resp.blob();
        return file;
    };

    uploadFileToServer = async ({ url, name }) => {
        this.setState({
            loadingUpload: true,
            pdfFile: name,
        });
        this.setState({
            loadingUpload: true,
        });
        console.log("URL PDF " + url);
        const { token } = await dataHelper.getToken();
        if (token) {
            const resSignedUrl = await apiPapers.signedUrlContentPDF({ token });
            console.log(resSignedUrl);
            if (resSignedUrl) {
                // console.log("ok done");
                let file = await this.getBlob(url);
                console.log(file);
                const resUpload = await apiPapers.uploadPDF({
                    url: resSignedUrl.preSignedUrl,
                    file,
                });

                const resJson = await resUpload.json();
                console.log(resJson);

                if (resUpload && resUpload.status === 200) {
                    this.setState({
                        urlFilePDF: resSignedUrl.urlFile,
                        loadingUpload: false,
                    });
                    this.toast.show('Tải lên PDF thành công!');
                } else {
                    this.toast.show('Tải lên PDF thất bại!');
                    this.setState({ loadingUpload: false });
                }
            }
        }
    }

    // onPickPDF = async () => {
    //     // this.setModalVisible(false);
    //     try {
    //         // CAMERA
    //         this.action = 'picker';
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.pdf],
    //         });
    //         //UPLOAD API
    //         if (res) {
    //             let url = res.uri;
    //             let split = url.split('/');
    //             let name = split.pop();
    //             this.uploadFileToServer({ url, name });
    //         }
    //     } catch (err) {
    //         this.toast.show('Tải lên PDF thất bại');
    //         this.setState({ loadingUpload: false });
    //         if (DocumentPicker.isCancel(err)) {
    //             // User cancelled the picker, exit any dialogs or menus and move on
    //         } else {
    //             throw err;
    //         }
    //     }
    // };


    onPickPDF = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            if (res) {
                let url = res.uri;
                let split = url.split('/');
                let name = split.pop();
                this.setState({
                    loadingUpload: true,
                    pdfFile: name,
                });
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
                            this.setState({
                                urlFilePDF: resSignedUrl.urlFile,
                                loadingUpload: false,
                            });
                            this.toast.show('Tải lên PDF thành công!');
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
    };


    validation = () => {
        try {
            const {
                gradeCode,
                subjectCode,
                name,
                assignmentType,
                duration,
                urlFilePDF,
                // urlFileAnswerPDF,
                // totalPoint
            } = this.state;
            if (!name) {
                this.toast.show('Chưa nhập tên bộ đề!');
                return;
            }
            if (!gradeCode.length) {
                this.toast.show('Chưa chọn khối!');
                return;
            }
            if (!subjectCode.length) {
                this.toast.show('Chưa chọn môn học!');
                return;
            }
            if (assignmentType && !duration) {
                this.toast.show('Chưa nhập thời gian kiểm tra!');
                return;
            }
            if (assignmentType && duration && duration < 1) {
                this.toast.show('Thời gian kiểm tra phải lớn hơn 1 phút!');
                return;
            }
            if (!urlFilePDF) {
                this.toast.show('Chưa thêm bộ đề!');
                return;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    UploadPdfCam = async () => {
        Keyboard.dismiss();
        if (this.validation()) {
            const {
                gradeCode,
                subjectCode,
                name,
                assignmentType,
                duration,
                urlFilePDF,
            } = this.state;
            let body = {
                gradeCode: gradeCode,
                subjectCode: subjectCode,
                status: 'Publish',
                name,
                isShare: true,
                assignmentType,
                duration: assignmentType ? parseInt(duration) * 60 : 300,
                assignmentContentType: 1,
                listFile: [urlFilePDF]
            };
            const { token } = await dataHelper.getToken();
            if (token) {
                const res = await apiPapers.UploadPdfCam({ token, body });
                if (res && res.status === 1) {
                    this.refToast.show('Tạo bộ đề thành công!');
                    setTimeout(() => {
                        // this.props.navigation.goBack();
                        this.props.navigation.navigate('Assignment', {
                            item: { ...res, name: name, id: res.id },
                        });
                    }, 500);
                    this.props.needUpdate(true);
                    // cau hinh thanh cong
                    AnalyticsManager.trackWithProperties('School Teacher', {
                        action: 'CREATEASSIGNMENT',
                        mobile: Platform.OS,
                        grade: gradeCode,
                        subject: subjectCode,
                    });
                }
            }
        }
    };

    onChangeTextName = (text) => {
        this.setState({ name: text });
    };

    onChangeTextDuration = (text) => {
        this.setState({ duration: text });
    };

    onEnediting = () => {
        const { duration } = this.state;
        if (duration === '0') {
            this.setState({ duration: '5' })
        }
    }

    onPressItemSubject = (indexList) => {
        const { listSubjects } = this.props.navigation.state.params;
        let arrTmp = [];
        if (indexList.length) {
            indexList.forEach(element => {
                arrTmp.push(listSubjects[element].code)
            });
        }
        this.setState({ subjectCode: arrTmp });
    };

    onPressItemGrade = (indexList) => {
        const { listGrades } = this.props.navigation.state.params;
        let arrTmp = [];
        if (indexList.length) {
            indexList.forEach(element => {
                arrTmp.push(listGrades[element].gradeId)
            });
        }
        this.setState({ gradeCode: arrTmp });
    };

    onPressItemAssignmentType = (index) => {
        const { assignmentTypes } = this.state;
        this.setState({ assignmentType: assignmentTypes[index].id, showSelectAnswer: false });
    };

    onTextPointModalChange = (point) => {
        console.log("🚀 ~ file: UploadPDF.js ~ line 412 ~ UploadPDF ~ point", point)
        // alert(1);
        if (point[point.length - 1] == ',') {
            point = `${point.substring(0, point.length - 1)}.`
        }
        this.setState({ currentPoint: point });
        this.selectAnswer.onChangeText(point);
    }

    onTextPointModalEdit = (point) => {
        this.selectAnswer.editPoint();
    }

    _hideKeybroad = () => Keyboard.dismiss();

    onSelectAnswer = (answer) => {
        this.selectAnswer.onSelectAnswer(answer);
    }

    getTotalPoint = (totalPoint) => {
        this.setState({ totalPoint: totalPoint });
    }

    render() {
        const {
            listGrades,
            listSubjects,
            urlFile,
        } = this.props.navigation.state.params;
        const {
            urlFilePDF,
            urlFileAnswerPDF,
            totalQuestionTN,
            totalQuestionTL,
            assignmentTypes,
            visibleViewAnswer,
            loadingUpload,
            name,
            assignmentType,
            duration,
            viewFileFDF,
            typeQuestion,
        } = this.state;
        const numColumns = this.getNumColumns();
        const urlPdf = (viewFileFDF && urlFilePDF) || urlFileAnswerPDF || urlFile;
        const points = this.selectAnswer?.getTotalPoint();
        const { shadowBtn } = shadowStyle;
        const { modalVisible } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView />
                <SafeAreaView style={styles.container}>
                    <HeaderNavigation
                        navigation={this.props.navigation}
                        title={'Chấm điểm camera'}
                        bgColor={'#fff'}
                        colorIcon={'#000'}
                        styleTitle={styles.styleTitle}
                        back={true}
                    />
                    <View>
                        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : null}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingTop: 20, paddingBottom: Platform.OS == 'ios' ? 0 : 40 }}
                                ref={ref => this.scrollview = ref}
                                contentInset={{ bottom: Platform.OS == 'ios' ? 50 : 0 }}
                            >
                                {/* start create Upload PDF */}
                                <TouchableWithoutFeedback onPress={() => { this._hideKeybroad(); }}>
                                    {/* this.closeModalSelectAnswer() */}
                                    <View>
                                        <View style={[styles.bodyHeader, { flex: 1 }]}>
                                            <View style={{ flex: 1 }}>
                                                <TextInput
                                                    value={name}
                                                    onChangeText={this.onChangeTextName}
                                                    numberOfLines={1}
                                                    returnKeyType={'done'}
                                                    placeholder={'Nhập tên bài kiểm tra'}
                                                    placeholderTextColor={'#BDBDBD'}
                                                    style={styles.inputName}
                                                />
                                                <View style={styles.wrapAreaUploadPDF}>
                                                    <View>
                                                        <View style={styles.wrapMiniPDF}>
                                                            {!!urlFilePDF && <Pdf
                                                                ref={(ref) => (this.pdf = ref)}
                                                                source={{ uri: urlFilePDF, cache: true }}
                                                                onLoadComplete={(numberOfPages, filePath) => { }}
                                                                onError={(error) => {
                                                                    console.log(error);
                                                                }}
                                                            />}
                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textPdfFile}>{this.state.pdfFile || "Thêm bộ đề..."}</Text>
                                                        </View>
                                                        <Text style={styles.note}>Lưu ý dung lượng không quá 5Mb!</Text>
                                                    </View>
                                                    <View style={styles.wrapEndAreaUploadPDF}>
                                                        {/* onPress={() => this.setModalVisible(true)} */}
                                                        <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={this.onPickPDF}>
                                                            <Image source={require('../../../asserts/icon/upload_icon.png')} style={styles.wiIcon} />
                                                            <Text style={styles.addPar}>Upload</Text>
                                                        </TouchableOpacity>
                                                        {urlFilePDF ?
                                                            <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={() => { this._onFullView(0) }}>
                                                                <Image source={AppIcon.search_pdf} style={{ alignSelf: "center", marginLeft: 19.5, tintColor: '#828282' }} />
                                                                <Text style={styles.addPar}>Xem</Text>
                                                            </TouchableOpacity>
                                                            : null
                                                        }
                                                    </View>
                                                </View>
                                                <Text style={styles.styTxtLabel}>Khối </Text>
                                                <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]}>
                                                    <DropdownMultiSelect
                                                        contentStyle={[styles.styTxtPlace, { borderWidth: 0 }]}
                                                        title="Khối"
                                                        data={listGrades}
                                                        onPressItem={(index) => this.onPressItemGrade(index)}
                                                    />
                                                    <Text style={styles.textPlace}>Chọn khối</Text>
                                                </View>
                                                <Text style={styles.styTxtLabel}>Môn học</Text>
                                                <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
                                                    <DropdownMultiSelect
                                                        containerStyle={{
                                                            marginHorizontal: 0,
                                                        }}
                                                        contentStyle={[styles.styTxtPlace, { borderWidth: 0 }]}
                                                        title="Môn"
                                                        data={listSubjects}
                                                        onPressItem={(index) => this.onPressItemSubject(index)}
                                                    />
                                                    <Text style={styles.textPlace}>Chọn môn</Text>
                                                </View>
                                                <Text style={styles.styTxtLabel}>Loại bài</Text>
                                                <Dropdown
                                                    contentStyle={[styles.styTxtPlace, { paddingHorizontal: 5, flexDirection: 'row' }]}
                                                    title="Loại Bài"
                                                    data={assignmentTypes}
                                                    indexSelected={0}
                                                    onPressItem={(index) =>
                                                        this.onPressItemAssignmentType(index)
                                                    }
                                                />
                                                {assignmentType ? (
                                                    <View style={styles.rowMinute}>
                                                        <TextInput
                                                            value={duration}
                                                            onChangeText={this.onChangeTextDuration}
                                                            numberOfLines={1}
                                                            returnKeyType={'done'}
                                                            keyboardType={'decimal-pad'}
                                                            maxLength={4}
                                                            placeholder={'Mời nhập'}
                                                            placeholderTextColor={'#BDBDBD'}
                                                            style={[styles.inputName, { width: 100, height: 30, fontSize: 14 }]}
                                                            onEndEditing={() => this.onEnediting()}
                                                        />
                                                        <Text style={styles.textMinutes}>Phút</Text>
                                                    </View>
                                                ) : null}
                                            </View>
                                        </View>
                                        <RippleButton
                                            style={[styles.btnCreate, { ...shadowBtn }]}
                                            onPress={this.UploadPdfCam}>
                                            <Text style={styles.txtCreate}>Tạo bộ đề</Text>
                                        </RippleButton>
                                    </View>

                                </TouchableWithoutFeedback>

                            </ScrollView>
                        </KeyboardAvoidingView>
                        <Toast ref={ref => this.refToast = ref} position={'bottom'} />
                        <Toast ref={(ref) => (this.toast = ref)} position={'bottom'} />
                        {loadingUpload &&
                            <View>
                                <ActivityIndicator size="small" style={{ marginTop: 16 }} />
                                <Text style={styles.txtUploadingPDF}>Đang tải lên file PDF...</Text>
                            </View>}
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => this.setModalVisible(!modalVisible)}
                                >
                                    <Image source={AppIcon.icon_close_modal} style={{ tintColor: '#000' }} />
                                </TouchableOpacity>
                                <View style={styles.rowFlex}>
                                    <TouchableOpacity onPress={this.onPickPDF} style={styles.clickOption}>
                                        <Image source={require('../../../asserts/icon/icon_addPdf.png')} style={styles.iconOp} />
                                        <Text style={styles.txtOP}>Tải .PDF</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.launchImageLibrary} style={styles.clickOption}>
                                        <Image source={require('../../../asserts/icon/icon_add_image.png')} style={styles.iconOp} />
                                        <Text style={styles.txtOP}>Chọn ảnh</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.takeCamera} style={styles.clickOption}>
                                        <Image source={require('../../../asserts/icon/icon_camera.png')} style={styles.iconOp} />
                                        <Text style={styles.txtOP}>Chụp ảnh</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        updateListExam: state.paper.updateListExam
    };
};
const mapDispatchToProps = dispatch => {
    return {
        needUpdate: (payload) => dispatch(updateExamListAction(payload)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarkCamera);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        // backgroundColor: '#56CCF2',
    },
    bodyHeader: {
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    viewPdf: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtUploadingPDF: {
        marginTop: 10,
        marginVertical: 3,
        color: '#000',
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(12),
        textAlign: 'center',
    },
    inputName: {
        height: 40,
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Nunito-LightItalic',
        fontSize: RFFonsize(14),
        paddingStart: 10,
        marginBottom: 7,
        borderRadius: 5,
        padding: 0,
        borderColor: '#c4c4c4',
        borderWidth: 1,
        paddingRight: 10
    },
    wrapAreaUploadPDF: {
        marginTop: 16
    },
    wrapMiniPDF: {
        borderWidth: 0.5,
        backgroundColor: 'rgba(86, 204, 242, 0.15)',
        borderColor: 'rgba(86, 204, 242, 0.3)',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center'
    },
    wrapEndAreaUploadPDF: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        marginTop: 16
    },
    buttonInSideAreaUploadPDF: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#FF6213',
        borderStyle: "solid",
        borderRadius: 20,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    styTxtLabel: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        fontWeight: '700',
        marginTop: 15,
        marginBottom: 5
    },
    styTxtPlace: {
        marginHorizontal: 0,
        borderWidth: 1,
        borderColor: '#c4c4c4',
        width: '100%',
        height: 40,
        marginBottom: 5,
        minWidth: width - 50,
        borderRadius: 5,
        flexDirection: 'column'
    },
    styleTitle: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
    },
    addPar: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        color: "#828282",
        paddingTop: 5.5,
        paddingBottom: 5.5,
        alignSelf: 'center',
        paddingRight: 19.5,
        paddingLeft: 4
    },
    note: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        textAlign: 'center',
        color: "#EC407B",
        paddingTop: 10
    },
    btnCreate: {
        backgroundColor: '#2D9CDB',
        borderRadius: 5,
        marginTop: 20,
        marginHorizontal: '25%',
    },
    txtCreate: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
        color: '#fff',
        fontWeight: "500",
        alignSelf: 'center',
        paddingVertical: 8
    },
    rowMinute: {
        flex: 1,
        marginBottom: 10,
        marginTop: 16,
        flexDirection: "row"
    },
    textMinutes: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        fontWeight: '400',
        position: 'absolute',
        left: 110,
        top: 5
    },
    textPdfFile: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontWeight: '400',
        color: '#2D9CDB',
        maxWidth: 130,
        paddingLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    button: {
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 5
    },
    clickOption: {
        flexDirection: 'column',
        flex: 1,
        borderWidth: 0.5,
        borderStyle: 'dashed',
        marginHorizontal: 6,
        borderRadius: 5,
        // paddingVertical: 10,
    },
    rowFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 16
    },
    iconOp: {
        width: 25,
        height: 25,
        alignSelf: 'center',
        marginTop: 5
    },
    txtOP: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        textAlign: "center",
        color: "#000",
        paddingTop: 5,
        paddingHorizontal: 5,
        paddingBottom: 5
    },
    wiIcon: {
        alignSelf: "center",
        marginLeft: 19.5,
        tintColor: '#828282'
    },
    textPlace: {
        marginTop: -28,
        paddingLeft: 5,
        fontFamily: 'Nunito-LightItalic',
        color: '#828282'

    }

});





