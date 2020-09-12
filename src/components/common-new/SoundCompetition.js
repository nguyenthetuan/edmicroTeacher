import React from 'react'
import { View, Text, Slider, TouchableOpacity, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';

const img_pause = 'md-pause';
const img_play = 'md-play';
const img_playjumpleft = 'md-skip-backward';
const img_playjumpright = 'md-skip-forward';

export default class PlayerScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            playState: 'paused', //playing, paused
            playSeconds: 0,
            duration: 0,
            urlMedia: ''
        }
        this.sliderEditing = false;
    }

    componentDidMount() {
        this.timeout = setInterval(() => {
            if (this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing) {
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    this.setState({ playSeconds: seconds });
                })
            }
        }, 100);
    }

    componentWillReceiveProps(newProps) {
        const { urlMedia, index, isPause } = this.props;
        if (newProps.index != index) {
            if (this.sound) {
                this.sound.stop(() => {
                    this.sound.release();
                    this.sound = null;
                });
            }
            this.setState({ playSeconds: 0, urlMedia, playState: 'paused' });
        }
        if (newProps.isPause != isPause) {
            this.pause();
        }
    }

    componentWillUnmount() {
        if (this.sound) {
            this.sound.release();
            this.sound = null;
        }
        if (this.timeout) {
            clearInterval(this.timeout);
        }
    }

    onSliderEditStart = () => {
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        if (this.sound) {
            this.sound.setCurrentTime(value);
            this.setState({ playSeconds: value });
        }
    }

    play = async (filepath) => {
        if (this.sound) {
            this.sound.setCategory('Playback');
            this.sound.play(this.playComplete);
            this.setState({ playState: 'playing' });
        } else {
            console.log('[Play]', filepath);
            this.sound = new Sound(filepath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    console.log('Notice', 'audio file error. (Error code : 1)');
                    this.setState({ playState: 'paused' });
                } else {
                    this.setState({ playState: 'playing', duration: this.sound.getDuration() });
                    this.sound.play(this.playComplete);
                }
            });
        }
    }
    playComplete = (success) => {
        if (this.sound) {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                console.log('Notice', 'audio file error. (Error code : 2)');
            }
            this.setState({ playState: 'paused', playSeconds: 0 });
            this.sound.setCurrentTime(0);
        }
    }

    pause = () => {
        if (this.sound) {
            this.sound.pause();
        }

        this.setState({ playState: 'paused' });
    }

    jumpPrev15Seconds = () => { this.jumpSeconds(-2); }
    jumpNext15Seconds = () => { this.jumpSeconds(2); }
    jumpSeconds = (secsDelta) => {
        if (this.sound) {
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if (nextSecs < 0) nextSecs = 0;
                else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({ playSeconds: nextSecs });
            })
        }
    }

    getAudioTimeString(seconds) {
        const h = parseInt(seconds / (60 * 60));
        const m = parseInt(seconds % (60 * 60) / 60);
        const s = parseInt(seconds % 60);

        return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
    }

    render() {

        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FFF' }}>
                <View style={{ marginVertical: -5, marginHorizontal: 15, flexDirection: 'row' }}>
                    <Text style={{ color: '#000', alignSelf: 'center', fontFamily: 'Nunito-Regular' }}>{currentTimeString}</Text>
                    <Slider
                        onTouchStart={this.onSliderEditStart}
                        onTouchEnd={this.onSliderEditEnd}
                        onValueChange={this.onSliderEditing}
                        value={this.state.playSeconds} maximumValue={this.state.duration} maximumTrackTintColor='gray' minimumTrackTintColor='#EEE' thumbTintColor={Platform.OS == 'ios' ? 'white' : '#CCC'}
                        style={{ flex: 1, alignSelf: 'center', marginHorizontal: Platform.select({ ios: 5 }) }} />
                    <Text style={{ color: '#000', alignSelf: 'center', fontFamily: 'Nunito-Regular' }}>{durationString}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 0 }}>
                    <TouchableOpacity onPress={this.jumpPrev15Seconds} style={{ justifyContent: 'center' }}>
                        <Ionicons name={img_playjumpleft} size={20} style={{ color: '#000' }} />
                    </TouchableOpacity>
                    {this.state.playState == 'playing' &&
                        <TouchableOpacity onPress={this.pause} style={{ marginHorizontal: 20 }}>
                            <Ionicons name={img_pause} size={20} style={{ color: '#000' }} />
                        </TouchableOpacity>}
                    {this.state.playState == 'paused' &&
                        <TouchableOpacity onPress={() => this.play(this.props.urlMedia)} style={{ marginHorizontal: 20 }}>
                            <Ionicons name={img_play} size={20} style={{ color: '#000' }} />
                        </TouchableOpacity>}
                    <TouchableOpacity onPress={this.jumpNext15Seconds} style={{ justifyContent: 'center' }}>
                        <Ionicons name={img_playjumpright} size={20} style={{ color: '#000' }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}