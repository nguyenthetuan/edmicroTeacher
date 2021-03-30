// import React, { Component } from 'react';
// import {
//     View,
//     Text,
//     SafeAreaView,
//     StyleSheet,
//     TextInput,
//     Dimensions,
//     Image
// } from 'react-native';
// import HeaderNavigation from '../../common-new/HeaderNavigation';
// import { RFFonsize } from '../../../utils/Fonts';
// import Pdf from 'react-native-pdf';
// import Dropdown from '../Homework/Dropdown';
// import RippleButton from '../../common-new/RippleButton';
// import shadowStyle from '../../../themes/shadowStyle';
// import DropdownMultiSelect from '../Homework/DropdownMultiSelect';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import AppIcon from '../../../utils/AppIcon';
// const { width, height } = Dimensions.get('window');
// export default class MarkCamera extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             text: '',
//             visibleViewAnswer: true,
//             totalQuestionTN: 10,
//             totalQuestionTL: 0,
//             viewFileFDF: true,
//             urlFilePDF: '',
//             urlFileAnswerPDF: '',
//             loadingUpload: false,
//             pathFileAnswerPDF: null,
//             indexSelectingTN: 0,
//             assignmentTypes: [
//                 {
//                     id: 0,
//                     name: 'Bài tự luyện',
//                 },
//                 {
//                     id: 1,
//                     name: 'Bài kiểm tra',
//                 },
//             ],
//             gradeCode: [],
//             subjectCode: [],
//             name: '',
//             assignmentType: 0,
//             duration: '',
//             typeQuestion: 0,
//             indexSelectingTL: 0,
//             pdfFile: '',
//             pdfFileTL: '',
//             totalPoint: 0
//         }
//     }

//     onPickPDF = async () => {
//         try {
//             const res = await DocumentPicker.pick({
//                 type: [DocumentPicker.types.pdf],
//             });

//             if (res) {
//                 let url = res.uri;
//                 let split = url.split('/');
//                 let name = split.pop();
//                 this.setState({
//                     loadingUpload: true,
//                     pdfFile: name,
//                 });
//                 this.setState({
//                     loadingUpload: true,
//                 });
//                 const { token } = await dataHelper.getToken();
//                 if (token) {
//                     const resSignedUrl = await apiPapers.signedUrlContentPDF({ token });
//                     if (resSignedUrl) {
//                         let file = await this.getBlob(url);
//                         const resUpload = await apiPapers.uploadPDF({
//                             url: resSignedUrl.preSignedUrl,
//                             file,
//                         });

//                         if (resUpload && resUpload.status === 200) {
//                             this.setState({
//                                 urlFilePDF: resSignedUrl.urlFile,
//                                 loadingUpload: false,
//                             });
//                         } else {
//                             this.toast.show('Tải lên PDF thất bại');
//                             this.setState({ loadingUpload: false });
//                         }
//                     }
//                 }
//             }
//         } catch (err) {
//             this.toast.show('Tải lên PDF thất bại');
//             this.setState({ loadingUpload: false });
//             if (DocumentPicker.isCancel(err)) {
//                 // User cancelled the picker, exit any dialogs or menus and move on
//             } else {
//                 throw err;
//             }
//         }
//     };

