import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import Share from '../../../exam-detail/Test';
import ModalReview from '../../../modals/ReviewModal';
import WarningModal from '../../../modals/WarningModal';
import MathJaxLibs from '../../../../utils/MathJaxLibsTest';
import { WebView } from 'react-native-webview';
import _ from 'lodash';
import ShimePlaceholder from '../../../shim/LearnPlaceholder';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

export default class TestHistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listQuestion: [],
      visibleModal: false,
      visibleModalWarning: false,
      isShimePlaceholder: true,
    }
  }

  componentDidMount() {
    const { responseJson } = this.props.screenProps.navigation.state.params;
    this.update(responseJson.data.data);
    this.myTime = setTimeout(() => {
      this.setState({ isShimePlaceholder: false });
    }, 3000);
  }

  update(dataAll) {
    let listQuestion = dataAll;
    this.setState({
      listQuestion
    });
  }

  onHandleMessage(event) {
    const data = event.nativeEvent.data.split('---');
    if (data[0] === 'reviewResult') {
      this.refs.modalReview.showModal(true, '', data[1]);
    }
    if (data[0] === 'warningWeb') {
      this.setState({ numberQuestion: data[1] }, () => {
        this.displayWarning(true);
      });
    }
  }

  displayWarning(b) {
    this.refs.warningModal.showModal();
  }

  hideModal() {
    this.setState({
      visibleModal: false
    });
  }

  convertJson(data) {
    if (_.isEmpty(data)) {
      return false;
    } else if (_.isEmpty(JSON.stringify(data).length)) {
      return JSON.stringify(data).length;
    }
  }

  componentWillUnmount() {
    if (this.myTime) {
      clearTimeout(this.myTime);
      this.myTime = null;
    }
  }

  render() {
    const { isShimePlaceholder } = this.state;
    return (
      <View style={styles.container}>
        <ShimePlaceholder visible={!isShimePlaceholder} />
        {this.convertJson(this.state.listQuestion) &&
          <WebView
            ref={(webView) => this.webview = webView}
            style={{ backgroundColor: 'transparent' }}
            onMessage={this.onHandleMessage.bind(this)}
            source={{
              html: MathJaxLibs.renderHtmlTestDetail(this.state.listQuestion, 'TOAN'),
              baseUrl
            }}
            subjectId={'TOAN'}
            originWhitelist={["file://"]}
            startInLoadingState
            scalesPageToFit={false}
            javaScriptEnabled
          />
        }
        {
          this.convertJson(this.state.listQuestion) == 2 &&
          <View style={{ position: 'absolute', alignSelf: 'center', marginTop: 200 }}>
            <Text style={{ fontSize: 14, color: '#999', fontFamily: 'Nunito-Bold' }}>Không Có Kết Quả Hiển Thị</Text>
          </View>
        }
        <ModalReview
          ref='modalReview'
          subjectId={'TOAN'}
          navigation={this.props.navigation}
          visible={this.state.visibleModal} hideModal={() => this.hideModal()}
        />
        <WarningModal
          ref={'warningModal'}
          navigation={this.props.navigation}
          visible={this.state.visibleModalWarning}
          hideModal={() => this.displayWarning(false)}
          numberQuestion={this.state.numberQuestion}
          subjectId={'TOAN'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})