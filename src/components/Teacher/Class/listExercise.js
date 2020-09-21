import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import ItemExercise from './itemExercise';
import RippleItem from '../../common-new/RippleItem';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
import { delay } from '../../../utils/Helper';

export default class ListExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: {
        data: [],
      },
    };
  }

  renderItem = ({ item, index }) => {
    return (
      <RippleItem
        onPress={() =>
          this.props.screenProps.navigation.navigate('ExcerciseDetail', {
            subjectCode: this.props.screenProps.subjectCode,
            assignmentId: item.assignmentId,
            name: item.name,
            naviagtion: this.props.screenProps.navigation.state.params
              .navigation,
            statusbar: 'dark-content',
          })
        }>
        <View style={{ paddingVertical: 12 }}>
          <ItemExercise
            item={item}
            index={index}
            navigation={this.props.screenProps}
            subjectCode={this.props.screenProps.subjectCode}
          />
        </View>
      </RippleItem>
    );
  };

  async componentDidMount() {
    await delay(450);
    const { classId } = this.props.screenProps;
    try {
      const { token } = await dataHelper.getToken();
      const response = await Api.getListExercise({ token, classId });
      this.setState({
        data: response && response,
        isLoading: false
      });
    } catch (error) {
      this.setState({
        data: [],
        isLoading: false
      });
    }
  }

  render() {
    const { data, isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {!isLoading ? (
          <FlatList
            data={data.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            ListEmptyComponent={() => (
              <View style={styles.viewNotFound}>
                <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
              </View>
            )}
          />
        ) : (
            <ActivityIndicator
              animating
              size={'small'}
              style={{ flex: 1 }}
              color="#56CCF2"
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  viewNotFound: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNotFound: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#000',
  },
});
