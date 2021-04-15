import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image
} from 'react-native';
import { convertSeconds } from '../../../utils/Utils';
import { RFFonsize } from '../../../utils/Fonts';
import _ from 'lodash';
import { COL_STATISTATIC_WIDTH } from '../../../constants/const';

export class HeaderItem extends Component {
    render() {
        return (
            <View style={styles.containerHeader}>
                <View style={styles.itemHeader}>
                    <Image
                        source={require('../../../asserts/icon/ic_time_evaluate.png')}
                    />
                    <Text style={styles.txtHeader}>Thời gian</Text>
                </View>
                <View style={styles.itemHeader}>
                    <Image
                        source={require('../../../asserts/icon/ic_right_evaluate.png')}
                    />
                    <Text style={styles.txtHeader}>Câu đúng</Text>
                </View>
                <View style={styles.itemHeader}>
                    <Image
                        source={require('../../../asserts/icon/ic_wrong_evaluate.png')}
                    />
                    <Text style={styles.txtHeader}>Câu sai</Text>
                </View>
                <View style={styles.itemHeader}>
                    <Image
                        source={require('../../../asserts/icon/ic_skip_evaluate.png')}
                    />
                    <Text style={styles.txtHeader}>Bỏ qua</Text>
                </View>
                <View style={styles.itemHeader}>
                    <Image
                        source={require('../../../asserts/icon/ic_point_evaluate.png')}
                    />
                    <Text style={styles.txtHeader}>Điểm</Text>
                </View>
            </View>
        );
    }
}

class RenderItem extends Component {
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
            <View style={{ backgroundColor: '#2D9CDB' }}>
                <View style={styles.containerItem}>
                    {!_.isEmpty(scoreCurrent) ? (
                        <>
                            <Text style={styles.txtItem}>
                                {convertSeconds(scoreCurrent.durationDoing) || 0}
                            </Text>
                            <Text style={styles.txtItem}>
                                {scoreCurrent.totalCorrect || 0}
                            </Text>
                            <Text style={styles.txtItem}>
                                {scoreCurrent.totalIncorrect || 0}
                            </Text>
                            <Text style={styles.txtItem}>{scoreCurrent.totalSkip || 0}</Text>
                            <Text style={styles.txtItem}>{scoreCurrent.score || 0}</Text>
                        </>
                    ) : (
                            <>
                                <Text style={styles.txtItem}>_</Text>
                                <Text style={styles.txtItem}>_</Text>
                                <Text style={styles.txtItem}>_</Text>
                                <Text style={styles.txtItem}>_</Text>
                                <Text style={styles.txtItem}>_</Text>
                            </>
                        )}
                </View>
            </View>
        );
    }
}

export default RenderItem;


const styles = StyleSheet.create({
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
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#2D9CDB',
    },
    txtHeader: {
        fontSize: RFFonsize(8),
        color: '#fff',
        fontFamily: 'Nunito-Regular',
    },
    itemHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: COL_STATISTATIC_WIDTH
    },
    containerItem: {
        backgroundColor: '#C6F1FF',
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
        flex: 1,
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
        fontSize: RFFonsize(12),
        color: '#000',
        fontFamily: 'Nunito-Regular',
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
        borderBottomWidth: 0.5,
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
        backgroundColor: '#2D9CDB',
        borderRadius: 11,
        paddingTop: 5,
    },
});
