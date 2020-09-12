import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import ListStudent from './listStudent';
import ListExercise from './listExercise';
import Plans from './plans';
import global from '../../../utils/Globals';
import ModalLevelComplete from './modalLevelComplete';
import Common from '../../../utils/Common';
import dataHelper from '../../../utils/dataHelper';
import {getAvatarSource} from '../../../utils/Common';
import HeaderDetail from '../../common-new/HeaderDetail';
const {width, height} = Dimensions.get('window');
import TabTop from './TopNavigationClass';

class ClassDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isLoaing: false,
      idStudent: '',
      classID: '',
      avatar: '',
      tabActive: 0, //0: HocSinh Tab, 1: keHoach Tab, 2: baiTap Tab
    };
  }

  show = (props) => (props) => {
    this.setState({
      visible: true,
      idStudent: props.studentId,
      classID: props.classID,
    });
  };

  async componentDidMount() {
    setTimeout(() => this.setState({isLoaing: true}), 1000);
    const avatar = await dataHelper.getAvatar();
    this.setState({avatar});
  }

  render() {
    const {visible, idStudent, classID, avatar} = this.state;
    const {navigation} = this.props;
    const {title} = this.props.navigation.state.params;
    const imgAvatar = avatar
      ? {uri: getAvatarSource(avatar)}
      : require('../../../asserts/appIcon/background_game_play.png');
    return (
      <View style={styles.container}>
        <HeaderDetail
          source={imgAvatar}
          navigation={navigation}
          title={title}
        />
        {
          <View style={styles.body}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../../asserts/images/detailClass.png')}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <TabTop
              screenProps={{
                navigation: navigation,
                subjectCode: navigation.state.params.subjectCode,
                classId: navigation.state.params.classId,
                show: this.show(),
              }}
            />
          </View>
        }
        {visible && (
          <ModalLevelComplete
            closeModal={() => this.setState({visible: false})}
            idStudent={idStudent}
            classID={classID}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: '#FFF',
    zIndex: 0,
  },
  image: {
    width: width * 0.7,
    height: width * 0.4,
    marginTop: 17,
  },
  imgAvatar: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
  },

  tabActive: {
    width: '70%',
    height: 5,
    backgroundColor: '#F98E2F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginLeft: width / 0.8 + 30,
  },
});

export default ClassDetail;
