﻿LongDivide.errors = false;

global_inputVars = { // Used for keeping track of when the inputs have changed
    unit:  $('#UNIT_BTN').val(),
    diag:  $('#INPUT_SIZE').val(),
    hres:  $('#INPUT_HRES').val(),
    vres:  $('#INPUT_VRES').val(),
    hres2: $('#INPUT_HRES2').val(),
    vres2: $('#INPUT_VRES2').val(),
}


var global_selectedElement = ''; // Used for keeping track of which element is currently selected in the document


global_DescriptionRegistry = { // Used for associating HTML files for loading detailed descriptions
    'INPUT_SIZE':       './DescriptionFiles/Description_DiagonalSize.html',
    'INPUT_HRES':       './DescriptionFiles/Description_InputHres.html',
    'INPUT_VRES':       './DescriptionFiles/Description_InputVres.html',
    'INPUT_HRES2':      './DescriptionFiles/Description_InputHres2.html',
    'INPUT_VRES2':      './DescriptionFiles/Description_InputVres2.html',

    'selectRatio':      './DescriptionFiles/Description_Ratio.html',
    'selectTotalPx':    './DescriptionFiles/Description_TotalPixels.html',
    'selectPxDensity':  './DescriptionFiles/Description_PixelDensity.html',
    'selectPxPitch':    './DescriptionFiles/Description_PixelPitch.html',
    'selectDiag':       './DescriptionFiles/Description_DiagonalSize.html',
    'selectWidth':      './DescriptionFiles/Description_Width.html',
    'selectHeight':     './DescriptionFiles/Description_Height.html',
    'selectArea':       './DescriptionFiles/Description_Area.html',

    'selectDiag2':      './DescriptionFiles/Description_Diag_MatchingHeight.html',
    'selectWidth2':     './DescriptionFiles/Description_Width_MatchingHeight.html',
    'selectHeight2':    './DescriptionFiles/Description_Height_MatchingHeight.html',
    'selectDensity2':   './DescriptionFiles/Description_PixelDensity_Matching.html',
    'selectRatio2':     './DescriptionFiles/Description_Ratio_Matching.html',

    'selectDiag3':      './DescriptionFiles/Description_Diag_MatchingDensity.html',
    'selectWidth3':     './DescriptionFiles/Description_Width_MatchingDensity.html',
    'selectHeight3':    './DescriptionFiles/Description_Height_MatchingDensity.html',
    'selectDensity3':   './DescriptionFiles/Description_PixelDensity_Matching.html',
    'selectRatio3':     './DescriptionFiles/Description_Ratio_Matching.html',
    'selectIdealRes':   './DescriptionFiles/Description_IdealResolution.html',
}

