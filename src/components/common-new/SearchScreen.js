// import React, { Component } from 'react';
// import {
//     View,
//     StyleSheet,
//     Image,
//     TouchableOpacity,
//     Animated,
//     FlatList,
//     Text,
//     Platform,
//     Dimensions,
//     ActivityIndicator,
//     SafeAreaView,
// } from 'react-native';
// import { RFFonsize } from '../../utils/Fonts';
import RippleButton from '../common-new/RippleButton';
// import { getSourceAvatar } from '../../utils/Helper';
// import Avatar from '../common-new/Avatar';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import dataHelper from '../../utils/dataHelper';
// import Globals from '../../utils/Globals';
// import ModalAddPaper from '../Teacher/Papers/ModalAddPaper';
// import { connect } from 'react-redux';
// import _ from 'lodash';
// import { alertDeletePaper } from '../../utils/Alert';
// import { updateExamListAction } from '../../actions/paperAction';
// import { isIphoneX } from 'react-native-iphone-x-helper';
// import apiPapers from '../../services/apiPapersTeacher';
// import { setListGrades, setListSubject } from '../../actions/paperAction';
import IconIonicons from 'react-native-vector-icons/Ionicons';
// import { TextInput } from 'react-native-gesture-handler';
// const { Value, timing } = Animated;
// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
// class SearchScreen extends React.Component {
//     constructor(props) {
//         super(props);
//         const scrollAnim = new Animated.Value(0);
//         const offsetAnim = new Animated.Value(0);
//         this._scroll_y = new Value(0)
//         this.state = {
//             enableModalConfig: false,
//             visibleEdit: false,
//             visibleModalAdd: false,
//             gradeActive: [],
//             subjectActive: [],
//             listSubjects: [],
//             listGrades: [],
//             listPapers: [],
//             loading: true,
//             dataSelected: null,
//             visibleModalEdit: false,
//             isLoadMore: false,
//             hideLoadMore: false,
//             visibleModalEditName: false,
//             textSearch: '',
//             scrollAnim,
//             offsetAnim,
//             payloadAssignment: null,
//             animation: 'fadeInUpBig',
//             assignmentContentType: 0,
//             typeChange: 0,
//             dataFilter: []
//         };


//         this._indexPage = 0;
//         this._pageSize = 50;
//         Globals.updatePaper = this.refreshData.bind(this);
//     }
// openBack = () => {
//     this.props.navigation.goBack();
// };

//     refreshData = async () => {
//         this.getData();
//     };
//     componentDidMount() {
//         this.getData();
//     }

//     getData = async () => {
//         const { token } = await dataHelper.getToken();
//         this.setState({ loading: true });
//         if (token) {
//             let listGrades = [];
//             let listSubjects = [];
//             let listPapers = [];

//             const resGrade = await apiPapers.getGrade({ token });
//             if (resGrade) {
//                 listGrades = resGrade;
//                 this.props.saveGrades(resGrade);
//             }

//             const resSubject = await apiPapers.getSubject({ token });
//             if (resSubject) {
//                 listSubjects = resSubject;
//                 this.props.saveSubject(resSubject);
//             }

//             this._indexPage = 0;

//             const resPapers = await apiPapers.getPapers({
//                 token,
//                 body: {
//                     text: '',
//                     gradeCode: [],
//                     subjectCode: [],
//                     status: [],
//                     indexPage: this._indexPage,
//                     isShare: true,
//                 },
//             });
//             if (resPapers && resPapers.status === 1) {
//                 listPapers = resPapers.data;
//             }
//             this.setState({
//                 listGrades,
//                 listSubjects,
//                 listPapers,
//                 loading: false,
//                 hideLoadMore: !(listPapers.length % this._pageSize === 0),
//             });
//         } else {
//             this.setState({
//                 loading: false,
//                 hideLoadMore: true,
//             });
//         }
//     };

