import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    FlatList,
    ActivityIndicator,
    Dimensions,
    TouchableWithoutFeedback,
    Image
} from "react-native";
import { connect } from 'react-redux';
import dataHelper from '../../utils/dataHelper';
import apiPapers from '../../services/apiPapersTeacher';
import { getSourceAvatar } from '../../utils/Helper';
import { updateExamListAction } from '../../actions/paperAction';
import { setListGrades, setListSubject } from '../../actions/paperAction';
import _ from 'lodash';
import SearchComponent from "react-native-search-component";
import { RFFonsize } from '../../utils/Fonts';
import Globals from '../../utils/Globals';
import { alertDeletePaper } from '../../utils/Alert';
import ItemListTest from '../Teacher/Papers/ItemListTest';
import ModalOption from '../Teacher/Papers/ModalOption';
import ModalEditName from '../Teacher/Papers/ModalEditName';
import ModalEditConfig from '../Teacher/Papers/modalEditConfig';
import HeaderNavigation from './HeaderNavigation';
const { Value, timing } = Animated;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width, height } = Dimensions.get('window');
const NAVBAR_HEIGHT = 220;

class SearchScreen extends React.Component {

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
            onSearchClear: '',
            scrollAnim,
            offsetAnim,
            payloadAssignment: null,
            animation: 'fadeInUpBig',
            assignmentContentType: 0,
            typeChange: 0,
            dataFilter: [],
            text: ''
        };


        this._indexPage = 0;
        this._pageSize = 50;
        Globals.updatePaper = this.refreshData.bind(this);
    }

    openBack = () => {
        this.props.navigation.goBack();
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
            let dataFilter = this.filterData(listPapers);
            this.setState({
                listGrades,
                listSubjects,
                listPapers,
                loading: false,
                dataFilter,
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
    onLoadMore = async () => {
        this.setState({
            isLoadMore: true,
        });
        const { token } = await dataHelper.getToken();
        if (token) {
            this._indexPage++;

            let listPapers = this.state.listPapers;

            const res = await apiPapers.getPapers({
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

            if (res && res.status === 1) {
                listPapers = listPapers.concat(res.data);
            }

            this.setState({
                listPapers,
                isLoadMore: false,
                hideLoadMore: !(listPapers.length % this._pageSize === 0),
            });
        } else {
            this.setState({
                isLoadMore: false,
            });
        }
    };

    onUpdateItem = async item => {
        const { listPapers } = this.state;
        let listPapersTmp = listPapers;
        const index = _.findIndex(listPapers, ['assignmentId', item.assignmentId]);
        if (index > -1) {
            listPapersTmp[index] = item;
        }
        this.setState({
            listPapers: listPapersTmp,
        });
    };

    _crateBackUp = async id => {
        const { listGrades, listSubjects } = this.state;
        try {
            const { token } = await dataHelper.getToken();
            const res = await apiPapers.getAssignmentConfig({ token, id: id });
            if (res && res.assignmentContentType === 0) {
                const question = dataHelper.saveQuestion(res.questions);
                this.props.navigation.navigate('QuestionLibrary', {
                    nagigation: this.props.nagigation,
                    statusbar: 'light-content',
                });
            } else {
                this.props.navigation.navigate('UploadPDF', {
                    nagigation: this.props.nagigation,
                    listGrades,
                    listSubjects,
                    urlFile: res.listFile[0],
                    statusbar: 'dark-content',
                });
            }
        } catch (error) { }
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
        this.setState({ loading: true, }, () => this.onGetPapers())
    }

    onChangeText = e => {
        const textSearch = e?.nativeEvent?.text;
        this.searchData(textSearch);
    }

    searchData = (textSearch) => {
        this.setState({ textSearch });
        if (this.timeSearch) {
            clearTimeout(this.timeSearch);
            this.timeSearch = null;
        }
        this.timeSearch = setTimeout(this.searchPaper, 500);
    }

    onSearchClear = () => {
        this.setState({ textSearch: '' });
        if (this.timeSearch) {
            clearTimeout(this.timeSearch);
            this.timeSearch = null;
        }
        this.timeSearch = setTimeout(this.searchPaper, 500);
    }

    _handleClickDetail = index => () => {
        const {
            dataSelected,
            payloadAssignment,
        } = this.state;
        switch (index) {
            case 1:
                this.setState({ visibleEdit: false });
                this.props.navigation.navigate('ExcerciseDetail', {
                    subjectCode: dataSelected.subjectCode,
                    assignmentId: dataSelected.assignmentId,
                    name: dataSelected.name,
                    naviagtion: this.props.navigation,
                    statusbar: 'dark-content',
                });
                break;
            case 2:
                this.setState({ visibleEdit: false });
                this._crateBackUp(dataSelected.assignmentId);
                break;
            case 4:
                this.setState({ visibleEdit: false });
                this.props.navigation.navigate('Assignment', {
                    item: { ...dataSelected, id: dataSelected.assignmentId },
                    payloadAssignment,
                    statusbar: 'light-content',
                });
                break;
            case 7:
                this.setState({ visibleEdit: false });
                this.props.navigation.navigate('MarkingView', {
                    item: dataSelected,
                    statusbar: 'light-content',
                });
                break;

            default:
                break;
        }
    };

    _onOpenModal = item => (payloadAssignment, visibleEdit = true) => {
        this.setState(
            {
                visibleEdit,
                dataSelected: item,
                payloadAssignment,
                assignmentContentType: item.assignmentContentType,
            },
            () => {
                if (!visibleEdit) {
                    this._handleClickDetail(1)();
                }
            },
        );
    };
    _OpenModal = type => {
        this.setState(
            {
                visibleEdit: false,
            },
            () => {
                switch (type) {
                    case 3:
                        this.onVisibleModalEditName(true);
                        break;
                    case 4:
                        // this.onVisibleModalEdit(true);
                        this.props.navigation.navigate('EditConfig', {
                            statusbar: 'light-content',
                            data: this.state.dataSelected,
                            listGrades: this.state.listGrades,
                            listSubjects: this.state.listSubjects,
                            onUpdateItem: (item) => { this.onUpdateItem(item) }
                        });
                        break;
                    default:
                        break;
                }
            },
        );
    };

    OpenModalEdit = () => {
        this.setButton(this.button2, () => {
            this.setState({ popover: true });
        });
    };

    _listTestEmpty = () => {
        const { loading } = this.state;
        return (loading ?
            <ActivityIndicator
                animating
                size={'small'}
                style={{ height: height / 1.5 }}
                color="#F98E2F"
            />
            :
            <View style={styles.viewNotFound}>
                <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
            </View>
        );
    };

    _listTestFooter = () => {
        const { isLoadMore, hideLoadMore } = this.state;
        return hideLoadMore ? null : (
            <View style={{ width: '100%', height: 330 }}>
                <TouchableOpacity
                    onPress={this.onLoadMore}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: NAVBAR_HEIGHT,
                    }}>
                    {isLoadMore ? (
                        <ActivityIndicator size={'small'} />
                    ) : (
                            <Text
                                style={styles.more}>
                                Xem thêm
                            </Text>
                        )}
                </TouchableOpacity>
            </View>
        );
    };
    onPressChangeType = async (index) => {
        const { listPapers } = this.state;
        switch (index) {
            case 0: {
                await this.setState({ typeChange: 0 });

                break;
            }
            case 1: {
                await this.setState({ typeChange: 1 })

                break;
            }
            case 2: {
                await this.setState({ typeChange: 2 })

                break;
            }
            default: break;
        }
        let dataFilter = this.filterData(listPapers);
        this.setState({ dataFilter });
    }

    filterData(data) {
        const { typeChange } = this.state;
        let result = [];
        switch (typeChange) {
            case 0: {
                result = data;
                break;
            }
            case 2: {
                data.map(item => {
                    if (item.totalAssign < 1) {
                        result.push(item);
                    }
                })
                break;
            }
            case 1: {
                data.map(item => {
                    if (item.countCheckPoint > 0) {
                        result.push(item);
                    }
                })
                break;
            }
            default: break;
        }
        return result;
    }
    _handleCloseModal = () => {
        this.setState({ animation: 'fadeOutDownBig' }, () => {
            this.myTime = setTimeout(() => {
                this.setState({ animation: 'fadeInUpBig', visibleEdit: false });
            }, 220);
        });
    };

    renderItem = ({ item, index }) => {
        const textSearch = item.name;
        return (
            <TouchableWithoutFeedback
                onPress={() => { this.searchData(textSearch) }}
                hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <View style={styles.sugges}>
                    <Text numberOfLines={1}
                        style={styles.nameSug}>{textSearch}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
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
            textSearch,
            onSearchClear
        } = this.state;
        // console.log(listPapers);
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
        // console.log("render paper");
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <SafeAreaView />
                {/* <HeaderNavigation
                    title={'Tìm kiếm bộ đề'}
                    navigation={this.props.navigation}
                    goBack={this.openBack}
                    color={'#2D9CDB'}
                /> */}
                <View style={styles.backpa}>
                    <TouchableWithoutFeedback
                        hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        onPress={() => { this.props.navigation.goBack() }}
                    >
                        <View style={{ alignSelf: 'center', paddingLeft: 10 }}>
                            <Image source={require('../../asserts/icon/icon_arrowLeftv3.png')} />
                        </View>
                    </TouchableWithoutFeedback>
                    <SearchComponent
                        placeholder="Tìm kiếm"
                        cancelColor="#2D9CDB"
                        value={textSearch}
                        onChange={this.onChangeText}
                        onSearchClear={this.onSearchClear}
                        customSearchInputStyle={styles.textSear}
                        customCancelTextStyle={styles.txtCan}
                        placeholderTextColor="#828282"
                        autoFocus={true}
                    />
                </View>
                {this.state.textSearch == '' ?
                    <View style={{ marginHorizontal: 16, paddingTop: 5 }}>
                        {listPapers == listPapers.length > 0 ?
                            <ActivityIndicator size="small" style={{ marginTop: height * 0.1 }} />
                            :
                            <FlatList
                                data={listPapers.slice(0, 9)}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                numColumns={2}
                                showsHorizontalScrollIndicator={false}
                            />

                        }

                    </View>
                    :
                    <AnimatedFlatList
                        style={{ paddingHorizontal: 16 }}
                        data={listPapers}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={dataFilter}
                        ListEmptyComponent={this._listTestEmpty}
                        // ListFooterComponent={this._listTestFooter}
                        renderItem={({ item, index }) => {
                            return (
                                <ItemListTest item={item} onOpenModal={this._onOpenModal(item)} />
                            )
                        }}
                        initialNumToRender={10}
                        bounces={false}
                        scrollEventThrottle={1}
                        onScroll={Animated.event([
                            {
                                nativeEvent: { contentOffset: { y: this._scroll_y } }
                            }
                        ],
                            { useNativeDriver: true }
                        )}
                    />
                }
                {visibleModalEdit ? (
                    <ModalEditConfig
                        onVisible={visible => this.onVisibleModalEdit(visible)}
                        onUpdateItem={item => this.onUpdateItem(item)}
                        listGrades={listGrades}
                        listSubjects={listSubjects}
                        data={dataSelected}
                    />
                )
                    :
                    null
                }
                {visibleModalEditName
                    ?
                    (
                        <ModalEditName
                            onVisible={visible => this.onVisibleModalEditName(visible)}
                            onUpdateItem={item => this.onUpdateItem(item)}
                            listGrades={listGrades}
                            listSubjects={listSubjects}
                            data={dataSelected}
                        />
                    )
                    :
                    null
                }
                <ModalOption
                    visibleEdit={visibleEdit}
                    _handleCloseModal={this._handleCloseModal}
                    _handleClickDetail={this._handleClickDetail}
                    _OpenModal={this._OpenModal}
                    animation={animation}
                    assignmentContentType={assignmentContentType}
                    dataSelected={dataSelected}
                    deletePaper={this.deletePaper}
                />
                <SafeAreaView />
            </SafeAreaView>
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textStyle: {
        fontSize: 24,
        textAlign: "center",
        paddingVertical: 10,
    },
    button: {
        width: 38,
        height: 38,
    },
    backpa: {
        flexDirection: "row",
        paddingVertical: 5,
    },
    viewNotFound: {
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtNotFound: {
        fontFamily: 'Nunito-Regular',
        fontSize: RFFonsize(14),
        color: '#000',
    },
    more: {
        color: '#000',
        fontFamily: 'Nunito-Bold',
        fontSize: RFFonsize(14),
        textAlign: 'center',
    },
    txtCan: {
        fontFamily: 'Nunito',
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
        marginLeft: -35
    },
    textSear: {
        paddingRight: 35,
        fontFamily: 'Nunito',
        fontSize: RFFonsize(16),
        lineHeight: RFFonsize(20),
        marginRight: width * 0.1
    },
    sugges: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 16
    },
    nameSug: {
        paddingHorizontal: 16,
        paddingVertical: 5,
        alignSelf: "center",
        fontFamily: "Nunito",
        fontSize: RFFonsize(12),
        lineHeight: RFFonsize(16),
        color: '#383838',
        borderWidth: 0.5,
        borderColor: "#c4c4c4",
        borderStyle: 'solid',
        borderRadius: 18,
        backgroundColor: '#ededed',
        overflow: 'hidden'
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
)(SearchScreen);