function update() {
    // This function updates the results whenever one of the input fields is changed, as well as update the description in response to mouseover events.

    
    var size = parseNum($('#INPUT_SIZE').val());
    //var unit_select = $('#unit_select input[type="radio"]:checked').val();
    var unit_select = $('#UNIT_BTN').val();
    var hres1 = parseInt(parseNum($('#INPUT_HRES').val()));
    var vres1 = parseInt(parseNum($('#INPUT_VRES').val()));
    
    var ar1 = LongDivide(hres1, vres1, { p:[2,4] });
    
    var diag = parseFloat(size);
    var width = size * Math.sin(Math.atan(hres1 / vres1));
    var height = size * Math.cos(Math.atan(hres1 / vres1));
    var area = width * height;
    var px_density = hres1 / width;
    var px_pitch = width / hres1;
    var total_px = hres1 * vres1;

    var hres2 = parseNum($('#INPUT_HRES2').val());
    var vres2 = parseNum($('#INPUT_VRES2').val());
    var ar2 = LongDivide(hres2, vres2, { p:[2,4] });
    var diag2 = height/Math.cos(Math.atan(hres2 / vres2));
    var height2 = height;
    var width2 = height2 * (hres2/vres2);
    var density2 = vres2 / height2;

    var diag3 = (height * (vres2/vres1))/Math.cos(Math.atan(hres2 / vres2));
    var height3 = height * (vres2/vres1);
    var width3 = height3 * (hres2/vres2);
    var density3 = vres2 / height3;

    var opt_res = parseInt(vres1 * ar2) + '&thinsp;&times;&thinsp;' + vres1;

    if (
        global_inputVars['unit']  !== $('#UNIT_BTN').val() ||
        global_inputVars['diag']  !== $('#INPUT_SIZE').val() ||
        global_inputVars['hres']  !== $('#INPUT_HRES').val() ||
        global_inputVars['vres']  !== $('#INPUT_VRES').val() ||
        global_inputVars['hres2'] !== $('#INPUT_HRES2').val() ||
        global_inputVars['vres2'] !== $('#INPUT_VRES2').val()
    ) {
        //var hres_den = parseInt(parseNum($('#INPUT_HRES_DENSITY').val()));
        //var vres_den = parseInt(parseNum($('#INPUT_VRES_DENSITY').val()));
        /*
        if (isNum([hres_den, vres_den])) {
            var ar_den = LongDivide(hres_den, vres_den, { p:[2,4] });
        }
        else { var ar_den = NaN; }
        var width2 = width * (hres_den / hres1);
        var height2 = height * (vres_den / vres1);
        var size2 = Math.sqrt((width2 * width2) + (height2 * height2));
        */

        /* Conversion Codes:
        1: Secondary units have normal conversion factor
        2: Secondary units have squared conversion factor
        3: Secondary units have reciprocal conversion factor
        */

        display(new UNIT(unit_select),
            [
                ['RESULT_DIAG',         1, diag.toFixed(3)      , (isPositive(size)) ],
                ['RESULT_WIDTH',        1, width.toFixed(3)     , (isPositive([size, hres1, vres1])) ],
                ['RESULT_HEIGHT',       1, height.toFixed(3)    , (isPositive([size, hres1, vres1])) ],
                ['RESULT_AREA',         2, area.toFixed(3)      , (isPositive([size, hres1, vres1])) ],
                ['RESULT_PX_DENSITY',   3, px_density.toFixed(3), (isPositive([size, hres1, vres1])) ],
                ['RESULT_DIAG2',        1, diag2.toFixed(3)     , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                ['RESULT_DIAG3',        1, diag3.toFixed(3)     , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                ['RESULT_HEIGHT2',      1, height2.toFixed(3)   , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                ['RESULT_HEIGHT3',      1, height3.toFixed(3)   , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                ['RESULT_WIDTH2',       1, width2.toFixed(3)    , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                ['RESULT_WIDTH3',       1, width3.toFixed(3)    , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                ['RESULT_PX_DENSITY2',  3, density2.toFixed(3)  , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                ['RESULT_PX_DENSITY3',  3, density3.toFixed(3)  , (isPositive(size) && isGTEOne([hres1, vres1, hres2, vres2])) ],
                //['RESULT_DENSITY_SIZE', 1, size2.toFixed(3)     , (isPositive([size, hres1, vres1, hres_den, vres_den])) ],
            ]
        );

        if (hres2 == '21' && vres2 == '9' && $('#eq_height_cover').css('visibility') === 'hidden') {
            activate219Warning();
        }
        else {
            deactivate219Warning();
        }


        if (isPositive(size) && isGTEOne([hres1, vres1])) {
            var width_cm;
            var width_in;
            var px_pitch_si;
            var px_pitch_in;
            var LD_options_si = { 'si':true,  'p':3, 'repeat':false, 'approx':'', 'thousands':',', 'thousandths':'\u202f' };
            var LD_options_in = { 'si':false, 'p':3, 'repeat':false, 'approx':'', 'thousands':',', 'thousandths':'\u202f' };
            if (unit_select === 'cm') {
                width_cm = width;
                width_in = width / 2.54;
            }
            else {
                width_cm = width * 2.54;
                width_in = width;
            }

            px_pitch_si = LongDivide(width_cm / 100, hres1, LD_options_si) + 'm';
            if (px_pitch / 2.54 < 0.1) {
                px_pitch_in = LongDivide((width_in * 1000), hres1, LD_options_in) + '&nbsp;mil';
            }
            else {
                px_pitch_in = LongDivide(width_in, hres1, LD_options_in) + '"';
            }

            if (unit_select === 'cm') {
                $('#RESULT_PX_PITCH').html(px_pitch_si + ' (' + px_pitch_in + ')');
            }
            else {
                $('#RESULT_PX_PITCH').html(px_pitch_in + ' (' + px_pitch_si + ')');
            }
        }
        else {
            $('#RESULT_PX_PITCH').html('');
        }


        if (isNum([size, hres1, vres1, hres2, vres2]) && isPositive([size, hres1, vres1, hres2, vres2])) {
            $('#RESULT_OPT_RES').html(opt_res);
        }
        else
            { $('#RESULT_OPT_RES').html(''); }


        //if (hres1 != '' && vres1 != '' && hres1 != 0 && vres1 != 0 && isNaN(hres1) == false && isNaN(vres1) == false) {
        if (isGTEOne([hres1, vres1])) {
            // $('#RESULT_RATIO').html(commas(ar1.toFixed(3)) + ' (' + parseInt(hres1 / GCD(hres1, vres1)) + '<span style="vertical-align:baseline; position:relative; top:-0.05em;">:</span>' + parseInt(vres1 / GCD(hres1, vres1)) + ')');
            $('#RESULT_RATIO').html(ar1 + '<span class="ratio">&#x2236;</span>1 (' + commas(parseInt(hres1 / GCD(hres1, vres1))) + '<span class="ratio">&#x2236;</span>' + commas(parseInt(vres1 / GCD(hres1, vres1))) + ')');
            $('#RESULT_TOTAL_PX').html(commas(total_px) + '&nbsp;px (' + prefixGen(total_px, 2)['num'] + ' ' + prefixGen(total_px, 2)['prefix'] + 'px)');
        }
        else {
            $('#RESULT_RATIO').html('');
            $('#RESULT_TOTAL_PX').html('');
        }

        
        if (isGTEOne([hres2, vres2])) {
            // $('#RESULT_RATIO').html(commas(ar1.toFixed(3)) + ' (' + parseInt(hres1 / GCD(hres1, vres1)) + '<span style="vertical-align:baseline; position:relative; top:-0.05em;">:</span>' + parseInt(vres1 / GCD(hres1, vres1)) + ')');
            $('#RESULT_RATIO2').html(ar2 + '<span class="ratio">&#x2236;</span>1 (' + commas(parseInt(hres2 / GCD(hres2, vres2))) + '<span class="ratio">&#x2236;</span>' + commas(parseInt(vres2 / GCD(hres2, vres2))) + ')');
            $('#RESULT_RATIO3').html(ar2 + '<span class="ratio">&#x2236;</span>1 (' + commas(parseInt(hres2 / GCD(hres2, vres2))) + '<span class="ratio">&#x2236;</span>' + commas(parseInt(vres2 / GCD(hres2, vres2))) + ')');
        }
        else {
            $('#RESULT_RATIO2').html('');
            $('#RESULT_RATIO3').html('');
        }
    }

    if (isNum($('#INPUT_SIZE').val()) && isNum($('#INPUT_HRES').val()) && isNum($('#INPUT_VRES').val()) ) {
        
        var pageState = {
            diag:diag,
            unit:unit_select,
            hres1:hres1,
            vres1:vres1,
            hres2:hres2,
            vres2:vres2,
        }

        if ($('#Sidebar_Matchmaker').hasClass('selected')) {
            if (isNum($('#INPUT_HRES2').val()) && isNum($('#INPUT_VRES2').val())) {
                history.replaceState(pageState, '', '?spec=' + diag.toString().replace('.', '_') + unit_select + hres1.toString() + 'x' + vres1.toString() + '&match=' + hres2.toString() + 'x' + vres2.toString() + '#matchmaker');
            }
            else {
                history.replaceState(pageState, '', '?spec=' + diag.toString().replace('.', '_') + unit_select + hres1.toString() + 'x' + vres1.toString() + '#matchmaker');
            }
        }
        else {
            if (isNum($('#INPUT_HRES2').val()) && isNum($('#INPUT_VRES2').val())) {
                history.replaceState(pageState, '', '?spec=' + diag.toString().replace('.', '_') + unit_select + hres1.toString() + 'x' + vres1.toString() + '&match=' + hres2.toString() + 'x' + vres2.toString());
            }
            else {
                history.replaceState(pageState, '', '?spec=' + diag.toString().replace('.', '_') + unit_select + hres1.toString() + 'x' + vres1.toString());
            }
        }

        $('#COPY_BTN').removeClass('bad');
        $('#COPY_BTN').addClass('good');
        $('#eq_height_cover').css('visibility', 'hidden');
        $('#INPUT_HRES2').prop('disabled', false);
        $('#INPUT_VRES2').prop('disabled', false);
        // if ( isNum([$('#INPUT_HRES2').val(),  $('#INPUT_VRES2').val()]) ) {
        //     activateMatchmaker();
        // }
    }
    else {
        $('#COPY_BTN').removeClass('good');
        $('#COPY_BTN').addClass('bad');
        $('#eq_height_cover').css('visibility', 'visible');
        $('#INPUT_HRES2').prop('disabled', true);
        $('#INPUT_VRES2').prop('disabled', true);
        //deactivateMatchmaker();
    }







    /*
    //!= '' && vres1 != '' && hres1 != 0 && vres1 != 0 && isNaN(hres1) == false && isNaN(vres1) == false
    //DEBUG('isInt', isInt([hres1, vres1, hres_den, vres_den]), 'isPositive', isPositive([hres1, vres1, hres_den, vres_den]));
    //DEBUG('hres1', hres1, isInt(hres1), 'vres1', vres1, isInt(vres1), 'hres_den', hres_den, isInt(hres_den), 'vres_den', vres_den, isInt(vres_den));
    if (isInt([hres1, vres1, hres_den, vres_den]) && isPositive([hres1, vres1, hres_den, vres_den])) {
        // $('#RESULT_DENSITY_RATIO').html(commas(ar_den.toFixed(3)) + ' (' + parseInt(hres_den / GCD(hres_den, vres_den)) + '<span style="vertical-align:baseline; position:relative; top:-0.05em;">:</span>' + parseInt(vres_den / GCD(hres_den, vres_den)) + ')');
        $('#RESULT_DENSITY_RATIO').html(ar_den + '<span class="ratio">&#x2236;</span>1 (' + commas(parseInt(hres_den / GCD(hres_den, vres_den))) + '<span class="ratio">&#x2236;</span>' + commas(parseInt(vres_den / GCD(hres_den, vres_den))) + ')');
    }
    else {
        $('#RESULT_DENSITY_RATIO').html('');
    }
    */

    global_inputVars['unit'] = $('#UNIT_BTN').val();
    global_inputVars['diag'] = $('#INPUT_SIZE').val();
    global_inputVars['hres'] = $('#INPUT_HRES').val();
    global_inputVars['vres'] = $('#INPUT_VRES').val();
    global_inputVars['hres2'] = $('#INPUT_HRES2').val();
    global_inputVars['vres2'] = $('#INPUT_VRES2').val();

    // Refresh Description
    if ($('#description').html != '') {
        global_DescriptionFunction( {
            'diag':         diag,
            'unit':         new UNIT($('#UNIT_BTN').val()),
            'hres':         hres1,
            'vres':         vres1,
            'ar1':          ar1,
            'width':        width,
            'height':       height,
            'area':         area,
            'px_density':   px_density,
            'total_px':     total_px,
            'hres2':        hres2,
            'vres2':        vres2,
            'ar2':          ar2,
            'diag2':        diag2,
            'opt_res':      opt_res,
        } );
    }
    else { return; }

    return;
}


// This function operates the in/cm button
function changeUnit(buttonElement, force) {
    var val = buttonElement.value;
    
    var val = (force === undefined) ? (buttonElement.value) : (force === 'in') ? 'cm' : (force === 'cm') ? 'in' : 'cm';
    
    if (val === 'in') {
        buttonElement.value = 'cm';
        buttonElement.innerHTML = 'cm';
        document.getElementById('cm_radio').checked = true;
    }
    else if (val === 'cm') {
        buttonElement.value = 'in';
        buttonElement.innerHTML = 'in';
        document.getElementById('in_radio').checked = true;
    }
    return;
}


// Returns false if input is a non-integer number or NaN
function isInt(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isInteger(parseNum(num[a])) == false) {
                //DEBUG('isInt Array False. a:', a, 'num[a]:', num[a], 'Number.isInteger(num[a]):', Number.isInteger(num[a]));
                return false;
            }
        }
        return true;
    }
    else
        return Number.isInteger(parseNum(num));
}


function isFloat(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isInteger(parseNum(num[a])) == true || Number.isNaN(num[a]) == true) {
                return false;
            }
        }
        return true;
    }
    else
        return !(Number.isInteger(parseNum(num)) || Number.isNaN(parseNum(num)));
}


// Returns false if input is not a positive number (zero, negative number, or NaN)
function isGTEOne(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true)
                return false;
            else if (num[a] < 1)
                return false;
        }
        return true;
    }
    else {
        if (Number.isNaN(parseNum(num)) == true)
            return false;
        else if (num >= 1)
            return true;
        else {
            return false;
        }
    }
}


