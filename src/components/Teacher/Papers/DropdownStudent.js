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
    Modal,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
const TOUCHABLE_ELEMENTS = [
    'TouchableHighlight',
    'TouchableOpacity',
    'TouchableWithoutFeedback',
    'TouchableNativeFeedback',
];
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import _ from 'lodash';
import dataHelper from '../../../utils/dataHelper';
import apiPapers from '../../../services/apiPapersTeacher';
import { RFFonsize } from '../../../utils/Fonts';

export default class DropdownStudent extends Component {
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
    componentDidMount() {
        const { options } = this.props;

        this.setState({
            buttonText: options.length ? `${options.length} học sinh` : 'Tất cả học sinh',
            listSelected: options
        });
    }
    _updatePosition(callback) {
        if (this._button && this._button.measure) {
            this._button.measure((fx, fy, width, height, px, py) => {
                this._buttonFrame = {
                    x: px,
                    y: py,
                    w: width,
                    h: height,
                };
                callback && callback();
            });
        }
    }
    show() {
        this._updatePosition(() => {
            this.setState({
                showDropdown: true,
            });
        });
    }
    hide() {
        this.setState({
            showDropdown: false,
        });
    }
    students() {
        const { listSelected } = this.state;
        return listSelected;
    }
    select(idx) {
        const {
            defaultValue,
            options,
            defaultIndex,
            renderButtonText,
        } = this.props;
        let value = defaultValue;
        if (idx == null || !options || idx >= options.length) {
            idx = defaultIndex;
        }
        if (idx >= 0) {
            value = renderButtonText
                ? renderButtonText(options[idx])
                : options[idx].toString();
        }
        this.setState({
            buttonText: value
        });
    }
    _renderButton() {
        const { disabled, accessible, children, textStyle } = this.props;
        const { buttonText, showDropdown } = this.state;
        return (
            <TouchableOpacity
                ref={button => (this._button = button)}
                disabled={disabled}
                accessible={accessible}
                onPress={this._onButtonPress}
                style={{
                    height: 24,
                    flex: 1,
                    backgroundColor: 'rgba(86, 204, 242, 0.2)',
                    borderRadius: 5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    overflow: 'hidden',
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: 'Nunito-Regular',
                        fontSize: 12,
                        color: '#2D9CDB',
                        flex: 1,
                        paddingHorizontal: 8,
                    }}>{buttonText}</Text>
                <View style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#56CCF2',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Icon name={showDropdown ? "chevron-up" : "chevron-down"} color={'#fff'} size={13} />
                </View>
            </TouchableOpacity>
        );
    }
    _onButtonPress = async () => {
        const { onDropdownWillShow } = this.props;
        if (!onDropdownWillShow || onDropdownWillShow() !== false) {
            this.show();
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
        }
    };
    _renderModal() {
        const { animated, accessible, dropdownStyle } = this.props;
        const { showDropdown, loading } = this.state;
        if (showDropdown && this._buttonFrame) {
            const frameStyle = this._calcPosition();
            const animationType = animated ? 'fade' : 'none';
            return (
                <Modal
                    animationType={animationType}
                    visible
                    transparent
                    onRequestClose={this._onRequestClose}
                    supportedOrientations={[
                        'portrait',
                        'portrait-upside-down',
                        'landscape',
                        'landscape-left',
                        'landscape-right',
                    ]}
                >
                    <TouchableWithoutFeedback
                        accessible={accessible}
                        disabled={!showDropdown}
                        onPress={this._onModalPress}
                    >
                        <View style={styles.modal}>
                            <View style={[styles.dropdown, dropdownStyle, frameStyle]}>
                                {loading ? this._renderLoading() : this._renderDropdown()}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        }
    }
    _calcPosition() {
        const { dropdownStyle, style, adjustFrame } = this.props;
        const dimensions = Dimensions.get('window');
        const windowWidth = dimensions.width;
        const windowHeight = dimensions.height;
        const dropdownHeight =
            (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
            StyleSheet.flatten(styles.dropdown).height;
        const bottomSpace =
            windowHeight - this._buttonFrame.y - this._buttonFrame.h;
        const rightSpace = windowWidth - this._buttonFrame.x;
        const showInBottom =
            bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
        const showInLeft = rightSpace >= this._buttonFrame.x;
        const positionStyle = {
            height: dropdownHeight,
            top: showInBottom
                ? this._buttonFrame.y + this._buttonFrame.h
                : Math.max(0, this._buttonFrame.y - dropdownHeight),
        };
        if (showInLeft) {
            positionStyle.left = this._buttonFrame.x;
        } else {
            const dropdownWidth =
                (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
                (style && StyleSheet.flatten(style).width) ||
                -1;
            if (dropdownWidth !== -1) {
                positionStyle.width = dropdownWidth;
            }
            positionStyle.right = rightSpace - this._buttonFrame.w;
        }
        return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
    }
    _onRequestClose = () => {
        const { onDropdownWillHide } = this.props;
        if (!onDropdownWillHide || onDropdownWillHide() !== false) {
            this.hide();
        }
    };
    _onModalPress = () => {
        const { onDropdownWillHide } = this.props;
        if (!onDropdownWillHide || onDropdownWillHide() !== false) {
            this.hide();
        }
    };
    _renderLoading = () => {
        return <ActivityIndicator size="small" />;
    };
    _renderDropdown() {
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
            />
        );
    }
    _renderItem = ({ item, index, separators }) => {
        const { accessible } = this.props;
        const { listSelected } = this.state;
        const key = `row_${index}`;
        const highlighted = _.includes(listSelected, item.studentId);
        const row = (
            <View style={{
                flexDirection: 'row',
                backgroundColor: highlighted ? '#2D9CDB' : '#E0E0E0',
                height: 20,
                alignItems: 'center',
                paddingHorizontal: 8
            }}>
                <View style={{
                    height: 10,
                    width: 10,
                    borderRadius: 2,
                    borderColor: '#fff',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginEnd: 8
                }}>
                    {highlighted ? <Icon name="remove" color={'#fff'} size={8} /> : null}
                </View>
                <Text style={{
                    fontSize: 12,
                    fontFamily: 'Nunito-Regular',
                    color: highlighted ? '#fff' : '#BDBDBD'
                }}>
                    {item.name}
                </Text>
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
                    return <TouchableHighlight {...props}>{children}</TouchableHighlight>;
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
        return <TouchableHighlight {...preservedProps}>{row}</TouchableHighlight>;
    };
    _onRowPress(rowData, rowID, highlightRow) {
        const { onSelect, renderButtonText, onDropdownWillHide } = this.props;
        const { listSelected, data } = this.state;
        let listSelectedTmp = listSelected;
        const index = _.indexOf(listSelectedTmp, rowData.studentId)
        index < 0
            ? listSelectedTmp = [...listSelectedTmp, ...[rowData.studentId]]
            : listSelectedTmp = [...listSelectedTmp.slice(0, index), ...listSelectedTmp.slice(index + 1)];
        if (!onSelect || onSelect(rowID, rowData) !== false) {
            highlightRow.highlight(rowID);
            this.setState({
                buttonText: !listSelectedTmp.length || listSelectedTmp.length === data.length ? 'Tất cả học sinh' : `${listSelectedTmp.length} học sinh`,
                listSelected: listSelectedTmp
            });
        }
        // if (!onDropdownWillHide || onDropdownWillHide() !== false) {
        //     this.setState({
        //         showDropdown: false,
        //     });
        // }
    }
    _renderSeparator = ({ leadingItem = '' }) => {
        const key = `spr_${leadingItem}`;
        return <View style={styles.separator} key={key} />;
    };
    render() {
        return (
            <View {...this.props}>
                {this._renderButton()}
                {this._renderModal()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 12,
    },
    modal: {
        flexGrow: 1,
    },
    dropdown: {
        position: 'absolute',
        height: (20 + StyleSheet.hairlineWidth) * 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        borderRadius: 2,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    loading: {
        alignSelf: 'center',
    },
    list: {
        // flexGrow: 1,
    },
    rowText: {
        paddingHorizontal: 6,
        paddingVertical: 10,
        fontSize: 11,
        color: 'gray',
        backgroundColor: 'white',
        textAlignVertical: 'center',
    },
    highlightedRowText: {
        color: 'black',
    },
    separator: {
        height: 1,
        backgroundColor: '#fff',
    },
});