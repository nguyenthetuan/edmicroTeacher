import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import HTML from 'react-native-render-html';
import ImageZoom from './ImageZoom';
const { width, height } = Dimensions.get('window');
export default class TaskResultComponent extends Component {
  onClickImage = (images) => () => {
    this.refs.ImageZoom._setState(images);
  };

  renderImage = (item, images) => (
    <TouchableOpacity onPress={this.onClickImage(images)}>
      <Image source={{ uri: item }} style={styles.styImage} />
    </TouchableOpacity>
  );

  renderItem = ({ item }) => {
    let images = item.userImageAnswer || [];
    let resultStudent = '';
    if (item.typeAnswer == 0) {
      // dang bai tap trac nghiem
      switch (item.userOptionId[0]) {
        case 0:
          resultStudent = 'A';
          break;
        case 1:
          resultStudent = 'B';
          break;
        case 2:
          resultStudent = 'C';
          break;
        case 3:
          resultStudent = 'D';
          break;

        default:
          resultStudent = '';
          break;
      }
    } else if (item.typeAnswer == 3) {
      // dang bai tap tu luan
      resultStudent = item.userOptionText
        ? item.userOptionText[0].replace(/(<p>||<\/p>)+/g, '')
        : '';

      // resultStudent = item.userOptionText
      //   ? item.userOptionText[0]
      //   : '';
    }
    return (
      <View
        style={[
          styles.wrapElement,
          { borderColor: item.rightAnswer ? '#6AD789' : '#DB3546' },
        ]}>
        <View style={styles.wrapHeaderElem}>
          <Text style={styles.txtIndex}>Câu {item.stepIndex + 1}</Text>
          <Text style={styles.txtScore}>
            Điểm số: {item.scoreTeacher || item.score}/{item.maxScore}
          </Text>
        </View>

        <View style={styles.wrapView}>
          <Text style={styles.answerStudent}>Học sinh trả lời: </Text>
          {/* <TextInput
            style={styles.inputTxt}
            editable={false}
            multiline={true}
            value={resultStudent}
          /> */}
          <Text style={{ marginHorizontal: 10 }}>
            {resultStudent}
          </Text>
          {/* <HTML html={resultStudent} containerStyle={{ marginHorizontal: 10 }} textSelectable={true}/> */}
          {images?.length > 0 ? (
            <FlatList
              data={images}
              renderItem={({ item }) => this.renderImage(item, images)}
              keyExtractor={(i, index) => index.toString()}
              horizontal={true}
            />
          ) : null}
        </View>

        {
          item.contentNoteTeacher ?
            <View style={styles.wrapView}>
              <Text style={styles.notesTeacher}>Giáo viên nhận xét: </Text>
              {/* <TextInput
            style={styles.inputTxt}
            editable={false}
            multiline={true}
            value={item.contentNoteTeacher?.replace(/(<p>||<\/p>)+/g, '')}
          /> */}
              <HTML html={item.contentNoteTeacher} containerStyle={{ marginHorizontal: 10 }} />
            </View>
            : null
        }
      </View>
    );
  };

  _onTop = () => {
    this.refs.FlatList.scrollToIndex({ animated: true, index: 0 });
  };

  render() {
    let { dataForTaskResult } = this.props;
    dataForTaskResult = dataForTaskResult.map((item) => {
      const { dataMaterial, dataStandard } = item;
      if (dataStandard != null) {
        return {
          maxScore: dataStandard.maxScore,
          score: dataStandard.score,
          userOptionId: dataStandard.userOptionId,
          userImageAnswer: dataStandard.userImageAnswer,
          userOptionText: dataStandard.userOptionText,
          typeAnswer: dataStandard.typeAnswer,
          scoreTeacher: dataStandard.scoreTeacher,
          stepIndex: dataStandard.stepIndex,
          rightAnswer: dataStandard.rightAnswer,
          contentNoteTeacher: dataStandard.contentNoteTeacher,
        };
      } else {
        // truong hop cau hoi hoc lieu se duoc lam o day.
        return {};
      }
    });
    return (
      <View style={styles.contain}>
        {dataForTaskResult.length > 0 ? (
          <>
            <FlatList
              ref="FlatList"
              data={dataForTaskResult}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
            {/* <TouchableOpacity
              style={styles.buttomTop}
              onPress={() => this._onTop()}>
              <Image
                source={require('../../asserts/appIcon/icUp.png')}
                resizeMode="contain"
                style={{ height: 20, width: 20 }}
              />
              <Text style={{ color: '#FAFAFA' }}>TOP</Text>
            </TouchableOpacity> */}
            <ImageZoom ref={'ImageZoom'} />
          </>
        ) : (
            <Text
              style={{
                fontFamily: 'Nunito-Regular',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#828282',
              }}>
              Hiện tại chưa có dữ liệu
            </Text>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  wrapElement: {
    minHeight: 100,
    width: width - 40,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6AD789',
    marginVertical: 10,
  },
  wrapHeaderElem: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  txtIndex: {
    fontFamily: 'Nunito-Bold',
  },
  txtScore: {
    fontFamily: 'Nunito-Regular',
    color: '#FF6213',
  },
  answerStudent: {
    fontFamily: 'Nunito-Regular',
    color: '#56CCF2',
  },
  notesTeacher: {
    fontFamily: 'Nunito-Regular',
    color: '#F39120',
  },
  inputTxt: {
    borderWidth: 0.5,
    borderColor: '#C4C4C4',
    borderRadius: 4,
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    minHeight: 50,
    maxHeight: 200,
    padding: 10,
    fontFamily: 'Nunito-Regular',
  },
  wrapView: {
    marginTop: 10,
  },
  styImage: {
    width: 50,
    height: 50,
    margin: 5,
  },
  wrapImage: {
    flexDirection: 'row',
  },
  buttomTop: {
    backgroundColor: '#0091EA',
    marginTop: 20,
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    right: 15,
    bottom: 15,
  },
});
