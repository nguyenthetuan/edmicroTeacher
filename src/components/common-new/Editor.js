import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
  defaultActions,
} from 'react-native-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const initHTML = `<br/>
<center><b>Pell.js Rich Editor</b></center>
<center>React Native</center>
<br/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" ></br></br>
</br></br>
`;

export default class RichTextExample extends Component {
  constructor(props) {
    super(props);
    const contentStyle = this.createContentStyle();
    this.state = {
      contentStyle,
      disabled: false,
      isVisible: false,
      htmlContent: '',
    };
  }

  onShow = htmlContent => {
    this.setState({ isVisible: true, htmlContent });
  };

  onDone = () => {
    this.setState({ disabled: !this.state.disabled });
  };

  onSend = async () => {
    let html = await this.richText.getContentHtml();
    console.log('RichTextExample -> onDone -> html', html);
    await this.setState({ isVisible: false });
    this.props.onDone(html);
  };

  createContentStyle() {
    const contentStyle = {
      backgroundColor: '#FFF',
      color: '#000033',
      placeholderColor: '#a9a9a9',
    };
    return contentStyle;
  }

  render() {
    const { contentStyle, disabled, isVisible, htmlContent } = this.state;
    const { backgroundColor, color, placeholderColor } = contentStyle;
    const themeBg = { backgroundColor };
    return (
      <Modal visible={isVisible} style={{ flex: 1 }}>
        <SafeAreaView />
        <View style={styles.container}>
          <View style={styles.styWrap}>
            <TouchableOpacity style={[styles.styWrapBtn]} onPress={this.onSend}>
              <Text style={styles.styTxtBtn}>Xong</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            {/* <TouchableOpacity style={styles.styWrapBtn} onPress={this.onDone}>
              <Text style={styles.styTxtBtn}>{disabled ? 'Sửa' : 'Xong'}</Text>
            </TouchableOpacity> */}
          </View>
          <ScrollView
            style={[styles.scroll, themeBg]}
            keyboardDismissMode={'none'}>
            <RichEditor
              editorStyle={contentStyle}
              containerStyle={themeBg}
              ref={r => (this.richText = r)}
              style={[styles.rich, themeBg]}
              placeholder={'please input content'}
              initialContentHTML={htmlContent}
              disabled={disabled}
            />
          </ScrollView>
          <RichToolbar
            disabled={disabled}
            style={[styles.richBar, themeBg]}
            getEditor={() => this.richText}
            iconTint={color}
            selectedIconTint={'#2095F2'}
            selectedButtonStyle={{ backgroundColor: 'transparent' }}
            onPressAddImage={this.onPressAddImage}
            actions={[
              defaultActions[1],
              defaultActions[2],
              defaultActions[3],
              defaultActions[4],
              actions.setStrikethrough,
              actions.heading1,
              actions.heading4,
            ]} // default defaultActions
            iconMap={{
              [actions.setStrikethrough]: ({ tintColor }) => (
                <IconFontAwesome
                  name={'strikethrough'}
                  style={[styles.tib, { color: tintColor }]}
                />
              ),
              [actions.heading1]: ({ tintColor }) => (
                <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
              ),
              [actions.heading4]: ({ tintColor }) => (
                <Text style={[styles.tib, { color: tintColor }]}>H3</Text>
              ),
            }}
          />
          {Platform.OS == 'ios' && <KeyboardSpacer />}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rich: {
    minHeight: 300,
    flex: 1,
  },
  richBar: {
    height: 50,
    bottom: 0,
    backgroundColor: '#F5FCFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
  },
  tib: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Nunito-Regular'
  },
  styWrap: {
    flexDirection: 'row',
  },
  styTxtBtn: {
    fontFamily: 'Nunito-Regular',
    color: '#2095F2',
    fontSize: 16,
  },
  styWrapBtn: {
    backgroundColor: '#FFF',
    padding: 10,
  },
});