//     _onFullView = (type) => {
//         if (type == 1) {
//             if (!this.state.urlFileAnswerPDF) {
//                 this.toast.show('Chưa có tài liệu PDF');
//                 return;
//             }
//         } else {
//             if (!this.state.urlFilePDF) {
//                 this.toast.show('Chưa có tài liệu PDF');
//                 return;
//             }
//         }
//         this.props.navigation.navigate('FullViewPDFAssessment', { urlFilePDF: type === 1 ? this.state.urlFileAnswerPDF : this.state.urlFilePDF, text: type == 1 ? 'Lời Giải' : 'Bộ đề PDF' });
//     };
//     render() {
//         const { shadowBtn } = shadowStyle;
//         const {
//             loadingUpload,
//             urlFilePDF
//         } = this.state;
//         return (
//             <View style={styles.container}>
//                 <SafeAreaView />
//                 <HeaderNavigation
//                     navigation={this.props.navigation}
//                     title={'Chấm điểm camera'}
//                     bgColor={'#fff'}
//                     colorIcon={'#000'}
//                     styleTitle={styles.styleTitle}
//                     back={true}
//                 />
//                 <View style={styles.bodyInput}>
//                     <TextInput
//                         // value={name}
//                         onChangeText={this.onChangeTextName}
//                         numberOfLines={1}
//                         returnKeyType={'done'}
//                         placeholder={'Nhập tên bài kiểm tra'}
//                         placeholderTextColor={'#BDBDBD'}
//                         style={styles.inputName}
//                     />
//                     <TouchableOpacity style={styles.chosePick}>
//                         <Image source={require('../../../asserts/icon/dowload.png')} style={{ alignSelf: "center", marginTop: 8 }} />
//                         <Text style={styles.addPar}>Thêm bộ đề</Text>
//                     </TouchableOpacity>

//                     <View style={styles.wrapMiniPDF}>
//                         {!!urlFilePDF && <Pdf
//                             ref={(ref) => (this.pdf = ref)}
//                             source={{ uri: urlFilePDF, cache: true }}
//                             onLoadComplete={(numberOfPages, filePath) => { }}
//                             onError={(error) => {
//                                 console.log(error);
//                             }}
//                             style={styles.pdf}
//                         />}
//                         <View style={styles.wrapEndAreaUploadPDF}>
//                             <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={() => { this._onFullView(0) }}>
//                                 <Image source={AppIcon.search_pdf} />
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={this.onPickPDF}>
//                                 <Image source={AppIcon.pencil_pdf} />
//                             </TouchableOpacity>
//                         </View>
//                         <Text maxLength={20} numberOfLines={1} ellipsizeMode="tail" style={txtPDf}>{this.state.pdfFile}</Text>
//                     </View>






//                     <Text style={styles.note}>
//                         Lưu ý! Bộ đề và đáp án được thêm dưới dạng file pdf.
//                         Dung lượng không quá 10MB!
//                          </Text>

//                     <Text style={styles.txtOption}>Khối</Text>
//                     <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
//                         <DropdownMultiSelect
//                             contentStyle={[styles.styTxtPlace, { borderWidth: 0 }]}
//                             title="Khối lớp"
//                             // data={listGrades}
//                             onPressItem={(index) => this.onPressItemGrade(index)}
//                         />
//                     </View>

//                     <Text style={styles.txtOption}>Môn Học</Text>
//                     <Dropdown
//                         containerStyle={styles.styleDrop}
//                         contentStyle={{ marginHorizontal: 0, paddingLeft: 5 }}
//                         title="Môn Học"
//                         // data={this.state.lerningTarget}
//                         onPressItem={(index) => this.onPressCurriculum(index)}
//                         indexSelected={this.state.indexSelected}
//                     />
//                     <Text style={styles.txtOption}>Loại bài</Text>
//                     <Dropdown
//                         containerStyle={styles.styleDrop}
//                         contentStyle={{ marginHorizontal: 0, paddingLeft: 5 }}
//                         title="Loại bài"
//                         // data={this.state.lerningTarget}
//                         onPressItem={(index) => this.onPressCurriculum(index)}
//                         indexSelected={this.state.indexSelected}
//                     />
//                     <RippleButton
//                         style={[styles.btnCreate, { ...shadowBtn }]}
//                         onPress={() => { alert(123) }}>
//                         <Text style={styles.txtCreate}>Tạo bộ đề</Text>
//                     </RippleButton>
//                 </View>
//                 {loadingUpload &&
//                     <View>
//                         <ActivityIndicator />
//                         <Text style={styles.txtUploadingPDF}>Đang tải lên file PDF...</Text>
//                     </View>}
//             </View>

