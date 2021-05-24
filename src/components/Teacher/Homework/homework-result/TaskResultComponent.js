import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import HTML from 'react-native-render-html';
import ImageZoom from './ImageZoom';
import ItemQuestion from './ItemQuestion';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

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
    console.log("🚀 ~ file: TaskResultComponent.js ~ line 29 ~ TaskResultComponent ~ item", item)
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
      // resultStudent = item.userOptionText
      //   ? item.userOptionText[0].replace(/(<p>||<\/p>)+/g, '')
      //   : '';

      resultStudent = item.userOptionText
        ? item.userOptionText[0]
        : '';
    }
    return (
      <View
        style={[
          styles.wrapElement,
        ]}>
        <View style={styles.wrapHeaderElem}>
          <Text style={styles.txtIndex}>Câu {item.stepIndex + 1}</Text>
          <Text style={styles.txtScore}>
            {item.scoreTeacher || item.score}/{item.maxScore} điểm
          </Text>
        </View>

        <View style={styles.wrapView}>
          <Text style={styles.answerStudent}>Câu trả lời của hs </Text>
          {
            item.typeAnswer === 0 ?
              <Text style={{ marginHorizontal: 10 }}>
                {resultStudent}
              </Text>
              :
              <HTML
                html={resultStudent}
                containerStyle={{ marginHorizontal: 10, backgroundColor: '#FFF', padding: 20, alignSelf: 'center', width: '100%' }}
                textSelectable={true}
              />
          }
          {images?.length > 0 ? (
            <FlatList
              data={images}
              renderItem={({ item }) => this.renderImage(item, images)}
              keyExtractor={(i, index) => index.toString()}
              horizontal={true}
              style={{ backgroundColor: "#FFF", borderRadius: 5, padding: 10, }}
            />
          ) : null}
        </View>

        {
          item.contentNoteTeacher ?
            <View style={styles.wrapView}>
              <Text style={styles.notesTeacher}>Nhận xét của Gv </Text>
              {/* <TextInput
            style={styles.inputTxt}
            editable={false}
            multiline={true}
            value={item.contentNoteTeacher?.replace(/(<p>||<\/p>)+/g, '')}
          /> */}
              <HTML
                html={`<body style="color:#FFA113">${item.contentNoteTeacher}</body>`}
                containerStyle={{ marginHorizontal: 10, borderRadius: 5, backgroundColor: '#FFF', padding: 10, alignSelf: 'center', width: '100%' }}
              />
            </View>
            : null
        }
      </View>
    );
  };

  _onTop = () => {
    this.refsFlatList.scrollToIndex({ animated: true, index: 0 });
  };

  changeAnswer = (item) => {
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
    };

    return resultStudent;
  }

  onHandleNext = (item, index) => () => {
    this.refsFlatList.scrollToIndex({ animated: true, index });
  };

  renderItemTaskResult = ({ item, index }) => {
    return <ItemQuestion
      item={item.dataStandard}
      index={index}
      onHandleNext={this.onHandleNext(item, index)}
      answer={this.changeAnswer(item.dataStandard)}
      backgroundColor={item.dataStandard.typeAnswer === 3 ? "#FFF" : item.dataStandard.rightAnswer ? '#10DA91' : '#FF6767'}
      color={item.dataStandard.typeAnswer === 3 ? '#000' : '#FFF'}
      style={{ borderColor: '#56CCF2', borderWidth: item.dataStandard.typeAnswer === 3 ? 1 : 0, overflow: 'hidden' }}
    />
  }

  renderListHeaderComponent = () => {
    let { dataForTaskResult } = this.props;
    return (
      <FlatList
        data={dataForTaskResult}
        renderItem={this.renderItemTaskResult}
        keyExtractor={(item, index) => index.toString()}
        numColumns={6}
        style={{ paddingTop: 10, backgroundColor: '#fff', paddingBottom: 10, alignItems: 'center' }}
      />
    );
  }

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
            <View style={{ backgroundColor: '#56ccf230' }}>
              <FlatList
                ref={ref => this.refsFlatList = ref}
                data={dataForTaskResult}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={this.renderListHeaderComponent}
              />
            </View>
            <TouchableOpacity
              style={styles.buttomTop}
              onPress={() => this._onTop()}>
              <IconAntDesign name={'arrowup'} size={18} color={'#FFF'} />
              <Text style={{ color: '#FAFAFA' }}>TOP</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  wrapElement: {
    padding: 10,
    borderBottomColor: '#FFF',
    borderBottomWidth: 2,
  },
  wrapHeaderElem: {
    flexDirection: 'row',
    width: '100%',
  },
  txtIndex: {
    fontFamily: 'Nunito-Bold',
  },
  txtScore: {
    fontFamily: 'Nunito-Bold',
    color: '#028EFF',
    marginHorizontal: 15,
  },
  answerStudent: {
    fontFamily: 'Nunito-Regular',
    color: '#828282',
  },
  notesTeacher: {
    fontFamily: 'Nunito-Regular',
    color: '#828282',
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
    width: width - 20,
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
