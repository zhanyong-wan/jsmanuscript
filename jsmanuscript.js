/**
 *  Copyright 2020 wixette@gmail.com
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * @fileoverview A utility to generate 20x20 manuscript paper format
 * for Chinese document.
 */

var jsm = jsm || {};

/**
 * Constant variables to format the canvas.
 */
jsm.MARGIN = 160;
jsm.ROWS = 20;
jsm.COLS = 20;
jsm.SQUARE_WIDTH = 80;
jsm.BORDER_STROKE = 4;  // width of the border lines
jsm.LINE_STROKE = 2;  // width of the inner lines
jsm.SQUARE_HEIGHT = jsm.SQUARE_WIDTH;
jsm.SQUARE_SPACE = jsm.SQUARE_HEIGHT * 4/10;  // spacing between lines
jsm.DASH_LINE_SEGMENT_LENGTH = jsm.SQUARE_WIDTH * 5/80;
jsm.DASH_LINE_SPACE_LENGTH = jsm.SQUARE_WIDTH * 3/80;
jsm.DEFAULT_FONT_SIZE = jsm.SQUARE_WIDTH * 5/8;
jsm.CANVAS_WIDTH = jsm.COLS * jsm.SQUARE_WIDTH + 2 * jsm.MARGIN;
jsm.CANVAS_HEIGHT = jsm.ROWS * jsm.SQUARE_HEIGHT + (jsm.ROWS + 1) * jsm.SQUARE_SPACE + 2 * jsm.MARGIN;
jsm.FOOTER_FONT_SIZE = jsm.SQUARE_WIDTH * 9/20;
jsm.FOOTER_X_POSITION = jsm.CANVAS_WIDTH - jsm.MARGIN - jsm.FOOTER_FONT_SIZE * 7;
jsm.FOOTER_FROM_BOTTOM = jsm.MARGIN * 11/16;

jsm.DEFAULT_FONT = "sans-serif";

/**
 * Candidate list of font familiy and display name.
 */
jsm.FONTS = [
    {
        family: 'STKaiti',
        name: '华文楷体',
    },
    {
        family: 'BiauKai',
        name: '标楷体',
    },
    {
        family: 'Kai',
        name: '楷体',
    },
    {
        family: 'KaiTi',
        name: '楷体',
    },
    {
        family: 'DFKai-SB',
        name: '华康标楷',
    },
    {
        family: 'STSong',
        name: '华文宋体',
    },
    {
        family: 'Songti SC',
        name: '宋体简体',
    },
    {
        family: 'Song',
        name: '宋体',
    },
    {
        family: 'SimSun',
        name: '宋体',
    },
    {
        family: 'NSimSun',
        name: '新宋体',
    },
    {
        family: 'LiSong Pro',
        name: '俪宋',
    },
    {
        family: 'PMingLiU',
        name: '细明体',
    },
    {
        family: 'PingFang SC',
        name: '平方简体',
    },
    {
        family: 'Hei',
        name: '黑体',
    },
    {
        family: 'STHeiti',
        name: '华文黑体',
    },
    {
        family: 'Heiti SC',
        name: '黑体简体',
    },
    {
        family: 'LiHei Pro',
        name: '俪黑',
    },
    {
        family: 'Microsoft JhengHei',
        name: '微软正黑',
    },
    {
        family: 'Microsoft YaHei',
        name: '微软雅黑',
    },
    {
        family: 'SimHei',
        name: '新黑体',
    },
    {
        family: 'Noto Sans CJK SC',
        name: 'Noto黑体简',
    },
    {
        family: 'STXihei',
        name: '华文细黑',
    },
    {
        family: 'FangSong',
        name: '仿宋',
    },
    {
        family: 'Fang Song',
        name: '仿宋',
    },
    {
        family: 'STFangSong',
        name: '华文仿宋',
    },
    {
        family: 'Yuanti SC',
        name: '圆体简体',
    },
    {
        family: 'Xingkai SC',
        name: '行楷简体',
    },
    {
        family: 'STXingkai',
        name: '华文行楷',
    },
    {
        family: 'LiSu',
        name: '隶书',
    },
    {
        family: 'STLiti',
        name: '华文隶书',
    },
    {
        family: 'YouYuan',
        name: '幼圆',
    },
    {
        family: 'Weibei SC',
        name: '魏碑简体',
    },
    {
        family: 'STXinwei',
        name: '华文新魏',
    },
    {
        family: 'Yuppy SC',
        name: '雅痞简体',
    },
    {
        family: 'Wawati SC',
        name: '娃娃体简体',
    },
];

