import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    Keyboard,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import apiPapers from '../../../services/apiPapersTeacher';
import _ from 'lodash';
import dataHelper from '../../../utils/dataHelper';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import { connect } from 'react-redux';
import { updateExamListAction } from '../../../actions/paperAction';
import { RFFonsize } from '../../../utils/Fonts';
import Api from '../../../services/apiClassTeacher';
import shadowStyle from '../../../themes/shadowStyle';
import ClassItem from './ClassItem';
import SubjectItem from './SubjectItem';
import ModalClass from './ModalClass';
import ModalSubject from './ModalSubject';
import AppIcon from '../../../utils/AppIcon'
import Toast, { DURATION } from 'react-native-easy-toast';

const { width } = Dimensions.get('window');
const NAVBAR_HEIGHT = 220;

class EditConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            grade: '',
            subject: '',
            time: '',
            gradeCode: [],
            listGrades: [],
            subjectCode: [],
            listSubjects: [],
            updating: false,
            loading: false,
            message: '',
            assignedCode: [],
            totalUserDoing: 0,
            gradeActive: [],
            subjectActive: [],
        }
    }

    async componentDidMount() {
        const { data, listGrades, listSubjects } = this.props.navigation.state.params;
        const { assignedCode } = this.state;
        const assignmentId = data.assignmentId;
        console.log('data', data)
        const { token } = await dataHelper.getToken();
        const response = await Api.getListClassAssigment({ token, assignmentId });

        this.setState({
            totalUserDoing: response?.data[0]?.totalUserDoing,
        });
        if (data) {
            let listGradeTmp = listGrades;
            let listSubjectTmp = listSubjects;

            data.gradeCode
                .sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)))
                .map(gradeId => {
                    const index = _.indexOf(listGradeTmp.map(e => e.gradeId), gradeId);
                    if (index > -1) {
                        listGradeTmp[index].isActive = true;
                        listGradeTmp = this.moveArrayItem(listGradeTmp, index, 0);
                        assignedCode.push(gradeId);
                    }
                });

            data.subjectCode.map(subjectId => {
                const index = _.indexOf(listSubjectTmp.map(e => e.code), subjectId);
                if (index > -1) {
                    listSubjectTmp[index].isActive = true;
                    listSubjectTmp = this.moveArrayItem(listSubjectTmp, index, 0);
                    assignedCode.push(subjectId);
                }
            });

            console.log("assignedCode: ", JSON.stringify(assignedCode));

            this.setState({
                ...this.state,
                name: data?.name,
                grade: data.gradeCode[0],
                subject: data.subjectCode[0],
                time: `${data.duration / 60}`,
                gradeCode: data.gradeCode,
                subjectCode: data.subjectCode,
                listGrades: listGradeTmp,
                listSubjects: listSubjectTmp,
                assignedCode: assignedCode,
                gradeActive: data.gradeCode,
                subjectActive: data.subjectCode,
            });
        }
    }

    moveArrayItem = (array, fromIndex, toIndex) => {
        const arr = [...array];
        arr.splice(toIndex, 0, ...arr.splice(fromIndex, 1));
        return arr;
    };

    _renderSubject = () => {
        const { listSubjects } = this.state;
        return (
            <FlatList
                style={{ marginTop: 8, width: width }}
                data={listSubjects}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ flexWrap: 'wrap', display: 'flex', width: width, paddingHorizontal: 0.05 * width }}
                renderItem={({ item, index }) => {
                    return !item.isActive ? (
                        <RippleButton
                            style={styles.buttomClass}
                            onPress={() => this.activeSubject(item)}>
                            <View>
                                <Text style={styles.txtItem}>{item.name}</Text>
                            </View>
                        </RippleButton>
                    ) : (
                        <RippleButton
                            style={Platform.OS === 'ios' ? styles.buttomClassActive : styles.buttomClassActive}
                            onPress={() => this.activeSubject(item)}>
                            <View>
                                <Text style={styles.txtItemActive}>{item.name}</Text>
                            </View>
                        </RippleButton>
                    );
                }}
                removeClippedSubviews={false}
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
            />
        );
    };

    _validate = () => {
        const { name, time, gradeCode, subjectCode } = this.state;
        const { data } = this.props.navigation.state.params;

        if (name.trim() === '') {

            return false;
        }

        if (!gradeCode.length) {
            return false;
        }

        if (!subjectCode.length) {
            return false;
        }

        if (data.assignmentType === 1 && time.trim() === '') {
            return false;
        }

        return true;
    };

    onUpdate = async () => {
        if (this._validate()) {
            const { data } = this.props.navigation.state.params;
            const { name, time, gradeCode, subjectCode } = this.state;
            const body = {
                ...data,
                assignmentId: data.assignmentId,
                assignmentType: data.assignmentType,
                duration: data.duration,
                gradeCode,
                isShare: data.isShare,
                name,
                subjectCode,
            };

            if (data.assignmentType) {
                body['duration'] = parseInt(time) * 60;
                if (time < 5) {
                    this.refs.toast.show('Thời gian làm bài tối thiểu là 5 phút!');
                    return;
                }
            }

            this.setState({
                updating: true,
                loading: true,
                message: 'Đang cấu hình lại bộ đề...',
            });

            const { token } = await dataHelper.getToken();
            if (token) {
                const response = await apiPapers.updateInfo({ token, body });
                if (response && response.status === 1) {
                    this.setState({
                        loading: false,
                        message: 'Thành công!',
                    });
                    this.props.navigation.state.params.onUpdateItem(body);
                    this.props.needUpdate(true);
                    this.props.navigation.goBack();
                } else {
                    this.setState({
                        loading: false,
                        message: 'Có lỗi xảy ra vui lòng thử lại!',
                    });
                }
            }
        }
    };

    _renderGrade = () => {
        const { listGrades } = this.state;
        return (
            <FlatList
                style={{ marginTop: 8 }}
                data={listGrades}
                keyExtractor={(item, index) => index.toString()}
                numColumns={4}
                renderItem={({ item, index }) => {
                    return !item.isActive ? (
                        <RippleButton
                            style={styles.buttomGrade}
                            onPress={() => this.activeGrade(item)}>
                            <Text style={styles.txtItem}>{item.name}</Text>
                        </RippleButton>
                    ) : (
                        <RippleButton
                            style={styles.buttomActive}
                            onPress={() => this.activeGrade(item)}>
                            <View>
                                <Text style={styles.txtItemActive}>{item.name}</Text>
                            </View>
                        </RippleButton>
                    );
                }}
                removeClippedSubviews={false}
                // horizontal
                // showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
            />
        );
    };

    setText = ({ key, text }) => {
        var stateCopy = Object.assign({}, this.state);
        stateCopy[key] = text;
        this.setState(stateCopy);
    };

    activeClass = async item => {
        const { gradeActive } = this.state;
        const index = _.indexOf(gradeActive, item.gradeId || item);
        if (index < 0) {
            gradeActive.push(item.gradeId)
            await this.setState({ gradeActive, loading: true });
            return;
        }
        gradeActive.splice(index, 1);
        await this.setState({ gradeActive, loading: true }, () => {
            console.log('gradeActive', this.state.gradeActive)
        });
    };

    activeSubject = async item => {
        const { subjectActive } = this.state;
        const index = _.indexOf(subjectActive, item.code || item);
        if (index < 0) {
            subjectActive.push(item.code);
            await this.setState({ subjectActive, loading: true }, () => {
                console.log('gradeActive', this.state.gradeActive)
            });
            return;
        }
        subjectActive.splice(index, 1)
        await this.setState({ subjectActive, loading: true });
    };

    renderHeaderFlastList() {
        const {
            gradeActive,
            subjectActive,
            listSubjects
        } = this.state;
        console.log('refModalClass', this.refModalClass)
        return (
            <View style={styles.navbar}>
                <ClassItem
                    gradeActive={gradeActive}
                    onOpen={() => this.refModalClass.onOpen()}
                    refFlatlist={this.refFlatlist}
                    activeClass={this.activeClass}
                    Icon={AppIcon.iconDowSelect}
                    styleTitle={styles.styTxtLabel}
                />
                <SubjectItem
                    subjectActive={subjectActive}
                    listSubjects={listSubjects}
                    onOpen={() => this.refModalSubject.onOpen()}
                    refFlatlist={this.refFlatlist}
                    activeSubject={this.activeSubject}
                    Icon={AppIcon.iconDowSelect}
                    styleTitle={styles.styTxtLabel}
                />
            </View>
        );
    }

    render() {
        const { shadowBtn } = shadowStyle;
        const { name, listSubjects, time, gradeActive, listGrades, subjectActive } = this.state;
        const { data } = this.props.navigation.state.params;
        let disabled = data.assignmentType && time == '0' || time == '';
        disabled = !this._validate();
        return (
            <View style={styles.safeView}>
                <SafeAreaView style={{ backgroundColor: '#2D9CDB' }} />
                <HeaderNavigation
                    title={'Cấu hình bộ đề'}
                    navigation={this.props.navigation}
                    color={"#fff"}
                    backgroundColor={'#2D9CDB'}
                />
                <View
                    behavior={'padding'}
                    style={{ flex: 1 }}
                >
                    <View
                        style={{ paddingVertical: 15, flex: 1 }}
                    >
                        <Text style={[styles.styTxtLabel, { left: 15 }]}>Tên bài tập</Text>
                        <View style={styles.styWrapInutName}>
                            <TextInput
                                numberOfLines={1}
                                value={name}
                                style={styles.txtTexinput}
                                onChangeText={text =>
                                    this.setText({ key: 'name', text })
                                }
                            />
                        </View>
                        {this.renderHeaderFlastList()}
                        {data && data.assignmentType ? (
                            <View style={{ marginTop: 40, marginLeft: 20 }}>
                                <Text style={styles.styTxtLabel}>Thời gian</Text>
                                <View style={{ flexDirection: 'row', height: 30, alignItems: 'center' }}>
                                    <View style={styles.styWrapInutTime}>
                                        <TextInput
                                            value={time}
                                            style={styles.txtTexinput}
                                            onChangeText={text => this.setText({ key: 'time', text: text.trim() })}
                                            keyboardType={'number-pad'}
                                        />
                                    </View>
                                    <Text style={[styles.styTxtLabel, { top: 4, left: 10 }]}>Phút</Text>
                                </View>
                            </View>
                        ) : null}
                        <View style={styles.footer}>
                            <RippleButton
                                onPress={() => this.props.navigation.goBack()}>
                                <View style={[styles.buttomCancel, { ...shadowBtn }]}>
                                    <Text style={styles.txtButtom}>Huỷ</Text>
                                </View>
                            </RippleButton>
                            <View style={{ marginStart: 40 }}>
                                <RippleButton onPress={this.onUpdate} disabled={disabled}>
                                    <View style={[styles.buttomSave, { backgroundColor: disabled ? '#828282' : '#56CCF2', ...shadowBtn }]}>
                                        <Text style={styles.txtButtom}>Lưu</Text>
                                    </View>
                                </RippleButton>
                            </View>
                        </View>
                    </View>
                </View>
                <ModalClass
                    ref={ref => this.refModalClass = ref}
                    gradeActive={gradeActive}
                    listGrades={listGrades}
                    activeClass={this.activeClass}
                />
                <ModalSubject
                    ref={ref => this.refModalSubject = ref}
                    subjectActive={subjectActive}
                    listSubjects={listSubjects}
                    activeSubject={this.activeSubject}
                />
                <Toast ref="toast" position={'top'} />
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditConfig);

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    wrapContent: {
        flex: 1,
        paddingVertical: 15,
    },
    bodyModal: {
        justifyContent: 'center',
        borderRadius: 2,
        overflow: 'hidden',
    },
    topModal: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        backgroundColor: '#56CCF2',
    },
    txtTitle: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        color: '#FFF',
    },
    txtTexinput: {
        paddingLeft: 12,
        fontSize: RFFonsize(12),
        color: '#2D9CDB',
        fontFamily: 'Nunito-Regular',
        padding: 0
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 50,
        flex: 1
    },
    buttomCancel: {
        backgroundColor: '#FF6213',
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        borderRadius: 20,
        paddingVertical: 3,
        height: 30
    },
    txtButtom: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        color: '#FFF',
    },
    buttomSave: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        borderRadius: 20,
        paddingVertical: 3,
        height: 30
    },
    buttomClass: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
        marginRight: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 35
    },
    buttomClassActive: {
        borderWidth: 1,
        borderColor: '#0085FF',
        backgroundColor: 'rgba(86, 204, 242, 0.3)',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginRight: 10,
        marginBottom: 10,
        paddingVertical: 5,
        height: 35
    },
    buttomGrade: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        width: '15%',
        marginBottom: 10,
        marginHorizontal: 0.05 * width,
        height: 35
    },
    buttomActive: {
        borderWidth: 1,
        borderColor: '#0085FF',
        backgroundColor: 'rgba(86, 204, 242, 0.3)',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
        width: '15%',
        marginBottom: 10,
        marginHorizontal: 0.05 * width,
        height: 35
    },
    txtItemActive: {
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        fontSize: RFFonsize(10),
        color: '#000',
    },
    txtItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(10),
        color: '#828282',
    },
    styTxtLabel: {
        color: '#828282',
        fontSize: RFFonsize(14),
        fontFamily: 'Nunito-Bold',
    },
    styWrapInutName: {
        borderRadius: 4,
        marginTop: 8,
        justifyContent: 'center',
        height: 40,
        borderWidth: .5,
        borderColor: '#56CCF2',
        marginHorizontal: 15
    },
    styWrapInutTime: {
        borderRadius: 4,
        marginTop: 8,
        width: 60,
        height: 30,
        justifyContent: 'center',
        borderColor: '#56CCF2',
        borderWidth: 0.5
    },
    navbar: {
        top: 5,
        left: 0,
        right: 0,
        height: NAVBAR_HEIGHT - 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
})