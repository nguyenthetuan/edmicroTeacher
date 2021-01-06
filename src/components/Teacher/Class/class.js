import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import AppIcon from '../../../utils/AppIcon';
import global from '../../../utils/Globals';
import ListClass from './listClass';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { setProfileUserAction } from '../../../actions/userAction';
import { userGiftAction } from '../../../actions/giftAction';
import { getUserByToken } from '../../../utils/Helper';
import HeaderMain from '../../common-new/HeaderMain';
import ClassHolder from '../../shim/ClassHolder';

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
      const { token } = await dataHelper.getToken();
      const payload = getUserByToken(token);
      this.props.makeRequestProfile(payload);
      this.props.userGiftAction({ token });
      const response = await Api.getListClass({ token });
      this.setState({
        isLoading: false,
        data: response && response,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
    }
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
    const {
      data,
      isLoading,
      isRefresh
    } = this.state;
    const { user } = this.props;
    return (
      <>
        <StatusBar />
        <SafeAreaView style={styles.container}>
          <ListClass
            isLoading={isLoading}
            user={user}
            data={data}
            navigation={this.props.navigation}
            onRefresh={this._getData}
            isRefresh={isRefresh}
          />
        </SafeAreaView>
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
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    makeRequestProfile: payload => {
      dispatch(setProfileUserAction(payload));
    },
    userGiftAction: payload => dispatch(userGiftAction(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Class);
