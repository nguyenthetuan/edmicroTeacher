import React from "react";
import { VictoryChart, VictoryTheme, VictoryPolarAxis, VictoryArea, VictoryGroup, VictoryLabel } from "victory-native";
import { View, Text, StyleSheet, Dimensions, processColor, ActivityIndicator } from 'react-native';
import { UIActivityIndicator, } from 'react-native-indicators';
import _ from 'lodash';
import { RFFonsize } from '../../utils/Fonts';
const borderColor = '#e2d7d7';

const windowWidth = Dimensions.get('screen').width;
export default class RadarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            // dataMastery: this.processData(this.props.data)
            dataMastery: []
        };
    }

    componentDidMount() {
        let dataMastery = this.processData(this.props.data)
        setTimeout(() => {
            this.setState({ dataMastery, isLoading: false });
        }, 0);
    }

    processData(data) {
        if (!data) return null;
        let dataMastery = [];
        data.map((value, index) => {
            dataMastery.push({ x: index, y: value.mastery / 100 });
        })
        // this.setState({dataMastery: dataMastery});
        return dataMastery;
    }

    processDataName(data) {
        if (!data) return null;
        let dataMasteryNameSubjects = [];
        data.map((value, index) => {
            if (index % 2 == 0) {
                dataMasteryNameSubjects.push('');
                return;
            }
            dataMasteryNameSubjects.push(value.knowledgeName);
        })
        // this.setState({dataMasteryNameSubjects: dataMasteryNameSubjects});
        return dataMasteryNameSubjects;
    }

    handleLongNameOfSubjects(data) {
        if (!data) return;
        const dataMastery = this.processDataName(data);
        let arrayStringAfterCut = [];
        dataMastery.map((value, i) => {
            let stringAfterCut = this.handleSingleLongString(value);
            arrayStringAfterCut.push(stringAfterCut);
        })
        return arrayStringAfterCut;
    }

    handleSingleLongString(string) {
        let indexOfSpaceArray = [];
        for (let i = 0; i < string.length; i++) {
            if (string[i] == ' ') {
                indexOfSpaceArray.push(i);
            }
        }
        if (indexOfSpaceArray.length == 0) return string;
        for (let i = 0; i < indexOfSpaceArray.length; i++) {
            let index = indexOfSpaceArray[i];
            if (index >= 10) {
                string = string.substring(0, index) + '...';
                return string;
            }
        }
        return string;
    }

    createLabelPercents() {
        let viewCont = [];
        for (let i = 5; i > 0; i--) {
            let labelString = (i * 20).toString();
            viewCont.push(<Text key={i} style={styles.textPercent}>{labelString}</Text>)
        }
        return viewCont;
    }

    renderRadar(dataMastery, dataNameSubjects) {
        if (dataMastery.length == 0) {
            return (<View />);
        }
        return (
            <View style={styles.viewContainer}>
                {/* <View style={styles.textNumberPercentView}>
                    {this.createLabelPercents()}
                </View> */}
                <VictoryChart
                    polar
                    // theme={VictoryTheme.material}
                    domain={{ y: [0, 1] }}
                // padding={{ top: 40, bottom: 40 }}
                >
                    <VictoryGroup colorScale={['#FFF']}
                        style={{ data: { fillOpacity: .2, strokeWidth: 3 } }}
                    >
                        {/* // Data có dạng  data={[{x: 'Toán', y: 0.2}, {x: 'Văn', y : 0.5}]} để hiện thị mức độ hoàn thành trong chart */}
                        <VictoryArea data={dataMastery} style={{ data: { fill: "#fff" } }} />
                    </VictoryGroup>
                    {
                        dataNameSubjects.map((value, i) => {
                            return (
                                <VictoryPolarAxis key={i} dependentAxis
                                    style={{
                                        axisLabel: { padding: 40, fontSize: RFFonsize(11), fill: '#828282', fontFamily: 'Nunito-Regular' },
                                        axis: { stroke: '#828282', strokeWidth: 1 },
                                        grid: { stroke: '#828282', strokeWidth: 1, opacity: 1 },
                                    }}
                                    tickLabelComponent={
                                        <VictoryLabel labelPlacement="perpendicular" />
                                    }
                                    // labelPlacement='vertical'
                                    axisValue={i + 1}
                                    label={value} //Hiển thị tên của trường cần hiện trên chart
                                    tickFormat={(t) => null}
                                    tickValues={[0.2, 0.4, 0.6, 0.8, 1]}
                                    theme={VictoryTheme.material}
                                />
                            );
                        })
                    }
                    <VictoryPolarAxis
                        labelPlacement="parallel"
                        tickFormat={() => ''}
                        style={{
                            axis: { stroke: '#828282' },
                            grid: { stroke: '#828282', opacity: 1 }
                        }}
                    />

                </VictoryChart>
            </View>
        )
    }

    renderDataEmty(dataMastery, dataNameSubjects, isLoadMateryLoading) {
        return (
            <>
                {isLoadMateryLoading ?
                    < UIActivityIndicator color={'#000'} size={25} style={styles.UIActivityIndicator} />
                    : (_.isEmpty(dataMastery) ?
                        <Text style={{ alignSelf: 'center', textAlign: 'center', fontFamily: 'Nunito-Regular' }}>Không có dữ liệu</Text>
                        : this.renderRadar(dataMastery, dataNameSubjects))}
            </>
        )
    }

    render() {
        const { dataMastery, isLoading } = this.state;
        // const dataMastery = this.processData(this.props.data);
        const dataNameSubjects = this.handleLongNameOfSubjects(this.props.data);
        return (
            <View>
                {isLoading ?
                    <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator animating={true} />
                    </View>
                    :
                    this.renderDataEmty(dataMastery, dataNameSubjects, this.props.isLoadMateryLoading)
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerText: {
        width: '100%',
        height: 40,
        justifyContent: 'flex-end',
    },
    text: {
        color: '#000',
        fontSize: RFFonsize(16),
        fontFamily: 'Nunito-Bold',
        marginLeft: 10
    },
    viewContainer: {
        // flex: 1,
        marginTop: 20,
        marginHorizontal: 10,
        // backgroundColor: '#2F80ED',
        borderRadius: 5,
    },

    textNumberPercentView: {
        width: 20,
        height: '50%',
        position: 'absolute',
        // backgroundColor: 'transp',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'space-around',
        left: windowWidth / 2 - 15
    },
    textPercent: {
        color: '#E2E2E2',
        fontSize: RFFonsize(10),
        fontFamily: 'Nunito-Bold'
    },
    UIActivityIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 2,
        top: 200
    },
})