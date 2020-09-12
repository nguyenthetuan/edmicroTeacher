import { Platform } from 'react-native';

const getScriptNativeToWeb = ({ countOptions, bgOptionFalse, bgOptionTrue, bgViewTrue, type }) => {
    return `
    <script>
        ${Platform.OS == 'ios' ? `window.addEventListener('message', function(e) {
            var res = e.data.split("---");
            var type = res[0];
            if(type == 'initWebview'){
                initGlogbal();
            }
            if(type == 'disabledChonse'){
                disableChonse();
            }
            if(type == 'updateBookmark'){
                var bookMarkStatus = res[1];
                updateBookMark(bookMarkStatus);
            }
            if(type == "sendAnswerSla"){
                var answer = JSON.parse(res[1]);
                var optionCount = res[2];
                showAnswerPractice(answer, optionCount);
            }
            if(type == "sendAnswerSelf"){
                var answer = JSON.parse(res[1]);
                var optionCount = res[2];
                showAnswerSelf(answer, optionCount);
            }
            if(type =='updateStar'){
                updateStar(res[1]);
            }
        });`: `document.addEventListener('message', function(e) {
            var res = e.data.split("---");
            var type = res[0];
            if(type == 'initWebview'){
                initGlogbal();
            }
            if(type == 'disabledChonse'){
                disableChonse();
            }
            if(type == 'updateBookmark'){
                var bookMarkStatus = res[1];
                updateBookMark(bookMarkStatus);
            }
            if(type == "sendAnswerSla"){
                var answer = JSON.parse(res[1]);
                var optionCount = res[2];
                showAnswerPractice(answer, optionCount);
            }
            if(type == "sendAnswerSelf"){
                var answer = JSON.parse(res[1]);
                var optionCount = res[2];
                showAnswerSelf(answer, optionCount);
            }
            if(type =='updateStar'){
                updateStar(res[1]);
            }
        });` }
        

        function initGlogbal(){
            for(var i=0; i<${countOptions}; i++){
                document.getElementById("viewOptions"+i).style.backgroundColor="#fff";
                document.getElementById("options"+i).style.backgroundColor="#333";
            }
        }

        function disableChonse(){
            document.getElementById('wrapdisabledOption').style.display="block";
        }

        function warningError(numberQuestion){
            window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
        }

        function updateBookMark(status){
            if(status == 1){
                document.getElementById('iconBookmark').style.color = "#ffd500";
            }else{
                document.getElementById('iconBookmark').style.color = "#9b9b9b";
            }
        }

        function showAnswerSelf(answer, optionCount){
            showDataSelf(answer);
        }

        function updateStar(status){
            if(status == 2 || status == 4){
                document.getElementById('starId').style.color = "#F9AB3B";
            }else{
                document.getElementById('starId').style.color = "#9b9b9b";
            }
        }

        function hideKeyPad() {
            $('#number-keypad').addClass('hidden');
            $('#querty-keypad').addClass('hidden');
            $('#symbol-keypad').addClass('hidden');
            $('.keypad-toggler').addClass('hidden');
            $('.template-default').removeClass('scrollKey');
            $('input').removeClass('activeInput');
        }

        function showAnswerPractice(answer, optionCount){
            hideKeyPad();
            var userOptionId = answer.userOptionId;
            var answerOptionId = answer.answerOptionId;
            var isAnswer = ${type == 1 ? 'answer.isAnswer' : 'answer.rightAnswer'}
            if(isAnswer == true){
                document.getElementById("resultTrue").style.display="inline-block";
            }else if(isAnswer ==false){
                document.getElementById("resultFalse").style.display="inline-block";
            }

            try{
                if(optionCount > 0){
                    for(var i = 0; i < optionCount; i++) {
                        var option = document.getElementById("options"+i);
                        var viewOption = document.getElementById("viewOptions"+i);
                        if(option){
                            option.style.backgroundColor="#333";
                        }
                        if(viewOption){
                            viewOption.style.backgroundColor="#fff";
                        }
                    }
                }
                if(userOptionId.length > 0) {
                    for(var j = 0; j < userOptionId.length; j++){
                        var option = document.getElementById("options"+userOptionId[j]);
                        var viewOption = document.getElementById("viewOptions"+userOptionId[j]);
                        if(option){
                            option.style.backgroundColor="${bgOptionFalse}";
                        }
                        if(viewOption){
                            viewOption.style.backgroundColor="#fef4f4";
                        }
                    }
                }
                if(answerOptionId.length > 0) {
                    for(var k = 0; k < answerOptionId.length; k++){
                        var option = document.getElementById("options"+answerOptionId[k]);
                        var viewOption = document.getElementById("viewOptions"+answerOptionId[k]);
                        if(option && viewOption){
                            option.style.backgroundColor="${bgOptionTrue}";
                            viewOption.style.backgroundColor="${bgViewTrue}";
                        }
                    }
                }
                showDataSelf(answer);
            }catch(err){
            }
        }

        function showDataSelf(answer){
            var myInput = document.getElementsByTagName('input');
            if(myInput){
                for(var i = 0; i < myInput.length; i++){
                    myInput[i].blur();
                }
            }
            var totalView = answer.totalView;
            var totalRight = answer.totalRight;

            ${type == 1 ?
            `
                    var totalView = answer.attempted;
                    var totalRight = answer.gotRight;
                    document.getElementById("people").innerHTML = totalView;
                    document.getElementById("pecent").innerHTML = totalRight;
                `
            :
            `
                    var totalCorrects = answer.totalCorrects;
                    var totalInCorrects = answer.totalInCorrects;
                    var totalQuestion = totalCorrects + totalInCorrects;
                    var pecent = 0;
                    if(totalQuestion != 0){
                        pecent = ((totalCorrects / totalQuestion) * 100).toFixed(1);
                    }
                    document.getElementById("people").innerHTML = answer.index;
                    document.getElementById("pecent").innerHTML = pecent;
                `
        }
            var flashcardId = answer.flashcardId;
            var flashcardVideo = answer.flashcardVideo;
            if(flashcardId){
                document.getElementById("review").style.display = "inline-block";
                document.getElementById("flashcardId").innerHTML = answer.flashcardId;
            }else{
                document.getElementById("review").style.display = "none";
            }
            if(flashcardVideo){
                document.getElementById("revideo").style.display = "inline-block";
                document.getElementById("flashcardVideo").innerHTML = answer.flashcardVideo;
            }else{
                document.getElementById("revideo").style.display = "none";
            }
            document.getElementById("answer").style.display = "block";
            let explainQuestion = ${type == 1 ? `answer.explain` : `answer.explainQuestion`}
            if(explainQuestion){
                document.getElementById("explain").innerHTML = explainQuestion;
                MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            }
          
        }
    </script>
    `;
}

module.exports = {
    getScriptNativeToWeb
}