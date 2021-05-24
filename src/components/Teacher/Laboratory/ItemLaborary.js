import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Image,
    ImageBackground
} from 'react-native';
import LaboraStyle from './LaboraStyle';
import { connect } from 'react-redux';
import dataHelper from '../../../utils/dataHelper';
import FastImage from 'react-native-fast-image';
import shadowStyle from '../../../themes/shadowStyle';
const { width, height } = Dimensions.get('screen');

class ItemLaborary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // activeSlide: 0,
            isLoadLabora: true
        };
    }

    renderHeader = () => {
        return (
            <ImageBackground source={require('../../../asserts/images/image_bgLabora.png')}
                style={{ flex: 1 }}
                resizeMode="stretch"
            >
                <Image source={require('../../../asserts/images/images_heaItemLabora.png')}
                    style={styles.bgLabora}
                />
            </ImageBackground>
        )
    }
    renderItem = ({ item, index }) => {
        const { shadowBtn } = shadowStyle;
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.props.navigation.navigate('DetailLabora',
                        {
                            item: item,
                            statusbar: 'light-content',
                        })
                }}
            >
                <View style={[LaboraStyle.viewItem, shadowBtn]}>
                    <FastImage
                        style={styles.imageSize}
                        source={{
                            uri: item.urlThunbnail,
                        }}
                        resizeMode="stretch"
                    />
                    <Text numberOfLines={1}
                        style={LaboraStyle.titleSub}>{item.title}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    renderEmpty = () => {
        const { isLoadLabora } = this.props;
        return (
            <View>
                {
                    isLoadLabora ?
                        <ActivityIndicator color={'#828282'} size={'small'} style={styles.ActivityIndicator} />
                        :
                        <View style={styles.styWrapEmpty}>
                            <Text style={styles.styTxtEmpty}>Hiện tại chưa có dữ liệu</Text>
                        </View>
                }
            </View>
        )
    }
    render() {
        const {
            laboratory,
            isLoadLabora
        } = this.props;
        const { shadowBtn } = shadowStyle;
        return (
            <View style={LaboraStyle.container}>
                { isLoadLabora ?
                    <ActivityIndicator color={'#828282'} size={'small'} style={styles.ActivityIndicator} />
                    :
                    <FlatList
                        data={laboratory}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={this.renderHeader}
                        renderItem={this.renderItem}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                    // ListEmptyComponent={this.renderEmpty}
                    />
                }
            </View>
        )
    }
}

export default ItemLaborary;

const styles = StyleSheet.create({
    slider: {
        overflow: 'visible',

    },
    sliderContentContainer: {
        paddingVertical: 5,
    },
    imageSize: {
        width: width * 0.4,
        height: height * 0.15,
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 4
    },
    ActivityIndicator: {
        flex: 1,
        marginTop: height * 0.35
    },
    bgLabora: {
        flex: 1,
        alignSelf: "flex-end",
        marginHorizontal: 10,
        marginVertical: 16
    }
})