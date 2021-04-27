import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Animated,
  Keyboard,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import RippleButton from '../../common-new/RippleButton';
import apiPapers from '../../../services/apiPapersTeacher';
import _ from 'lodash';
import Toast, { DURATION } from 'react-native-easy-toast';
import dataHelper from '../../../utils/dataHelper';
import { RFFonsize } from '../../../utils/Fonts';
import ModalConfigLibrary from './modalConfigLibrary';
import ModalCurriculum from './modalCurriculum';

const { width, height } = Dimensions.get('window');

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
    height: height * 0.7
  },
  wrapSelectQuestion: {
    justifyContent: 'space-between',
    paddingBottom: 0,
    marginTop: 10,
    paddingHorizontal: 20,
    flex: 1
  },
  indicator: {
    height: 5,
    width: 40,
    borderRadius: 4,
    backgroundColor: '#828282',
    alignSelf: 'center'
  }
})

export default class ModalConfigPaper extends Component {
  constructor(props) {
    super(props)
    const { subject, isModal, listSkills,
      element, lerningTarget, code } = this.props
    this.state = {
      subject: subject || [],
      isModal: isModal || false,
      element: element || [],
      lerningTarget: lerningTarget || [],
      listSkills: listSkills || [],
      level: [],
      objectSearch: {
        author: '',
        curriculumCode: '',
        grades: null,
        indexPage: 0,
        isVerified: false,
        learningTargetsCode: [],
        levelKnowledge: [],
        levelQuestion: [],
        skill: null,
        typeAnswer: [],
      },
      code: code || ''
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.subject !== this.props.subject) {
      this.setState({ subject: nextProps.subject })
    }
    // if (nextProps.element !== this.props.element) {
    //   this.setState({ element: nextProps.element })
    // }
    if (nextProps.lerningTarget !== this.props.lerningTarget) {
      this.setState({ lerningTarget: nextProps.lerningTarget })
    }
    if (nextProps.code !== this.props.code) {
      this.setState({ code: nextProps.code })
    }
    return true;
  }

  filters = () => {
    this.props.filter(this.state.objectSearch)
  };

  getDetailSubject = async () => {
    const { objectSearch } = this.state;
    try {
      const { token } = await dataHelper.getToken();
      if (token) {
        const response = await apiPapers.getDetailSubject({
          token: token,
          subjectCode: objectSearch.curriculumCode,
        });
        await this.setState(
          {
            element: response && response,
            objectSearch: {
              ...objectSearch,
              // curriculumCode: response && response[0].id,
            },
            // isLoading: false,
          },
        );
        this.filters();
        this.getLearingTarget();
      }
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  getLearingTarget = async () => {
    const { objectSearch } = this.state;
    try {
      const { token } = await dataHelper.getToken();
      if (token) {
        const response = await apiPapers.getLearingTarget({
          token: token,
          subjectCode: objectSearch.curriculumCode,
        });
        this.setState(
          {
            lerningTarget: response && response,
          },
          () => this.filters(),
        );
      }
    } catch (error) { }
  };

  getListSkills = async () => {
    const { objectSearch } = this.state;
    const { token } = await dataHelper.getToken();
    const response = await apiPapers.getSkill({ token, idSubject: objectSearch.learningTargetsCode });
    const res = Object.entries(response).map((e) => ({ id: e[0], name: e[1] }));
    this.setState({
      listSkills: res
    }, () => this.filters())
  }

  onPress = (value, item) => {
    // this.refs.PaginationUtils.resetState();
    const { objectSearch } = this.state;
    switch (value) {
      case 1:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              author: item.code,
              indexPage: 0,
            },
            isLoading: true,
          },
          () => this.filters(),
        );
        break;
      case 2:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              curriculumCode: item.code,
              indexPage: 0,
            },
            isLoading: true,
            lerningTarget: [],
          },
          () => {
            this.filters();
            this.getDetailSubject();
          },
        );
        break;
      case 3:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              curriculumCode: item.id,
              indexPage: 0,
            },
            isLoading: true,
          },
          () => {
            this.filters();
            this.getLearingTarget()
          },
        );
        break;
      case 4:
        this.setState(
          {
            objectSearch: {
              ...objectSearch,
              learningTargetsCode: (item.code && [item.code]) || [],
              indexPage: 0,
            },
            isLoading: true,
          },
          () => {
            this.filters();
            this.getListSkills();
          }
        );
        break;
      case 5:
        this.setState({
          objectSearch: {
            ...objectSearch,
            indexPage: 0,
            skill: item.code
          },
          isLoading: true,
        }, () => {
          this.filters()
        })
        break;
      case 6:
        {
          this.setState(
            {
              objectSearch: {
                ...objectSearch,
                levelKnowledge: (item.code && [item.code]) || [],
                indexPage: 0,
              },
              isLoading: true,
            },
            () => this.filters(),
          );
        }
        break;
      default:
        break;
    }
  };

  render() {
    const level = [
      { name: 'Nhận biết', code: '0' },
      { name: 'Thông hiểu', code: '1' },
      { name: 'Vận dụng', code: '2' },
      { name: 'Vận dụng cao', code: '3' },
    ];
    const { isModal } = this.props;
    const { subject, code,
      element, lerningTarget, listSkills } = this.state;
    console.log('element', element)
    return (
      <Modal visible={isModal} transparent={true}>
        <TouchableWithoutFeedback onPressOut={this.props._handleCloseModal}>
          <View style={styles.containerModal}>
            <TouchableWithoutFeedback>
              <View style={styles.wrapModal}>
                <View style={styles.indicator} />
                <View style={styles.wrapSelectQuestion}>
                  <ModalConfigLibrary
                    title="Câu Hỏi"
                    data={[
                      { name: 'Câu hỏi công khai', code: '' },
                      { name: 'Câu hỏi của tôi', code: code },
                    ]}
                    onPress={(value) => this.onPress(1, value)}
                    colum={2}
                    widthItem={40}
                    value={{ name: 'Câu hỏi công khai', code: '' }}
                  />
                  <ModalConfigLibrary
                    title="Môn Học"
                    data={subject}
                    onPress={(value) => this.onPress(2, value)}
                    colum={2}
                    widthItem={40}
                    value={subject && subject[0]}
                  />
                  <ModalConfigLibrary
                    title="Giáo trình"
                    data={element}
                    onPress={(value) => this.onPress(3, value)}
                    value={!_.isEmpty(element) && element[0]}
                  />
                  <ModalCurriculum
                    title="Đơn vị kiến thức"
                    data={lerningTarget}
                    onPress={(value) => this.onPress(4, value)}
                  />
                  <ModalConfigLibrary
                    title="Dạng bài"
                    data={listSkills}
                    onPress={value => this.onPress(5, value)}
                    colum={2}
                    widthItem={40}
                  />
                  <ModalConfigLibrary
                    title="Cấp độ"
                    data={level}
                    colum={2}
                    widthItem={40}
                    onPress={(value) => this.onPress(6, value)}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}