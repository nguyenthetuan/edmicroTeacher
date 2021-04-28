import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';
import HomeStyle from './HomeStyle';
import { connect } from 'react-redux';
import dataHelper from '../../../utils/dataHelper';
const { width, height } = Dimensions.get('screen');
const horizontalMargin = 10;
const slideWidth = width - 100;
const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = height;
// import { LineChart, Grid } from 'react-native-svg-charts';
import {
    LineChart
} from "react-native-chart-kit";
import Carousel, { Pagination } from 'react-native-snap-carousel';
class DiaryActive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            activeSlide: 0,
        };
    }
    _renderItem = ({ item, index }) => {
        console.log('item', item);
        return (
            <View style={HomeStyle.countStatis}>
                <View style={HomeStyle.bgCount}><Text style={HomeStyle.titleCount}>{item.totalCheckPoint}</Text></View>
                <View style={HomeStyle.viewNumber}>
                    <Text style={HomeStyle.titleCount}>Số câu hỏi đã giao </Text>
                    <Text style={HomeStyle.titleCount}>{item.totalCheckPoint}</Text>
                </View>
            </View>
        )
    }
    render() {
        const { diaryActive, countdiaryActive } = this.props;
        console.log('diaryActive', diaryActive);
        // const data = [50, 10, 50];
        const chartConfig = {
            backgroundGradientFrom: "#78D0ED",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: " #78D0ED",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(120, 208, 237, ${opacity})`,
            strokeWidth: 3, // optional, default 3
            barPercentage: 1,
            useShadowColorFromDataset: false, // optional
            style: {
                borderRadius: 16
            },
            propsForDots: {
                r: "4.5",
                strokeWidth: "2",
                stroke: "#78D0ED"
            }
        };
        return (
            <View style={HomeStyle.container}>
                <Text style={HomeStyle.titleDes} >Nhật ký hoạt động</Text>
                {/* <LineChart
                    style={{ height: 200 }}
                    data={data}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}
                >
                    <Grid animated={true} />
                </LineChart> */}
                <LineChart
                    data={{
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    layout={'default'}
                    layoutCardOffset={14}
                    data={[countdiaryActive]}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    itemHeight={itemHeight}
                    activeSlideOffset={1}
                    inactiveSlideOpacity={0.7}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loopClonesPerSide={2}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    activeAnimationType='decay'
                    activeSlideAlignment='center'
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                />
            </View>
        )
    }
}

export default DiaryActive;

const styles = StyleSheet.create({

})