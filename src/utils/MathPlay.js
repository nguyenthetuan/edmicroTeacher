//type_view = 0
function getScriptHTMLInput(question, typeAnswer, template) {
  html = ``;
  if (typeAnswer == 4) {
    html += `
          <script type="text/javascript">
            var isKeyboard = false;
            var dataOptiontext = [];
            var text = "";
            var element = "";
            document.getElementById('mathplay-answer-1').addEventListener("click", function(event) {
              event.stopPropagation();
              let value = $(this).val();
              let type = $(this).attr('type');
              $(this).addClass('activeInput');
              text=value;
              element = this;
              if(type != 'radio'){
                let dataType = $(this).attr('data-type');
                switch(dataType){
                  case 'number':
                    changeKey('keypadnumber');
                    break;
                  case 'math-symbols':
                    changeKey('keypadsymbol');
                    break;
                case 'text':
                    changeKey('keypadquerty');
                break;
                }
              }
            });
  
            $('.template-default').click(function(){
             // keypadToggler();
            });
  
            function deleteKey(){
              text = text.substring(0, text.length - 1);
              $(element).val(text);
              dataOptiontext[0] = text;
             window.ReactNativeWebView.postMessage("changeOneText"+"---"+JSON.stringify(dataOptiontext));
            }
          
            function bindingkey(event) {
              let keyCode = event.target.innerText;
              keyCode = keyCode == 'space' ? ' ' : keyCode;
              text = text + keyCode;
              $(element).val(text);
              dataOptiontext[0] = text;
              window.ReactNativeWebView.postMessage("changeOneText"+"---"+JSON.stringify(dataOptiontext));
            }
  
            function symbolbinding(symbol){
              symbol = symbol.replace('equal', '=' );
              symbol = symbol.replace( 'lessthan', '<' );
              symbol = symbol.replace( 'greaterthan', '>' );
              symbol = symbol.replace( 'plus', '+' );
              symbol = symbol.replace( 'minus', '-' );
              symbol = symbol.replace( 'divide', ':' );
              symbol = symbol.replace( 'multi', '×' );
              text = text + symbol;
              $(element).val(text);
              dataOptiontext[0] = text;
             window.ReactNativeWebView.postMessage("changeOneText---"+JSON.stringify(dataOptiontext));
            }
  
          </script>
        `;
  }
  if (typeAnswer == 5) {
    html += `
      <script>
        var text = "";
        var element = "";
        var keyInput = "";
        var numItemText = $('input[type="text"][disabled!="disabled"]').length;
        var dataTextAnswer = [];
        if (numItemText > 0) {
            for (let i = 0; i < numItemText; i++) {
              var el = document.getElementById('mathplay-answer-'+( 1 + i));
              if(el){
                el.addEventListener("click", function(event) {
                  event.stopPropagation();
                  let value = $(this).val();
                  $('input').removeClass('activeInput');
                  $(this).addClass('activeInput');
                  text=value;
                  element = this;
                  keyInput = i;
                  let dataType = $(this).attr('data-type');
                    switch(dataType){
                      case 'number':
                        changeKey('keypadnumber');
                        break;
                      case 'math-symbols':
                        changeKey('keypadsymbol');
                        break;
                    case 'text':
                        changeKey('keypadquerty');
                    break;
                  }
                });
              }
            }
        }
  
        $('.template-default').click(function(){
          //keypadToggler();
        });
  
        function deleteKey(){
          text = text.substring(0, text.length - 1);
          $(element).val(text);
          dataTextAnswer[keyInput] = text;
         window.ReactNativeWebView.postMessage("changeText---"+numItemText+"---"+JSON.stringify(dataTextAnswer));
        }
      
        function bindingkey(event) {
          let keyCode = event.target.innerText;
          keyCode = keyCode == 'space' ? ' ' : keyCode;
          text = text + keyCode;
          $(element).val(text);
          dataTextAnswer[keyInput] = text;
          window.ReactNativeWebView.postMessage("changeText---"+numItemText+"---"+JSON.stringify(dataTextAnswer));
        }
  
        function symbolbinding(symbol){
          symbol = symbol.replace('equal', '=' );
          symbol = symbol.replace( 'lessthan', '<' );
          symbol = symbol.replace( 'greaterthan', '>' );
          symbol = symbol.replace( 'plus', '+' );
          symbol = symbol.replace( 'minus', '-' );
          symbol = symbol.replace( 'divide', ':' );
          symbol = symbol.replace( 'multi', '×' );
          text = text + symbol;
          $(element).val(text);
          dataTextAnswer[keyInput] = text;
          window.ReactNativeWebView.postMessage("changeText---"+numItemText+"---"+JSON.stringify(dataTextAnswer));
        }
  
        var element = $('.mathplay-question');
        var dataOptionText = [];
      
        var arrCorrect = [];
        for(let i = 0; i < element.length; i++){
          arrCorrect[i] = document.getElementById('mathplay-answer-'+(1 + i)+'-correct');
          FastClick.attach(arrCorrect[i]);
        }
      
        var arrWrong = [];
        for(let i = 0; i < element.length; i++){
          arrWrong[i] = document.getElementById('mathplay-answer-'+(1 + i)+'-wrong');
          FastClick.attach(arrWrong[i]);
        }
        for(let j = 0;j < element.length; j++){
          arrCorrect[j].addEventListener("click", function() {
            dataOptionText[j] = $(this).val();
            $(this).parent().find('label').css("background","#17bcba");
            $('#mathplay-answer-'+(1 + j)+'-wrong').parent().find('label').css("background","#ff7300");
            window.ReactNativeWebView.postMessage("selectMulti---"+element.length+"---"+JSON.stringify(dataOptionText),"*");
          });
      
          arrWrong[j].addEventListener("click", function() {
            dataOptionText[j] = $(this).val();
            $(this).parent().find('label').css("background","#17bcba");
            $('#mathplay-answer-'+(1 + j)+'-correct').parent().find('label').css("background","#ff7300");
            window.ReactNativeWebView.postMessage("selectMulti---"+element.length+"---"+JSON.stringify(dataOptionText),"*");
          });
        }
      </script>`;
  }
  html += `
    <script type="text/javascript">
      $('input').prop('readonly', true);
      window.addEventListener('load', function() {
        var item = $('input[name="answer"]');
        var numItems = item.length;
        var dataOptiontext = [];
        var arrTest = [];
        for(var i = 0; i < numItems; i++){
          arrTest[i] = document.getElementById('mathplay-answer-'+(1 + i));
          FastClick.attach(arrTest[i]);
        }
  
      arrTest.forEach(function (item, i) {
        if(arrTest[i]){
          arrTest[i].addEventListener('click', function(event) {
            if(true){
              dataOptiontext[0] = this.value;
              if($(this).parent().find('label').hasClass('form-check-label')){
                ${template == 17 ? `
                  $('.form-check-label').css('background','#ff7300');
                  $(this).parent().find('label').css('background','#1e9f98');
                `: ``}
              }
              else if($(this).hasClass('form-check-input')){
              }
              if($(this).parent().find('label').hasClass('item-content')){
                $('.item-content').parent().find('label').css('border','1px solid #08f4f4');
                $(this).parent().find('label').css('border','3px solid #08f4f4');
              }
              window.ReactNativeWebView.postMessage("selectOne---"+JSON.stringify(dataOptiontext));
            }else{
              dataOptiontext[i] = this.value;
            }
          }, false); 
        }
      });
    }, false);
  
    function changeKey(type) {
      $('.keypad-toggler').removeClass('hidden');
      if (type == 'keypadquerty') {
        $('#number-keypad').addClass('hidden');
        $('#querty-keypad').removeClass('hidden');
        $('#symbol-keypad').addClass('hidden');
        window.ReactNativeWebView.postMessage("showButtonAnswer---0");
        $('.template-default').addClass('scrollKey');
      }
      if (type == 'keypadnumber') {
        $('#number-keypad').removeClass('hidden');
        $('#querty-keypad').addClass('hidden');
        $('#symbol-keypad').addClass('hidden');
        window.ReactNativeWebView.postMessage("showButtonAnswer---0");
        $('.template-default').addClass('scrollKey');
      }
      if (type == 'keypadsymbol') {
        $('#number-keypad').addClass('hidden');
        $('#querty-keypad').addClass('hidden');
        $('#symbol-keypad').removeClass('hidden');
        window.ReactNativeWebView.postMessage("showButtonAnswer---0");
        $('.template-default').addClass('scrollKey');
      }
    }
  
    function keypadToggler() {
      $('#number-keypad').addClass('hidden');
      $('#querty-keypad').addClass('hidden');
      $('#symbol-keypad').addClass('hidden');
      $('.keypad-toggler').addClass('hidden');
      window.ReactNativeWebView.postMessage("showButtonAnswer---1");
      $('.template-default').removeClass('scrollKey');
      $('input').removeClass('activeInput');
    }
    </script>  
    `;
  return html;
}