//     deletePaper = async () => alertDeletePaper('Xoá bộ đề', 'Bạn có muốn xoá bộ đề này!', async () => {
//         const { dataSelected } = this.state;
//         const { token } = await dataHelper.getToken();
//         const response = await apiPapers.deletePaper({
//             token,
//             id: dataSelected.assignmentId,
//         });
//         if (response.status === 1) {
//             this.setState(
//                 {
//                     visibleEdit: false,
//                 },
//                 () => this.getListPaper(token),
//             );
//         }
//     })

//     getListPaper = async token => {
//         this.setState(
//             {
//                 loading: true,
//             },
//             async () => {
//                 const resPapers = await apiPapers.getPapers({
//                     token,
//                     body: {
//                         text: '',
//                         gradeCode: [],
//                         subjectCode: [],
//                         status: [],
//                         indexPage: this._indexPage,
//                         isShare: true,
//                     },
//                 });
//                 if (resPapers && resPapers.status === 1) {
//                     this.setState(
//                         {
//                             listPapers: resPapers.data,
//                             loading: false,
//                             hideLoadMore: true,
//                         }
//                     );
//                 }
//             },
//         );
//     };

//     onGetPapers = async () => {
//         const { gradeActive, subjectActive, textSearch } = this.state;
//         const { token } = await dataHelper.getToken();
//         if (token) {
//             this._indexPage = 0;
//             const resPapers = await apiPapers.getPapers({
//                 token,
//                 body: {
//                     text: textSearch,
//                     gradeCode: gradeActive,
//                     subjectCode: subjectActive,
//                     status: [],
//                     indexPage: this._indexPage,
//                     isShare: true,
//                 },
//             });
//             if (resPapers && resPapers.status === 1) {
//                 this.setState({
//                     listPapers: resPapers.data,
//                     loading: false,
//                 });
//             }
//         } else {
//             this.setState({
//                 loading: false,
//             });
//         }
//     };

//     _handleAddPaper = () => {
//         dataHelper.saveQuestion([]);
//         this.setState({ visibleModalAdd: true });
//     };

//     onPress = () => {
//         this.setState({ visibleModalAdd: false }, () =>
//             this.props.navigation.navigate('QuestionLibrary', {
//                 nagigation: this.props.nagigation,
//                 statusbar: 'light-content',
//             }),
//         );
//     };

//     componentDidUpdate() {
//         if (this.props.updateListExam) {
//             this.props.needUpdate(false);
//             this.getData();
//         }
//     }

//     onPressUploadPDF = () => {
//         const { listGrades, listSubjects } = this.state;
//         this.setState({ visibleModalAdd: false }, () =>
//             this.props.navigation.navigate('UploadPDF', {
//                 nagigation: this.props.nagigation,
//                 listGrades,
//                 listSubjects,
//                 statusbar: 'dark-content',
//             }),
//         );
//     };

//     onPressCopy = () => {
//         const { listSubjects } = this.state;
//         this.setState({ visibleModalAdd: false }, () =>
//             this.props.navigation.navigate('CopyFromSubjectExists', {
//                 nagigation: this.props.nagigation,
//                 listSubjects,
//                 statusbar: 'light-content',
//             }),
//         );
//     }

//     closeModal = () => this.setState({ visibleModalAdd: false });

//     onVisibleModalEdit = visible => {
//         this.setState({
//             visibleModalEdit: visible,
//         });
//     };

//     onVisibleModalEditName = visible => {
//         this.setState({
//             visibleModalEditName: visible,
//         });
//     };

//     componentWillUnmount() {
//         if (this.myTimecloseModal) {
//             clearTimeout(this.myTimecloseModal);
//             this.myTimecloseModal = null;
//         }
//         if (this.myTime) {
//             clearTimeout(this.myTime);
//             this.myTime = null;
//         }
//     }

//     searchPaper = () => {
//         this.props.searchPaper();
//     }

//     onChangeText = text => {
//         this.props.onChangeText(text);
//     }


