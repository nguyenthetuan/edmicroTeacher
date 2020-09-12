import React, { Component } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import HeaderNavigation from './HeaderNavigation';
import { WebView } from 'react-native-webview';
export default class WebViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: '',
      title: ''
    }
  }

  componentDidMount() {
    const { title, link } = this.props.navigation.state.params;
    this.setState({ title, link });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar />
        <HeaderNavigation
          title={this.state.title}
          navigation={this.props.navigation}
          colorIcon={'#FFF'}
          back={true}
        />
        <WebView
          source={{ uri: this.state.link }}
        />
      </View>
    );
  }
}