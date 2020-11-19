import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import dataHelper from '../../../utils/dataHelper';
import _ from 'lodash';
import ItemElement from './ItemElementPractice';
const { width, height } = Dimensions.get('window');

export default class PracticeTab extends Component {
  state = {
    activeSections: [],
    isLoading: false,
    dataPracticeAdd: [],
  };

  token = null;
  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    const { token } = await dataHelper.getToken();
    this.token = token;
  }

  handleAdd = data => item => {
    item.problemHierachyName = data.problemHierachyName;
    const { dataPracticeAdd } = this.state;
    dataPracticeAdd.push(item);
    this.props.screenProps.changeDataPracticeAdd(dataPracticeAdd);
    this.setState({ dataPracticeAdd });
  };

  handleDele = data => item => {
    let { dataPracticeAdd } = this.state;
    dataPracticeAdd = dataPracticeAdd.filter(elem => elem.id != item.id);
    this.props.screenProps.changeDataPracticeAdd(dataPracticeAdd);
    this.setState({ dataPracticeAdd });
  };

  _renderHeader = (section, index) => {
    const { dataPracticeAdd } = this.state;
    const temp = dataPracticeAdd.filter(ele => {
      return ele.problemHierachyId == section.id;
    });
    return (
      <View style={styles.styHeaderList}>
        <Text style={styles.headerTextIndex}>{index + 1}</Text>
        <View>
          <Text style={styles.headerTextTitle} numberOfLines={1}>
            {section.name || section.title}
          </Text>
          <Text style={styles.styTxtSum}>
            Đã thêm {temp.length}/{section.numberProblems} nhiệm vụ
          </Text>
        </View>
      </View>
    );
  };

  _renderContent = section => {
    if (section.data) {
      return (
        <ItemElement
          data={section.data}
          handleAdd={this.handleAdd(section.data)}
          handleDele={this.handleDele(section.data)}
          dataPracticeAdd={this.state.dataPracticeAdd}
        />
      );
    }
    return <View />;
  };

  _updateSections = activeSections => {
    if (activeSections.length <= 0) {
      this.setState({ activeSections: [] });
      return;
    }
    const { listCateHirachy } = this.props.screenProps;
    //0 tu luyen
    if (_.isEmpty(listCateHirachy[activeSections].data)) {
      this.setState({ isLoading: true });
      const { id } = listCateHirachy[activeSections];
      new Promise((res, rej) => {
        this.props.screenProps.getListProblemMission({
          token: this.token,
          id,
          res,
          rej,
        });
      }).then(res => {
        this.setState({ activeSections, isLoading: false });
      });
    } else {
      this.setState({ activeSections });
    }
  };

  render() {
    const { listCateHirachy } = this.props.screenProps;
    const { isLoading } = this.state;
    return (
      <ScrollView style={styles.contain} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.styWrapLoading}>
            <ActivityIndicator color={'#62ACE1'} />
          </View>
        )}
        <Accordion
          sections={listCateHirachy}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
          underlayColor={'#efefef'}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  styHeaderList: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: '#efefef',
    flexDirection: 'row',
    // alignItems: 'center',
  },
  headerTextIndex: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: '#999',
    marginHorizontal: 10,
  },
  headerTextTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#000',
    marginRight: 40,
  },
  styWrapLoading: {
    position: 'absolute',
    paddingTop: '50%',
    width,
    height,
    zIndex: 10,
  },
  styTxtSum: {
    color: '#2D9CDB',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
  },
});
