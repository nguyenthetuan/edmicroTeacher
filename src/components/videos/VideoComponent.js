import React, { Component } from 'react'
import { View, Text, StyleSheet, PixelRatio, Dimensions, FlatList, ImageBackground } from 'react-native';
import YouTube from 'react-native-youtube';

export default class VideoComponent extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <YouTube
                    apiKey={'AIzaSyDczErB0NZ2yQxjv_wa_sz4ckJAVMo0Vso'}
                    videoId={'bsSJ9zq-SqE'}
                    play={false}
                    fullscreen={false}
                    showFullscreenButton={false}
                    controls={1}
                    onReady={() => this.setState({ isReady: true })}
                    onChangeState={e => this.setState({ status: e.state })}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onError={e => this.setState({ error: e.error })}
                    style={styles.player} />
                <View style={styles.infoYoutube}>
                    <Text style={styles.textTitleHead}>30 Ca Khúc Nhạc Trẻ Tâm Trạng Chỉ Dành Cho Người Thất Tình – Nhạc Trẻ Buồn Chọn Lọc Hay Nhất 2018</Text>
                    <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Giảng viên : </Text>Đang Cập Nhật</Text>
                </View>
                <FlatList
                    style={{ paddingHorizontal: 10 }}
                    data={[{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }, { key: 6 }]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={() =>
                        <View style={styles.rowItem}>
                            <ImageBackground source={{ uri: 'https://i.ytimg.com/vi/cqSsMYIWOtE/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBouexEBBRr5ZtYogUTTJ3IH0TGpw' }}
                                style={{ width: 140, height: 78 }}
                            >
                                <View style={styles.viewTitleImage}>
                                    <Text style={styles.titleImage}>onluyen.vn</Text>
                                </View>
                            </ImageBackground>
                            <View style={styles.rowInfo}>
                                <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.textTitle}>
                                    Hoa Vinh - Ngắm Hoa Lệ Rơi, Trăm Năm Không Quên - Những Ca Khúc Hay Nhất Được Cover Bởi Hoa Vinh
                                </Text>
                                <Text style={{ fontSize: 12 }}><Text style={{ fontWeight: 'bold', fontSize: 13 }}>Giảng viên : </Text>Đang Cập Nhật</Text>
                            </View>
                        </View>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    player: {
        alignSelf: 'stretch',
        height: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / (16 / 9))
    },
    infoYoutube: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#cdcdcd',
        marginBottom: 10,
    },
    textTitleHead: {
        color: '#585858',
        fontWeight: 'bold',
        fontSize: 15,
    },
    textTitle: {
        color: '#585858',
        fontWeight: 'bold',
        fontSize: 13,
    },
    rowItem: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    rowInfo: {
        marginHorizontal: 10
    },
    viewTitleImage: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 1,
    },
    titleImage: {
        color: '#fff',
        fontSize: 9
    }
});