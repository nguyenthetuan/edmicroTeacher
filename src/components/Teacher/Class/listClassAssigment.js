import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import ItemCLassAssigment from './itemClassAssigment';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
export default class ListClassAssigment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      data: {},
    }
  }

  async componentDidMount() {
    const { assignmentId } = this.props.screenProps;
    try {
      const { token } = await dataHelper.getToken();
      const response = await Api.getListClassAssigment({ token, assignmentId })
      this.setState({
        data: response && response,
        isLoading: false
      })
    } catch (error) {

    }
  }

  renderItem = ({ item, index }) => {
    return (
      <ItemCLassAssigment
        item={item}
        index={index}
        navigation={this.props.screenProps.navigation}
        subjectCode={this.props.screenProps.subjectCode}
        assignmentId={this.props.screenProps.assignmentId}
        activeModal = {(data)=>this.props.screenProps.show(data)}
      />
    );
  }

  // openTest = ()=>{

  // }
  
  render() {
    const { data, isLoading } = this.state;
    console.log('props', this.props)
    return (
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        {!isLoading ? <FlatList
          data={data.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <View style={styles.viewNotFound}><Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
          </View>}
        />
          : <ActivityIndicator animating size={'small'} style={{ flex: 1 }} color='#F98E2F' />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewNotFound: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtNotFound: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#000'
  }
})