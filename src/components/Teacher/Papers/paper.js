import React, {Component, PureComponent} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
  ImageBackground,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import RippleItem from '../../common-new/RippleItem';
import ModalEditConfig from './modalEditConfig';
import _ from 'lodash';
import Common from '../../../utils/Common';
import apiPapers from '../../../services/apiPapersTeacher';
import dataHelper from '../../../utils/dataHelper';
import ModalEditName from './ModalEditName';
import Header from '../Header';
import {connect} from 'react-redux';
import {setListGrades, setListSubject} from '../../../actions/paperAction';
import Feather from 'react-native-vector-icons/Feather';
import AnalyticsManager from '../../../utils/AnalyticsManager';
import Globals from '../../../utils/Globals';
import * as Animatable from 'react-native-animatable';

const NAVBAR_HEIGHT = 220;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 24});

const {width, height} = Dimensions.get('window');

class Item extends PureComponent {
  _handleClickDetail = (payloadAssignment) => () => {
    this.props.onOpenModal(payloadAssignment, false);
  };

  render() {
    const item = this.props.item;
    const subjectCode =
      item.subjectCode && item.subjectCode.length > 0
        ? item.subjectCode[0]
        : '';
    let gradeCode =
      item.gradeCode && item.gradeCode.length > 0 ? item.gradeCode[0] : '';
    gradeCode = gradeCode.substring(1);
    const payloadAssignment = {
      gradeCode,
      subjectCode,
    };

    return (
      <View
        style={[
          styles.itemTest,
          {borderColor: Common.getBackroundSubject(subjectCode)},
        ]}
        onPress={this._handleClickDetail(payloadAssignment)}>
        <TouchableOpacity
          onPress={() => this.props.onOpenModal(payloadAssignment)}>
          <View
            style={[
              styles.topTest,
              {backgroundColor: Common.getBackroundSubject(subjectCode)},
            ]}>
            <Text style={styles.txtName}>{item.name}</Text>
            <View
              style={{
                alignItems: 'center',
                width: 30,
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../../asserts/icon/icEdit.png')}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._handleClickDetail(payloadAssignment)}>
          <View style={styles.bodyTest}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <Image
                  source={require('../../../asserts/icon/icClass.png')}
                  style={{height: 20, width: 20}}
                />
                <Text style={styles.txtTestClass}>{gradeCode}</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Common.getIconSubject(subjectCode)}
                  style={{width: 20, height: 20, marginLeft: 15}}
                  resizeMode="contain"
                />
                <Text style={styles.txtQuestion}>{subjectCode}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 6,
                }}>
                <Image
                  source={require('../../../asserts/icon/icQuestion.png')}
                  resizeMode="contain"
                  style={{height: 20, width: 20}}
                />
                <Text style={styles.txtQuestion}>{item.totalQuestion}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styles.buttomPractice,
                  {
                    backgroundColor: item.assignmentType
                      ? '#FD7900'
                      : '#79BBEB',
                  },
                ]}>
                <Text style={styles.txtButtomPractice}>
                  {item.assignmentType ? 'Bài kiểm tra' : 'Bài tự luyện'}
                </Text>
              </View>
              <View
                style={[
                  styles.buttomDelivered,
                  {backgroundColor: item.status === 4 ? '#56BB73' : '#E0E0E0'},
                ]}>
                <Text style={styles.txtButtomPractice}>
                  {item.status === 4 ? 'Đã giao' : 'Chưa giao'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
class Papers extends Component {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

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

      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      ),
      payloadAssignment: null,
      animation: 'slideInUp',
      assignmentContentType: 0,
    };

    this._indexPage = 0;
    this._pageSize = 50;
    Globals.updatePaper = this.refreshData.bind(this);
  }

  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  refreshData = async () => {
    this.getData();
  };
  componentDidMount() {
    this.getData();
    this.state.scrollAnim.addListener(({value}) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      );
    });
    this.state.offsetAnim.addListener(({value}) => {
      this._offsetValue = value;
    });
    // this.didFocusSubscription = this.props.navigation.addListener(
    //   'didFocus',
    //   this.getData,
    // );
  }

  getData = async () => {
    const {token} = await dataHelper.getToken();
    this.setState({loading: true});
    if (token) {
      let listGrades = [];
      let listSubjects = [];
      let listPapers = [];

      const resGrade = await apiPapers.getGrade({token});
      if (resGrade) {
        listGrades = resGrade;
        this.props.saveGrades(resGrade);
      }

      const resSubject = await apiPapers.getSubject({token});
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

  deletePaper = async () => {
    const {dataSelected} = this.state;
    const {token} = await dataHelper.getToken();
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
  };

  getListPaper = async (token) => {
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
            },
            () => this._onMomentumScrollEnd(),
          );
        }
      },
    );
  };

  componentWillUnmount() {
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
    // this.didFocusSubscription.remove();
  }

  _onScrollEndDrag = () => {
    console.log('_onScrollEndDrag');
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    console.log('_onMomentumScrollBegin');
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    console.log('_onMomentumScrollEnd');
    const toValue =
      this._scrollValue > NAVBAR_HEIGHT &&
      this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
        ? this._offsetValue + NAVBAR_HEIGHT
        : this._offsetValue - NAVBAR_HEIGHT;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  onGetPapers = async () => {
    const {gradeActive, subjectActive} = this.state;
    const {token} = await dataHelper.getToken();
    if (token) {
      this._indexPage = 0;
      const resPapers = await apiPapers.getPapers({
        token,
        body: {
          text: '',
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
    const {token} = await dataHelper.getToken();
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

  onUpdateItem = async (item) => {
    const {listPapers} = this.state;
    let listPapersTmp = listPapers;
    const index = _.findIndex(listPapers, ['assignmentId', item.assignmentId]);
    if (index > -1) {
      listPapersTmp[index] = item;
    }
    this.setState({
      listPapers: listPapersTmp,
    });
  };

  activeClass = (item) => {
    const {gradeActive} = this.state;
    const index = _.indexOf(gradeActive, item.gradeId);
    index < 0
      ? this.setState(
          {
            gradeActive: [...gradeActive, ...[item.gradeId]],
            loading: true,
          },
          () => this.onGetPapers(),
        )
      : this.setState(
          {
            gradeActive: [
              ...gradeActive.slice(0, index),
              ...gradeActive.slice(index + 1),
            ],
            loading: true,
          },
          () => this.onGetPapers(),
        );
  };

  refreshClass = () => {
    this.setState({
      gradeActive: [],
      loading: true,
    });
    this.onGetPapers();
  };

  activeSubject = (item) => {
    const {subjectActive} = this.state;
    const index = _.indexOf(subjectActive, item.code);
    index < 0
      ? this.setState(
          {
            subjectActive: [...subjectActive, ...[item.code]],
            loading: true,
          },
          () => this.onGetPapers(),
        )
      : this.setState(
          {
            subjectActive: [
              ...subjectActive.slice(0, index),
              ...subjectActive.slice(index + 1),
            ],
            loading: true,
          },
          () => this.onGetPapers(),
        );
  };

  refreshSubject = () => {
    this.setState({
      subjectActive: [],
      loading: true,
    });
    this.onGetPapers();
  };

  _OpenModal = (type) => {
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
            this.onVisibleModalEdit(true);
            break;
          default:
            break;
        }
      },
    );
  };

  _renderClass = () => {
    const {gradeActive, listGrades} = this.state;
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.txtClass}>Khối lớp</Text>
          <RippleButton onPress={() => this.refreshClass()}>
            <View style={{padding: 5}}>
              <Image
                source={require('../../../asserts/icon/refresh.png')}
                resizeMode="contain"
                style={{height: 20, width: 20}}
              />
            </View>
          </RippleButton>
        </View>
        <View style={{marginTop: 12}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image
              source={require('../../../asserts/images/iconHome.png')}
              resizeMode="contain"
            />
            <FlatList
              data={listGrades}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                return !_.includes(gradeActive, item.gradeId) ? (
                  <RippleButton
                    style={Platform.OS === 'ios' ? styles.buttomClass : null}
                    onPress={() => this.activeClass(item)}>
                    <View
                      style={
                        Platform.OS === 'android' ? styles.buttomClass : null
                      }>
                      <Text style={styles.txtItem}>{item.name}</Text>
                    </View>
                  </RippleButton>
                ) : (
                  <RippleButton
                    style={Platform.OS === 'ios' ? styles.buttomActive : null}
                    onPress={() => this.activeClass(item)}>
                    <View
                      style={
                        Platform.OS === 'android' ? styles.buttomActive : null
                      }>
                      <Text style={styles.txtItemActive}>{item.name}</Text>
                    </View>
                  </RippleButton>
                );
              }}
              removeClippedSubviews={false}
              horizontal
            />
          </ScrollView>
        </View>
      </View>
    );
  };

  _renderSubject = () => {
    const {subjectActive, listSubjects} = this.state;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={styles.txtClass}>Môn học</Text>
          <RippleButton onPress={() => this.refreshSubject()}>
            <View style={{padding: 5}}>
              <Image
                source={require('../../../asserts/icon/refresh.png')}
                resizeMode="contain"
                style={{height: 20, width: 20}}
              />
            </View>
          </RippleButton>
        </View>
        <View style={{marginTop: 6}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image
              source={require('../../../asserts/icon/subject.png')}
              resizeMode="contain"
            />
            <FlatList
              data={listSubjects}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                return !_.includes(subjectActive, item.code) ? (
                  <RippleButton
                    style={Platform.OS === 'ios' ? styles.buttomClass : null}
                    onPress={() => this.activeSubject(item)}>
                    <View
                      style={
                        Platform.OS === 'android' ? styles.buttomClass : null
                      }>
                      <Text style={styles.txtItem}>{item.name}</Text>
                    </View>
                  </RippleButton>
                ) : (
                  <RippleButton
                    style={Platform.OS === 'ios' ? styles.buttomActive : null}
                    onPress={() => this.activeSubject(item)}>
                    <View
                      style={
                        Platform.OS === 'android' ? styles.buttomActive : null
                      }>
                      <Text style={styles.txtItemActive}>{item.name}</Text>
                    </View>
                  </RippleButton>
                );
              }}
              removeClippedSubviews={false}
              horizontal
              snapToEnd={true}
            />
          </ScrollView>
        </View>
      </View>
    );
  };

  OpenModalEdit = () => {
    this.setButton(this.button2, () => {
      this.setState({popover: true});
    });
  };

  _listTestEmpty = () => {
    return (
      <View style={styles.viewNotFound}>
        <Text style={styles.txtNotFound}>Không tìm thấy dữ liệu</Text>
      </View>
    );
  };

  _listTestFooter = () => {
    const {isLoadMore, hideLoadMore} = this.state;
    return hideLoadMore ? null : (
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
              fontSize: 14,
              textAlign: 'center',
            }}>
            Xem thêm
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  _crateBackUp = async (id) => {
    const {listGrades, listSubjects} = this.state;
    try {
      const {token} = await dataHelper.getToken();
      const res = await apiPapers.getAssignmentConfig({token, id: id});
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
          statusbar: 'light-content',
        });
      }
    } catch (error) {}
  };

  _handleAddPaper = () => {
    this.setState({visibleModalAdd: true});
  };

  _handleClickDetail = (index) => () => {
    const {
      listPapers,
      visibleEdit,
      loading,
      dataSelected,
      payloadAssignment,
    } = this.state;
    console.log('dataSelected', dataSelected)
    switch (index) {
      case 1:
        this.setState({visibleEdit: false});
        this.props.navigation.navigate('ExcerciseDetail', {
          subjectCode: dataSelected.subjectCode,
          assignmentId: dataSelected.assignmentId,
          name: dataSelected.name,
          naviagtion: this.props.navigation,
          statusbar: 'dark-content',
        });
        break;
      case 2:
        this.setState({visibleEdit: false});
        this._crateBackUp(dataSelected.assignmentId);
        break;
      case 4:
        this.setState({visibleEdit: false});
        this.props.navigation.navigate('Assignment', {
          item: { ...dataSelected, id: dataSelected.assignmentId },
          payloadAssignment,
          statusbar: 'light-content',
        });
        break;
      case 7:
        this.setState({visibleEdit: false});
        this.props.navigation.navigate('MarkingView', {
          item: dataSelected,
          statusbar: 'light-content',
        });
        break;

      default:
        break;
    }
  };

  _onOpenModal = (item) => (payloadAssignment, visibleEdit = true) => {
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
    this.setState({animation: 'slideOutDown'}, () => {
      this.myTime = setTimeout(() => {
        this.setState({animation: 'slideInUp', visibleEdit: false});
      }, 500);
    });
  };

  _renderListTest = () => {
    const {
      listPapers,
      visibleEdit,
      loading,
      dataSelected,
      payloadAssignment,
      animation,
      assignmentContentType,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        {
          <Animated.FlatList
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            data={listPapers}
            keyExtractor={(item, index) => index.toString()}
            extraData={listPapers}
            ListEmptyComponent={this._listTestEmpty}
            ListFooterComponent={this._listTestFooter}
            renderItem={({item, index}) => (
              <Item item={item} onOpenModal={this._onOpenModal(item)} />
            )}
            initialNumToRender={12}
            windowSize={24}
            scrollEventThrottle={1}
            onMomentumScrollBegin={this._onMomentumScrollBegin}
            onMomentumScrollEnd={this._onMomentumScrollEnd}
            onScrollEndDrag={this._onScrollEndDrag}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
              {useNativeDriver: true},
            )}
            ListHeaderComponent={this.renderHeaderFlastList()}
          />
        }
        <Modal visible={visibleEdit} transparent={true}>
          <TouchableWithoutFeedback onPressOut={this._handleCloseModal}>
            <View style={styles.containerModal}>
              <TouchableWithoutFeedback>
                <Animatable.View
                  style={styles.wrapModal}
                  animation={animation}
                  duration={500}>
                  <View>
                    <RippleItem onPress={this._handleClickDetail(1)}>
                      <View style={styles.wrapElementModal}>
                        <Image
                          source={require('../../../asserts/icon/icDetail.png')}
                        />
                        <Text style={styles.txtModalDetail}>Chi tiết</Text>
                      </View>
                    </RippleItem>
                    {assignmentContentType !== 1 && (
                      <RippleItem onPress={this._handleClickDetail(2)}>
                        <View style={styles.wrapElementModal}>
                          <Image
                            source={require('../../../asserts/icon/icBackup.png')}
                          />
                          <Text style={styles.txtModalDetail}>Tạo bản sao</Text>
                        </View>
                      </RippleItem>
                    )}
                    <RippleItem onPress={() => this._OpenModal(3)}>
                      <View style={styles.wrapElementModal}>
                        <Image
                          source={require('../../../asserts/icon/icEditName.png')}
                        />
                        <Text style={styles.txtModalDetail}>Sửa tên</Text>
                      </View>
                    </RippleItem>
                    <RippleItem onPress={() => this._OpenModal(4)}>
                      <View style={styles.wrapElementModal}>
                        <Image
                          source={require('../../../asserts/icon/icConfig.png')}
                        />
                        <Text style={styles.txtModalDetail}>Sửa cấu hình</Text>
                      </View>
                    </RippleItem>
                    {dataSelected && dataSelected.status !== 4 && (
                      <RippleItem onPress={this.deletePaper}>
                        <View style={styles.wrapElementModal}>
                          <Image
                            source={require('../../../asserts/icon/icDelete.png')}
                          />
                          <Text style={styles.txtModalDetail}>Xoá bài tập</Text>
                        </View>
                      </RippleItem>
                    )}
                    <RippleItem onPress={this._handleClickDetail(4)}>
                      <View style={styles.wrapElementModal}>
                        <Image
                          source={require('../../../asserts/icon/icRegistration.png')}
                        />
                        <Text style={styles.txtModalDetail}>Giao bài tập</Text>
                      </View>
                    </RippleItem>
                    <RippleItem onPress={this._handleClickDetail(7)}>
                      <View style={styles.wrapElementModal}>
                        <Image
                          source={require('../../../asserts/icon/icMarkingPoint.png')}
                        />
                        <Text style={styles.txtModalDetail}>Chấm điểm</Text>
                      </View>
                    </RippleItem>
                  </View>
                </Animatable.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  };

  onPress = () => {
    this.setState({visibleModalAdd: false}, () =>
      this.props.navigation.navigate('QuestionLibrary', {
        nagigation: this.props.nagigation,
        statusbar: 'light-content',
      }),
    );
  };

  onPressUploadPDF = () => {
    const {listGrades, listSubjects} = this.state;
    this.setState({visibleModalAdd: false}, () =>
      this.props.navigation.navigate('UploadPDF', {
        nagigation: this.props.nagigation,
        listGrades,
        listSubjects,
        statusbar: 'light-content',
      }),
    );
  };

  closeModal = () => this.setState({visibleModalAdd: false});

  _renderModalAddPaper = () => {
    const {visibleModalAdd} = this.state;
    return (
      <Modal
        visible={visibleModalAdd}
        transparent={true}
        animationType={'fade'}>
        <View
          // duration={500}
          style={styles.containerModal}>
          <View style={styles.contentModal}>
            <View style={styles.topModal}>
              <Text style={styles.txtTitleModal}>Tạo bộ đề</Text>
              <View style={{position: 'absolute', right: 5, top: 3}}>
                <RippleButton onPress={this.closeModal}>
                  <Image
                    source={require('../../../asserts/icon/icCloseModal.png')}
                    style={{height: 22, width: 22}}
                  />
                </RippleButton>
              </View>
            </View>
            <View style={styles.bodyModal}>
              <View style={styles.buttomMoadal}>
                <RippleButton onPress={() => this.onPress()}>
                  <View style={styles.buttomMoadal}>
                    <Image
                      source={require('../../../asserts/icon/cloud.png')}
                    />
                    <Text style={styles.txtUpload}>Từ câu hỏi có sẵn</Text>
                  </View>
                </RippleButton>
              </View>
              <Image
                source={require('../../../asserts/icon/icPersonModal.png')}
                style={{width: width * 0.2, height: width * 0.23}}
                resizeMode="contain"
              />
              <View style={styles.buttomMoadal}>
                <RippleButton onPress={this.onPressUploadPDF}>
                  <View style={styles.buttomMoadal}>
                    <Image
                      source={require('../../../asserts/icon/dowload.png')}
                    />
                    <Text style={styles.txtUpload}>Upload file .PDF</Text>
                  </View>
                </RippleButton>
              </View>
            </View>
            <View style={styles.footerModal}>
              <Text style={styles.txtFooterModal}>
                Hãy chọn loại bộ đề bạn muốn tạo{' '}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  onVisibleModalEdit = (visible) => {
    this.setState({
      visibleModalEdit: visible,
    });
  };

  onVisibleModalEditName = (visible) => {
    this.setState({
      visibleModalEditName: visible,
    });
  };

  onVisibleModalAdd = (visible) => {
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

  renderHeaderFlastList() {
    return (
      <View
        style={[
          styles.navbar,
          // {
          //   transform: [{ translateY: navbarTranslate }],
          //   opacity: navbarOpacity,
          // },
        ]}>
        {this._renderClass()}
        {this._renderSubject()}
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={this._handleAddPaper}>
            <Image
              source={require('../../../asserts/icon/icAdd.png')}
              style={{marginTop: 3}}
            />
            <Text style={styles.txtAdd}>Thêm bộ đề</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const {
      visibleModalEdit,
      visibleModalEditName,
      listGrades,
      dataSelected,
      listSubjects,
      clampedScroll,
      loading,
    } = this.state;
    const {avatarSource} = this.props;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });
    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.fill}>
        <Header
          navigation={this.props.navigation}
          avatarSource={avatarSource}
        />
        {loading ? (
          <ActivityIndicator
            animating
            size={'small'}
            style={{flex: 1}}
            color="#F98E2F"
          />
        ) : (
          <View style={{flex: 1}}>
            <View style={[styles.fill, {paddingHorizontal: 16}]}>
              {this._renderListTest()}
              {/* <Animated.View
                  style={[
                    styles.navbar,
                    {
                      transform: [{ translateY: navbarTranslate }],
                      opacity: navbarOpacity,
                    },
                  ]}>
                  {this._renderClass()}
                  {this._renderSubject()}
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      style={styles.buttonAdd}
                      onPress={this._handleAddPaper}>
                      <Image
                        source={require('../../../asserts/icon/icAdd.png')}
                        style={{ marginTop: 3 }}
                      />
                      <Text style={styles.txtAdd}>Thêm bộ đề</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View> */}
            </View>
            {this._renderModalAddPaper()}
            {visibleModalEdit ? (
              <ModalEditConfig
                onVisible={(visible) => this.onVisibleModalEdit(visible)}
                onUpdateItem={(item) => this.onUpdateItem(item)}
                listGrades={listGrades}
                listSubjects={listSubjects}
                data={dataSelected}
              />
            ) : null}
            {visibleModalEditName ? (
              <ModalEditName
                onVisible={(visible) => this.onVisibleModalEditName(visible)}
                onUpdateItem={(item) => this.onUpdateItem(item)}
                listGrades={listGrades}
                listSubjects={listSubjects}
                data={dataSelected}
              />
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerModal: {
    height: 200,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Platform.select({
      ios: 'rgba(0,0,0,0.3)',
      android: 'rgba(0,0,0,0.6)',
    }),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    zIndex: 10,
  },
  stylepopover: {
    width: 365,
    height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    position: 'absolute',
  },
  contentModal: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    paddingBottom: 15,
  },
  buttomMoadal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtClass: {
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  buttomClass: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  buttomActive: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0085FF',
    backgroundColor: '#89EAFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  txtItem: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#828282',
  },
  txtItemActive: {
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },
  buttonAdd: {
    backgroundColor: '#7E96EC',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 25,
    alignContent: 'center',
    padding: 3,
    paddingLeft: 5,
    paddingRight: 25,
    borderRadius: 2,
  },
  txtAdd: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#FFF',
    marginLeft: 8,
  },
  topTest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingVertical: 2,
    height: 30,
  },
  txtName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#FFF',
  },
  itemTest: {
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 22,
  },
  bodyTest: {
    paddingHorizontal: 11,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 14,
  },
  txtTestClass: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: '#FFF',
    position: 'absolute',
    marginTop: 5,
    alignSelf: 'center',
  },
  txtQuestion: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#000',
    marginLeft: 6,
  },
  buttomPractice: {
    backgroundColor: '#79BBEB',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  txtButtomPractice: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#FFF',
  },
  buttomDelivered: {
    backgroundColor: '#56BB73',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  topModal: {
    backgroundColor: '#7E96EC',
    paddingVertical: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  txtTitleModal: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  bodyModal: {
    marginTop: 25,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    borderRadius: 1,
  },
  txtUpload: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#828282',
    marginTop: 8,
  },
  footerModal: {
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtFooterModal: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#FF6213',
  },
  viewNotFound: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNotFound: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
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
    paddingTop: STATUS_BAR_HEIGHT,
    backgroundColor: '#fff',
    // paddingHorizontal: 16,
  },
  contentContainer: {
    // paddingTop: NAVBAR_HEIGHT,
  },
  wrapModal: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 23,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  wrapElementModal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  txtModalDetail: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginLeft: 25,
  },
});

const mapStateToProps = (state) => {
  return {
    avatarSource: state.user.AvatarSource,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveGrades: (listGrades) => dispatch(setListGrades(listGrades)),
    saveSubject: (listSubjects) => dispatch(setListSubject(listSubjects)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Papers);
