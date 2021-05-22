import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TextInput,
    Image,
    TouchableWithoutFeedback,
    FlatList,
    Keyboard,
    Alert,
    Modal,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import HeaderPaper from './HeaderPaper';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import Common from '../../../utils/CommonBeta';
import AppIcon from '../../../utils/AppIcon';
import htmlHelper from '../../../utils/WebviewListQuestionCopy';
import { WebView } from 'react-native-webview';
import { result } from 'lodash';
import _ from 'lodash';
import RippleButton from '../../common-new/RippleButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WarningModal from '../../modals/WarningModal';
import { updateExamListAction } from '../../../actions/paperAction';
import { RFFonsize } from '../../../utils/Fonts';
import {
    statisticAssignmentAction
} from '../../../actions/statisticAction';
import ToastFaild from '../../common-new/ToastFaild';
import ToastSuccess from '../../common-new/ToastSuccess';
import Toast, { DURATION } from 'react-native-easy-toast';
import Dropdown from '../Homework/Dropdown';
import apiService from '../../../services/apiPracticeHelper';
import { RotationGestureHandler } from 'react-native-gesture-handler';
import ModalSuccess from './ModalSuccess/ModalSuccess';

const { width, height } = Dimensions.get('window');
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
    baseUrl = 'web/';
}

