import React, { Component } from 'react'
import { View, Text } from 'react-native'
import FastImage from 'react-native-fast-image';
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
        const { size, style } = this.props;
        return (
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
        );
    }
}