// Returns false if input is not a positive number (zero, negative number, or NaN)
function isPositive(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true)
                return false;
            else if (num[a] <= 0)
                return false;
        }
        return true;
    }
    else {
        if (Number.isNaN(parseNum(num)) == true)
            return false;
        else if (num > 0)
            return true;
        else {
            return false;
        }
    }
}


function isNonNegative(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true)
                return false;
            else if (num[a] < 0)
                return false;
        }
        return true;
    }
    else {
        if (Number.isNaN(parseNum(num)) == true)
            return false;
        else if (num >= 0)
            return true;
        else {
            return false;
        }
    }
}


// Returns false if input is NaN
function isNum(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true) { return false; }
            else { continue; }
        }
        return true;
    }
    else {
        return !Number.isNaN(parseNum(num));
    }
}


// Converts string to floating point if it has a decimal point, or integer if there is no decimal point. Also strips commas and spaces, and optionally applies absolute value.
// Cannot handle inputs with negative signs in the wrong position.
function parseNum(str) {
    if (typeof str === "string") {
        str = str.replace(/[^0-9\. ]/g, ''); // Apply absolute value
        // str = str.replace(/[^0-9\. -]/g, ''); // Allow negative numbers
        
        // Return NaN if...
        if (str == '' // input is blank
            || str.indexOf('.') != str.lastIndexOf('.') // input contains multiple decimal places
            || str.indexOf('-') != str.lastIndexOf('-') // input contains multiple minus signs
            || (str.indexOf('-') != -1 && str.indexOf('-') != 0)) { // input contains a minus sign in a position other than the first character
            
            return NaN;
        }

        else {
            if (str.indexOf('.') == -1)
                return parseInt(str);
            else {
                return parseFloat(str);
            }
        }
    }
    else if (Number.isNaN(str))
        return NaN;
    else if (typeof str === "number") {
        return str;
    }
}


