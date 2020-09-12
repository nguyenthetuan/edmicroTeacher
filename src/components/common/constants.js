// copy here 
// => paste file constants.js of
// node_modules/react-native-chart-kit/src/contribution-graph/constants.js
export const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;

export const DAYS_IN_WEEK = 7;

export const MONTH_LABELS = {
    0: "T1",
    1: "T2",
    2: "T3",
    3: "T4",
    4: "T5",
    5: "T6",
    6: "T7",
    7: "T8",
    8: "T9",
    9: "T10",
    10: "T11",
    11: "T12"
};

// copy here 
// => paste file index.js of 
// node_modules/react-native-chart-kit/src/contribution-graph/index.js
import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Svg, G, Text, Rect } from "react-native-svg";
import _ from "lodash";
import AbstractChart from "../abstract-chart";
import {
    DAYS_IN_WEEK,
    MILLISECONDS_IN_ONE_DAY,
    MONTH_LABELS
} from "./constants";
import {
    shiftDate,
    getBeginningTimeForDate,
    convertToDate
} from "./dateHelpers";

const SQUARE_SIZE = 20;
const MONTH_LABEL_GUTTER_SIZE = 8;
const paddingLeft = 32;
class ContributionGraph extends AbstractChart {
    constructor(props) {
        super(props);
        this.state = {
            valueCache: this.getValueCache(props.values)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            valueCache: this.getValueCache(nextProps.values)
        });
    }

    getSquareSizeWithGutter() {
        return (this.props.squareSize || SQUARE_SIZE) + this.props.gutterSize;
    }

    getMonthLabelSize() {
        let { squareSize = SQUARE_SIZE } = this.props;
        if (!this.props.showMonthLabels) {
            return 0;
        }
        if (this.props.horizontal) {
            return squareSize + MONTH_LABEL_GUTTER_SIZE;
        }
        return 2 * (squareSize + MONTH_LABEL_GUTTER_SIZE);
    }

    getStartDate() {
        return shiftDate(this.getEndDate(), -this.props.numDays + 1); // +1 because endDate is inclusive
    }

    getEndDate() {
        return getBeginningTimeForDate(convertToDate(this.props.endDate));
    }

    getStartDateWithEmptyDays() {
        return shiftDate(this.getStartDate(), -this.getNumEmptyDaysAtStart());
    }

    getNumEmptyDaysAtStart() {
        return this.getStartDate().getDay();
    }

    getNumEmptyDaysAtEnd() {
        return DAYS_IN_WEEK - 1 - this.getEndDate().getDay();
    }

    getWeekCount() {
        const numDaysRoundedToWeek =
            this.props.numDays +
            this.getNumEmptyDaysAtStart() +
            this.getNumEmptyDaysAtEnd();
        return Math.ceil(numDaysRoundedToWeek / DAYS_IN_WEEK);
    }

    getWeekWidth() {
        return DAYS_IN_WEEK * this.getSquareSizeWithGutter();
    }

    getWidth() {
        return (
            this.getWeekCount() * this.getSquareSizeWithGutter() -
            this.props.gutterSize
        );
    }

    getHeight() {
        return (
            this.getWeekWidth() + (this.getMonthLabelSize() - this.props.gutterSize)
        );
    }

    getValueCache(values) {
        return values.reduce((memo, value) => {
            const date = convertToDate(value.date);
            const index = Math.floor(
                (date - this.getStartDateWithEmptyDays()) / MILLISECONDS_IN_ONE_DAY
            );
            memo[index] = {
                value,
                title: this.props.titleForValue
                    ? this.props.titleForValue(value)
                    : null,
                tooltipDataAttrs: this.getTooltipDataAttrsForValue(value)
            };
            return memo;
        }, {});
    }

    getValueForIndex(index) {
        if (this.state.valueCache[index]) {
            return this.state.valueCache[index].value;
        }
        return null;
    }

    getClassNameForIndex(index) {
        if (this.state.valueCache[index]) {
            if (this.state.valueCache[index].value) {
                const count = this.state.valueCache[index].value.count;
                if (count) {
                    const opacity = (count * 0.15 > 1 ? 1 : count * 0.15) + 0.15;
                    return this.props.chartConfig.color(opacity);
                }
            }
        }
        return this.props.chartConfig.color(0.15);
    }

    getTitleForIndex(index) {
        if (this.state.valueCache[index]) {
            return this.state.valueCache[index].title;
        }
        return this.props.titleForValue ? this.props.titleForValue(null) : null;
    }

    getTooltipDataAttrsForIndex(index) {
        if (this.state.valueCache[index]) {
            return this.state.valueCache[index].tooltipDataAttrs;
        }
        return this.getTooltipDataAttrsForValue({ date: null, count: null });
    }

    getTooltipDataAttrsForValue(value) {
        const { tooltipDataAttrs } = this.props;

        if (typeof tooltipDataAttrs === "function") {
            return tooltipDataAttrs(value);
        }
        return tooltipDataAttrs;
    }

    getTransformForWeek(weekIndex) {
        if (this.props.horizontal) {
            return [weekIndex * this.getSquareSizeWithGutter(), 50];
        }
        return [10, weekIndex * this.getSquareSizeWithGutter()];
    }

    getTransformForMonthLabels() {
        if (this.props.horizontal) {
            return null;
        }
        return `${this.getWeekWidth() + MONTH_LABEL_GUTTER_SIZE}, 0`;
    }

    getTransformForAllWeeks() {
        if (this.props.horizontal) {
            return `0, ${this.getMonthLabelSize() - 100}`;
        }
        return null;
    }

    getViewBox() {
        if (this.props.horizontal) {
            return `${this.getWidth()} ${this.getHeight()}`;
        }
        return `${this.getHeight()} ${this.getWidth()}`;
    }

    getSquareCoordinates(dayIndex) {
        if (this.props.horizontal) {
            return [0, dayIndex * this.getSquareSizeWithGutter()];
        }
        return [dayIndex * this.getSquareSizeWithGutter(), 0];
    }

    getMonthLabelCoordinates(weekIndex) {
        if (this.props.horizontal) {
            return [
                weekIndex * this.getSquareSizeWithGutter(),
                this.getMonthLabelSize() - MONTH_LABEL_GUTTER_SIZE
            ];
        }
        const verticalOffset = -2;
        return [
            0,
            (weekIndex + 1) * this.getSquareSizeWithGutter() + verticalOffset
        ];
    }

    handleClick(value) {
        if (this.props.onClick) {
            this.props.onClick(value);
        }
    }

    renderSquare(dayIndex, index) {
        const indexOutOfRange =
            index < this.getNumEmptyDaysAtStart() ||
            index >= this.getNumEmptyDaysAtStart() + this.props.numDays;
        if (indexOutOfRange && !this.props.showOutOfRangeDays) {
            return null;
        }
        const [x, y] = this.getSquareCoordinates(dayIndex);
        const { squareSize = SQUARE_SIZE } = this.props;
        return (
            <Rect
                key={index}
                width={squareSize}
                height={squareSize}
                x={x + paddingLeft}
                y={y}
                title={this.getTitleForIndex(index)}
                fill={this.getClassNameForIndex(index)}
                {...this.getTooltipDataAttrsForIndex(index)}
                onPress={() => this.handleClick(index)}
            />
        );
    }

    renderWeek(weekIndex) {
        const [x, y] = this.getTransformForWeek(weekIndex);
        const { squareSize = SQUARE_SIZE } = this.props;
        return (
            <G key={weekIndex} x={x} y={y}>
                {_.range(DAYS_IN_WEEK).map((dayIndex, index) => {
                    return (
                        <>
                            {
                                weekIndex == 0 &&
                                <>
                                    <Text
                                        key={index}
                                        width={squareSize}
                                        height={squareSize}
                                        x={x + 10}
                                        y={20}
                                        fontSize={12}
                                        fill={'#eee'}
                                    >CN</Text>
                                    <Text
                                        key={index}
                                        width={squareSize}
                                        height={squareSize}
                                        x={x + 10}
                                        y={squareSize + 20}
                                        fontSize={12}
                                        fill={'#eee'}
                                    >T2</Text>
                                    <Text
                                        key={index}
                                        width={squareSize}
                                        height={squareSize}
                                        x={x + 10}
                                        y={squareSize * 2 + 20}
                                        fontSize={12}
                                        fill={'#eee'}
                                    >T3</Text>
                                    <Text
                                        key={index}
                                        width={squareSize}
                                        height={squareSize}
                                        x={x + 10}
                                        y={squareSize * 3 + 20}
                                        fontSize={12}
                                        fill={'#eee'}
                                    >T4</Text>
                                    <Text
                                        key={index}
                                        width={squareSize}
                                        height={squareSize}
                                        x={x + 10}
                                        y={squareSize * 4 + 20}
                                        fontSize={12}
                                        fill={'#eee'}
                                    >T5</Text>
                                    <Text
                                        key={index}
                                        width={squareSize}
                                        height={squareSize}
                                        x={x + 10}
                                        y={squareSize * 5 + 20}
                                        fontSize={12}
                                        fill={'#eee'}
                                    >T6</Text>
                                    <Text
                                        key={index}
                                        width={squareSize}
                                        height={squareSize}
                                        x={x + 10}
                                        y={squareSize * 6 + 20}
                                        fontSize={12}
                                        fill={'#eee'}
                                    >T7</Text>
                                </>
                            }
                            {this.renderSquare(dayIndex, weekIndex * DAYS_IN_WEEK + dayIndex)}
                        </>
                    )
                })
                }
            </G >
        );
    }

    renderAllWeeks() {
        return _.range(this.getWeekCount()).map(weekIndex =>
            this.renderWeek(weekIndex)
        );
    }

    renderMonthLabels() {
        if (!this.props.showMonthLabels) {
            return null;
        }
        const weekRange = _.range(this.getWeekCount() - 1); // don't render for last week, because label will be cut off
        return weekRange.map(weekIndex => {
            const endOfWeek = shiftDate(
                this.getStartDateWithEmptyDays(),
                (weekIndex + 1) * DAYS_IN_WEEK
            );
            const [x, y] = this.getMonthLabelCoordinates(weekIndex);
            return endOfWeek.getDate() >= 1 && endOfWeek.getDate() <= DAYS_IN_WEEK ? (
                <Text
                    key={weekIndex}
                    x={x + paddingLeft}
                    y={y + 8}
                    {...this.getPropsForLabels()}
                >
                    {MONTH_LABELS[endOfWeek.getMonth()]}
                </Text>
            ) : null;
        });
    }

    render() {
        const { style = {} } = this.props;
        let { borderRadius = 0 } = style;
        if (!borderRadius && this.props.chartConfig.style) {
            const stupidXo = this.props.chartConfig.style.borderRadius;
            borderRadius = stupidXo;
        }
        return (
            <View style={style}>
                <Svg height={this.props.height} width={this.props.width}>
                    {this.renderDefs({
                        width: this.props.width,
                        height: this.props.height,
                        ...this.props.chartConfig
                    })}
                    <Rect
                        width="100%"
                        height={this.props.height}
                        rx={borderRadius}
                        ry={borderRadius}
                        fill="url(#backgroundGradient)"
                    />
                    <G>{this.renderMonthLabels()}</G>
                    <G>{this.renderAllWeeks()}</G>
                </Svg>
            </View>
        );
    }
}

