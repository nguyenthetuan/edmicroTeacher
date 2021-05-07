import React, { Component, useRef, useMemo, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  FlatList,
  Alert
} from 'react-native';
import ModalEditConfig from './modalEditConfig';
import _ from 'lodash';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import ModalEditName from './ModalEditName';
import { connect } from 'react-redux';
import { setListGrades, setListSubject } from '../../../actions/paperAction';
import Globals from '../../../utils/Globals';
import HeaderMainPaper from '../../common-new/HeaderMainPaper';
import { alertDeletePaper } from '../../../utils/Alert';
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
import RippleButton from '../../common-new/RippleButton';
import { AssignmentContentType } from '../../../models';
import Kcolor from '../../../constants/Kcolor';
import AppIcon from '../../../utils/AppIcon'
import TourView from '../../../utils/TourView';
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
      typeChange: 0,
      dataFilter: []
    };
    this._indexPage = 0;
    this._pageSize = 50;
    Globals.onPressCamera = this.onPressCamera.bind(this);
    Globals.updatePaper = this.refreshData.bind(this);
  }

  refreshData = async () => {
    this.getData();
  };

  componentDidMount() {
    // setTimeout(() => {
    //   try {
    //     this.dataRef = [
    //       {
    //         reff: this.searchRef,
    //         hint: 'Tìm kiếm bộ đề'
    //       },
    //       {
    //         reff: this.addRef,
    //         hint: 'Tạo bộ đề mới'
    //       },
    //     ];
    //     this.tour.onMeasure(this.dataRef);
    //   } catch (error) {

    //   }
    // }, 2000);
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
      Alert.alert(
        'Thông báo',
        'Xóa bài thành công!',
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
      this.setState(
        {
          visibleEdit: false,
        },
        () => {
          setTimeout(() => {
            this.getListPaper(token)
          }, 1000)
        },
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
          let dataFilter = this.filterData(resPapers.data);
          this.setState(
            {
              listPapers: resPapers.data,
              loading: false,
              hideLoadMore: true,
              dataFilter,
            }
          );
        }
      },
    );
  };

  onGetPapers = async () => {
    const {
      gradeActive,
      subjectActive,
      textSearch
    } = this.state;
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
        let dataFilter = this.filterData(resPapers.data);
        this.setState({
          listPapers: resPapers.data,
          loading: false,
          dataFilter
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
    const index = _.findIndex(listPapers,
      ['assignmentId', item.assignmentId]);
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
    const { isLoadMore, hideLoadMore, dataFilter } = this.state;
    if (!dataFilter.length) {
      return null;
    }
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
        this.props.navigation.navigate('UploadPDFStepByStep', {
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
        if (dataSelected.assignmentContentType == AssignmentContentType.camera) {
          this.props.navigation.navigate('MarkingWeb', {
            item: dataSelected,
            statusbar: 'dark-content',
          });
        } else {
          this.props.navigation.navigate('MarkingView', {
            item: dataSelected,
            statusbar: 'light-content',
          });
        }
        break;

      default:
        break;
    }
  };

  _onOpenModal = item => (payloadAssignment, visibleEdit = true) => {
    // this.optionRef.openModal();
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
  };

  onPressCamera = () => {
    const { listGrades, listSubjects } = this.state;
    this.setState({ visibleModalAdd: false }, () =>
      this.props.navigation.navigate('MarkCamera', {
        listGrades,
        listSubjects,
        statusbar: 'dark-content',
      }),
    );
  }
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
          onOpen={() => this.refModalClass.onOpen()}
          refFlatlist={this.refFlatlist}
          activeClass={this.activeClass}
          Icon={AppIcon.iconFilter}
        />
        <SubjectItem
          subjectActive={subjectActive}
          listSubjects={listSubjects}
          onOpen={() => this.refModalSubject.onOpen()}
          refFlatlist={this.refFlatlist}
          activeSubject={this.activeSubject}
          Icon={AppIcon.iconFilter}
        />
      </View>
    );
  }

  onPressChangeType = async (index) => {
    const { listPapers } = this.state;
    switch (index) {
      case 0: {
        try {
          this.refFlatlist.scrollToIndex({ animated: true, index: 0 });
        } catch (error) {
        }
        await this.setState({ typeChange: 0 });
        break;
      }
      case 1: {
        try {
          this.refFlatlist.scrollToIndex({ animated: true, index: 0 });
        } catch (error) {
        }
        await this.setState({ typeChange: 1 })
        break;
      }
      case 2: {
        try {
          this.refFlatlist.scrollToIndex({ animated: true, index: 0 });
        } catch (error) {
        }
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

  createTabButton = () => {
    const { typeChange } = this.state;
    return (
      <View style={styles.tabBar}>
        <RippleButton
          onPress={() => {
            this.onPressChangeType(0)
          }}
          style={typeChange === 0 ? styles.buttonActive : styles.buttonNotActive}
        >
          <Text
            style={typeChange === 0 ? styles.textButtonTabActive : styles.textButtonTabNotActive}>
            Tất cả
            </Text>
        </RippleButton>
        <RippleButton
          onPress={() => { this.onPressChangeType(1) }}
          style={typeChange === 1 ? [styles.buttonActive,
          { backgroundColor: '#87CEEB' }] : styles.buttonNotActive}
        >
          <Text
            style={typeChange === 1 ? styles.textButtonTabActive : styles.textButtonTabNotActive}>
            Chờ chấm điểm
            </Text>
        </RippleButton>
        <RippleButton
          onPress={() => { this.onPressChangeType(2) }}
          style={typeChange === 2 ? [styles.buttonActive,
          { backgroundColor: '#87CEEB' }] : styles.buttonNotActive}>
          <Text
            style={typeChange === 2 ? styles.textButtonTabActive : styles.textButtonTabNotActive}>
            Chưa giao
            </Text>
        </RippleButton>
      </View>
    )
  }

  render() {
    console.log("render paper");
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
    const { user } = this.props;
    const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 390);
    const _header_opacity = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 1],
      extrapolate: 'clamp'
    })
    let translateY = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 390],
      outputRange: [0, -390],
      extrapolate: 'clamp',
    });
    console.log("render paper");
    return (
      <SafeAreaView style={styles.fill}>
        <HeaderMainPaper
          searchRef={(r) => this.searchRef = r}
          addRef={(a) => this.addRef = a}
          {...user}
          navigation={this.props.navigation}
          onChangeText={this.onChangeText}
          textSearch={this.state.textSearch}
          searchPaper={this.searchPaper}
        />
        <View style={{ overflow: 'hidden', flex: 1 }}>
          <Animated.View
            style={[
              styles.header,
              {
                transform: [{ translateY: translateY }],
                opacity: _header_opacity
              }
            ]}
          >
            {this.renderHeaderFlastList()}
            {this.createTabButton()}
          </Animated.View>
          <FlastlistCus
            style={{ paddingHorizontal: 16, paddingTop: 220 }}
            data={dataFilter}
            ref={(fl) => this.refFlatlist = fl}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
            keyExtractor={(item, index) => index.toString()}
            extraData={dataFilter}
            removeClippedSubviews={true}
            ListEmptyComponent={this._listTestEmpty}
            ListFooterComponent={this._listTestFooter}
            ListFooterComponent={<View style={{ height: 240 }} />}
            _onOpenModal={this._onOpenModal}
            onScroll={Animated.event([
              {
                nativeEvent: { contentOffset: { y: this._scroll_y } }
              }
            ],
              { useNativeDriver: true }
            )}
          />
        </View>
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
        // onPressCamera={this.onPressCamera}
        />
        <ModalOption
          ref={(refModal) => this.optionRef = refModal}
          visibleEdit={visibleEdit}
          _handleCloseModal={this._handleCloseModal}
          _handleClickDetail={this._handleClickDetail}
          _OpenModal={this._OpenModal}
          animation={animation}
          assignmentContentType={assignmentContentType}
          dataSelected={dataSelected}
          deletePaper={this.deletePaper}
        />
        <TourView ref={(tv) => this.tour = tv} />
      </SafeAreaView>
    );
  }
}


