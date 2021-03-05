import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Animated,
    FlatList,
    Text
} from 'react-native';
import { RFFonsize } from '../../utils/Fonts';
import RippleButton from '../common-new/RippleButton';
import { getSourceAvatar } from '../../utils/Helper';
import Avatar from '../common-new/Avatar';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Globals from '../../utils/Globals';
const { Value, timing } = Animated;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class HeaderMainPaper extends React.Component {
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
        // Globals.updatePaper = this.refreshData.bind(this);
    }

    openDrawer = () => {
        requestAnimationFrame(() => {
            this.props.navigation.toggleDrawer();
        });
    };
    // searchPaper = () => {
    //     this.setState({ loading: true, }, () => this.onGetPapers())
    // }

    // onChangeText = text => {
    //     this.setState({ textSearch: text });
    //     if (this.timeSearch) {
    //         clearTimeout(this.timeSearch);
    //         this.timeSearch = null;
    //     }
    //     this.timeSearch = setTimeout(this.searchPaper, 1000);
    // }
    // refreshData = async () => {
    //     this.getData();
    // };
    // componentDidMount() {
    //     this.getData();
    // }
    // onGetPapers = async () => {
    //     const { gradeActive, subjectActive, textSearch } = this.state;
    //     const { token } = await dataHelper.getToken();
    //     if (token) {
    //         this._indexPage = 0;
    //         const resPapers = await apiPapers.getPapers({
    //             token,
    //             body: {
    //                 text: textSearch,
    //                 gradeCode: gradeActive,
    //                 subjectCode: subjectActive,
    //                 status: [],
    //                 indexPage: this._indexPage,
    //                 isShare: true,
    //             },
    //         });
    //         if (resPapers && resPapers.status === 1) {
    //             this.setState({
    //                 listPapers: resPapers.data,
    //                 loading: false,
    //             });
    //         }
    //     } else {
    //         this.setState({
    //             loading: false,
    //         });
    //     }
    // };

    render() {
        const { userId, timeCached } = this.props;
        const source = getSourceAvatar(userId, timeCached);
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
                <View style={styles.styWrapSearch}>
                    <TextInput
                        placeholder='Tìm kiếm...'
                        placeholderTextColor='#C4C4C4'
                        style={styles.searchPaper}
                        // value={textSearch}
                        onChangeText={this.onChangeText}
                    // onEndEditing={() => this.searchPaper()}
                    />
                    <EvilIcons name={'search'} size={20} color={'#C4C4C4'} />
                </View>

                <TouchableOpacity style={styles.addPaper}>
                    <Text style={styles.txtAdd}>Thêm bộ đề</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dot}>
                    <Text style={styles.dotMain}>...</Text>
                </TouchableOpacity>

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
        height: 20,
        fontSize: RFFonsize(12),
        color: '#000',
        fontFamily: 'Nunito-Regular',
        flex: 1,
    },
    styWrapSearch: {
        flexDirection: 'row',
        borderColor: '#C4C4C4',
        borderWidth: 0.5,
        borderRadius: 4,
        paddingHorizontal: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 20
    },
    addPaper: {
        flex: 1,
        backgroundColor: '#2D9CDB',
        borderRadius: 2
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
