import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownStudent from '../Papers/DropdownStudent';
Icon.loadFont();
import moment from 'moment';
import Toast, { DURATION } from 'react-native-easy-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dataHelper from '../../../utils/dataHelper';
import apiMission from '../../../services/apiMission';
import AppIcon from '../../../utils/AppIcon';
import ModalSelectStudent from '../Papers/ModalSelectStudent';
const { width, height } = Dimensions.get('screen');
import { connect } from 'react-redux';
import {
    fetchListMission,
} from '../../../actions/missionAction';

class ItemClass extends Component {
    state = {
        status: this.props.status,
        isDatePickerVisible: false,
        timeEnd: this.props.item.timeEnd * 1000 || new Date().getTime(),
        // timeEnd: new Date().getTime() + 190000,
        students: null,
        showPickSutdent: false,
        // buttonText: this.students ? `${this.students} học sinh` : 'Tất cả học sinh',
        buttonText: ''
    }

    async componentDidMount() {
        const { token } = await dataHelper.getToken();
        const _id = this.props.missionId;
        if (this.props.status) {
            apiMission.getAssignByMission({ token, _id }).then(rp => {
                if (rp) {
                    this.setState({ students: rp.classList[0].students });
                }
            })
        }
    }

    handlePickStudent = async (students) => {
        await this.setState({ showPickSutdent: !this.state.showPickSutdent });
        if (students) {
            // const { students } = this.state;
            // let students = item.students.length;
            this.setState({ buttonText: students ? `${students}` : 'Tất cả học sinh' });
        }
    }

    changeStatebuttonText = (students) => {
        if (students) {
            this.setState({ buttonText: students ? `${students}` : 'Tất cả học sinh' });
        }
    }

    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    handleConfirm = (date) => {
        this.setState({ timeEnd: date });
        this.hideDatePicker();
    };

    validate = () => {
        const { timeEnd } = this.state;
        const timeStart = new Date().getTime();
        if (timeStart >= timeEnd) {
            this.props.onToast('Thời gian không hợp lệ!');
            return false
        }
        return true;
    }

    onAssignment = async () => {
        if (this.validate()) {
            const { item, missionId } = this.props;
            const { timeEnd } = this.state;
            const params = {
                classId: item.classId,
                endTime: moment(timeEnd).unix(),
                startTime: 0,
                missionId: missionId,
                studentId: this.dropdownStudent.students(),
            }
            const { token } = await dataHelper.getToken();
            try {
                const response = await apiMission.assignedMission({ token, params });

                if (response && response.success) {
                    this.setState({ status: 1 });
                    this.props.onToast('Giao nhiêm vụ thành công');
                    setTimeout(() => {
                        this.props.getListMission({ token });
                        this.props.getAssignmentByMission({ token, _id: missionId });
                    }, 1000);
                } else {
                    this.props.onToast(response.message);
                }
            } catch (error) {
                this.props.onToast('Có lỗi xảy ra vui lòng thử lại!')
            }
        }
    }

    goToMissionStatisticsScreen = () => {
        const { item } = this.props;
        this.props.navigation.navigate('MissionStatisticsScreen', { _id: item.assignId });
    }

