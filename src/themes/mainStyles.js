import Color from '../constants/colors';
import { Platform, Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Dimens from '../constants/dimens';
import * as AppConst from '../constants/const';

const top = isIphoneX() ? 30 : Platform.OS == 'ios' ? 20 : 0;
const paddingTop = isIphoneX() ? 40 : Platform.OS == 'ios' ? 30 : 10;

const { width } = Dimensions.get('window');

module.exports = {
  /**
   * Background
   */
  containerBackground: {
    width: '100%', height: '100%'
  },

  /**
   * HEADER
   */
  headerContainer: {
    backgroundColor: '#2F80ED',
    paddingTop: paddingTop,
    flexDirection: 'row',
    paddingBottom: 10,
    justifyContent: 'space-between'
  },
  headerIcon: {},
  headerTitle: {
    left: 0,
    right: 0,
    bottom: 0,
    top: top,
    zIndex: -1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextTitle: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#fff',
    width: '70%',
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },

  /**
   * Body
   */
  bodyMain: {
    flex: 1,
    paddingHorizontal: 5,
  },

  bodyContent: {
    flex: 1
  },

  /**
   * Heading
   */


  /**
   * Form
   */
  containerForm: {
    width: AppConst.CONTAINER_FORM_WIDTH + 30,
    alignSelf: 'center'
  },
  headerTextValidate: {
    color: '#d9534f',
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: 'Nunito-Regular',
    fontSize: 15
  },

  /**
   * Modal
   */
  wrapModal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  borderTop: {
    height: 7,
    backgroundColor: '#5bc0de'
  },
  contentModal: {
    backgroundColor: '#fff',
    flex: 1,
  },
  bodyHeader: {
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  topHeader: {
    height: 5,
    backgroundColor: Color.bgCircle,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  textHeader: {
    flex: 1,
    fontFamily: 'Nunito-Bold',
    color: '#5bc0de',
    fontSize: 16,
  },
  wrapHeader: {
    paddingTop: top
  },
  textHeaderModal: {
    color: '#333',
    fontFamily: 'Nunito-Bold',
    textTransform: 'uppercase'
  },
  iconHeader: {
    marginHorizontal: 20,
  },
  iconClose: {
    marginHorizontal: 10,
  },
  iconInfo: {
    alignSelf: 'center',
  },
  bodyModal: {
    flex: 1,
    justifyContent: 'space-around',
  },
  viewBorder: {
    height: 1,
    backgroundColor: '#9B9B9B',
    opacity: 0.3
  },
  processItem: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderColor: '#1194cb',
  },
  textItem: {
    flex: 1,
    color: '#4CAF79',
    fontSize: 14,
    fontFamily: 'Nunito-Bold'
  },
  textItemModal: {
    flex: 1,
    alignSelf: 'center',
    fontSize: Dimens.sizeModalItem,
    fontFamily: 'Nunito-Bold'
  },
  textItemTrue: {
    color: Color.colorTrue,
  },
  textItemFalse: {
    color: Color.colorFalse,
  },
  textItemExactly: {
    color: Color.colorExactly,
  },
  textItemSpeed: {
    color: Color.colorSpeed,
  },
  textItemPause: {
    color: Color.colorNumPause,
  },
  textNumber: {
    color: '#fff',
    fontFamily: 'Nunito-Bold'
  },
  circleNumber: {
    backgroundColor: '#1194cb',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    opacity: 0.75,
    justifyContent: 'center'
  },
  textInfo: {
    alignSelf: 'center',
    width: width - 40,
    marginVertical: 5,
    color: '#fff',
  },
  textC: {
    alignSelf: 'center',
    color: '#4CAF79',
    fontSize: 16,
    marginVertical: 5,
  },
  buttonContinue: {
    backgroundColor: '#0b9c4d',
    marginHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  textButton: {
    color: '#fff',
  },


  /**
   * boostrap
   * 
   */
  viewAbsoluteCenter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  textPrimary: {

  },
  textSuccess: {

  },
  textWarning: {

  },
  textInfo: {

  },
  textDanger: {

  },
  textTitle: {

  },
  textDesc: {

  },
  /**
   * end bootstrap
   */

  wrapper: {
    flex: 1,
  },
  //match parent view
  fill: {
    flex: 1,
  },
  //Horizontal view
  row: {
    flexDirection: 'row',
  },
  //Horizontal view
  horizontal: {
    flexDirection: 'row',
  },
  //fill absolute
  fillAbsolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  //container
  container: {
    flex: 1
  },


  /**
   * libs 2
   */
  //contents parallax bottom
  contents: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgPracticeTab: {
    backgroundColor: Color.bgPractice,
  },
  contentCard: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 10,
  },
  textPecent: {
    fontFamily: 'Nunito-Regular',
    color: '#DC7A24',
    fontSize: 12,
  },
  rowxs: {
    flexDirection: 'row',
    padding: 5,
  },
  rowsm: {
    flexDirection: 'row',
    padding: 10,
  },
  rowlg: {
    flexDirection: 'row',
    padding: 15,
  },
  rowbg: {
    flexDirection: 'row',
    padding: 20,
  },
  rowvxs: {
    flexDirection: 'row',
    paddingVerical: 5,
  },
  rowvsm: {
    flexDirection: 'row',
    paddingVerical: 10,
    paddingHorizontal: 5,
  },
  rowvlg: {
    flexDirection: 'row',
    paddingVerical: 15,
    paddingHorizontal: 10,
  },
  rowvbg: {
    flexDirection: 'row',
    paddingVerical: 20,
    paddingHorizontal: 10,
  },
  horizontalSpace: {
    flexDirection: 'row',
    justifyContent: 'space_around',
  },
  textCenter: {
    alignSelf: 'center',
  },
  textCenterBold: {
    alignSelf: 'center',
    fontFamily: 'Nunito-Bold'
  },
  viewCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};
