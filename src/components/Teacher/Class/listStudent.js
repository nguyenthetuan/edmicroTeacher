import React, { Component } from 'react';
import {
View,
StyleSheet,
FlatList,
ActivityIndicator,
Image,
Text
} from 'react-native';
import ItemStudent from './itemStudent';
import RippleItem from '../../common-new/RippleItem';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
import { delay } from '../../../utils/Helper';
import { RFFonsize } from '../../../utils/Fonts';

class ItemStudentContainer extends React.Component {

  shouldComponentUpdate = (prevProps, nextState) => {
    if (prevProps.item != this.props.item) {
      return true;
    }
    return false;
  }

  render() {
    const {
      onPress,
      index,
      navigation,
      item
    } = this.props;
    return (
      <RippleItem onPress={onPress} >
        <View style={{ paddingVertical: 12 }} >
          <ItemStudent
            item={item}
            index={index}
            navigation={navigation}
          />
        </View>
      </RippleItem>
    );
  }
}

export default class listStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isLoading: true,
      data: {}
    }
  }

  async componentDidMount() {
    const { classId } = this.props.screenProps;
    await delay(450);
    try {
      const { token } = await dataHelper.getToken();
      const response = await Api.getInfoClass({ token, classId })
      console.log(response);
      this.setState({
        isLoading: false,
        data: response && response,
      })
    } catch (error) {

    }
  }

  renderItem = ({ item, index }) => {
    const { data } = this.state;
    return (
      <ItemStudentContainer
        onPress={() => this.props.screenProps.show({
          studentId: item.studentId,
          classID: data.code
        })}
        item={item}
        index={index}
        navigation={this.props.navigation}
      />
    );
  }

  render() {
    const {
      data,
      showModal,
      isLoading
    } = this.state;
    return (
      <View style={styles.container}>
        {
          !isLoading ?
            <FlatList
              data={data.students}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              initialNumToRender={8}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.viewNotFound}>
                  <Image source={require('../../../asserts/icon/iconNodata.png')} />
                  <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
                </View>
              )}
            />
            :
            <ActivityIndicator
              animating size={'small'}
              style={{ flex: 1 }}
              color='#56CCF2'
            />}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewNotFound: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtNotFound: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#828282',
    marginTop: 16
  }
})