    render() {
        const { item } = this.props;
        const dataItem = {
            classCode: item.classId
        }
        const { isDatePickerVisible, timeEnd, status } = this.state;
        return (
            <View style={styles.containerItem}>
                <View style={styles.headerItem}>
                    <Text
                        style={styles.txtTitleItem}
                        numberOfLines={1}
                    >
                        {item.className}
                    </Text>
                </View>
                <View style={styles.contentItem}>
                    <View style={styles.viewDate}>
                        <View style={styles.iconTxt}>
                            <Image source={AppIcon.icon_timeEndV3} style={styles.sizeIcon} />
                            <Text style={styles.txtTitleItemContent}>Thời gian kết thúc: </Text>
                        </View>
                        <View style={styles.iconTxt1}>
                            <Image source={AppIcon.icon_missonToV3} style={styles.sizeIcon} />
                            <Text style={[styles.txtTitleItemContent, { marginRight: -8 }]}>Học sinh được giao: </Text>
                        </View>
                    </View>
                    <View style={styles.viewDate1}>
                        <TouchableOpacity
                            disabled={status}
                            onPress={this.showDatePicker}
                            style={styles.btnDate}>
                            <Text numberOfLines={1} style={styles.txtContentItem}>
                                {moment(timeEnd).format('DD-MM-YYYY, HH:mm')}</Text>
                        </TouchableOpacity>
                        {/* <DropdownStudent
                            ref={ref => this.dropdownStudent = ref}
                            dataItem={dataItem}
                            style={styles.dropDown}
                            // onPress={this.handlePickStudent()}
                            dropdownStyle={{ width: width - 32 - 54 - 100 }}
                            options={this.state.students || item.students}
                            status={status}
                        /> */}
                        <TouchableOpacity onPress={() => { this.handlePickStudent() }}
                            style={styles.dropZuCha}>
                            <View style={styles.borDropRight}>
                                <Icon name={this.showPickSutdent ? "chevron-up" : "chevron-down"} color={'#fff'} size={13} />
                            </View>
                            <Text style={{ color: '#2D9CDB', left: 15 }}>{this.state.buttonText || item.students.length + ' học sinh'}</Text>
                        </TouchableOpacity>

                        <ModalSelectStudent
                            ref={ref => this.dropdownStudent = ref}
                            dataItem={dataItem}
                            // style={{ width: width - 32 - 54 - 90, marginTop: 10, }}
                            style={{ width: width - 32, marginTop: 8, height: 40, }}
                            dropdownStyle={{ width: width - 32 }}
                            options={this.state.students || item.students}
                            status={status}
                            visibleModal={this.state.showPickSutdent}
                            handlePickStudent={this.handlePickStudent}
                            changeStatebuttonText={this.changeStatebuttonText}
                        />
                        {status ?
                            // <TouchableOpacity
                            //     onPress={this.goToMissionStatisticsScreen}
                            //     style={[styles.btnAssignment, { backgroundColor: '#FD9F4C' }]}>
                            //     <Text style={styles.txtAssignment}>Xem tiến độ</Text>
                            //     <Icon name={'check'} color={'#fff'} size={20} />
                            // </TouchableOpacity>
                            null
                            :
                            <TouchableOpacity
                                onPress={this.onAssignment}
                                style={styles.btnAssignment}>
                                <Text style={styles.txtAssignment}>Giao nhiệm vụ</Text>
                                <Icon name={'check'} color={'#fff'} size={12} style={styles.widthCheck} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {__DEV__ ? null : <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                />}
            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getListMission: payload => dispatch(fetchListMission(payload)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemClass);

const styles = StyleSheet.create({
    containerItem: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#56CCF2',
        marginBottom: 16,
        marginHorizontal: 16,
        marginTop: 15
    },
    headerItem: {
        height: 30,
        backgroundColor: '#56CCF2',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    txtTitleItem: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        color: '#fff',
        textTransform: 'capitalize',
    },
    contentItem: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    txtTitleItemContent: {
        fontFamily: 'Nunito-Regular',
        fontSize: 12,
        color: '#828282',
        marginLeft: 5
        // width: 80
    },
    btnAssignment: {
        alignSelf: 'flex-end',
        marginTop: 12,
        backgroundColor: '#56BB73',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    txtAssignment: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        color: '#fff',
        marginRight: 10,
        marginLeft: 10,
    },
    checkAllow: {
        width: 14,
        height: 14,
        borderWidth: 1,
        borderColor: '#56CCF2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 7,
        borderRadius: 2,
    },
    btnCheckAllow: {
        marginStart: 80,
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    txtCheckAllow: {
        fontFamily: 'Nunito-Regular',
        fontSize: 10,
        color: '#828282'
    },
    viewName: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputName: {
        height: 24,
        flex: 1,
        backgroundColor: '#cccccc',
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    txtContentItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: 12,
        color: '#CF616C'
    },
    viewDate: {
        flexDirection: 'column'
    },
    viewDate1: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginRight: 10,
    },
    btnDate: {
        height: 25,
        flex: 1,
        backgroundColor: '#F2F2F2',
        borderRadius: 4,
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    iconTxt: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    iconTxt1: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 20
    },
    sizeIcon: {
        alignSelf: 'center',
        marginLeft: 13
    },
    dropDown: {
        marginTop: 10,
        backgroundColor: '#F2F2F2',
    },
    widthCheck: {
        marginRight: 15,
        alignSelf: 'center'
    },
    dropZuCha: {
        width: width - 32 - 54 - 150,
        marginTop: 8,
        height: 25,
        // borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'rgba(86, 204, 242, 0.3)',
        borderColor: '#56CCF2',
        justifyContent: 'center'
    },
    borDropRight: {
        width: 30,
        height: 25,
        backgroundColor: '#56CCF2',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
    }
})
