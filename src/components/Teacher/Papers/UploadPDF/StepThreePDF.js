import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import DropdownMultiSelect from '../../Homework/DropdownMultiSelect';
import apiPapers from '../../../../services/apiPapersTeacher';
import Dropdown from '../../Homework/Dropdown';
import dataHelper from '../../../../utils/dataHelper';
import RippleButton from '../../../common-new/RippleButton';
import Toast from 'react-native-easy-toast';
import AnalyticsManager from '../../../../utils/AnalyticsManager';
import { updateExamListAction } from '../../../../actions/paperAction';
import {
    statisticAssignmentAction
} from '../../../../actions/statisticAction';
import ModalClass from '../ModalClass';
import ModalSubject from '../ModalSubject';
import _ from 'lodash';
import Common from '../../../../utils/Common';
import AppIcon from '../../../../utils/AppIcon';
import { RFFonsize } from '../../../../utils/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import ToastFaild from '../../../common-new/ToastFaild';
import ToastSuccess from '../../../common-new/ToastSuccess';
const { width, height } = Dimensions.get('window');

class StepThreePDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 5,
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
            assignmentType: 0,
            gradeCode: [],
            subjectCode: [],
            subjectActive: [],
            gradeActive: [],
            scrollViewHeight: height - 300
        }
    }

    componentDidMount() {
        this.getGradeAndSubject();
    }

    validation = () => {
        const { gradeCode, subjectCode, name, assignmentType, duration } = this.state;
        try {
            if (!name) {
                this.refToast.show(
                    <ToastFaild title="Chưa nhập tên bộ đề!" />
                );
                return;
            }
            if (!subjectCode.length) {
                this.refToast.show(
                    <ToastFaild title="Chưa chọn môn học!" />
                );
                return;
            }
            if (!gradeCode.length) {
                this.refToast.show(
                    <ToastFaild title="Chưa chọn khối!" />
                );
                return;
            }
            if (assignmentType && !duration) {
                this.refToast.show(
                    <ToastFaild title="Chưa nhập thời gian kiểm tra!" />
                );
                return;
            }
            if (assignmentType && duration && duration < 5) {
                this.refToast.show(
                    <ToastFaild title="Thời gian kiểm tra phải lớn hơn 5 phút!" />
                );
                return;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    // onPressItemSubject = (indexList) => {
    //     const { listSubjects } = this.state;
    //     let arrTmp = [];
    //     if (indexList.length) {
    //         indexList.forEach(element => {
    //             arrTmp.push(listSubjects[element].code)
    //         });
    //     }
    //     this.setState({ subjectCode: arrTmp });
    // };

    // onPressItemGrade = (indexList) => {
    //     const { listGrades } = this.state;
    //     let arrTmp = [];
    //     if (indexList.length) {
    //         indexList.forEach(element => {
    //             arrTmp.push(listGrades[element].gradeId)
    //         });
    //     }
    //     this.setState({ gradeCode: arrTmp });
    // };

    activeGrade = async item => {
        const { gradeActive } = this.state;
        const index = _.indexOf(gradeActive, item.gradeId || item);
        if (index < 0) {
            gradeActive.push(item.gradeId)
            await this.setState({ gradeActive, loading: true, gradeCode: gradeActive });
            console.log('gradeActive: ', gradeActive);
            return;
        }
        gradeActive.splice(index, 1);
        await this.setState({ gradeActive, loading: true, gradeCode: gradeActive });
    };

    activeSubject = async item => {
        const { subjectActive } = this.state;
        const index = _.indexOf(subjectActive, item.code || item);
        if (index < 0) {
            subjectActive.push(item.code);
            await this.setState({ subjectActive, loading: true, subjectCode: subjectActive });
            return;
        }
        subjectActive.splice(index, 1)
        await this.setState({ subjectActive, loading: true, subjectCode: subjectActive });
    };

    createAssinment = async () => {
        const { gradeCode, subjectCode, name, assignmentType, duration } = this.state;
        const { urlFilePDFQS, urlFilePDFAS, questionsTL, questionsTN } = this.props.screenProps.data;
        Keyboard.dismiss();
        let question = [
            ...questionsTL,
            ...questionsTN,
        ];
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
            listFile: [urlFilePDFQS],
            answerFile: urlFilePDFAS,
        };

        const { token } = await dataHelper.getToken();
        if (token) {
            const res = await apiPapers.assignmentContent({ token, body });
            if (res && res.status === 0) {
                // this.toast.show(
                //     // <View style={styles.styleTostSuccess}>
                //     //     <Image source={require('../../../../asserts/images/Exclude.png')} />
                //     //     <Text style={styles.txtSuccess}>Tạo bộ đề thành công!</Text>
                //     // </View>
                //     <ToastSuccess title="Tạo bộ đề thành công!" />
                // );
                const { token, enumType } = await dataHelper.getToken();
                const schoolYear = new Date().getFullYear();
                this.props.fetchAssignmentAction({ token, enumType, schoolYear });
                // setTimeout(() => {
                //     // this.props.navigation.goBack();
                // this.props.screenProps.navigation.navigate('Assignment', {
                //     item: { ...res, name: name, id: res.id },
                // });
                // }, 500);
                this.props.needUpdate(true);
                // cau hinh thanh cong
                AnalyticsManager.trackWithProperties('School Teacher', {
                    action: 'CREATEASSIGNMENT',
                    mobile: Platform.OS,
                    grade: gradeCode,
                    subject: subjectCode,
                });
                return { status: 0, item: { ...res, name: name, id: res.id } }
            } else {
                return { status: 1 }
            }
        }
    }

    handleNextStepFour = async () => {
        const { duration, assignmentType, subjectActive } = this.state;
        let validate = this.validation();
        if (!validate) {
            return;
        }

        let res = await this.createAssinment();
        const data = {
            ...this.props.screenProps.data,
            item: res.item,
            duration, assignmentType, subjectActive
        };
        if (res.status == 0) {
            this.loadingToast.show((<ActivityIndicator size="small" />), 100,
                () => {
                    this.props.screenProps.handleNextStep(3, data);
                    this.props.screenProps.navigation.replace('UploadPDFCompleted', {
                        data: data,
                    });
                }
            )

        } else {
            this.toast.show('Tải bộ đề lên không thành công!')
        }
    };

    getGradeAndSubject = async () => {
        const { token } = await dataHelper.getToken();
        const resGrade = await apiPapers.getGrade({ token });

        let listGrades, listSubjects;
        if (resGrade) {
            listGrades = resGrade;
        }

        const resSubject = await apiPapers.getSubject({ token });
        if (resSubject) {
            listSubjects = resSubject;
        }

        this.setState({ listGrades, listSubjects });
    }

    onPressItemAssignmentType = (index) => {
        const { assignmentTypes } = this.state;
        this.setState({ assignmentType: assignmentTypes[index].id, showSelectAnswer: false });
    };

    onBlur = async () => {
        this.setState({ scrollViewHeight: this.state.scrollViewHeight - 300 });
    }
    onFocus = async () => {

        await this.setState({ scrollViewHeight: this.state.scrollViewHeight + 300 });
        setTimeout(() => {
            this.scrollView.scrollToEnd();
        }, 0)
    }

    onChangeTextName = (val) => {
        this.setState({ name: val });
    }

    onChangeTextDuration = (text) => {
        this.setState({ duration: text });
    };


    render() {
        const {
            listGrades,
            listSubjects,
            assignmentType,
            duration,
            assignmentTypes,
            name,
            gradeActive,
            subjectActive
        } = this.state;
        return (
            <View style={styles.rootView}>
                <ScrollView
                    contentContainerStyle={{ height: this.state.scrollViewHeight }}
                    ref={ref => this.scrollView = ref}
                >
                    <TextInput
                        value={name}
                        onChangeText={this.onChangeTextName}
                        numberOfLines={1}
                        returnKeyType={'done'}
                        placeholder={'Nhập tên bài kiểm tra'}
                        placeholderTextColor={'#979797'}
                        style={styles.inputName}
                    />

                    <Text style={styles.styTxtLabel}>Môn học</Text>
                    <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
                        <View style={{ height: 40, with: 40, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                            {!subjectActive.length && <Text style={styles.titleDes}>Môn học</Text>}
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => { this.refModalSubject.onOpen() }}
                        >
                            <View style={{ height: 40, with: 40, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, zIndex: 10 }}>
                                <Icon
                                    name={'angle-down'}
                                    size={25}
                                    color={Platform.OS == 'android' ? '#979797' : '#000'}
                                    style={styles.icon}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <FlatList
                            data={subjectActive}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            horizontal
                            renderItem={({ item, index }) => {
                                const name = Common.getDisplaySubject(item);
                                return (
                                    <View style={styles.buttomActive}>
                                        <Text style={styles.txtItemActive}>{name}</Text>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <Text style={styles.styTxtLabel}>Khối lớp</Text>
                    <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
                        <View style={{ height: 40, with: 40, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                            {!gradeActive.length && <Text style={styles.titleDes}>Khối lớp</Text>}
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => { this.refModalClass.onOpen() }}
                        >
                            <View style={{ height: 40, with: 40, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, zIndex: 10 }}>
                                <Icon
                                    name={'angle-down'}
                                    size={25}
                                    color={Platform.OS == 'android' ? '#979797' : '#000'}
                                    style={styles.icon}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <FlatList
                            data={gradeActive}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            horizontal
                            renderItem={({ item, index }) => {
                                const name = item?.replace('C', 'Lớp ');
                                return (
                                    <View style={styles.buttomActive}>
                                        <Text style={styles.txtItemActive}>{name}</Text>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <Text style={styles.styTxtLabel}>Dạng bài</Text>
                    <Dropdown
                        contentStyle={[styles.styTxtPlace, { paddingHorizontal: 5 }]}
                        title="Dạng Bài"
                        data={assignmentTypes}
                        indexSelected={0}
                        onPressItem={(index) =>
                            this.onPressItemAssignmentType(index)
                        }
                    />
                    {assignmentType ? (
                        <View style={{ flex: 1, marginBottom: 10, marginTop: 25 }}>
                            <TextInput
                                value={duration.toString()}
                                onChangeText={this.onChangeTextDuration}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                numberOfLines={1}
                                returnKeyType={'done'}
                                keyboardType={'decimal-pad'}
                                maxLength={4}
                                placeholder={'Mời nhập'}
                                placeholderTextColor={'#BDBDBD'}
                                style={[styles.inputName, { width: 100, height: 30, fontSize: 14 }]}
                            />
                            <Text style={styles.textMinutes}>Phút</Text>
                        </View>
                    ) : null}
                </ScrollView>
                <View style={styles.wrapEnd}>
                    <RippleButton style={styles.buttonNext} radius={15} onPress={this.handleNextStepFour}>
                        <Text style={styles.textNext}>Tạo bộ đề</Text>
                    </RippleButton>
                </View>
                <ModalClass
                    ref={ref => this.refModalClass = ref}
                    gradeActive={gradeActive}
                    listGrades={listGrades}
                    activeClass={this.activeGrade}
                />
                <ModalSubject
                    ref={ref => this.refModalSubject = ref}
                    subjectActive={subjectActive}
                    listSubjects={listSubjects}
                    activeSubject={this.activeSubject}
                />
                <Toast ref={(ref) => (this.toast = ref)} position={'top'} />
                <Toast ref={(ref) => (this.refToast = ref)} position={'top'} />
                <Toast ref={(ref) => (this.loadingToast = ref)} position={'top'} style={{ backgroundColor: 'transparent', marginTop: height * 0.2 }} />
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = dispatch => {
    return {
        needUpdate: (payload) => dispatch(updateExamListAction(payload)),
        fetchAssignmentAction: payload => dispatch(statisticAssignmentAction(payload))
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StepThreePDF);

const styles = StyleSheet.create({
    txtSuccess: {
        color: '#fff',
        fontWeight: 'bold',
        left: 10
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
        height: 80,
        width: width - 40,
        alignItems: 'center',
        backgroundColor: '#4DE1A3',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20
    },
    rootView: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    styTxtPlace: {
        marginHorizontal: 0,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        width: '100%',
        height: 40,
        marginBottom: 5,
        minWidth: width - 50,
        borderRadius: 4.5,
        flexDirection: "row"
    },
    styTxtLabel: {
        fontFamily: 'Nunito',
        fontSize: (14),
        fontWeight: '700',
        marginTop: 15,
        marginBottom: 5
    },
    buttomActive: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        paddingHorizontal: 5,
        borderColor: '#0085FF',
        backgroundColor: '#89EAFF',
        borderRadius: 3,
        borderWidth: 1,
        marginHorizontal: 2,
        top: 7
    },
    inputName: {
        height: 40,
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Nunito-Regular',
        fontSize: (14),
        paddingStart: 10,
        marginBottom: 7,
        borderRadius: 5,
        padding: 0,
        borderColor: '#C4C4C4',
        borderWidth: 1,
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(20)
    },
    txtItemActive: {
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        fontSize: (12),
        color: '#000',
    },
    textMinutes: {
        fontFamily: 'Nunito',
        fontSize: (12),
        fontWeight: '400',
        position: 'absolute',
        left: 110,
        top: 5
    },
    wrapEnd: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 0,
    },
    buttonNext: {
        width: 160,
        borderRadius: 15,
        backgroundColor: '#2D9CDB',
        justifyContent: 'center',
        alignItems: 'center',
        // bottom: 50,
    },
    textNext: {
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        fontFamily: 'Nunito-bold',
        color: "#fff",
        marginVertical: 7
    },
    icon: {
        zIndex: -1,
        position: 'absolute',
        alignSelf: 'flex-end',
        color: '#979797'
    },
    titleDes: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        color: "#979797",
        paddingLeft: 5
    },
    styleWarnig: {
        flex: 1,
        height: 60,
        width: width - 90,
        backgroundColor: '#F8AA66',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: "center",
        borderRadius: 10,
    },
    xstoast: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(14),
        color: "#fff",
        top: -12,
        right: 5
    }
})