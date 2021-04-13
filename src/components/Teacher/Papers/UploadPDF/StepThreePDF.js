import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Dimensions, Keyboard } from 'react-native';
import DropdownMultiSelect from '../../Homework/DropdownMultiSelect';
import apiPapers from '../../../../services/apiPapersTeacher';
import Dropdown from '../../Homework/Dropdown';
import dataHelper from '../../../../utils/dataHelper';
import RippleButton from '../../../common-new/RippleButton';
import Toast from 'react-native-easy-toast';
import AnalyticsManager from '../../../../utils/AnalyticsManager';
import { updateExamListAction } from '../../../../actions/paperAction';


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
            subjectCode: []
        }
    }

    componentDidMount() {
        this.getGradeAndSubject();
    }

    validation = () => {
        const { gradeCode, subjectCode, name, assignmentType, duration } = this.state;
        try {
            if (!name) {
                this.toast.show('Chưa nhập tên bộ đề!');
                return;
            }
            if (!subjectCode.length) {
                this.toast.show('Chưa chọn môn học!');
                return;
            }
            if (!gradeCode.length) {
                this.toast.show('Chưa chọn khối!');
                return;
            }
            if (assignmentType && !duration) {
                this.toast.show('Chưa nhập thời gian kiểm tra!');
                return;
            }
            if (assignmentType && duration && duration < 5) {
                this.toast.show('Thời gian kiểm tra phải lớn hơn 5 phút!');
                return;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    onPressItemSubject = (indexList) => {
        const { listSubjects } = this.state;
        let arrTmp = [];
        if (indexList.length) {
            indexList.forEach(element => {
                arrTmp.push(listSubjects[element].code)
            });
        }
        this.setState({ subjectCode: arrTmp });
    };

    onPressItemGrade = (indexList) => {
        const { listGrades } = this.state;
        let arrTmp = [];
        if (indexList.length) {
            indexList.forEach(element => {
                arrTmp.push(listGrades[element].gradeId)
            });
        }
        this.setState({ gradeCode: arrTmp });
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
            console.log("🚀 ~ file: StepThreePDF.js ~ line 85 ~ StepThreePDF ~ createAssinment= ~ res", res)
            if (res && res.status === 0) {
                this.toast.show('Tạo bộ đề thành công!');
                // setTimeout(() => {
                //     // this.props.navigation.goBack();
                // this.props.screenProps.navigation.navigate('Assignment', {
                //     item: { ...res, name: name, id: res.id },
                // });
                // }, 500);
                // this.props.needUpdate(true);
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
        let validate = this.validation();
        if (!validate) {
            return;
        }

        let res = await this.createAssinment();
        const data = {
            ...this.props.screenProps.data,
            item: res.item
        };
        if (res.status == 0) {
            this.props.screenProps.handleNextStep(3, data);
            this.props.navigation.navigate('StepFour');
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

    onBlur = () => {
        const { duration } = this.state;
        if (duration === '0') {
            this.setState({ duration: '5' })
        }
    }

    onChangeTextName = (val) => {
        this.setState({ name: val });
    }

    onChangeTextDuration = (text) => {
        this.setState({ duration: text });
    };


    render() {
        const { listGrades, listSubjects, assignmentType, duration, assignmentTypes, name } = this.state;
        return (
            <View style={styles.rootView}>
                <TextInput
                    value={name}
                    onChangeText={this.onChangeTextName}
                    numberOfLines={1}
                    returnKeyType={'done'}
                    placeholder={'Nhập tên bài kiểm tra'}
                    placeholderTextColor={'#BDBDBD'}
                    style={styles.inputName}
                />
                <Text style={styles.styTxtLabel}>Môn học</Text>
                <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
                    <DropdownMultiSelect
                        key={1}
                        containerStyle={{
                            marginHorizontal: 0,
                        }}
                        contentStyle={[styles.styTxtPlace, { borderWidth: 0 }]}
                        title="Môn học"
                        data={listSubjects}
                        onPressItem={(index) => this.onPressItemSubject(index)}
                    />
                </View>
                <Text style={styles.styTxtLabel}>Khối lớp</Text>
                <View style={[styles.styTxtPlace, { paddingHorizontal: 5 }]} >
                    <DropdownMultiSelect
                        key={2}
                        contentStyle={[styles.styTxtPlace, { borderWidth: 0 }]}
                        title="Khối lớp"
                        data={listGrades}
                        onPressItem={(index) => this.onPressItemGrade(index)}
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
                <View style={styles.wrapEnd}>
                    <RippleButton style={styles.buttonNext} radius={15} onPress={this.handleNextStepFour}>
                        <Text style={styles.textNext}>Tạo bộ đề</Text>
                    </RippleButton>
                </View>
                <Toast ref={(ref) => (this.toast = ref)} position={'center'} />
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
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StepThreePDF);

const styles = StyleSheet.create({
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
        borderRadius: 4.5
    },
    styTxtLabel: {
        fontFamily: 'Nunito',
        fontSize: (14),
        fontWeight: '700',
        marginTop: 15,
        marginBottom: 5
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
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        paddingLeft: 16
    },
    buttonNext: {
        width: 160,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2D9CDB',
        justifyContent: 'center',
        alignItems: 'center',
        // bottom: 50,
    },
    textNext: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'Nunito-bold',
        color: "#fff",
        fontWeight: '800'
    },
})