function display(units, list) {
    var el;
    for (var x = 0; x < list.length; x++) {
        if (isNaN(list[x][2]) == true || isFinite(list[x][2]) == false || list[x][3] == false) {
            $('#' + list[x][0] + ' > span').html('');
        }
        else {
            el = $('#' + list[x][0] + ' > span');
            el.html(commas(list[x][2]));
            if (list[x][1] == 1) {
                el[0].innerHTML += units.sym()[0] + ' (' + commas((list[x][2] * units.conv()).toFixed(3)) + units.sym()[1] + ')';
            }
            else if (list[x][1] == 2) {
                el[0].innerHTML += '&nbsp;' + units.abbr()[0] + '<sup>2</sup> (' + commas((list[x][2] * units.conv() * units.conv()).toFixed(3)) + '&nbsp;' + units.abbr()[1] + '<sup>2</sup>)';
            }
            else if (list[x][1] == 3) {
                el[0].innerHTML += '&nbsp;px/' + units.abbr()[0] + ' (' + commas((list[x][2] * (1 / units.conv())).toFixed(3)) + '&nbsp;px/' + units.abbr()[1] + ')';
            }

        }
    }
    return;
}


class UNIT {
    constructor(mode) {
        this._primary = mode;
        this.set = function (mode) {
            this._primary = mode;
        };
        this.constructor = function (mode) {
            this._primary(mode);
        };
        this.full = function () {
            if (this._primary == 'in') {
                return ['inches', 'centimeters'];
            }
            else if (this._primary == 'cm') {
                return ['centimeters', 'inches'];
            }
        };
        this.abbr = function () {
            if (this._primary == 'in') {
                return ['in', 'cm'];
            }
            else if (this._primary == 'cm') {
                return ['cm', 'in'];
            }
        };
        this.sym = function () {
            if (this._primary == 'in') {
                return ['"', '&nbsp;cm'];
            }
            else if (this._primary == 'cm') {
                return ['&nbsp;cm', '"'];
            }
        };
        this.conv = function () {
            if (this._primary == 'in') {
                return 2.54;
            }
            else if (this._primary == 'cm') {
                return 1 / 2.54;
            }
        };
    }
}


