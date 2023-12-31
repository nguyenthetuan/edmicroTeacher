import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import dataHelper from '../../../utils/dataHelper';
import apiPapers from '../../../services/apiPapersTeacher';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFFonsize } from '../../../utils/Fonts';
import Modal from 'react-native-modal';
Icon.loadFont();

const TOUCHABLE_ELEMENTS = [
    'TouchableHighlight',
    'TouchableOpacity',
    'TouchableWithoutFeedback',
    'TouchableNativeFeedback',
];

export default class ModalSelectStudent extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        scrollEnabled: PropTypes.bool,
        defaultIndex: PropTypes.number,
        defaultValue: PropTypes.string,
        options: PropTypes.array.isRequired,
        accessible: PropTypes.bool,
        animated: PropTypes.bool,
        showsVerticalScrollIndicator: PropTypes.bool,
        keyboardShouldPersistTaps: PropTypes.string,
        style: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object,
            PropTypes.array,
        ]),
        textStyle: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object,
            PropTypes.array,
        ]),
        dropdownStyle: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object,
            PropTypes.array,
        ]),
        dropdownTextStyle: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object,
            PropTypes.array,
        ]),
        dropdownTextHighlightStyle: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object,
            PropTypes.array,
        ]),
        adjustFrame: PropTypes.func,
        renderRow: PropTypes.func,
        renderSeparator: PropTypes.func,
        renderButtonText: PropTypes.func,
        onDropdownWillShow: PropTypes.func,
        onDropdownWillHide: PropTypes.func,
        onSelect: PropTypes.func,
    };
    static defaultProps = {
        disabled: false,
        scrollEnabled: true,
        defaultValue: 'Tất cả học sinh',
        options: null,
        animated: true,
        showsVerticalScrollIndicator: true,
        keyboardShouldPersistTaps: 'never'
    };
    constructor(props) {
        super(props);
        this._button = null;
        this._buttonFrame = null;
        this.state = {
            accessible: !!props.accessible,
            loading: true,
            showDropdown: false,
            buttonText: props.defaultValue,
            listSelected: [],
            data: []
        };
    }

    async componentDidMount() {
        // this.show();
        const { classCode } = this.props.dataItem;

        const { token } = await dataHelper.getToken();
        if (token && classCode) {
            const response = await apiPapers.getStudents({
                token,
                classId: classCode
            })
            if (response) {
                this.setState({
                    data: response,
                    loading: false
                })
            } else {
                this.setState({
                    loading: false
                })
            }
        } else {
            this.setState({
                loading: false
            })
        }

        const { options } = this.props;

        this.setState({
            buttonText: options.length ? `${options.length} học sinh` : 'Tất cả học sinh',
            listSelected: options
        });
    }

    _renderItem = ({ item, index, separators }) => {
        const { accessible } = this.props;
        const { listSelected } = this.state;
        const key = `row_${index}`;
        const highlighted = _.includes(listSelected, item.studentId);
        const row = (
            <View style={{
                flexDirection: 'row',
                // backgroundColor: highlighted ? '#2D9CDB' : '#E0E0E0',
                height: 20,
                alignItems: 'center',
                paddingHorizontal: 8,
                marginVertical: 8
            }}>
                <Text style={{
                    fontSize: RFFonsize(14),
                    fontFamily: 'Nunito-Regular',
                    // color: highlighted ? '#fff' : '#BDBDBD'
                }}>
                    {item.name}
                </Text>
                <View style={{
                    height: 20,
                    width: 20,
                    borderRadius: 2,
                    borderColor: '#56CCF2',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginEnd: 8,
                    position: 'absolute',
                    right: 10
                }}>
                    {highlighted ? <Icon name="check" color={'#56CCF2'} size={15} /> : null}
                </View>
            </View>
        );
        const preservedProps = {
            key,
            accessible,
            onPress: () => this._onRowPress(item, index, separators),
            disabled: this.props.status
        };
        if (TOUCHABLE_ELEMENTS.find(name => name === row.type.displayName)) {
            const props = { ...row.props };
            props.key = preservedProps.key;
            props.onPress = preservedProps.onPress;
            const { children } = row.props;
            switch (row.type.displayName) {
                case 'TouchableHighlight': {
                    return <TouchableHighlight
                        underlayColor="#f0f0f0"
                        {...props}>{children}</TouchableHighlight>;
                }
                case 'TouchableOpacity': {
                    return <TouchableOpacity {...props}>{children}</TouchableOpacity>;
                }
                case 'TouchableWithoutFeedback': {
                    return (
                        <TouchableWithoutFeedback {...props}>
                            {children}
                        </TouchableWithoutFeedback>
                    );
                }
                case 'TouchableNativeFeedback': {
                    return (
                        <TouchableNativeFeedback {...props}>
                            {children}
                        </TouchableNativeFeedback>
                    );
                }
                default:
                    break;
            }
        }
        return <TouchableHighlight
            underlayColor="#f0f0f0"
            {...preservedProps}>{row}</TouchableHighlight>;
    };

    async _onRowPress(rowData, rowID, highlightRow) {
        const { onSelect, renderButtonText, onDropdownWillHide } = this.props;
        const { listSelected, data } = this.state;
        let listSelectedTmp = listSelected;
        const index = _.indexOf(listSelectedTmp, rowData.studentId)
        index < 0
            ? listSelectedTmp = [...listSelectedTmp, ...[rowData.studentId]]
            : listSelectedTmp = [...listSelectedTmp.slice(0, index), ...listSelectedTmp.slice(index + 1)];
        if (!onSelect || onSelect(rowID, rowData) !== false) {
            highlightRow.highlight(rowID);
            await this.setState({
                buttonText: !listSelectedTmp.length || listSelectedTmp.length === data.length ? 'Tất cả học sinh' : `Đã giao: ${listSelectedTmp.length} / ${data.length} học sinh`,
                listSelected: listSelectedTmp
            });
            if (typeof (this.props.changeStatebuttonText) == 'function') {
                this.props.changeStatebuttonText(this.state.buttonText);
            }
        }
        // if (!onDropdownWillHide || onDropdownWillHide() !== false) {
        //     this.setState({
        //         showDropdown: false,
        //     });
        // }
    }

    _renderFlastList() {
        const {
            scrollEnabled,
            renderSeparator,
            showsVerticalScrollIndicator,
            keyboardShouldPersistTaps,
            options,
        } = this.props;
        const { data } = this.state;
        return (
            <FlatList
                data={data}
                scrollEnabled={scrollEnabled}
                style={styles.list}
                keyExtractor={(item, i) => (`key-${i}`)}
                renderItem={this._renderItem}
                ItemSeparatorComponent={renderSeparator || this._renderSeparator}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                ListFooterComponent={<View style={{ height: 50 }} />}
            />
        );
    }

    students() {
        const { listSelected } = this.state;
        return listSelected;
    }

    render() {
        const { visibleModal } = this.props;
        return (
            <Modal
                isVisible={visibleModal}
                style={{ margin: 0 }}
                transparent={true}
                onBackdropPress={() => this.props.handlePickStudent(this.state.buttonText)}
            >
                <View style={styles.wrapModal}                >
                    <View style={{ borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center', borderColor: '#828282', height: 40 }}>
                        <Text style={{ fontSize: RFFonsize(14) }}>Danh sách học sinh</Text>
                    </View>
                    {this._renderFlastList()}
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    wrapModal: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 5,
        width: '100%',
        position: 'absolute',
        height: 450,
        bottom: 0,
    },
})