function getScriptPunchOrder() {
  var html = ``;
  html += `
    <script type="text/javascript">
      $(document).ready(function(){
        var dataOptionText = [];
        $( ".dragula" ).sortable({cancel:true});
        $( ".dragula" ).disableSelection();
        $( ".dragula" ).bind( "sortstop", function(event, ui) {
          var element = $(event.currentTarget).find('button');
          if(element.length > 0){
            for(var k = 0;k < element.length; k++){
              dataOptionText[k] = element[k].innerText;
            }
          }
         window.ReactNativeWebView.postMessage("dagularOrder---"+JSON.stringify(dataOptionText));
        });
      });
    </script>`;
  return html;
}

//To mau
function getScriptBackground(question, template, userOptionText) {
  let temp = '';
  if (userOptionText) {
    temp = `
    let userOptionText = ${JSON.stringify(userOptionText)};
      for (let i = 0; i < element.length; i++) {
        arrSelect[i] = document.getElementById('mathplay-select-' + (1 + i));
        for (let j = 0; j < userOptionText.length; j++) {
          console.log(userOptionText[j]);
          console.log(document.getElementsByClassName('mathplay-select')[i].attributes.color.value);
          if (userOptionText[j] == document.getElementsByClassName('mathplay-select')[i].attributes.value.value) {
            arrSelectAnswer[j].style.background = '#' + document.getElementsByClassName('mathplay-select')[i].attributes.color.value;
          }
        }
      }
    `
  }

  html = `<script type="text/javascript">
    let element = $('.mathplay-select');
    var color = '';
    var value = '';
    var arrSelect = [];
   
  
    for(let i = 0; i < element.length; i++){
      arrSelect[i] = document.getElementById('mathplay-select-'+(1 + i));
      FastClick.attach(arrSelect[i]);
    }
  
    for(let j = 0;j < element.length; j++){
      arrSelect[j].addEventListener("click", function() {
          color = $( this ).css( "background-color" );
          value = $( this ).attr("value");
          console.log(value);
       });
    }
    var dataOptionText = [];
    let elementAnswer = $('.mathplay-answer');
  
    var arrSelectAnswer = [];
  
    for(let j = 0;j < elementAnswer.length; j++){
      arrSelectAnswer[j] = $('.mathplay-answer')[j];
      FastClick.attach(arrSelectAnswer[j]);
    }
  
    for(let j = 0;j < elementAnswer.length; j++){
      arrSelectAnswer[j].addEventListener("click", function() {
          if(value!=""){
            $( this ).css( "background-color",color );
            dataOptionText[j] = value; 
            window.ReactNativeWebView.postMessage("canvasColor---"+JSON.stringify(dataOptionText),"*");
          }
       });
    }
    ${temp}
  </script>`;
  return html;
}

