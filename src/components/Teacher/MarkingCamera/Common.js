import { Style } from "./Style";
import { IndexJS } from "./Index";
import { CustomeJs } from "./Custome";

export const renderHtml = (data) => {
    let html = '';
    html +=  `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Fabric js</title>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <meta http-equiv="cache-control" content="no-cache" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        `;
    html += `${Style}`; 
    html += `
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </head>
    <body>
        <div class="group">
            <div class="top-section">
                <div class="inline-block">
                    <span onclick="onRotate(0)" class="btn-circle" id="btn-rotate-0">
                        <i class="fa fa-repeat icon center-vertical"></i>
                    </span>
                </div>
                <div class="hide inline-block btn-options" id="btn-options-0">
                    <span class="btn-circle">
                        <i class="fa fa-pencil icon center-vertical"></i>
                    </span>
                    <span class="btn-circle">
                        <i class="fa fa-text-width icon center-vertical"></i>
                    </span>
                </div>
                <div class="inline-block flex"></div>
                <span onclick="onEdit(0)" class="btn-edit" id="btn-edit-0" >
                    <span class="abs-center">Sửa</span>
                </span>
                <div class="hide inline-block show box-action" id="action-0">
                    <span onclick="onSave(0)" class="btn-save btn-save-0">Lưu</span>
                    <span onclick="onCancel(0)" class="btn-cancel btn-cancel-0">Huỷ</span>
                </div>
            </div>
            <canvas id="canvas-0"></canvas>
        </div>
        <div class="group">
            <div class="top-section">
                <div class="inline-block">
                    <span onclick="onRotate(1)" class="btn-circle" id="btn-rotate-1">
                        <i class="fa fa-repeat icon center-vertical"></i>
                    </span>
                </div>
                <div class="hide inline-block btn-options" id="btn-options-1">
                    <span class="btn-circle">
                        <i class="fa fa-pencil icon center-vertical"></i>
                    </span>
                    <span class="btn-circle">
                        <i class="fa fa-text-width icon center-vertical"></i>
                    </span>
                </div>
                <div class="inline-block flex"></div>
                <span onclick="onEdit(1)" class="btn-edit" id="btn-edit-1" >
                    <span class="abs-center">Sửa</span>
                </span>
                <div class="hide inline-block show box-action" id="action-1">
                    <span onclick="onSave(1)" class="btn-save btn-save-1">Lưu</span>
                    <span onclick="onCancel(1)" class="btn-cancel btn-cancel-1">Huỷ</span>
                </div>
            </div>
            <canvas id="canvas-1"></canvas>
        </div>
        <div class="group">
            <div class="top-section">
                <div class="inline-block">
                    <span onclick="onRotate(2)" class="btn-circle" id="btn-rotate-2">
                        <i class="fa fa-repeat icon center-vertical"></i>
                    </span>
                </div>
                <div class="hide inline-block btn-options" id="btn-options-2">
                    <span class="btn-circle">
                        <i class="fa fa-pencil icon center-vertical"></i>
                    </span>
                    <span class="btn-circle">
                        <i class="fa fa-text-width icon center-vertical"></i>
                    </span>
                </div>
                <div class="inline-block flex"></div>
                <span onclick="onEdit(2)" class="btn-edit" id="btn-edit-2" >
                    <span class="abs-center">Sửa</span>
                </span>
                <div class="hide inline-block show box-action" id="action-2">
                    <span onclick="onSave(2)" class="btn-save btn-save-2">Lưu</span>
                    <span onclick="onCancel(2)" class="btn-cancel btn-cancel-2">Huỷ</span>
                </div>
            </div>
            <canvas id="canvas-2"></canvas>
        </div>
    
        <div class="group">
            <div class="top-section">
                <div class="inline-block">
                    <span onclick="onRotate(3)" class="btn-circle" id="btn-rotate-3">
                        <i class="fa fa-repeat icon center-vertical"></i>
                    </span>
                </div>
                <div class="hide inline-block btn-options" id="btn-options-3">
                    <span class="btn-circle">
                        <i class="fa fa-pencil icon center-vertical"></i>
                    </span>
                    <span class="btn-circle">
                        <i class="fa fa-text-width icon center-vertical"></i>
                    </span>
                </div>
                <div class="inline-block flex"></div>
                <span onclick="onEdit(3)" class="btn-edit" id="btn-edit-3" >
                    <span class="abs-center">Sửa</span>
                </span>
                <div class="hide inline-block show box-action" id="action-3">
                    <span onclick="onSave(3)" class="btn-save btn-save-3">Lưu</span>
                    <span onclick="onCancel(3)" class="btn-cancel btn-cancel-3">Huỷ</span>
                </div>
            </div>
            <canvas id="canvas-3"></canvas>
        </div>
        <div class="group">
            <div class="top-section">
                <div class="inline-block">
                    <span onclick="onRotate(4)" class="btn-circle" id="btn-rotate-4">
                        <i class="fa fa-repeat icon center-vertical"></i>
                    </span>
                </div>
                <div class="hide inline-block btn-options" id="btn-options-4">
                    <span class="btn-circle">
                        <i class="fa fa-pencil icon center-vertical"></i>
                    </span>
                    <span class="btn-circle">
                        <i class="fa fa-text-width icon center-vertical"></i>
                    </span>
                </div>
                <div class="inline-block flex"></div>
                <span onclick="onEdit(4)" class="btn-edit" id="btn-edit-4" >
                    <span class="abs-center">Sửa</span>
                </span>
                <div class="hide inline-block show box-action" id="action-4">
                    <span onclick="onSave(4)" class="btn-save btn-save-4">Lưu</span>
                    <span onclick="onCancel(4)" class="btn-cancel btn-cancel-4">Huỷ</span>
                </div>
            </div>
            <canvas id="canvas-4"></canvas>
        </div>
    
        <div style="margin-bottom:20px;text-align:center;">
            <div id="number-correct" class="inline-block correct">Số câu đúng 0</div>
            <div id="number-incorrect" class="inline-block incorrect">Số câu sai 0</div>
        </div>
        <p class="text-warning" id="text-warning">Điểm dự kiến: 0/0 = 0 điểm (Điểm dựa trên số câu đúng, sai không phải điểm của bài tập) </p>
        <p class="x-panel">Điểm</p>
        <div class="box-score">
            <input id="input-score" class="input-score center-vertical" type="text" value="0.00" />
        </div>
        <p class="x-panel">Nhận xét</p>
        <div class="comment-container">
            <div class="box-comment">
            <!-- 	<input id="input-comment" class="input-comment center-vertical" type="text" value=""  placeholder="Nhận xét của bạn" /> -->
            <textarea id="input-comment" class="input-comment" value="" placeholder="Nhận xét của bạn"></textarea>
            </div>
        </div>
        <div class="btn-submit">
            <span>Lưu bài </span>
        </div>
        `;
        html += `<script type="text/javascript" src="fabric.min.js"></script>`;
        html +=  `
        ${IndexJS}
        `;
        html += `
        ${CustomeJs}
        `;
        html+=`
    </body>
    </html> 
 `;
 console.log(html);
 return html;
}
