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
import { RFFonsize } from '../../../utils/Fonts'
const { width, height } = Dimensions.get('screen');
const horizontalMargin = 10;
const slideWidth = width - 100;
const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = height;
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
        return (
            <View style={HomeStyle.countStatis}>
                <View style={HomeStyle.bgCount}><Text style={HomeStyle.titleCount}>{item?.dateTime}</Text></View>
                <View style={HomeStyle.viewNumber}>
                    <Text style={HomeStyle.titleCount}>Số câu hỏi đã giao </Text>
                    <Text style={HomeStyle.titleCount}>{item?.totalCheckPoint}</Text>
                </View>
            </View>
        )
    }
    render() {
        const { diaryActive, countdiaryActive } = this.props;

        const dataSets = countdiaryActive.map(val => val.totalCheckPoint);
        dataSets.unshift(0);
        dataSets.push(0);
        const dataLabels = countdiaryActive.map(val => val.dateTime);
        dataLabels.unshift("");
        dataLabels.push("");
        const chartConfig = {
            backgroundGradientFrom: "#fff",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#fff",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(120, 208, 237, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(3, 2, 2, ${opacity})`,
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
        const dataChart = dataSets;
        return (
            <View style={HomeStyle.container}>
                <Text style={HomeStyle.titleDes} >Nhật ký hoạt động</Text>
                <LineChart
                    data={{
                        labels: dataLabels,
                        datasets: [{ data: dataChart }]
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
                {/* {(countdiaryActive && countdiaryActive.length > 0) &&
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        layout={'default'}
                        layoutCardOffset={14}
                        data={countdiaryActive}
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
                } */}
            </View>
        )
    }
}

export default DiaryActive;

const styles = StyleSheet.create({

})