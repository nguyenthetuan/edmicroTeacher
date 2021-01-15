import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    FlatList,
    TextInput,
    Animated,
    Keyboard,
    Modal,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import apiPapers from '../../../services/apiPapersTeacher';
import _ from 'lodash';
import Toast, { DURATION } from 'react-native-easy-toast';
import dataHelper from '../../../utils/dataHelper';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import { connect } from 'react-redux';
import { updateExamListAction } from '../../../actions/paperAction';
import { RFFonsize } from '../../../utils/Fonts';

const { width } = Dimensions.get('window');

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
        }
    }

    componentDidMount() {
        const { data, listGrades, listSubjects } = this.props.navigation.state.params;
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
                    }
                });

            data.subjectCode.map(subjectId => {
                const index = _.indexOf(listSubjectTmp.map(e => e.code), subjectId);
                if (index > -1) {
                    listSubjectTmp[index].isActive = true;
                    listSubjectTmp = this.moveArrayItem(listSubjectTmp, index, 0);
                }
            });

            this.setState({
                ...this.state,
                name: data.name,
                grade: data.gradeCode[0],
                subject: data.subjectCode[0],
                time: `${data.duration / 60}`,
                gradeCode: data.gradeCode,
                subjectCode: data.subjectCode,
                listGrades: listGradeTmp,
                listSubjects: listSubjectTmp,
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

    activeGrade = item => {
        const { gradeCode } = this.state;
        const { listGrades } = this.props.navigation.state.params;

        let gradeCodeTmp = gradeCode;
        let listGradeTmp = listGrades.map(e => {
            return { ...e, isActive: false };
        });

        const index = _.indexOf(gradeCodeTmp, item.gradeId);

        index < 0
            ? (gradeCodeTmp = [...gradeCodeTmp, ...[item.gradeId]])
            : (gradeCodeTmp = [
                ...gradeCodeTmp.slice(0, index),
                ...gradeCodeTmp.slice(index + 1),
            ]);

        gradeCodeTmp
            .sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)))
            .map(gradeId => {
                const i = _.indexOf(listGradeTmp.map(e => e.gradeId), gradeId);
                if (i > -1) {
                    listGradeTmp[i].isActive = true;
                    listGradeTmp = this.moveArrayItem(listGradeTmp, i, 0);
                }
            });

        this.setState({
            gradeCode: gradeCodeTmp,
            listGrades: listGradeTmp,
        });
    };

    activeSubject = item => {
        const { subjectCode } = this.state;
        const { listSubjects } = this.props.navigation.state.params;

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

        this.setState({
            subjectCode: subjectCodeTmp,
            listSubjects: listSubjectsTmp,
        });
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

    _validate = () => {
        const { name, time, gradeCode, subjectCode } = this.state;
        const { data } = this.props.navigation.state.params;

        if (name.trim() === '') {
            this.refs.toast.show(
                'Tên bài tập không được để trống!',
                DURATION.LENGTH_LONG,
            );
            return;
        }

        if (!gradeCode.length) {
            this.refs.toast.show('Vui lòng chọn khối lớp!', DURATION.LENGTH_LONG);
            return;
        }

        if (!subjectCode.length) {
            this.refs.toast.show('Vui lòng chọn môn học!', DURATION.LENGTH_LONG);
            return;
        }

        if (data.assignmentType === 1 && time.trim() === '') {
            this.refs.toast.show('Vui lòng nhập thời gian!', DURATION.LENGTH_LONG);
            return;
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
            }
            console.log("🚀 ~ file: EditConfig.js ~ line 269 ~ EditConfig ~ onUpdate= ~ body", body)

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

    setText = ({ key, text }) => {
        var stateCopy = Object.assign({}, this.state);
        stateCopy[key] = text;
        this.setState(stateCopy);
    };

    render() {
        const { name, loading, time, success, message, updating } = this.state;
        const { data } = this.props.navigation.state.params;
        return (
            <SafeAreaView style={styles.safeView}>
                <HeaderNavigation
                    title={'Cấu hình bộ đề'}
                    navigation={this.props.navigation}
                    color={"#fff"}
                />
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                    <ScrollView
                        style={{ backgroundColor: '#fff' }}
                    >
                        <View style={styles.wrapContent}>
                            <View>
                                <Text style={styles.styTxtLabel}>
                                    Tên bài tập
                          </Text>
                                <View
                                    style={{
                                        borderRadius: 4,
                                        marginTop: 8,
                                        justifyContent: 'center',
                                        height: 40,
                                        borderWidth: .5,
                                        borderColor: '#56CCF2',
                                        marginHorizontal: 15
                                    }}>
                                    <TextInput
                                        numberOfLines={1}
                                        value={name}
                                        style={styles.txtTexinput}
                                        onChangeText={text =>
                                            this.setText({ key: 'name', text })
                                        }
                                    />
                                </View>
                                <View style={{ marginTop: 8 }}>
                                    <Text style={styles.styTxtLabel}>
                                        Khối lớp
                        </Text>
                                    {this._renderGrade()}
                                </View>
                                <View style={{ marginTop: 8 }}>
                                    <Text style={styles.styTxtLabel}>
                                        Môn học
                        </Text>
                                    {this._renderSubject()}
                                </View>
                                {data && data.assignmentType ? (
                                    <View style={{ marginTop: 8 }}>
                                        <Text style={styles.styTxtLabel}>
                                            Thời gian
                                </Text>
                                        <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', left: 0.05 * width }}>
                                            <View
                                                style={{
                                                    borderRadius: 4,
                                                    marginTop: 8,
                                                    width: 60,
                                                    height: 30,
                                                    justifyContent: 'center',
                                                    borderColor: '#56CCF2',
                                                    borderWidth: 0.5
                                                }}>
                                                <TextInput
                                                    value={time}
                                                    style={styles.txtTexinput}
                                                    onChangeText={text =>
                                                        this.setText({ key: 'time', text })
                                                    }
                                                />
                                            </View>
                                            <Text style={[styles.styTxtLabel, { top: 4 }]}>Phút</Text>
                                        </View>
                                    </View>
                                ) : null}
                                <View style={styles.footer}>
                                    <RippleButton
                                        onPress={() => this.props.onVisible(false)}>
                                        <View style={styles.buttomCancel}>
                                            <Text style={styles.txtButtom}>Huỷ</Text>
                                        </View>
                                    </RippleButton>
                                    <View style={{ marginStart: 40 }}>
                                        <RippleButton onPress={this.onUpdate}>
                                            <View style={styles.buttomSave}>
                                                <Text style={styles.txtButtom}>Lưu</Text>
                                            </View>
                                        </RippleButton>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
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
        backgroundColor: '#2D9CDB',
        marginBottom: -50
    },
    wrapContent: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 15,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
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
        fontSize: 14,
        color: '#FFF',
    },
    txtTexinput: {
        paddingLeft: 12,
        fontSize: 12,
        color: '#2D9CDB',
        fontFamily: 'Nunito-Regular',
        padding: 0
    },
    footer: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-evenly',
        marginTop: 50
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
        fontSize: 12,
        color: '#FFF',
    },
    buttomSave: {
        backgroundColor: '#56CCF2',
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
        fontSize: 10,
        color: '#000',
    },
    txtItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: 10,
        color: '#828282',
    },
    styTxtLabel: {
        color: '#828282',
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
        left: 15
    }
})