// Colors [#0b3e71,55bbea] 
module.exports = {
  //menu
  colorHeaderMenu: '#787878',
  colorIconMenuItem: '#737373',
  bgItemMenu: '#0b3e71',
  bgMenuWrap: 'red',
  colorTextImnu: '#000',

  //group header
  colorHeader: '#000',
  borderColorHeader: '#0b3e71',
  bgHeaderGroup: '#f8f8f8',

  //header
  bgHeader: '#1194cb',
  colorIconHeader: '#fff',
  colorTintHeader: '#555',

  //progress
  progressColor: '#56CCF2',
  progressUnfilledColor: 'rgb(247, 247, 247)',
  progressBorderColor: '#c8d1d5',

  //tabnavigation
  bgTab: '#0b3e71',
  bgTabBot: '#fff',

  //home screen
  bgHome: '#0b3e71',
  bgStartSubject: '#f7f7f9',
  colorDescSubject: '#c8c8c8',
  bgItemSubject: '#fff',

  //color subject

  bgMath: '#7E96EC',
  bgPhy: '#FFC571',
  bgChem: '#E34D5C',
  bgBio: '#6AD789',
  bgLite: '#BA6BF9',
  bgHis: '#EEC13C',
  bgGeo: '#31C0FC',
  bgEng: '#5CC9C2',
  bgEngTHPT: '#FC928A',
  bgEngTHPT2: '#AC33CC',
  bgEdu: '#51AC6B',
  bgTinHoc: '#27AE60',

  //main 
  bgMain: '#fff',
  textMain: '#000',
  colorTitle: '#000',
  borderColor: '#a9a9a9',
  colorDescMain: '#888',
  colorMath: '#6197dc',
  colorPhys: '#613d7c',
  colorChems: '#5cb85c',
  bgMainGrad1: '#1194cb',
  bgMainGrad2: '#024a87',
  bgMainGrad3: '#012849',
  bgExam: '#532E92',
  transparent: 'transparent',
  bgItem: '#FFFBF5',
  bgContents: '#fff',
  bgHeaderUser: '#55bbea',

  //practice
  bgPractice: '#f1c05b', //background content practice
  tabPractice: '#f1c05b', //background tab practice
  circlePractice: '#f1c05b', //background circle progress report 

  //learn
  topNavLearn: 'rgb(161, 161, 161)',

  //modal 
  bgHeaderModal: '#333',
  borderHeaderModal: '#0b3e71',
  bgModal: '#55bbea',

  //effect
  colorRippleMain: '#999',
  bgCircle: '#0b3e71',
  effectGround1: '#1194cb',
  colorRippleGrades: '#AF7817',

  //other
  linkColor: '#20a8d8',
  colorTrue: '#5cb85c',
  colorFalse: '#f86c6b',
  colorExactly: '#f9ad52',
  colorNumPause: '#5cb85c',
  colorSpeed: '#f86c6b',

  //bookmark
  hederColorBmark: '#024a87',

  //Grades
  bgGrades: '#f1c05b',
  bgGradesEffect: '#FFE87C',

  placeholderTextColor: '#fff',
  WHITE: '#fff',
  BLACK: '#000',
  BLACKBURN: '#f8f8f8',
  GRAY: '#f8f8f8',
  TRANSPARENT: 'transparent',
  clFormIcon: '#fff',

  practiceTincolor: '#FDAF40',
  examTinColor: '#BDBDBD',
  slaTinColor: '#32BDA6',

  //Rcolor
  blue_correct: '#1caff6',
  red_wrong: '#ED4A53',
  gray_border: '#F3F4F4',
  blue_background_correct: '#EEF9E9',
  red_background_wrong: '#FFF4F4',
  blue_title_modal: '#41C1DC',
  textColorCorrect: '#4CAF79',
  textColorWrong: '#E24F50',
  textColorAccuracy: '#F7AA5A',
  bg_test: '#F2F4F6',
  gray_index_ques: '#4A4A4A',
  bg_bt_ok: '#55B83B',
  tab_color_un_active: '#626262',
  tab_color_active: '#19BAE6',
  bg_test_title: '#532E92',
  transparent: 'transparent',
  bg_title_user: '#004D85',
  color_user: '#004D85',
  bg_user: '#E7ECEF',

  //modal
  modal_header: '#6197dc',
  modal_bt: '#6197dc',

  bg_subject: (id) => {
    // return '#532E92';
    switch (id) {
      case AppConst.mathID: return colorMath;
      case AppConst.phyID: return colorPhys;
      case AppConst.chemID: return colorChems;
      case AppConst.bioID: return colorMath;
      case AppConst.literID: return colorPhys;
      case AppConst.hisID: return colorPhys;
      case AppConst.geoID: return colorChems;
      case AppConst.engID: return colorPhys;
      case AppConst.gdcdID: return colorChems;
      case AppConst.engTHPTID: return colorMath;
      case AppConst.mathVao10ID: return colorMath;
      default: return '#F1C05B';
    }
  }
};

const colorMath = '#6197dc';
const colorPhys = '#613d7c';
const colorChems = '#5cb85c';