//     render() {
//         const { userId, timeCached } = this.props;
//         const source = getSourceAvatar(userId, timeCached);
//         const {
//             loading,
//             animation,
//             listGrades,
//             listPapers,
//             visibleEdit,
//             gradeActive,
//             listSubjects,
//             dataSelected,
//             subjectActive,
//             visibleModalAdd,
//             visibleModalEdit,
//             visibleModalEditName,
//             assignmentContentType,
//             dataFilter,
//         } = this.state;
//         const { textSearch } = this.props;
//         const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 330);
//         const _header_opacity = _diff_clamp_scroll_y.interpolate({
//             inputRange: [0, 50],
//             outputRange: [1, 1],
//             extrapolate: 'clamp'
//         })
//         let translateY = _diff_clamp_scroll_y.interpolate({
//             inputRange: [0, 330],
//             outputRange: [0, -330],
//             extrapolate: 'clamp',
//         });

//         console.log("render paper");

//         return (
//             <View style={styles.container}>
//                 <SafeAreaView />
//                 <RippleButton onPress={this.openBack}>
//                     <View style={styles.button}>
//                         <IconIonicons name="arrow-back-circle-outline" size={30} />
//                     </View>
//                 </RippleButton>

//                 {/* <Image source={require('../../asserts/icon/logo_onluyen.png')} /> */}
//                 <TouchableOpacity
//                     // onPress={() => this.searchPaper()}
//                     onPress={() => this.props.navigation.navigate('SearchScreen')}
//                     style={styles.styWrapSearch}>
//                     <TextInput
//                         placeholder='Tìm kiếm...'
//                         placeholderTextColor='#C4C4C4'
//                         style={styles.searchPaper}
//                         value={textSearch}
//                         onChangeText={this.onChangeText}
//                     // onEndEditing={() => this.searchPaper()}
//                     />
//                     <EvilIcons name={'search'} size={20} color={'#C4C4C4'} />
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.addPaper} onPress={this._handleAddPaper}>
//                     <Text style={styles.txtAdd}>Thêm bộ đề</Text>
//                 </TouchableOpacity>

//                 {/* <TouchableOpacity style={styles.dot}>
//                     <Text style={styles.dotMain}>...</Text>
//                 </TouchableOpacity> */}
//                 <ModalAddPaper
//                     onPress={this.onPress}
//                     closeModal={this.closeModal}
//                     onPressCopy={this.onPressCopy}
//                     visibleModalAdd={visibleModalAdd}
//                     onPressUploadPDF={this.onPressUploadPDF}
//                 />
//             </View>

//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         // paddingVertical: 5,
//         paddingTop: 50,
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginLeft: 10,
//         marginRight: 12,
//     },
//     button: {
//         width: 38,
//         height: 38,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     btnAvatar: {
//         height: 25,
//         width: 25,
//         borderRadius: 12.5,
//         marginLeft: 10,
//     },
//     imgAvatar: {
//         height: 25,
//         width: 25,
//         borderRadius: 12.5,
//     },
//     searchPaper: {
//         height: 40,
//         fontSize: RFFonsize(12),
//         lineHeight: RFFonsize(16),
//         color: '#000',
//         fontFamily: 'Nunito-Regular',
//         alignItems: 'center',
//         alignSelf: 'center',
//         justifyContent: 'center',
//         flex: 1,
//     },
//     styWrapSearch: {
//         fontFamily: 'Nunito-Regular',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         borderColor: '#C4C4C4',
//         borderWidth: 0.5,
//         borderRadius: 4,
//         paddingHorizontal: 10,
//         alignItems: 'center',
//         flex: 1,
//         marginRight: 20,
//         marginLeft: 10,
//         height: 25,
//         color: '#000',
//         alignSelf: "center"
//     },
//     addPaper: {
//         flex: 1,
//         backgroundColor: '#2D9CDB',
//         borderRadius: 4,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     txtAdd: {
//         fontFamily: 'Nunito',
//         fontSize: RFFonsize(14),
//         lineHeight: RFFonsize(18),
//         color: "#fff",
//         alignSelf: 'center',
//         marginTop: 2,
//         marginBottom: 2
//     },
//     dotMain: {
//         transform: [{ rotate: '90deg' }],
//         fontSize: RFFonsize(25),
//         color: '#000',
//         fontWeight: '900',
//         fontFamily: 'Nunito-Bold',
//         left: 10
//     },
//     dot: {
//         marginHorizontal: 5
//     }
// });

