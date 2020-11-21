import {
    isSubjectMathJax, getAnswerName, getMathJaxScript
} from './WebUtils';
import _ from 'lodash';

import WebColor from './WebColorConfig';

const ANSWER_OPTIONS = ['A', 'B', 'C', 'D'];

const { bgColorActive, bgOptionTrue, bgOptionFalse, bgOptionActive,
    bgViewTrue, bgViewFalse, textReviewColor, borderButton,
    bgButtonColor, textVideoColor, borderColor } = WebColor;

const renderHtmlListQuestionCopy = (data, points, renderCheckbox) => {
    let html = ``;
    html += `
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
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
        #abcd p:last-child {
            margin-bottom: 10px !important;
            margin-top: 2px;
            margin-left: 10px
        }
        </style>
        <link rel="stylesheet" href="font47/css/font-awesome.min.css">
        <script>
            function checkboxFunc(index) {
                window.ReactNativeWebView.postMessage("checked---"+index);
            }
            function blurFocus() {
                let inputs = document.getElementsByName('point');
                for(let i = 0; i < inputs.length; i ++) {
                    inputs[i].blur();
                }
            }
            function onBlur() {
                let inputs = document.getElementsByName('point');
                let newPoints = [];
                for(let i = 0; i < inputs.length; i ++) {
                    newPoints.push(parseFloat(inputs[i].value));
                }
                window.ReactNativeWebView.postMessage("newPoints---"+JSON.stringify(newPoints));
            }
            function reportBug(numberQuestion) {
                window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
            }
        </script>
        <script>
            <!-- ios -->
            window.addEventListener('message',(e)=>{
                var checkboxs = document.getElementsByName("checkbox");
                if(e.data == 'tickAll'){
                  for(let i =0; i< checkboxs.length; i++) {
                    checkboxs[i].checked = true;
                  }
                } 
                if(e.data == 'untickAll'){
                  for(let i =0; i< checkboxs.length; i++) {
                    checkboxs[i].checked = false;
                  }
                }
                if(e.data == 'blurInput') {
                    blurFocus();
                }
            })
            <!-- android -->
      
            document.addEventListener('message',(e)=>{
                var checkboxs = document.getElementsByName("checkbox");
                if(e.data == 'tickAll'){
                  for(let i =0; i< checkboxs.length; i++) {
                    checkboxs[i].checked = true;
                  }
                } 
                if(e.data == 'untickAll'){
                  for(let i =0; i< checkboxs.length; i++) {
                    checkboxs[i].checked = false;
                  }
                }
                if(e.data == 'blurInput') {
                    blurFocus();
                }
            })
        </script>
    </head>
    <body style="margin:0;padding:15px 15px 0 15px;font-family: Arial, sans-serif !important;font-size:14px !important;">`
    html += renderListquestion(data, points, renderCheckbox);
    html += getMathJaxScript('TOAN');
    html += `</body>
        
    `
    return html;
}

const renderListquestion = (data, points, renderCheckbox) => {
    let html = ``;
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let options = item.options;
        html += `<div style="margin-top:15px" onclick="" >`
        if (renderCheckbox) {
            html += `<div style="display:flex;">
                <div style="font-size:15px; font-weight: 900">Câu ${i + 1}:</div>
                <input type="number" id="point${i}" name="point" style="width: 40px; margin-top: -2px; margin-left: 20px" value="${points?.length ? points[i] : 0}" onblur="onBlur()">
                <input style="position: absolute; right: 10px" type="checkbox" id="myCheck${i}" onclick="checkboxFunc('${i}')" name="checkbox">
            </div>`
        } else {
            html += `<div style="display:flex;">
                <div style="font-size:15px; font-weight: 900">Câu ${i + 1}:</div>
            </div>`
        }

        html += `${item.content}`
        for (let j = 0; j < options.length; j++) {
            html +=
                `<div style="display:flex;">                   
                        <div style=" border-radius: 50%; background: #4ca4e8; color: #fff; width: 25px; height: 25px; line-height: 25px; text-align: center;"}>${ANSWER_OPTIONS[j]}</div>
                        <div style="margin-bottom: 10px;" id="abcd">${options[j].content}</div>
                </div>`
        }
        html += `<div style="display: flex; background-color: #2D9CDB;flex-direction: row; padding-right: 8px; padding-left: 15px;justify-content: space-between; align-items: center;">
            <p style="font-family: Nunito-regular;font-size: 10px;color: #FFF;">ID: ${item.questionNumber}</p>
            <div style="display: flex; flex-direction: row;">
                <p style="font-family: Nunito-regular;font-size: 13px;color: #E0E0E0;margin-left: 16px;">Tạo bởi:${item.author}</p>
            </div>
                <span style="padding-right: 5px, display: flex;flex-direction: row;" onclick="reportBug(${item.questionNumber})">
                <span style="color:#054B9E;font-size: 11px; margin-right: 3px;">Báo lỗi</span>
                <i class="fa fa-warning" style="color:#FFF;font-size: 14px;"></i>
            </span>
        </div>`
        html += `</div>`
    }
    return html;
}

module.exports = {
    renderHtmlListQuestionCopy,
};