import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    FlatList,
    Text,
    Platform,
    Dimensions,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { RFFonsize } from '../../utils/Fonts';
import RippleButton from '../common-new/RippleButton';
import { getSourceAvatar } from '../../utils/Helper';
import Avatar from '../common-new/Avatar';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import dataHelper from '../../utils/dataHelper';
import Globals from '../../utils/Globals';
import ModalAddPaper from '../Teacher/Papers/ModalAddPaper';
import { connect } from 'react-redux';
import _ from 'lodash';
import { alertDeletePaper } from '../../utils/Alert';
import { updateExamListAction } from '../../actions/paperAction';
import { isIphoneX } from 'react-native-iphone-x-helper';
import apiPapers from '../../services/apiPapersTeacher';
import { setListGrades, setListSubject } from '../../actions/paperAction';
import { TextInput } from 'react-native-gesture-handler';
const { Value, timing } = Animated;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
class HeaderSearchNew extends React.Component {
    constructor(props) {
        super(props);
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);
        this._scroll_y = new Value(0)
        this.state = {
            enableModalConfig: false,
            visibleEdit: false,
            visibleModalAdd: false,
            gradeActive: [],
            subjectActive: [],
            listSubjects: [],
            listGrades: [],
            listPapers: [],
            loading: true,
            dataSelected: null,
            visibleModalEdit: false,
            isLoadMore: false,
            hideLoadMore: false,
            visibleModalEditName: false,
            textSearch: '',
            scrollAnim,
            offsetAnim,
            payloadAssignment: null,
            animation: 'fadeInUpBig',
            assignmentContentType: 0,
            typeChange: 0,
            dataFilter: []
        };


