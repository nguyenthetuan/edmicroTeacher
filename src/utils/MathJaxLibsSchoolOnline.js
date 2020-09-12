
import {
  isSubjectMathJax, getAnswerName, getMathJaxScript
} from './WebUtils';

import WebColor from './WebColorConfig';

const { bgColorActive, bgOptionTrue, bgOptionFalse, bgOptionActive,
  bgViewTrue, bgViewFalse, textReviewColor, borderButton,
  bgButtonColor, textVideoColor, borderColor } = WebColor;

const renderHtmlTestDetail = (data, subjectId) => {
  let padding = '14px';
  if (!isSubjectMathJax(subjectId)) {
    padding = '21px';
  }
  let totalAll = Object.keys(!!data && data).length;
  let html = ``;
  html += `
    <!DOCTYPE html>
    <html>
    <head>
      <title></title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <style>
        p img {
          float: inherit !important;display:block; max-width: 100%; margin: 0 auto 4px auto !important;
        }
        :focus{
          outline:0px;
        }
        .q_material span{
          font-size:14px !important;
        }
        .opcontent p span{
          font-size:14px !important;
        }
      </style>
      <link rel="stylesheet" href="font47/css/font-awesome.min.css">`;
  html += getMathJaxScript(subjectId);
  html += `
      <script>
        function myReviewActionresult(flashcardId, stepId){
          window.ReactNativeWebView.postMessage("reviewResult---"+flashcardId+"---"+stepId);
        }
        function myWarningFunction(numberQuestion){
          window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
        }
      </script>
    </head>
    <body style="margin:0;padding:15px 0;font-family: Arial, sans-serif !important;font-size:14px !important;">`;


  for (let i = 0; i < totalAll; i++) {
    let typeData = data[i].typeData;
    if (typeData == 1) {
      //contentHtml
      html += `<div style="overflow:auto;padding: 10px 15px;border-bottom: 1px solid #eaeaea" class="q_material">
                ${data[i].dataMaterial.payload || data[i].dataMaterial.contentHtml}
               </div>`;
      let totalMaterial = Object.keys(!!data[i].dataMaterial.data && data[i].dataMaterial.data).length;
      for (let k = 0; k < totalMaterial; k++) {
        let dataMaterial = data[i].dataMaterial.data[k];
        if (!!dataMaterial) {

          let displayFlash = 'display: inline-block';
          if (dataMaterial.flashcardId == null || dataMaterial.flashcardId == 'null' || dataMaterial.flashcardId == '') {
            displayFlash = 'display: none';
          }

          let rightAnswer = '<i class="fa fa-question" style="color:#f1c05b;font-size: 14px;margin: auto"></i>';
          if (dataMaterial.rightAnswer) {
            rightAnswer = '<i class="fa fa-check" style="color:#4CAF79;font-size: 14px;margin: auto"></i>';
          } else if (Object.keys(!!dataMaterial.userOptionId && dataMaterial.userOptionId).length > 0 || dataMaterial.userTextAnswer != null) {
            rightAnswer = '<i class="fa fa-close" style="color:#D9534F;font-size: 14px;margin: auto"></i>';
          }

          html += `<div style="padding:10px 15px">
                <span style="font-weight: bold;font-size: 14px;color: #9B9B9B">Câu ${dataMaterial.stepIndex + 1}</span>
                ${rightAnswer}
                <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">|</span>
                <span style="color:#9B9B9B;font-size: 14px">#${dataMaterial.numberQuestion}</span>
                <span style="float: right">
                    <span style="padding-right: 5px" onclick="myWarningFunction('${dataMaterial.numberQuestion}')">
                        <i class="fa fa-warning" style="color:#9B9B9B;font-size: 14px;"></i>
                        <span style="color:#9B9B9B;font-size: 14px">Báo lỗi</span>
                    </span>
                </span>
              </div>`;

          html += `
              <div style="overflow:auto;padding:10px 15px;margin-bottom:10px;font-weight:bold;color:#232729">
                ${dataMaterial.content}
              </div>`;

          if (dataMaterial.typeAnswer <= 1) {
            let countOption = Object.keys(!!dataMaterial.options && dataMaterial.options).length;
            for (let j = 0; j < countOption; j++) {
              let idOption = dataMaterial.options[j].idOption;
              const bg = '#fff';
              let bgAnswer = '#000';
              let bgContent = '#fff';
              let borderContent = 'rgba(20,32,49,0.05)';
              const userSelected = dataMaterial.options[j].userSelected;
              if (userSelected) {
                bgAnswer = '#D9534F';
                bgContent = '#fef4f4';
              }
              if (dataMaterial.answerOptionId.indexOf(idOption) > -1) {
                bgAnswer = '#4CAF79';
                bgContent = '#eff9e8';
              }
              html += `<div style="padding:${padding} 0; min-height:40px; border-radius: 4px;border-top:1px solid ${borderContent};background:${bgContent}; overflow: hidden; display: flex; align-items: center;">
                      <span style="width:14% !important;text-align:center !important;display:inline-block !important;float: left !important;">
                      <span  style="color: #fff;padding: 4px 8px;background: ${bgAnswer};border-radius: 100px;font-size:12px;">${getAnswerName(j)}</span>
                      </span>
                      <span class="opcontent" style="width:86% !important;display:inline-block !important;float: left !important;overflow: auto;">${dataMaterial.options[j].content}</span>
                      </div>
                      `;
            }
          }

          let typeAnswer = dataMaterial.typeAnswer;
          if (typeAnswer > 2) {
            html += `<div style="margin-left:15px;margin-right:15px;">
                <textarea placeholder="Nhập câu trả lời" disabled type="text" name="in" style="width:96%;min-height:80px;max-height:140px;padding:5px;margin:15px 0" value="";> ${dataMaterial.userTextAnswer || ''}</textarea>
                </div>`;
          }

          if (Object.keys(!!dataMaterial.userOptionId && dataMaterial.userOptionId).length > 0 || dataMaterial.userTextAnswer != null) {
            html += `
                  <div id="answer" style="display:block;margin:0 15px;">
                    <p style="color: #4CAF79;font-size:15px">
                        <b>Giải đáp</b>
                    </p>
                    <div style="overflow:auto">
                      ${dataMaterial.explain || ''}
                    </div>
                    <div style="text-align:center;margin-bottom:20px;margin-top:20px;">
                        <span id="review" style="${displayFlash};margin-right: 10px;padding: 7px 12px;font-size:14px; background: #fff; border-radius: 20px;color: ${textReviewColor}; border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
                        onclick="myReviewActionresult('${dataMaterial.flashcardId}','${dataMaterial.stepId}')">
                        <i class="fa fa-refresh" style="color:${textReviewColor}"></i> Xem lại khái niệm
                        </span>
                        <span id="revideo" style="display:none;margin-right: 10px;padding: 7px 12px;font-size:14px;background: #fff;border-radius: 20px;color: ${textVideoColor};border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
                            onclick="null">
                            <i class="fa fa-play" style="color:${textVideoColor}"></i> Xem bài giảng
                        </span>
                    </div>
                </div>`;
          }

          html += '<div style="height:10px;background:#eaeaea;opacity:0.7"></div>';
        }
      }
    } else {
      let dataStandard = data[i].dataStandard;
      if (!!dataStandard) {

        let displayFlash = 'display: inline-block';
        if (dataStandard.flashcardId == null || dataStandard.flashcardId == 'null' || dataStandard.flashcardId == '') {
          displayFlash = 'display: none';
        }



        let rightAnswer2 = '<i class="fa fa-question" style="color:#f1c05b;font-size: 14px;margin: auto"></i>';

        if (dataStandard.rightAnswer) {
          rightAnswer2 = '<i class="fa fa-check" style="color:#4CAF79;font-size: 14px;margin: auto"></i>';
        } else if (Object.keys(!!dataStandard.userOptionId && dataStandard.userOptionId).length > 0 || dataStandard.userTextAnswer != null) {
          rightAnswer2 = '<i class="fa fa-close" style="color:#D9534F;font-size: 14px;margin: auto"></i>';
        }

        html += `<div style="padding:10px 15px">
          <span style="font-weight: bold;font-size: 14px;color: #9B9B9B">Câu ${dataStandard.stepIndex + 1}</span>
          ${rightAnswer2}
          <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">|</span>
          <span style="color:#9B9B9B;font-size: 14px">#${dataStandard.numberQuestion}</span>
          <span style="float: right" id="arrayWarn${dataStandard.stepIndex}" data-numberQuestion="${dataStandard.numberQuestion}">
              <span style="padding-right: 5px" onclick="myWarningFunction('${dataStandard.numberQuestion}')">
                  <i class="fa fa-warning" style="color:#9B9B9B;font-size: 14px;"></i>
                  <span style="color:#9B9B9B;font-size: 14px">Báo lỗi</span>
              </span>
          </span>
          </div>`;

        html += `
          <div style="overflow:auto;padding:10px 15px;margin-bottom:10px;font-weight:bold;color:#232729">
            ${dataStandard.content}
          </div>`;

        let typeAnswer = dataStandard.typeAnswer;
        if (typeAnswer > 2) {
          html += `<div style="margin-left:15px;margin-right:15px;">
            <textarea placeholder="Nhập câu trả lời" disabled type="text" name="in" style="width:96%;min-height:80px;max-height:140px;padding:5px;margin:15px 0" value="";> ${dataStandard.userTextAnswer || ''}</textarea>
            </div>`;
        }

        if (dataStandard.typeAnswer <= 1) {
          let countOption = Object.keys(!!dataStandard.options && dataStandard.options).length;
          for (let j = 0; j < countOption; j++) {
            let idOption = dataStandard.options[j].idOption;
            const bg = '#fff';
            let bgAnswer = '#000';
            let bgContent = '#fff';
            let borderContent = 'rgba(20,32,49,0.05)';
            const userSelected = dataStandard.options[j].userSelected;
            if (userSelected) {
              bgAnswer = '#D9534F';
              bgContent = '#fef4f4';
            }
            if (dataStandard.answerOptionId.indexOf(idOption) > -1) {
              bgAnswer = '#4CAF79';
              bgContent = '#eff9e8';
            }
            html += `<div style="padding:${padding} 0; min-height:40px; border-radius: 4px;border-top:1px solid ${borderContent};background:${bgContent}; overflow: hidden; display: flex; align-items: center;">
                <span style="width:14% !important;text-align:center !important;display:inline-block !important;float: left !important;">
                <span  style="color: #fff;padding: 4px 8px;background: ${bgAnswer};border-radius: 100px;font-size:12px;">${getAnswerName(j)}</span>
                </span>
                <span class="opcontent" style="width:86% !important;display:inline-block !important;float: left !important;overflow: auto;">${dataStandard.options[j].content}</span>
                </div>
                `;
          }
        } else {

        }
        if (Object.keys(!!dataStandard.userOptionId && dataStandard.userOptionId).length > 0 || dataStandard.userTextAnswer != null) {
          html += `
            <div id="answer" style="display:block;margin:0 15px;">
              <p style="color: #4CAF79;font-size:15px">
                  <b>Giải đáp</b>
              </p>
              <div style="overflow:auto">
                 ${dataStandard.explain || ''}
              </div>
              <div style="text-align:center;margin-bottom:20px;margin-top:20px;">
                  <span id="review" style="${displayFlash};margin-right: 10px;padding: 7px 12px;font-size:14px; background: #fff; border-radius: 20px;color: ${textReviewColor}; border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
                      onclick="myReviewActionresult('${dataStandard.flashcardId}','${dataStandard.stepId}')">
                      <i class="fa fa-refresh" style="color:${textReviewColor}"></i> Xem lại khái niệm
                  </span>
                  <span id="revideo" style="display:none;margin-right: 10px;padding: 7px 12px;font-size:14px;background: #fff;border-radius: 20px;color: ${textVideoColor};border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
                      onclick="null">
                      <i class="fa fa-play" style="color:${textVideoColor}"></i> Xem bài giảng
                  </span>
              </div>
           </div>`;
        }

        html += '<div style="height:10px;background:#eaeaea;opacity:0.7"></div>';
      }
    }
  }

  html += `</body>
              <script>
                function contains(selector, text) {
                  var elements = document.querySelectorAll(selector);
                  return Array.prototype.filter.call(elements, function(element){
                    return RegExp(text).test(element.textContent);
                  });
                }
                ${Platform.OS === 'ios' ? `window.addEventListener('message', function (e) {
                    function contains(selector, text) {
                      var elements = document.querySelectorAll(selector);
                      return Array.prototype.filter.call(elements, function (element) {
                        return RegExp(text).test(element.textContent);
                      });
                    }

                    var res = e.data.split("---");
                    var type = res[0];
                    if (type == 'scrollTo') {
                      contains("span", res[1])[0].scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  });`: `document.addEventListener('message', function (e) {
                  function contains(selector, text) {
                    var elements = document.querySelectorAll(selector);
                    return Array.prototype.filter.call(elements, function (element) {
                      return RegExp(text).test(element.textContent);
                    });
                  }

                  var res = e.data.split("---");
                  var type = res[0];
                  if (type == 'scrollTo') {
                    contains("span", res[1])[0].scrollIntoView({
                      behavior: 'smooth'
                    });
                  }
                });`
    }
              </script >
           </html > `;
  // console.log("renderHtmlTestDetail -> html", html)
  return html;
}


module.exports = {
  renderHtmlTestDetail,
};
