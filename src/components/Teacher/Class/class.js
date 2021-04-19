import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import global from '../../../utils/Globals';
import ListClass from './listClass';
import Api from '../../../services/apiClassTeacher';
import dataHelper from '../../../utils/dataHelper';
import { connect } from 'react-redux';
import { userGiftAction } from '../../../actions/giftAction';

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
      this.initData();
    } catch (error) {
      this.setState({
        isLoading: false,
      });
    }
  }

  async initData() {
    const { token } = await dataHelper.getToken();
    this.props.userGiftAction({ token });
    const response = await Api.getListClass({ token });
    this.setState({
      isLoading: false,
      data: response && response,
    });
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
    userGiftAction: payload => dispatch(userGiftAction(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Class);
