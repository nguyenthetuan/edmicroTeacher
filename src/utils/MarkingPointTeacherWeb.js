import {
  getMathJaxScript
} from './WebUtils';
import _ from 'lodash';
// assignmentType
// 0 dạng có ghi âm mp3
// 1 dạng chữ thuần
const optionQuestion = ['A', 'B', 'C', 'D', 'E']
const renderOptionsAnswers = (data, index, rightAnswer) => {
  let html = `<div>`;
  for (let i = 0; i < data.length; i++) {
    let id = ''; if (data[i].userSelected) id = rightAnswer ? 'correct' : 'wrong';
    html += ` <div id='optionQuestion-${id}'>
    <div id='answerQuestion${id}'>
      <span style="color:#ffffff; font-family: Nunito-Bold; margin-left: 5px; ">${optionQuestion[i]}</span>
    </div>
    <div style="display:inline-block; margin-left: 20px">
      ${data[i].content}
    </div>`
    if (data[i].userSelected) {
      html += `<p>Đáp án của học sinh</p>`
    }
    html += `</div>`
  }
  html += '</div>';
  return html;
}

const renderListQuestionAndAnswersMaterial = (data, assignmentType) => {
  let totalAll = data.length;
  let html = ``;
  html += `
<!DOCTYPE html>
<html style="overflow-x:hidden">
 <head>
  <title></title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    p img {
      float: inherit !important;
      display: block;
      max-width: 100%;
      margin: 0 auto 4px auto !important;
    }

    :focus {
      outline: 0px;
    }

    .q_material span {
      font-size: 14px !important;
    }

    .opcontent p span {
      font-size: 14px !important;
    }

    body {
      scroll-behavior: smooth;
    }

    #answerdot1 p:last-child {
      max-width: 100%;
      display: inline-block;
      overflow: hidden;
    }

    .content-img img {
      max-width: 100% !important;
    }

    .reason-img img {
      max-width: 100% !important;
    }

    #optionQuestion- {
      width: 100%;
      padding: 10px;
    }

    #optionQuestion-wrong {
      background-color: #fef4f4;
      border-left: 2px solid #dc3545;
      padding: 10px;
    }

    #optionQuestion-correct {
      background-color: #eff9e8;
      border-left: 2px solid #28a745;
      padding: 10px;
    }

    #answerQuestion {
      width: 20px;
      height: 20px;
      border-radius: 15px;
      background-color: black;
      display: inline-block;
    }

    #answerQuestioncorrect {
      width: 20px;
      height: 20px;
      border-radius: 15px;
      background-color: green;
      display: inline-block;
    }

    #answerQuestionwrong {
      width: 20px;
      height: 20px;
      border-radius: 15px;
      background-color: red;
      display: inline-block;
    }
  </style>
  <link rel="stylesheet" href="font47/css/font-awesome.min.css">

<body
  style="margin:0;font-family: Arial, sans-serif !important;font-size:14px !important; overflow-x:hidden;scroll-behavior: smooth; ">
  `;

  for (let i = 0; i < totalAll; i++) {
    html += ` <div id="section${i}"
    style="border-top: 1px solid #b1acac; margin-bottom: 25px; padding-bottom: 10px">
    <p style="color: #000000; font-size: 14px; line-height: 10px; margin-left: 10px; font-family: Nunito-Bold;">Câu ${i
      + 1}</p>
    <div
      style="background-color: #F8F8F8; border: 0.5px solid #2D9CDB; margin-left: 10px; margin-right: 10px;  border-top-left-radius: 5px;border-top-right-radius: 5px; ">
      <div
        style="background-color: #2D9CDB; border-top-left-radius: 5px;border-top-right-radius: 5px; height: 20px; padding-left: 10px">
        <p
          style="font-family: Nunito;font-style: normal;font-weight: normal;font-size: 12px;line-height: 16px;color: #FFFFFF; margin-block-start: auto">
          Đề bài</p>
      </div>
      <div style="padding: 10px">
        ${data[i].dataMaterial && data[i].dataMaterial.contentHtml || ''}
        <div id="answerdot${assignmentType}">
          ${data[i].dataMaterial && data[i].dataMaterial.data[0].content || data[i].dataStandard.content}
        </div>
        `
    if (data[i].dataMaterial && data[i].dataMaterial.urlMedia) {
      html += `<audio controls>
          <source src="${data[i].dataMaterial.urlMedia}">
        </audio>`
    }
    html += `
      </div>
    </div>`
    
    if (data[i].dataMaterial && data[i].dataMaterial.data[0].reasonImage) {
      html += `<div
      style="background-color: #F8F8F8; border: 0.5px solid #56BB73; margin-left: 10px; margin-right: 10px; margin-top: 10px; border-top-left-radius: 5px;border-top-right-radius: 5px;">
      <div
        style="background-color: #56BB73; border-top-left-radius: 5px;border-top-right-radius: 5px;  height: 20px; padding-left: 10px">
        <p
          style="font-family: Nunito;font-style: normal;font-weight: normal;font-size: 12px;line-height: 16px;color: #FFFFFF; margin-block-start: auto">
          Ảnh giải thích của học sinh</p>
      </div>
      <div id="reason-img">
        <img style="max-width: 100%" src="${data[i].dataMaterial.data[0].reasonImage}" />
      </div>
    </div>`
    }

    html += `<div
      style="background-color: #F8F8F8; border: 0.5px solid #56BB73; margin-left: 10px; margin-right: 10px; margin-top: 10px; border-top-left-radius: 5px;border-top-right-radius: 5px;">
      <div
        style="background-color: #56BB73; border-top-left-radius: 5px;border-top-right-radius: 5px;  height: 20px; padding-left: 10px">
        <p
          style="font-family: Nunito;font-style: normal;font-weight: normal;font-size: 12px;line-height: 16px;color: #FFFFFF; margin-block-start: auto">
          Bài làm của học sinh</p>
      </div>`
    if (data[i].dataMaterial && !data[i].dataMaterial.data[0].options || data[i].dataMaterial && !data[i].dataMaterial.data[0].options.length) {
      html += `<div style="padding: 10px">
        <p style="margin-bottom: 20px">${!!data[i].dataMaterial.data[0].userOptionText ? data[i].dataMaterial.data[0].userOptionText : ' <p style="color:blue;">Không có câu trả lời</p>'}</p><br />
      </div>`
    }else{
      if (!_.isEmpty(data[i].dataStandard?.userOptionText)) {
        html += `<div style="padding: 10px">
          <p style="margin-bottom: 20px">${!_.isEmpty(data[i].dataStandard?.userOptionText)?data[i].dataStandard?.userOptionText : ' <p style="color:blue;">Không có câu trả lời</p>'}</p><br />
        </div>`
      }
    }
    html += `<div>`

    if (data[i].dataMaterial) {
      if (data[i].dataMaterial.data[0].options && data[i].dataMaterial.data[0].options.length > 0) {
        html += `${renderOptionsAnswers(data[i].dataMaterial && data[i].dataMaterial.data[0].options, i, data[i].dataMaterial.data[0].rightAnswer)}`
      }
    }
    else {
      if (data[i].dataStandard) {
        html += `${renderOptionsAnswers(data[i].dataStandard.options, i,
          data[i].dataStandard && data[i].dataStandard.rightAnswer)}`
      }
    }

    html += `</div>
      <!-- Giải thích -->
    </div>
    <div
      style="background-color: #F8F8F8; border: 1px solid #ffa449; margin-left: 10px; margin-right: 10px; margin-top: 10px; border-top-left-radius: 5px;border-top-right-radius: 5px;">
      <div
        style="background-color: #ffa449; border-top-left-radius: 5px;border-top-right-radius: 5px;  height: 20px; padding-left: 10px">
        <p
          style="font-family: Nunito;font-style: normal;font-weight: normal;font-size: 12px;line-height: 16px;color: black; margin-block-start: auto">
          Giải thích</p>
      </div>
      <div style="padding: 10px">
        <p style="margin-bottom: 20px">${data[i].dataMaterial && data[i].dataMaterial.data[0].explain || data[i].dataStandard && data[i].dataStandard.explain}</p><br />
      </div>
    </div>
    </div>
    `
  }

  html += `
  ${getMathJaxScript('TOAN')}`;

  html += `
    <script>
      // from react native to webview
      window.addEventListener('message', function (e) {
        var data = e.data.split("---");
        var type = data[0];
        if (type == "buttonQuestion") {
          var index = JSON.parse(data[1]);
          var section = document.getElementById('section' + index);
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
          });
        }
      });
    </script>
</body>

</html>`;

  return html;
}

module.exports = {
  renderListQuestionAndAnswersMaterial,
};

// const fnc = (data) => {
// const length = data.length;
// let result;
// for (let i = 0; i < length; i++) { // } // }