/**
 * Whether the current window is in text editing status.
 * @type {boolean}
 */
jsm.isEditing = false;

/**
 * Number of canvas that are generated (pages).
 * @type {nubmer}
 */
jsm.numCanvas = 0;

/**
 * Draws the grid lines.
 */
jsm.drawGrid = function(canvasElem, paperColor, gridColor, gridPattern) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, jsm.CANVAS_WIDTH, jsm.CANVAS_HEIGHT);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = jsm.LINE_STROKE;
    var lineHeight = jsm.SQUARE_HEIGHT + jsm.SQUARE_SPACE;
    for (let i = 0; i < jsm.ROWS; i++) {
        ctx.moveTo(jsm.MARGIN, jsm.MARGIN + lineHeight * i);
        ctx.lineTo(jsm.CANVAS_WIDTH - jsm.MARGIN,
                   jsm.MARGIN + lineHeight * i);
        ctx.moveTo(jsm.MARGIN,
                   jsm.MARGIN + lineHeight * i +
                   lineHeight - jsm.SQUARE_HEIGHT);
        ctx.lineTo(jsm.CANVAS_WIDTH - jsm.MARGIN,
                   jsm.MARGIN + lineHeight * i +
                   lineHeight - jsm.SQUARE_HEIGHT);
        for (let j = 0; j < jsm.COLS; j++) {
            // Draw the left edge of the bounding box.
            var left = jsm.MARGIN + j * jsm.SQUARE_WIDTH;
            var bottom = jsm.MARGIN + lineHeight * i + lineHeight;
            ctx.moveTo(left, bottom - jsm.SQUARE_HEIGHT);
            ctx.lineTo(left, bottom);
            ctx.stroke();

            if (gridPattern == '田' || gridPattern == '米') {
                // Switch to dash lines.
                ctx.beginPath();
                ctx.setLineDash([jsm.DASH_LINE_SEGMENT_LENGTH, jsm.DASH_LINE_SPACE_LENGTH]);

                // Draw the vertical line in the middle of the bounding box.
                ctx.moveTo(left + jsm.SQUARE_WIDTH/2, bottom - jsm.SQUARE_HEIGHT);
                ctx.lineTo(left + jsm.SQUARE_WIDTH/2, bottom);

                // Draw the horizontal line in the middle of the bounding box.
                ctx.moveTo(left, bottom - jsm.SQUARE_HEIGHT/2);
                ctx.lineTo(left + jsm.SQUARE_WIDTH, bottom - jsm.SQUARE_HEIGHT/2);

                if (gridPattern == '米') {
                    // Draw the diagonal lines of the bounding box.
                    ctx.moveTo(left, bottom - jsm.SQUARE_HEIGHT);
                    ctx.lineTo(left + jsm.SQUARE_WIDTH, bottom);
                    ctx.moveTo(left, bottom);
                    ctx.lineTo(left + jsm.SQUARE_WIDTH, bottom - jsm.SQUARE_HEIGHT);
                }

                ctx.stroke();

                // Switch back to solid lines.
                ctx.beginPath();
                ctx.setLineDash([]);
            }
        }
    }
    ctx.moveTo(jsm.MARGIN, jsm.MARGIN + lineHeight * jsm.ROWS);
    ctx.lineTo(jsm.CANVAS_WIDTH - jsm.MARGIN,
               jsm.MARGIN + lineHeight * jsm.ROWS);
    ctx.stroke();

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = jsm.BORDER_STROKE;
    ctx.strokeRect(jsm.MARGIN, jsm.MARGIN,
                   jsm.CANVAS_WIDTH - 2 * jsm.MARGIN,
                   jsm.CANVAS_HEIGHT - 2 * jsm.MARGIN);
};

/**
 * Constant variables for text processing.
 */
jsm.REPLACE_TABLE = [
    [/\r\n/gm, '\n'],
    [/\r/gm, '\n']
];

/**
 * Preprocesses the text.
 */
jsm.preprocessText = function (text) {
    var ret = text;
    for (let i = 0; i < jsm.REPLACE_TABLE.length; i++) {
        ret = ret.replace(jsm.REPLACE_TABLE[i][0], jsm.REPLACE_TABLE[i][1]);
    }
    return ret;
};

/**
 * Parses the text into separated lines. The lines are separated
 * either by \n or by the limit of characters per line.
 */
