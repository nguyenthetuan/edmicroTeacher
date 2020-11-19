import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TextInput, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
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

// import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast, { DURATION } from 'react-native-easy-toast';
import Dropdown from '../Homework/Dropdown';
import apiService from '../../../services/apiPracticeHelper';


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

export default class ConfigQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listChecked: [],
            toggleCheckBox: false,
            data: null,
            eachQSPoint: [],
            totalPoint: 10,
            hidePopUp: true,
            grades: [],
            name: '',
            toggleCheckBoxExpand: false,
            assignmentType: 0,
            isExplain: false,
            duration: 0,
            timeStart: null,
            timeEnd: null,
            status: 'Publish',
            question: []
        }
    }

    componentDidMount() {
        const data = this.props.navigation.state.params.data;
        this.setState({ data, name: data.name });
        let eachQSPoint = [];
        this.resetListCheckedAndPoint(data.questions);
        this.getGrades();
        for (let i = 0; i < data.questions.length; i++) {
            eachQSPoint.push(Math.round(10 / data.questions.length * 10000) / 10000);
        }
        this.setState({ eachQSPoint });

    }

    onTickCheckBoxExpand = () => {
        this.setState({ toggleCheckBoxExpand: !this.state.toggleCheckBoxExpand })
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
        if (data[0] == 'newPoints') {
            let newPoints = JSON.parse(data[1]);
            if (JSON.stringify(newPoints) === JSON.stringify(this.state.eachQSPoint)) {
                return;
            }
            let totalPoint = newPoints.reduce((a, b) => (a + b));
            totalPoint = Math.round(totalPoint * 10000) / 10000;
            this.setState({ eachQSPoint: newPoints, totalPoint: totalPoint });
        }
    }

    onCheckTotal(newValue) {
        this.setState({ toggleCheckBox: newValue });
        if (newValue) {
            this.webview.postMessage('tickAll');
        } else {
            this.webview.postMessage('untickAll');
        }
    }

    deleteCheckedQs() {
        const { data, eachQSPoint } = this.state;
        let questionList = data.questions;
        let listChecked = this.state.listChecked;
        let count = listChecked.filter((a) => (a == true)).length;
        if (!count) {
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
        this.setState({ data, totalPoint, eachQSPoint }, () => {
            this.resetListCheckedAndPoint(data.questions);
        });
    }

    getGrades() {
        dataHelper.getToken().then(({ token }) => {
            apiService.getGrades(token).then(resJSON => {
                const { grades } = resJSON;
                console.log("getGrades ", JSON.stringify(grades));
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
                    grades: result,
                });
            }).catch(err => console.log(err));
        }).catch(err => console.log(`errors token ${err}`));
    }

    onChangePosition() {
        const { listChecked } = this.state;
        let count = listChecked.filter((a) => (a == true)).length;
        if (count > 1 || count == 0) {
            this.refs.toast.show('Xin vui lòng chọn 1 câu hỏi');
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

    }

    validate = () => {
        var errors = [];
        var result = true;
        _.forEach(['gradeCode', 'subjectCode', 'name'], item => {
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

    config = async () => {
        if (this.validate()) {
            const {
                gradeCode,
                subjectCode,
                assignmentType,
                duration,
                questions,
                name,
                isExplain,
                totalPoint,
            } = this.state;
            if (totalPoint < 10 || totalPoint > 10) {
                AlertNoti('Vui lòng nhập tổng điểm bằng 10');
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
            formData.append('question', JSON.stringify(questions));
            try {
                this.setState({ loading: true })
                const { token } = await dataHelper.getToken();
                const response = await apiPapers.createQuestion({ token, formData });
                if (response.status === 0) {
                    this.refToast.show('Tạo bộ đề thành công!');
                    const setQuestion = await dataHelper.saveQuestion([]);
                    const res = await apiPapers.getAssignmentConfig({
                        token,
                        id: response.id,
                    });
                    this.setState(
                        {
                            listGrades:
                                this.props.paper.listGrade && this.props.paper.listGrade,
                            listSubjects:
                                this.props.paper.listSubject && this.props.paper.listSubject,
                            name: '',
                            loading: false,
                        },
                        () =>
                            this.props.navigation.navigate('Assignment', {
                                item: { ...res, id: res.assignmentId },
                                checked: true,
                            }),
                    );
                    // cau hinh thanh cong
                    AnalyticsManager.trackWithProperties('School Teacher', {
                        action: 'CREATEASSIGNMENT',
                        mobile: Platform.OS,
                        grade: gradeCode,
                        subject: subjectCode,
                    });
                    Globals.updatePaper();
                }
            } catch (error) {
                this.setState({ loading: false })
                console.log('error', error);
            }
        } else {
            AlertNoti('Vui lòng điền đầy đủ thông tin');
            // alert('Vui lòng điền đầy đủ thông tin')
        }
    };


    onPressButtonPopUp() {
        let { value, eachQSPoint, data, listChecked } = this.state;
        if (value <= 0 || value >= eachQSPoint.length || !value) {
            this.refs.toast.show('Vị trí không tồn tại')
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
            this.refs.toast.show('Vui lòng nhập tổng điểm bằng 10')
        }
    }

    onPressItemSubject = (index) => {
        const { listSubjects } = this.props.navigation.state.params;
        this.setState({ subjectCode: listSubjects[index].code })
    }

    onPressItemGrade = (index) => {
        this.setState({ gradeCode: this.state.grades[index].code })
    }

    onValueChangeNameTest = (value) => {
        this.setState({ name: value });
    }

    onValueChangeTypeExam = (va) => {
        console.log("onValueChangeTypeExam: ", va);
        this.setState({ assignmentType: va })

    }

    onValueChangeDuration = (val) => {
        this.setState({ duration: parseInt(val) })
    }

    render() {
        const data = this.props.navigation.state.params.data;
        const { listSubjects } = this.props.navigation.state.params;
        console.log("this.state.grades: ", JSON.stringify(this.state.grades));
        console.log("listSubjects: ", JSON.stringify(listSubjects));
        return (
            <View >
                <SafeAreaView style={{ backgroundColor: '#56CCF2' }} />
                <SafeAreaView style={styles.root}>
                    <View style={styles.header} >
                        <View onPress={() => { this.onPressRoot() }} style={styles.header}>
                            <HeaderPaper
                                title={'Cấu hình câu hỏi'}
                                navigation={this.props.navigation}
                                color={'#fff'}
                                // notRightButton={true}
                                onRightAction={this.copySubject}
                            />
                            <View>
                                <Text style={styles.textName}>{data.name}</Text>
                            </View>
                            <View style={styles.headerContent}>
                                <View>
                                    <Text style={styles.textHeader}>Tổng số câu: {data.questions.length}</Text>
                                    <Text style={styles.textHeader}>Tổng số điểm: {this.state.totalPoint}</Text>
                                </View>
                                <View style={styles.bottomOfHeader}>
                                    <View style={{ flexDirection: 'row', position: 'absolute' }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 10, borderWidth: 1, padding: 3, borderRadius: 4, borderColor: "#fff", height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.onPressDecidePoint() }}>
                                            <Text style={styles.textHeader}>Chia đều điểm</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 10, borderWidth: 1, padding: 3, borderRadius: 4, borderColor: "#fff", height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.onChangePosition() }}>
                                            <Text style={styles.textHeader}>Sắp xếp lại</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 10, borderWidth: 1, padding: 3, borderRadius: 4, borderColor: "#fff", height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.deleteCheckedQs() }}>
                                            <Text style={styles.textHeader}>Xóa câu đã chọn</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, padding: 3, borderRadius: 4, borderColor: "#fff", height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.onCheckTotal(!this.state.toggleCheckBox) }}>
                                            <Text style={styles.textHeader}>Chọn tất cả</Text>
                                            <CheckBox
                                                disabled={false}
                                                value={this.state.toggleCheckBox}
                                                onValueChange={(newValue) => { this.onCheckTotal(newValue) }}
                                                boxType="square"
                                                style={{ width: 20, height: 20, marginLeft: 5 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: height - 220, backgroundColor: 'red' }}>
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
                            <TouchableOpacity onPress={() => { this.setState({ hidePopUp: true }) }} >
                                <Image source={require('../../../asserts/icon/icCloseModal.png')} style={{ tintColor: '#828282', }} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.textPopUp}>Đến vị trí</Text>
                        <TextInput
                            style={{ width: 100, height: 20, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, marginTop: 10 }}
                            onChangeText={(value) => { this.onValueChange(value) }}
                            keyboardType={'numeric'}
                            value={this.state.value}
                        />
                        <TouchableOpacity onPress={() => { this.onPressButtonPopUp() }} style={styles.buttonPopUp}>
                            <Text style={{ color: '#fff' }}>Chuyển</Text>
                        </TouchableOpacity>

                    </View>}
                    <Toast ref="toast" position={'center'} />
                </SafeAreaView>
                <View style={styles.blackLayer}>
                    <TouchableWithoutFeedback style={styles.popUpCreate} onPress={() => { this.textInput.blur() }}>
                        <View style={[styles.popUpCreate, { borderWidth: 1 }]}>
                            <View style={{ width: '100%', alignItems: 'center', zIndex: 1 }}>
                                <Text style={[styles.textInPopupCreate, { marginTop: 30, fontSize: 16 }]}>Nhập tên bài kiểm tra</Text>
                                <TextInput
                                    style={{ width: '90%', height: 30, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, marginTop: 10, backgroundColor: '#fff' }}
                                    onChangeText={(value) => { this.onValueChangeNameTest(value) }}
                                    keyboardType={'default'}
                                    value={this.state.name}
                                    ref={(ref) => { this.textInput = ref }}
                                />
                            </View>
                            <View style={{ zIndex: 1, flexDirection: 'row', width: '100%', paddingHorizontal: 20, alignItems: 'center', marginTop: 30 }}>
                                <Text style={[{ marginLeft: 20, marginRight: 4 }, styles.textInPopupCreate]}>Môn học</Text>
                                <Dropdown
                                    containerStyle={{
                                        marginHorizontal: 0,
                                    }}
                                    contentStyle={{ marginHorizontal: 0, borderWidth: 1 }}
                                    title="Môn Học"
                                    data={listSubjects}
                                    onPressItem={(index) => this.onPressItemSubject(index)}
                                    indexSelected={0}
                                />
                            </View>
                            <View style={{ zIndex: 1, flexDirection: 'row', width: '100%', paddingHorizontal: 20, alignItems: 'center', marginTop: 10 }}>
                                <Text style={[{ marginLeft: 46, marginRight: 4 }, styles.textInPopupCreate]}>Khối</Text>
                                <Dropdown
                                    containerStyle={{
                                        marginHorizontal: 0,
                                    }}
                                    contentStyle={{ marginHorizontal: 0, borderWidth: 1 }}
                                    title="Khối"
                                    data={this.state.grades}
                                    onPressItem={(index) => this.onPressItemGrade(index)}
                                    indexSelected={0}
                                />
                            </View>
                            <View style={{ zIndex: 1, flexDirection: 'row', width: '100%', paddingHorizontal: 20, alignItems: 'center', marginTop: 10 }}>
                                <Text style={[{ marginLeft: 17, marginRight: 4 }, styles.textInPopupCreate]}>Dạng bài</Text>
                                <Dropdown
                                    containerStyle={{
                                        marginHorizontal: 0,
                                    }}
                                    contentStyle={{ marginHorizontal: 0, borderWidth: 1 }}
                                    title="Dạng bài"
                                    data={type}
                                    onPressItem={(index) => this.onValueChangeTypeExam(index)}
                                    indexSelected={0}
                                />
                            </View>
                            {!!this.state.assignmentType && <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={[{ marginLeft: 30, marginRight: 4, top: 4 }, styles.textInPopupCreate]}>Thời gian:</Text>
                                <TextInput
                                    style={{ width: '20%', height: 30, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, marginTop: 10, backgroundColor: '#fff', color: '#2D9CDB' }}
                                    onChangeText={(value) => { this.onValueChangeDuration(value) }}
                                    keyboardType={'default'}
                                    value={this.state.duration.toString()}
                                    ref={(ref) => { this.textInput2 = ref }}
                                />
                            </View>}
                            <View style={{ width: '100%', padding: 20 }}>
                                <Text style={[styles.textInPopupCreate, { color: 'red', alignSelf: 'center' }]}>Cấu trúc bài tập</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }}>
                                    <Text style={[styles.textInPopupCreate, { color: 'red' }]}>{data.questions.length} câu hỏi</Text>
                                    <Text style={[styles.textInPopupCreate, { color: 'red' }]}>{this.state.totalPoint} điểm</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textInPopupCreate}>Giải thích trắc nghiệm</Text>
                                <CheckBox
                                    disabled={false}
                                    value={this.state.toggleCheckBoxExpand}
                                    onValueChange={(newValue) => { this.onTickCheckBoxExpand(newValue) }}
                                    boxType="square"
                                    style={{ width: 20, height: 20, marginLeft: 5 }}
                                />
                            </View>
                            <TouchableOpacity style={{ width: 100, height: 40, borderRadius: 10, backgroundColor: '#007bff', position: 'absolute', bottom: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => { this.onPressCreate() }}>
                                <Text style={styles.buttonPopUpText}>Tạo bài</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
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
        width: '100%',
        backgroundColor: '#56CCF2',
        height: 200,
        paddingHorizontal: 5
    },
    headerContent: {
        flexDirection: 'row',
        flex: 1,
    },
    headerContentLeft: {
        width: 150,
        justifyContent: 'center',
    },
    headerContentRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLineParams: {
        height: 25,
        flexDirection: 'row'
    },
    leftParams: {
        width: '60%',
        height: 25,
        justifyContent: 'center'
    },
    textInPopupCreate: {
        fontFamily: 'Nunito-bold',
        fontSize: 14,
        fontWeight: '800',

    },
    rightParams: {
        width: '40%',
        height: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTitle: {
        fontSize: 14,
        fontFamily: 'Nunito-bold',
        fontWeight: '800',
        color: '#fff'
    },
    textNormal: {
        fontSize: 12,
        fontFamily: 'Nunito',
        color: '#fff',
        fontWeight: '400',
    },
    textName: {
        fontSize: 14,
        fontWeight: '800',
        fontFamily: 'Nunito-bold',
        color: '#fff'
    },
    textHeader: {
        fontSize: 11,
        fontWeight: '800',
        fontFamily: 'Nunito-bold',
        color: '#fff'
    },
    bottomOfHeader: {
        position: 'absolute',
        height: 40,
        bottom: 0,
        right: 0,
        width: '100%',
        alignItems: 'center'
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
        fontSize: 14,
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
        height: height * 0.8,
        borderRadius: 10,
        borderColor: "#ccc",
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 0.1 * height,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        paddingVertical: 20,
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
        fontWeight: '800',
        fontFamily: 'Nunito-bold',
        fontSize: 14,
    }
})