function prefixGen(num, precision) {
    var out_num;
    var out_prefix;

    var prefixDef = {
        '-8': 'y',
        '-7': 'z',
        '-6': 'a',
        '-5': 'f',
        '-4': 'p',
        '-3': 'n',
        '-2': 'µ',
        '-1': 'm',
        '0': '',
        '1': 'K',
        '2': 'M',
        '3': 'G',
        '4': 'T',
        '5': 'P',
        '6': 'E',
        '7': 'Z',
        '8': 'Y'
    };

    var magnitude = Math.floor(Math.log(num) / Math.log(1000));

    if (magnitude >= -8 && magnitude <= 8) {
        out_num = commas(Number(num / Math.pow(1000, magnitude)).toFixed(precision));
        out_prefix = prefixDef[magnitude];
    }
    else {
        out_num = commas(num);
        out_prefix = '';
    }

    return {
        'num': out_num,
        'prefix': out_prefix
    };
}


function pxPrefix(num, precision) {
    var x = prefixGen(num, precision);
    return (x['num'] + '&nbsp;' + x['prefix'] + 'px');
}


function GCD(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) { var temp = a; a = b; b = temp; }
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}


function commas(input) {
    var group = ',';
    var radix = '.';
    var parts = input.toString().split(radix);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, group);
    return parts.join(radix);
}

function commas2(input) { // Same as commas(), but only adds commas for 5-digit numbers or more (10,000 or higher; 9999 and below are left without commas)
    if(input.toString().indexOf('.') > 3 || (input.toString().indexOf('.') == -1 && input.toString().length > 4 )) {
        commas(input);
    }
    else { return input.toString(); }
}

function commas3(input) { // Same as commas(), but adds LaTeX thin-spaces (\,) instead of commas
    return (commas(input).replace(/\,/g, '\\,'));
}

