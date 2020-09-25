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
import { API_BASE, API_BASE_MOCK, API_BASE_OAUTH } from '../constants/setting';
import icon_close_modal from '../asserts/appIcon/icon_close_modal.png'

const { bgColorActive, bgOptionTrue, bgOptionFalse, bgOptionActive,
    bgViewTrue, bgViewFalse, textReviewColor, borderButton,
    bgButtonColor, textVideoColor, borderColor } = WebColor;

/**
* 
* HTML Practice 
*/
const renderMockExample = (data, subjectId, numberQuestion, isBookmark, contentHtml, question, type, index, userAnswer, token, dataSideBar,linkMedia, allowClick = true) => {
    console.log("renderMockExample -> userAnswer", userAnswer)
    let mockData = [];
    if (userAnswer?.imageAnswer?.length > 0) {
        for (let j = 0; j < userAnswer.imageAnswer?.length; j++) {
            const element = userAnswer.imageAnswer[j];
            mockData.push(`${element}`);
        }
    }
    const countOptions = Object.keys(!!data.options && data.options)?.length;
    let typeAnswer = data.typeAnswer;
    let typeView = data.typeView;
    let template = data.template;
    let userOptionText = data.userOptionText;
    let answerOfChoosingType = ``;
    let hideSpanNumber = '';
    let tempTemaple8 = ``;
    // start save answer
    if (userAnswer?.length) {
        if (template == 0) {
            if (typeAnswer == 0) {
                answerOfChoosingType += `<script>
            window.onload = function () {`
                answerOfChoosingType += `
              document.getElementById('viewOptions${userAnswer}').style.background = 'rgba(20, 32, 49, 0.05)'; \n
              document.getElementById('options${userAnswer}').style.background = 'rgb(85, 187, 234)';
            `
                answerOfChoosingType += `}
          </script>`;
            }
            if (typeAnswer == 3) {
                answerOfChoosingType += `<script>
                `
                answerOfChoosingType += `
                const value = "${userAnswer[0] == undefined ? '' : userAnswer[0]?.toString().replace(/[\r\n]+/g, '_')}";
                document.getElementsByTagName('textarea')[0].value = value.replace(/[_]+/g, '\ \\n');
                `
                answerOfChoosingType += `
                </script>`;
            }
        }

        if (template == 1 || template == 2) {
            answerOfChoosingType += `<script type="application/javascript">
        window.onload = function () {`;
            for (let i = 0; i < userOptionText?.length; i++) {
                answerOfChoosingType += `document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}'; \n`
            }
            answerOfChoosingType += `}
      </script>`;
        }

        // save answer for template 7.
        if (template == 7) {
            answerOfChoosingType += `<script type="application/javascript">
        window.onload = function () {`;
            for (let i = 0; i < userOptionText?.length; i++) {
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
            tempTemaple8 = ` function writePathAnswerTemplate8() {
          let arr = ['${userOptionText[0]}', '${userOptionText[1]}', '${userOptionText[2]}'] || [];
          if (!arr) {
              return;
          }
          for (let i = 0; i < arr?.length; i++) {
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
            for (let i = 0; i < userOptionText?.length; i++) {
                answerOfChoosingType += `document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}'; \n`
            }
            answerOfChoosingType += `}
      </script>`;
        }

        // save answer for template 12.
        if (template == 12) {
            answerOfChoosingType += `<script type="application/javascript">
        window.onload = function () {`;
            for (let i = 0; i < userOptionText?.length; i++) {
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

            for (let i = 0; i < userOptionText?.length; i++) {
                if (userOptionText[0] == "answer1") {
                    answerOfChoosingType += `document.getElementsByTagName('input')?.length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${0}].style.background='rgb(30, 159, 152)'; \n`
                }
                if (userOptionText[0] == "answer2") {
                    answerOfChoosingType += `document.getElementsByTagName('input')?.length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${1}].style.background='rgb(30, 159, 152)'; \n`
                }
                if (userOptionText[0] == "answer3") {
                    answerOfChoosingType += `document.getElementsByTagName('input')?.length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${2}].style.background='rgb(30, 159, 152)'; \n`
                }
                if (userOptionText[0] == "answer4") {
                    answerOfChoosingType += `document.getElementsByTagName('input')?.length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${3}].style.background='rgb(30, 159, 152)'; \n`
                }
                if (userOptionText[0] == "answer5") {
                    answerOfChoosingType += `document.getElementsByTagName('input')?.length < 0 ? document.getElementsByClassName('mathplay-answer')[${i}].value = '${userOptionText[i]}' \n : document.getElementsByClassName('form-check-label')[${4}].style.background='rgb(30, 159, 152)'; \n`
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

    } else {
        if (typeAnswer == 3) {
            answerOfChoosingType += `<script>
            `
            answerOfChoosingType += `
            document.getElementsByTagName('textarea')[0].value = '${userAnswer?.dataOptionText == undefined ? '' : userAnswer.dataOptionText}'
            `
            answerOfChoosingType += `
          </script>`;
        }
    }
    // end save answer

    // start hideSpanNumber
    hideSpanNumber += `<script type="application/javascript">
            document.getElementById('spanIdNumber').style.visibility="hidden";
            document.getElementById('warningStart').style.visibility="hidden";
        </script>
    `
    //end hideSpanNumber

    let html = ``;
    html += `
    <!DOCTYPE html>
    <html>
      <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
        <script type="text/javascript" src="MathJax.min.js"></script>
        <script type="text/javascript" src="fastclick_min.js"></script>
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
        <script>
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        function fetchUrl(url, options, timeout = 60000) {
            return Promise.race([
                fetch(url, options),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), timeout)
                )
            ]);
        }

        async function showType(fileInput) {
            var files = fileInput.files;
            for (var i = 0; i < files?.length; i++) {
              var name = files[i].name;
              var type = files[i].type;
              window.ReactNativeWebView.postMessage("myfileImageLoading---" + 1);

                          
              try {
               
                let response = await fetchUrl('${API_BASE}school-online/exam/signedUrl/answer', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ${token}',
                    'Referer': 'https://m.k12.onluyen.vn'
                    },
                    body: JSON.stringify({
                        fileType: type,
                        extensionFile: name.split('.')[1]
                    })
                });

                let responseJson = await response.json();
                if (!!responseJson && !!responseJson.preSignedUrl) {
                    let res = await fetchUrl(proxyurl + responseJson.preSignedUrl, {
                     method: 'PUT',
                      headers: {
                     'Content-Type': 'image/*'
                  },
                  body: files[i]
                });
                window.ReactNativeWebView.postMessage("myfileImageLoading---" + 0);
                window.ReactNativeWebView.postMessage("myfileImage---" + responseJson.urlFile);
              }

              }
              catch(err) {
                window.ReactNativeWebView.postMessage("myfileImageTimeOut---" + 0);
              }

               
              
              
              
            }
          }
          window.onload = function () {
            let arrInput = document.getElementsByTagName('input');
            if (arrInput && arrInput?.length > 0) {
              for (let i = 0; i < arrInput?.length; i++) {
                arrInput[i].disabled = true;
              }
            }
            let btnChooseImage = document.getElementById('myfile');
            if (btnChooseImage) {
              btnChooseImage.disabled = false;
            }
            if(${mockData?.length > 0}){     
                let mockData = [];
                let imageConvert = "${mockData}";
                let arrImageConvert = imageConvert.split(',');
                mockData.push(...arrImageConvert);
                let imageContain = document.getElementById('imageContain');
                imageContain.style.display = 'flex';
                for (let i = 0; i < mockData?.length; i++) {
                    const src = mockData[i];
                    var DOM_div = document.createElement("div");
                    var DOM_img = document.createElement("img");
                    var DOM_i = document.createElement("i");
          
                    DOM_div.style.width = '80px';
                    DOM_div.style.height = '80px';
                    DOM_div.style.margin = '10px';
                    DOM_div.style.position='relative'
                    DOM_div.style.backgroundColor='#eee'
          
                    DOM_img.src = src;
                    DOM_img.width = 80;
                    DOM_img.height = 80;
                    DOM_img.alt = "Smiley face";
                    DOM_img.loading = "lazy";
          
                    DOM_i.id = i;
                    DOM_i.className = "fa fa-close";
                    DOM_i.style.position = "absolute";
                    DOM_i.style.right = 0;
                    DOM_i.style.color = "#FFF";
                    DOM_i.style.fontSize = "20px";
                    DOM_i.style.borderRadius = "3px";
                    DOM_i.style.backgroundColor = "#555";
                    DOM_i.style.margin = "2px";
                    DOM_i.addEventListener('click', () => {
                      window.ReactNativeWebView.postMessage("closeImage---" + i);
                    })
          
                    DOM_img.append(DOM_i);
                    DOM_div.appendChild(DOM_i);
                    DOM_div.appendChild(DOM_img);
          
                    imageContain.appendChild(DOM_div);
          
                  }
                  if (mockData?.length >= 5) {
                    arrInput[0].disabled = true;
                    document.getElementById('btnSendImg').style.backgroundColor = '#333'
                    document.getElementById('warningLength').style.color = 'red';
                    return;
                  }
            }
          }
          function myWarningFunction(numberQuestion){
            window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
          }
          function addQuestion(numberQuestion){
            if(document.getElementById("checkBox").style.display == "none"){
              document.getElementById("checkBox").style.display = "block";
              window.ReactNativeWebView.postMessage("active---");
            } else{
              document.getElementById("checkBox").style.display = "none";
              window.ReactNativeWebView.postMessage("active---");
            }
          }
         
      </script>
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

    // start hien thi dap an

    // end hien thi dap an

    //style="visibility:hidden;"
    // start hien thi noi dung cau hoi
    html += `
      
      <div class="template-default template-${template}">
      <div class="container-fluid" >
      `;
    // end hien thi noi dung cau hoi
    if (typeAnswer === 3) {
        html += `<div style="overflow:auto;padding:0px 15px;padding-top:10px;margin-bottom:10px;font-weight:bold;color:#232729 ; font-size:13px">
      ${!!contentHtml ? contentHtml : ''}
      </div>`;
    }

    if (question != '' && question != undefined && typeAnswer === 3) {
        html +=
            `
            <div style="padding:0 16px 0 16px">
            <div style="border-top: 1px solid #eaeaea;width:100%;marign-left:10"></div>
            </div>
            <div style="overflow:auto;padding: 10px 15px; " class="q_material">
                  ${question}
                </div>`
    }
    html += getHeaderPractice({
        index, numberQuestion, bookMarkStatus, bookmarkcolor, stepId, statusStep, reviewColor, isPractice: false, dataSideBar
    });
    if (typeAnswer === 0) {
        html += `<div style="overflow:auto;padding:0px 15px;padding-top:10px;margin-bottom:10px;font-weight:bold;color:#232729 ; font-size:13px">
     ${!!contentHtml ? contentHtml : ''}
     </div>`;
    }
    if (question != '' && question != undefined && typeAnswer === 0) {
        html +=
            `<div style="overflow:auto;padding: 10px 15px;border-botton: 1px solid #eaeaea " class="q_material">
              ${question}
            </div>`
    }
    if (linkMedia) {
        html += `
        <div style="overflow:auto;padding: 10px 15px;border-botton: 1px solid #eaeaea " class="q_material">
        <audio controls>
            <source src="${linkMedia}">
          </audio>
        </div>
          `
    }
    html += getOptionsQuestion(data, padding, type);
    html += `<div id="wrapdisabledOption" style="position:absolute;top:0;left:0;bottom:0;right:0;background:rgba(0,0,0,0);display:none;"></div>`;
    html += `</div>`;
    // khoảng trống phía dưới đáp án cuối cùng
    html += `<div style="margin:100px"></div>`;
    html += getExplain({ textReviewColor, textVideoColor, bgButtonColor, borderButton });
    html += getKeyPad(typeAnswer);
    html += `
              ${getMathJaxScript(subjectId, false)}
              ${getScriptNativeToWeb({ countOptions, bgOptionFalse, bgOptionTrue, bgViewTrue, type })}
              ${getScriptWebToNative({ countOptions, bgColorActive, typeAnswer, allowClick })}
              <script src="fastclick_min.js"></script>
              <script src="jquery-ui.min.js"></script>
              <script src="jquery-pull-touch.js"></script>
              `;
    html += getTypeMathPlay({ typeView, question, typeAnswer, template, userOptionText });
    html += answerOfChoosingType;
    // html += hideSpanNumber;
    html += `<div id="containerMain" style="position:absolute;top:0;bottom:0;right:0;left:0;background:transparent"></div>
              <div style="display:none;" id="flashcardId"></div>
              <div style="display:none;" id="flashcardVideo"></div>
              </div>
              </div>
            </body>
        </html>`;
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
    renderMockExample,
    renderReview
};