export const IndexJS = `
<script type="text/javascript">
    var urlImage = 'https://s3-ap-southeast-1.amazonaws.com/onluyen-assignment-submission/assign/6058582bbe0e0b2251a753ce/60385788db1555be29eeea90/attachment/6058583fbe0e0b2251a7541e.jpg';
    var touchSize = 32;
    const rightAnswerColor = 'green';
    const wrongAnswerColor = 'red';

    let = jsonData = [{ "imgSrc": "https://s3-ap-southeast-1.amazonaws.com/onluyen-assignment-submission/assign/605852f4be0e0b2251a74ed5/60385788db1555be29eeea90/attachment/605853c2be0e0b2251a74fe0.jpg", "points": [{ "correct": 1, "top": "8%", "left": "15.7%" }, { "correct": 2, "top": "16.5%", "left": "80.8%" }, { "correct": 1, "top": "44.7%", "left": "79.3%" }, { "correct": 2, "top": "58.4%", "left": "71.1%" }, { "correct": 1, "top": "84%", "left": "23.3%" }], "imgFileName": "" }, { "imgSrc": "https://s3-ap-southeast-1.amazonaws.com/onluyen-assignment-submission/assign/605852f4be0e0b2251a74ed5/60385788db1555be29eeea90/attachment/605853c9be0e0b2251a74fe3.jpg", "points": [{ "correct": 1, "top": "8.8%", "left": "83%" }, { "correct": 2, "top": "49.6%", "left": "89.6%" }], "imgFileName": "" }, { "imgSrc": "https://s3-ap-southeast-1.amazonaws.com/onluyen-assignment-submission/assign/605852f4be0e0b2251a74ed5/60385788db1555be29eeea90/attachment/605853cbbe0e0b2251a74fe4.jpg", "points": [{ "correct": 2, "top": "25.5%", "left": "18.9%" }], "imgFileName": "" }, { "imgSrc": "https://s3-ap-southeast-1.amazonaws.com/onluyen-assignment-submission/assign/605852f4be0e0b2251a74ed5/60385788db1555be29eeea90/attachment/605853cebe0e0b2251a74fe5.png", "points": [{ "correct": 2, "top": "14.5833%", "left": "18.8%" }], "imgFileName": "" }, { "imgSrc": "https://s3-ap-southeast-1.amazonaws.com/onluyen-assignment-submission/assign/605852f4be0e0b2251a74ed5/60385788db1555be29eeea90/attachment/605853d0be0e0b2251a74fe6.jpg", "points": [{ "correct": 1, "top": "34.3%", "left": "10%" }], "imgFileName": "" }];

    console.log(jsonData);

    var group = $('.group');

    const innerWidth = window.innerWidth;
    const innerHeight = 246;

    var deg = 0;
    var isScrolling = false;
    var isMouseDown = false;
    var isMouseUp = false;

    var canvas = [];

    for (let i = 0; i < group.length; i++) {
        canvas[i] = new fabric.Canvas('canvas-' + i, {
            width: innerWidth,
            height: innerHeight,
            backgroundColor: '#ddd',
            allowTouchScrolling: true
        });
    }

    var rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: 'red',
        top: 100,
        height: 100
    });

    function formatScore(number_corect, number_incorect) {
        let score = 0.0;
        let total = number_corect + number_incorect;
        if (total == 0) {
            return '0.00';
        } else {
            return ((number_corect / total) * 10).toFixed(2);
        }
    }

    function renderHtml(number_corect, number_incorect) {
        let score = formatScore(number_corect, number_incorect);
        let total = number_corect + number_incorect;
        let textWarning = "Điểm dự kiến: " + number_corect + "/" + total + " = " + score + " điểm (Điểm dựa trên số câu đúng, sai không phải điểm của bài tập)"
        $('#number-correct').html("Số câu đúng " + number_corect);
        $('#number-incorrect').html("Số câu sai " + number_incorect);
        $('#input-score').val(score);
        $('#text-warning').html(textWarning);
    }

    function updateScore(o) {
        let number_corect = 0;
        let number_incorect = 0;
        for (let i = 0; i < o.length; i++) {
            let obj = o[i];
            if (obj.type == 'rect' && obj.active) {
                number_corect++;
            }
            if (obj.type == 'rect' && !obj.active) {
                number_incorect++;
            }
        }
        renderHtml(number_corect, number_incorect);
    }

    function getAllObject() {
        let objects = [];
        for (let i = 0; i < group.length; i++) {
            let canvasObj = canvas[i].getObjects();
            objects = objects.concat(canvasObj);
        }
        updateScore(objects);
    }

    function onRotate(i) {
        var objs = canvas[i].getObjects().map(function (o) {
            if (o.type == 'background') {
                o.rotate(deg += 90);
                canvas[i].renderAll();
            }
        });
    }

    function addRect(x, y, b, i) {
        let icon = b == true ? 'd.png' : 's.png';
        let offsetX = x - touchSize / 2;
        let offsetY = y - touchSize / 2;
        new fabric.Image.fromURL(icon, function (img) {
            img.set({
                id: 1,
                width: touchSize,
                height: touchSize,
                fill: rightAnswerColor,
                top: offsetY,
                left: offsetX,
                type: 'rect',
                active: b
            });
            img.set('selectable', false);
            canvas[i].add(img);
            getAllObject();
        });
    }

    function updateRect(target, i) {
        let active = target.active;
        if (active) {
            let x = target.left + touchSize / 2;
            let y = target.top + touchSize / 2;
            canvas[i].remove(target);
            addRect(x, y, false, i);
            getAllObject();
        } else {
            canvas[i].remove(target);
            getAllObject();
        }
    }

    function updateInitPoint(points, i) {
        try {
            points.forEach(function (val, key) {
                let x = Number.parseFloat(val.left) * innerWidth / 100;
                let y = Number.parseFloat(val.top) * innerHeight / 100;
                let correct = val.correct == 1;
                addRect(x, y, correct, i);
            });
        } catch (err) {
            console.log(err);
        }
    }

    async function initLoad(jsonData) {
        canvas.forEach(function (value, i) {
            let item = jsonData[i];
            fabric.Image.fromURL(item.imgSrc, function (img) {
                canvas[i].add(img);
                img.set({
                    type: 'background'
                });
                img.set('selectable', false);
                img.scaleToWidth(innerWidth, false);
                updateInitPoint(item.points, i);
            });
        });
    }

    function mouseEvent(options, i) {
        if (options.target) {
            let type = options.target.type;
            if (type == 'background') {
                let x = options.pointer.x;
                let y = options.pointer.y;
                addRect(x, y, true, i);
            }
            if (type == 'rect') {
                updateRect(options.target, i);
            }
        }
    }

    function addEvent() {
        canvas.forEach(function (v, i) {
            canvas[i].on('mouse:down', function (options) {
                isMouseDown = true;
            });
            canvas[i].on('mouse:up', function (options) {
                isMouseUp = true;
                isMouseDown = false;
                if (isScrolling == false && isMouseDown == false) {
                    isScrolling = false;
                    mouseEvent(options, i);
                }
                isScrolling = false;
            });
        });
    }


    $(document).ready(function(){
        initLoad(jsonData);
        $(window).scroll(function () {
            clearTimeout($.data(this, 'scrollTimer'));
            isScrolling = true;
            $.data(this, 'scrollTimer', setTimeout(function () {
                if(isMouseDown){
                    isScrolling = true;
                }else{
                    isScrolling = false;
                }
            }, 30));
        });
        addEvent();
    })

</script>

`;