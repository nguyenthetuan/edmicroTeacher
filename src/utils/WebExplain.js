const getExplain = ({ textReviewColor, textVideoColor, bgButtonColor, borderButton }) => {
    return `
    <div id="answer" style="display:none;padding:10px 15px;background:#fff">
        <p style="color: #4CAF79;font-size:15px">
            <b>Giải đáp</b>
        </p>
        <div style="overflow:auto" id="explain">
        </div>
        <div style="margin-top:10px;text-align:center">
        <span style="color:#4CAF79">
        <i class="fa fa-pencil" style="color:#1caff6"></i> <span id="people">1</span> người đã trả lời</span>
        <span style="margin-left:10px;color:#4CAF79">
        <i class="fa fa-bolt" style="color:#ffd500"></i> <span id="pecent">10</span>% trả lời đúng</span>
        </div>
        <div style="text-align:center;margin-bottom:20px;margin-top:20px;">
        <span id="review" style="display:inline-block;margin-right: 10px;padding: 7px 12px;font-size:14px; background: ${bgButtonColor}; border-radius: 20px;color: ${textReviewColor}; border: solid 1px ${borderButton};font-weight:bold;font-size:12px;"
            >
            <i class="fa fa-refresh" style="color:${textReviewColor}"></i> Xem lại khái niệm
            </span>
            <span id="revideo" style="display:inline-block;margin-right: 10px;padding: 7px 12px;font-size:14px;background: ${bgButtonColor};border-radius: 20px;color: ${textVideoColor};border: solid 1px ${borderButton};font-weight:bold;font-size:12px;"
                onclick="myVideoAction()">
                <i class="fa fa-play" style="color:${textVideoColor}"></i> Xem bài giảng
            </span>
        </div>
    </div>`;
};

module.exports = {
    getExplain
}