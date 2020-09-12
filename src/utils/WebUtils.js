import { Platform } from 'react-native';
import AppConst from '../constants/appConst';

const isSubjectMathJax = (subjectId) => {
  if (subjectId === AppConst.mathID || subjectId === AppConst.mathThID
    || subjectId === AppConst.phyID || subjectId === AppConst.phyThID
    || subjectId === AppConst.chemID || subjectId === AppConst.chemThID
    || subjectId === AppConst.mathVao10ID || subjectId === AppConst.mathPlayID) {
    return true;
  }
  return false;
};

const getMathJaxScript = (subjectId) => {
  if (isSubjectMathJax(subjectId)) {
    return `

        <style>#containerMain{display:block;} body{opacity:0;}</style>
        <script src="MathJax.min.js"></script>
        <script>  
            document.getElementById('container-fluid').style.visibility = "hidden";
        </script>
        <script>
            MathJax.Hub.processSectionDelay = 0;
            MathJax.Hub.Config({
                "fast-preview": { disabled:true },
                imageFont: null,
                showMathMenu: false,
                messageStyle: "none",
                skipStartupTypeset: false,
                showProcessingMessages: false,
                jax: ["input/TeX", "output/HTML-CSS"],
                'HTML-CSS': {
                    mtextFontInherit: true,
                },
                tex2jax: {
                    preview: "none",
                inlineMath: [
                    ['$','$'],['\\\\(','\\\\)'],['\\\\[','\\\\]'],['\\left(','\\right)'],['\\left|','\\right|']
                ],
                displayMath: [ ['$$','$$']], 
                processEscapes: true,
                }
            });
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,"container-fluid"]);
            MathJax.Hub.Queue(function () {  
                document.body.style.opacity=1;
                document.getElementById('containerMain').style.display="none";
                document.getElementById('container-fluid').style.visibility = "";
            });
        </script>
        `;
  }
  return `<style>#containerMain{display:none;}</style>
            <script type="text/javascript">
                document.getElementById('container-fluid').style.visibility = "";
            </script>
    `;
}

const getMessageEventExam = (totalCountOption) => {
  return `
    <script type="text/javascript">  
        window.addEventListener('message', function(e) {
            var res = e.data.split("---");
            var value = res[0];
            if(value == 'initWebview'){
                initGlogbal();
            }
            if(value =='updateStar'){
                updateStar(res[1]);
            }
        });
        function initGlogbal(){
            for(let i=0; i<${totalCountOption}; i++){
                document.getElementById("viewOptions"+i).style.backgroundColor="#fff";
                document.getElementById("options"+i).style.backgroundColor="#333";
            }
        }

        function updateStar(status){
            if(status == 2 || status == 4){
                document.getElementById('starId').style.color = "#F9AB3B";
            }else{
                document.getElementById('starId').style.color = "#9b9b9b";
            }
        }

        function warningError(numberQuestion){
            window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
        }
    </script>
    `;
}

const loadEventNative = (totalCountOption, typeAnswer, bgColorActive) => {
  return `
        <script type="application/javascript">
            var indexA = -1;
            window.addEventListener('load', function() {
                var arrTest = [],warningE = '',reviewSlaE='';
                warningE = document.getElementById('warning');
                reviewSlaE = document.getElementById('reviewSla');
                for(var i = 0; i < ${totalCountOption}; i++){
                    arrTest[i] = document.getElementById('viewOptions'+i);
                    if(arrTest[i]){
                        FastClick.attach(arrTest[i]);
                    }
                }
                if(warningE){
                    FastClick.attach(warningE);
                }
                if(reviewSlaE){
                    FastClick.attach(reviewSlaE);
                }
                if(warningE){
                    warningE.addEventListener('click', function(){
                        var numberQuestion = this.getAttribute('data-numberQuestion');
                        window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
                    });
                }
                if(reviewSlaE){
                    reviewSlaE.addEventListener('click', function(){
                        var questionIdStudentTest = this.getAttribute('data-questionIdStudentTest');
                        window.ReactNativeWebView.postMessage("reviewLastWeb---"+questionIdStudentTest);
                    });
                }

                arrTest.forEach(function (item, i) {
                    if(arrTest[i]){
                        arrTest[i].addEventListener('click', function(event) {
                        var type = ${typeAnswer};
                        var key = this.getAttribute('data-key');
                        var zindex = this.style.zIndex;
                        if(type == 1){
                            try{
                                if(zindex == 0){
                                    document.getElementById("options"+key).style.backgroundColor="#55bbea";
                                    this.style.backgroundColor="${bgColorActive}";
                                    this.style.zIndex = 1;
                                }else{
                                    document.getElementById("options"+key).style.backgroundColor="#333";
                                    this.style.backgroundColor="#fff";
                                    this.style.zIndex = 0;
                                }
                            }catch(error){
                                console.log(err);
                            }
                        window.ReactNativeWebView.postMessage("chonseEventTest---"+key);
                    }else{
                        for(var k=0; k < ${totalCountOption}; k++){
                            var selected = document.getElementById('viewOptions'+k).getAttribute('data-userSelected');
                            var useselected = (selected === 'true');
                            if(useselected){
                                document.getElementById("options"+k).style.backgroundColor="#333";
                                document.getElementById('viewOptions'+k).style.backgroundColor="${bgColorActive}";
                            }else{
                                document.getElementById("options"+k).style.backgroundColor="#333";
                                document.getElementById('viewOptions'+k).style.backgroundColor="#fff";
                            }
                        }
                        if(indexA != key){
                            document.getElementById("options"+key).style.backgroundColor="#55bbea";
                            document.getElementById("viewOptions"+key).style.backgroundColor="${bgColorActive}";
                            indexA = key;
                        }else{
                            indexA = -1;
                        }
                        window.ReactNativeWebView.postMessage("chonseEventTest---"+key);
                    }
                    }, false);
                    }
                });
            }, false);
        </script>`;
}

