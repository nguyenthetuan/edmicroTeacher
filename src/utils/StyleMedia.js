const styleMedia = `
<style type="text/css">
@media screen and (max-width: 768px) {
  .mathplay-header {
    background: none !important;
  }
  .mathplay-header .pause-btn.active::before {
    border: 4px solid #ff7300 !important;
  }
  .mathplay-header .pause-btn.active::after {
    border: 4px solid #ff7300 !important;
  }
  .mathplay-header .pause-timer-val {
    color: #17bcba !important;
  }

  .template-default h1 {
    font-size: 14px !important;
  }
  .template-default h2 {
    font-size: 13px !important;
    margin-left: 5px;
  }
  .template-default h3 {
    font-size: 13px !important;
  }
  .template-default .step-content {
    top: 2px;
    max-height: calc(100vh - 50px) !important;
  }
  .template-default .step-content #step {
    width: 100%;
    border: none;
    box-shadow: unset;
    top: 1px;
  }
  .template-default .step-content #step .question-header {
    display: none;
  }
  .template-default .step-content #step .question-name {
    margin-top: 0px;
    padding-top: 5px;
  }
  .template-default #step .question-name .symbol-correct-answer, .template-default #step .question-name .symbol-wrong-answer {
    left: 5px;
  }

  .template-2 .justify-content-center .d-inline {
    margin: 0px !important;
  }
  .template-2 input[type=text] {
    width: 72% !important;
  }

  .template-2 .table tr td:first-child{
    width:auto !important;
  }

  .template-3 .item-image {
    width: 100% !important;
  }
  .template-3 .item-image img {
    width: 100% !important;
    max-height: 40vh !important;
  }
  .template-3 img {
    width: 100% !important;
    max-height: 40vh !important;
  }
  .template-3 .item-text {
    margin: 0px !important;
  }
  .template-3 span {
    font-size: 13px !important;
  }
  .template-3 p {
    margin-bottom: 2px;
  }

  .template-6 .dragula img {
    max-height: 60px !important;
    max-width: 60px !important;
    z-index: 9999;
  }
  .template-6 .dropable-number {
    display: flex;
    height: auto !important;
  }

  .template-7 img {
    max-height: 30vh !important;
  }
  .template-7 .mathplay-question {
    margin: 0 auto !important;
    margin-top: 5px !important;
  }
  .template-7 .mathplay-question .col-md-7 {
    border-radius: unset !important;
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
  .template-7 .mathplay-question .col-md-7 h3 {
    margin: auto !important;
    font-size: 14px !important;
    width: auto !important;
    height: auto !important;
  }
  .template-7 .mathplay-question .col-md-5 {
    display: flex;
  }
  .template-7 .mathplay-question .col-md-5 > div {
    box-shadow: unset !important;
    padding: 0 !important;
    margin-top: 0px !important;
    background: unset !important;
    margin-right: 5px;
    width: 50%;
  }
  .template-7 .mathplay-question .col-md-5 > div input + label.form-check-label {
    font-size: 14px !important;
    width: 100%;
    background: #ff7300;
    line-height: 35px;
    padding: 0 !important;
    margin-top: 3px;
    margin: 0px !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  .template-7 .mathplay-question .col-md-5 > div .form-check {
    margin-bottom: 0px;
  }
  .template-7 .mathplay-question .col-md-5 > div input[type=radio]:checked + label.form-check-label {
    // background: #17bcba !important;
  }

  .template-8 .custom-box {
    height: 60px !important;
    font-size: 16px !important;
    line-height: 60px;
    margin: 5px 0px !important;
  }
  .template-8 .custom-box img {
    max-height: 60px !important;
    width: auto !important;
    margin: 0px !important;
  }
  .template-8 .custom-box.left-pointer.selected {
    // background-color: #1e9f98 !important;
  }
  .template-8 .custom-box.left-pointer.answered {
    // background-color: #ff7300 !important;
  }
  .template-8 .custom-box.right-pointer.selected {
    // border: 1px solid #1e9f98 !important;
  }
  .template-8 .custom-box.right-pointer.answered {
    // border: 1px solid #ff7300 !important;
  }
  .template-8 .btn.btn-danger.active {
    background-color: #ff7300 !important;
    box-shadow: unset !important;
    border-radius: unset !important;
    border-color: unset !important;
    font-size: 18px !important;
  }

  .template-9 table td {
    width: 50px !important;
    height: 45px !important;
  }

  .template-10 .align-items-center {
    overflow: hidden;
  }
  .template-10 .align-items-center h1 {
    font-size: 40px !important;
  }
  .template-10 .align-items-center input {
    color: #ff7300 !important;
  }

  .template-11 .col > div {
    width: auto !important;
  }
  .template-11 .col > div img {
    max-width: 20vh !important;
  }
  .template-11 .col .mathplay-select {
    width: 100px !important;
  }

  .template-14 img.item-img {
    width: auto !important;
    max-height: 40vh !important;
  }
  .template-14 h3 span {
    font-size: 13px !important;
  }

  .template-15 #table-content .tCell {
    width: 25px !important;
    height: 25px !important;
  }
  .template-15 #reset {
    position: fixed;
    bottom: 30%;
    right: 50px;
  }

  .template-16 h2 span {
    font-size: 13px !important;
  }
  .template-16 .dragula {
    margin-top: 15px;
  }
  .template-16 .dragula button {
    min-width: 70px !important;
    max-width: 85px !important;
    width: 100% !important;
    margin: 0px !important;
    border: 2px solid;
    font-size: 18px !important;
    padding: 10px 0px;
  }

  .template-17 .col-md-12 > div {
    margin-bottom: 5px !important;
    max-height: 40vh;
    // margin: 0px !important;
    display: block !important;
  }
  .template-17 p {
    margin: auto !important;
    font-size: 13px !important;
  }
  .template-17 img {
    width: auto !important;
    max-height: 40vh !important;
    margin: auto !important;
  }
  .template-17 input[type=radio]:checked + label.form-check-label {
    // background: #1e9f98 !important;
  }
  .template-17 .row:nth-child(2) .col-md-12 .div:first-child {
    margin-bottom: 0px !important;
  }
  .template-17 .form-check {
    background: unset !important;
    font-size: unset !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    width: auto !important;
    float: left;
  }
  .template-17 .font-size {
    font-size: unset;
  }
  .template-17 input + label.form-check-label {
    line-height: 40px;
    font-size: 14px !important;
    background: #ff7300;
    box-shadow: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
  }

  .template-18 input[type=radio]:checked + label.form-check-label {
    border: 1px solid #1e9f98;
    border-color: #1e9f98 !important;
  }
  .template-18 .form-check .form-check-label {
    height: 45vh !important;
  }
  .template-18 .col-md-12 {
    display: flex !important;
  }
  .template-18 .col-md-12 > div {
    margin: auto !important;
  }

  .template-19 div.item-content {
    margin-top: 0px !important;
  }
  .template-19 label.item-content {
    display: flex !important;
    margin: 0 !important;
  }
  .template-19 label.item-content img {
    margin: auto !important;
    max-height: 90px !important;
  }

  .template-20 .col-md-12 > div {
    margin-bottom: 5px !important;
    max-height: 40vh;
    margin: 0px !important;
    display: flex !important;
  }
  .template-20 p {
    margin: auto !important;
    font-size: 13px !important;
  }
  .template-20 img {
    width: auto !important;
    max-height: 40vh !important;
    margin: auto !important;
  }
  .template-20 input[type=radio]:checked + label.form-check-label {
    background: #1e9f98 !important;
  }
  .template-20 .row:nth-child(2) .col-md-12 .div:first-child {
    margin-bottom: 0px !important;
  }
  .template-20 .form-check {
    background: unset !important;
    font-size: unset !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 5px !important;
    width: 100%;
  }
  .template-20 .font-size {
    font-size: unset;
  }
  .template-20 input + label.form-check-label {
    line-height: 40px;
    font-size: 14px !important;
    background: #ff7300;
    box-shadow: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
  }
}
@media screen and (max-width: 480px) {
  .mathplay-header {
    background: none !important;
  }
  .mathplay-header .pause-btn.active::before {
    border: 4px solid #ff7300 !important;
  }
  .mathplay-header .pause-btn.active::after {
    border: 4px solid #ff7300 !important;
  }
  .mathplay-header .pause-timer-val {
    color: #17bcba !important;
  }

  .template-default h1 {
    font-size: 14px !important;
  }
  .template-default h2 {
    font-size: 13px !important;
  }
  .template-default h3 {
    font-size: 13px !important;
  }
  .template-default .step-content {
    top: 35px;
    max-height: calc(100vh - 80px) !important;
  }
  .template-default .step-content #step {
    width: 100%;
    border: none;
    box-shadow: unset;
    top: 1px;
  }
  .template-default .step-content #step .question-header {
    display: none;
  }
  .template-default .step-content #step .question-name {
    margin-top: 0px;
    padding-top: 5px;
  }
  .template-default #step .question-name .symbol-correct-answer, .template-default #step .question-name .symbol-wrong-answer {
    left: 5px;
  }

  .template-2 .justify-content-center .d-inline {
    margin: 0px !important;
  }
  .template-2 input[type=text] {
    width: 72% !important;
  }

  .template-3 .item-image {
    width: 100% !important;
  }
  .template-3 .item-image img {
    width: 100% !important;
    max-height: 40vh !important;
  }
  .template-3 img {
    width: 100% !important;
    max-height: 40vh !important;
  }
  .template-3 .item-text {
    margin: 0px !important;
  }
  .template-3 span {
    font-size: 13px !important;
  }
  .template-3 p {
    margin-bottom: 2px;
  }

  .template-6 .dragula {
    height: 62px;
  }
  .template-6 .dragula img {
    max-height: 60px !important;
    max-width: 60px !important;
    z-index: 9999;
  }
  .template-6 .dropable-number {
    display: block;
    height: auto !important;
  }
  .template-6 .dropable-number .item-less {
    width: 93% !important;
    height: 26vh;
  }

  .template-7 img {
    max-height: 30vh !important;
  }
  .template-7 .mathplay-question {
    margin: 0 auto !important;
    margin-top: 5px !important;
  }
  .template-7 .mathplay-question .col-md-7 {
    border-radius: unset !important;
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
  .template-7 .mathplay-question .col-md-7 h3 {
    margin: auto !important;
    font-size: 14px !important;
    width: auto !important;
    height: auto !important;
    padding: 2px 0px 2px 0px;
  }
  .template-7 .mathplay-question .col-md-5 {
    display: flex;
  }
  .template-7 .mathplay-question .col-md-5 > div {
    box-shadow: unset !important;
    padding: 0 !important;
    margin-top: 0px !important;
    background: unset !important;
    margin-right: 5px !important;
    margin-left: 5px !important;
    width: 50%;
  }
  .template-7 .mathplay-question .col-md-5 > div input + label.form-check-label {
    font-size: 14px !important;
    width: 100%;
    background: #ff7300;
    line-height: 35px;
    padding: 0 !important;
    margin-top: 3px;
    margin: 5px 0px 0px 0px !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  .template-7 .mathplay-question .col-md-5 > div .form-check {
    margin-bottom: 0px;
  }
  .template-7 .mathplay-question .col-md-5 > div input[type=radio]:checked + label.form-check-label {
    // background: #17bcba !important;
  }

  .template-8 .col-md-12.d-flex.inline-block > div {
    width: 40% !important;
  }
  .template-8 .custom-box {
    height: 70px !important;
    font-size: 16px !important;
    line-height: 70px;
    margin: 5px 0px !important;
  }
  .template-8 .custom-box .left-pointer span {
    position: inherit !important;
    color: white !important;
    top: 0 !important;
    font-size: 16px !important;
  }
  .template-8 .custom-box img {
    max-height: 70px !important;
    width: auto !important;
    margin: 0px !important;
    padding: 5px;
  }
  .template-8 .custom-box.left-pointer.selected {
    background-color: #1e9f98 !important;
  }
  .template-8 .custom-box.left-pointer.answered {
    background-color: #ff7300 !important;
  }
  .template-8 .custom-box.right-pointer.selected {
    border: 1px solid #1e9f98 !important;
  }
  .template-8 .custom-box.right-pointer.answered {
    border: 1px solid #ff7300 !important;
  }
  .template-8 .btn.btn-danger.active {
    background-color: #ff7300 !important;
    box-shadow: unset !important;
    border-radius: unset !important;
    border-color: unset !important;
    font-size: 18px !important;
  }

  .template-9 table td {
    width: 50px !important;
    height: 45px !important;
  }

  .template-10 .align-items-center {
    overflow: hidden;
  }
  .template-10 .align-items-center h1 {
    font-size: 40px !important;
  }
  .template-10 .align-items-center input {
    color: #ff7300 !important;
  }

  .template-11 .col {
    border-radius: 0px !important;
  }
  .template-11 .col > div {
    width: auto !important;
    margin: 10px 5px 10px 5px !important;
  }
  .template-11 .col > div img {
    max-width: 13vh !important;
  }
  .template-11 .col .mathplay-select {
    width: 100px !important;
  }

  .template-14 img.item-img {
    width: auto !important;
    max-height: 40vh !important;
  }
  .template-14 h3 span {
    font-size: 13px !important;
  }

  .template-15 #table-content .tCell {
    width: 35px !important;
    height: 35px !important;
  }
  .template-15 #reset {
    position: relative;
    bottom: 0 !important;
    right: 0 !important;
  }

  .template-16 h2 span {
    font-size: 13px !important;
  }
  .template-16 .col-auto {
    width: 100%;
  }
  .template-16 .dragula {
    margin-top: 10vh;
    display: block !important;
    width: 100%;
  }
  .template-16 .dragula button {
    min-width: 70px !important;
    max-width: 85px !important;
    width: 100% !important;
    margin: 0px !important;
    border: 2px solid;
    font-size: 18px !important;
    padding: 10px 0px;
  }

  .template-17 .col-md-12 > div {
    max-height: unset !important;
    margin-bottom: 5px !important;
    // margin: 0px !important;
    display: flex !important;
  }
  .template-17 p {
    margin: auto !important;
    font-size: 13px !important;
  }
  .template-17 img {
    width: 50% !important;
    height: auto !important;
    width: auto !important;
    max-height: 25vh !important;
    margin: auto !important;
  }
  .template-17 input[type=radio]:checked + label.form-check-label {
    // background: #1e9f98 !important;
  }
  .template-17 .row:nth-child(2) .col-md-12 .div:first-child {
    margin-bottom: 0px !important;
  }
  .template-17 .form-check {
    background: unset !important;
    font-size: unset !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  .template-17 .font-size {
    font-size: unset;
  }
  .template-17 input + label.form-check-label {
    width: auto !important;
    line-height: 40px;
    font-size: 14px !important;
    background: #ff7300;
    box-shadow: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .template-18 input[type=radio]:checked + label.form-check-label {
    // border: 1px solid #1e9f98;
    // border-color: #1e9f98 !important;
  }
  .template-18 .col-md-12 {
    margin: 0px !important;
    height: auto !important;
    display: inline-flex !important;
  }
  .template-18 .col-md-12 > div {
    margin: auto !important;
    width: 100% !important;
    height: auto !important;
  }
  .template-18 .form-check .form-check-label {
    height: 20vh !important;
    background-position: center;
  }

  .template-19 div.item-content {
    margin-top: 0px !important;
  }
  .template-19 label.item-content {
    display: block !important;
    margin: 0 !important;
    padding: 10px 0px 10px 0px;
  }
  .template-19 label.item-content img {
    margin: auto !important;
    max-height: 90px !important;
  }

  .template-20 .col-md-12 > div {
    max-height: unset !important;
    margin-bottom: 5px !important;
    margin: 0px !important;
    display: block !important;
  }
  .template-20 p {
    margin: auto !important;
    font-size: 13px !important;
  }
  .template-20 img {
    width: 50% !important;
    height: auto !important;
    width: auto !important;
    max-height: 50vh !important;
    margin: auto !important;
  }
  .template-20 input[type=radio]:checked + label.form-check-label {
    // background: #1e9f98 !important;
  }
  .template-20 .row:nth-child(2) .col-md-12 .div:first-child {
    margin-bottom: 0px !important;
  }
  .template-20 .form-check {
    background: unset !important;
    font-size: unset !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 5px !important;
  }
  .template-20 .font-size {
    font-size: unset;
  }
  .template-20 input + label.form-check-label {
    width: auto !important;
    line-height: 40px;
    font-size: 14px !important;
    background: #ff7300;
    box-shadow: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
  }
}
</style>
`;

export default styleMedia;