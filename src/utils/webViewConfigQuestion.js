import {isSubjectMathJax, getAnswerName, getMathJaxScript} from './WebUtils';
import {roundToTwo} from './Common';
import WebColor from './WebColorConfig';

const {
  bgColorActive,
  bgOptionTrue,
  bgOptionFalse,
  bgOptionActive,
  bgViewTrue,
  bgViewFalse,
  textReviewColor,
  borderButton,
  bgButtonColor,
  textVideoColor,
  borderColor,
} = WebColor;

const renderHtmlQuestionDetail = (
  data,
  subjectId,
  arrayQuestion,
  totalPoint,
) => {
  let htmtemp = '';
  for (let i = 0; i < data.length; i++) {
    htmtemp += `
    document.getElementById('checkBox${data[i].questionId}').style.display = "block";\n
    `;
  }

  let hidetmp = '';
  let htmlPoint = '<script> window.onload = () => {';
  for (let i = 0; i < data.length; i++) {
    hidetmp += `
    document.getElementById('checkBox${data[i].questionId}').style.display = "none";\n
    `;
    htmlPoint += `

    document.getElementById('point${data[i].questionId}').value = ${data[i].point};
    
    document.getElementById('point${data[i].questionId}').onblur = () => {
      const questionId = '${data[i].questionId}';
      const value = document.getElementById('point' + questionId).value;
      window.ReactNativeWebView.postMessage("enterPoint---"+questionId+"---"+value);
    }
    `;
  }
  htmlPoint += '} </script>';
  let padding = '14px';
  if (!isSubjectMathJax(subjectId)) {
    padding = '21px';
  }
  let totalAll = Object.keys(data).length;
  let html = ``;
  html += `
  <!DOCTYPE html>
  <html>
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
    <meta name='apple-mobile-web-app-capable' content='yes' />
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
  html += htmlPoint;
  html += `
    <script>
    function matariaDetail (matariaID){
      window.ReactNativeWebView.postMessage("matariaDetail---"+matariaID);
    }
      function myReviewActionresult(questionId, stepId){
        window.ReactNativeWebView.postMessage("reviewResult---"+questionId+"---"+stepId);
      }
      function myWarningFunction(numberQuestion){
        window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
      }
      function checkBox(numberQuestion){
        document.getElementById('checkBox').style.display = 'none'
      }
      function addQuestion(numberQuestion){
        if(document.getElementById("checkBox"+numberQuestion).style.display == "none"){
          document.getElementById("checkBox"+numberQuestion).style.display = "block";
          window.ReactNativeWebView.postMessage("pushArray---"+numberQuestion);
        } else{
          document.getElementById("checkBox"+numberQuestion).style.display = "none";
          window.ReactNativeWebView.postMessage("popArray---"+numberQuestion);
        }
      }
      <!-- ios -->
      window.addEventListener('message',(e)=>{
       
        if(e.data == 'tickAll'){
            ${htmtemp}
        } 
        if(e.data == 'hideAll'){
            ${hidetmp}
        }
        var dataMessage = e.data.split('---');
        if(dataMessage[0] == 'resetPoint'){
          document.getElementById('point'+dataMessage[1]).value = dataMessage[2];
        }
      })
      <!-- android -->

      document.addEventListener('message',(e)=>{
       
        if(e.data == 'tickAll'){
            ${htmtemp}
        } 
        if(e.data == 'hideAll'){
            ${hidetmp}
        }
        var dataMessage = e.data.split('---');
        if(dataMessage[0] == 'resetPoint'){
          document.getElementById('point'+dataMessage[1]).value = dataMessage[2];
        }
      })
      
    </script>
  </head>
  <body style="margin:0;padding:15px 0;font-family: Arial, sans-serif !important;font-size:14px !important;">`;

  for (let i = 0; i < totalAll; i++) {
    let typeData = data[i].typeViewContent;
    console.log("🚀 ~ file: webViewConfigQuestion.js ~ line 141 ~ typeData", typeData)
    if (typeData == 1) {
      //contentHtml
      html += `<div style="overflow:auto;padding: 10px 15px;border-bottom: 1px solid #eaeaea" class="q_material">
              ${data[i].contentHtml}
             </div>`;
      let totalMaterial = Object.keys(data[i]).length;
      for (let k = 0; k < totalMaterial; k++) {
        let dataMaterial = data[i];
        let displayFlash = 'display: inline-block';
        if (
          dataMaterial.questionId == null ||
          dataMaterial.questionId == 'null' ||
          dataMaterial.questionId == ''
        ) {
          displayFlash = 'display: none';
        }

        let rightAnswer =
          '<i class="fa fa-question" style="color:#f1c05b;font-size: 14px;margin: auto"></i>';
        if (dataMaterial.rightAnswer) {
          rightAnswer =
            '<i class="fa fa-check" style="color:#4CAF79;font-size: 14px;margin: auto"></i>';
        } else if (
          Object.keys(dataMaterial.userOptionId).length > 0 ||
          dataMaterial.userTextAnswer != null
        ) {
          rightAnswer =
            '<i class="fa fa-close" style="color:#D9534F;font-size: 14px;margin: auto"></i>';
        }

        html += `<div style="padding:10px 15px">
            // <span style="font-weight: bold;font-size: 14px;color: #9B9B9B">Câu ${
              i + 1
            }</span>
            ${rightAnswer}
            <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">|</span>
            <span style="color:#9B9B9B;font-size: 14px">#${
              dataMaterial.numberQuestion
            }</span>
            <span style="float: right">
                <span style="padding-right: 5px" onclick="myWarningFunction('${
                  dataMaterial.numberQuestion
                }')">
                    <i class="fa fa-warning" style="color:#9B9B9B;font-size: 14px;"></i>
                    <span style="color:#9B9B9B;font-size: 14px">Báo lỗi</span>
                </span>
            </span>
          </div>`;

        html += `
          <div style="overflow:auto;padding:10px 15px;margin-bottom:10px;font-weight:bold;color:#232729">
            ${dataMaterial.question}
          </div>`;
        let typeAnswer = dataMaterial.typeAnswer;
        if (typeAnswer > 2) {
          html += `<div style="margin-left:15px;margin-right:15px;">
            <textarea placeholder="Nhập câu trả lời" disabled type="text" name="in" style="width:96%;min-height:80px;max-height:140px;padding:5px;margin:15px 0" value="";> ${
              dataMaterial.userTextAnswer || ''
            }</textarea>
            </div>`;
        }

        if (
          Object.keys(dataMaterial).length > 0 ||
          dataMaterial.userTextAnswer != null
        ) {
          html += `
              <div id="answer" style="display:block;margin:0 15px;">
                <p style="color: #4CAF79;font-size:15px">
                    <b>Giải đáp</b>
                </p>
                <div style="overflow:auto">
                  ${dataMaterial.explainQuestion || ''}
                </div>
                <div style="text-align:center;margin-bottom:20px;margin-top:20px;">
                    <span id="review" style="${displayFlash};margin-right: 10px;padding: 7px 12px;font-size:14px; background: #fff; border-radius: 20px;color: ${textReviewColor}; border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
                    onclick="myReviewActionresult('${
                      dataMaterial.questionId
                    }','${dataMaterial.stepId}')">
                    <i class="fa fa-refresh" style="color:${textReviewColor}"></i> Xem lại khái niệm
                    </span>
                    <span id="revideo" style="display:none;margin-right: 10px;padding: 7px 12px;font-size:14px;background: #fff;border-radius: 20px;color: ${textVideoColor};border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
                        onclick="null">
                        <i class="fa fa-play" style="color:${textVideoColor}"></i> Xem bài giảng
                    </span>
                </div>
            </div>`;
        }

        html +=
          '<div style="height:10px;background:#eaeaea;opacity:0.7"></div>';
      }
    } else {
      let dataStandard = data[i];

      let displayFlash = 'display: inline-block';
      if (
        dataStandard.questionId == null ||
        dataStandard.questionId == 'null' ||
        dataStandard.questionId == ''
      ) {
        displayFlash = 'display: none';
      }

      let rightAnswer2 =
        '<i class="fa fa-question" style="color:#f1c05b;font-size: 14px;margin: auto"></i>';

      if (dataStandard.rightAnswer) {
        rightAnswer2 =
          '<i class="fa fa-check" style="color:#4CAF79;font-size: 14px;margin: auto"></i>';
      } else if (
        Object.keys(dataStandard).length > 0 ||
        dataStandard.userTextAnswer != null
      ) {
        rightAnswer2 =
          '<i class="fa fa-close" style="color:#D9534F;font-size: 14px;margin: auto"></i>';
      }
      html += `
      <div style="border: 0.5px solid #2D9CDB;
       border-radius: 5px;margin-left: 16px;
       margin-right: 16px;overflow: hidden;">
      `;
      html += `
      <div style="padding:10px 15px">
      ${dataStandard.idMaterial&&` <span  style="font-weight: bold;font-size: 10px;color:#28a745 "onclick="matariaDetail('${dataStandard.idMaterial}')">
      xem học liệu
      </span>`||``
    }
      <span style="float: right" id="arrayWarn${
        dataStandard.index
      }" data-numberQuestion="${
        dataStandard.questionNumber
      }" onclick="addQuestion('${dataStandard.questionId}')">
      <div 
         style="
        display: flex;
        flex-direction: row;
        border: 0.5px solid #828282;
        border-radius: 4px;
        padding: 3px 3px 0px 3px;
        margin:2px 0px 0px 8px;
        background-color: #F0F0F0;
        height: 16px;
        width: 14px;
      " 
      >
        <i  id="checkBox${
          dataStandard.questionId
        }" class="fa fa-check" aria-hidden="true" style="color:#37B34A;font-size: 14px; display:none"></i>
     </div>
      </span>
      <!-- Phần nhập điểm -->
      <input 
      id="point${dataStandard.questionId}" 
      style="
        margin-right: 10px; 
        max-width: 50px; 
        width: 40px;
        text-align: center; 
        float: right;
        margin-top: 3px;
        padding: 0px 4px 0px 4px;
        border: 1px solid #828282;
        border-radius: 4px;
        background-color: #FFF;" 
        placeholder="Điểm"
        type="number"
        min="0"
        max="10"
        />
      </div>`;

      html += `
      <div style="overflow:auto;padding:0px 15px 0px;margin-bottom:0px;font-weight:bold;color:#232729">
        ${dataStandard.content}
      </div>`;
      let typeAnswer = dataStandard.typeAnswer;
      if (typeAnswer > 2) {
        html += `<div style="margin-left:15px;margin-right:15px;">
        <textarea placeholder="Nhập câu trả lời" disabled type="text" name="in" style="width:96%;min-height:80px;max-height:140px;padding:5px;margin:15px 0" value="";> ${
          dataStandard.userTextAnswer || ''
        }</textarea>
        </div>`;
      }

      if (dataStandard.typeAnswer <= 1 && dataStandard.options.length !== 0) {
        let countOption = Object.keys(dataStandard).length;
        for (let j = 0; j < dataStandard.options.length; j++) {
          let idOption = dataStandard.options[j];
          const bg = '#fff';
          let bgAnswer = '#000';
          let bgContent = '#fff';
          let borderContent = 'rgba(20,32,49,0.05)';
          // const userSelected = dataStandard.options[j].userSelected;
          // if (userSelected) {
          //   bgAnswer = '#D9534F';
          //   bgContent = '#fef4f4';
          // }
          if (dataStandard.options.indexOf(idOption) > -1) {
            bgAnswer = '#000';
            bgContent = '#FFF';
          }
          html += `<div style=" min-height:40px; border-radius: 4px;background:${bgContent}; overflow: hidden; display: flex; align-items: center;">
            <span style="width:14% !important;text-align:center !important;display:inline-block !important;float: left !important;">
            <span  style="
            color: #fff;
            padding: 5px 7px 5px 7px;
            background: #C4C4C4;
            border-radius: 25px;
            font-size: 8px;
            ">${getAnswerName(j)}</span>
            </span>
            <span class="opcontent" style="width:86% !important;display:inline-block !important;float: left !important;overflow: auto;">${
              dataStandard.options[j].content
            }</span>
            </div>
            `;
        }
      }
      html += `<div style="display: flex; background-color: #2D9CDB;flex-direction: row;    padding-right: 8px; padding-left: 15px;justify-content: space-between; align-items: center;">
      <div style="display: flex; flex-direction: row;">
        <p style="    font-family: Nunito-regular;font-size: 10px;color: #FFF;">ID: ${dataStandard.questionNumber}</p>
        <p style="font-family: Nunito-regular;font-size: 10px;color: #E0E0E0;margin-left: 16px;">Tạo bởi:${dataStandard.author}</p>
      </div>
      <div>
      `;
      if (dataStandard.answer) {
        html += `
        <span style="color:#054B9E;font-size: 9px; margin-right: 3px;">Đáp án</span>
          <img src=${dataStandard.answer} alt="Girl in a jacket" width="20px" height="20px" style="marigin-top:3px">
          `;
      }

      html += `
        <span style="padding-right: 5px, display: flex;flex-direction: row;" onclick="myWarningFunction('106622')">
          <span style="color:#054B9E;font-size: 9px; margin-right: 3px;">Báo lỗi</span>
          <i class="fa fa-warning" style="color:#FFF;font-size: 14px;"></i>
        </span>
      </div>
    </div>`;
      html += '</div>';
      html += '<div style="height:10px;background:#FFF;opacity:0.7"></div>';
    }
  }

  html += `</body>
         </html>`;
  return html;
};

module.exports = {
  renderHtmlQuestionDetail,
};
