import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image
} from 'react-native';
import _ from 'lodash';
import Common from '../../../utils/Common';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { RFFonsize } from '../../../utils/Fonts';
import Kcolor from '../../../constants/Kcolor';
import shadowStyle from '../../../themes/shadowStyle';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    _handleClickDetail = payloadAssignment => () => {
        this.props.onOpenModal(payloadAssignment, false);
    };

    shouldComponentUpdate = (prevProps, nextState) => {
        if (this.props.item != prevProps.item) {
            return true;
        }
        return false;
    };

    render() {
        const item = this.props.item;
        const { shadowBtn } = shadowStyle;
        let subjectCode =
            item.subjectCode && item.subjectCode.length > 0
                ? item.subjectCode[0]
                : '';
        if (item.subjectCode?.length > 1) {
            subjectCode = 'LIENMONHOC'
        }
        let gradeCode =
            item.gradeCode && item.gradeCode.length > 0 ? item.gradeCode[0] : '';
        gradeCode = gradeCode?.substring(1);
        const payloadAssignment = {
            gradeCode,
            subjectCode,
        };
        // const time = item.timeCreate;
        // const dateNow = new Date().getTime() / 1000;
        // const dateCreated = new Date(time).getTime();
        // console.log("dateNow     :" + dateNow);
        // console.log("dateCreated :" + dateCreated);
        // let isPaperNew = dateNow - dateCreated <= 24 * 60 * 60;
        // console.log(isPaperNew);
        return (
            <View
                style={[
                    styles.itemTest,
                    shadowBtn,
                    // { borderColor: item.status === 4 ? Kcolor.headingPrimaryColor : Kcolor.headingSecondaryColor },
                ]}
                onPress={this._handleClickDetail(payloadAssignment)}>
                <View
                    style={[
                        styles.topTest,
                        { backgroundColor: item.status === 4 ? Kcolor.headingPrimaryColor : Kcolor.headingSecondaryColor },
                    ]}>
                    <Text numberOfLines={1}
                        style={styles.txtName}>
                        {item.name}
                    </Text>
                    {/* {isPaperNew == true ?
                        <Image source={require('../../../asserts/icon/icon_new24h.png')} style={styles.new24h} />
                        : null
                    } */}
                    <TouchableWithoutFeedback
                        onPress={() => this.props.onOpenModal(payloadAssignment)}
                        hitSlop={{ top: 10, left: 10, right: 10, left: 10 }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                width: 30,
                                justifyContent: 'center',
                                height: 25,
                            }}>
                            <Text style={{
                                transform: [{ rotate: '90deg' }],
                                fontSize: RFFonsize(14), color: '#fff', fontWeight: '900', fontFamily: 'Nunito-Bold', left: 5
                            }}>...</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <TouchableWithoutFeedback onPress={this._handleClickDetail(payloadAssignment)}>
                    <View style={styles.bodyTest}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                            <View style={styles.flexSubject}>
                                <FastImage
                                    source={Common.getIconSubject(subjectCode)}
                                    style={{ width: 23, height: 23, marginLeft: 1, borderRadius: 40 }}
                                />
                                <Text numberOfLines={2}
                                    style={[styles.txtQuestion, { width: 70 }]}>
                                    {Common.getDisplaySubject(subjectCode)}</Text>
                            </View>
                            <View style={styles.flexSenten}>
                                {item.totalQuestion == 0 ?
                                    <View style={styles.flexSubject}>
                                        <FastImage
                                            source={require('../../../asserts/icon/icon_remakeParacV3.png')}
                                            style={styles.alignIcon}
                                        />
                                        <Text style={styles.zeroQuestion}>{item.totalQuestion} câu</Text>
                                    </View>
                                    :
                                    <View style={styles.flexSubject}>
                                        <FastImage
                                            source={require('../../../asserts/icon/icon_remakeParacV3.png')}
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <Text style={styles.txtQuestion}>{item.totalQuestion} câu</Text>
                                    </View>
                                }
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={styles.flexSenten}>
                                <FastImage
                                    source={require('../../../asserts/icon/icon_remakeClassV3.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                                <Text style={styles.txtQuestion}>Lớp {gradeCode}</Text>
                            </View>
                            <View style={[styles.flexSenten, { marginTop: 10 }]}>
                                <FastImage
                                    source={require('../../../asserts/icon/icon_clockTimeV3.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                                <Text numberOfLines={2}
                                    style={[styles.txtQuestion]}>
                                    {
                                        item.assignmentType
                                            ?
                                            item.duration / 60 + ' ' + 'phút'
                                            :
                                            `Không giới hạn`
                                    }
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', marginLeft: 20, marginRight: 5, flex: 1 }}>
                            <View>
                                {
                                    item.assignmentType
                                        ?
                                        <View style={styles.flexParac}>
                                            <FastImage
                                                source={require('../../../asserts/icon/icon_remakeHatV3.png')}
                                                style={{ height: 25, width: 25 }}
                                            />
                                            <Text style={styles.txtButtomPractice}>
                                                {item.assignmentType ? 'Bài kiểm tra' : 'Bài tự luyện'}
                                            </Text>
                                        </View>
                                        :
                                        <View style={styles.flexParac}>
                                            <FastImage
                                                source={require('../../../asserts/icon/icon_paracClass.png')}
                                                style={{ height: 25, width: 25 }}
                                            />
                                            <Text style={styles.txtButtomPractice}>
                                                {item.assignmentType ? 'Bài kiểm tra' : 'Bài tự luyện'}
                                            </Text>
                                        </View>
                                }
                            </View>
                            <View
                                style={styles.flexToParac}
                            >
                                {item.status === 4
                                    ?
                                    <FastImage
                                        source={require('../../../asserts/icon/icon_toSendV3.png')}
                                        style={{ height: 25, width: 25 }}
                                    />
                                    :
                                    <FastImage
                                        source={require('../../../asserts/icon/icon_paractoFinish.png')}
                                        style={{ height: 25, width: 25 }}
                                    />
                                }
                                {item.status === 4
                                    ?
                                    <Text style={[styles.txtButtomPractice, { color: "#000" }]}>
                                        {item.status === 4 ? 'Đã giao' : 'Chưa giao'}
                                    </Text>
                                    :
                                    <Text style={[styles.txtButtomPractice, { color: item.stattus === 4 ? '#000' : '#c4c4c4' }]}>
                                        {item.status === 4 ? 'Đã giao' : 'Chưa giao'}
                                    </Text>
                                }
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    buttomMoadal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    topTest: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 12,
        paddingVertical: 2,
        height: 30,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    txtName: {
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        color: '#FFF',
        alignSelf: 'center',
        width: "85%",
    },
    itemTest: {
        // borderRadius: 5,
        // borderWidth: 0.5,
        marginTop: 16,
    },
    bodyTest: {
        paddingHorizontal: 11,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        // flex: 1,
    },
    txtQuestion: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(14),
        color: '#000',
        marginLeft: 5,
        alignSelf: 'center',
        // width: 80
    },
    flexParac: {
        flexDirection: 'row'
    },
    flexToParac: {
        flexDirection: 'row',
        marginTop: 8.53
    },
    txtButtomPractice: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(14),
        color: '#000',
        alignSelf: 'center',
        marginHorizontal: 5
    },
    flexSubject: {
        flexDirection: 'row',
    },
    flexSenten: {
        flexDirection: 'row',
    },
    new24h: {
        width: 25,
        height: 25,
        alignSelf: 'center'
    },
    zeroQuestion: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(14),
        color: '#000',
        marginLeft: 5,
        alignSelf: 'center',
        textDecorationLine: 'line-through',
        bottom: 4
    }

});