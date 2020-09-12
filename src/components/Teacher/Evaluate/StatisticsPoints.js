import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import AppIcon from '../../../utils/AppIcon';
import {HEIGHT_TOPBAR, roundToTwo} from '../../../utils/Common';
const {width, height} = Dimensions.get('window');

let data = [
  {
    name: 'Giỏi',
    population: 0,
    color: '#05FF6F',
  },
  {
    name: 'Khá',
    population: 0,
    color: '#04C6F1',
  },
  {
    name: 'Trung Bình',
    population: 0,
    color: '#7E96EC',
  },
  {
    name: 'Đạt',
    population: 0,
    color: '#4776AD',
  },
  {
    name: 'Không Đạt',
    population: 100,
    color: '#FF5757',
  },
];

const chartConfig = {
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

export default class StatisticsPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
    };
  }
  componentDidMount() {
    const gioi = [],
      kha = [],
      tb = [],
      dat = [],
      kdat = [];
    const scores = this.props.navigation.state.params.scores || [];
    const amountPoint = scores.length;
    if (amountPoint <= 0) {
      return;
    }
    for (let item of scores) {
      if (item.score >= 9) {
        gioi.push(item.score);
      } else if (item.score < 9 && item.score >= 7) {
        kha.push(item.score);
      } else if (item.score < 7 && item.score >= 5.5) {
        tb.push(item.score);
      } else if (item.score < 5.5 && item.score >= 4.5) {
        dat.push(item.score);
      } else {
        kdat.push(item.score);
      }
    }
    const tbGioi = this.mediumPoint(gioi, amountPoint);
    const tbKha = this.mediumPoint(kha, amountPoint);
    const tbTb = this.mediumPoint(tb, amountPoint);
    const tbDat = this.mediumPoint(dat, amountPoint);
    const tbKDat = 100 - (tbGioi + tbKha + tbTb + tbDat);
    data = [
      {
        name: 'Giỏi',
        population: tbGioi,
        color: '#05FF6F',
      },
      {
        name: 'Khá',
        population: tbKha,
        color: '#04C6F1',
      },
      {
        name: 'Trung Bình',
        population: tbTb,
        color: '#7E96EC',
      },
      {
        name: 'Đạt',
        population: tbDat,
        color: '#4776AD',
      },
      {
        name: 'Không Đạt',
        population: tbKDat,
        color: '#FF5757',
      },
    ];
    this.setState({data});
  }

  mediumPoint = (data = [], amountPoint) => {
    if (data.length <= 0) {
      return 0;
    }
    return roundToTwo(data.length / amountPoint) * 100;
  };

  renderChartCircle = () => {
    return (
      <View style={styles.containerChartCircle}>
        <View style={styles.viewChart1}>
          <PieChart
            data={data}
            width={210}
            height={210}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="32"
            hasLegend={false}
          />
        </View>
        <View style={styles.viewChart2}>
          <Image
            source={require('../../../asserts/images/banner_evaluate.png')}
            resizeMode="center"
            style={styles.imgInChart}
          />
        </View>
      </View>
    );
  };

  renderRightChartCircle = () => {
    return (
      <View style={styles.chartCircle}>
        {data.map((e, i) => {
          return (
            <View
              key={i.toString()}
              style={{flexDirection: 'row', marginTop: i ? 22 : 0}}>
              <View style={[styles.viewRank, {backgroundColor: e.color}]} />
              <Text style={styles.txtRank}>{e.name}</Text>
              <Text style={styles.txtPercentRank}>{e.population}%</Text>
            </View>
          );
        })}
      </View>
    );
  };

  getMaxPercent = () => {
    const max = Math.ceil(Math.max(...data.map((e) => e.population)) / 10);
    return max * 10;
  };

  renderChartBar = () => {
    const maxPercent = this.getMaxPercent();
    return (
      <View style={styles.containerChartBar}>
        <View style={styles.viewLeftChartBar}>
          <View style={{width: 35}}>
            <Text style={styles.txtLeftChartBar}>
              {roundToTwo((maxPercent / 3) * 3)}%
            </Text>
            <Text style={[styles.txtLeftChartBar, {marginTop: 30}]}>
              {roundToTwo((maxPercent / 3) * 2)}%
            </Text>
            <Text style={[styles.txtLeftChartBar, {marginTop: 30}]}>
              {roundToTwo(maxPercent / 3)}%
            </Text>
          </View>
          <View style={styles.chartBar}>
            <View style={styles.lineHorizontalChartBar} />
            <View style={styles.lineHorizontalChartBar} />
            <View style={styles.lineHorizontalChartBar} />
            <View style={styles.lineVerticalChartBarEnd} />
            <View style={styles.lineVerticalChartBarCenter} />
            {data.map((e, i) => {
              return (
                <View
                  key={i.toString()}
                  style={{
                    position: 'absolute',
                    right: ((width - 55 - 35 - 8) / 5) * i,
                    bottom: 0,
                    height: 141 * (e.population / maxPercent),
                    width: 16,
                    backgroundColor: data[i].color,
                  }}
                />
              );
            })}
          </View>
        </View>
        <View style={styles.viewBottomChartBar}>
          <Text style={styles.txtBottomChartBar}>0</Text>
          <Text style={[styles.txtBottomChartBar, {marginStart: 3}]}>5</Text>
          <Text style={styles.txtBottomChartBar2}>10</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerNavigation}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Image
                source={AppIcon.arrow_left}
                style={{width: 18, height: 18}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <Text style={styles.txtHeaderNavigation}>Thống kê điểm</Text>
            {/* <TouchableOpacity>
              <Image
                source={require('../../../asserts/icon/ic_setting_evaluate.png')}
                style={{width: 18, height: 18}}
                resizeMode={'contain'}
              />
            </TouchableOpacity> */}
          </View>
          <View style={styles.chartHeader}>
            {this.renderChartCircle()}
            {this.renderRightChartCircle()}
          </View>
        </View>
        <Text style={styles.txtTitleContent}>Phổ điểm</Text>
        {this.renderChartBar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2D9CDB',
    paddingTop: HEIGHT_TOPBAR - 10,
    paddingBottom: 20,
  },
  headerNavigation: {
    flexDirection: 'row',
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  txtHeaderNavigation: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  chartHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  txtTitleContent: {
    marginVertical: 11,
    marginStart: 16,
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#000',
  },
  containerChartCircle: {
    width: 170,
    height: 170,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 85,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgInChart: {
    width: 110,
    height: 110,
    marginStart: 3,
  },
  viewChart1: {
    width: 170,
    height: 180,
    position: 'absolute',
    top: -21,
  },
  viewChart2: {
    height: 120,
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 60,
  },
  viewRank: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  txtRank: {
    marginStart: 12,
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#fff',
    flex: 1,
  },
  txtPercentRank: {
    marginStart: 12,
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#fff',
  },
  chartCircle: {
    flex: 1,
    marginStart: width / 8,
  },
  containerChartBar: {
    width: width - 54,
    alignSelf: 'center',
    marginTop: 14,
  },
  viewBottomChartBar: {
    flexDirection: 'row',
    marginTop: 6,
  },
  txtBottomChartBar: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#000',
    marginStart: 35,
    flex: 1,
  },
  txtBottomChartBar2: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#000',
  },
  viewLeftChartBar: {
    height: 150,
    flexDirection: 'row',
  },
  txtLeftChartBar: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#000',
    width: 45,
    textAlign: 'right',
    marginLeft: -10,
  },
  chartBar: {
    flex: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingTop: 8,
  },
  lineHorizontalChartBar: {
    flex: 1,
    borderColor: '#939393',
    borderTopWidth: 0.5,
    marginEnd: 8,
  },
  lineVerticalChartBarEnd: {
    position: 'absolute',
    right: 8,
    height: 150,
    width: 0.5,
    backgroundColor: '#000',
  },
  lineVerticalChartBarCenter: {
    position: 'absolute',
    left: (width - 55 - 35 - 8) / 2,
    height: 150,
    width: 0.5,
    backgroundColor: '#000',
  },
});