jsm.splitLines = function (text) {
    var lines = text.split('\n');
    var ret = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.length <= 0) {
            ret.push('');
        } else {
            for (let j = 0; j < line.length; j += jsm.COLS) {
                ret.push(line.substr(j, Math.min(jsm.COLS, line.length - j)));
            }
        }
    }
    return ret;
};

/**
 * Gets the canvas DOM ID based on the given index.
 */
jsm.getCanvasId = function (canvasIndex) {
    return 'paper-canvas-' + (canvasIndex + 1);
};

/**
 * Draws a footer line on each canvas.
 */
jsm.drawFooter = function(canvasElem, canvasIndex,
                          numCanvas, fontFamily,
                          gridColor, textColor) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = gridColor;
    ctx.font = jsm.FOOTER_FONT_SIZE + 'px ' + fontFamily;
    ctx.textBaseline = "middle";
    ctx.fillText('第 ' + (canvasIndex + 1) + ' 页  共 ' + numCanvas + ' 页',
                 jsm.FOOTER_X_POSITION,
                 jsm.CANVAS_HEIGHT - jsm.FOOTER_FROM_BOTTOM);
};

/**
 * Draws a single character onto the canvas.
 */
jsm.drawChar = function (c, canvasElem, fontFamily, textSize, textColor, row, col) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = textColor;
    var fontSize = Math.round(jsm.DEFAULT_FONT_SIZE * (textSize == '小' ? 0.8 :
                                                       textSize == '中' ? 1 : 1.4));
    ctx.font = fontSize + 'px '+ fontFamily;
    ctx.textBaseline = "middle";
    var lineHeight = jsm.SQUARE_HEIGHT + jsm.SQUARE_SPACE;
    var leftPadding = (jsm.SQUARE_WIDTH - fontSize)/2;
    ctx.fillText(c,
                 jsm.MARGIN + col * jsm.SQUARE_WIDTH + leftPadding,
                 jsm.MARGIN + row * lineHeight +
                 lineHeight - jsm.SQUARE_HEIGHT / 2);
};

/**
 * Draws the text onto the canvases.
 */
jsm.drawText = function(lines, fontFamily, textSize, textColor) {
    var canvasIndex = 0;
    for (let i = 0; i < lines.length; i += jsm.ROWS) {
        var x = jsm.getCanvasId(canvasIndex);
        var canvasElem = document.getElementById(jsm.getCanvasId(canvasIndex));
        for (let row = 0; row < Math.min(jsm.ROWS, lines.length - i); row++) {
            let line = lines[i + row];
            for (let col = 0; col < line.length; col++) {
                jsm.drawChar(line[col],
                             canvasElem,
                             fontFamily,
                             textSize,
                             textColor,
                             row,
                             col);
            }
        }
        canvasIndex++;
    }
};

/**
 * Formats the input text and renders one or more canvases.
 * @param {!string} text The string that contains the input Chinese text.
 * @param {Element} containerElem The container DOM element for
 *     holding the generated canvases.
 * @param {string=} fontFamily The font family string for setting the text
 *     style.
 * @param {string=} textColor The color string for setting the text style.
 * @param {string=} paperColor The color string for setting the paper background
 *     style.
 * @param {string=} gridColor The color string for setting the grid style.
 */
jsm.formatText = function (text,
                           containerElem,
                           fontFamily = 'sans-serif',
                           textSize = '中',
                           textColor = '#000',
                           paperColor = '#fff',
                           gridColor = '#3C3',
                           gridPattern = '口') {
    while (containerElem.firstChild) {
        containerElem.removeChild(containerElem.firstChild);
    }
    var processedText = jsm.preprocessText(text);
    var lines = jsm.splitLines(processedText);
    if (lines.length <= 0) {
        lines = [''];
    }
    fontFamily = fontFamily.trim();
    if (fontFamily === '')
        fontFamily = 'sans-serif';
    jsm.numCanvas = Math.ceil(lines.length / jsm.ROWS);
    for (let i = 0; i < jsm.numCanvas; i++) {
        var canvasId = jsm.getCanvasId(i);
        containerElem.insertAdjacentHTML(
            'beforeend',
            '<canvas id="' + canvasId +
                '" class="paper-canvas" ' +
                'width="' + jsm.CANVAS_WIDTH +
                '" height="' + jsm.CANVAS_HEIGHT +
                '"></canvas>');
        var canvasElem = document.getElementById(canvasId);
        canvasElem.style.backgroundColor = paperColor;
        jsm.drawGrid(canvasElem, paperColor, gridColor, gridPattern);
        jsm.drawFooter(canvasElem, i, jsm.numCanvas, fontFamily,
                       gridColor, textColor);
    }
    jsm.drawText(lines, fontFamily, textSize, textColor);
};

