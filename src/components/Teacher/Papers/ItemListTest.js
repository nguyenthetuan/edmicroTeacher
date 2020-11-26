import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import Common from '../../../utils/Common';
import FastImage from 'react-native-fast-image';

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
        const subjectCode =
            item.subjectCode && item.subjectCode.length > 0
                ? item.subjectCode[0]
                : '';
        let gradeCode =
            item.gradeCode && item.gradeCode.length > 0 ? item.gradeCode[0] : '';
        gradeCode = gradeCode.substring(1);
        const payloadAssignment = {
            gradeCode,
            subjectCode,
        };

        return (
            <View
                style={[
                    styles.itemTest,
                    { borderColor: Common.getBackroundSubject(subjectCode) },
                ]}
                onPress={this._handleClickDetail(payloadAssignment)}>
                <TouchableOpacity
                    onPress={() => this.props.onOpenModal(payloadAssignment)}>
                    <View
                        style={[
                            styles.topTest,
                            { backgroundColor: Common.getBackroundSubject(subjectCode) },
                        ]}>
                        <Text numberOfLines={1}
                            style={styles.txtName}>{item.name}</Text>
                        <View
                            style={{
                                alignItems: 'center',
                                width: 30,
                                justifyContent: 'center',
                            }}>
                            <FastImage
                                style={{ width: 4, height: 12 }}
                                source={require('../../../asserts/icon/icEdit.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this._handleClickDetail(payloadAssignment)}>
                    <View style={styles.bodyTest}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <View style={styles.flexSubject}>
                                <FastImage
                                    source={Common.getIconSubject(subjectCode)}
                                    style={{ width: 23, height: 23, marginLeft: 1, borderRadius: 20 }}
                                />
                                <Text style={styles.txtQuestion}> {subjectCode}</Text>
                            </View>
                            <View style={styles.flexSenten}>
                                <FastImage
                                    source={require('../../../asserts/icon/icon_sentenTea.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                                <Text style={styles.txtQuestion}>{item.totalQuestion} câu</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.flexSenten}>
                                <FastImage
                                    source={require('../../../asserts/icon/icon_sentenTea.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                                <Text style={styles.txtQuestion}>Lớp {gradeCode}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <View>
                                {
                                    item.assignmentType
                                        ?
                                        <View style={styles.flexParac}>
                                            <FastImage
                                                source={require('../../../asserts/icon/icon_examparacExamv3.png')}
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
                                        source={require('../../../asserts/icon/icon_paracComplete.png')}
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
                </TouchableOpacity>
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
    },
    txtName: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        lineHeight: 19,
        color: '#FFF',
        alignSelf: 'center',
        width: "90%"
    },
    itemTest: {
        borderRadius: 4,
        borderWidth: 1,
        overflow: 'hidden',
        marginTop: 22,
    },
    bodyTest: {
        paddingHorizontal: 11,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 14,
    },
    txtQuestion: {
        fontFamily: 'Nunito',
        fontSize: 10,
        lineHeight: 14,
        color: '#000',
        marginLeft: 5,
        alignSelf: 'center',
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
        fontSize: 10,
        lineHeight: 14,
        color: '#000',
        alignSelf: 'center',
        marginHorizontal: 5
    },
    flexSubject: {
        flexDirection: 'row',
    },
    flexSenten: {
        flexDirection: 'row'
    }
});