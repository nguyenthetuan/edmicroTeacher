import React, { PureComponent, Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Image
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/AntDesign';
import AppIcon from '../../../utils/AppIcon';
import { RFFonsize } from '../../../utils/Fonts';
export default class ClassItem extends Component {

    openModalClass = () => {
        this.props.refModalClass.onOpen()
    }

    renderItem = ({ item }) => {
        const name = item?.replace('C', 'Lớp ');
        return (
            <View style={styles.buttomActive}>
                <RippleButton style={styles.styIcon} onPress={() => this.props.activeClass(item)}>
                    <Image source={AppIcon.icon_closeItemV3} style={styles.widthClose} />
                </RippleButton>
                <Text style={styles.txtItemActive}>{name}</Text>
            </View>
        )
    }

    render() {
        const { gradeActive } = this.props;
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.txtClass}>Khối lớp</Text>
                </View>
                <View style={styles.styWrapClass}>
                    <Image
                        style={{ marginRight: 10 }}
                        source={require('../../../asserts/images/iconHome.png')}
                        resizeMode={'contain'}
                    />
                    <View style={styles.styWrapClassIn}>
                        <FlatList
                            data={gradeActive}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            removeClippedSubviews={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={<Text style={styles.styTxtEmpty}>Chọn lớp</Text>}
                        />
                        <RippleButton
                            onPress={this.openModalClass}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <Image
                                source={require('../../../asserts/appIcon/icon_filter_plus.png')}
                                resizeMode={'contain'}
                            />
                        </RippleButton>
                    </View>
                </View>
            </View>
        );
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
    styWrapClass: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
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
    styIcon: {
        position: 'absolute',
        top: 3,
        alignSelf: 'flex-end',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        zIndex: 10,
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