jsm.format = function () {
    var text = document.getElementById('input-text').value;
    var fontIndex = parseInt(document.getElementById('font-select').value);
    var fontFamily = isNaN(fontIndex) ?
        jsm.DEFAULT_FONT :
        jsm.FONTS[fontIndex].family;
    var textSize = document.getElementById('text-size').value;
    var textColor = document.getElementById('text-color').value;
    var paperColor = document.getElementById('paper-color').value;
    var gridColor = document.getElementById('grid-color').value;
    var gridPattern = document.getElementById('grid-pattern').value;
    jsm.formatText(text,
                   document.getElementById('paper-container'),
                   fontFamily,
                   textSize,
                   textColor,
                   paperColor,
                   gridColor,
                   gridPattern);
    jsm.isEditing = false;
    jsm.updateElements();
};

/**
 * Checks exsiting Chinese font families and initializes the font select control.
 */
jsm.initFontList = function() {
    window.setTimeout(function() {
        var fontDetector = new FontDetector();
        var selectElem = document.getElementById('font-select');
        selectElem.innerHTML = '';
        for (let i = 0; i < jsm.FONTS.length; i++) {
            let fontInfo = jsm.FONTS[i];
            if (fontInfo.family) {
                if (fontDetector.isInstalled(fontInfo.family)) {
                    let optionElem = document.createElement('option');
                    optionElem.setAttribute('value', i);
                    optionElem.innerText = fontInfo.name;
                    selectElem.appendChild(optionElem);
                }
            }
        }
    }, 1);
};

/**
 * Initializes event listeners.
 */
jsm.initEventListeners = function () {
    document.getElementById('btn-format').addEventListener('click',
                                                           jsm.format);
    document.getElementById('btn-input').addEventListener('click',
                                                          jsm.switchToInput);
    document.getElementById('btn-print').addEventListener('click',
                                                          jsm.print);
    document.getElementById('btn-export').addEventListener('click',
                                                           jsm.export);
};

/**
 * Updates the visibility of UI elements, or enables them by the
 * current status of jsm.isEditing.
 */
jsm.updateElements = function () {
    document.getElementById('text-container').style.display =
        jsm.isEditing ? 'block' : 'none';
    document.getElementById('paper-container').style.display =
        jsm.isEditing ? 'none' : 'block';

    if (jsm.isEditing) {
        document.getElementById('input-text').focus();
        document.getElementById('btn-input').setAttribute('disabled',
                                                          'disabled');
        document.getElementById('btn-print').setAttribute('disabled',
                                                          'disabled');
        document.getElementById('btn-export').setAttribute('disabled',
                                                           'disabled');
        document.getElementById('page-select').setAttribute('disabled',
                                                            'disabled');
    } else {
        document.getElementById('page-select').removeAttribute('disabled');
        document.getElementById('btn-input').removeAttribute('disabled');
        document.getElementById('btn-print').removeAttribute('disabled');
        document.getElementById('btn-export').removeAttribute('disabled');

        if (jsm.numCanvas > 0) {
            var selectElem = document.getElementById('page-select');
            selectElem.innerHTML = '';
            for (let i = 0; i < jsm.numCanvas; i++) {
                let optionElem = document.createElement('option');
                optionElem.setAttribute('value', i);
                optionElem.innerText = '' + (i + 1);
                selectElem.appendChild(optionElem);
            }
        }
    }
};

/**
 * Switches back from the grid mode to the input mode.
 */
jsm.switchToInput = function () {
    jsm.isEditing = true;
    jsm.updateElements();
};

/**
 * Prints the canvases as A4 pages.
 */
jsm.print = function () {
    window.print();
};

/**
 * Exports a specified canvas to png file.
 */
jsm.export = function () {
    var pageIndex = parseInt(document.getElementById('page-select').value);
    if (!isNaN(pageIndex)) {
        var canvasId = jsm.getCanvasId(pageIndex);
        var canvasElem = document.getElementById(canvasId);
        canvasElem.toBlob(function(blob) {
            saveAs(blob, 'page_' + (pageIndex + 1) + '.png');
        }, 'image/png');
    }
};

/**
 * Initializes input controls and event listeners.
 */
jsm.init = function () {
    jsm.initFontList();
    jsm.initEventListeners();
    jsm.isEditing = true;
    jsm.updateElements();
};
