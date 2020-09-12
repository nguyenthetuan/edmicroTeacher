const getHeaderPractice = ({ index, numberQuestion, bookMarkStatus, bookmarkcolor, stepId, statusStep, reviewColor, isPractice,dataSideBar }) => {
  let html = `
        <div style="padding:0 15px; display:block">
            <span style="font-weight: bold;font-size: 14px;color: #9B9B9B">Câu ${index+1}</span>
            <i id="resultTrue" class="fa fa-check" style="color:#228B22;font-size: 14px;display:none"></i>
            <i id="resultFalse" class="fa fa-close" style="color:#D9534F;font-size: 14px;display:none"></i>
            <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">:</span>
            <span style="color:#9B9B9B;font-size: 14px" id="spanIdNumber">#${numberQuestion}</span>
            <i class="fa fa-warning" style="color:#9B9B9B;font-size: 14px;"></i>
            <span style="color:#9B9B9B;margin: 0 5px;font-size: 14px;">|</span>
            <span 
            onclick="myWarningFunction('${numberQuestion}')"
            style="color:#9B9B9B;font-size: 14px">Báo lỗi</span>
            <span style="float: right" onclick="addQuestion()">
              <span style="padding-right: 5px" data-numberQuestion="${numberQuestion}">
              <div style="display:flex;flex-direction: row;">
              </span>
                <div 
                style="
               display: flex;
               flex-direction: row;
               border: 0.5px solid #828282;
               padding: 3px 3px 0px 3px;
               background-color: #F0F0F0;
               height: 15px;
               width: 14px;
             " 
             >
               <i  id="checkBox" class="fa fa-check" aria-hidden="true" style="color:#37B34A;font-size: 14px; display:${dataSideBar[index].status===2||dataSideBar[index].status===4?`block`:`none`}"></i>
            </div>
            </div>
            </span>
        </div>`;
    return html;
}

module.exports = {
    getHeaderPractice
}