function getScriptRadio(question) {
  html = ``;
  html += `<script type="text/javascript">
      var element = $('.mathplay-question');
      var dataOptionText = [];
      var arrCorrect = [];

      for(let i = 0; i < element.length; i++){
        arrCorrect[i] = document.getElementById('mathplay-answer-'+(1 + i)+'-correct');
        FastClick.attach(arrCorrect[i]);
      }
  
      var arrWrong = [];
      for(let i = 0; i < element.length; i++){
        arrWrong[i] = document.getElementById('mathplay-answer-'+(1 + i)+'-wrong');
        FastClick.attach(arrWrong[i]);
      }
      for(let j = 0;j < element.length; j++){
        arrCorrect[j].addEventListener("click", function() {
          dataOptionText[j] = $(this).val();
          $(this).parent().find('label').css("background","#17bcba");
          $('#mathplay-answer-'+(1 + j)+'-wrong').parent().find('label').css("background","#ff7300");
          console.log(dataOptionText);
          window.ReactNativeWebView.postMessage("selectMulti---"+element.length+"---"+JSON.stringify(dataOptionText));
        });
    
        arrWrong[j].addEventListener("click", function() {
          dataOptionText[j] = $(this).val();
          $(this).parent().find('label').css("background","#17bcba");
          $('#mathplay-answer-'+(1 + j)+'-correct').parent().find('label').css("background","#ff7300");
          console.log(dataOptionText);
          window.ReactNativeWebView.postMessage("selectMulti---"+element.length+"---"+JSON.stringify(dataOptionText));
        });
      }
    </script>`;
  return html;
}

