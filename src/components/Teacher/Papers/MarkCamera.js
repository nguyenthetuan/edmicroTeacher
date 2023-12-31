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
} from 'react-native';
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
import ClassItem from './ClassItem';
import SubjectItem from './SubjectItem';
import ModalClass from './ModalClass';
import ModalSubject from './ModalSubject';
import ToastSuccess from '../../common-new/ToastSuccess';
import ToastFaild from '../../common-new/ToastFaild';
import ModalSuccess from './ModalSuccess/ModalSuccess';
const NAVBAR_HEIGHT = 220;

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
        const { listSubjects, listGrades } = this.props.navigation.state.params;
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
            pdfFromImage: '',
            listSubjects: listSubjects || [],
            listGrades: listGrades || [],
            resSuccess: null,
            isLoading: false,
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
        ImagePickerCrop.launchCamera(options, (response) => {

            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
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
            multiple: true,
            includeBase64: true,
        };
        ImagePickerCrop.openPicker(options).then((response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
                alert(response.customButton);
            } else {
                const sourceURL = [];
                for (let i = 0; i < response.length; i++) {
                    const element = response[i];
                    sourceURL.push(`${element.path}`);
                }
                this.convertImageToPdf(sourceURL, new Date().getTime());
            }
        });

    }

    convertImageToPdf = async (sourceURL, name) => {
        try {
            const options = {
                imagePaths: sourceURL,
                name,
                maxSize: {
                    // optional maximum image dimension - larger images will be resized
                    width: 300,
                    height: Math.round(height / width * 300),
                },
                quality: .7, // optional compression paramter
            };

            const pdf = await RNImageToPdf.createPDFbyImages(options);
            let url = pdf.filePath;
            // this.setState({
            //     urlFilePDF: `${url}`,
            // });
            // return;
            this.uploadFileToServer({ url, name });

        } catch (e) {
            console.log('error pdf', e);
        }

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
                this.toast.show(<ToastFaild title="Chưa có tài liệu PDF!" />)
                return;
            }
        } else {
            if (!this.state.urlFilePDF) {
                this.toast.show(<ToastFaild title="Chưa có tài liệu PDF" />);
                return;
            }
        }
        this.props.navigation.navigate('FullViewPDFAssessment', {
            urlFilePDF: type === 1 ? this.state.urlFileAnswerPDF : this.state.urlFilePDF,
            text: type == 1 ? 'Lời Giải' : 'Bộ đề PDF',
            statusbar: 'dark-content'
        });
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
        try {
            this.setState({
                loadingUpload: true,
                pdfFile: name,
            });
            const { token } = await dataHelper.getToken();
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
                    this.refToast.show(<ToastSuccess title={"Tải lên thành công!"} />)
                } else {
                    this.toast.show(<ToastFaild title="Tải lên PDF thất bại!" />);
                    this.setState({ loadingUpload: false });
                }
            }
        } catch (err) {
            this.toast.show('Tải lên PDF thất bại');
            this.setState({ loadingUpload: false });
        }
    }

    onPickPDF = async () => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        });
        if (res) {
            let url = res.uri;
            let split = url.split('/');
            let name = split.pop();
            this.uploadFileToServer({ url, name });
            return;
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
                this.toast.show(
                    <ToastFaild title="Chưa nhập tên bộ đề!" />
                )

                return;
            }
            if (!gradeCode.length) {
                this.toast.show(
                    <ToastFaild title="Chưa chọn khối!" />
                )
                return;
            }
            if (!subjectCode.length) {
                this.toast.show(
                    <ToastFaild title="Chưa chọn môn học!" />
                )
                return;
            }
            if (assignmentType && !duration) {
                this.toast.show(
                    <ToastFaild title="Chưa nhập thời gian kiểm tra!" />
                )
                return;
            }
            if (assignmentType && duration && duration < 1) {
                this.toast.show(
                    <ToastFaild title="Thời gian kiểm tra phải lớn hơn 1 phút!" />
                )
                return;
            }
            if (!urlFilePDF) {
                this.toast.show(
                    <ToastFaild title="Chưa thêm bộ đề!" />
                )
                return;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    UploadPdfCam = async () => {
        await this.setState({ isLoading: true });
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
                    const response = await apiPapers.getAssignmentConfig({
                        token: token,
                        id: res.data,
                    });
                    this.setState({ resSuccess: response });
                    this.loadingToast.show((<ActivityIndicator size="small" />), 1000,
                        this.setModalVisible(true)
                    )
                    this.props.needUpdate(true);
                    // cau hinh thanh cong
                    AnalyticsManager.trackWithProperties('School Teacher', {
                        action: 'CREATEASSIGNMENT',
                        mobile: Platform.OS,
                        grade: gradeCode,
                        subject: subjectCode,
                    });
                } else {
                    this.setState({ isLoading: false });
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
        const { listSubjects } = this.state;
        let arrTmp = [];
        if (indexList.length) {
            indexList.forEach(element => {
                arrTmp.push(listSubjects[element].code)
            });
        }
        this.setState({ subjectCode: arrTmp }, () => console.log('subjectCode', this.state.subjectCode));
    };

    onPressItemGrade = (indexList) => {
        const { listGrades } = this.state;
        let arrTmp = [];
        if (indexList.length) {
            indexList.forEach(element => {
                arrTmp.push(listGrades[element].gradeId)
            });
        }
        this.setState({ gradeCode: arrTmp }, () => console.log('gradeCode', this.state.gradeCode));
    };

    onPressItemAssignmentType = (index) => {
        const { assignmentTypes } = this.state;
        this.setState({ assignmentType: assignmentTypes[index].id, showSelectAnswer: false });
    };

    onTextPointModalChange = (point) => {
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

    activeClass = async item => {
        let { gradeCode } = this.state;
        const index = _.indexOf(gradeCode, item.gradeId || item);
        if (index < 0) {
            this.setState({
                gradeCode: [...gradeCode, item.gradeId],
            });
        } else {
            this.setState({
                gradeCode: [...gradeCode.splice(0, index), ...gradeCode.splice(index + 1)],
            });
        }
    };

    activeSubject = async item => {
        let { subjectCode } = this.state;
        const index = _.indexOf(subjectCode, item.code || item);
        if (index < 0) {
            this.setState({
                subjectCode: [...subjectCode, item.code],
            });
        } else {
            let arrTmp = [...subjectCode.splice(0, index), ...subjectCode.splice(index + 1)]
            this.setState({
                subjectCode: arrTmp,
            });
        }
    };

    renderHeaderFlastList = () => {
        const {
            gradeCode,
            subjectCode,
            listSubjects
        } = this.state;
        return (
            <View style={styles.navbar}>
                <ClassItem
                    gradeActive={gradeCode}
                    onOpen={() => this.refModalClass.onOpen()}
                    refFlatlist={this.refFlatlist}
                    activeClass={this.activeClass}
                    Icon={AppIcon.iconDowSelect}
                />
                <SubjectItem
                    subjectActive={subjectCode}
                    listSubjects={listSubjects}
                    onOpen={() => this.refModalSubject.onOpen()}
                    refFlatlist={this.refFlatlist}
                    activeSubject={this.activeSubject}
                    Icon={AppIcon.iconDowSelect}
                />
            </View>
        );
    }

    goToAssigned = () => {
        const { resSuccess } = this.state;
        this.setModalVisible(false);
        this.props.navigation.navigate('Assignment', {
            item: { ...resSuccess, name: resSuccess.name, id: resSuccess.id, },
            pop: 2,
            statusbar: 'light-content',
        });
    }

    render() {
        const {
            listGrades,
            listSubjects,
        } = this.props.navigation.state.params;
        const {
            urlFilePDF,
            assignmentTypes,
            modalVisible,
            loadingUpload,
            name,
            assignmentType,
            duration,
            gradeCode,
            subjectCode,
            isLoading
        } = this.state;
        const { shadowBtn } = shadowStyle;
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    <HeaderNavigation
                        navigation={this.props.navigation}
                        title={' Tạo bộ đề chấm điểm camera'}
                        bgColor={'#fff'}
                        colorIcon={'#000'}
                        styleTitle={styles.styleTitle}
                        back={true}
                    />
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: 20, paddingBottom: Platform.OS == 'ios' ? 0 : 40 }}
                            ref={ref => this.scrollview = ref}
                            contentInset={{ bottom: Platform.OS == 'ios' ? 50 : 0 }}
                        >
                            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : null}>

                                {/* start create Upload PDF */}
                                <TouchableWithoutFeedback onPress={() => { this._hideKeybroad(); }}>
                                    <View>
                                        <View style={[styles.bodyHeader, { flex: 1 }]}>
                                            <View style={{ flex: 1 }}>
                                                <TextInput
                                                    value={name}
                                                    onChangeText={this.onChangeTextName}
                                                    numberOfLines={1}
                                                    returnKeyType={'done'}
                                                    placeholder={'Nhập tên bài kiểm tra'}
                                                    placeholderTextColor={'#979797'}
                                                    style={styles.inputName}
                                                />
                                                <View style={styles.wrapAreaUploadPDF}>
                                                    <View>
                                                        <TouchableWithoutFeedback

                                                            onPress={() => { this._onFullView(0) }}
                                                        >
                                                            <View style={styles.wrapMiniPDF}>
                                                                {!!urlFilePDF && <Pdf
                                                                    ref={(ref) => (this.pdf = ref)}
                                                                    source={{ uri: urlFilePDF, cache: true }}
                                                                    onLoadComplete={(numberOfPages, filePath) => { }}
                                                                    onError={(error) => {
                                                                        console.log(error);
                                                                    }}
                                                                />}
                                                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textPdfFile}>{this.state.pdfFile || "..."}</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                        <Text style={styles.note}>Lưu ý dung lượng không quá 5Mb!</Text>
                                                    </View>
                                                    <View style={styles.wrapEndAreaUploadPDF}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TouchableWithoutFeedback onPress={this.onPickPDF}>
                                                                <View style={styles.buttonInSideAreaUploadPDF}>
                                                                    <Image source={require('../../../asserts/icon/upload_icon.png')} style={styles.wiIcon} />
                                                                    <Text style={styles.addPar}>Upload PDF</Text>
                                                                </View>
                                                            </TouchableWithoutFeedback>
                                                            {/* <TouchableWithoutFeedback onPress={this.launchImageLibrary}>
                                                                <View style={styles.buttonInSideAreaUploadPDF}>
                                                                    <Image source={require('../../../asserts/icon/upload_icon.png')} style={styles.wiIcon} />
                                                                    <Text style={styles.addPar}>Chọn ảnh</Text>
                                                                </View>
                                                            </TouchableWithoutFeedback> */}
                                                        </View>
                                                    </View>
                                                </View>
                                                {this.renderHeaderFlastList()}
                                                <Text style={[styles.styTxtLabel, { marginTop: 4 }]}>Loại bài</Text>
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
                                                            style={[styles.inputName, { width: 100, height: 30, fontSize: RFFonsize(12), lineHeight: RFFonsize(16) }]}
                                                            onEndEditing={() => this.onEnediting()}
                                                        />
                                                        <Text style={styles.textMinutes}>Phút</Text>
                                                    </View>
                                                ) : null}
                                            </View>
                                        </View>
                                        <RippleButton
                                            style={[styles.btnCreate, { ...shadowBtn }]}
                                            onPress={this.UploadPdfCam}
                                            disabled={isLoading}
                                        >
                                            <Text style={styles.txtCreate}>Tạo bộ đề</Text>
                                        </RippleButton>
                                    </View>
                                </TouchableWithoutFeedback>
                            </KeyboardAvoidingView>
                        </ScrollView>
                        <Toast ref={ref => this.refToast = ref} position={'top'} style={[styles.styleTostSuccess]} />
                        <Toast ref={(ref) => (this.toast = ref)} position={'top'} />
                        <Toast ref={(ref) => (this.loadingToast = ref)} position={'top'} style={{ backgroundColor: "transparent", marginTop: height * 0.2 }} />
                        {loadingUpload &&
                            <View>
                                <ActivityIndicator size="small" style={{ marginTop: 16 }} />
                                <Text style={styles.txtUploadingPDF}>Đang tải lên file PDF...</Text>
                            </View>}
                    </View>
                </SafeAreaView>
                <ModalClass
                    ref={ref => this.refModalClass = ref}
                    gradeActive={gradeCode}
                    listGrades={listGrades}
                    activeClass={this.activeClass}
                />
                <ModalSubject
                    ref={ref => this.refModalSubject = ref}
                    subjectActive={subjectCode}
                    listSubjects={listSubjects}
                    activeSubject={this.activeSubject}
                    Icon={AppIcon.iconDowSelect}
                />
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <ModalSuccess
                        navigation={this.props.navigation}
                        goToAssigned={this.goToAssigned}
                        data={{ ...this.state.resSuccess, name: this.state.name }}
                    />
                </Modal>
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
    txtSuccess: {
        color: '#fff',
        fontFamily: "Nunito-Bold",
        fontSize: RFFonsize(13),
        lineHeight: RFFonsize(17)
    },
    styleTostError: {
        backgroundColor: 'red',
        height: 60,
        width: width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        borderRadius: 5
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
    styleTostFaild: {
        height: 70,
        width: width - 70,
        backgroundColor: '#c4c4c4',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "center",
        borderRadius: 10,
        padding: 0,
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF'
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
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(20),
        paddingStart: 10,
        marginBottom: 7,
        borderRadius: 5,
        padding: 0,
        borderColor: '#c4c4c4',
        borderStyle: 'solid',
        borderWidth: 0.5,
        paddingRight: 15
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
        borderWidth: 0.3,
        borderColor: '#2D9CDB',
        borderStyle: "solid",
        borderRadius: 20,
        marginHorizontal: 5
    },
    styTxtLabel: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        fontWeight: '700',
        marginBottom: 5
    },
    styTxtPlace: {
        marginHorizontal: 0,
        // borderWidth: 1,
        // borderColor: '#c4c4c4',
        width: '100%',
        height: 40,
        marginBottom: 5,
        minWidth: width - 50,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        fontFamily: 'Nunito'
    },
    styleTitle: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
    },
    addPar: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: "#828282",
        alignSelf: 'center',
        paddingRight: 19.5,
        paddingLeft: 6,
        paddingVertical: 6

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
        borderRadius: 20,
        marginTop: "10%",
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
        lineHeight: RFFonsize(16),
        color: '#000',
        fontWeight: '400',
        left: 10,
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
        marginTop: 10,
        paddingLeft: 5,
        fontFamily: 'Nunito-LightItalic',
        color: '#828282'
    },
    pdfView: {
        alignSelf: "center",
        marginLeft: 19.5,
        tintColor: '#828282'
    },
    navbar: {
        // position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: NAVBAR_HEIGHT - 50,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    xstoast: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        color: "#fff",
        top: -15,
        right: 15
    }

});





