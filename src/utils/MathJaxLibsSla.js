import {
  isSubjectMathJax, getAnswerName, getHeaderStyle, getMathJaxScript,
  getMessageEventExam, loadEventNative,
} from './WebUtils';

import WebColor from './WebColorConfig';

const { bgColorActive, bgOptionTrue, bgOptionFalse, bgOptionActive,
  bgViewTrue, bgViewFalse, textReviewColor, borderButton,
  bgButtonColor, textVideoColor, borderColor } = WebColor;

/**
 * 
 * exam result detail tabs 
 */
const renderHtmlResuls = (dataList, subjectId, contentHtml) => {
  const totalAll = Object.keys(!!dataList && dataList).length;
  let html = ``;
  html += `
  <!DOCTYPE html>
  <html>
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
    ${getHeaderStyle()}
    <link rel="stylesheet" href="font47/css/font-awesome.min.css" />
    <script type="text/javascript" src="fastclick_min.js"></script>
    ${getMathJaxScript(subjectId)}
    <script> 
      window.addEventListener('message', function(e) {
        var res = e.data.split("---");
        var val = res[0];
      });
      function myCallVideo(flashcardId, flashcardIdVideo){
        window.ReactNativeWebView.postMessage("videoExamSla---"+flashcardId+"---"+flashcardVideo);
      }
    </script> 
    <script>
      window.addEventListener('load', function() {
        var arrayWarn = [];
        var arrayReview = [];
        for(var i = 0; i < ${totalAll}; i++){
          arrayWarn[i] = document.getElementById('arrayWarn'+i);
          arrayReview[i] =  document.getElementById('arrayReview'+i);
          FastClick.attach(arrayWarn[i]);
          if(arrayReview[i]){
            FastClick.attach(arrayReview[i]);
          }
        }
        arrayWarn.forEach(function (item, i) {
          if(arrayWarn[i]){
            arrayWarn[i].addEventListener('click', function(event) {
              var numberQuestion = this.getAttribute('data-numberQuestion');
              window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
            });
          }
        });
        arrayReview.forEach(function (item, i) {
          if( arrayReview[i]){
            arrayReview[i].addEventListener('click', function(event) {
              var flashcardId = this.getAttribute('data-flashcardId');
              var questionTestIdNext = this.getAttribute('data-questionTestIdNext');
              window.ReactNativeWebView.postMessage("reviewSlaWeb---"+flashcardId+"---"+questionTestIdNext);
            });
          }
        });
      });
    </script>
  </head>
  <body style="margin:0;padding:15px 0px 0px 0px; font-family: Arial, sans-serif !important;">`;
  let padding = !isSubjectMathJax(subjectId) ? '21px' : '14px';
  if (dataList != '' && dataList != null) {
    const total = Object.keys(!!dataList && dataList).length;
    for (i = 0; i < total; i++) {
      let displayFlash = dataList[i].flashcardId != '' ? 'display:inline-block' : 'display:none';
      let displayFlashVideo = dataList[i].flashcardIdVideo != '' ? 'display:inline-block' : 'display:none';
      let rightAnswer = '<i class="fa fa-question" style="color:#f1c05b;font-size: 14px;margin: auto"></i>';
      if (dataList[i].rightAnswer) {
        rightAnswer = '<i class="fa fa-check" style="color:#4CAF79;font-size: 14px;margin: auto"></i>';
      } else if (dataList[i].rightAnswer === false) {
        rightAnswer = '<i class="fa fa-close" style="color:#D9534F;font-size: 14px;margin: auto"></i>';
      }

      html += `<div style="padding:10px" id="scrollview${i}">
                ${rightAnswer}
                <span style="font-weight: bold;font-size: 14px;color: #9B9B9B">Câu ${dataList[i].index + 1}</span>
                <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">|</span>
                <span style="color:#9B9B9B;font-size: 14px">#${dataList[i].numberQuestion}</span>
                <span style="float: right" id="arrayWarn${i}" data-numberQuestion="${dataList[i].numberQuestion}">
                    <span style="padding-right: 5px">
                        <i class="fa fa-warning" style="color:#9B9B9B;font-size: 14px;"></i>
                        <span style="color:#9B9B9B;font-size: 14px">Báo lỗi</span>
                    </span>
                </span>
            </div>`;
      if (contentHtml != '' && contentHtml != null) {
        html += `<div style="overflow:auto;padding: 10px 15px;border-bottom: 1px solid #eaeaea;font-weight:bold;" class="q_material">
          ${contentHtml}
        </div>`;
      }

      html += `<div style="overflow:auto;padding:10px 15px;margin-bottom:10px;font-weight:bold;color:#232729">
        ${dataList[i].contentQuestion}
      </div>`;

      let options = dataList[i].options;
      let count = Object.keys(!!options && options).length;
      for (j = 0; j < count; j++) {
        let idOption = options[j].idOption;
        let userSelected = options[j].userSelected;
        let bgAnswer = '#000';
        let bgContent = '#fff';
        if (userSelected) {
          bgAnswer = '#D9534F';
          bgContent = '#fef4f4';
          // borderContent = '#f86c6b';
        }
        const answerOptionId = dataList[i].answerOptionId;
        if (answerOptionId != '' && answerOptionId != null) {
          let answerLength = Object.keys(!!answerOptionId && answerOptionId).length;
          if (answerLength > 0 && answerOptionId.indexOf(idOption) > -1) {
            bgAnswer = '#4CAF79';
            bgContent = '#eff9e8';
            // borderContent = '#5cb85c';
          }
        }

        html += `<div style="padding:${padding} 0; min-height:40px;border-top:1px solid #eaeaea;background:${bgContent}; overflow: hidden; display: flex; align-items: center;">
        <span style="width:14% !important;text-align:center !important;display:inline-block !important;float: left !important;">
        <span style="color: #fff;padding: 4px 8px;background: ${bgAnswer};border-radius: 100px;font-size:12px;">${getAnswerName(j)}</span>
        </span>
        <span class="opcontent" style="width:86% !important;display:inline-block !important;float: left !important;overflow: auto;">${options[j].content}</span>
        </div>
        `;
      }

      if (dataList[i].rightAnswer != '' && dataList[i].rightAnswer != null) {
        html += `<div id="answer" style="display:block;padding:10px 15px;background:#fff">
            <p style="color: #4CAF79;font-size:15px">
                <b>Giải đáp</b>
            </p>
            <div style="overflow:auto">
            ${dataList[i].explainQuestion}
            </div>
            <div style="text-align:center;margin-bottom:20px;margin-top:20px;">
                <span id="arrayReview${i}" style="${displayFlash};margin-right: 10px;padding: 7px 12px;font-size:14px; background: ${bgButtonColor}; border-radius: 20px;color: ${textReviewColor}; border: solid 1px ${borderButton};font-weight:bold;font-size:12px;"
                  data-flashcardId = "${dataList[i].flashcardId}" data-questionTestIdNext="${dataList[i].questionTestIdNext}"
                >
                <i class="fa fa-refresh" style="color:${textReviewColor}"></i> Xem lại khái niệm
                </span>
                <span id="revideo" style="${displayFlashVideo};margin-right: 10px;padding: 7px 12px;font-size:14px;background: ${bgButtonColor};border-radius: 20px;color: ${textVideoColor};border: solid 1px ${borderButton};font-weight:bold;font-size:12px;"
                   onclick="myCallVideo('${dataList[i].flashcardId}',${dataList[i].flashcardIdVideo}')">
                  <i class="fa fa-play" style="color:${textVideoColor}"></i> Xem bài giảng
                </span>
            </div>
        </div>`;
      }
      html += '<div style="height:10px;background:#eaeaea;opacity:0.7"></div>';
    }
  }
  html += `</body>
         </html>`;
  return html;
}



