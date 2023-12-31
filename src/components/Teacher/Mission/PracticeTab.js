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
import Global from '../../../utils/Globals';
import { RFFonsize } from '../../../utils/Fonts';
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
    Global.resetDataPracticeAdd = this.resetDataPracticeAdd;
  }

  resetDataPracticeAdd = () => {
    this.setState({ dataPracticeAdd: [] });
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
      }).catch(err => {
        this.setState({ isLoading: false });
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
            <ActivityIndicator color={'#56CCF2'} />
          </View>
        )}
        {
          _.isEmpty(listCateHirachy)
          &&
          <Text style={[styles.headerTextTitle, { alignSelf: 'center', marginTop: 100 }]}>Không tìm thấy dữ liệu</Text>
        }
        <View style={{ marginTop: 16 }}>
          <Accordion
            sections={listCateHirachy}
            activeSections={this.state.activeSections}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
            underlayColor={'#EEFAFE'}
          />
        </View>
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
    borderWidth: 0.5,
    borderRadius: 4,
    marginVertical: 5,
    borderColor: '#BDBDBD',
    flexDirection: 'row',
    marginTop: 6,
    backgroundColor: '#fff'
  },
  headerTextIndex: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(20),
    color: '#999',
    marginHorizontal: 10,
    alignSelf: 'center'
  },
  headerTextTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
    color: '#424242',
    marginRight: 30,
    marginLeft: 11
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
    fontSize: RFFonsize(10),
    lineHeight: RFFonsize(14),
    marginLeft: 11,
  },
});
