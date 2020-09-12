import React, { Component } from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import FrameModal from '../modals/coreloop/FrameLoopVn';
import global from '../../utils/Globals';
import dataHelper from '../../utils/dataHelper';
import apiService from '../../services/apiPracticeHelper';
import MathJaxLibs from '../../utils/MathJaxUtils';
import { isSubjectMathJax } from '../../utils/Common';
import HeaderModal from './HeaderModal';
import SafeAreaView from 'react-native-safe-area-view';

let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = 'web/';
}

class WebReview extends Component {
  shouldComponentUpdate = (nextProps) => {
    if (this.props.content != nextProps.content) {
      return true;
    }
    return false;
  }
  render() {
    const { handleMessage, subjectId, content, onLoadEnd } = this.props;
    return (
      <WebView
        showsVerticalScrollIndicator={false}
        scrollEnabled
        startInLoadingState
        onMessage={handleMessage}
        originWhitelist={["file://"]}
        source={{ html: `<div style="overflow:auto;padding:0 15px;">${MathJaxLibs.renderReview(content, 14, false, subjectId)}</div>`, baseUrl }}
        onLoadEnd={onLoadEnd}
      />
    );
  }
}

export default class ReviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      visible: false,
      detail: {}
    };
    global.onMessageReview = this.onMessageReview.bind(this);
  }

  componentWillUnmount() {
    if (this.myLoading !== null) {
      clearTimeout(this.myLoading);
    }
  }

  onLoadEnd() {
    let timeSleep = 500;
    if (Platform.OS == 'ios') {
      this.myLoading = setTimeout(() => {
        this.setState({
          isLoading: false,
        });
      }, 200);
    } else {
      if (isSubjectMathJax(this.props.subjectId)) {
        timeSleep = 1500;
      }
      this.myLoading = setTimeout(() => {
        this.setState({
          isLoading: false,
        });
      }, timeSleep);//1700
    }
  }

  onMessageReview(datas) {
    const data = datas.split('---');
    if (data[0] === 'loadend') {
      this.setState({
        isLoading: false,
      });
    }
  }


  getFlashCard(stepId, flashCardId) {
    this.setState({
      isLoading: true,
    }, () => {
      dataHelper.getToken().then(({ token }) => {
        apiService.getFlashCardDetail(token, stepId, flashCardId)
          .then(response => {
            const { content } = response;
            this.setState({
              detail: response
            });
            if (content === undefined || content === null || content === '') {
              this.setState({
                isLoading: false,
              });
            }
          }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    });
  }

  getFlashCardReview(flashCardId) {
    this.setState({
      isLoading: true,
    }, () => {
      dataHelper.getToken().then(({ token }) => {
        apiService.getFlashCardDetailBm(token, flashCardId)
          .then(response => {
            const { content } = response;
            this.setState({
              detail: response
            });
            if (content === undefined || content === null || content === '') {
              this.setState({
                isLoading: false,
              });
            }
          }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    });
  }

  showModal(bolean, stepId, flashCardId) {
    this.setState({
      visible: true,
    });
    if (bolean) {
      if (stepId === '' || stepId == undefined || stepId == 'no') {
        this.getFlashCardReview(flashCardId);
      } else {
        this.getFlashCard(stepId, flashCardId);
      }
    }
  }

  hideModal() {
    this.setState({
      visible: false,
    });
  }

  handleMessage(event) {
    const datas = event.nativeEvent.data;
    global.onMessageReview(datas);
  }

  render() {
    const { detail } = this.state;
    const { subjectId } = this.props;

    return (
      <FrameModal
        color={'white'} visible={this.state.visible}
        hideModal={() => this.hideModal()} screen>
        <StatusBar />
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderModal title={'Lý thuyết'} hideModal={() => this.hideModal()} />
          <View style={{ padding: 0, flex: 1 }}>
            {(detail.content !== undefined && detail.content !== null && detail.content !== '') &&
              <WebReview
                handleMessage={this.handleMessage.bind(this)}
                onLoadEnd={this.onLoadEnd.bind(this)}
                subjectId={subjectId}
                content={detail.content}
              />
            }
          </View>
          {/* <LoadingScreen isLoading={this.state.isLoading} size={40} color={'#5BC0DE'} bgColor={'transparent'} /> */}
        </SafeAreaView>
      </FrameModal>
    );
  }
}
