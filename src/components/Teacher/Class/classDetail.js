import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import ModalLevelComplete from './modalLevelComplete';
import dataHelper from '../../../utils/dataHelper';
import { getAvatarSource } from '../../../utils/Common';
import HeaderDetail from '../../common-new/HeaderDetail';
const { width, height } = Dimensions.get('window');
import TabTop from './TopNavigationClass';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import { SafeAreaView } from 'react-navigation';
import { getSourceAvatar } from '../../../utils/Helper';
import FastImage from 'react-native-fast-image';

class ClassDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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

  render() {
    const { visible, idStudent, classID } = this.state;
    const { navigation, user } = this.props;
    const { title } = this.props.navigation.state.params;
    const source = getSourceAvatar(user.userId);
    return (
      <SafeAreaView style={styles.container}>
        <HeaderNavigation
          title={title}
          actionIcon={source}
          navigation={navigation}
        />
        {
          <View style={styles.body}>
            {/* <View style={{ alignItems: 'center' }}>
              <FastImage
                source={require('../../../asserts/images/detailClass.png')}
                style={styles.image}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View> */}
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
            closeModal={() => this.setState({ visible: false })}
            idStudent={idStudent}
            classID={classID}
          />
        )}
      </SafeAreaView>
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

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassDetail);

