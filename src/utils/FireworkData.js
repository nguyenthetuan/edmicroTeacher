import { HEIGHT_DEVICE as height } from '../constants/const';
export const result_practice_finish = `
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <title>jQuery-fireworks Demo</title>
    <link rel="stylesheet" href="font47/css/font-awesome.min.css" />
    <style>
    html,
    * {
        margin: 0;
        padding: 0
    }

    body {
        width: 100%;
        height: 100%;
    }

    .demo {
        margin: 0 auto;
        width: 100%;
        height: 100%;
    }

    h1 {
        margin: 150px auto 30px auto;
        text-align: center;
        font-family: 'Nunito';
    }
    </style>
</head>

<body>
    <div class="demo">
    </div>
    <div style="position:absolute;top:0;left:0;right:0;text-align:center;">
        <p style="color:#fff;font-size:24px;text-align:center;margin-top:${height / 3}px">Bạn đã hoàn thành bài luyện !</p>
        <i class="fa fa-trophy" aria-hidden="true" style="font-size:60px;color:#fff;margin: 30px auto 10px auto; display: block;
      text-align: center;"></i>
    </div>
    <script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="jquery.fireworks.js"></script>
    <script>
    $('.demo').fireworks({ sound: true, opacity: 0.9, width: '100%', height: '100%' });
    </script>
</body>

</html>`;



