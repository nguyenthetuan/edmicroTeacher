import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Animated,
} from 'react-native';
import { connect } from 'react-redux';
import HeaderMain from '../../common-new/HeaderMain';
import HomeStyle from './HomeStyle';
import WellcomeTxt from './WellcomeTxt';
import StatisticHome from './StatisticHome';

import dataHelper from '../../../utils/dataHelper';
import {
    statisticClassAction,
    statisticMissionAction,
    statisticAssignmentAction
} from '../../../actions/statisticAction';

const { Value, timing } = Animated;


class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 2, 3]
        }
        this._scroll_y = new Value(0)
    }
    componentDidMount() {
        this.getDataStatistics();
    }

    getDataStatistics = async () => {
        const { token, enumType } = await dataHelper.getToken();
        const schoolYear = new Date().getFullYear();
        this.props.fetchClassAction({ token, schoolYear });
        this.props.fetchMissionAction({ token, enumType, schoolYear });
        this.props.fetchAssignmentAction({ token, enumType, schoolYear });
    }
    render() {
        const { user } = this.props;
        const { data } = this.state;
        return (
            <View style={HomeStyle.container}>
                <SafeAreaView style={HomeStyle.top} />
                <HeaderMain
                    {...user}
                    navigation={this.props.navigation}
                />
                <WellcomeTxt />
                <View style={HomeStyle.body}>
                    <StatisticHome
                        data={data}
                        navigation={this.props.navigation}
                    // listClass={this.props.listClass}
                    // mission={this.props.mission}
                    // assignment={this.props.assignment}
                    // classArray={this.props.classArray}
                    // isLoading={this.props.isLoading}
                    />
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        listClass: state.statistic.listClass,
        mission: state.statistic.mission,
        assignment: state.statistic.assignment,
        isLoading: state.statistic.isLoading,
        classArray: state.statistic.classArray,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchClassAction: payload => dispatch(statisticClassAction(payload)),
        fetchMissionAction: payload => dispatch(statisticMissionAction(payload)),
        fetchAssignmentAction: payload => dispatch(statisticAssignmentAction(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);




