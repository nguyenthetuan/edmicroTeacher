import {
  isSubjectMathJax, getAnswerName, getMathJaxScript,
  bgColorActive, bgOptionTrue, bgOptionFalse, bgOptionActive,
  bgViewTrue, bgViewFalse, textReviewColor, borderButton,
  bgButtonColor, textVideoColor, borderColor,
  getStyleAnswer
} from './WebUtils';

const renderListBookmark = (datas, subjectId, perpage) => {
  let padding = isSubjectMathJax(subjectId) ? '14px' : '21px';
  const totalAll = Object.keys(!!datas && datas).length;
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
      body:{
        opacity:1;
      }
      .q_material span{
        font-size:13px !important;
      }
      .opcontent p span{
        font-size:14px !important;
      }
    </style>
    <link rel="stylesheet" href="font47/css/font-awesome.min.css" />
    <script src="jquery.min.js"></script>
    <script type="text/javascript" src="fastclick_min.js"></script>`;

  html += getMathJaxScript(subjectId);

  html += `
    <script>
      window.addEventListener('message', function(e) {
        var res = e.data.split("---");
        var type = res[0];
        if(type == 'updateAjax'){
          updateMathJax(res[1]);
        }
        if(type == 'updateAjaxEnd'){
          updateMathJaxEnd(res[1]);
        }
      });

      function updateMathJax(data){
        $('#mathJaxId').append(data);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        disabledScroll();
        setTimeout(() => {
          enableScroll();
        }, 5000);
      }

      function updateMathJaxEnd(data){
        $('#mathJaxId').append(data);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        disabledScroll();
        setTimeout(() => {
          enableScroll();
        }, 5000);
        $('#loadMore').hide();
      }


      function myLoadmore(){
        window.ReactNativeWebView.postMessage("myLoadmoreWeb---", "*");
      }

      function disabledScroll() {
        $("#mathJaxId").css("overflow-y", "hidden");
        $(document).on("scroll.stopped touchmove.stopped mousewheel.stopped", function(event) {
          return event.preventDefault();
        });
      }
      
      function enableScroll() {
        $("#mathJaxId").css("overflow-y", "auto");
        $(document).off("scroll.stopped touchmove.stopped mousewheel.stopped");
      }
    </script>
    <script>
      function myReviewBm(flashcardId){
        window.ReactNativeWebView.postMessage("rv"+"---"+flashcardId);
      }
      function myVideobm(flashcardVideo){
        window.ReactNativeWebView.postMessage("vd"+"---"+flashcardVideo);
      }
      function myWarningError(numberQuestion){
        window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
      }
     </script>

    </head>
    <body style="margin:0;padding:15px 0px 0px 0px; font-family: Arial, sans-serif !important;">
    <div id="mathJaxId">
    `;
  for (i = 0; i < totalAll; i++) {
    html += `<div style="padding:15px">
      <i class="fa fa-bookmark" style="color:#9B9B9B;font-size: 14px;margin: auto;margin-right:5px"></i>
      <span style="font-weight: bold;font-size: 14px;color: #9B9B9B">Câu ${1 + i}</span>
      <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">|</span>
      <span style="color:#9B9B9B;font-size: 14px">#${datas[i].questionNumber}</span>
      <span style="float: right">
          <span style="padding-right: 5px" onclick="myWarningError('${datas[i].questionNumber}')">
              <i class="fa fa-warning" style="color:#9B9B9B;font-size: 14px;"></i>
              <span style="color:#9B9B9B;font-size: 14px">Báo lỗi</span>
          </span>
          <span style="color:#9B9B9B;font-size: 14px;">|</span>
          <span style="padding:0 5px">
              <i class="fa fa-bookmark" style="color:#9B9B9B;font-size: 14px"></i>
          </span>
        </span>
      </div>`;
    html += `<div style="overflow:auto;padding:0 15px;margin-bottom:10px;font-weight:bold;color:#232729">${datas[i].question}</div>`;

    const len = Object.keys(!!datas[i].options && datas[i].options).length;
    for (let j = 0; j < len; j++) {
      let bgAnswer = '#000';
      let bgContent = '#fff';

      if (datas[i].options[j].isAnswer) {
        bgAnswer = bgOptionTrue;
        bgContent = bgViewTrue;
      }

      html += `<div class="options" style="padding:${padding} 0;border-radius:4px;border-top:1px solid #eaeaea;background:${bgContent}; overflow: hidden; display: flex; align-items: center;">
      <span style="width:14% !important;text-align:center !important;display:inline-block !important;float: left !important;">
      <span style="${getStyleAnswer(datas[i].options[j].isAnswer)}">${getAnswerName(j)}</span>
      </span>
      <span style="width:86% !important;display:inline-block !important;float: left !important;overflow: auto;">${datas[i].options[j].name}</span>
      </div>
      `;
    }
    html += `<div id="answer" style="display:block;margin:0 15px;">
    <p style="color: #4CAF79;font-size:15px">
        <b>Giải đáp</b>
    </p>
    <div style="overflow:auto">
    ${datas[i].explain}
    </div>
    <div style="margin-top:10px">
        <span style="color:#4CAF79">
        <i class="fa fa-pencil" style="color:#1caff6"></i> <span id="people">1</span> người đã trả lời</span>
        <span style="margin-left:10px;color:#4CAF79">
        <i class="fa fa-bolt" style="color:#ffd500"></i> <span id="pecent">10</span>% trả lời đúng</span>
    </div>
    <div style="text-align:center;margin-bottom:20px;margin-top:20px;">
      <span id="review" style="display:${datas[i].flashcardId !== "" ? 'inline-block' : 'none'};margin-right: 10px;padding: 7px 12px;font-size:14px; background: #fff; border-radius: 20px;color: #55bbea; border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
           onclick="myReviewBm('${datas[i].flashcardId}')">
           <i class="fa fa-refresh" style="color:${textReviewColor}"></i> Xem lại khái niệm
      </span>
      <span id="revideo" style="display:${datas[i].flashcardVideo !== "" ? 'inline-block' : 'none'};margin-right: 10px;padding: 7px 12px;font-size:14px;background: #fff;border-radius: 20px;color: #c06d94;border: solid 1px #eaeaea;font-weight:bold;font-size:12px;"
         onclick="myVideobm('${datas[i].flashcardVideo}')">
         <i class="fa fa-play" style="color:${textVideoColor}"></i> Xem bài giảng
      </span>
     </div>
    </div>`;
    html += '<div style="height:10px;background:#eaeaea;opacity:0.7"></div>';
  }
  html += `</div>`;
  if (perpage > 1) {
    html += `  
      <div id="loadMore" onclick="myLoadmore()" style="background:#fff;border-top:1px solid #eaeaea;border-bottom:1px solid #eaeaea;padding:5px 0">
        <p align="center" style="color:#b9b9b9;font-weight:bold;font-size:13px">
        <i class="fa fa-arrow-down" aria-hidden="true" style="color:#b9b9b9"></i> Xem thêm</p>
      </div>`;
  }
  html += `
    </body>
    </html>
    `;
  return html;
}

module.exports = {
  renderListBookmark
}