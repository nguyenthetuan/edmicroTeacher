import { StyleSheet, Dimensions, Platform } from 'react-native';
// import { isIphoneX } from 'react-native-iphone-x-helper';
// const top = isIphoneX() ? 40 : Platform.OS == 'ios' ? 20 : 10;
import { RFFonsize } from '../utils/Fonts';
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    // marginBottom: height / 4,
    alignItems: 'center',
    zIndex: 10
  },
  viewLogin: {
    width: '80%',
  },
  wrapLogin: {
    alignItems: 'center',
    width: width - 40,
    paddingVertical: 20,
  },
  validationStyle: {
    alignSelf: 'center',
    color: '#d9534f',
    fontSize: RFFonsize(13),
    fontFamily: 'Nunito-Regular',
  },
  authItem: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    marginVertical: 20
  },
  backArrow: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    zIndex: 100,
    flexDirection: 'row',
  },
  wrapIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 20
  },
  authAction: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  textHeadAuth: {
    fontSize: RFFonsize(20),
    fontWeight: 'bold',
    color: "#383838",
    marginVertical: 5,
  },
  textLink: {
    color: "#828282",
    alignSelf: 'center',
    fontSize: RFFonsize(13),
    fontFamily: 'Nunito-Regular',
  },
  textInput: {
    width: '80%',
    paddingHorizontal: 5,
    color: '#828282',
    fontSize: RFFonsize(14),
    fontFamily: 'Nunito-Regular',
    // paddingTop: 28,
    color: '#000',
    height: 20,
    padding: 0
  },
  bntAction: {
    width: 180,
    backgroundColor: "#E35426",
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10
  },
  buttonLogin: {
    marginVertical: 10,
    backgroundColor: '#3b5998',
    width: 180,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
  },
  textAction: {
    color: "#fff",
    fontFamily: 'Nunito-Bold',
    fontSize: RFFonsize(14),
  }
});

export default styles;
