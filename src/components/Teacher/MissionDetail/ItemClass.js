import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropdownStudent from '../Papers/DropdownStudent';
Icon.loadFont();
import moment from 'moment';
import Toast, { DURATION } from 'react-native-easy-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dataHelper from '../../../utils/dataHelper';
import apiMission from '../../../services/apiMission';
const { width, height } = Dimensions.get('screen');

export default class ItemClass extends Component {
    state = {
        status: this.props.status,
        isDatePickerVisible: false,
        timeEnd: this.props.item.timeEnd * 1000 || new Date().getTime()
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
                students: this.dropdownStudent.students(),
            }
            const { token } = await dataHelper.getToken();
            try {
                const response = await apiMission.assignedMission({ token, params });
                if (response && response.success) {
                    this.setState({ status: 1 });
                    this.props.onToast(response.message);
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

    render() {
        const { item } = this.props;
        const dataItem = {
            classCode: item.classId
        }
        const { isDatePickerVisible, timeEnd, status } = this.state;
        return (
            <View style={styles.containerItem}>
                <View style={styles.headerItem}>
                    <Text style={styles.txtTitleItem} numberOfLines={1}>{item.className}</Text>
                </View>
                <View style={styles.contentItem}>
                    <View style={styles.viewDate}>
                        <Text style={styles.txtTitleItemContent}>Kết thúc: </Text>
                        <TouchableOpacity
                            onPress={this.showDatePicker}
                            style={styles.btnDate}>
                            <Text numberOfLines={1} style={styles.txtContentItem}>
                                {moment(timeEnd).format('DD-MM-YYYY, HH:mm')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewDate}>
                        <Text style={styles.txtTitleItemContent}>Học sinh: </Text>
                        <DropdownStudent
                            ref={ref => this.dropdownStudent = ref}
                            dataItem={dataItem}
                            style={{ width: width - 32 - 54 - 80, height: 25 }}
                            dropdownStyle={{ width: width - 32 - 54 - 80 }}
                            options={item.students}
                        />
                    </View>
                    {status ?
                        // <TouchableOpacity
                        //     onPress={this.onAssignment}
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
                            <Icon name={'check'} color={'#fff'} size={20} />
                        </TouchableOpacity>

                    }
                </View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    containerItem: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#56CCF2',
        marginBottom: 16,
        marginHorizontal: 16
    },
    headerItem: {
        height: 30,
        backgroundColor: '#2D9CDB',
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
        paddingHorizontal: 26,
        paddingVertical: 12
    },
    txtTitleItemContent: {
        fontFamily: 'Nunito-Regular',
        fontSize: 12,
        color: '#000',
        width: 80
    },
    btnAssignment: {
        alignSelf: 'flex-end',
        marginTop: 10,
        backgroundColor: '#56BB73',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    txtAssignment: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        color: '#fff',
        marginRight: 10
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
        color: '#DB3546'
    },
    viewDate: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    btnDate: {
        height: 25,
        flex: 1,
        backgroundColor: '#D9EBF5',
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 8
    },
})
