const renderHomeWork = (contentHtml, urlMedia) => {
    let html = `<div>`;
    html += `
<html style="overflow-x:hidden">
<head>
<title></title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="font47/css/font-awesome.min.css">
<script>
function imageDetail (arrayurlImage){
  window.ReactNativeWebView.postMessage("urlImage---"+arrayurlImage);
}
</script>
<body>
  <div>
  ${contentHtml || ''}
  </div>
  `
    if (urlMedia.length) {
        for (let i = 0; i < urlMedia.length; i++) {
            html += `
            <div id="reason-img" onclick="imageDetail('${urlMedia[i]}')">
             <img style=" width: 100%; height: 100%;"src="${urlMedia[i]}" alt="Italian Trulli">
            </div>
            `
        }
    }

    html +=
        `
</body>
</html>
`
    return html;
}

module.exports = {
    renderHomeWork,
};

