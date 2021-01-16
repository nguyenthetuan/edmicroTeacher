import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { mainStyle } from '../../themes';
import { WIDTH_DEVICE, HEIGHT_DEVICE } from '../../constants/const';
import ScaleAnim from '../anim/ScaleAnim';
import RippleButton from '../common-new/RippleMenu';
import Button from '../common/Button';
import LoadingScreen from '../libs/LoadingScreen';

const widthItem = (WIDTH_DEVICE / HEIGHT_DEVICE) * 120;
const radius = 30;

export default class GradesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classFlag: null,
      disabledBtn: true
    };
  }

  keyExtractor = (item) => item.subjectId;

  getBorderColor(item) {
    if (item.gradeId == this.props.gradeId) {
      currentGrade = this.props.gradeId;
      return {
        borderColor: '#27AE60',
        backgroundColor: 'rgba(85, 182, 25, 0.15);',

      }
    } else if (this.state.classFlag == item.gradeId) {
      chosenGrade = item.gradeId;
      return {
        borderColor: '#27AE60',
      }
    } else {
      return {
        borderColor: '#000'
      }
    }
  }

  listFooterComponent = () => {
    return (
      <View style={styles.wrapBtn}>
      </View>
    )
  }

  render() {
    const { listClass } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          style={{ alignSelf: 'center', paddingLeft: '5%', }}
          data={listClass}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          ListFooterComponent={this.listFooterComponent}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={({ item }) =>
            <View style={{ marginRight: 20 }}>
              <ScaleAnim delay={150}>
                <RippleButton
                  color={'#ddd'}
                  style={{ marginTop: 20 }}
                  size={widthItem}
                  onPress={() => { this.props.chonseClass(item.gradeId) }}
                >
                  <View style={[styles.containerList, {
                    backgroundColor: item.gradeId == this.props.gradeId ? 'rgba(86, 204, 242, 0.36)' : '#fff',
                    borderColor: item.gradeId == this.props.gradeId ? '#54CEF5' : '#00A3FF'
                  }]}>
                    <View style={styles.pullRight}>
                      <View style={[mainStyle.horizontal, styles.wrapInfo]}>
                        <Text style={styles.textTitle}>{item.gradeName}</Text>
                      </View>
                    </View>
                  </View>
                </RippleButton>
              </ScaleAnim>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  containerList: {
    width: widthItem + 10,
    height: 45,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    backgroundColor: '#E3F6FE'
  },
  wrapImage: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  pullRight: {
    marginHorizontal: 10,
    flex: 1,
    alignItems:'center'
  },
  icon: {
    width: 35,
    height: 35,
  },
  iconLock: {
    marginLeft: 10,
    alignSelf: 'center'
  },
  wrapInfo: {
    marginTop: 5,
  },
  textInfo: {
    marginRight: 10,
    fontSize: RFFonsize(12),
    color: '#c8c8c8',
  },
  textTitle: {
    fontFamily: 'Nunito-Regular',
    color: '#000',
    fontSize: RFFonsize(14),
    textAlign:'center'
  },
  iconOpacity: {
    position: 'absolute',
    right: 0,
    bottom: -20,
    opacity: 0.3
  },
  wrapBtn: {
    flex: 3,
    zIndex: 100,
    width: '100%',
    backgroundColor: 'red',
  },
});

/* <View style={styles.containerList} >
<View style={styles.containerListIn}>
  <View style={styles.pullRight}>
    <Text style={styles.textTitle}>{data.gradeName}</Text>
    <View style={[mainStyle.horizontal, styles.wrapInfo]}>
      <FlatList
        contentContainerStyle={{ flex: 1 }}
        data={listClass[key].listSubject}
        keyExtractor={this.keyExtractor}
        numColumns={3}
        renderItem={({ item }) =>
          <View style={styles.rowSub}>
            <Image
              source={Common.getIconSubject(item.subjectId)}
              style={styles.iconSub}
            />
            <Text style={styles.textInfo}>{item.subjectName}</Text>
          </View>
        }
      />
    </View>
  </View>
</View>
</View> */
