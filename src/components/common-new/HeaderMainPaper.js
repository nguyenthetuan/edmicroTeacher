import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
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
const { Value, timing } = Animated;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
class HeaderMainPaper extends React.Component {
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
          console.log("resGrade: ", resGrade);
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
          let dataFilter = this.filterData(listPapers);
          console.log("🚀 ~ file: paper.js ~ line 128 ~ Papers ~ getData= ~ dataFilter", dataFilter)
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
        console.log("dataSelected.assignmentId: ", dataSelected.assignmentId)
        const { token } = await dataHelper.getToken();
        const response = await apiPapers.deletePaper({
          token,
          id: dataSelected.assignmentId,
        });
        console.log("🚀 ~ file: paper.js ~ line 153 ~ Papers ~ deletePaper ~ response", response)
        if (response.status === 1) {
          alert('Xóa bài thành công!');
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
    
      
      onPressChangeType = async (index) => {
        console.log("🚀 ~ file: paper.js ~ line 630 ~ Papers ~ onPressChangeType= ~ onPressChangeType", index);
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
            textSearch
        } = this.state;
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
                    onPress={() => this.searchPaper()}
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
        height: 22,
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
        marginRight: 20,
        marginLeft: 10
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
)(HeaderMainPaper);
