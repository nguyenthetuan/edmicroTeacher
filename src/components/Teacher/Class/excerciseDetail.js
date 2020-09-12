import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import ListClassAssigment from './listClassAssigment';
import ListQuestion from './listQuestion';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createAppContainer} from 'react-navigation';
import RippleButton from '../../common-new/RippleButton';
import {isIphoneX} from 'react-native-iphone-x-helper';
import dataHelper from '../../../utils/dataHelper';
import * as Animatable from 'react-native-animatable';
import {getAvatarSource} from '../../../utils/Common';
import ModalMockExamStart from './modalMockExamStart';
import HeaderDetail from '../../common-new/HeaderDetail';
const {width, height} = Dimensions.get('window');

const ExerciseTab = createMaterialTopTabNavigator(
  {
    listClassAssigment: {
      screen: (props) => <ListClassAssigment {...props} />,
      navigationOptions: {
        title: 'Lớp Giao Bài',
        tabBarLabel: ({focused}) => {
          return !focused ? (
            <Text style={styles.labelTab}>Lớp Giao Bài </Text>
          ) : (
            <Text style={styles.labelTabActive}>Lớp Giao Bài</Text>
          );
        },
      },
    },
    exercise: {
      screen: (props) => <ListQuestion {...props} />,
      navigationOptions: {
        title: 'Câu hỏi',
        tabBarLabel: ({focused}) => {
          return !focused ? (
            <Text style={styles.labelTab}>Câu hỏi</Text>
          ) : (
            <Text style={styles.labelTabActive}>Câu hỏi</Text>
          );
        },
      },
    },
  },
  {
    backBehavior: false,
    swipeEnabled: false,
    animationEnabled: false,
    lazy: false,
    // tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    tabBarOptions: {
      scrollEnabled: false,
      upperCaseLabel: false,
      labelStyle: {
        fontSize: 12,
        fontFamily: 'Nunito-Regular',
        color: '#F98E2F',
        width: '50%',
        flex: 1,
      },
      style: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#F98E2F',
        height: 40,
        elevation: 0,
        shadowOffset: {height: 0, width: 0},
        // justifyContent: 'space-between'
      },
      indicatorStyle: {
        backgroundColor: '#F98E2F',
        height: 5,
        width: width / 2,
        borderBottomWidth: 1,
        borderBottomColor: '#F98E2F',
        borderBottomWidth: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        // marginLeft: width < 350 ? 10 : 40,
      },
    },
  },
);

const ExcerciseTabOnline = createAppContainer(ExerciseTab);

export default class ExcerciseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      visible: false,
    };
  }

  async componentDidMount() {
    const avatar = await dataHelper.getAvatar();
    this.setState({avatar});
    this.getAvatar();
  }

  show = (props) => (props) => {
    this.refs.ModalMockExam.activeModal(props);
  };

  getAvatar() {
    //to do code
    dataHelper
      .getAvatar()
      .then((path) => {
        this.setState({
          avatar: `${path}`,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const {avatar, visible} = this.state;
    const {name} = this.props.navigation.state.params;
    const {navigation} = this.props;
    const imgAvatar = avatar
      ? {uri: getAvatarSource(avatar)}
      : require('../../../asserts/appIcon/background_game_play.png');
    return (
      <View style={styles.container}>
        <HeaderDetail source={imgAvatar} title={name} navigation={navigation}/>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../../asserts/images/excerciseDetail.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <ExcerciseTabOnline
          screenProps={{
            navigation: this.props.navigation,
            subjectCode: this.props.navigation.state.params.subjectCode,
            assignmentId: this.props.navigation.state.params.assignmentId,
            show: this.show(),
          }}
        />
        <ModalMockExamStart
          closeModal={() => this.setState({visible: false})}
          visible={visible}
          ref="ModalMockExam"
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: width < 380 ? 20 : 15,
  },
  txtTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#2D9CDB',
    textAlign: 'center',
    marginLeft: 15,
  },
  rightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingRight: width < 380 ? 20 : 15,
  },
  image: {
    width: width * 0.7,
    height: width * 0.4,
    marginTop: 17,
  },
  labelTab: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#C4C4C4',
  },
  labelTabActive: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#F98E2F',
  },
  btnAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    marginLeft: 10,
  },
  imgAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
  },
});
