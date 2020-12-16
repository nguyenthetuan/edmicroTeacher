import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';

import Toast, { DURATION } from 'react-native-easy-toast';
export default class HistoryGift extends Component {

    renderItem = ({ item }) => {
        // const { missionDetail } = this.props.screenProps;
        // const missionId = missionDetail._id
        // const status = missionDetail.status;
        return (
            <Text>OfferGift</Text>
        )
    }

    onToast = (text) => {
        this.toastRef.show(text, 3000)
    }

    render() {
        const { classList } = this.props.screenProps;
        return (
            <View style={styles.contain}>
                <FlatList
                    data={classList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    style={{ paddingTop: 10 }}
                />
                <Toast
                    ref={ref => this.toastRef = ref}
                    position={'center'}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    }
})