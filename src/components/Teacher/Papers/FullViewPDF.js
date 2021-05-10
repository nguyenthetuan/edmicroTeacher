import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import HeaderPaper from './HeaderPaper';
import Pdf from 'react-native-pdf';

export default class FullViewPDFAssessment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { urlFilePDF, text } = this.props.navigation.state.params;
        console.log("🚀 ~ file: FullViewPDF.js ~ line 13 ~ FullViewPDFAssessment ~ render ~ urlFilePDF", urlFilePDF)
        return (
            <SafeAreaView style={styles.container}>
                <HeaderPaper
                    title={text}
                    navigation={this.props.navigation}
                    color={'#979797'}
                    iconColor='#000'
                    createPaper={true}
                />
                <Pdf
                    ref={(ref) => (this.pdf = ref)}
                    source={{ uri: urlFilePDF, cache: true }}
                    onLoadComplete={(numberOfPages, filePath) => { }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    style={styles.pdf}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    pdf: {
        flex: 1,
        width: '100%',
    },
})