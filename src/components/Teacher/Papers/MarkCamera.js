import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Dimensions,
    Image
} from 'react-native';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import { RFFonsize } from '../../../utils/Fonts';
import Pdf from 'react-native-pdf';
import Dropdown from '../Homework/Dropdown';
import RippleButton from '../../common-new/RippleButton';
import shadowStyle from '../../../themes/shadowStyle';
import DropdownMultiSelect from '../Homework/DropdownMultiSelect';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
export default class MarkCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
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
        }
    }

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
    render() {
        const { shadowBtn } = shadowStyle;
        const { loadingUpload } = this.state;
        return (
            <View style={styles.container}>
                <SafeAreaView />
                <HeaderNavigation
                    navigation={this.props.navigation}
                    title={'Chấm điểm camera'}
                    bgColor={'#fff'}
                    colorIcon={'#000'}
                    styleTitle={styles.styleTitle}
                    back={true}
                />
                <View style={styles.bodyInput}>
                    <TextInput
                        style={styles.txtInputCont}
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        placeholder={`Nhập tên bài kiểm tra `}
                        placeholderTextColor={'#999'}
                        numberOfLines={4}
                        returnKeyType={'done'}
                        // onChangeText={text => this.setState({ text })}
                        // value={this.state.text}
                        // textAlignVertical={'top'}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.chosePick}>
                        <Image source={require('../../../asserts/icon/dowload.png')} style={{ alignSelf: "center", marginTop: 8 }} />
                        <Text style={styles.addPar}>Thêm bộ đề</Text>
                    </TouchableOpacity>
                    <Text style={styles.note}>
                        Lưu ý! Bộ đề và đáp án được thêm dưới dạng file pdf.
                        Dung lượng không quá 10MB!
                         </Text>

                    <Text style={styles.txtOption}>Khối</Text>
                    <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
                        <DropdownMultiSelect
                            contentStyle={[styles.styTxtPlace, { borderWidth: 0 }]}
                            title="Khối lớp"
                            // data={listGrades}
                            onPressItem={(index) => this.onPressItemGrade(index)}
                        />
                    </View>

                    <Text style={styles.txtOption}>Môn Học</Text>
                    <Dropdown
                        containerStyle={styles.styleDrop}
                        contentStyle={{ marginHorizontal: 0, paddingLeft: 5 }}
                        title="Môn Học"
                        // data={this.state.lerningTarget}
                        onPressItem={(index) => this.onPressCurriculum(index)}
                        indexSelected={this.state.indexSelected}
                    />
                    <Text style={styles.txtOption}>Loại bài</Text>
                    <Dropdown
                        containerStyle={styles.styleDrop}
                        contentStyle={{ marginHorizontal: 0, paddingLeft: 5 }}
                        title="Loại bài"
                        // data={this.state.lerningTarget}
                        onPressItem={(index) => this.onPressCurriculum(index)}
                        indexSelected={this.state.indexSelected}
                    />
                    <RippleButton
                        style={[styles.btnCreate, { ...shadowBtn }]}
                        onPress={() => { alert(123) }}>
                        <Text style={styles.txtCreate}>Tạo bộ đề</Text>
                    </RippleButton>
                </View>
                {loadingUpload &&
                    <View>
                        <ActivityIndicator />
                        <Text style={styles.txtUploadingPDF}>Đang tải lên file PDF...</Text>
                    </View>}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    styleTitle: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
    },
    bodyInput: {
        flex: 1,
        marginHorizontal: 16,
        marginTop: 16
    },
    txtInputCont: {
        // borderWidth: 0.5,
        // borderColor: '#2D9CDB',
        // borderRadius: 5,
        // height: 35,
        // paddingLeft: 10,
        height: 35,
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(14),
        paddingStart: 10,
        marginBottom: 7,
        borderRadius: 5,
        padding: 0,
        borderColor: '#2D9CDB',
        borderWidth: 0.5,
        paddingTop: 5
    },
    txtOption: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        paddingTop: 16
    },
    styleDrop: {
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: "#2D9CDB",
        marginTop: 5,
        backgroundColor: "#c4c4c4"
    },
    btnCreate: {
        backgroundColor: '#2D9CDB',
        borderRadius: 5,
        marginTop: 40,
        marginHorizontal: '25%'
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
    note: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        textAlign: 'center',
        paddingTop: 10,
        color: "#EC407B"
    },
    styTxtPlace: {
        borderWidth: 0.5,
        borderColor: '#2D9CDB',
        height: 35,
        marginBottom: 5,
        minWidth: width - 50,
        borderRadius: 5,
        marginTop: 6
    },
    chosePick: {
        flexDirection: 'column',
        borderRadius: 5,
        borderWidth: .5,
        borderColor: '#2D9CDB',
        marginTop: 16
    },
    addPar: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: "#3596F3",
        paddingTop: 6,
        paddingBottom: 6,
        alignSelf: 'center'
    }
});
