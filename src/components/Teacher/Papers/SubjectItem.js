import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Image,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';
export default class SubjectItem extends Component {
    openModalSubject = () => {
        this.props.refModalSubject.onOpen()
    }

    renderItem = ({ item }) => {
        const { listSubjects } = this.props;
        let data = listSubjects.filter(ele => ele.code == item);
        data = data && data[0];
        return (
            <View style={styles.buttomActive}>
                <RippleButton style={styles.styIcon} onPress={() => this.props.activeSubject(item)}>
                    <Image source={AppIcon.icon_closeItemV3} style={styles.widthClose} />
                </RippleButton>
                <Text style={styles.txtItemActive}>{data.name}</Text>
            </View>
        )
    }

    render() {
        const { subjectActive } = this.props;
        return (
            <View>
                <View style={styles.styWrapLabel}>
                    <Text style={styles.txtClass}>Môn học</Text>
                </View>
                <View style={styles.styWrapClass}>
                    {/* <Image
                        style={{ marginRight: 10 }}
                        source={require('../../../asserts/icon/subject.png')}
                        resizeMode={'contain'}
                    /> */}
                    <View style={styles.styWrapClassIn}>
                        <FlatList
                            data={subjectActive}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={<Text style={styles.styTxtEmpty}>Chọn môn</Text>}
                        />
                        <RippleButton
                            onPress={this.openModalSubject}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Image
                                source={require('../../../asserts/appIcon/icon_filter_plus.png')}
                                resizeMode={'contain'}
                                style={{ tintColor: '#2D9CDB' }}
                            />
                        </RippleButton>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    txtClass: {
        color: '#000',
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        textAlign: 'center',
    },
    buttomClass: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        paddingVertical: 3,
        paddingHorizontal: 5,
    },
    buttomActive: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(12),
        color: '#828282',
    },
    txtItemActive: {
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        fontSize: RFFonsize(12),
        color: '#000',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#0085FF',
        backgroundColor: '#89EAFF',
        borderRadius: 3,
        marginHorizontal: 5,
        marginVertical: 10,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    styIcon: {
        position: 'absolute',
        top: 3,
        alignSelf: 'flex-end',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        zIndex: 10,
    },
    styWrapClassIn: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: 0.5,
        paddingHorizontal: 5,
        borderRadius: 3,
        borderColor: '#56CCF2',
        alignItems: 'center'
    },
    styWrapLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    styWrapClass: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    styTxtEmpty: {
        fontFamily: 'Nunito-Regular',
        color: '#C4C4C4',
        marginHorizontal: 5,
        marginVertical: 10,
    },
    widthClose: {
        width: 15,
        height: 15,
    }
});
