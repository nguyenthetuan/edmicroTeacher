import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ItemClass from './ItemClass';
import Toast, { DURATION } from 'react-native-easy-toast';
export default class TabClass extends Component {

    renderItem = ({ item }) => {
        const { missionDetail } = this.props.screenProps;
        const missionId = missionDetail._id
        const status = missionDetail.status;
        return (
            <ItemClass item={item} status={status} missionId={missionId} onToast={this.onToast} {...this.props.screenProps} />
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
                <Toast ref={ref => this.toastRef = ref} position={'center'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    }
})