const type = [
    {
        code: 0,
        name: 'Bài tự luyện',
        order: 0,
    },
    {
        code: 1,
        name: 'Bài kiểm tra',
        order: 1,
    }
]
class ConfigQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listChecked: [],
            toggleCheckBox: false,
            data: null,
            eachQSPoint: [],
            totalPoint: 10,
            hidePopUp: true,
            listGrades: [],
            name: '',
            assignmentType: 0,
            isExplain: false,
            duration: 0,
            timeStart: null,
            timeEnd: null,
            status: 'Publish',
            question: [],
            hidePopupCreate: true,
            gradeCode: [],
            subjectCode: [],
            numberQuestion: 0,
            modalVisible: false,
            resSuccess: null,
        }
    }

    componentDidMount() {
        const data = this.props.navigation.state.params.data;
        const { listSubjects } = this.props.navigation.state.params;
        this.setState({ data, name: data.name, listSubjects });
        let eachQSPoint = [];
        this.resetListCheckedAndPoint(data.questions);
        this.getGrades();
        for (let i = 0; i < data.questions.length; i++) {
            eachQSPoint.push(Math.round(10 / data.questions.length * 10000) / 10000);
        }
        this.setState({ eachQSPoint });

    }

    onTickCheckBoxExpand = () => {
        this.setState({ isExplain: !this.state.isExplain })
    }

    onPressDecidePoint() {
        let totalPoint = 10;
        let eachQSPoint = [];
        let eachPoint = Math.round(10 / this.state.data.questions.length * 10000) / 10000;
        let questions = this.state.data.questions;
        for (let i = 0; i < questions.length; i++) {
            eachQSPoint.push(eachPoint);
        }
        this.setState({ eachQSPoint, totalPoint: 10 });
    }

    resetListCheckedAndPoint(data) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            result.push(false);
        }
        this.setState({ listChecked: result });
    }

    onHandleMessage(event) {
        const data = event.nativeEvent.data.split('---');

        if (data[0] === 'checked') {
            let listChecked = this.state.listChecked;
            listChecked[data[1]] = !listChecked[data[1]];
            this.setState({ listChecked: listChecked })
        }
        if (data[0] === 'checkAll') {
            let listChecked = this.state.listChecked;
            for (let i = 0; i < listChecked.length; i++) {
                listChecked[i] = (true);
            }
            this.setState({ listChecked: listChecked })
        }
        if (data[0] === 'unCheckAll') {
            let listChecked = this.state.listChecked;
            for (let i = 0; i < listChecked.length; i++) {
                listChecked[i] = (false);
            }
            this.setState({ listChecked: listChecked })
        }
        if (data[0] == 'newPoints') {
            let newPoints = JSON.parse(data[1]);
            if (JSON.stringify(newPoints) === JSON.stringify(this.state.eachQSPoint)) {
                return;
            }
            let totalPoint = newPoints.reduce((a, b) => (a + b));
            totalPoint = Math.round(totalPoint * 10000) / 10000;
            this.setState({ eachQSPoint: newPoints, totalPoint: totalPoint });
        }
        if (data[0] == 'warningWeb') {
            let number = data[1];
            this.setState({ numberQuestion: number }, () => {
                this.displayWarning(true);
            });
        }
    }

    displayWarning(b) {
        this.refs.warningModal.showModal();
    }

    onCheckTotal(newValue) {
        const { listChecked } = this.state;
        console.log('listChecked', listChecked)
        const dataConvert = listChecked.map(element => {
            return true
        })
        this.setState({ listChecked: dataConvert })
        console.log('dataConvert', dataConvert)

        this.setState({ toggleCheckBox: newValue });
        if (newValue) {
            this.webview.postMessage('tickAll');
        } else {
            this.webview.postMessage('untickAll');
        }
    }

    deleteCheckedQs() {
        const { data, eachQSPoint, listChecked } = this.state;
        let questionList = data.questions;
        let count = listChecked.filter((a) => (a == true)).length;
        if (count == listChecked.length) {
            // this.toast.show('Bộ đề phải có câu hỏi!');
            this.toast.show(
                <ToastFaild title="Bộ đề phải có câu hỏi!" />
            )
            return;
        }
        if (!count) {
            this.toast.show(<ToastFaild title="Phải chọn ít nhất 1 câu hỏi!" />)
            return;
        }
        for (let i = listChecked.length - 1; i >= 0; i--) {
            if (listChecked[i]) {
                questionList.splice(i, 1);
                eachQSPoint.splice(i, 1);
            }
        }
        for (let j = 0; j < questionList.length; j++) {
            questionList[j].index = j;
        }
        let totalPoint = eachQSPoint.reduce((a, b) => (a + b));
        totalPoint = Math.round(totalPoint * 10000) / 10000;
        data.questions = questionList;
        this.setState({ data, totalPoint, eachQSPoint, toggleCheckBox: false }, () => {
            this.resetListCheckedAndPoint(data.questions);
        });
    }

    getGrades() {
        dataHelper.getToken().then(({ token }) => {
            apiService.getGrades(token).then(resJSON => {
                const { grades } = resJSON;
                let result = [];
                for (let i = 0; i < grades.length; i++) {
                    let grade = grades[i];
                    result.push({
                        code: grade.gradeId,
                        name: grade.gradeName,
                        order: grade.order,
                        status: grade.status,
                    })
                }
                this.setState({
                    listGrades: result,
                });
            }).catch(err => console.log(err));
        }).catch(err => console.log(`errors token ${err}`));
    }

    onChangePosition() {
        const { listChecked } = this.state;
        let count = listChecked.filter((a) => (a == true)).length;
        if (count > 1 || count == 0) {

            this.toast.show(<ToastFaild title="Xin vui lòng chọn 1 câu hỏi" />);
            return;
        }
        this.setState({ hidePopUp: false })
    }

    onPressRoot() {
        this.webview.postMessage('blurInput');
    }

    onValueChange(value) {
        this.setState({ value });
    }

    onPressCreate() {
        this.config();
    }

    closePopupCreate() {
        this.setState({ hidePopupCreate: true });
    }

    validate = () => {
        var errors = [];
        var result = true;
        _.forEach(['gradeCode', 'subjectCode', 'name', 'assignmentType'], item => {
            if (_.isEmpty(this.state[item])) {
                switch (item) {
                    case 'gradeCode': {
                        errors[item] = true;
                        result = false;
                        break;
                    }
                    case 'subjectCode': {
                        errors[item] = true;
                        result = false;
                        break;
                    }
                    case 'name': {
                        errors[item] = true;
                        result = false;
                        break;
                    }
                    default:
                        break;
                }
            }
            this.setState({ errors });
        });
        return result;
    };

    filterQuestions(data) {
        data = data.map((item, index) => {
            return ({
                questionId: item.questionId,
                point: this.state.eachQSPoint[index],
                index: index,
                typeAnswer: item.typeAnswer
            });
        })
        return data;
    }


    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }


    config = async () => {
        const data = this.props.navigation.state.params.data;
        if (this.validate()) {
            const {
                gradeCode,
                subjectCode,
                assignmentType,
                duration,
                name,
                isExplain,
                totalPoint,
            } = this.state;
            if (this.state.assignmentType == 1) {
                console.log("this.state.duration: ", this.state.duration);
                if (this.state.duration < 5) {
                    // alert('Thời gian làm bài phải từ 5 phút!');
                    this.toast.show(
                        <ToastFaild title="Thời gian làm bài phải từ 5 phút!" />
                    )
                    return;
                }
            }
            if (totalPoint < 10 || totalPoint > 10) {
                this.toast.show(<ToastFaild title="Vui lòng nhập tổng điểm bằng 10" />);
                return;
            }
            const formData = new FormData();
            const time = Math.ceil(new Date().getTime() / 1000);
            formData.append(`name`, name);
            formData.append(`timeStart`, time);
            formData.append(`timeEnd`, time);
            formData.append(`status`, 'Publish');
            formData.append(`isShare`, true);
            formData.append(`assignmentType`, assignmentType);
            formData.append(`isExplain`, isExplain);
            if (duration) {
                formData.append(`duration`, duration * 60);
            } else {
                formData.append(`duration`, 5 * 60);
            }
            formData.append(`file`, null);
            _.forEach(gradeCode, item => {
                formData.append(`gradeCode[]`, item);
            });
            _.forEach(subjectCode, item => {
                formData.append(`subjectCode[]`, item);
            });
            formData.append('question', JSON.stringify(this.filterQuestions(data.questions)));
            try {
                const { token, enumType } = await dataHelper.getToken();
                const response = await apiPapers.createQuestion({ token, formData });
                let tokenTmp = token;
                if (response.status === 0) {
                    // this.refToast.show((<ToastSuccess title="Tạo bộ đề thành công!" />), 1500,
                    //     () => {
                    //         this.props.navigation.navigate('Assignment', {
                    //             item: res,
                    //             payloadAssignment: {
                    //                 gradeCode: res.gradeCode,
                    //                 subjectCode: res.subjectCode,
                    //             },
                    //             statusbar: 'light-content',
                    //         });
                    //     }
                    // )
                    const setQuestion = await dataHelper.saveQuestion([]);
                    const res = await apiPapers.getAssignmentConfig({
                        token: tokenTmp,
                        id: response.id,
                    });
                    await this.setState({ assignmentType: 0, resSuccess: res });
                    await this.closePopupCreate();
                    this.loadingToast.show((<ActivityIndicator size="small" />), 100,
                        () => {
                            this.setModalVisible(true);
                        }
                    ),

                        this.props.needUpdate(true);
                    // this.props.navigation.navigate('CopyFromSubjectExists');
                    const schoolYear = new Date().getFullYear();
                    this.props.fetchAssignmentAction({ token, enumType, schoolYear });
                }

            } catch (error) {
                this.setState({ loading: false })
            }
        } else {
            // alert('Vui lòng điền đầy đủ thông tin');
            this.toast.show(
                <ToastFaild title="Vui lòng điền đầy đủ thông tin" />
            )
        }
    };


    onPressButtonPopUp() {
        let { value, eachQSPoint, data, listChecked } = this.state;
        if (value <= 0 || value >= eachQSPoint.length || !value) {
            this.toast.show(<ToastFaild title="Vị trí không tồn tại. Vị trí phải là số tự nhiên" />);
            return;
        }
        if (isNaN(value)) {
            this.toast.show(<ToastFaild title="Vị trí không tồn tại. Vị trí phải là số tự nhiên" />);
            return;
        }
        const valueChecked = listChecked.indexOf(true);
        let s = eachQSPoint[valueChecked];

        eachQSPoint[valueChecked] = eachQSPoint[value - 1];
        eachQSPoint[value - 1] = s;

        s = data.questions[valueChecked];
        data.questions[valueChecked] = data.questions[value - 1];
        data.questions[value - 1] = s;

        this.setState({ hidePopUp: true, data, eachQSPoint })
        this.resetListCheckedAndPoint(data.questions);
    }

    copySubject = () => {
        const { totalPoint } = this.state;
        if (totalPoint != 10) {
            // Alert.alert('Thông báo', 'Vui lòng nhập tổng điểm bằng 10', [
            //     {
            //         text: "OK",
            //     }
            // ])
            this.toast.show(<ToastFaild title="Thông báo', 'Vui lòng nhập tổng điểm bằng 10" />)
        } else {
            this.setState({ hidePopupCreate: false })
        }
    }

    onPressItemSubject = (index) => {
        const { listSubjects } = this.props.navigation.state.params;
        this.setState({ subjectCode: listSubjects[index].code })
    }

    onPressItemGrade = (index) => {
        this.setState({ gradeCode: this.state.listGrades[index].code })
    }

    onValueChangeNameTest = (value) => {
        this.setState({ name: value });
    }

    onValueChangeTypeExam = (va) => {
        if (va === 0) {
            this.setState({ duration: 0 })
        }
        this.setState({ assignmentType: va })
    }
    _renderGrade = () => {
        const { listGrades } = this.state;
        return (
            <FlatList
                ref={'flastList'}
                style={{ marginTop: 8 }}
                data={listGrades}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return !item.isActive ? (
                        <RippleButton
                            key={`a${index}`}
                            style={Platform.OS === 'ios' ? styles.buttomClass : { height: 30 }}
                            onPress={() => this.activeGrade(item)}>
                            <View
                                style={Platform.OS === 'android' ? styles.buttomClass : null}>
                                <Text style={styles.txtItem}>{item.name}</Text>
                            </View>
                        </RippleButton>
                    ) : (
                            <RippleButton
                                key={`b${index}`}
                                style={Platform.OS === 'ios' ? styles.buttomActive : { height: 30 }}
                                onPress={() => this.activeGrade(item)}>
                                <View
                                    style={Platform.OS === 'android' ? styles.buttomActive : null}>
                                    <Text style={styles.txtItemActive}>{item.name}</Text>
                                </View>
                            </RippleButton>
                        );
                }}
                removeClippedSubviews={false}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        );
    };

    _renderSubject = () => {
        const { listSubjects } = this.state;
        return (
            <FlatList
                ref={'flastListSub'}
                style={{ marginTop: 8 }}
                data={listSubjects}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return !item.isActive ? (
                        <RippleButton
                            key={`c${index}`}
                            style={Platform.OS === 'ios' ? styles.buttomClass : { height: 30 }}
                            onPress={() => this.activeSubject(item)}>
                            <View
                                style={Platform.OS === 'android' ? styles.buttomClass : null}>
                                <Text style={styles.txtItem}>{item.name}</Text>
                            </View>
                        </RippleButton>
                    ) : (
                            <RippleButton
                                key={`d${index}`}
                                style={Platform.OS === 'ios' ? styles.buttomActive : { height: 30 }}
                                onPress={() => this.activeSubject(item)}>
                                <View
                                    style={Platform.OS === 'android' ? styles.buttomActive : null}>
                                    <Text style={styles.txtItemActive}>{item.name}</Text>
                                </View>
                            </RippleButton>
                        );
                }}
                removeClippedSubviews={false}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        );
    };

    moveArrayItem = (array, fromIndex, toIndex) => {
        const arr = [...array];
        arr.splice(toIndex, 0, ...arr.splice(fromIndex, 1));
        return arr;
    };

    activeSubject = item => {
        const { subjectCode, listSubjects } = this.state;
        let subjectCodeTmp = subjectCode;
        let listSubjectsTmp = listSubjects.map(e => {
            return { ...e, isActive: false };
        });
        const index = _.indexOf(subjectCodeTmp, item.code);
        index < 0
            ? (subjectCodeTmp = [...subjectCodeTmp, ...[item.code]])
            : (subjectCodeTmp = [
                ...subjectCodeTmp.slice(0, index),
                ...subjectCodeTmp.slice(index + 1),
            ]);

        subjectCodeTmp.map(subjectId => {
            const i = _.indexOf(listSubjectsTmp.map(e => e.code), subjectId);
            if (i > -1) {
                listSubjectsTmp[i].isActive = true;
                listSubjectsTmp = this.moveArrayItem(listSubjectsTmp, i, 0);
            }
        });
        this.refs.flastListSub.scrollToIndex({ animated: true, index: 0 });
        this.setState({
            subjectCode: subjectCodeTmp,
            listSubjects: listSubjectsTmp,
            errors: [],
        });
    };

    activeGrade = item => {
        const { gradeCode, listGrades } = this.state;
        let gradeCodeTmp = gradeCode;
        let listGradeTmp = listGrades.map(e => {
            return { ...e, isActive: false };
        });

        const index = _.indexOf(gradeCodeTmp, item.code);
        index < 0
            ? (gradeCodeTmp = [...gradeCodeTmp, ...[item.code]])
            : (gradeCodeTmp = [
                ...gradeCodeTmp.slice(0, index),
                ...gradeCodeTmp.slice(index + 1),
            ]);

        gradeCodeTmp
            .sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)))
            .map(code => {
                const i = _.indexOf(listGradeTmp.map(e => e.code), code);
                if (i > -1) {
                    listGradeTmp[i].isActive = true;
                    listGradeTmp = this.moveArrayItem(listGradeTmp, i, 0);
                }
            });
        this.refs.flastList.scrollToIndex({ animated: true, index: 0 });
        this.setState({
            gradeCode: gradeCodeTmp,
            listGrades: listGradeTmp,
            errors: [],
        });
    };

    // onValueChangeDuration = (val) => {
    //     if (!val || isNaN(val)) {
    //         this.setState({ duration: ('') })
    //     } else {
    //         this.setState({ duration: parseInt(val) })
    //     }
    // }


    onValueTimeChange = (num) => {
        if (num[num.length - 1] == ',') {
            num = `${num.substring(0, num.length - 1)}.`
        }
        this.setState({ duration: num || '' });
    }


    goToAssigned = () => {
        const { resSuccess } = this.state;
        this.setModalVisible(false);
        this.props.navigation.navigate('Assignment', {
            item: resSuccess,
            payloadAssignment: {
                gradeCode: resSuccess.gradeCode,
                subjectCode: resSuccess.subjectCode,
            },
            pop: 4,
            statusbar: 'light-content',
        });
    }

    render() {
        const data = this.props.navigation.state.params.data;
        const { listSubjects } = this.props.navigation.state.params;
        const { modalVisible, resSuccess } = this.state;
        return (
            <View >
                <SafeAreaView style={{ backgroundColor: '#56CCF2' }} />
                <View >
                    <View style={styles.header} >
                        <View onPress={() => { this.onPressRoot() }} style={styles.header}>
                            <HeaderPaper
                                title={'Cấu hình câu hỏi'}
                                navigation={this.props.navigation}
                                color={'#fff'}
                                // notRightButton={true}
                                onRightAction={this.copySubject}
                                title={data.name}
                                createPaper={true}
                            />

                            <View style={styles.headerContent}>
                                <View style={styles.headerContentLeft}>
                                    <View style={styles.flexRow}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', flex: 1 }}>
                                            <Text style={styles.textNormalName}>Môn: </Text>
                                            <View style={{ paddingHorizontal: 2, borderColor: '#fff' }}>
                                                <Text style={styles.textNormal}>{data.subjectNames[0]}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', flex: 1 }}>
                                            <Text style={styles.textNormalName}>Lớp: </Text>
                                            <View style={{ paddingHorizontal: 2, left: 4.5, borderColor: '#fff' }}>
                                                <Text style={styles.textNormal}>{data.gradeCode[0].slice(1)}</Text>
                                            </View>
                                        </View>
                                        <TouchableWithoutFeedback
                                            navigation={this.props.navigation}
                                            onPress={this.copySubject}
                                        >
                                            <View style={styles.rightHeader}>
                                                <Text style={styles.txtRightHeader}>{`Lưu cấu hình`}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={styles.flexColumn}>
                                        <TouchableWithoutFeedback
                                            onPress={() => { this.onChangePosition() }}
                                        >
                                            <View style={styles.actionTwo}>
                                                <Image source={AppIcon.icon_actionOneV3} />
                                                <Text style={[styles.textHeader, { paddingLeft: 5 }]}>Sắp xếp lại</Text>
                                            </View>
                                        </TouchableWithoutFeedback>

                                        <TouchableWithoutFeedback
                                            onPress={() => { this.deleteCheckedQs() }}
                                        >
                                            <View style={[styles.actionFour, { marginTop: 8, marginBottom: 8 }]}>
                                                <MaterialCommunityIcons
                                                    name="delete-sweep"
                                                    size={23}
                                                    color="#828282"
                                                />
                                                <Text style={[styles.textHeader, { left: 5, right: 5 }]}>Xóa câu đã chọn</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    <View style={styles.flexColumn}>
                                        <TouchableWithoutFeedback
                                            onPress={() => { this.onPressDecidePoint() }}
                                        >
                                            <View style={styles.actionOne}>
                                                <Image source={AppIcon.icon_actionTwoV3} />
                                                <Text style={[styles.textHeader, { paddingLeft: 5 }]}>Chia điểm</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => { this.onCheckTotal(!this.state.toggleCheckBox) }}
                                        >
                                            <View style={[styles.actionFour, { marginTop: 8, marginBottom: 8 }]}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={this.state.toggleCheckBox}
                                                    onValueChange={(newValue) => { this.onCheckTotal(newValue) }}
                                                    boxType="square"
                                                    style={{
                                                        width: 18,
                                                        height: 18,
                                                        marginLeft: 10,
                                                    }}
                                                />
                                                <Text style={[styles.textHeader, { paddingLeft: 5 }]}>Chọn tất cả</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{ width: '100%', height: height - 220, }}>
                        <WebView
                            onMessage={this.onHandleMessage.bind(this)}
                            ref={(ref) => (this.webview = ref)}
                            source={{
                                html: htmlHelper.renderHtmlListQuestionCopy(data.questions, this.state.eachQSPoint, true),
                                baseUrl,
                            }}
                            originWhitelist={['file://']}
                            scalesPageToFit={false}
                            javaScriptEnabled
                            showsVerticalScrollIndicator={false}
                            startInLoadingState={true}
                        />
                    </View>
                    {!this.state.hidePopUp && <View style={styles.popUp}>
                        {/* <TouchableOpacity onPress={() => { this.onPressButtonPopUp() }} style={{ width: 20, height: 20, borderRadius: 10,  left: 50, top: 5, borderWidth: 1, borderColor: '#fafafa', backgroundColor: 'red' }}>
                            <Image source={require('../../../asserts/icon/icCloseModal.png')} style={{ tintColor: '#828282', }} />
                        </TouchableOpacity> */}
                        <View style={{ width: 20, height: 20, borderRadius: 10, position: 'absolute', zIndex: 20, right: 5, top: 5 }}>
                            <TouchableWithoutFeedback onPress={() => { this.setState({ hidePopUp: true }) }} >
                                <Image source={require('../../../asserts/icon/icCloseModal.png')} style={{ tintColor: '#828282', }} />
                            </TouchableWithoutFeedback>
                        </View>
                        <Text style={styles.textPopUp}>Đến vị trí</Text>
                        <TextInput
                            style={{ width: 100, height: 20, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, marginTop: 10, paddingVertical: 0 }}
                            onChangeText={(value) => { this.onValueChange(value) }}
                            keyboardType={'decimal-pad'}
                            value={this.state.value}
                        />
                        <TouchableWithoutFeedback onPress={() => { this.onPressButtonPopUp() }} >
                            <View style={styles.buttonPopUp}>
                                <Text style={{ color: '#fff' }}>Chuyển</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>}
                </View>
                {
                    !this.state.hidePopupCreate && <View style={styles.blackLayer}>
                        <TouchableWithoutFeedback
                            style={styles.popUpCreate}
                            onPress={() => { this.textInput.blur(); Keyboard.dismiss() }}
                        >
                            <View style={[styles.popUpCreate, { borderWidth: 1 }]}>
                                <View style={{ width: '100%', paddingHorizontal: 20, zIndex: 1 }}>
                                    <Text style={[styles.textInPopupCreate, { marginTop: 30 }]}>Nhập tên bài kiểm tra</Text>
                                    <TextInput
                                        style={styles.inputTitle}
                                        onChangeText={(value) => { this.onValueChangeNameTest(value) }}
                                        keyboardType={'default'}
                                        value={this.state.name}
                                        placeholder={'Tên bài kiểm tra'}
                                        ref={(ref) => { this.textInput = ref }}
                                    />
                                </View>
                                <View style={{ zIndex: 1, flexDirection: 'column', width: '100%', paddingHorizontal: 20, marginTop: 30 }}>
                                    <Text style={[{ marginRight: 4 }, styles.textInPopupCreate]}>Môn học</Text>
                                    {this._renderSubject()}
                                </View>
                                <View style={{ zIndex: 1, flexDirection: 'column', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                                    <Text style={[{ marginRight: 4 }, styles.textInPopupCreate]}>Khối</Text>
                                    {this._renderGrade()}
                                </View>
                                <View style={{ zIndex: 1, flexDirection: 'row', width: '100%', paddingHorizontal: 20, marginTop: 20, alignItems: 'center' }}>
                                    <Text style={[{ marginRight: 4 }, styles.textInPopupCreate]}>Dạng bài</Text>
                                    <Dropdown
                                        containerStyle={{
                                            marginHorizontal: 0,
                                        }}
                                        contentStyle={{ marginHorizontal: 10, borderWidth: 1, borderColor: '#56CCF2' }}
                                        title="Dạng bài"
                                        data={type}
                                        onPressItem={(index) => this.onValueChangeTypeExam(index)}
                                        indexSelected={0}
                                    />
                                </View>
                                {!!this.state.assignmentType && <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', top: 10, paddingHorizontal: 20 }}>
                                    <Text style={[{ marginLeft: 4, marginRight: 4, top: 4 }, styles.textInPopupCreate]}>Thời gian:</Text>
                                    <TextInput
                                        style={styles.minute}
                                        onChangeText={(value) => { this.onValueTimeChange(value) }}
                                        keyboardType={'numeric'}
                                        value={this.state.duration.toString()}
                                        ref={(ref) => { this.textInput2 = ref }}
                                    />
                                    <Text style={[styles.textInPopupCreate, { top: 4, marginLeft: 5 }]}>phút</Text>
                                </View>}
                                <View style={{ flexDirection: 'row', marginTop: 21, width: '100%', paddingHorizontal: 20 }}>
                                    <Text style={[styles.textInPopupCreate, { alignSelf: 'center' }]}>Giải thích trắc nghiệm</Text>
                                    <CheckBox
                                        disabled={false}
                                        value={this.state.isExplain}
                                        onValueChange={(newValue) => { this.onTickCheckBoxExpand(newValue) }}
                                        boxType="square"
                                        style={{ width: 30, height: 30, marginLeft: 24, alignSelf: 'center' }}
                                    />
                                </View>
                                <View style={styles.viewList}>
                                    <Text style={[styles.textInPopupCreate, { color: '#000', alignSelf: 'center' }]}>Cấu trúc bài tập</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                        <Text style={[styles.textInPopupCreate, { color: '#2D9CDB', alignSelf: 'center', marginRight: 30 }]}>{data.questions.length} câu</Text>
                                        <Text style={[styles.textInPopupCreate, { color: '#FF6213', alignSelf: 'center', marginLeft: 10 }]}>{this.state.totalPoint} điểm</Text>
                                    </View>
                                </View>
                                <TouchableWithoutFeedback
                                    onPress={() => { this.onPressCreate() }}
                                >
                                    <View style={styles.createPost}>
                                        <Text style={styles.buttonPopUpText}>Tạo bài</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={{ width: 30, height: 30, borderRadius: 10, position: 'absolute', zIndex: 20, right: 5, top: 10 }}>
                                    <TouchableWithoutFeedback onPress={() => { this.closePopupCreate() }} >
                                        <Image source={require('../../../asserts/icon/icCloseModal.png')} style={{ tintColor: '#828282', }} />
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
                <Toast ref={(ref) => (this.toast = ref)} position={'top'} />
                <Toast ref={(ref) => (this.refToast = ref)} position={'top'} style={styles.styleTostSuccess} />
                <Toast ref={(ref) => (this.loadingToast = ref)} position={'center'} style={{ backgroundColor: "transparent" }} />
                <WarningModal
                    ref={'warningModal'}
                    navigation={this.props.navigation}
                    visible={this.state.visibleModalWarning}
                    hideModal={() => this.displayWarning(false)}
                    numberQuestion={this.state.numberQuestion}
                    subjectId={'TOAN'}
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
            </View >
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#56CCF2',
        height: height * 0.3,
        paddingHorizontal: 5,
    },
    headerContent: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    textInPopupCreate: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        color: '#000'
    },
    rightParams: {
        width: '40%',
        height: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTitle: {
        fontSize: RFFonsize(14),
        fontFamily: 'Nunito-bold',
        fontWeight: '800',
        color: '#fff'
    },
    textNormal: {
        fontSize: RFFonsize(12),
        fontFamily: 'Nunito',
        color: '#fff',
        fontWeight: '400',
    },
    textName: {
        fontSize: RFFonsize(14),
        fontWeight: '800',
        fontFamily: 'Nunito-bold',
        color: '#fff'
    },
    textHeader: {
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontFamily: 'Nunito',
        color: '#000',
        left: 5,
        alignSelf: "center"
    },
    buttomClass: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        height: 30
    },
    buttomActive: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#0085FF',
        backgroundColor: '#89EAFF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        paddingHorizontal: 5,
        paddingVertical: 3,
        height: 30

    },
    popUp: {
        width: 150,
        height: 100,
        position: 'absolute',
        backgroundColor: '#fafafa',
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        alignSelf: 'center',
        top: 200,
        alignItems: 'center'
    },
    textPopUp: {
        fontFamily: 'Nunito-bold',
        fontSize: RFFonsize(14),
        fontWeight: '800',
        color: '#4f4f4f',
        marginTop: 5
    },
    buttonPopUp: {
        backgroundColor: '#007bff',
        width: 60,
        height: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    popUpCreate: {
        width: width * 0.9,
        height: height * 0.9,
        borderRadius: 10,
        borderColor: "#ccc",
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 0.1 * height,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 20,
        top: -20
    },
    blackLayer: {
        backgroundColor: 'rgba(0,0,0, 0.4)',
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0
    },
    buttonPopUpText: {
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Nunito-bold',
        fontSize: RFFonsize(18),
        lineHeight: RFFonsize(21),
        marginLeft: 76,
        marginRight: 76,
        marginTop: 14,
        marginBottom: 14
    },
    buttonOnPopupText: {
        borderWidth: 1,
        borderRadius: 5,
        width: 100,
        height: 40,
        backgroundColor: '#fff'
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textNormalName: {
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontFamily: 'Nunito',
        color: '#fff',
    },
    textNormal: {
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
        textAlign: 'center',
        fontFamily: 'Nunito-bold',
        color: '#fff',
    },
    rightHeader: {
        alignSelf: 'center',
        backgroundColor: '#FFD044',
        borderRadius: 4,
    },
    txtRightHeader: {
        paddingHorizontal: 13,
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        fontFamily: 'Nunito-Bold',
        color: '#FFF',
        marginTop: 5.5,
        marginBottom: 5.5,
        marginLeft: 17,
        marginRight: 17
    },
    headerContentLeft: {
        paddingHorizontal: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: height * 0.03
    },
    totalCountQuest: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    textIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    actionOne: {
        flexDirection: 'row',
        marginRight: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderColor: "#fff",
        backgroundColor: '#fff',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionTwo: {
        flexDirection: 'row',
        marginRight: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderColor: "#fff",
        backgroundColor: '#fff',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionThree: {
        flexDirection: 'row',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderColor: "#fff",
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionFour: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#fff",
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
    },
    inputTitle: {
        height: 40,
        borderWidth: 0.5,
        borderColor: '#4776AD',
        paddingHorizontal: 5,
        borderRadius: 2,
        marginTop: 10,
        backgroundColor: '#fff'
    },
    viewList: {
        width: '100%',
        padding: 20,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    createPost: {
        backgroundColor: '#2D9CDB',
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    minute: {
        width: '20%',
        height: 30,
        borderWidth: 1,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: '#fff',
        color: '#2D9CDB',
        paddingVertical: 0
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
})

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        needUpdate: (payload) => dispatch(updateExamListAction(payload)),
        fetchAssignmentAction: payload => dispatch(statisticAssignmentAction(payload))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigQuestion);