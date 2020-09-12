import {
    getScriptBackground, getScriptPunchOrder, getScriptPunchTouch,
    getScriptRadio, getScriptCanvas, getScriptHTMLInput, getScriptCheckbox,
} from './MathPlay';

export const getTypeMathPlay = ({ typeView, question, typeAnswer, template, userOptionText }) => {
    let html = '';
    if (typeAnswer == 4 || typeAnswer == 5) {
        // Hiển thị dạng HTML input text
        if (typeView == 0) {
            html += getScriptHTMLInput(question, typeAnswer, template);
        }
        // Hiển thị dạng kéo thả sắp sếp
        if (typeView == 1) {
            html += getScriptPunchOrder(question);
        }
        // Hiển thị dạng đồ họa
        if (typeView == 2) {
            html += getScriptCanvas(question, template, userOptionText);
        }
        // Hiển thị dạng tô màu
        if (typeView == 3) {
            // alert(typeView)
            html += getScriptBackground(question, template, userOptionText);
        }
        //Hiển thị dạng kéo thả vào nhóm
        if (typeView == 4) {
            html += getScriptPunchTouch(question);
        }
        // Hiển thị dạng HTML input radio
        if (typeView == 5) {
            html += getScriptRadio(question);
        }
        // Hiển thị dạng HTML input checkbox
        if (typeView == 6) {
            html += getScriptCheckbox(question);
        }
    }
    return html;

}