const getHeaderStyle = () => {
  return `
    <style>
        p img {
            float: inherit !important;
            display:block;
            max-width: 100%;
            margin: 0 auto 4px auto !important;
        }
        :focus{
            outline:0px;
        }
        body:{
            margin:0;
            padding:15px 0;
        }
        .q_material span{
            font-size:13px !important;
        }
        .opcontent p span{
            font-size:14px !important;
        }
        #containerMain{
            display:block;
        }
    </style>
    `;
}

const getStyleMathPlay = () => {
  return `
    <style type="text/css">
        p img {
            float: inherit !important;display:block; max-width: 100%; margin: 0 auto 4px auto !important;
        }
        label.form-check-label{
            display: inline-block;
        } 
        .question {
            overflow:auto;padding:0px 15px;padding-top:10px;margin-bottom:10px;font-weight:bold;color:#232729
        }
        .d-flex {
            display: flex!important;
        }
        #table-content {
            position: relative;
        }
        .d-inline-block {
            display: inline-block !important;
        }
        .text-center{
            text-align: center;
        }
        .hidden{
            display:none;
        }
        #keypad {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .scrollKey{
            overflow-x: hidden; 
            overflow-y: scroll; 
            max-height: calc(100vh - 170px);
        }
        .activeInput{
            background:#bcdcbc;
        }
    </style>
    `;
}

const getStyleAnswer = (b) => {
  if (b) {
    return `
        color: #fff;
        padding: 4px 8px;
        background: #4CAF79;
        border-radius: 100px;
        font-size:12px;
      `;
  }
  return `
        color: #fff;
        padding: 4px 8px;
        background: #333;
        border-radius: 100px;
        font-size:12px;
    `;
}

const getAnswerName = (i) => {
  switch (i) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return 'G';
    case 7:
      return 'H';
    case 8:
      return 'I';
    case 9:
      return 'J';
    case 10:
      return 'K';
    case 11:
      return 'L';
    case 12:
      return 'M';
    default:
      return 'M';
  }
}

const getAppStyle = () => {
  return `
    <style>
        .justify-content-center {
            justify-content: center;
        }
        .template-17 .justify-content-center{
            display: flex !important;
            margin-top:15px !important;
        }
        #keypad .keypad-container {
            background: #f8f8f8 !important;
            padding:0 !important;
        }
        .template-18 .form-check-label{
            right:8px !important
        }
        table tr{
            display:block;
            padding: 5px 0px;
        }
        .template-2 .table{
            width:100% !important;
            margin-left:0px !important;
        }
        .template-0 .table{
            align-items:center;
            margin:auto;
        }
        .template-12 .table{
            align-items:center;
            margin:auto;
        }
        .template-13 .table{
            align-items:center;
            margin:auto;
        
        }
        .template-13 .table tr td{
            text-self:center;
            padding-top:0px !important;
        }
    </style>
    `
}

module.exports = {
  isSubjectMathJax,
  getAnswerName,
  getMathJaxScript,
  getHeaderStyle,
  getStyleMathPlay,
  loadEventNative,
  getMessageEventExam,
  getStyleAnswer,
  getAppStyle
}