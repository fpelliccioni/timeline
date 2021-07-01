function saveSVG(document, window) {

    var path = window.location.pathname;
    var page = path.split("/").pop().split(".").slice(0, -1).join(".");
    console.log( page );

    var svg = document.getElementById("sequence").innerHTML;
    // console.log(svg);

    var blob = new Blob([svg], { type: "text/plain;charset=utf-8" });
    saveAs(blob, page + ".svg");
}

function drawMultiText(two, fulltext, x, y, font, color, size) {
    var texts = fulltext.split('\n');

    for (var i = 0; i < texts.length; ++i) {
        var text_elem = two.makeText(texts[i], x, y);
        text_elem.family = font;
        text_elem.fill = color;
        text_elem.size = size;
        y += 20;
    }
}

function textWidth(text) {
    var textW = text.value.length * text.size * Two.Text.Ratio * textWidthFactor;
    return textW;
}

function textWidth2(value, fontSize) {
    var textW = value.length * fontSize * Two.Text.Ratio * textWidthFactor;
    return textW;
}

function drawDashedLine(two, x, topY, height, color) {
    var y = topY;
    var segmentHeight = 10;
    while (y < topY + height) {
        var line = two.makeRectangle(x, y, 3, segmentHeight);
        line.fill = color;
        line.stroke = color;
        line.linewidth = 0;
        line.opacity = 0.5;
        background.add(line);
        y += segmentHeight * 1.5;
    }

    var point = two.makeCircle(x, topY + height, 3);
    point.stroke = color;
    point.fill = color;
    // point.opacity = 0.5;
}

function drawPeriod(two, name, yearF, yearT, color, level) {
    var yearFX = yearX(two, yearF);
    var yearTX = yearX(two, yearT);
    var w = yearTX - yearFX;

    var x = yearFX + w / 2;
    var y = getPos(two) + 50 * level;

    var line = two.makeRectangle(x, y, w, 10);
    line.fill = color;
    line.stroke = color;
    line.linewidth = 0;


    drawMultiText(two, name, x, y + 20, font_family, color, defaultTextSize + 3);
    // var text = two.makeText(name, x, y + 20);
    // text.family = font_family; //"Source Code Pro";
    // text.fill = color;
    // text.size = defaultTextSize + 3;
    // // text.alignment = 'left';
}

function drawYear(two, year, x, y) {
    var y_5500 = two.makeCircle(x, y, 5);
    y_5500.stroke = "white";
    y_5500.fill = "white";

    var text = two.makeText(year, x, y + 20);
    text.family = font_family; //"Source Code Pro";
    text.size = defaultTextSize - 2;
    text.fill = 'white';

    if (year % year_highlighted == 0) {
        // text.style = 'bold';
        text.weight = 600;
        // text.linewidth = 2;
        text.size = text.size + 2;
    }

}

function drawEvent1(two, name, year, color, textColor, level) {
    var x = yearX(two, year);

    var y = getPos(two) - 100 * level;
    var fontSize = defaultTextSize + 3;

    var triangleUp = two.makePolygon(x, y - 25, 10); //, sides);
    triangleUp.fill = color;
    triangleUp.stroke = color;

    var triangleDown = two.makePolygon(x, y + 25, 10); //, sides);
    triangleDown.fill = color;
    triangleDown.stroke = color;
    triangleDown.rotation = Math.PI;

    var textW = textWidth2(name, fontSize);
    var rect = two.makeRoundedRectangle(x, y, textW + roundedRectangleWidthDelta, 40);
    rect.fill = color;
    rect.stroke = color;

    var text = two.makeText(name, x, y);
    text.family = font_family;
    text.fill = textColor;
    text.size = fontSize;

    var line = two.makeRectangle(x, two.height / 2, 3, two.height);
    line.fill = color;
    line.stroke = color;
    line.linewidth = 0;
    background.add(line);
}

function drawEvent2(two, name, year, color, textColor, level) {
    var x = yearX(two, year);

    var y = getPos(two) - 100 * level;
    var fontSize = defaultTextSize + 3;

    var triangleDown = two.makePolygon(x, y + 25, 10); //, sides);
    triangleDown.fill = color;
    triangleDown.stroke = color;
    triangleDown.rotation = Math.PI;

    var textW = textWidth2(name, fontSize);
    var rect = two.makeRoundedRectangle(x, y, textW + roundedRectangleWidthDelta, 40);
    rect.fill = color;
    rect.stroke = color;

    var text = two.makeText(name, x, y);
    text.family = font_family;
    text.fill = textColor;
    text.size = fontSize;

    var height = getPos(two) - (y + 45) - 10;
    drawDashedLine(two, x, y + 45, height, color);
}

function yearX(two, year) {
    var years = year_to - year_from;
    // console.log(years);
    var steps = years / year_step;
    // console.log(steps);
    var real_width = two.width - year_from_x * 2;
    // console.log(real_width);
    // console.log(year);
    // console.log(year_from);
    // console.log(year - year_from);

    return year_from_x +
            real_width * (year - year_from) / years;
}

function getPos(two) {
    var pos = (typeof(timeline_pos) !== 'undefined') ?  timeline_pos : 1 / 2;
    // console.log(pos);
    var ret = two.height * pos;
    // console.log(ret);
    return ret;
}
function drawTimeline(two) {
    var backRect = two.makeRectangle(two.width / 2, two.height / 2, two.width, two.height);
    backRect.fill = '#2C3C4E';
    backRect.stroke = '#2C3C4E';
    // backRect.fill = '#212121';
    // backRect.stroke = '#212121';
    backRect.linewidth = 0;
    background.add(backRect);

    var x = year_from_x;
    var y = getPos(two);

    var line = two.makeRectangle(two.width / 2, y, two.width, 5);
    line.fill = "white";
    line.linewidth = 0;

    var years = year_to - year_from;
    var steps = years / year_step;
    var x_step = (two.width - year_from_x * 2) / steps;

    for (let year = year_from; year <= year_to; year += year_step) {
        var year_str = year == 0 ? "" : year;
        drawYear(two, year_str, x, y);

        var line = two.makeRectangle(x, two.height / 2, 1, two.height);
        line.fill = "#354353";
        line.stroke = "#354353";
        line.linewidth = 0;
        background.add(line);

        x += x_step;
    }

    var y0x = yearX(two, 0);
    var y0hole = two.makeRectangle(y0x, two.height / 2, 1, two.height);
    y0hole.fill = "black";
}

function drawPerson(two, name, yearF, yearT, color, textColor, level) {

    var yearFX = yearX(two, yearF);
    var yearTX = yearX(two, yearT);
    var w = yearTX - yearFX;

    var x = yearFX + w / 2;
    var y = getPos(two) - 70 * level;

    var line = two.makeRoundedRectangle(x, y, w, 25);
    line.fill = color;
    line.stroke = color;
    // line.linewidth = 0;


    drawMultiText(two, name, x, y - 25, font_family, textColor, defaultTextSize + 3);

    var height = getPos(two) - (y + 22) - 10;
    drawDashedLine(two, x, y + 22, height, color);
}
