import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  FlatList
} from 'react-native';
import ModalEditConfig from './modalEditConfig';
import _ from 'lodash';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import ModalEditName from './ModalEditName';
import { connect } from 'react-redux';
import { setListGrades, setListSubject } from '../../../actions/paperAction';
import Globals from '../../../utils/Globals';
import HeaderMain from '../../common-new/HeaderMain';
import { alertDeletePaper } from '../../../utils/Alert';
import { TextInput } from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ClassItem from './ClassItem';
import SubjectItem from './SubjectItem';
import ItemListTest from './ItemListTest';
import ModalClass from './ModalClass';
import ModalSubject from './ModalSubject';
import ModalOption from './ModalOption';
import ModalAddPaper from './ModalAddPaper';
import { updateExamListAction } from '../../../actions/paperAction';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RFFonsize } from '../../../utils/Fonts';

const { Value, timing } = Animated;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const NAVBAR_HEIGHT = 220;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });

const { width, height } = Dimensions.get('window');
class Papers extends Component {
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
    };


    this._indexPage = 0;
    this._pageSize = 50;
    Globals.updatePaper = this.refreshData.bind(this);
  }

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
      console.log("🚀 ~ file: paper.js ~ line 120 ~ Papers ~ getData= ~ resPapers", resPapers)
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

  activeClass = async item => {
    const { gradeActive } = this.state;
    const index = _.indexOf(gradeActive, item.gradeId || item);
    if (index < 0) {
      gradeActive.push(item.gradeId)
      await this.setState({ gradeActive, loading: true });
      this.onGetPapers();
      return;
    }
    gradeActive.splice(index, 1);
    await this.setState({ gradeActive, loading: true });
    this.onGetPapers();
  };

  refreshClass = () => {
    this.setState({
      gradeActive: [],
      loading: true,
    });
    this.onGetPapers();
  };

  activeSubject = async item => {
    const { subjectActive } = this.state;
    const index = _.indexOf(subjectActive, item.code || item);
    if (index < 0) {
      subjectActive.push(item.code);
      await this.setState({ subjectActive, loading: true });
      this.onGetPapers()
      return;
    }
    subjectActive.splice(index, 1)
    await this.setState({ subjectActive, loading: true });
    this.onGetPapers()
  };

  refreshSubject = () => {
    this.setState({
      subjectActive: [],
      loading: true,
    });
    this.onGetPapers();
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
        style={{ height: height / 2 }}
        color="#F98E2F"
      />
      :
      <View style={styles.viewNotFound}>
        <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
      </View>
    );
  };

  _listTestFooter = () => {
    let { isLoadMore, hideLoadMore } = this.state;
    console.log("🚀 ~ file: paper.js ~ line 360 ~ Papers ~ { isLoadMore, hideLoadMore }", { isLoadMore, hideLoadMore })
    return hideLoadMore ? null : (
      <View style={{ width: '100%', height: 330,  }}>
        <TouchableOpacity
          onPress={this.onLoadMore}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
          }}>
          {isLoadMore ? (
            <ActivityIndicator size={'small'} />
          ) : (
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Nunito-Bold',
                  fontSize: RFFonsize(14),
                  textAlign: 'center',
                }}>
                Xem thêm
              </Text>
            )}
        </TouchableOpacity>
      </View>
    );
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

  _handleCloseModal = () => {
    this.setState({ animation: 'fadeOutDownBig' }, () => {
      this.myTime = setTimeout(() => {
        this.setState({ animation: 'fadeInUpBig', visibleEdit: false });
      }, 220);
    });
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

  onVisibleModalAdd = visible => {
    this.setState({
      visibleModalAdd: visible,
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

  onChangeText = text => {
    this.setState({ textSearch: text });
    if (this.timeSearch) {
      clearTimeout(this.timeSearch);
      this.timeSearch = null;
    }
    this.timeSearch = setTimeout(this.searchPaper, 1000);
  }

  renderHeaderFlastList() {
    const {
      textSearch,
      gradeActive,
      subjectActive,
      listSubjects
    } = this.state;
    return (
      <View style={styles.navbar}>

        <ClassItem
          gradeActive={gradeActive}
          refModalClass={this.refModalClass}
          activeClass={this.activeClass}
        />
        <SubjectItem
          subjectActive={subjectActive}
          listSubjects={listSubjects}
          refModalSubject={this.refModalSubject}
          activeSubject={this.activeSubject}
        />
        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <View>
            <TouchableOpacity
              onPress={() => this.searchPaper()}
              style={{
                position: 'absolute',
                right: 4,
                top: 4,
                height: 18,
                width: 24,
              }}>
            </TouchableOpacity>
          </View>
          <View style={styles.styWrapSearch}>
            <TextInput
              placeholder='Tìm kiếm...'
              placeholderTextColor='#C4C4C4'
              style={styles.searchPaper}
              value={textSearch}
              onChangeText={this.onChangeText}
            // onEndEditing={() => this.searchPaper()}
            />
            <EvilIcons name={'search'} size={20} color={'#C4C4C4'} />
          </View>
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={this._handleAddPaper}>
            <Image source={require('../../../asserts/icon/icAdd.png')} resizeMode={'contain'} />
            <Text style={styles.txtAdd}>Thêm bộ đề</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
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
    } = this.state;
    const { user } = this.props;

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

    return (
      <SafeAreaView style={styles.fill}>
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: translateY }],
              opacity: _header_opacity
            }
          ]}
        >
          <HeaderMain {...user} navigation={this.props.navigation} />
          {this.renderHeaderFlastList()}
        </Animated.View>
        <AnimatedFlatList
          style={{ paddingHorizontal: 16, paddingTop: 270 }}
          data={listPapers}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          extraData={listPapers}
          ListEmptyComponent={this._listTestEmpty}
          ListFooterComponent={this._listTestFooter}
          // ListFooterComponent={<View style={{ height: 280 }} />}
          renderItem={({ item, index }) => (
            <ItemListTest item={item} onOpenModal={this._onOpenModal(item)} />
          )}
          initialNumToRender={5}
          // ListHeaderComponent={this.renderHeaderFlastList()}
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
        <ModalClass
          ref={ref => this.refModalClass = ref}
          gradeActive={gradeActive}
          listGrades={listGrades}
          activeClass={this.activeClass}
        />
        <ModalSubject
          ref={ref => this.refModalSubject = ref}
          subjectActive={subjectActive}
          listSubjects={listSubjects}
          activeSubject={this.activeSubject}
        />
        <ModalAddPaper
          onPress={this.onPress}
          closeModal={this.closeModal}
          onPressCopy={this.onPressCopy}
          visibleModalAdd={visibleModalAdd}
          onPressUploadPDF={this.onPressUploadPDF}
        />
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonAdd: {
    backgroundColor: '#7E96EC',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20,
    padding: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
    height: 40,
  },
  txtAdd: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    color: '#FFF',
    marginLeft: 8,
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
  fill: {
    flex: 1,
    zIndex: -1,
  },
  navbar: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  contentContainer: {
    // paddingTop: NAVBAR_HEIGHT,
  },
  searchPaper: {
    height: 40,
    fontSize: RFFonsize(14),
    color: '#000',
    fontFamily: 'Nunito-Regular',
    flex: 1,
  },
  textTilteModal: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '700',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(19),
    textAlign: 'center',
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
  header: {
    height: 285,
    position: 'absolute',
    right: 0,
    left: 0,
    top: isIphoneX() ? 40 : Platform.OS == 'ios' ? 20 : 0,
    zIndex: 1,
    backgroundColor: '#fff',
    zIndex: 1
  },
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
)(Papers);