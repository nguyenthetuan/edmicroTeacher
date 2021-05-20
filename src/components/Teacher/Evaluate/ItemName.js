import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { convertSeconds } from '../../../utils/Utils';
import { RFFonsize } from '../../../utils/Fonts';
import _ from 'lodash';
import { COL_STATISTATIC_WIDTH } from '../../../constants/const';

const { width, height } = Dimensions.get('window');

export class HeaderName extends Component {
    render() {
        const { currentExamTest } = this.props;
        return (
            <View style={styles.wrapContain}>
                <View style={{ alignItems: 'flex-start' }}>
                    <View style={{ alignItems: 'center',marginLeft:6 }}>
                        <Image source={require('../../../asserts/icon/iconUser.png')} />
                        <Text style={styles.textName}>Họ và tên</Text>
                    </View>
                </View>
                {!_.isEmpty(currentExamTest.examName) && (
                    <View style={styles.wrapTitle}>
                        <Text style={styles.styTxtExaName}>{currentExamTest.examName}</Text>
                        <Text style={styles.styTxtName}>{currentExamTest.name}</Text>
                    </View>
                )}
            </View>
        );
    }
}

class ItemName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
        };
    }

    _handleClick = () => {
        this.setState({ showInfo: !this.state.showInfo });
    };

    shouldComponentUpdate = (prevProps, nextState) => {
        if (
            prevProps.item != this.props.item ||
            this.state.showInfo != nextState.showInfo
        ) {
            return true;
        }
        return false;
    };

    render() {
        const { item, scores } = this.props;
        const scoreCurrent =
            scores.find(element => item.studentId == element.studentId) || {};
        const { showInfo } = this.state;
        return (
            <View style={{ backgroundColor: '#03466C' }}>
                <View style={styles.containerItem}>
                    <View style={styles.viewItemName}>
                        <View style={{}}>
                            <Image
                                source={require('../../../asserts/icon/ic_name_evaluate.png')}
                            />
                            {/* <View style={[styles.dotOnline, { backgroundColor: '#91EDC6' }]} /> */}
                        </View>
                        <View style={{ marginLeft: 12 }} onPress={this._handleClick}>
                            {showInfo ? (
                                <Text style={styles.txtNameShow} numberOfLines={1}>
                                    {item.studentName}
                                </Text>
                            ) : (
                                    <Text style={styles.txtName} numberOfLines={1}>
                                        {item.studentName}
                                    </Text>
                                )}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default ItemName;

const styles = StyleSheet.create({
    textName: {
        color: '#fff',
        fontSize: 10,
        marginTop:7
    },
    container: {
        flex: 1,
        minHeight: 200,
    },
    btnStatistics: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    txtStatistics: {
        fontSize: RFFonsize(14),
        color: '#2D9CDB',
        marginStart: 8,
        fontFamily: 'Nunito-Regular',
    },
    imgStatistics: {
        alignSelf: 'flex-end',
        marginEnd: 16,
        width: 220,
        height: 200,
        position: 'absolute',
    },
    list: {
        flex: 1,
        backgroundColor: 'gray'
    },
    containerHeader: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: '#2D9CDB',
        borderTopStartRadius: 11,
        borderTopEndRadius: 11,
    },
    txtHeader: {
        fontSize: RFFonsize(8),
        color: '#fff',
        fontFamily: 'Nunito-Regular',
    },
    itemHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width * (1 / 8),
    },
    containerItem: {
        backgroundColor: '#03466C',
        marginBottom: 0.5,
        flexDirection: 'row',
        height: 40,
    },
    txtItemName: {
        marginStart: 10,
        fontSize: RFFonsize(10),
        color: '#000',
        fontFamily: 'Nunito-Bold',
        borderWidth: 1,
    },
    viewItemName: {
        justifyContent: 'space-between',
        alignItems: 'center',
        // width: width * (2.9 / 8),
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingRight: 10,
        zIndex: 10,
    },
    txtItem: {
        textAlign: 'center',
        alignSelf: 'center',
        width: COL_STATISTATIC_WIDTH,
        fontSize: RFFonsize(10),
        color: '#000',
        fontFamily: 'Nunito-Regular',
    },
    dotOnline: {
        position: 'absolute',
        bottom: 0,
        right: -3,
        height: 4,
        width: 4,
        borderRadius: 2,
    },
    txtName: {
        fontSize: RFFonsize(10),
        color: '#fff',
        fontFamily: 'Nunito-Regular',
        fontWeight:'bold'
    },
    txtNameShow: {
        fontSize: RFFonsize(12),
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: width,
        borderRadius: 5,
    },
    wrapEmpty: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtEmpty: {
        fontFamily: 'Nunito-Regular',
        color: '#828282',
        marginTop: 20,
    },
    wrapTitle: {
        marginHorizontal: 10,
        borderBottomColor: '#FFF',
    },
    styTxtExaName: {
        color: '#FFF',
        fontFamily: 'Nunito-Regular',
    },
    styTxtName: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
    },
    wrapContain: {
        backgroundColor: '#03466C',
        paddingTop: 5,
        height: 50,
        borderTopLeftRadius:11
    },
});
