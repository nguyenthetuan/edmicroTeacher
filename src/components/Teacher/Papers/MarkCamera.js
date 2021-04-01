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
        this.props.navigation.navigate("TakePhotoCamera");
    }


    cropPickerAndroid() {
        ImagePickerCrop.openPicker({
            // width: 500,
            // height: 900,
            cropping: true,
            includeBase64: true,
        })
            .then((image) => {
                console.log(image);

                this.myAsyncPDFFunction(image.sourceURL);

            })
            .catch((err) => console.log(err));
    }
    convertBase64ByTag = (uri, callback) => {
        ImageStore.getBase64ForTag(uri, (base64String) => {
            callback(base64String);
        });
    };

    uploadImage = () => {
        this.action = 'uploadImage';
        this.cropPickerAndroid();
    }

    myAsyncPDFFunction = async (sourceURL) => {
        try {
            const options = {
                imagePaths: [sourceURL],
                name: '',
                maxSize: {
                    // optional maximum image dimension - larger images will be resized
                    width: 900,
                    height: Math.round(width / height * 900),
                },
                quality: .7, // optional compression paramter
            };

            const pdf = await RNImageToPdf.createPDFbyImages(options);
            console.log(pdf.filePath);
        } catch (e) {
            console.log(e);
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

    onPickPDF = async () => {
        try {
            this.action = 'picker';
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

    getListFile() {
        if (this.action == 'uploadImage') {
            return [this.state.pdfFromImage];
        } else {
            return [this.state.urlFilePDF];
        }
    }

    UploadPdfCam = async () => {
        Keyboard.dismiss();
        // let question = [
        //     ...this.selectAnswer.getListQuestions().data,
        //     ...this.selectAnswer.getListQuestions().dataTL,
        // ];
        if (this.validation()) {
            const {
                gradeCode,
                subjectCode,
                name,
                assignmentType,
                duration,
                urlFilePDF,
                urlImage,
                // urlFileAnswerPDF,
            } = this.state;
            let body = {
                gradeCode: gradeCode,
                subjectCode: subjectCode,
                status: 'Publish',
                name,
                isShare: true,
                assignmentType,
                duration: assignmentType ? parseInt(duration) * 60 : 300,
                // question: question,
                assignmentContentType: 1,
                listFile: this.getListFile()
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
        console.log("this.state.indexSelectingTL: ", this.state.indexSelectingTL);
        const points = this.selectAnswer?.getTotalPoint();
        const { shadowBtn } = shadowStyle;;
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
                                                                style={styles.pdf}
                                                            />}
                                                            <View style={styles.wrapEndAreaUploadPDF}>
                                                                <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={() => this.setModalVisible(true)} >
                                                                    <Image source={require('../../../asserts/icon/dowload.png')} style={{ alignSelf: "center", marginTop: 8 }} />
                                                                    <Text style={styles.addPar}>Thêm bộ đề</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={() => { this._onFullView(0) }}>
                                                                    <Text style={styles.addPar}>View</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <Text maxLength={20} numberOfLines={1} ellipsizeMode="tail" style={styles.textPdfFile}>{this.state.pdfFile}</Text>
                                                    </View>
                                                    <Text style={styles.note}>
                                                        Lưu ý! Bộ đề và đáp án được thêm dưới dạng file pdf.
                                                        Dung lượng không quá 10MB!
                                                  </Text>
                                                </View>
                                                <Text style={styles.styTxtLabel}>Khối </Text>
                                                <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
                                                    <DropdownMultiSelect
                                                        contentStyle={[styles.styTxtPlace, { borderWidth: 0 }]}
                                                        title="Khối"
                                                        data={listGrades}
                                                        onPressItem={(index) => this.onPressItemGrade(index)}
                                                    />
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
                                                </View>
                                                <Text style={styles.styTxtLabel}>Loại bài</Text>
                                                <Dropdown
                                                    contentStyle={[styles.styTxtPlace, { paddingHorizontal: 5 }]}
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
                                {/* <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                                    <View style={[styles.viewPdf, { paddingBottom: this.state.showSelectAnswer ? 160 : 0 }]}></View>
                                </View> */}
                            </ScrollView>
                        </KeyboardAvoidingView>
                        <Toast ref={ref => this.refToast = ref} position={'bottom'} />
                        <Toast ref={(ref) => (this.toast = ref)} position={'bottom'} />
                        {loadingUpload &&
                            <View>
                                <ActivityIndicator />
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
                                <TouchableOpacity onPress={this.onPickPDF} style={{ padding: 10 }}>
                                    <Text>Upload .PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.uploadImage} style={{ padding: 10 }}>
                                    <Text>Upload Image</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.takeCamera} style={{ padding: 10 }}>
                                    <Text>Take camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => this.setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Close</Text>
                                </TouchableOpacity>
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
    pdf: {
        flex: 1,
        width: '100%',
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
        fontFamily: 'Nunito-Regular',
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
    },
    wrapEndAreaUploadPDF: {
        flexDirection: 'column',
    },
    buttonInSideAreaUploadPDF: {
        marginHorizontal: 10
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
        borderRadius: 5
    },
    styleTitle: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
    },
    addPar: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        color: "#3596F3",
        paddingTop: 6,
        paddingBottom: 6,
        alignSelf: 'center'
    },
    note: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        textAlign: 'center',
        color: "#EC407B"
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
        fontSize: RFFonsize(12),
        fontWeight: '400',
        color: '#2D9CDB',
        maxWidth: 130
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        position: 'absolute',
        alignSelf: 'flex-end'
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }

});





