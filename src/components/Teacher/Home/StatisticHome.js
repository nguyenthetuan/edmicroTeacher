import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList,
    SafeAreaView
} from 'react-native';
import HomeStyle from './HomeStyle';
import { connect } from 'react-redux';
import dataHelper from '../../../utils/dataHelper';
import {
    statisticClassAction,
    statisticMissionAction,
    statisticAssignmentAction
} from '../../../actions/statisticAction';
import ProgressBar from '../../libs/ProgressBar';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ClassItem from './ItemStatistic/ClassItem';
import AssignmentItem from './ItemStatistic/AssignmentItem';
import MissionItem from './ItemStatistic/MissionItem';
const { width, height } = Dimensions.get('screen');
const horizontalMargin = 10;
const slideWidth = width - 90;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 3;
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
                        // return <Item
                        //     item={item}
                        //     navigation={this.props.navigation}
                        //     onToast={(text) => this.onToast(text)}
                        //     dataItem={dataItem}
                        //     needUpdate={this.props.needUpdate}
                        // />
                        if (index == 0) {
                            return <ClassItem />
                        } else if (index == 1) {
                            return <MissionItem />
                        } else {
                            return <AssignmentItem />
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
                    activeAnimationType='spring'
                    activeSlideAlignment='center'
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                />

                <Pagination
                    dotsLength={data.length}
                    activeDotIndex={activeSlide || 0}
                    containerStyle={{
                        height: height * 0.1,
                    }}
                    dotStyle={{
                        width: 12,
                        height: 12,
                        borderRadius: 10,
                        backgroundColor: '#359CDB',
                    }}
                    inactiveDotStyle={{
                        backgroundColor: '#c4c4c4'
                    }}
                    inactiveDotOpacity={0.6}
                    inactiveDotScale={0.7}
                />

            </View>
        )
    }
}

export default StatisticHome;

// const mapStateToProps = state => {
//     return {
//         listClass: state.statistic.listClass,
//         mission: state.statistic.mission,
//         assignment: state.statistic.assignment,
//         isLoading: state.statistic.isLoading,
//         classArray: state.statistic.classArray,
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//         fetchClassAction: payload => dispatch(statisticClassAction(payload)),
//         fetchMissionAction: payload => dispatch(statisticMissionAction(payload)),
//         fetchAssignmentAction: payload => dispatch(statisticAssignmentAction(payload))
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(StatisticHome);


const styles = StyleSheet.create({
    slider: {
        overflow: 'visible'
    },
    sliderContentContainer: {
        paddingVertical: 10,
    },
})