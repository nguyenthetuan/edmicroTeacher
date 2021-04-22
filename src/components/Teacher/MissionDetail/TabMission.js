import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SectionList
} from 'react-native';
import HTML from 'react-native-render-html';
import ItemPactice from './ItemPactice';
import ItemTest from './ItemTest';
import _ from 'lodash';
import ModalMockStart from './modalMockStart';
import ModalMockStartTest from './modalMockStartTest';
import { RFFonsize } from '../../../utils/Fonts';
import shadowStyle from '../../../themes/shadowStyle';

export default class TabMisson extends Component {
    state = {
        visible: false
    }
    showPractice = (data) => {
        this.refModalMockPractice.activeModal(data);
    };
    showTest = (data) => {
        this.refModalMockTest.activeModal(data);
    };
    renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.styWrapElem}>
            <Text
                style={styles.styTxtHeader}
                numberOfLines={1}>
                {title}
            </Text>
        </View>
    )
    renderPactice = () => {
        const { shadowBtn } = shadowStyle;
        const { missionDetail = {} } = this.props.screenProps;
        let { listProblem = [] } = missionDetail;
        if (_.isEmpty(listProblem)) {
            return null;
        }
        listProblem = listProblem.map(item => ({ ...item, ...item.problemHierachy }));
        const dataTemp = _.chain(listProblem)
            .groupBy('problemHierarchyId')
            .map((value, key) => ({ title: value[0].problemHierachy.problemHierarchyName, data: value }))
            .value();
        return (
            <View style={{ backgroundColor: '#FFF' }}>
                <Text style={[styles.styTxtHeader, { color: '#000', marginHorizontal: 18 }]}>Tự luyện</Text>
                <SectionList
                    sections={dataTemp}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <ItemPactice item={item} show={this.showPractice} />}
                    renderSectionHeader={this.renderSectionHeader}
                    renderSectionFooter={() => <View style={{ marginBottom: 10 }} />}
                />
            </View>
        )
    }

    renderTest = () => {
        const { missionDetail = {} } = this.props.screenProps;
        let { listTest = [] } = missionDetail;
        if (_.isEmpty(listTest)) {
            return null;
        }
        listTest = listTest.map(item => ({ ...item, ...item.testCategory[0] }));
        const dataTemp = _.chain(listTest)
            .groupBy('testCategoryId')
            .map((value, key) => ({ title: value[0].testCategoryName, data: value }))
            .value();
        return (
            <View style={{ backgroundColor: '#FFF' }}>
                <Text style={[styles.styTxtHeader,
                { color: '#000', marginHorizontal: 18 }]}
                >
                    Kiểm tra
                    </Text>
                <SectionList
                    sections={dataTemp}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <ItemTest item={item} show={this.showTest} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={[styles.styWrapElem,
                        { backgroundColor: '#56CCF2' }]}
                        >
                            <Text style={styles.styTxtHeader}>
                                {title}
                            </Text>
                        </View>
                    )}
                    renderSectionFooter={() => <View style={{ marginBottom: 10 }} />}
                />
            </View>
        )
    }

    render() {
        const {
            missionDetail = {},
            navigation
        } = this.props.screenProps;
        console.log(missionDetail);
        const { visible } = this.state;
        return (
            <View style={styles.contain}>
                <ScrollView>
                    <View style={{ height: 10 }} />
                    {
                        missionDetail?.description ?
                            <>
                                <Text style={[styles.styTxtHeader, { color: '#000', marginHorizontal: 10 }]}>Mô tả: </Text>
                                <View style={styles.styWrapHtml} >
                                    <HTML html={missionDetail.description} />
                                </View>
                            </>
                            : null
                    }
                    {this.renderPactice()}
                    {this.renderTest()}
                </ScrollView>
                <ModalMockStart
                    closeModal={() => this.setState({ visible: false })}
                    visible={visible}
                    ref={ref => this.refModalMockPractice = ref}
                    navigation={navigation}
                />
                <ModalMockStartTest
                    closeModal={() => this.setState({ visible: false })}
                    visible={visible}
                    ref={ref => this.refModalMockTest = ref}
                    navigation={navigation}
                />
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
        fontSize: RFFonsize(14),
        fontFamily: 'Nunito-Bold',
    },
    styWrapElem: {
        backgroundColor: '#FDC214',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 19,
        marginTop: 10
    },
    styWrapHtml: {
        fontFamily: "Nunito",
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(19),
        textAlign: 'center',
        color: '#757575',
        paddingHorizontal: 30
    }
})