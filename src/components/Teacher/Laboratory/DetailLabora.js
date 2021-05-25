import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    SafeAreaView
} from 'react-native';
import LaboraStyle from './LaboraStyle';
import { connect } from 'react-redux';
import dataHelper from '../../../utils/dataHelper';
import HeaderNavigation from '../../common-new/HeaderNavigation';
import { WebView } from 'react-native-webview';
import shadowStyle from '../../../themes/shadowStyle';
const { width, height } = Dimensions.get('screen');

class DetailLabora extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // activeSlide: 0,
            isMounted: false
        };
    }


    componentDidMount() {
        this.timeMounted = setTimeout(() => {
            this.setState({ isMounted: true });
        }, 350);

    }

    componentWillUnmount() {
        if (this.timeMounted) {
            clearTimeout(this.timeMounted);
        }
    }

    render() {
        const {
            laboratory,
            isLoading
        } = this.props;
        const { shadowBtn } = shadowStyle;
        const { isMounted } = this.state;
        const item = this.props.navigation.state.params.item;
        return (
            <View style={LaboraStyle.ViewBg}>
                <SafeAreaView />
                <HeaderNavigation
                    title={item.title}
                    navigation={this.props.navigation}
                    color={'#fff'}
                />
                { isMounted &&
                    <WebView source={{ uri: item.urlFile }}
                        style={{ backgroundColor: '#000' }}
                    />

                }
                <SafeAreaView />
            </View>
        )
    }
}

export default DetailLabora;

const styles = StyleSheet.create({

})