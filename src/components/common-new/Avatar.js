import React, { Component } from 'react'
import { View, Image, TouchableWithoutFeedback } from 'react-native'
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getSourceAvatarOwl } from '../../utils/Helper';

export default class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: props.source,
        }
    }

    onError = () => {
        let { source } = this.state;
        try {
            if (source && (typeof source != 'object') && source.indexOf('s3-ap-southeast-1.amazonaws.com/onluyen-avatar') != -1) {
                let newsource = getSourceAvatarOwl(source);
                this.setState({ source: newsource });
                return;
            }
        } catch (error) {

        }
        this.setState({ source: require('../../asserts/images/no_avatar_user.png') });
    }

    shouldComponentUpdate = (prevProps, nextState) => {
        if (this.props.source != prevProps.source
            || this.state.source != nextState.source) {
            return true;
        }
        return false;
    }

    componentDidUpdate = (prevProps, nextState) => {
        if (this.props.source != prevProps.source) {
            this.setState({ source: this.props.source });
        }
    }


    render() {
        const { source } = this.state;
        const { size, style, onEdit } = this.props;
        return (
            <View style={[{
                width: size,
                height: size,
                borderRadius: size / 2
            },
                style
            ]}>
                <FastImage
                    source={source}
                    style={[{
                        width: size,
                        height: size,
                        borderRadius: size / 2
                    },
                        style
                    ]}
                    resizeMode={FastImage.resizeMode.contain}
                    onError={this.onError}
                />
                {onEdit &&
                    <TouchableWithoutFeedback onPress={onEdit} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
                        <Icon name={'edit'} color={'#f8f8f8'} size={18} style={{
                            position: 'absolute',
                            bottom: (Math.sqrt(2) - 1) * (size / 2) / Math.sqrt(2) - 9,
                            right: (Math.sqrt(2) - 1) * (size / 2) / Math.sqrt(2) - 9,
                        }} />
                        {/* <Image source={require('../../asserts/appIcon/edit_icon.png')}
                            style={{
                                position: 'absolute',
                                bottom: (Math.sqrt(2) - 1) * (size / 2) / Math.sqrt(2) - 6,
                                right: (Math.sqrt(2) - 1) * (size / 2) / Math.sqrt(2) - 6,
                            }} /> */}
                    </TouchableWithoutFeedback>
                }
            </View>

        );
    }
}