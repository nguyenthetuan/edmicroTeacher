const renderMatarialDetail = (contentHtml,urlMedia) => {
    let html = `<div>`;
    html += `
<html style="overflow-x:hidden">
<head>
<title></title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="font47/css/font-awesome.min.css">
<body>
  <div>
  ${contentHtml}
  </div>
  `
  if (urlMedia) {
    html += `<audio controls>
        <source src="${urlMedia}">
      </audio>`
  }

  html+=
  `
</body>
</html>
`
    return html;
}

module.exports = {
    renderMatarialDetail,
};