const renderTestSlaMath = (data, subjectId, numberQuestion, contentHtml) => {
  var totalCountOption = Object.keys(!!data.options && data.options).length;
  let html = ``;
  html += `
  <!DOCTYPE html>
  <html>
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    ${getHeaderStyle()}
    <link rel="stylesheet" href="font47/css/font-awesome.min.css" >
    ${getMathJaxScript(subjectId)}
    <script type="text/javascript" src="fastclick_min.js"></script>
    ${getMessageEventExam(totalCountOption)}
    <script type="text/javascript">
      function auto_grow(element) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight)+"px";
      }
      function onchangeText(e){
        auto_grow(e);
        window.ReactNativeWebView.postMessage("changeText---"+e.value);
      }
    </script>
    ${loadEventNative(totalCountOption, data.typeAnswer, bgColorActive)}
  </head>
  <body style="margin:0;padding:15px 0;font-family: Arial, sans-serif !important;">`;
  let padding = !isSubjectMathJax(subjectId) ? '21px' : '14px';

  let reviewColor = '#9B9B9B';
  if (data.status == 2 || data.status == 4) {
    reviewColor = '#F9AB3B';
  }

  html += ` <div style="padding:10px 15px">
        <span style="font-weight: bold;font-size: 14px;color: #9B9B9B">Câu ${1 + data.index}</span>
        <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">|</span>
        <span style="color:#9B9B9B;font-size: 14px">#${data.numberQuestion}</span>
        <span style="float: right">
          <span style="padding-right: 5px" id="warning" data-numberQuestion="${data.numberQuestion}">
            <i class="fa fa-warning" style="color:#9B9B9B;font-size: 14px;"></i>
            <span style="color:#9B9B9B;font-size: 14px">Báo lỗi</span>
          </span>
          <span style="color:#9B9B9B;font-size: 14px;">|</span>
          <span style="padding: 0 10px;" id="reviewSla" data-questionIdStudentTest="${data.questionIdStudentTest}" data-status="${data.status}">
            <i class="fa fa-star" id="starId" style="color:${reviewColor};font-size: 14px"></i>
          </span>
        </span>
      </div>`;

  if (contentHtml != '' && contentHtml != undefined) {
    html += `<div style="overflow:auto;padding: 10px 15px;border-bottom: 1px solid #eaeaea" class="q_material">
      ${contentHtml}
    </div>`
  }

  html += `<div style="overflow:auto;padding-left:15px;margin-bottom:10px;font-weight:bold;color:#232729">${data.contentQuestion}</div>`;

  if (data.typeAnswer == 2 || data.typeAnswer == 3) {
    html += ` <textarea id="input1" onkeyup="onchangeText(this)" placeholder="Nhập câu trả lời" type="text" name="in" style="width:96%;min-height:80px;max-height:140px;padding:5px;margin:15px 0" value="";></textarea>`;
  }

  if (data.typeAnswer == 0 || data.typeAnswer == 1) {
    let options = data.options;
    let count = Object.keys(!!options && options).length;
    for (let i = 0; i < count; i++) {
      let idOption = options[i].idOption;
      let bgAnswer = '#000';
      let bgContent = '#fff';
      let opacity = 1;

      if (options[i].userSelected) {
        bgAnswer = bgOptionActive;
        bgContent = bgColorActive;
        // borderContent = '#f86c6b';
        opacity = 0.6;
      }

      html += `<div id="viewOptions${idOption}" data-key="${idOption}" data-userSelected="${options[i].userSelected}" 
      style="opacity:${opacity};padding:${padding} 0; min-height:40px;border-top:1px solid #eaeaea;background:${bgContent}; overflow: hidden; display: flex; align-items: center;z-index:0">
      <span style="width:14% !important;text-align:center !important;display:inline-block !important;float: left !important;">
      <span id="options${idOption}" style="color: #fff;padding: 4px 8px;background: ${bgAnswer};border-radius: 100px;font-size:12px;">${getAnswerName(i)}</span>
      </span>
      <span class="opcontent" style="width:86% !important;display:inline-block !important;float: left !important;overflow: auto;">${options[i].content}</span>
      </div>
      `;
    }
  }

  html += `
  <div id="containerMain" style="position:absolute;top:0;bottom:0;right:0;left:0;background:#fff">
  </div>`;
  html += `</body>
         </html>`;
  return html;
}


module.exports = {
  renderHtmlResuls,
  renderTestSlaMath
};