function copy_DIU_URL() {
    var size = parseNum($('#INPUT_SIZE').val());
    var hres = parseInt(parseNum($('#INPUT_HRES').val()));
    var vres = parseInt(parseNum($('#INPUT_VRES').val()));
    var unit = $('#UNIT_BTN').val();

    var spec = "";

    // Check if all input fields are filled in with valid numbers
    if (isNum([size, hres, vres])) {
        spec = (size + unit + hres + "x" + vres).replace(/\./g, '_'); // Also, replace all periods with underscores
    }
    else { return 0; } // If not, abort function

    // Get current URL and strip off any existing query string
    var url = window.location.href;
    if (url.indexOf('?') != -1) {
        url = url.substring(0, url.indexOf('?'));
    }

    // Append new query string to url
    url += "?spec=" + spec;

    // Check if both fields are filled in height-matching section
    var hres2 = parseInt(parseNum($('#INPUT_HRES2').val()));
    var vres2 = parseInt(parseNum($('#INPUT_VRES2').val()));
    // If so, append additional query to URL
    if (isNum([hres2, vres2])) {
        url += ("&match=" + hres2 + "x" + vres2).replace(/\./g, '_'); // Also, replace all periods with underscores
    }

    // Write url to clipboard
    var response = navigator.clipboard.writeText(url);
    return 1;
}

function switchHeightDensity() {
    var selectedButton = $('input[name=height_density]:checked', '#height_density_select').val();
    if (selectedButton === 'height') {
        $('#secondary_title').html('Secondary Display with Matching Height');
        $('#results2').css('display', 'block');
        $('#results3').css('display', 'none');
        // $('#selectDiagHeight').css('display', 'table-row');
        // $('#selectDiagDensity').css('display', 'none');
        $('#height_ratio_symbol').css('display', 'inline');
        $('#height_times_symbol').css('display', 'none');
        $('#INPUT_HRES2').attr('placeholder', '16');
        $('#INPUT_VRES2').attr('placeholder', '9');
        $('#matchmaker_instructions').html('Aspect ratio or resolution of secondary display:');
        deselectRow();
        clearDescription();
    }
    else if (selectedButton === 'density') {
        $('#secondary_title').html('Secondary Display with Matching Pixel Density');
        $('#results2').css('display', 'none');
        $('#results3').css('display', 'block');
        // $('#selectDiagHeight').css('display', 'none');
        // $('#selectDiagDensity').css('display', 'table-row');
        $('#height_ratio_symbol').css('display', 'none');
        $('#height_times_symbol').css('display', 'inline');
        $('#INPUT_HRES2').attr('placeholder', '1920');
        $('#INPUT_VRES2').attr('placeholder', '1080');
        $('#matchmaker_instructions').html('Resolution of secondary display:');
        deselectRow();
        clearDescription();
    }
}

function activateMatchmaker() {
    $('#matchmaker_button').css('display', 'none');
    $('#eq_height_section').css('display', 'flex');

    $('#selectArea').css('display', 'none');
    $('#selectTotalPx').css('display', 'none');
    $('#selectPxPitch').css('display', 'none');

    $('#Sidebar_DDC').removeClass('selected');
    $('#Sidebar_DDC').attr('onclick', 'deactivateMatchmaker();');

    $('#Sidebar_Matchmaker').addClass('selected');
    $('#Sidebar_Matchmaker').attr('onclick', '');

    update();
}

function deactivateMatchmaker() {
    $('#matchmaker_button').css('display', 'flex');
    $('#eq_height_section').css('display', 'none');

    $('#selectArea').css('display', 'table-row');
    $('#selectTotalPx').css('display', 'table-row');
    $('#selectPxPitch').css('display', 'table-row');

    $('#Sidebar_Matchmaker').removeClass('selected');
    $('#Sidebar_Matchmaker').attr('onclick', 'activateMatchmaker();');

    $('#Sidebar_DDC').addClass('selected');
    $('#Sidebar_DDC').attr('onclick', '');

    update();
}

function activate219Warning() {
    $('#21_9_warning').css('display', 'flex');
}

function deactivate219Warning() {
    $('#21_9_warning').css('display', 'none');
}

function pleaseFillTheOtherSectionFirst() {
    if (!isNum($('#INPUT_SIZE').val())) { $('#INPUT_SIZE').focus(); }
    else if (!isNum($('#INPUT_HRES').val())) { $('#INPUT_HRES').focus(); }
    else if (!isNum($('#INPUT_VRES').val())) { $('#INPUT_VRES').focus(); }
    else {
        $('#eq_height_cover').css('visibility', 'hidden');
        $('#INPUT_HRES2').prop('disabled', false);
        $('#INPUT_VRES2').prop('disabled', false);
    }

    return;
}

