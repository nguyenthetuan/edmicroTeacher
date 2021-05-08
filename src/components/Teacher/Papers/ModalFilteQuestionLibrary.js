import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import apiPapers from '../../../services/apiPapersTeacher';
import _ from 'lodash';
import dataHelper from '../../../utils/dataHelper';
import ModalConfigLibrary from './modalConfigLibrary';
import ModalCurriculum from './modalCurriculum';
import Modal from 'react-native-modal';
import { RFFonsize } from '../../../utils/Fonts';
import { element } from 'prop-types';
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 0,
    marginTop: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  indicator: {
    // height: 5,
    // width: 40,
    // borderRadius: 4,
    // backgroundColor: '#828282',
    alignSelf: 'flex-end',
    right: 15,
    top: -10
  },
  closeModal: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFFonsize(14),
    lineHeight: RFFonsize(18),
    color: '#E59553'
  }
});

const level = [
  { name: 'Nhận biết', code: '0' },
  { name: 'Thông hiểu', code: '1' },
  { name: 'Vận dụng', code: '2' },
  { name: 'Vận dụng cao', code: '3' },
];

export default class ModalConfigPaper extends Component {
  constructor(props) {
    super(props)
    const {
      subject,
      isModal,
      listSkills,
      element,
      lerningTarget,
      code
    } = this.props
    this.state = {
      subject: subject || [],
      isModal: isModal || false,
      element: element || [],
      lerningTarget: lerningTarget || [],
      listSkills: listSkills || [],
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
      filterQuestion: [
        { name: 'Câu hỏi công khai', code: '' },
        { name: 'Câu hỏi của tôi', code },
      ],

      // value filter
      valueQuestion: { name: 'Câu hỏi công khai', code: '' },
      valueSubject: subject[0],
      valueCurriculum: element[0],
      valueUnitOfKnowledge: null,
      valueTypeOfExercise: null,
      valueLevel: null,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.subject !== this.props.subject) {
      this.setState({
        subject: nextProps.subject,
        valueSubject: nextProps.subject[0],
      });
    }
    if (nextProps.element !== this.props.element) {
      this.setState({
        element: nextProps.element,
        valueCurriculum: nextProps.element[0]
      });
    }
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
            valueCurriculum: response[0],
            objectSearch: {
              ...objectSearch,
            },
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
            valueQuestion: item,
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
            valueSubject: item,
            valueUnitOfKnowledge: null,
            valueTypeOfExercise: null,
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
            valueCurriculum: item,
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
            valueUnitOfKnowledge: item,
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
          valueTypeOfExercise: item,
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
              valueLevel: item,
            },
            () => this.filters(),
          );
        }
        break;
      default:
        break;
    }
  };


  getRenderText = () => {
    const {
      valueQuestion,
      valueSubject,
      valueCurriculum,
      valueUnitOfKnowledge,
      valueTypeOfExercise,
      valueLevel,
    } = this.state;
    const nameQuestion = valueQuestion?.name || '';
    const nameSubject = valueSubject?.name || '';
    const nameCurriculum = valueCurriculum?.name || '';
    const nameUnitOfKnowledge = valueUnitOfKnowledge?.name || '';
    const nameTypeOfExercise = valueTypeOfExercise?.name || '';
    const nameLevel = valueLevel?.name || '';
    if (nameQuestion && nameSubject && nameCurriculum && nameUnitOfKnowledge && nameTypeOfExercise && nameLevel) {
      return `${nameQuestion}/${nameSubject}/${nameCurriculum}/${nameUnitOfKnowledge}/${nameTypeOfExercise}/${nameLevel}`;
    }
    if (nameQuestion && nameSubject && nameCurriculum && nameUnitOfKnowledge && nameTypeOfExercise) {
      return `${nameQuestion}/${nameSubject}/${nameCurriculum}/${nameUnitOfKnowledge}/${nameTypeOfExercise}`;
    }
    if (nameQuestion && nameSubject && nameCurriculum && nameUnitOfKnowledge) {
      return `${nameQuestion}/${nameSubject}/${nameCurriculum}/${nameUnitOfKnowledge}`;
    }
    if (nameQuestion && nameSubject && nameCurriculum) {
      return `${nameQuestion}/${nameSubject}/${nameCurriculum}`;
    }
    if (nameQuestion && nameSubject && nameCurriculum) {
      return `${nameQuestion}/${nameSubject}/${nameCurriculum}`;
    }
    if (nameQuestion && nameSubject) {
      return `${nameQuestion}/${nameSubject}`;
    }
    if (nameQuestion) {
      return `${nameQuestion}/`;
    }
    return '';
  }

  closeOnpress = () => {
    this.props._handleCloseModal();
  }

  render() {
    const { isModal } = this.props;
    const {
      element,
      subject,
      listSkills,
      lerningTarget,
      filterQuestion,

      valueQuestion,
      valueSubject,
      valueCurriculum,
      valueUnitOfKnowledge,
      valueTypeOfExercise,
      valueLevel,
    } = this.state;

    return (
      <Modal
        isVisible={isModal}
        style={{ margin: 0 }}
        transparent={true}
        onBackdropPress={this.props._handleCloseModal}
      // onSwipeComplete={this.props._handleCloseModal}
      // swipeDirection={'down'}
      >
        <View style={styles.wrapModal}>
          <TouchableWithoutFeedback
            hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
            onPress={this.closeOnpress}
          >
            <View style={styles.indicator}>
              <Text style={styles.closeModal}>Đóng</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.wrapSelectQuestion}>
            <ModalConfigLibrary
              title="Câu hỏi"
              data={filterQuestion}
              onPress={(value) => this.onPress(1, value)}
              colum={2}
              widthItem={40}
              value={valueQuestion}
            />
            <ModalConfigLibrary
              title="Môn học"
              data={subject}
              onPress={(value) => this.onPress(2, value)}
              colum={2}
              widthItem={40}
              // value={subject && subject[0]}
              value={valueSubject}
            />
            <ModalConfigLibrary
              title="Giáo trình"
              data={element}
              onPress={(value) => this.onPress(3, value)}
              // value={!_.isEmpty(element) && element[0]}
              value={valueCurriculum}
            />
            <ModalCurriculum
              title="Đơn vị kiến thức"
              data={lerningTarget}
              onPress={(value) => this.onPress(4, value)}
              value={valueUnitOfKnowledge}
            />
            <ModalConfigLibrary
              title="Dạng bài"
              data={listSkills}
              onPress={value => this.onPress(5, value)}
              colum={2}
              widthItem={40}
              value={valueTypeOfExercise}
            />
            <ModalConfigLibrary
              title="Cấp độ"
              data={level}
              colum={2}
              widthItem={40}
              onPress={(value) => this.onPress(6, value)}
              value={valueLevel}
            />
          </View>
        </View>
      </Modal>
    );
  }
}