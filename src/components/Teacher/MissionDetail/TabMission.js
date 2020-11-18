import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SectionList } from 'react-native';
import HTML from 'react-native-render-html';
import ItemPactice from './ItemPactice';
import ItemTest from './ItemTest';
import _ from 'lodash';
export default class TabMisson extends Component {

    renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.styWrapElem}>
            <Text style={styles.styTxtHeader}>{title}</Text>
        </View>
    )


    renderPactice = () => {
        const { missionDetail } = this.props.screenProps;
        let { listProblem } = missionDetail;
        listProblem = listProblem.map(item => ({ ...item, ...item.problemHierachy }));
        const dataTemp = _.chain(listProblem)
            .groupBy('problemHierarchyId')
            .map((value, key) => ({ title: value[0].problemHierachy.problemHierarchyName, data: value }))
            .value();
        return (
            <View style={{ backgroundColor: '#FFF' }}>
                <Text style={[styles.styTxtHeader, { color: '#000' }]}>Tự luyện</Text>
                <SectionList
                    sections={dataTemp}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <ItemPactice item={item} />}
                    renderSectionHeader={this.renderSectionHeader}
                    renderSectionFooter={() => <View style={{ marginBottom: 10 }} />}
                />
            </View>
        )
    }

    renderTest = () => {
        const { missionDetail } = this.props.screenProps;
        let { listTest } = missionDetail;
        listTest = listTest.map(item => ({ ...item, ...item.testCategory[0] }));
        const dataTemp = _.chain(listTest)
            .groupBy('testCategoryId')
            .map((value, key) => ({ title: value[0].testCategoryName, data: value }))
            .value();
        return (
            <View style={{ backgroundColor: '#FFF' }}>
                <Text style={[styles.styTxtHeader, { color: '#000' }]}>Kiểm tra</Text>
                <SectionList
                    sections={dataTemp}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <ItemTest item={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={[styles.styWrapElem, { backgroundColor: '#56CCF2' }]}>
                            <Text style={styles.styTxtHeader}>{title}</Text>
                        </View>
                    )}
                    renderSectionFooter={() => <View style={{ marginBottom: 10 }} />}
                />
            </View>
        )
    }

    render() {
        const { isLoading, missionDetail } = this.props.screenProps;
        return (
            <View style={styles.contain}>
                <ScrollView>
                    <Text style={[styles.styTxtHeader, { color: '#000', marginTop: 10 }]}>Mô tả: </Text>
                    <View style={styles.styWrapHtml}>
                        <HTML html={missionDetail.description} />
                    </View>
                    {this.renderPactice()}
                    {this.renderTest()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },
    styTxtHeader: {
        color: '#FFF',
        marginHorizontal: 3,
        fontSize: 14,
        fontFamily: 'Nunito-Bold'
    },
    styWrapElem: {
        backgroundColor: '#FDC214',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    styWrapHtml: {
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        marginTop: 5,
        borderColor: '#56CCF2',
    }
})