function setRatio(a, b) {
    $('#INPUT_HRES2').val(a);
    $('#INPUT_VRES2').val(b);
    update();
}


function selectRow(el) {
    previousEl = global_selectedElement || '';
    if (previousEl != '') { deselectRow(); }
    if (previousEl != el) {
        el.classList.add('selected');
        global_selectedElement = el;
        $('#description').load(global_DescriptionRegistry[el.id]);
    }
}

function deselectRow() {
    global_selectedElement = global_selectedElement || '';
    if (global_selectedElement != '') {
        global_selectedElement.classList.remove('selected');
        global_selectedElement = '';
    }
}

/* Clears description when clicking anywhere else on the screen (except on excluded elements)
document.addEventListener('click', function(event) {
    if (!(
        document.getElementById('results1').contains(event.target)      ||
        document.getElementById('results2').contains(event.target)      ||
        document.getElementById('INPUT_SIZE').contains(event.target)    ||
        document.getElementById('INPUT_HRES').contains(event.target)    ||
        document.getElementById('INPUT_VRES').contains(event.target)    ||
        document.getElementById('INPUT_HRES2').contains(event.target)   ||
        document.getElementById('INPUT_VRES2').contains(event.target)   ||
        document.getElementById('UNIT_BTN').contains(event.target)      ||
        document.getElementById('description').contains(event.target)   )) {
        deselectRow();
        clearDescription();
    }
    return;
});
/*  */

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.keyCode === 27) { deselectRow(); $('#description').html(''); }
});

/*
document.addEventListener('mousemove', function(event) {
    global_mouseEvent = event;
});
*/

function loadDescription(element) {
    if (global_selectedElement == '') {
        $('#description').load(global_DescriptionRegistry[element.id]);
    }
}

function clearDescription() {
    if (global_selectedElement == '') {
        $('#description').html('');
        global_DescriptionFunction = function(specs) { return; };
    }
}

var global_DescriptionFunction = function(specs) { return; };


// https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  
  }

  function drawPixels(cx, startX, startY, spxH, spxW, spxGap, pxGap, radius, amount) {
    cx.strokeStyle = 'transparent';

    var R = '#662222';
    var G = '#226622';
    var B = '#222266';

    for (var i = 0; i < amount; i++) {
        var offset = i * (3 * spxW + 2 * spxGap + pxGap);
        cx.fillStyle = R;
        roundRect(cx, startX + offset, startY, spxW, spxH, radius, true, true);
        cx.fillStyle = G;
        roundRect(cx, startX + offset + spxW + spxGap, startY, spxW, spxH, radius, true, true);
        cx.fillStyle = B;
        roundRect(cx, startX + offset + 2*spxW + 2*spxGap, startY, spxW, spxH, radius, true, true);
    }
  }

  function drawPartialPixels(cx, startX, startY, spxH, spxW, spxGap, pxGap, radius, amount, cutoff) {
    cx.strokeStyle = 'transparent';
    startY = startY + spxH * (1 - cutoff);

    var gradR = cx.createLinearGradient(0, startY + spxH * cutoff, 0, startY);
    gradR.addColorStop(0,   '#662222');
    gradR.addColorStop(0.4, '#662222');
    gradR.addColorStop(1, 'transparent');
    
    var gradG = cx.createLinearGradient(0, startY + spxH * cutoff, 0, startY);
    gradG.addColorStop(0,   '#226622');
    gradG.addColorStop(0.4, '#226622');
    gradG.addColorStop(1, 'transparent');
    
    var gradB = cx.createLinearGradient(0, startY + spxH * cutoff, 0, startY);
    gradB.addColorStop(0,   '#222266');
    gradB.addColorStop(0.4, '#222266');
    gradB.addColorStop(1, 'transparent');

    for (var i = 0; i < amount; i++) {
        var offset = i * (3 * spxW + 2 * spxGap + pxGap);
        cx.fillStyle = gradR;
        roundRect(cx, startX + offset, startY, spxW, spxH * cutoff, radius, true, true);
        cx.fillStyle = gradG;
        roundRect(cx, startX + offset + spxW + spxGap, startY, spxW, spxH * cutoff, radius, true, true);
        cx.fillStyle = gradB;
        roundRect(cx, startX + offset + 2*spxW + 2*spxGap, startY, spxW, spxH * cutoff, radius, true, true);
    }
  }


