import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import HomeStyle from './HomeStyle';
import { connect } from 'react-redux';
import dataHelper from '../../../utils/dataHelper';
import {
    statisticClassAction,
    statisticMissionAction,
    statisticAssignmentAction
} from '../../../actions/statisticAction';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ClassItem from './ItemStatistic/ClassItem';
import AssignmentItem from './ItemStatistic/AssignmentItem';
import MissionItem from './ItemStatistic/MissionItem';
const { width, height } = Dimensions.get('screen');
const horizontalMargin = 10;
const slideWidth = width - 120;
const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 1.5;
const itemHeight = height;

class StatisticHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            isLoading: true
        };
    }

    render() {
        const {
            data
        } = this.props;
        const { activeSlide } = this.state;
        return (
            <View style={HomeStyle.container}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    layout={'default'}
                    layoutCardOffset={14}
                    data={data}
                    renderItem=
                    {({ item, index }) => {
                        if (index == 0) {
                            return <ClassItem />
                        } else if (index == 1) {
                            return <AssignmentItem navigation={this.props.navigation} />
                        } else {
                            return <MissionItem navigation={this.props.navigation} />
                        }
                    }}
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
                {/* <Pagination
                    dotsLength={data.length}
                    activeDotIndex={activeSlide || 0}
                    containerStyle={{
                        height: height * 0.1,
                    }}
                    dotStyle={{
                        width: 30,
                        height: 5,
                        borderRadius: 10,
                        backgroundColor: '#359CDB',
                        marginHorizontal: -5,
                        alignSelf: 'center',
                    }}
                    inactiveDotStyle={{
                        backgroundColor: '#c4c4c4',
                        width: 6,
                        height: 6,
                    }}
                    inactiveDotOpacity={0.7}
                    inactiveDotScale={0.6}
                /> */}

            </View>
        )
    }
}

export default StatisticHome;

const styles = StyleSheet.create({
    slider: {
        overflow: 'visible',

    },
    sliderContentContainer: {
        paddingVertical: 5,
    },
})