/**
 * 
 * Web select answer
 */

const getScriptWebToNative = ({ countOptions, typeAnswer, bgColorActive, colorAnswer, allowClick = true }) => {
    return `
        <script type="application/javascript">
            ${getScriptTextArea()}
            function myVideoAction(){
                let flashcardVideo = document.getElementById("flashcardVideo").innerHTML;
                if(flashcardVideo != ""){
                    window.ReactNativeWebView.postMessage("videoWeb---"+flashcardVideo);
                }
            }
            var indexA = -1;
            window.addEventListener('load', function() {
                var arrTest = [],warningE = '',reviewLast='',review='',reviewSlaE='';
                warningE = document.getElementById('warning');
                reviewLast = document.getElementById('reviewLast');
                review = document.getElementById('review');
                reviewSlaE = document.getElementById('reviewSla');
                try{
                    for(var i = 0; i < ${countOptions}; i++){
                        arrTest[i] = document.getElementById('viewOptions'+i);
                        FastClick.attach(arrTest[i]);
                    }
                }catch(err){
                }
                if(warningE){
                    FastClick.attach(warningE);
                    warningE.addEventListener('click', function(){
                        var numberQuestion = this.getAttribute('data-numberQuestion');
                        window.ReactNativeWebView.postMessage("warningWeb---"+numberQuestion);
                    });
                }
                if(reviewLast){
                    FastClick.attach(reviewLast);
                    reviewLast.addEventListener('click', function(){
                        var numberQuestion = document.getElementById('warning').getAttribute('data-numberQuestion');
                        var status = this.getAttribute('data-isBookmark');
                        window.ReactNativeWebView.postMessage("reviewLastWeb---"+numberQuestion+"---"+status);
                    });
                }
                if(reviewSlaE){
                    FastClick.attach(reviewSlaE);
                    reviewSlaE.addEventListener('click', function(){
                        var stepId = this.getAttribute('data-stepId');
                        window.ReactNativeWebView.postMessage("reviewLastWeb---"+stepId);
                    });
                }
                if(review){
                    FastClick.attach(review);
                    review.addEventListener('click', function(){
                        var flashcardId = document.getElementById("flashcardId").innerHTML;
                        if(flashcardId){
                            window.ReactNativeWebView.postMessage("reviewWeb---"+flashcardId);
                        }
                    });
                }
                ${getScriptOptions({ countOptions, typeAnswer, bgColorActive, colorAnswer, allowClick })}
            }, false);
        </script>  
    `;
}

const getScriptOptions = ({ countOptions, typeAnswer, bgColorActive, colorAnswer, allowClick }) => {
    return `
        arrTest.forEach(function (item, i) {
            if(arrTest[i]){
                arrTest[i].addEventListener('click', function(event) {
                    var type = ${typeAnswer};
                    var key = this.getAttribute('data-key');
                    var zindex = this.style.zIndex;
                    if(type == 1){
                        try{
                            if(zindex == 0){
                                document.getElementById("options"+key).style.backgroundColor="${!!colorAnswer ? colorAnswer : "#55bbea"}";
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
                        for(var k=0; k < ${countOptions}; k++){
                            document.getElementById("options"+k).style.backgroundColor="#333";
                            document.getElementById('viewOptions'+k).style.backgroundColor="#fff";
                        }
                        ${allowClick ? 
                        `
                        if(indexA != key){
                            document.getElementById("options"+key).style.backgroundColor="${!!colorAnswer ? colorAnswer : "#55bbea"}";
                            document.getElementById("viewOptions"+key).style.backgroundColor="${bgColorActive}";
                            indexA = key;
                        }else{
                            indexA = -1;
                        }
                        `
                        :
                        `
                        document.getElementById("options"+key).style.backgroundColor="${!!colorAnswer ? colorAnswer : "#55bbea"}";
                        document.getElementById("viewOptions"+key).style.backgroundColor="${bgColorActive}";
                        `
                        }
                        window.ReactNativeWebView.postMessage("chonseEventTest---"+indexA);
                        }
                }, false); 
            }
        });
    `;
}

const getScriptTextArea = () => {
    return `
        function auto_grow(element) {
            element.style.height = "5px";
            element.style.height = (element.scrollHeight)+"px";
        }
        function onchangeText(e){
            auto_grow(e);
            window.ReactNativeWebView.postMessage("changeText9---"+e.value);
        }
    `;
}

module.exports = {
    getScriptWebToNative
}