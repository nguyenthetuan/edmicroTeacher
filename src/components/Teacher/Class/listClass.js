import React from 'react'
import {
  StyleSheet,
  View,
  SafeAreaView,
  Animated,
  RefreshControl,
  FlatList
} from 'react-native';

import ItemCLass from './itemClass';
import HeaderMain from '../../common-new/HeaderMain';
import ClassHolder from '../../shim/ClassHolder';
const { Value, timing } = Animated;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class ListClass extends React.Component {

  constructor(props) {
    super(props)

    this._scroll_y = new Value(0)
  }

  _renderItem = ({ item, index }) => {
    return (
      <ItemCLass item={item} index={index} navigation={this.props.navigation} />
    );
  };

  render() {
    const { data, isRefresh, onRefresh, navigation, user, isLoading } = this.props;
    const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 100);
    const _header_opacity = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    let translateY = _diff_clamp_scroll_y.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -100],
      extrapolate: 'clamp',
    });

    return (
      <SafeAreaView style={styles.safe_area_view}>
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: translateY }],
              opacity: _header_opacity
            }
          ]}
        >
          <HeaderMain
            {...user}
            navigation={navigation}
          />
        </Animated.View>
        {isLoading ?
          <ClassHolder />
          :
          <AnimatedFlatList
            style={[
              styles.scroll_view,
              {
              }
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={1}
            initialNumToRender={3}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                progressViewOffset={100}
                refreshing={isRefresh}
                tintColor={'#333'}
                enabled={true}
                onRefresh={onRefresh}
              />
            }
            onScroll={Animated.event([
              {
                nativeEvent: { contentOffset: { y: this._scroll_y } }
              }
            ],
              { useNativeDriver: true }
            )}
            renderItem={this._renderItem}
            ListFooterComponent={() => <View style={{ height: 60 }} />}
            data={data}
          />
        }
      </SafeAreaView>
    )
  }
}

export default ListClass;

const styles = StyleSheet.create({
  safe_area_view: {
    flex: 1,
  },
  header: {
    height: 50,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    right: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    zIndex: 1
  },
  scroll_view: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16
  },
})