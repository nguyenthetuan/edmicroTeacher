import {
  isSubjectMathJax, getAnswerName, getMathJaxScript, getHeaderStyle, getStyleMathPlay, getAppStyle
} from './WebUtils';
import { getScriptNativeToWeb } from './WebScript';
import { getScriptWebToNative } from './WebScriptNative';
import { getHeaderPractice } from './WebHeader';
import { getOptionsQuestion } from './WebOptions';
import { getExplain } from './WebExplain';
import { getTypeMathPlay } from './TypeMathPlay';
import { getKeyPad } from './MathPlay';
import WebColor from './WebColorConfig';
import styleMedia from './StyleMedia';


const { bgColorActive, bgOptionTrue, bgOptionFalse, bgOptionActive,
  bgViewTrue, bgViewFalse, textReviewColor, borderButton,
  bgButtonColor, textVideoColor, borderColor } = WebColor;

/**
 * 
 * HTML Practice 
 */
const renderMathJaxPractice = (data, subjectId, numberQuestion, isBookmark, contentHtml, question, type, index, isPractice, backgroundColor, isHideAnswerImg = false) => {
  let colorAnswer = '';
  if (backgroundColor != '') {
    colorAnswer = backgroundColor;
  }
  if (data == '') return '';
  const countOptions = Object.keys(!!data.options && data.options).length;
  let typeAnswer = data.typeAnswer;
  let typeView = data.typeView;
  let template = data.template;
  let userOptionText = data.userOptionText;
  let answerOfChoosingType = ``;
  let tempTemaple8 = ``;

  // start save answer
  if (userOptionText) {
    // alert(template)

    if (template == 0) {
      // alert(userOptionText)
      answerOfChoosingType += `<script>
      window.onload = function () {`

      // document.getElementById('textAnswer').value = ${ userOptionText };
      answerOfChoosingType += `if(!document.getElementsByTagName('textarea').length) {
        document.getElementById('viewOptions${userOptionText}').style.background = 'rgba(20, 32, 49, 0.05)'; \n
        document.getElementById('options${userOptionText}').style.background = 'rgb(85, 187, 234)';
      } else {
        document.getElementById('textAnswer').value = ${ userOptionText};
      }`
      answerOfChoosingType += `}
    </script>`;

      console.log('answerOfChoosingType', answerOfChoosingType);
    }

    if (template == 1 || template == 2) {
      answerOfChoosingType += `<script type="application/javascript">
      window.onload = function () {`;
      for (let i = 0; i < userOptionText.length; i++) {
        answerOfChoosingType += `document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}'; \n`
      }
      answerOfChoosingType += `}
    </script>`;
    }

    // save answer for template 7.
    if (template == 7) {
      answerOfChoosingType += `<script type="application/javascript">
      window.onload = function () {`;
      for (let i = 0; i < userOptionText.length; i++) {
        let temp = i * 2;
        if (userOptionText[i] == "đúng") {
          answerOfChoosingType += `\n document.getElementsByClassName('form-check-label mathplay-answer-1')[${temp}].style.background='rgb(23, 188, 186)'
          `
        }
        if (userOptionText[i] == "sai") {
          answerOfChoosingType += `\n document.getElementsByClassName('form-check-label mathplay-answer-1')[${temp + 1}].style.background='rgb(23, 188, 186)'
          `
        }
      }
      answerOfChoosingType += `}
      </script>`;
    }

    if (template == 8) {
      // console.log(userOptionText);
      tempTemaple8 = ` function writePathAnswerTemplate8() {
        let arr = ['${userOptionText[0]}', '${userOptionText[1]}', '${userOptionText[2]}'] || [];
        if (!arr) {
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            valueLeft = parseInt(arr[i][0]);
            valueRight = parseInt(arr[i][1]);
            switch (valueLeft) {
                case 1: {
                    sourceId = 'one-left';
                    break;
                }
                case 2: {
                    sourceId = 'wto-left';
                    break;
                }
                case 3: {
                    sourceId = 'three-left';
                    break;
                }
                case 4: {
                    sourceId = 'four-left';
                    break;
                }
            }
            switch (valueRight) {
                case 1: {
                    targetId = 'one-right';
                    break;
                }
                case 2: {
                    targetId = 'two-right';
                    break;
                }
                case 3: {
                    targetId = 'three-right';
                    break;
                }
                case 4: {
                    targetId = 'four-right';
                    break;
                }
            }
            connectJsplumb()
        }
    }
    writePathAnswerTemplate8();`
    }

    // save answer for template 9.
    if (template == 9 || template == 3) {
      answerOfChoosingType += `<script type="application/javascript">
      window.onload = function () {`;
      for (let i = 0; i < userOptionText.length; i++) {
        answerOfChoosingType += `document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}'; \n`
      }
      answerOfChoosingType += `}
    </script>`;
    }

    // save answer for template 12.
    if (template == 12) {
      answerOfChoosingType += `<script type="application/javascript">
      window.onload = function () {`;
      for (let i = 0; i < userOptionText.length; i++) {
        answerOfChoosingType += `document.getElementsByClassName('mathplay-answer')[${1 - i}].value = '${userOptionText[i]}'; \n`
      }
      answerOfChoosingType += `}
    </script>`;
    }

    // save answer for template 17.
    if (template == 17) {
      answerOfChoosingType += `<script type="application/javascript">
      window.onload = function () {`;

      // if (userOptionText[0] == "answer1") {
      //   answerOfChoosingType += `document.getElementsByClassName('form-check-label')[${0}].style.background='rgb(30, 159, 152)'; \n`
      // }
      // if (userOptionText[0] == "answer2") {
      //   answerOfChoosingType += `document.getElementsByClassName('form-check-label')[${1}].style.background='rgb(30, 159, 152)'; \n`
      // }
      // if (userOptionText[0] == "answer3") {
      //   answerOfChoosingType += `document.getElementsByClassName('form-check-label')[${2}].style.background='rgb(30, 159, 152)'; \n`
      // }
      // if (userOptionText[0] == "answer4") {
      //   answerOfChoosingType += `document.getElementsByClassName('form-check-label')[${3}].style.background='rgb(30, 159, 152)'; \n`
      // }
      // if (userOptionText[0] == "answer5") {
      //   answerOfChoosingType += `document.getElementsByClassName('form-check-label')[${4}].style.background='rgb(30, 159, 152)'; \n`
      // }

      for (let i = 0; i < userOptionText.length; i++) {
        if (userOptionText[0] == "answer1") {
          answerOfChoosingType += `document.getElementsByTagName('input').length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${0}].style.background='rgb(30, 159, 152)'; \n`
        }
        if (userOptionText[0] == "answer2") {
          answerOfChoosingType += `document.getElementsByTagName('input').length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${1}].style.background='rgb(30, 159, 152)'; \n`
        }
        if (userOptionText[0] == "answer3") {
          answerOfChoosingType += `document.getElementsByTagName('input').length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${2}].style.background='rgb(30, 159, 152)'; \n`
        }
        if (userOptionText[0] == "answer4") {
          answerOfChoosingType += `document.getElementsByTagName('input').length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${3}].style.background='rgb(30, 159, 152)'; \n`
        }
        if (userOptionText[0] == "answer5") {
          answerOfChoosingType += `document.getElementsByTagName('input').length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${4}].style.background='rgb(30, 159, 152)'; \n`
        }
        if (!!parseInt(userOptionText[i])) {
          answerOfChoosingType += `document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}'`
        }
      }
      answerOfChoosingType += `}
      </script>`;
    }

    // save answer for template 18.
    if (template == 18) {
      answerOfChoosingType += `<script type="application/javascript">
      window.onload = function () {`;
      if (userOptionText[0] == "answer1") {
        answerOfChoosingType += `document.getElementById('mathplay-answer-1').checked = true; \n`;
      }
      if (userOptionText[0] == "answer2") {
        answerOfChoosingType += `document.getElementById('mathplay-answer-2').checked = true; \n`;
      }
      if (userOptionText[0] == "answer3") {
        answerOfChoosingType += `document.getElementById('mathplay-answer-3').checked = true; \n`;
      }
      if (userOptionText[0] == "answer4") {
        answerOfChoosingType += `document.getElementById('mathplay-answer-4').checked = true; \n`
      }
      if (userOptionText[0] == "answer5") {
        answerOfChoosingType += `document.getElementById('mathplay-answer-5').checked = true; \n`
      }
      answerOfChoosingType += `}
      </script>`;
    }


    if (template == 19) {
      answerOfChoosingType += `<script type="application/javascript">
      window.onload = function () {`;
      if (userOptionText[0] == 'answer1') {
        answerOfChoosingType += `document.getElementsByClassName('item-content')[1].style.border='3px solid #08f4f4';`
      }
      if (userOptionText[0] == 'answer2') {
        answerOfChoosingType += `document.getElementsByClassName('item-content')[3].style.border='3px solid #08f4f4';`
      }
      if (userOptionText[0] == 'answer3') {
        answerOfChoosingType += `document.getElementsByClassName('item-content')[5].style.border='3px solid #08f4f4';`
      }
      answerOfChoosingType += `}
      </script>`;
    }

  }
  // end save answer


  let html = ``;
  html += `
  <!DOCTYPE html>
  <html>
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
      <link rel="stylesheet" href="font47/css/font-awesome.min.css" >
      ${subjectId == 'HOCHAY_TEST' ?
      ` <link rel="stylesheet" href="bootstrap.min.css" />
      `:
      ''
    } 
      <link rel="stylesheet" href="keypad.css">
      ${getHeaderStyle()}
      ${getStyleMathPlay()}
      ${styleMedia}
      ${getAppStyle()}
      <script src="jquery.min.js"></script>
      <script type="text/javascript" src="fastclick_min.js"></script>
     
    </head>
    <body style="padding:10px 0;margin:0px;font-family: Arial, sans-serif !important;">`;
  var bookmarkcolor = '#9B9B9B';
  if (isBookmark) {
    bookmarkcolor = '#ffd500';
  }
  let padding = !isSubjectMathJax(subjectId) ? '21px' : '14px';
  let { bookMarkStatus } = data;

  let reviewColor = '#9B9B9B';
  let stepId = data.stepId;
  let statusStep = data.statusStep;
  if (statusStep == 2 || statusStep == 4) {
    reviewColor = '#F9AB3B';
  }
  html += getHeaderPractice({
    index, numberQuestion, bookMarkStatus, bookmarkcolor, stepId, statusStep, reviewColor, isPractice
  });

  html += `
    
    <div class="template-default template-${template}">
    <div class="container-fluid" id="container-fluid" style="visibility:hidden;">
    <div style="position:relative;">
    `;
  if (contentHtml != '' && contentHtml != undefined) {
    html +=
      `<div style="overflow:auto;padding: 10px 15px;border-bottom: 1px solid #eaeaea" class="q_material">
            ${contentHtml}
          </div>`
  }
  html += `<div style="overflow:auto;padding:0px 15px;padding-top:10px;margin-bottom:10px;font-weight:bold;color:#232729">${question}</div>`;
  html += getOptionsQuestion(data, padding, type, isHideAnswerImg);
  html += `</div>`;
  html += `<div id="wrapdisabledOption" style="position:absolute;top:0;left:0;bottom:0;right:0;background:transparent;display:none;"></div>`;
  html += `</div>`;
  html += getExplain({ textReviewColor, textVideoColor, bgButtonColor, borderButton });
  html += getKeyPad(typeAnswer);
  html += `
            ${getMathJaxScript(subjectId)}
            ${getScriptNativeToWeb({ countOptions, bgOptionFalse, bgOptionTrue, bgViewTrue, type })}
            ${getScriptWebToNative({ countOptions, bgColorActive, typeAnswer, colorAnswer })}
            <script src="fastclick_min.js"></script>
            <script src="jquery-ui.min.js"></script>
            <script src="jquery-pull-touch.js"></script>
            `;
  html += getTypeMathPlay({ typeView, question, typeAnswer, template, userOptionText });
  html += answerOfChoosingType;
  html += `<div id="containerMain" style="position:absolute;top:30px;bottom:0;right:0;left:0;background:red"></div>
            <div style="display:none;" id="flashcardId"></div>
            <div style="display:none;" id="flashcardVideo"></div>
            </div>
            </div>
          </body>
      </html>`;
  // console.log(html);
  return html;
}

/**
 * 
 * HTML MODAL EXPLAIN
 */
const renderReview = (mathJax, size, align = true, subjectId) => {
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <link rel="stylesheet" href="font47/css/font-awesome.min.css" >
      ${getHeaderStyle()}
      ${getMathJaxScript(subjectId)}
    </head>
    <body>
      ${mathJax}
      <div style="display:none;" id="flashcardId"></div>
      <div style="display:none;" id="flashcardVideo"></div>
      <div style="display:none;" id="stepId"></div>
      <div id="containerMain" style="position:absolute;top:0;bottom:0;right:0;left:0;background:#fff"></div>
    </body>
  </html>`;
  return html;
};

module.exports = {
  renderMathJaxPractice,
  renderReview
};


