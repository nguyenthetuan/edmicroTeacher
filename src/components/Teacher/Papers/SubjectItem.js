import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Image,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import _, { isBuffer } from 'lodash';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';
import { CustomeButtonRef } from '../../common-new/CustomeButtonRef';
export default class SubjectItem extends Component {
    openModalSubject = () => {
        try {
            this.props.refFlatlist.scrollToIndex({ animated: true, index: 0 });
        } catch (error) {

        }
        this.props.onOpen();
    }

    filterData = (data) => {
        let dataTMP = [];
        let { listSubjects } = this.props;
        listSubjects.map(e => {
            return dataTMP.push(e.code);
        })
        for (let i = data.length - 1; i >= 0; i--) {
            let index = dataTMP.indexOf(data[i]);
            if (index < 0) {
                let itemTMP = data[i];
                data.splice(i, 1)

                for (let j = dataTMP.length - 1; j > -1; j--) {
                    let item = dataTMP[j];
                    if (itemTMP.indexOf(item) >= 0) {
                        data.push(item)
                    }
                }
            }
        }
        return data;
    }

    renderItem = ({ item }) => {
        const { listSubjects } = this.props;
        let data = listSubjects.filter(ele => ele.code == item);
        data = data && data[0];
        return (
            <View style={styles.buttomActive}>
                {/* <RippleButton style={styles.styIcon} onPress={() => this.props.activeSubject(item)}>
                    <Image source={AppIcon.icon_closeItemV3} style={styles.widthClose} />
                </RippleButton> */}
                <Text style={styles.txtItemActive}>{data?.name}</Text>
            </View>
        )
    }

    render() {
        const { subjectActive, Icon, styleTitle, style } = this.props;
        return (
            <View>
                <View style={styles.styWrapLabel}>
                    <Text style={[styles.txtClass, styleTitle]}>Môn học</Text>
                </View>
                <View style={styles.styWrapClass}>
                    <View style={[styles.styWrapClassIn, style]}>
                        <FlatList
                            data={this.filterData(subjectActive)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={<Text style={styles.styTxtEmpty}>Chọn môn</Text>}
                        />
                        <CustomeButtonRef
                            onPress={this.openModalSubject}
                            ref={this.props.subjectRef}
                            icon={Icon}
                            tintColor={'#2D9CDB'}
                        />
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
        padding: 0
        // backgroundColor:'red'
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