// const mapStateToProps = state => {
//     return {
//         user: state.user,
//         updateListExam: state.paper.updateListExam
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//         saveGrades: listGrades => dispatch(setListGrades(listGrades)),
//         saveSubject: listSubjects => dispatch(setListSubject(listSubjects)),
//         needUpdate: (payload) => dispatch(updateExamListAction(payload)),
//     };
// };

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps,
// )(SearchScreen);
// Import react
import React from 'react'

// Import react-native components
import {
    SafeAreaView,
    Dimensions,
    StyleSheet,
    View,
    TextInput,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
} from 'react-native'


import Icon from 'react-native-vector-icons/FontAwesome5'


import Animated, { Easing } from 'react-native-reanimated'
const { Value, timing } = Animated

// Calculate window size
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

// Declare component 
class FBSearchBar extends React.Component {

    constructor(props) {
        super(props)

        // state
        this.state = {
            isFocused: false,
            keyword: ''
        }

        // animation values
        this._input_box_translate_x = new Value(width)
        this._back_button_opacity = new Value(0)
        this._content_translate_y = new Value(height)
        this._content_opacity = new Value(0)
    }
    openBack = () => {
        this.props.navigation.goBack();
    };

    _onFocus = () => {
        // update state
        this.setState({ isFocused: true })
        // animation config
        // input box
        const input_box_translate_x_config = {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }
        const back_button_opacity_config = {
            duration: 200,
            toValue: 1,
            easing: Easing.inOut(Easing.ease)
        }

        // content
        const content_translate_y_config = {
            duration: 0,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }
        const content_opacity_config = {
            duration: 200,
            toValue: 1,
            easing: Easing.inOut(Easing.ease)
        }

        // run animation
        timing(this._input_box_translate_x, input_box_translate_x_config).start()
        timing(this._back_button_opacity, back_button_opacity_config).start()
        timing(this._content_translate_y, content_translate_y_config).start()
        timing(this._content_opacity, content_opacity_config).start()

        // force focus
        this.refs.input.focus()

    }

    _onBlur = () => {
        // update state
        this.setState({ isFocused: false })
        // animation config
        // input box
        const input_box_translate_x_config = {
            duration: 200,
            toValue: width,
            easing: Easing.inOut(Easing.ease)
        }
        const back_button_opacity_config = {
            duration: 50,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }

        // content
        const content_translate_y_config = {
            duration: 0,
            toValue: height,
            easing: Easing.inOut(Easing.ease)
        }
        const content_opacity_config = {
            duration: 200,
            toValue: 0,
            easing: Easing.inOut(Easing.ease)
        }

        // run animation
        timing(this._input_box_translate_x, input_box_translate_x_config).start()
        timing(this._back_button_opacity, back_button_opacity_config).start()
        timing(this._content_translate_y, content_translate_y_config).start()
        timing(this._content_opacity, content_opacity_config).start()

        // force blur
        this.refs.input.blur();

    }