const FlastlistCus = forwardRef((props, ref) => {

  const refFlastList = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.data);
  }, [props.data])

  useImperativeHandle(ref, () => ({
    scrollToIndex: ({ animated, index }) => {
      refFlastList.current?.scrollToIndex({ animated, index });
    },
  }));

  const render =
    useMemo(() => {
      return (
        <AnimatedFlatList
          style={{ paddingHorizontal: 16, paddingTop: 220 }}
          data={data}
          ref={refFlastList}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          extraData={data}
          removeClippedSubviews={true}
          ListEmptyComponent={props.ListEmptyComponent}
          ListFooterComponent={props.ListFooterComponent}
          ListFooterComponent={<View style={{ height: 240 }} />}
          renderItem={({ item, index }) => {
            return (
              <ItemListTest item={item} onOpenModal={props._onOpenModal(item)} />
            )
          }}
          initialNumToRender={2}
          // ListHeaderComponent={this.renderHeaderFlastList()}
          bounces={false}
          scrollEventThrottle={1}
          onScroll={props.onScroll}
        />
      )
    }, [data]);

  return (
    <>
      {render}
    </>
  )
})

const styles = StyleSheet.create({

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
    height: NAVBAR_HEIGHT - 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    justifyContent: 'center'
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
  header: {
    height: 225,
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: '#fff'
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    flex: 1,
  },
  buttonActive: {
    flex: 1,
    marginHorizontal: 10,
    height: 32,
    borderWidth: .5,
    borderColor: '#87CEEB',
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: "#c4c4c4",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.20,
    shadowRadius: 5,
    elevation: 3
  },
  buttonNotActive: {
    flex: 1,
    marginHorizontal: 10,
    height: 32,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    backgroundColor: '#c4c4c4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  textButtonTabActive: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '500',
    color: '#fff',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16)
  },
  textButtonTabNotActive: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '500',
    color: '#fff',
    fontSize: RFFonsize(12),
    lineHeight: RFFonsize(16),
    alignSelf: 'center'
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
)(Papers);