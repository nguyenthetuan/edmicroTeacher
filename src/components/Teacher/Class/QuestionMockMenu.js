import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import {isIphoneX} from 'react-native-iphone-x-helper';
import Globals from '../../../utils/Globals';
import Icon from 'react-native-vector-icons/FontAwesome';
const {width} = Dimensions.get('window');
export default class QuestionMockMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataQuestion: [],
      currentIdQuestion: 0,
      isVisible: true,
      data: [],
      active: false,
      indexActive: 0,
    };
    Globals.updateMenuQuestion = this.reFreshMenu.bind(this);
    Globals.nextQuestion = this.updateMenu.bind(this);
  }

  updateMenu = (index) => {
    this.setState(
      {
        indexActive: index,
      },
      () => this.reFreshMenu(),
    );
  };

  reFreshMenu = async () => {
    this.getDataMenu();
  };

  getDataMenu = async () => {
    const {
      assignId,
      classId,
      assignmentId,
    } = this.props.navigation.state.params;
    try {
      const {token} = await dataHelper.getToken();
      const response = await Api.getMockExample({token, assignmentId});
      this.setState({
        data: response.data,
      });
    } catch (error) {}
  };

  async componentDidMount() {
    this.getDataMenu();
  }

  hideDrawerMenu() {
    this.setState({isVisible: false});
  }

  onPress = (item, index) => {
    Globals.updateQuestionMockExam(index);
    this.setState({
      indexActive: index,
    });
  };

  renderItem = ({item, index}) => {
    const regex = /(<([^>]+)>)/gi;
    const {indexActive} = this.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.closeDrawer();
          this.onPress(item, index);
        }}
        style={
          indexActive === index ? styles.rowQuestionActive : styles.rowQuestion
        }>
        <View
          style={[
            styles.wrapNumber,
            {
              backgroundColor:
                item.status == 1 || item.status == 4 ? '#90EA59' : '#828282',
            },
          ]}>
          <Text style={styles.textNumber}>{index + 1}</Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#C4C4C4',
            }}>
            <Image
              source={require('../../../asserts/icon/icon_check_exa.png')}
              style={{
                tintColor:
                  item.status != 1 && item.status != 4 ? '#C4C4C4' : null,
              }}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.textDesc,
                {
                  color:
                    item.status != 1 && item.status != 4
                      ? '#C4C4C4'
                      : '#90EA59',
                },
              ]}>
              Đã trả lời
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name={'star'}
              color={
                item.status === 2 || item.status === 4 ? '#FFC571' : '#C4C4C4'
              }
              size={14}
              style={styles.icon}
            />
            <Text
              style={[
                styles.textDesc,
                {
                  color:
                    item.status === 2 || item.status === 4
                      ? '#FFC571'
                      : '#C4C4C4',
                },
              ]}>
              Xem lại sau
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {data} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          numColumns={2}
          ListEmptyComponent={() => (
            <View style={styles.viewNotFound}>
              <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
            </View>
          )}
          ListFooterComponent={() => <View style={{height: 50}}></View>}
          style={styles.styFlatlist}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  item: {
    padding: 6,
    borderRadius: 5,
    marginTop: 5,
  },
  textDesc: {
    marginHorizontal: 5,
    alignSelf: 'flex-start',
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
  },
  textNumber: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
  },
  wrapNumber: {
    height: 30,
    width: 30,
    borderRadius: 25,
    backgroundColor: '#90EA59',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  flatList: {
    flex: 1,
    backgroundColor: '#0F2839',
    marginLeft: 10,
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },
  rowQuestion: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: 'rgba(50,67,79,0.5)',
    alignItems: 'center',
    paddingVertical: 5,
    overflow: 'hidden',
  },
  rowQuestionActive: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
    paddingVertical: 5,
    overflow: 'hidden',
  },
  txtNotFound: {
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    color: '#FFF',
    marginTop: width / 2,
  },
  styFlatlist: {
    paddingTop: isIphoneX ? 50 : 30,
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
});