//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
//     styleTitle: {
//         fontFamily: 'Nunito',
//         fontSize: RFFonsize(12),
//         lineHeight: RFFonsize(16),
//     },
//     bodyInput: {
//         flex: 1,
//         marginHorizontal: 16,
//         marginTop: 16
//     },
//     txtInputCont: {
//         // borderWidth: 0.5,
//         // borderColor: '#2D9CDB',
//         // borderRadius: 5,
//         // height: 35,
//         // paddingLeft: 10,
//         height: 35,
//         backgroundColor: '#fff',
//         color: '#000',
//         fontFamily: 'Nunito-Regular',
//         fontSize: RFFonsize(14),
//         paddingStart: 10,
//         marginBottom: 7,
//         borderRadius: 5,
//         padding: 0,
//         borderColor: '#2D9CDB',
//         borderWidth: 0.5,
//         paddingTop: 5
//     },
//     txtOption: {
//         fontFamily: 'Nunito-Bold',
//         fontSize: RFFonsize(14),
//         lineHeight: RFFonsize(18),
//         paddingTop: 16
//     },
//     styleDrop: {
//         borderWidth: 0.5,
//         borderRadius: 5,
//         borderColor: "#2D9CDB",
//         marginTop: 5,
//         backgroundColor: "#c4c4c4",
//     },
//     btnCreate: {
//         backgroundColor: '#2D9CDB',
//         borderRadius: 5,
//         marginTop: 40,
//         marginHorizontal: '25%'
//     },
//     txtCreate: {
//         fontFamily: "Nunito",
//         fontSize: RFFonsize(16),
//         lineHeight: RFFonsize(20),
//         color: '#fff',
//         fontWeight: "500",
//         alignSelf: 'center',
//         paddingVertical: 8
//     },
//     note: {
//         fontFamily: 'Nunito',
//         fontSize: RFFonsize(12),
//         lineHeight: RFFonsize(16),
//         textAlign: 'center',
//         paddingTop: 10,
//         color: "#EC407B"
//     },
//     styTxtPlace: {
//         borderWidth: 0.5,
//         borderColor: '#2D9CDB',
//         height: 35,
//         marginBottom: 5,
//         minWidth: width - 50,
//         borderRadius: 5,
//         marginTop: 6
//     },
//     chosePick: {
//         flexDirection: 'column',
//         borderRadius: 5,
//         borderWidth: .5,
//         borderColor: '#2D9CDB',
//         marginTop: 16
//     },
//     addPar: {
//         fontFamily: "Nunito",
//         fontSize: RFFonsize(12),
//         lineHeight: RFFonsize(16),
//         color: "#3596F3",
//         paddingTop: 6,
//         paddingBottom: 6,
//         alignSelf: 'center'
//     },
//     inputName: {
//         height: 40,
//         backgroundColor: '#fff',
//         color: '#000',
//         fontFamily: 'Nunito-Regular',
//         fontSize: RFFonsize(14),
//         paddingStart: 10,
//         marginBottom: 7,
//         borderRadius: 5,
//         padding: 0,
//         borderColor: '#2D9CDB',
//         borderWidth: .5,
//         paddingRight: 10
//     },
//     wrapMiniPDF: {
//         width: 150,
//         height: 80,
//         borderWidth: 0.5,
//         backgroundColor: 'rgba(86, 204, 242, 0.1)',
//         borderColor: '#56CCF2',
//         borderRadius: 5,
//     },
//     pdf: {
//         flex: 1,
//         width: '100%',
//     },
//     txtPDf: {
//         fontFamily: 'Nunito',
//         fontSize: RFFonsize(12),
//         fontWeight: '400',
//         color: '#2D9CDB',
//         maxWidth: 130
//     }
// });



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
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window');

class MarkCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleViewAnswer: true,
            totalQuestionTN: 10,
            totalQuestionTL: 0,
            viewFileFDF: true,
            urlFilePDF: '',
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
            totalPoint: 0
        };
    }

    onClickItem = async (index, optionIdAnswer, point) => {
        await this.setState({ indexSelectingTN: index, optionIdAnswer: isNaN(optionIdAnswer) ? -1 : optionIdAnswer, showSelectAnswer: true, currentPoint: point });
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

    onPickAnswerPDF = async () => {
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
                    pdfFileTL: name,
                });
                //upload pdf
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
                                urlFileAnswerPDF: resSignedUrl.urlFile,
                                loadingUpload: false,
                            });
                        }
                    }
                }
            }
        } catch (err) {
            this.toast.show('Tải lên PDF thất bại');

            console.log(err);
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
                urlFilePDF,
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

    assignmentContent = async () => {
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
                urlFileAnswerPDF,
            } = this.state;
            let body = {
                gradeCode: gradeCode,
                subjectCode: subjectCode,
                status: 'Publish',
                name,
                isShare: true,
                assignmentType,
                duration: assignmentType ? parseInt(duration) * 60 : 300,
                question: question,
                assignmentContentType: 1,
                listFile: [urlFilePDF],
                answerFile: urlFileAnswerPDF,
            };

            const { token } = await dataHelper.getToken();
            if (token) {
                const res = await apiPapers.assignmentContent({ token, body });
                if (res && res.status === 0) {
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
                                <TouchableWithoutFeedback onPress={() => { this._hideKeybroad(); this.closeModalSelectAnswer() }}>
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
                                                                <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={this.onPickPDF}>
                                                                    <Image source={require('../../../asserts/icon/dowload.png')} style={{ alignSelf: "center", marginTop: 8 }} />
                                                                    <Text style={styles.addPar}>Thêm bộ đề</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={styles.buttonInSideAreaUploadPDF} onPress={() => { this._onFullView(0) }}>
                                                                    <Text style={styles.addPar}>View</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <Text maxLength={20} numberOfLines={1} ellipsizeMode="tail" style={{ fontFamily: 'Nunito', fontSize: RFFonsize(12), fontWeight: '400', color: '#2D9CDB', maxWidth: 130 }}>{this.state.pdfFile}</Text>
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
                                            onPress={this.assignmentContent}>
                                            <Text style={styles.txtCreate}>Tạo bộ đề</Text>
                                        </RippleButton>
                                    </View>
                                </TouchableWithoutFeedback>
                                {/* <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                                    <View style={[styles.viewPdf, { paddingBottom: this.state.showSelectAnswer ? 160 : 0 }]}></View>
                                </View> */}
                            </ScrollView>
                        </KeyboardAvoidingView>
                        {/* <ModalSelectAnswers
                            ref={(ref) => { this.modalSelectAnswers = ref }}
                            indexSelectingTN={this.state.indexSelectingTN}
                            typeQuestion={this.state.typeQuestion}
                            indexSelectingTL={this.state.indexSelectingTL}
                            onSelectAnswer={this.onSelectAnswer}
                            optionIdAnswer={this.state.optionIdAnswer}
                            showSelectAnswer={this.state.showSelectAnswer}
                            close={this.closeModalSelectAnswer}
                            onChangeText={this.onTextPointModalChange}
                            onEndEditing={this.onTextPointModalEdit}
                            currentPoint={this.state.currentPoint}
                        /> */}
                        <Toast ref={ref => this.refToast = ref} position={'bottom'} />
                        <Toast ref={(ref) => (this.toast = ref)} position={'bottom'} />
                        {loadingUpload &&
                            <View>
                                <ActivityIndicator />
                                <Text style={styles.txtUploadingPDF}>Đang tải lên file PDF...</Text>
                            </View>}

                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
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
        borderColor: '#2D9CDB',
        borderWidth: 1,
        paddingRight: 10
    },
    wrapAreaUploadPDF: {
        marginTop: 16
    },
    wrapMiniPDF: {
        borderWidth: 0.5,
        backgroundColor: 'rgba(86, 204, 242, 0.2)',
        borderColor: '#2D9CDB',
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
        borderColor: '#2D9CDB',
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
});
