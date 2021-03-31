import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import StepOne from './StepOnePDF';
import StepTwo from './StepTwoPDF';
import StepThree from './StepThreePDF';
import StepFour from './StepFourPDF';
import Appicon from '../../../../utils/AppIcon';
import _ from 'lodash';
import RippleButton from '../../../common-new/RippleButton';

const labels = ['Upload', 'Đáp án', 'Cấu hình', 'Hoàn thành'];


export default class UploadPDFStepByStep extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    renderStepIndicator = (params) => {
        const { stepStatus, position } = params;
        let backgroundColor = '#DADADA', size = 30, iconColor = '#BDBDBD', textColor = 'BDBDBD', isCurrent = false;
        switch (stepStatus) {
            case 'unfinished': {
                break;
            }
            case 'finished': {
                backgroundColor = '#fff';
                textColor = '#fff';
                iconColor = '#2D9CDB'
                break;
            }
            case 'current': {
                backgroundColor = '#fff';
                textColor = '#fff';
                isCurrent = true;
                iconColor = '#2D9CDB'
                break;
            }
        }
        return (
            <RippleButton style={{ width: 35, height: 35, backgroundColor: isCurrent ? '#fff' : 'transparent', justifyContent: 'center', alignItems: 'center', borderRadius: 20, }} onPress={() => { alert(position) }}>
                <View style={{ width: 33, height: 33, backgroundColor: isCurrent ? '#2D9CDB' : 'transparent', justifyContent: 'center', alignItems: 'center', borderRadius: 17 }} onPress={() => { }}>
                    <View style={{ width: 30, height: 30, backgroundColor: backgroundColor, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                        <Image source={this.getStepIndicatorIconConfig(params)} style={{ tintColor: iconColor }} />
                    </View>
                </View>
            </RippleButton>
        );
    };

    renderText = (params) => {
        const { stepStatus, position } = params;
        let textColor = '#BDBDBD';
        switch (stepStatus) {
            case 'unfinished': {
                textColor = '#BDBDBD';
                break;
            }
            case 'finished': {
                textColor = '#fff';
                break;
            }
            case 'current': {
                textColor = '#fff';
                break;
            }
        }
        return (
            <Text style={{ fontFamily: 'Nunito', fontSize: 13, color: textColor }}>{labels[position]}</Text>
        )
    }

    getStepIndicatorIconConfig = ({ position, stepStatus }) => {
        let icon;
        switch (position) {
            case 0: {
                icon = Appicon.upload_icon;
                break;
            }
            case 1: {
                icon = Appicon.answer_icon;
                break;
            }
            case 2: {
                icon = Appicon.config_icon;
                break;
            }
            case 3: {
                icon = Appicon.done_icon;
                break;
            }
        }

        return icon;
    };


    render() {
        return (
            <SafeAreaView style={styles.contain}>
                <View style={{ backgroundColor: '#2D9CDB', paddingTop: 20 }}>
                    <StepIndicator
                        customStyles={customStyles}
                        renderStepIndicator={this.renderStepIndicator}
                        currentPosition={2}
                        labels={labels}
                        stepCount={4}
                        renderLabel={this.renderText}
                    />
                </View>
                <TopTabMissionContain
                    screenProps={{
                        ...this.props,
                        handleNextStep: this.handleNextStep,
                        token: this.token,
                        data: this.state.data,
                        goback: this.goBack,
                    }}
                />
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#2D9CDB'
    },
});

const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 35,
    stepStrokeCurrentColor: '#fff',
    stepStrokeFinishedColor: '#fff',
    stepStrokeUnFinishedColor: '#fff',
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 1,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    labelColor: '#bdbdbd',
    labelSize: 13,
    currentStepLabelColor: '#fff',
    labelFontFamily: 'Nunito-Bold',
    separatorFinishedColor: '#fff',
    separatorUnFinishedColor: '#bdbdbd',
}

const topTabMission = createMaterialTopTabNavigator(
    {
        StepOne: {
            screen: StepOne,
        },
        StepTwo: {
            screen: StepTwo,
        },
        StepThree: {
            screen: StepThree,
        },
        StepFour: {
            screen: StepFour
        }
    },
    {
        tabBarOptions: {
            showLabel: false,
            showIcon: false,
        },
        tabBarComponent: () => <View />,
        swipeEnabled: false,
        lazy: true,
    },
);

const TopTabMissionContain = createAppContainer(topTabMission);