    render() {
        return (
            <>
                <SafeAreaView style={styles.header_safe_area}>
                    <View style={styles.header}>
                        <View style={styles.header_inner}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>

                                <RippleButton onPress={this.openBack}>
                                    <View style={styles.button}>
                                        <IconIonicons name="chevron-back-outline" size={30} />
                                    </View>
                                </RippleButton>
                                <Image source={require('../../asserts/icon/logo_onluyen.png')} />
                            </View>
                            <TouchableHighlight
                                activeOpacity={1}
                                underlayColor={"#ccd0d5"}
                                onPress={this._onFocus}
                                style={styles.search_icon_box}
                            >
                                <Icon name="search" size={22} color="#000000" />
                            </TouchableHighlight>
                            <Animated.View
                                style={[styles.input_box, { transform: [{ translateX: this._input_box_translate_x }] }]}
                            >
                                <Animated.View style={{ opacity: this._back_button_opacity }}>
                                    <TouchableHighlight
                                        activeOpacity={1}
                                        underlayColor={"#ccd0d5"}
                                        onPress={this._onBlur}
                                        style={styles.back_icon_box}
                                    >
                                        <Icon name="chevron-left" size={22} color="#000000" />
                                    </TouchableHighlight>
                                </Animated.View>
                                <TextInput
                                    ref="input"
                                    placeholder="Search Facebook"
                                    clearButtonMode="always"
                                    value={this.state.keyword}
                                    onChangeText={(value) => this.setState({ keyword: value })}
                                    style={styles.input}
                                />
                            </Animated.View>
                        </View>
                    </View>
                </SafeAreaView>

                <Animated.View style={[styles.content, { opacity: this._content_opacity, transform: [{ translateY: this._content_translate_y }] }]}>
                    <SafeAreaView style={styles.content_safe_area}>
                        <View style={styles.content_inner}>
                            <View style={styles.separator} />
                            {
                                this.state.keyword === ''
                                    ?
                                    <View style={styles.image_placeholder_container}>
                                        <IconIonicons name="arrow-back-circle-outline" size={30} />
                                        <Text style={styles.image_placeholder_text}>
                                            Enter a few words{"\n"}to search on Facebook
                                        </Text>
                                    </View>
                                    :
                                    <ScrollView>
                                        <View style={styles.search_item}>
                                            <Icon style={styles.item_icon} name="search" size={16} color="#cccccc" />
                                            <Text>Fake result 1</Text>
                                        </View>
                                        <View style={styles.search_item}>
                                            <Icon style={styles.item_icon} name="search" size={16} color="#cccccc" />
                                            <Text>Fake result 2</Text>
                                        </View>
                                        <View style={styles.search_item}>
                                            <Icon style={styles.item_icon} name="search" size={16} color="#cccccc" />
                                            <Text>Fake result 3</Text>
                                        </View>
                                        <View style={styles.search_item}>
                                            <Icon style={styles.item_icon} name="search" size={16} color="#cccccc" />
                                            <Text>Fake result 4</Text>
                                        </View>
                                        <View style={styles.search_item}>
                                            <Icon style={styles.item_icon} name="search" size={16} color="#cccccc" />
                                            <Text>Fake result 5</Text>
                                        </View>
                                    </ScrollView>
                            }
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </>
        )
    }
}

export default FBSearchBar

const styles = StyleSheet.create({
    header_safe_area: {
        zIndex: 1000
    },
    header: {
        height: 50,
        paddingHorizontal: 16
    },
    header_inner: {
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
    },
    search_icon_box: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#e4e6eb',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input_box: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        width: width - 32
    },
    back_icon_box: {
        width: 40,
        height: 40,
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#e4e6eb',
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 15
    },
    content: {
        width: width,
        height: height,
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 999
    },
    content_safe_area: {
        flex: 1,
        backgroundColor: 'white'
    },
    content_inner: {
        flex: 1,
        paddingTop: 50
    },
    separator: {
        marginTop: 5,
        height: 1,
        backgroundColor: '#e6e4eb'
    },
    image_placeholder_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '-50%'
    },
    image_placeholder: {
        width: 150,
        height: 113,
        alignSelf: 'center'
    },
    image_placeholder_text: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 5
    },
    search_item: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e6e4eb',
        marginLeft: 16
    },
    item_icon: {
        marginRight: 15
    },
    button: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