        this._indexPage = 0;
        this._pageSize = 50;
        Globals.updatePaper = this.refreshData.bind(this);
    }
    openDrawer = () => {
        requestAnimationFrame(() => {
            this.props.navigation.toggleDrawer();
        });
    };

    refreshData = async () => {
        this.getData();
    };
    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const { token } = await dataHelper.getToken();
        this.setState({ loading: true });
        if (token) {
            let listGrades = [];
            let listSubjects = [];
            let listPapers = [];

            const resGrade = await apiPapers.getGrade({ token });
            if (resGrade) {
                listGrades = resGrade;
                this.props.saveGrades(resGrade);
            }

            const resSubject = await apiPapers.getSubject({ token });
            if (resSubject) {
                listSubjects = resSubject;
                this.props.saveSubject(resSubject);
            }

            this._indexPage = 0;

            const resPapers = await apiPapers.getPapers({
                token,
                body: {
                    text: '',
                    gradeCode: [],
                    subjectCode: [],
                    status: [],
                    indexPage: this._indexPage,
                    isShare: true,
                },
            });
            if (resPapers && resPapers.status === 1) {
                listPapers = resPapers.data;
            }
            this.setState({
                listGrades,
                listSubjects,
                listPapers,
                loading: false,
                hideLoadMore: !(listPapers.length % this._pageSize === 0),
            });
        } else {
            this.setState({
                loading: false,
                hideLoadMore: true,
            });
        }
    };

    deletePaper = async () => alertDeletePaper('Xoá bộ đề', 'Bạn có muốn xoá bộ đề này!', async () => {
        const { dataSelected } = this.state;
        const { token } = await dataHelper.getToken();
        const response = await apiPapers.deletePaper({
            token,
            id: dataSelected.assignmentId,
        });
        if (response.status === 1) {
            this.setState(
                {
                    visibleEdit: false,
                },
                () => this.getListPaper(token),
            );
        }
    })

    getListPaper = async token => {
        this.setState(
            {
                loading: true,
            },
            async () => {
                const resPapers = await apiPapers.getPapers({
                    token,
                    body: {
                        text: '',
                        gradeCode: [],
                        subjectCode: [],
                        status: [],
                        indexPage: this._indexPage,
                        isShare: true,
                    },
                });
                if (resPapers && resPapers.status === 1) {
                    this.setState(
                        {
                            listPapers: resPapers.data,
                            loading: false,
                            hideLoadMore: true,
                        }
                    );
                }
            },
        );
    };

    onGetPapers = async () => {
        const { gradeActive, subjectActive, textSearch } = this.state;
        const { token } = await dataHelper.getToken();
        if (token) {
            this._indexPage = 0;
            const resPapers = await apiPapers.getPapers({
                token,
                body: {
                    text: textSearch,
                    gradeCode: gradeActive,
                    subjectCode: subjectActive,
                    status: [],
                    indexPage: this._indexPage,
                    isShare: true,
                },
            });
            if (resPapers && resPapers.status === 1) {
                this.setState({
                    listPapers: resPapers.data,
                    loading: false,
                });
            }
        } else {
            this.setState({
                loading: false,
            });
        }
    };

    _handleAddPaper = () => {
        dataHelper.saveQuestion([]);
        this.setState({ visibleModalAdd: true });
    };

    onPress = () => {
        this.setState({ visibleModalAdd: false }, () =>
            this.props.navigation.navigate('QuestionLibrary', {
                nagigation: this.props.nagigation,
                statusbar: 'light-content',
            }),
        );
    };

    componentDidUpdate() {
        if (this.props.updateListExam) {
            this.props.needUpdate(false);
            this.getData();
        }
    }

    onPressUploadPDF = () => {
        const { listGrades, listSubjects } = this.state;
        this.setState({ visibleModalAdd: false }, () =>
            this.props.navigation.navigate('UploadPDF', {
                nagigation: this.props.nagigation,
                listGrades,
                listSubjects,
                statusbar: 'dark-content',
            }),
        );
    };

    onPressCopy = () => {
        const { listSubjects } = this.state;
        this.setState({ visibleModalAdd: false }, () =>
            this.props.navigation.navigate('CopyFromSubjectExists', {
                nagigation: this.props.nagigation,
                listSubjects,
                statusbar: 'light-content',
            }),
        );
    }

    closeModal = () => this.setState({ visibleModalAdd: false });

    onVisibleModalEdit = visible => {
        this.setState({
            visibleModalEdit: visible,
        });
    };

    onVisibleModalEditName = visible => {
        this.setState({
            visibleModalEditName: visible,
        });
    };

    componentWillUnmount() {
        if (this.myTimecloseModal) {
            clearTimeout(this.myTimecloseModal);
            this.myTimecloseModal = null;
        }
        if (this.myTime) {
            clearTimeout(this.myTime);
            this.myTime = null;
        }
    }

    searchPaper = () => {
        this.props.searchPaper();
    }

    onChangeText = text => {
        this.props.onChangeText(text);
    }


    render() {
        const { userId, timeCached } = this.props;
        const source = getSourceAvatar(userId, timeCached);
        const {
            loading,
            animation,
            listGrades,
            listPapers,
            visibleEdit,
            gradeActive,
            listSubjects,
            dataSelected,
            subjectActive,
            visibleModalAdd,
            visibleModalEdit,
            visibleModalEditName,
            assignmentContentType,
            dataFilter,
        } = this.state;
        const { textSearch } = this.props;
        const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 330);
        const _header_opacity = _diff_clamp_scroll_y.interpolate({
            inputRange: [0, 50],
            outputRange: [1, 1],
            extrapolate: 'clamp'
        })
        let translateY = _diff_clamp_scroll_y.interpolate({
            inputRange: [0, 330],
            outputRange: [0, -330],
            extrapolate: 'clamp',
        });

        console.log("render paper");

        return (
            <View style={styles.container}>
                <RippleButton onPress={this.openDrawer}>
                    <View style={styles.button}>
                        <Image
                            source={require('../../asserts/icon/menu.png')}
                            style={{ tintColor: '#383838' }}
                            tintColor={'#383838'} />
                    </View>
                </RippleButton>

                {/* <Image source={require('../../asserts/icon/logo_onluyen.png')} /> */}
                <TouchableOpacity
                    // onPress={() => this.searchPaper()}
                    onPress={() =>
                        this.props.navigation.navigate('SearchScreen')
                    }
                    style={styles.styWrapSearch}>
                    <TextInput
                        placeholder='Tìm kiếm...'
                        placeholderTextColor='#C4C4C4'
                        style={styles.searchPaper}
                        value={textSearch}
                        onChangeText={this.onChangeText}
                    // onEndEditing={() => this.searchPaper()}
                    />
                    <EvilIcons name={'search'} size={20} color={'#C4C4C4'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.addPaper} onPress={this._handleAddPaper}>
                    <Text style={styles.txtAdd}>Thêm bộ đề</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.dot}>
                    <Text style={styles.dotMain}>...</Text>
                </TouchableOpacity> */}
                <ModalAddPaper
                    onPress={this.onPress}
                    closeModal={this.closeModal}
                    onPressCopy={this.onPressCopy}
                    visibleModalAdd={visibleModalAdd}
                    onPressUploadPDF={this.onPressUploadPDF}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 12,
    },
    button: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnAvatar: {
        height: 25,
        width: 25,
        borderRadius: 12.5,
        marginLeft: 10,
    },
    imgAvatar: {
        height: 25,
        width: 25,
        borderRadius: 12.5,
    },
    searchPaper: {
        height: 40,
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#000',
        fontFamily: 'Nunito-Regular',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    styWrapSearch: {
        fontFamily: 'Nunito-Regular',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#C4C4C4',
        borderWidth: 0.5,
        borderRadius: 4,
        paddingHorizontal: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 20,
        marginLeft: 10,
        height: 25,
        color: '#000',
        alignSelf: "center"
    },
    addPaper: {
        flex: 1,
        backgroundColor: '#2D9CDB',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtAdd: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(14),
        lineHeight: RFFonsize(18),
        color: "#fff",
        alignSelf: 'center',
        marginTop: 2,
        marginBottom: 2
    },
    dotMain: {
        transform: [{ rotate: '90deg' }],
        fontSize: RFFonsize(25),
        color: '#000',
        fontWeight: '900',
        fontFamily: 'Nunito-Bold',
        left: 10
    },
    dot: {
        marginHorizontal: 5
    }
});

const mapStateToProps = state => {
    return {
        user: state.user,
        updateListExam: state.paper.updateListExam
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveGrades: listGrades => dispatch(setListGrades(listGrades)),
        saveSubject: listSubjects => dispatch(setListSubject(listSubjects)),
        needUpdate: (payload) => dispatch(updateExamListAction(payload)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderSearchNew);