window.onload = function pageLoad () {
    var unit_btn = document.getElementById('UNIT_BTN');
    if (unit_btn.value = "") { unit_btn.value = "in"; unit_btn.innerHTML = "in"; }
    var unit_radio = $('#unit_radio input[type="radio"]:checked').val();

    unit_btn.value = unit_radio;
    unit_btn.innerHTML = unit_radio;

    // Fills the elements on the page with the event listeners necessary for the mouseover descriptions to work

    var tables = [document.getElementById('results1'), document.getElementById('results2'), document.getElementById('results3')];
    for (var a = 0; a < tables.length; a++) {
        var rows = tables[a].children[0].children;
        for (var b = 0; b < rows.length; b++) {
            if (rows[b].classList.contains('selectable') != -1) {
                rows[b].addEventListener('click', function (event) { selectRow(event.currentTarget); });
                rows[b].addEventListener('mouseenter', function (event) { loadDescription(event.currentTarget) });
                rows[b].addEventListener('mouseleave',  function () { clearDescription() });
            }
        }
    }
    var otherElements = [$('#INPUT_SIZE')[0], $('#INPUT_HRES')[0], $('#INPUT_VRES')[0], $('#INPUT_HRES2')[0], $('#INPUT_VRES2')[0]];
    for (var a = 0; a < otherElements.length; a++) {
        otherElements[a].addEventListener('mouseenter', function (event) { loadDescription(event.currentTarget) });
        otherElements[a].addEventListener('mouseleave',  function () { clearDescription() });
    }

    parseURL();
    update();
    $('#INPUT_SIZE').focus();
}

function parseURL() {
    var hash = window.location.hash.substr(1);
    if (hash === 'matchmaker') {
        activateMatchmaker();
    }

    var query = new URLSearchParams(window.location.search);

    var spec = query.get('spec').replace('_', '.');
    var match = query.get('match');

    var diag, unit, hres, vres;
    var unit_index, unit_index, hres_index, vres_index;
    var AR;
    var regtemp;
    var specpart;
    var matchpart;

    if (spec !== null) {
        spec = spec.replace('_', '.');

        // Extract first component of the form: (string beginning) [num] (in || cm)
        specpart = spec.match(/^[\d\.]+cm|[\d\.]+in/g);
        if (specpart !== null) {
            specpart = specpart[0];

            regtemp = specpart.match(/[^\d\.]/g);
            if (regtemp !== null) {
                unit_index = specpart.indexOf(regtemp[0]);
            }
            else {
                unit_index = specpart.length;
            }
            diag = specpart.substring(0, unit_index);
            if (isNum(diag) == true) {
                $('#INPUT_SIZE').val(diag);
            }

            // regtemp = specpart.substring(0, specpart.length).match(/[0-9]/g);
            // if (regtemp !== null) { unit_index = specpart.indexOf(regtemp[0]); }
            // else { unit_index = specpart.length; }
            
            unit = specpart.substring(unit_index, specpart.length);
            if (unit === 'in') { changeUnit($('#UNIT_BTN')[0], 'in'); }
            else if (unit === 'cm') { changeUnit($('#UNIT_BTN')[0], 'cm'); }
            specpart = specpart.substring(unit_index, specpart.length);


        }

        // Extract first component of the form: [num] x [num]
        specpart = spec.match(/\d+x\d+/g);
        if (specpart !== null) {
            specpart = specpart[0];

            regtemp = specpart.substring(0, specpart.length).match(/[^0-9]/g);
            if (regtemp !== null) { hres_index = specpart.indexOf(regtemp[0]); }
            else { hres_index = specpart.length }
            
            hres = specpart.substring(0, hres_index);
            if (isNum(hres) == true) {
                $('#INPUT_HRES').val(hres);
            }
            specpart = specpart.substring(hres_index, specpart.length);

            regtemp = specpart.substring(1, specpart.length).match(/[^0-9]/g);
            if (regtemp !== null) { vres_index = specpart.indexOf(regtemp[0]); }
            else { vres_index = specpart.length }
            
            vres = specpart.substring(1, vres_index);
            if (isNum(vres) == true) {
                $('#INPUT_VRES').val(vres);
            }
        }

    }

    // Fills in matchmaker input fields
    if (match !== null) {
        match = match.replace('_', '.')

        // Finds strings of the form [num] x [num], or [num].[num] x [num], or [num] x [num].[num], or [num].[num] x [num].[num]
        matchpart = match.match(/^\d+\.\d+[x]\d+\.\d+|\d+[x]\d+\.\d+|\d+[x]\d+|\d+\.\d+[x]\d+/g);
        if (matchpart !== null) {
            matchpart = matchpart[0];
            var AR = matchpart.split('x');
            if (isNum(AR[0]) == true) {
                $('#INPUT_HRES2').val(AR[0]);
            }
            if (isNum(AR[1]) == true) {
                $('#INPUT_VRES2').val(AR[1]);
            }
        }
    }
}