import React, { Component } from 'react';
import {
  View, Text, FlatList,
  StyleSheet, Dimensions,
  TouchableHighlight, PixelRatio,
  BackHandler, ImageBackground, TouchableOpacity,
  ActivityIndicator, StatusBar, Image, Platform,
} from 'react-native';
import YouTube from 'react-native-youtube';
import Orientation from 'react-native-orientation';
import dataHelper from '../../utils/dataHelper';
import apiService from '../../services/apiPracticeHelper';
import Utils from '../../utils/Utils';
import AppConst from '../../constants/appConst';
import HeaderNavigation from '../common/HeaderNavigation';
import AppIcon from '../../utils/AppIcon';
import CommonBeta from '../../utils/CommonBeta';
import Icon from 'react-native-vector-icons/Entypo'
import videoItem1 from '../../asserts/images/video_item1.png';
import videoItem2 from '../../asserts/images/video_item2.png';
import videoItem3 from '../../asserts/images/video_item3.png';

const images = [
  videoItem1, videoItem2, videoItem3
]

const height = PixelRatio.roundToNearestPixel(Dimensions.get('window').width / (16 / 9));

export default class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: '',
      title: '',
      isPlay: false,
      listKnowledge: [],
      containerMounted: false,
      showFullscreenButton: false,
      title: 'Ôn Luyện'
    };
  }

  componentDidMount() {
    this.myBackHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackPressed.bind(this));
    const { flashcardId, isButtonFull, title } = this.props.navigation.state.params;
    if (isButtonFull === undefined) {
      this.setState({
        showFullscreenButton: false,
        title
      }, () => {
        this.makeRequestData(flashcardId);
        this.makeRequestKnowledge();
      });
    } else {
      this.setState({
        showFullscreenButton: isButtonFull,
        title
      }, () => {
        this.makeRequestData(flashcardId);
        this.makeRequestKnowledge();
      });
    }
    Utils.trackScreen('playVideo');
  }


  componentWillUnmount() {
    if (this.myBackHandler != null) {
      this.myBackHandler.remove();
    }
    // this.setState({
    //   isPlay: false,
    // });
  }

  onBackPressed() {
    Orientation.lockToPortrait();
    return true;
  }

  makeRequestData(flashcardId) {
    dataHelper.getToken().then(({ token }) => {
      apiService.getVideoDetail(token, flashcardId)
        .then(response => {
          const { codeYoutube, title } = response;
          this.setState({
            videoId: codeYoutube,
            title,
          });
        });
    }).catch(err => console.log(err));
  }

  makeRequestKnowledge() {
    const { codeKnowledge } = this.props.navigation.state.params;
    dataHelper.getToken().then(({ token }) => {
      apiService.getKnowledge(token, codeKnowledge)
        .then(response => {
          this.setState({
            listKnowledge: response
          });
        });
    }).catch(err => console.log(err));
  }

  goToVideo(flashcardId) {
    this.setState({
      flashcardId,
      isPlay: true
    });
    this.makeRequestData(flashcardId);
  }

  onChangeFullscreen(data) {
    if (data.isFullscreen) {
      Orientation.lockToLandscapeRight();
    } else {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    }
  }

  toggleFullscreen() {
  }

  videoError(e) {
    console.log('PlayVideo ****************ERROR', e);
  }

  videoState(e) {
    console.log('PlayVideo state change', e);
    if (e.state === 'playing') {
      // hack to get video to play in portrait; must init both to true in constructor
      if (this.state.fullscreen) {
        this.setState({ play: false, fullscreen: false, });
      }
    }
  }

  videoProgress(e) {
    console.log('PlayVideo videoProgress event,videoPosition', e);
  }

  onReady() {
    this.setState({ isReady: true });
  }

  onChangeState(e) {
    this.setState({ status: e.state });
  }

  onError(e) {
    this.setState({ error: e.error });
  }

  onChangeQuality(e) {
    this.setState({ quality: e.quality });
  }

  componentDidUpdate() {
  }

  renderStar(star) {
    let temp = [];
    for (let index = 0; index < star; index++) {
      let starComponent = <Icon name="star" size={15} color={'#F2994A'} key={index} />
      temp.push(starComponent);
    }
    return temp;
  }

  renderItem = ({ item, index }) => {
    const data = CommonBeta.getImageTeacher(item.codeYoutube);
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={() => this.goToVideo(item.flashcardId)}>
        <View style={styles.rowItem}>
          <ImageBackground source={images[index % 3]}
            style={{ width: 140, height: 140 * 240 / 456, justifyContent: 'flex-end' }}
          >
            <Text style={[styles.textTitle, { color: '#ddd', marginHorizontal: 5, fontSize: 12, zIndex: 2 }]} numberOfLines={2} >{item.title}</Text>
            <Image source={AppIcon[data.image]} style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 45,
              height: 70,
              zIndex: 3
            }} resizeMode='contain' />
          </ImageBackground>
          <View style={styles.rowInfo}>
            <Text style={styles.textTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.txtGVtitle}><Text style={styles.txtGVtitle}>GV : </Text>{data.name}</Text>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 10 }}>
              <TouchableOpacity>
                <Image source={AppIcon.dowload_icon} style={{ marginHorizontal: 12 }}></Image>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={AppIcon.save_icon}></Image>
              </TouchableOpacity>
            </View> */}
            <View style={{ flexDirection: 'row' }}>
              {
                this.renderStar(data.star)
              }
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _handleClickBack = () => {
    this.setState({ videoId: '', isPlay: false }, () => {
      this.props.navigation.goBack();
    });
  }

  render() {
    const opts = {
      loop: false,
      showFullscreenButton: false,
      showinfo: false,
      modestbranding: true,
      controls: 1,
      rel: true,
    };
    const { title } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#100D3A' }}>
        <HeaderNavigation
          navigation={this.props.navigation}
          title={title}
          titleColor={'#cdcdcd'}
          bgColor={'#100D3A'}
          colorIcon={'#cdcdcd'}
          back={true}
          onPressItem={this._handleClickBack}
          callBack={true}
          styleTitle={{ marginLeft: 20 }}
        />
        <View style={{ flex: 1, backgroundColor: '#100D3A' }}>
          {this.state.videoId != '' ?
            <YouTube
              apiKey={AppConst.apiKeyYoutube}
              videoId={this.state.videoId}
              fullscreen={Platform.OS == 'ios' ? false : true}
              play={this.state.isPlay}
              showFullscreenButton={this.state.showFullscreenButton}
              controls={1}
              resumePlayAndroid={false}
              onChangeFullscreen={(e) => this.onChangeFullscreen(e)}
              onReady={() => this.onReady()}
              onChangeState={e => this.onChangeState(e)}
              onChangeQuality={e => this.onChangeQuality(e)}
              onError={e => this.onError(e)}
              style={styles.player} />
            :
            <View style={{ height: height, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator animating size={'large'} />
            </View>
          }
          <View style={styles.infoYoutube}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textTitleHead}>{this.state.title}</Text>
              {/* <TouchableOpacity>
                <Image source={AppIcon.dowload_icon} style={{ marginHorizontal: 12 }}></Image>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={AppIcon.save_icon}></Image>
              </TouchableOpacity> */}
            </View>
            {!!this.state.videoId && <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.txtGVtitle, { flex: 1 }]}><Text style={styles.txtGVtitle}>GV : </Text>{CommonBeta.getImageTeacher(this.state.videoId).name}</Text>
              {/* <Text style={styles.txtGVtitle}>2548 Lượt xem</Text> */}
            </View>}
            <View style={{ flexDirection: 'row' }}>
              {
                this.renderStar(CommonBeta.getImageTeacher(this.state.videoId).star)
              }
            </View>
          </View>


          <FlatList
            style={{ paddingHorizontal: 10 }}
            data={this.state.listKnowledge}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  player: {
    alignSelf: 'stretch',
    height: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / (16 / 9))
  },
  infoYoutube: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#cdcdcd',
    marginBottom: 10,
  },
  textTitleHead: {
    color: '#cdcdcd',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    flex: 1
  },
  textTitle: {
    color: '#cdcdcd',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    height: 42,
  },
  rowItem: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  rowInfo: {
    flex: 1,
    marginLeft: 20,
  },
  viewTitleImage: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 1,
  },
  titleImage: {
    color: '#fff',
    fontSize: 9
  },
  txtGVtitle: {
    fontSize: 13,
    color: '#BDBDBD',
    fontFamily: 'Nunito-Bold'
  }
});
