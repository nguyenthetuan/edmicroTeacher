import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import global from '../../../utils/Globals';
import ListClass from './listClass';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import Header from '../Header';
import jwt from 'jwt-decode';
import { connect } from 'react-redux';
import { saveUserAction, saveAvatarAction } from '../../../actions/userAction';
import SplashScreen from 'react-native-splash-screen';
import { setProfileUserAction } from '../../../actions/userAction';
import { getUserByToken } from '../../../utils/Helper';

class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      isRefresh: false,
    };
  }

  async componentDidMount() {
    try {
      SplashScreen.hide();
      let { avatarSource } = this.props;
      const { token } = await dataHelper.getToken();
      const payload = getUserByToken(token);
      this.props.makeRequestProfile(payload);
      const response = await Api.getListClass({ token });
      this.setState({
        isLoading: false,
        data: response && response,
      });
      this.props.saveUser({ userName });
      if (!avatarSource) {
        avatarSource = await dataHelper.getAvatar();
        this.props.saveAvatar(avatarSource);
      }
    } catch (error) { }
  }

  _getData = async () => {
    try {
      this.setState({ isRefresh: true });
      const { token } = await dataHelper.getToken();
      const response = await Api.getListClass({ token });
      this.setState({
        isRefresh: false,
        data: response && response,
      });
    } catch (error) { }
  };

  render() {
    const { data, isLoading, isRefresh } = this.state;
    const { avatarSource } = this.props;
    return (
      <>
        <StatusBar />
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            avatarSource={avatarSource}
          />
          {!isLoading ? (
            <ListClass
              data={data}
              navigation={this.props.navigation}
              onRefresh={this._getData}
              isRefresh={isRefresh}
            />
          ) : (
              <ActivityIndicator
                animating
                size={'small'}
                style={{ flex: 1 }}
                color="#F98E2F"
              />
            )}
          <Image
            source={AppIcon.bottomChangeGrade}
            style={styles.imageBottom}
            resizeMode={'contain'}
          />
        </View>
      </>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  imageHome: {
    width: width * 0.9,
    height: width * 0.52,
  },
  imageBottom: {
    width: width,
    height: width * global.ratioImageBottom,
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
});

const mapStateToProps = state => {
  return {
    avatarSource: state.user.AvatarSource,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveUser: user => dispatch(saveUserAction(user)),
    saveAvatar: ava => dispatch(saveAvatarAction(ava)),
    makeRequestProfile: payload => {
      dispatch(setProfileUserAction(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Class);
