import { getAnswerName } from './WebUtils';

const getOptionsQuestion = (data, padding, type, isHideAnswerImg = false) => {
    let html = '';
    html += `<div id="wrapOption" style="position:relative">`;
    let options = data.options;
    let count = Object.keys(!!options && options).length;
    if (data.typeAnswer == 0 || data.typeAnswer == 1) {
        for (let i = 0; i < count; i++) {
            let bgAnswer = '#000';
            let bgContent = '#fff';
            let answerColor = '#fff';
            if (__DEV__ && options[i].isAnswer) {
                answerColor = '#f00';
            }
            let idOption = type == 1 ? options[i].id : options[i].idOption;
            let answerName = type == 1 ? options[i].name : options[i].content;
            html += `<div id="viewOptions${idOption}" data-key="${idOption}" style="padding:${padding} 0; min-height:40px;border-top:1px solid #eaeaea;background:${bgContent}; overflow: hidden; display: flex; align-items: center;z-index:0">
            <span style="width:14% !important;text-align:center !important;display:inline-block !important;float: left !important;">
            <span id="options${idOption}" style="color:${answerColor};padding: 4px 8px;background: ${bgAnswer};border-radius: 100px;font-size:12px;">${getAnswerName(i)}</span>
            </span>
            <span class="opcontent" style="width:86% !important;display:inline-block !important;float: left !important;overflow: auto;">${answerName}</span>
            </div>
            `;
        }
    }
    
    if (data.typeAnswer == 2 || data.typeAnswer == 3) {
        if (!isHideAnswerImg) {
            html += `<div style="padding-left:15px;padding-right:15px">
                <textarea onfocusout="onchangeText(this)" placeholder="Nhập đáp án" type="text" name="in" style="width:96%;min-height:144px;max-height:140px;padding:5px;margin:15px 0;border: .5px solid rgba(128, 128, 128, 1);";
                    background: rgba(211, 211, 211, 0.301);>${data.userOptionText||''}
                </textarea>
                <div id="imageContain"></div>
            </div>
          `;
        } else {
            html += `<div style="padding-left:15px;padding-right:15px">
            <textarea id="textAnswer" onfocusout="onchangeText(this)" placeholder="Nhập câu trả lời" type="text" name="in" style="width:96%;min-height:80px;max-height:140px;padding:5px;margin:15px 0";border: 1px solid #E0E0E0;
                background: rgba(211, 211, 211, 0.301); value="";>
            </textarea>
        </div>
      `;
        }
    }
    return html;
}

module.exports = {
    getOptionsQuestion
}