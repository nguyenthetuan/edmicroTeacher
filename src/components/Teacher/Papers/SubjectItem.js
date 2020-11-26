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
import Icon from 'react-native-vector-icons/AntDesign'

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
                    <Icon name={'close'} size={15} />
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
                    <Image
                        style={{ marginRight: 10 }}
                        source={require('../../../asserts/icon/subject.png')}
                        resizeMode={'contain'}
                    />
                    <View style={styles.styWrapClassIn}>
                        <FlatList
                            data={subjectActive}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={<Text style={styles.styTxtEmpty}>Chọn môn</Text>}
                        />
                        <RippleButton onPress={this.openModalSubject}>
                            <Image
                                source={require('../../../asserts/appIcon/icon_filter_plus.png')}
                                resizeMode={'contain'}
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
        fontSize: 14,
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
        borderWidth: 1,
        borderColor: '#0085FF',
        backgroundColor: '#89EAFF',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 10,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    txtItem: {
        fontFamily: 'Nunito-Regular',
        fontSize: 12,
        color: '#828282',
    },
    txtItemActive: {
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000',
    },
    styIcon: {
        position: 'absolute',
        top: -8,
        right: -8,
    },
    styWrapClassIn: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: 1,
        paddingHorizontal: 5,
        borderRadius: 3,
        borderColor: '#C4C4C4',
        alignItems: 'center'
    },
    styWrapLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    styWrapClass: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    styTxtEmpty: {
        fontFamily: 'Nunito-Regular',
        color: '#C4C4C4',
        marginHorizontal: 5,
        marginVertical: 10,
    }
});