function getScriptCanvas(question, template, userOptionText) {
  console.log('getScriptCanvas', userOptionText);

  let tempTemaple8 = '';
  if (template == 8 && userOptionText) {
    // console.log(userOptionText);
    tempTemaple8 = ` function writePathAnswerTemplate8() {
      let arr = ['${userOptionText[0]}', '${userOptionText[1]}', '${userOptionText[2]}'] || [];
      if (!arr) {
          return;
      }
      for (let i = 0; i < arr.length; i++) {
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
  return `
    <script type="text/javascript" src="jsplumb.min.js"></script>
    <script>
    window.onload = function() {
      var leftPointer = document.getElementsByClassName('left-pointer');
      var rightPointer = document.getElementsByClassName('right-pointer');
      var resetButton = document.getElementById('reset');
      var jsp = jsPlumb.getInstance();
      var sourceId = '';
      var targetId = '';
      var sourceArray = [];
      var targetArray = [];
      var valueL = '';
      var valueRight = '';
      var dataOptionText = [];
  
      var arrLeftPointer = [];
      for (let i = 0; i < leftPointer.length; i++) {
          arrLeftPointer[i] = document.getElementsByClassName('left-pointer')[i];
          FastClick.attach(arrLeftPointer[i]);
      }
  
      var arrRightPointer = [];
      for (let i = 0; i < leftPointer.length; i++) {
          arrRightPointer[i] = document.getElementsByClassName('right-pointer')[i];
          FastClick.attach(arrRightPointer[i]);
      }
  
      arrLeftPointer.forEach(function(item, i) {
          if (arrLeftPointer[i]) {
              arrLeftPointer[i].addEventListener('click', function(event) {
                 sourceId = this.getAttribute('id');
                  valueLeft = i + 1;
                  handleClick();
              }, false);
          }
          if (arrRightPointer[i]) {
              arrRightPointer[i].addEventListener('click', function(event) {
                 targetId = this.getAttribute('id');
                   valueRight = i + 1;
                  handleClick();
              }, false);
          }
      });
  
      resetButton.addEventListener('click', function() {
          jsp.reset();
          sourceArray = [];
          targetArray = [];
          dataOptionText = [];
          sourceId = '';
          targetId = '';
      });
  
      function handleClick(i) {
          connectJsplumb();
      }
      ${tempTemaple8}
      function connectJsplumb() {
          if (targetId != '' && sourceId != '') {
              if (sourceArray.indexOf(sourceId) == -1 && targetArray.indexOf(targetId) == -1) {
                  jsp.connect({
                      connector: ['Straight', { stub: 5 }],
                      source: sourceId,
                      target: targetId,
                      anchor: ['Right', 'Left'],
                      paintStyle: { stroke: '#456', strokeWidth: 1 },
                      endpoint: ['Dot', { radius: 3, hoverClass: 'myEndpointHover' }, { cssClass: 'myCssClass' }]
  
                  });
                  let key = valueLeft + "" + valueRight;
                  dataOptionText.push(key);
                  let dataArr = dataOptionText.sort();
                  console.log(dataArr);
                  sourceArray.push(sourceId);
                  targetArray.push(targetId);
                  targetId = '';
                  sourceId = '';
                 window.ReactNativeWebView.postMessage("dataJsplumb" + "---" + JSON.stringify(dataArr));
              }
          }
      }
      };
    </script>
    `;
}

function getScriptPunchTouch() {
  var html = ``;
  html += `
    <script>
    var elemenChange = document.getElementById("mathlplay-select-3");
    if(elemenChange){
      elemenChange.id = "mathplay-select-3";
    }
     $(document).ready(function() {
      $(".dragula img").draggable({
          revert : function(event, ui) {
              // on older version of jQuery use "draggable"
              // $(this).data("draggable")
              // on 2.x versions of jQuery use "ui-draggable"
              // $(this).data("ui-draggable")
              $(this).data("uiDraggable").originalPosition = {
                  top : 0,
                  left : 0
              };
              // return boolean
              return !event;
              // that evaluate like this:
              // return event !== false ? false : true;
          }
        });
        var dataOptionText = [];
        var dragularLength = $(".dragula img").length;
              var boxdragula = $(".box-dragula");
                  for(let i=0; i<boxdragula.length; i++){
                  $('#mathplay-select-'+(1+i)).droppable({
                      drop: function(event, ui) {
                           let id = ui.draggable.attr("id");
                           let key = id.substr(-1);
               dataOptionText[key-1] = i+1;
              window.ReactNativeWebView.postMessage("dragular---"+dragularLength+"---"+JSON.stringify(dataOptionText));
                      }
                  });
              }
     });
    </script>
    `;

  return html;
}

function getScriptCheckbox() {
  return `
      <script>
        $(document).ready(function() {
          ngOnChanges();
  
          $('#reset').click(function(e){
            resetSelected(e);
          })
      });
  
      function ngOnChanges() {
          const inputs = document.getElementsByClassName('mathplay-answer');
          const tRow = document.getElementsByClassName('tRow');
          const tCell = document.getElementsByClassName('tCell');
          const resetBtn = document.querySelector('#reset');
          window['numberCellInRow'] = tRow[0].children.length;
          window['listArrayInputs'] = [];
          window['tCell'] = tCell[0];
          window['numberAlphabet'] = 0;
          window['arrayValue'] = [];
          // add listen event click for check input
          window['arrayId'] = [];
          for (let i = 0; i < inputs.length; i++) {
              window['listArrayInputs'].push(inputs[i].id);
              if (inputs[i].classList.contains('begin')) {
                  window['beginInput'] = inputs[i];
                  window['arrayValue'][0] = inputs[i].value;
                  window['arrayId'][0] = inputs[i].getAttribute('id');
                  inputs[i].classList.add('lock');
                  inputs[i].checked = true;
              }
              if (inputs[i].classList.contains('begin1')) {
                  window['beginInput1'] = inputs[i];
                  window['arrayValue'][1] = inputs[i].value;
                  inputs[i].classList.add('lock');
                  inputs[i].checked = true;
              }
              inputs[i].addEventListener('click', this.checkBoxSelected.bind({
                  element: inputs[i]
              }));
          }
          ngAfterViewInit();
      }
  
      function resetSelected(event) {
        const tableContent = document.getElementById('table-content');
        const cavasTableContent = tableContent.children[0].children[0];
        const tCell = document.getElementsByClassName('tCell');
        window['tCell'] = tCell[0];
        window['numberAlphabet'] = 1;
        const canvas = window['canvas'];
        canvas.width = cavasTableContent.offsetWidth;
        canvas.height = cavasTableContent.offsetHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        const inputs = document.querySelectorAll('.mathplay-answer');
        window['arrayValue'] = [];
        window['arrayId'] = [];
        window['beginInput'] = null;
        window['beginInput1'] = null;
        for (let i = 0; i < inputs.length; i++) {
          if (!inputs[i].classList.contains('lock')) {
            inputs[i].checked = false;
            inputs[i].parentElement.removeAttribute('data-contentafter');
            inputs[i].parentElement.children[1].innerHTML="";
          }
          if (inputs[i].classList.contains('begin')) {
            window['beginInput'] = inputs[i];
            window['arrayId'][0] = inputs[i].getAttribute('id');
            window['arrayValue'][0] = inputs[i].value;
          }
          if (inputs[i].classList.contains('begin1')) {
            window['numberAlphabet'] = 2;
            window['beginInput1'] = inputs[i];
            window['arrayValue'][1] = inputs[i].value;
            window['arrayId'][1] = inputs[i].id;
          }
          if (inputs[i].classList.contains('lock2')) {
            inputs[i].classList.remove('lock2');
          }
        }
        setTimeout(() => {
          if (window['beginInput1']) {
            const el = window['beginInput1'];
            // const indexBeginId = window['arrayId'].length - 1;
            const beginId = window['arrayId'][0];
            const beginIdIndex = window['listArrayInputs'].indexOf(beginId);
            const numberOrderLast = beginIdIndex + 1;
            const yAxisPre = Math.ceil(numberOrderLast / window['numberCellInRow']);
            const xAxisPre = beginIdIndex - ( window['numberCellInRow'] * (yAxisPre - 1));
  
            const index = window['listArrayInputs'].indexOf(el.id);
            const numberOrder = index + 1;
            const yAxis = Math.ceil(numberOrder / window['numberCellInRow']);
            const xAxis = index - ( window['numberCellInRow'] * (yAxis - 1));
  
            ctx.beginPath();
            ctx.moveTo(window['tCell'].offsetWidth * xAxisPre, window['tCell'].offsetHeight * yAxisPre);
            ctx.lineTo(window['tCell'].offsetWidth * xAxis, window['tCell'].offsetHeight * yAxis);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#000';
            ctx.stroke();
          }
        }, 0);
      }
  
      function checkBoxSelected(event) {
          const el = event.srcElement;
          const value = el.value;
          const indexLastId = window['arrayId'].length - 1;
          const lastId = window['arrayId'][indexLastId];
          if (el.classList.contains('lock') && lastId === el.id) {
              event.preventDefault();
              return false;
          }
          el.classList.add('lock2');
          if (el.classList.contains('lock2')) {
              el.checked = true;
          }
          if (!el.parentElement.getAttribute('data-contentafter')) {
              window['numberAlphabet'] += 1;
              el.parentElement.setAttribute('data-contentafter', String.fromCharCode(window['numberAlphabet'] + 64));
              el.parentElement.children[1].innerHTML=String.fromCharCode(window['numberAlphabet'] + 64);
          }
          const lastIdIndex = window['listArrayInputs'].indexOf(lastId);
          const numberOrderLast = lastIdIndex + 1;
          const yAxisPre = Math.ceil(numberOrderLast / window['numberCellInRow']);
          const xAxisPre = lastIdIndex - (window['numberCellInRow'] * (yAxisPre - 1));
  
          const index = window['listArrayInputs'].indexOf(el.id);
          const numberOrder = index + 1;
          const yAxis = Math.ceil(numberOrder / window['numberCellInRow']);
          const xAxis = index - (window['numberCellInRow'] * (yAxis - 1));
  
          const canvas = window['canvas'];
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.moveTo(window['tCell'].offsetWidth * xAxisPre, window['tCell'].offsetHeight * yAxisPre);
          ctx.lineTo(window['tCell'].offsetWidth * xAxis, window['tCell'].offsetHeight * yAxis);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#000';
          ctx.stroke();
          setTimeout(() => {
              window['arrayId'].push(el.id);
              const indexValue = window['arrayValue'].indexOf(el.value);
              if (indexValue === -1 || el.value === window['arrayValue'][0]) {
                  window['arrayValue'].push(el.value);
                  console.log(window['arrayValue']);
                 window.ReactNativeWebView.postMessage("canvasPoint---"+JSON.stringify(window['arrayValue']));
              }
          }, 0);
      }
  
      function drawline(el) {
          const indexLastId = window['arrayId'].length - 1;
          const lastId = window['arrayId'][indexLastId];
          const lastIdIndex = window['listArrayInputs'].indexOf(lastId);
          const numberOrderLast = lastIdIndex + 1;
          const yAxisPre = Math.ceil(numberOrderLast / window['numberCellInRow']);
          const xAxisPre = lastIdIndex - (window['numberCellInRow'] * (yAxisPre - 1));
  
          const index = window['listArrayInputs'].indexOf(el.id);
          const numberOrder = index + 1;
          const yAxis = Math.ceil(numberOrder / window['numberCellInRow']);
          const xAxis = index - (window['numberCellInRow'] * (yAxis - 1));
  
          const canvas = window['canvas'];
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.moveTo(window['tCell'].offsetWidth * xAxisPre, window['tCell'].offsetHeight * yAxisPre);
          ctx.lineTo(window['tCell'].offsetWidth * xAxis, window['tCell'].offsetHeight * yAxis);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#000';
          ctx.stroke();
          setTimeout(() => {
            window['arrayId'].push(el.id);
          }, 0);
      }
  
      function ngAfterViewInit() {
          const tableContent = document.getElementById('table-content');
          const cavasTableContent = tableContent.children[0].children[0];
          const canvas = document.createElement('canvas');
          window['canvas'] = canvas;
          canvas.id = 'CanvasLayer';
          canvas.width = cavasTableContent.offsetWidth;
          canvas.height = cavasTableContent.offsetHeight;
          canvas.style.zIndex = '-1';
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          cavasTableContent.appendChild(canvas);
  
          window['numberAlphabet'] = 1;
          window['beginInput'].parentElement.setAttribute('data-contentafter', 'A');
          window['beginInput'].parentElement.children[1].innerHTML='A';
          if (window['beginInput1']) {
              drawline(window['beginInput1']);
              window['numberAlphabet'] = 2;
              window['beginInput1'].parentElement.setAttribute('data-contentafter', 'B');
              window['beginInput1'].parentElement.children[1].innerHTML='B';
          }
      }
    </script>
    `;
}

function getKeyPad(typeAnswer) {
  let html = '';
  if (typeAnswer == 4 || typeAnswer == 5) {
    html += `
      <div id="keypad" #keypad>
      <div class="keypad-toggler hidden" onClick="keypadToggler()"><span class="gameSprite keypadclose fa fa-chevron-down"></span></div>
      <div class="keypad-container hidden numberKeypad clearfix " id="number-keypad" #keypadnumber>
          <div class="calcultorContainer">
              <ul class="keypad calcultor clearfix list-unstyled">
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li class="lastChild"><a onClick="deleteKey()"><span class="gameSprite keypadclose fa fa-long-arrow-left"></span></a></li>
                          <li class="lastChild"><a onClick="changeKey('keypadquerty')" class="swap qwertykeypad">abc</a></li>
                          <li class="lastChild"><a onClick="changeKey('keypadsymbol')" class="swap symbolkeypad">+/-</a></li>
                      </ul>
                  </li>
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li><a onClick="bindingkey(event)">.</a></li>
                          <li><a onClick="bindingkey(event)">,</a></li>
                          <li><a onClick="bindingkey(event)">0</a></li>
                      </ul>
                  </li>
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li><a onClick="bindingkey(event)">3</a></li>
                          <li><a onClick="bindingkey(event)">6</a></li>
                          <li><a onClick="bindingkey(event)">9</a></li>
                      </ul>
                  </li>
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li><a onClick="bindingkey(event)">2</a></li>
                          <li><a onClick="bindingkey(event)">5</a></li>
                          <li><a onClick="bindingkey(event)">8</a></li>
                      </ul>
                  </li>
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li><a onClick="bindingkey(event)">1</a></li>
                          <li><a onClick="bindingkey(event)">4</a></li>
                          <li><a onClick="bindingkey(event)">7</a></li>
                      </ul>
                  </li>
              </ul>
          </div>
      </div>
      <div class="keypad-container hidden" id="querty-keypad" #keypadquerty>
          <ul class="keypad list-unstyled biggerKeypad">
              <li class="clearfix">
                  <ul class="clearfix list-unstyled">
                      <li class="lastChild"><a onClick="deleteKey()"><span class="gameSprite keypadclose fa fa-long-arrow-left"></span></a></li>
                      <li><a onClick="bindingkey(event)">p</a></li>
                      <li><a onClick="bindingkey(event)">o</a></li>
                      <li><a onClick="bindingkey(event)">i</a></li>
                      <li><a onClick="bindingkey(event)">u</a></li>
                      <li><a onClick="bindingkey(event)">y</a></li>
                      <li><a onClick="bindingkey(event)">t</a></li>
                      <li><a onClick="bindingkey(event)">r</a></li>
                      <li><a onClick="bindingkey(event)">e</a></li>
                      <li><a onClick="bindingkey(event)">w</a></li>
                      <li><a onClick="bindingkey(event)">q</a></li>
                  </ul>
              </li>
              <li class="clearfix">
                  <ul class="clearfix list-unstyled">
                      <li class="lastChild keypad-number"><a onClick="changeKey('keypadnumber')" class="swap numberKeypadBtn">123</a></li>
                      <li><a onClick="bindingkey(event)">l</a></li>
                      <li><a onClick="bindingkey(event)">k</a></li>
                      <li><a onClick="bindingkey(event)">j</a></li>
                      <li><a onClick="bindingkey(event)">h</a></li>
                      <li><a onClick="bindingkey(event)">g</a></li>
                      <li><a onClick="bindingkey(event)">f</a></li>
                      <li><a onClick="bindingkey(event)">d</a></li>
                      <li><a onClick="bindingkey(event)">s</a></li>
                      <li><a onClick="bindingkey(event)">a</a></li>
                  </ul>
              </li>
              <li class="clearfix">
                  <ul class="clearfix list-unstyled">
                      <li class="lastChild"><a onClick="changeKey('keypadsymbol')" class="swap symbolkeypad">+/-</a></li>
                      <li><a onClick="uppercase()"><span class="gameSprite keypad-shift fa fa-arrow-up"></span></a></li>
                      <li><a onClick="bindingkey(event)">m</a></li>
                      <li><a onClick="bindingkey(event)">n</a></li>
                      <li><a onClick="bindingkey(event)">b</a></li>
                      <li class="keypad-space"><a onClick="bindingkey(event)">space</a></li>
                      <li><a onClick="bindingkey(event)">v</a></li>
                      <li><a onClick="bindingkey(event)">c</a></li>
                      <li><a onClick="bindingkey(event)">x</a></li>
                      <li><a onClick="bindingkey(event)">z</a></li>
                  </ul>
              </li>
          </ul>
      </div>
      <div class="keypad-container numberKeypad hidden clearfix" id="symbol-keypad" #keypadsymbol>
          <div class="calcultorContainer">
              <ul class="keypad calcultor clearfix list-unstyled">
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li class="lastChild"><a onClick="deleteKey()"><span class="gameSprite keypadclose fa fa-long-arrow-left"></span></a></li>
                          <li class="lastChild"><a onClick="changeKey('keypadquerty')" class="swap qwertykeypad">abc</a></li>
                          <li class="lastChild"><a onClick="changeKey('keypadnumber')" class="swap numberKeypadBtn">123</a></li>
                      </ul>
                  </li>
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li><a onClick="symbolbinding('equal')" [innerHtml]="equal | safeHtml">=</a></li>
                          <li><a onClick="symbolbinding('lessthan')" [innerHtml]="lessthan | safeHtml">
                                  <</a> </li> <li><a onClick="symbolbinding('greaterthan')" [innerHtml]="greaterthan | safeHtml">></a></li>
                      </ul>
                  </li>
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li><a onClick="symbolbinding('plus')" [innerHtml]="plus | safeHtml">&plus;</a></li>
                          <li><a onClick="symbolbinding('minus')" [innerHtml]="minus | safeHtml">&minus;</a></li>
                          <li><a onClick="symbolbinding('divide')" [innerHtml]="divide | safeHtml">&divide;</a></li>
                      </ul>
                  </li>
                  <li class="clearfix">
                      <ul class="clearfix list-unstyled">
                          <li><a onClick="symbolbinding('multi')" [innerHtml]="multi | safeHtml">&times;</a></li>
                      </ul>
                  </li>
              </ul>
          </div>
      </div>
     </div>`;
  }
  return html;
}


module.exports = {
  getScriptBackground,
  getScriptCanvas,
  getScriptPunchTouch,
  getScriptHTMLInput,
  getScriptPunchOrder,
  getScriptRadio,
  getScriptCheckbox,
  getKeyPad
}