ContributionGraph.ViewPropTypes = {
    values: PropTypes.arrayOf(
        // array of objects with date and arbitrary metadata
        PropTypes.shape({
            date: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.instanceOf(Date)
            ]).isRequired
        }).isRequired
    ).isRequired,
    numDays: PropTypes.number, // number of days back from endDate to show
    endDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date)
    ]), // end of date range
    gutterSize: PropTypes.number, // size of space between squares
    squareSize: PropTypes.number, // size of squares
    horizontal: PropTypes.bool, // whether to orient horizontally or vertically
    showMonthLabels: PropTypes.bool, // whether to show month labels
    showOutOfRangeDays: PropTypes.bool, // whether to render squares for extra days in week after endDate, and before start date
    tooltipDataAttrs: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // data attributes to add to square for setting 3rd party tooltips, e.g. { 'data-toggle': 'tooltip' } for bootstrap tooltips
    titleForValue: PropTypes.func, // function which returns title text for value
    classForValue: PropTypes.func, // function which returns html class for value
    onClick: PropTypes.func // callback function when a square is clicked
};

ContributionGraph.defaultProps = {
    numDays: 200,
    endDate: new Date(),
    gutterSize: 1,
    squareSize: SQUARE_SIZE,
    horizontal: true,
    showMonthLabels: true,
    showOutOfRangeDays: false,
    classForValue: value => (value ? "black" : "#8cc665")
};

export default ContributionGraph;
