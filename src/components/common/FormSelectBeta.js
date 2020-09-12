import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Picker, Icon} from 'native-base';
import AppIcon from '../../utils/AppIcon';
import * as AppConst from '../../constants/const';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const {width} = Dimensions.get('window');
export default class FormSelectBeta extends Component {
  render() {
    const {label, styleLabel, styleText, disable = false} = this.props;
    return (
      <View style={styles.rowForm}>
        <Text style={[styles.label, styleLabel]}>{label}</Text>
        <View style={styles.viewInput}>
          {this.props.data && (
            <Picker
              iosIcon={
                <MaterialIcons
                  name="arrow-drop-down"
                  color={'#828282'}
                  size={23}
                />
              }
              note
              mode="dropdown"
              textStyle={[styles.textStyle, styleText]}
              itemTextStyle={[styles.textStyle, styleText]}
              style={styles.picker}
              selectedValue={this.props.selectedValue}
              onValueChange={(value) => {
                this.props.onValueChange(value);
              }}>
              {this.props.data.map((val, key) => {
                return (
                  <Picker.Item
                    key={key}
                    label={val.value !== -1 ? val.label : `Chọn ${label}`}
                    value={val.value}
                  />
                );
              })}
            </Picker>
          )}
        </View>
        {disable && <View style={styles.styDisable} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowForm: {
    marginVertical: 10,
  },
  label: {
    color: '#828282',
    marginStart: 5,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
  },
  viewInput: {
    height: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#C4C4C4',
    paddingTop: 5,
    fontFamily: 'Nunito-Regular',
  },
  picker: {
    marginStart: -10,
    color: '#396599',
    // width: AppConst.CONTAINER_FORM_WIDTH + 40,
    height: 40,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
  },
  textStyle: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
  },
  styDisable: {
    position: 'absolute',
    left: -20,
    top: 0,
    right: 0,
    width: width,
    height: 80,
    backgroundColor: 'transparent',
  },
});
