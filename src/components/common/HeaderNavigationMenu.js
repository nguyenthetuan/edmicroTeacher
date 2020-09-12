import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Entypo';
import Color from '../../constants/colors';
import RippleButton from '../libs/RippleButton';
import { mainStyle } from '../../themes';
import AppIcon from '../../utils/AppIcon';
import Share from '../exam-detail/Test';
const iconRightSize = 22;

export default class HeaderNavigation extends Component {
  onPress(key) {
    this.props.onPressItem(key);
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = (val) => {
    this._menu.hide();
    this.props.onPress(val);
  };

  showMenu = () => {
    this._menu.show();
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.data != nextProps.data) {
      return true;
    }
    if (this.props.title != nextProps.title) {
      return true;
    }
    return false;
  }

  onPressgoBack = () => {
    if (Share.updateCategory) {
      Share.updateCategory();
    }
    this.props.navigation.pop(2);
  }

  render() {
    const { title, bgColor, style, styleTitle, colorIcon, styleMenu, marginLeftIcon } = this.props;
    const data = this.props.data || [];
    const isBack = this.props.isBack;
    let showIcon = this.props.showIcon ? 1 : 0;
    const { params } = this.props.navigation.state;
    const { gobackCategoryDetail } = params || {};
    return (
      <View style={[mainStyle.headerContainer, { backgroundColor: bgColor || '#024A87' }, style]}>
        {isBack ?
          <RippleButton
            color={'white'} radius={50} size={100} duration={250}
            onPress={this.onPressgoBack}
          >
            <View style={[mainStyle.iconContainer, marginLeftIcon && { marginLeft: marginLeftIcon }]}>
              <Image source={AppIcon.arrow_left} style={{ width: 18, height: 18, tintColor: colorIcon }} resizeMode={'contain'} />
            </View>
          </RippleButton>
          :
          <View style={{ flex: 1 }} />
        }
        <Text style={[mainStyle.headerTextTitle, styleTitle]} numberOfLines={1}>{title || ''}</Text>
        <View style={[mainStyle.headerRight, [styleMenu]]}>
          {showIcon == 0 &&
            <Menu
              ref={this.setMenuRef}
              button={
                <View style={{ alignSelf: 'center', alignItems: 'flex-start', width: 40 }}>
                  <Icon
                    style={{ paddingVertical: 10 }}
                    onPress={this.showMenu} name={'menu'}
                    color={colorIcon || '#fff'} size={20} />
                </View>
              }
            >
              {data.map((val, key) => {
                return (
                  <MenuItem key={key} onPress={() => this.hideMenu(val)}>{val.name}</MenuItem>
                );
              })}
            </Menu>
          }
        </View>
      </View>
    );
  }
}



