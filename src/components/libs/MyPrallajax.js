import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground, Platform } from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Common from '../../utils/Common';
import AppIcon from '../../utils/AppIcon';
import { isIphoneX } from 'react-native-iphone-x-helper';
const { width, height } = Dimensions.get('window');
const parallaxHeight = height / 5;

export default class MyParallax extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isMounted: true });
    }, 0);
  }

  renderStickyHeader(titleStickey) {
    return <View style={{
      height: Platform.OS == 'ios' ? (isIphoneX() ? 90 : 70) : 45,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8
    }}
    ><Text style={styles.viewStickey}>{titleStickey}</Text>
    </View>;
  }

  renderForeground(subjectId, titleStickey) {
    return (
      <View style={styles.wrapBackground}>
        {/* <ImageBackground source={AppIcon.bg_header_home} */}
          style={{ width: '100%', height: '100%' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FDAF40' }}>
          <View style={styles.wrapFore}>
          </View>
          <Text style={[styles.textHead, styles.bold]}>
            {titleStickey}
          </Text>
        </View>
        {/* </ImageBackground> */}
      </View>
    );
  }

  render() {
    return (
      <ParallaxScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={this.props.scrollEnabled || true}
        // renderForeground={() => this.renderForeground(this.props.subjectId, this.props.titleStickey)}
        // renderStickyHeader={() => this.renderStickyHeader(this.props.titleStickey || '')}
        // backgroundColor={this.props.backgroundColor}
        fadeOutForeground={true}
        // contentBackgroundColor={this.props.contentBackgroundColor}
        // stickyHeaderHeight={isIphoneX() ? 75 : 60}
        parallaxHeaderHeight={parallaxHeight}>
        {/* {this.props.children} */}
      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewStickey: {
    fontSize: 20,
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  wrapBackground: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  wrapFore: {
    backgroundColor: 'transparent',
    marginTop: parallaxHeight / 5,
    alignSelf: 'center',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textHead: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 17,
    marginTop: parallaxHeight / 3,
  },
  bold: {
    fontWeight: 'bold'
  },
  icon: {
    width: 50,
    height: 50
  },
});
