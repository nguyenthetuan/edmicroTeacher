import React, { Component } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, SafeAreaView, Dimensions, Text } from 'react-native';
import WarningModal from '../../modals/WarningModal';
import { WebView } from 'react-native-webview';
import MathJaxLibs from '../../../utils/webviewQuestion';
import dataHelper from '../../../utils/dataHelper';
import Api from '../../../services/apiClassTeacher';
import Pdf from 'react-native-pdf';
import NineCubesLoader from '../../libs/NineCubesLoader';
import _ from 'lodash';
import { delay } from '../../../utils/Helper';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

const { width, height } = Dimensions.get('window');
export default class ListQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: {}
    }
  }

  async componentDidMount() {
    await delay(350);
    const { assignmentId } = this.props.screenProps;
    try {
      const { token } = await dataHelper.getToken();
      const response = await Api.getListQuestion({ token, assignmentId })
      this.setState({
        data: response && response,
        isLoading: false,
      })
    } catch (error) {

    }
  }

  onHandleMessage(event) {
    const data = event.nativeEvent.data.split('---');
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

  render() {
    const { data, isLoading } = this.state;
    return (
      <View style={styles.container}>
        {!isLoading ?
          <View style={styles.contents}>
            <SafeAreaView></SafeAreaView>
            {data.assignmentContentType === 0 ?
              (
                (data && !_.isEmpty(data.questions) )
                  ?
                  <WebView
                    ref={(webView) => this.webview = webView}
                    style={{ backgroundColor: 'transparent', flex: 1 }}
                    onMessage={this.onHandleMessage.bind(this)}
                    source={{
                      html: MathJaxLibs.renderHtmlQuestionDetail(this.state.data.questions, 'TOAN'),
                      baseUrl
                    }}
                    subjectId={'TOAN'}
                    originWhitelist={["file://"]}
                    startInLoadingState
                    scalesPageToFit={false}
                    javaScriptEnabled
                  />
                  : (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 200 }}><Text>Không có dữ liệu</Text></View>))
              :
              <Pdf
                ref='ViewPDFDapAn'
                fitPolicy={0}
                enableAnnotationRendering={false}
                enableAntialiasing={true}
                activityIndicatorProps={{ color: '#009900', progressTintColor: '#009900' }}
                activityIndicator={<NineCubesLoader isLoading={true} bgColor={'transparent'} color={'#2D9CDB'} />}
                source={{ uri: data && data.listFile[0], cache: true }}
                style={styles.pdf} />
            }
          </View>
          : <ActivityIndicator animating size={'small'} style={{ flex: 1 }} color='#F98E2F' />}
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
    backgroundColor: '#FFF'
  },
  contents: {
    flex: 1
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})