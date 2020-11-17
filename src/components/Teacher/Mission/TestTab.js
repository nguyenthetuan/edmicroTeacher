import React, {Component} from 'react';
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
import ItemElement from './ItemElementTest';
const {width, height} = Dimensions.get('window');
export default class PracticeTab extends Component {
  state = {
    activeSections: [],
    isLoading: false,
    dataTestAdd: [],
  };

  token = null;
  async componentDidMount() {
    const {token} = await dataHelper.getToken();
    this.token = token;
  }

  handleAdd = title => item => {
    const {dataTestAdd} = this.state;
    item.title = title;
    dataTestAdd.push(item);
    this.props.screenProps.changeDataTestAdd(dataTestAdd);
    this.setState({dataTestAdd});
  };

  handleDele = title => item => {
    let {dataTestAdd} = this.state;
    dataTestAdd = dataTestAdd.filter(elem => elem.testId != item.testId);
    this.props.screenProps.changeDataTestAdd(dataTestAdd);
    this.setState({dataTestAdd});
  };

  _renderHeader = (section, index) => {
    const {dataTestAdd} = this.state;
    const temp = dataTestAdd.filter(ele => {
      return ele.id == section.id;
    });
    return (
      <View style={styles.styHeaderList}>
        <Text style={styles.headerTextIndex}>{index + 1}</Text>
        <View>
          <Text style={styles.headerTextTitle}>
            {section.name || section.title}
          </Text>
          <Text style={styles.styTxtSum}>Đã thêm {temp.length} nhiệm vụ</Text>
        </View>
      </View>
    );
  };

  _renderContent = section => {
    if (section.data) {
      return (
        <ItemElement
          data={section.data}
          handleAdd={this.handleAdd(section.title)}
          handleDele={this.handleDele(section.title)}
          dataTestAdd={this.state.dataTestAdd}
          id={section.id}
        />
      );
    }
    return <View style={styles.content} />;
  };

  _updateSections = activeSections => {
    if (activeSections.length <= 0) {
      this.setState({activeSections: []});
      return;
    }
    const {listCateTest} = this.props.screenProps;
    if (_.isEmpty(listCateTest[activeSections].data)) {
      this.setState({isLoading: true});
      //1 kiểm tra
      const {testCategoryId} = listCateTest[activeSections];
      new Promise((res, rej) => {
        this.props.screenProps.getListProblemTestMiss({
          token: this.token,
          id: testCategoryId,
          res,
        });
      }).then(res => {
        this.setState({activeSections, isLoading: false});
      });
    } else {
      this.setState({activeSections});
    }
  };

  render() {
    const {listCateTest} = this.props.screenProps;
    const {isLoading} = this.state;
    return (
      <ScrollView style={styles.contain} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.styWrapLoading}>
            <ActivityIndicator color={'#62ACE1'} />
          </View>
        )}
        <Accordion
          sections={listCateTest}
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
    marginRight: 20,
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