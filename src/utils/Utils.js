import { Platform } from 'react-native';
// import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

// const tracker = new GoogleAnalyticsTracker('UA-110313133-1');

module.exports = {

  trackScreen: (currentScreen) => {
    let name = 'onluyen.android.';
    if (Platform.OS === 'ios') name = 'onluyen.ios.';
    // tracker.trackScreenView(name + currentScreen);
  },

  covertIndex: (index) => {
    index++;
    if (index === 1) return 'A';
    if (index === 2) return 'B';
    if (index === 3) return 'C';
    if (index === 4) return 'D';
    if (index === 5) return 'E';
    if (index === 6) return 'F';
    if (index === 7) return 'G';
    if (index === 8) return 'H';
    if (index === 9) return 'I';
    if (index === 10) return 'K';
    if (index === 11) return 'L';
    if (index === 12) return 'M';
    if (index === 13) return 'N';
    return '';
  },

  getTime: (timeStamp, format) => {
    // dd.mm.yyyy hh:MM:ss
    // const t = new Date();
    // t.setSeconds(timeStamp);
    // return formatted = t.format(format);
    // timeStamp *= 1000;
    // const todate = new Date(timeStamp).getDate();
    const tomonth = new Date(timeStamp * 1000).getMonth() + 1;
    const toyear = new Date(timeStamp * 1000).getFullYear();
    const originalDate = 'THÁNG ' + tomonth + ' - ' + toyear;
    return originalDate;
  },
  getDate: (timeStamp) => {
    return new Date(timeStamp * 1000);
  },

  convertSeconds: (totalSeconds) => {
    if (totalSeconds < 1) return '00:00';

    let h = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let m = Math.floor(totalSeconds / 60);
    let s = Math.floor(totalSeconds % 60);

    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    if (h > 0) return `${h}:${m}:${s}`;
    else return m + ':' + s;
  },
  convertTimeToString: (totalSeconds) => {
    if (totalSeconds < 1) return '00:00';

    let h = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let m = Math.floor(totalSeconds / 60);
    h = h < 1 ? '' : h + ' giờ ';
    m = m < 1 ? '0 giờ' : m + ' phút';
    return h + m;
  },
  convertTimeHMDMY: (time) => {
    if (time) {
      let Day = new Date(time * 1000).getDate();
      let Month = new Date(time * 1000).getMonth();
      let Year = new Date(time * 1000).getFullYear();
      let Hour = new Date(time * 1000).getHours();
      let Minute = new Date(time * 1000).getMinutes();

      Month++;
      if (Day < 10) {
        Day = `0${Day}`;
      }
      if (Month < 10) {
        Month = `0${Month}`;
      }
      if (Year < 10) {
        Year = `0${Year}`;
      }
      if (Hour < 10) {
        Hour = `0${Hour}`;
      }
      if (Minute < 10) {
        Minute = `0${Minute}`;
      }
      return `${Hour}:${Minute} - ${Day}/${Month}/${Year}`;
    } else return
  },
  convertTimeDMY: (time) => {
    let Day = new Date(time * 1000).getDate();
    let Month = new Date(time * 1000).getMonth();
    let Year = new Date(time * 1000).getFullYear();
    Month++;
    if (Day < 10) {
      Day = `0${Day}`;
    }
    if (Month < 10) {
      Month = `0${Month}`;
    }
    if (Year < 10) {
      Year = `0${Year}`;
    }
    return `${Day}/${Month}/${Year}`;
  },


  convertTimeDMYHM: (time) => {
    let Day = new Date(time * 1000).getDate();
    let Month = new Date(time * 1000).getMonth();
    let Year = new Date(time * 1000).getFullYear();
    let Hour = new Date(time * 1000).getHours();
    let Minute = new Date(time * 1000).getMinutes();
    Month++;
    if (Day < 10) {
      Day = `0${Day}`;
    }
    if (Month < 10) {
      Month = `0${Month}`;
    }
    if (Year < 10) {
      Year = `0${Year}`;
    }
    if (Hour < 10) {
      Hour = `0${Hour}`;
    }
    if (Minute < 10) {
      Minute = `0${Minute}`;
    }
    return `${Hour}:${Minute}  ${Day}/${Month}/${Year}`;
  },

  countDown: (timeEnd) => {
    let currentTime = new Date();
    let endTime = new Date(timeEnd * 1000);
    let totalSeconds = endTime - currentTime;
    if (totalSeconds <= 0) return '00:00';
    if (totalSeconds < 24 * 60 * 60) {
      let h = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let m = Math.floor(totalSeconds / 60);
      let s = Math.floor(totalSeconds % 60);

      h = h < 10 ? '0' + h : h;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      if (h > 0) return `${h} giờ ${m} phút ${s} giây`;
      else return m + ' phút ' + s + ' giây';
    } else {
      let temp = totalSeconds / (24 * 60 * 60 * 1000);
      let d = Math.floor(temp);
      temp = (temp - d) * 24;
      let h = Math.floor(temp);
      temp = (temp - h) * 60;
      let m = Math.floor(temp);
      temp = (temp - m) * 60;
      let s = Math.floor(temp);
      d = d < 10 ? '0' + d : d;
      h = h < 10 ? '0' + h : h;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;

      return `${d} ngày ${h} giờ ${m} phút ${s} giây`;
    }
  },

  countDownTime: (timeEnd) => {
    let currentTime = new Date();
    let endTime = new Date(timeEnd * 1000);
    let totalSeconds = endTime - currentTime;
    if (totalSeconds <= 0) return '00:00';
    if (totalSeconds < 24 * 60 * 60) {
      let h = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let m = Math.floor(totalSeconds / 60);
      let s = Math.floor(totalSeconds % 60);

      h = h < 10 ? '0' + h : h;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      if (h > 0) return `${h} giờ ${m} phút ${s} giây`;
      else return m + ' phút ' + s + ' giây';
    } else {
      let temp = totalSeconds / (24 * 60 * 60 * 1000);
      let d = Math.floor(temp);
      temp = (temp - d) * 24;
      let h = Math.floor(temp);
      temp = (temp - h) * 60;
      let m = Math.floor(temp);
      temp = (temp - m) * 60;
      let s = Math.floor(temp);
      d = d < 10 ? '0' + d : d;
      h = h < 10 ? '0' + h : h;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      let time = ((d * 24 + h) * 60 + m) * 60 + s;
      return time;
    }
  },

  getHtmlMath: (mathText, size, align = true) => {
    //  if(Platform.OS === 'ios')size=30;
    // const mathText=mathText.replace('\\(', '\$').replace('\\)','\$');
    // mathText = mathText.replace('(VD', 'VD').replace(')<br>', '<br>').replace('$y={{x}^{4}}$ c&oacute; $f&#39;\\left( 0 \\right)=0,f&#39;&#39;\\left( 0 \\right)=0$ c&oacute; cực trị tại \\({x}=0\\)', '');

    // mathText = decodeURIComponent(mathText);
    // console.log(mathText);
    let script = `
        <script>
        
          window.location.hash = 1;
          const calculator = document.createElement("div");
          calculator.id = "height-calculator";
          while (document.body.firstChild) {
              calculator.appendChild(document.body.firstChild);
          }
         document.body.appendChild(calculator);
          document.title = calculator.scrollHeight;

        </script>
        `;

    if (Platform.OS === 'ios') {
      script = `
        <script>
        ;(function() {
        var wrapper = document.createElement("div");
        wrapper.id = "height-calculator";
        while (document.body.firstChild) {
            wrapper.appendChild(document.body.firstChild);
        }
        
        document.body.appendChild(wrapper);
        
        var i = 0;
        function updateHeight() {
            document.title = wrapper.clientHeight;
            window.location.hash = ++i;
        }
        updateHeight();
        
        window.addEventListener("load", function() {
            updateHeight();
            setTimeout(updateHeight, 1000);
        });
        
        window.addEventListener("resize", updateHeight);
        }());
        </script>
        `;
    }

    const style = `
        <style>
          body, html, #height-calculator {
            margin: 0;
            margin-left:15px;
            margin-right:15px;
            padding: 0;
            font-size:14px !important;
            outline: 0px solid transparent;
          }
          #height-calculator {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              top: 50%;
              -ms-transform: translateY(-50%);
              -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
              outline: 0px solid transparent;
              overflow:hidden;
          }
          #height-calculator img {
            float: inherit !important;display:block; max-width: 100%; margin: 0 auto 4px auto !important;
          }
          #height-calculator p img {
            float: inherit !important;display:block; max-width: 100%; margin: 0 auto 4px auto !important;
          }
          :focus{
            outline:0px;
          }
        </style>`;
    const style2 = `
        <style>
          body, html {
              margin: 0;
              margin-left:15px;
              margin-right:15px;
              font-size:14px !important;
              outline: 0px solid transparent;
          }
          #height-calculator {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            overflow:hidden;
          }
          #height-calculator img {
            float: inherit !important;display:block; max-width: 100%; margin: 0 auto 4px auto !important;
          }
          #height-calculator p img {
            float: inherit !important;display:block; max-width: 100%; margin: 0 auto 4px auto !important;
          }
          :focus{
            outline:0px;
          }
          </style>`;

    const scriptM = `
    <style>
      body{
        opacity:0;
      }
    </style>
       <script src="MathJax.min.js"></script>
        <script>
          MathJax.Hub.Config({
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
            inlineMath: [['$','$'],['\\\\(','\\\\)'],['\\\\[','\\\\]'],['\\left(','\\right)'],['\\left|','\\right|']],
            displayMath: [ ['$$','$$']],
            processEscapes: true,
            preview: "none",
                }
            });
        </script>
        <script type="text/javascript">
        MathJax.Hub.Queue(function () {
              document.title = document.getElementById("divmathjax").scrollHeight;
        });

        MathJax.Hub.Queue(function () {
          document.title = document.getElementById("divmathjax").scrollHeight;
          document.body.style.opacity = 1;
        });
        // var myTimeOut;
        // if(myTimeOut){
        //   clearTimeout(myTimeOut);
        // }
        // myTimeOut = setTimeout(function(){ document.body.style.opacity = 1; }, 350);

        </script> 
        `;
    const html = `
        <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        ${scriptM}
        </head>
        <body>
        <div id="divmathjax" style="overflow:auto">
        ${mathText}
        </div>
        </body>
        </html>`;

    if (align) return html + style + script;
    return html + style2 + script;
  },

  /**
 *  regular: regular
 *  pdf: pdf
 *  image: image
 */
  AssignmentContentType: {
    regular: 0,
    pdf: 1,
    image: 2,
    image: 3
  }
};

{ /* <script type="text/javascript">
       MathJax.Hub.Queue(function () {
             document.title = document.getElementById("divmathjax").clientHeight;
       });
       </script> */ }
