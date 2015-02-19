/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var StringUtil = function() {
    function camelizeString(string) {
        var a = string.split("_");
        s = [];
        for (var i = 0; i < a.length; i++) {
            s.push(a[i].charAt(0).toUpperCase()+a[i].substring(1));
        }
        s = s.join("");
        return s;
    };

    function replaceStringHooks(string, hooks, values) {
        if (string.length != 0) {
            for (var i = 0; i < hooks.length; i++) {
                if (values[i] != null) {
                    string = string.replace(hooks[i], values[i]);
                }
            }
        }
        return string;
    };

    function commaSeparateNumber(val){
        if(val != null) {
            val = val.toString().replace(/,/g, ''); //remove existing commas first
            var valSplit = val.split('.'); //then separate decimals
                
            while (/(\d+)(\d{3})/.test(valSplit[0].toString())){
                valSplit[0] = valSplit[0].toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
            }
            
            if(valSplit.length == 2){ //if there were decimals
                val = valSplit[0] + "." + valSplit[1]; //add decimals back
            }else{
                val = valSplit[0]; }
            
            return val;
        }
        
    };

    function sprintf() {
        if (typeof arguments == "undefined") {
            return null;
        }
        if (arguments.length < 1) {
            return null;
        }
        if (typeof arguments[0] != "string") {
            return null;
        }
        if (typeof RegExp == "undefined") {
            return null;
        }
        var string = arguments[0];
        var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
        var matches = new Array();
        var strings = new Array();
        var convCount = 0;
        var stringPosStart = 0;
        var stringPosEnd = 0;
        var matchPosEnd = 0;
        var newString = '';
        var match = null;
        var convert = function (matched, nosign) {
            if (nosign) {
                matched.sign = '';
            } else {
                matched.sign = matched.negative ? '-' : matched.sign;
            }
            var l = matched.min - matched.argument.length + 1 - matched.sign.length;
            var pad = new Array(l < 0 ? 0 : l).join(matched.pad);
            if (!matched.left) {
                if (matched.pad == "0" || nosign) {
                    return matched.sign + pad + matched.argument;
                } else {
                    return pad + matched.sign + matched.argument;
                }
            } else {
                if (matched.pad == "0" || nosign) {
                    return matched.sign + matched.argument + pad.replace(/0/g, ' ');
                } else {
                    return matched.sign + matched.argument + pad;
                }
            }
        };
        while (match = exp.exec(string))
        {
            if (match[9]) {
                convCount += 1;
            }
            stringPosStart = matchPosEnd;
            stringPosEnd = exp.lastIndex - match[0].length;
            strings[strings.length] = string.substring(stringPosStart, stringPosEnd);
            matchPosEnd = exp.lastIndex;
            matches[matches.length] = {
                match: match[0],
                left: match[3] ? true : false,
                sign: match[4] || '',
                pad: match[5] || ' ',
                min: match[6] || 0,
                precision: match[8],
                code: match[9] || '%',
                negative: parseInt(arguments[convCount]) < 0 ? true : false,
                argument: String(arguments[convCount])
            };
        }
        strings[strings.length] = string.substring(matchPosEnd);
        if (matches.length == 0) {
            return string;
        }
        if ((arguments.length - 1) < convCount) {
            return null;
        }
        var code = null;
        var match = null;
        var i = null;
        var substitution = '';
        for (i = 0; i < matches.length; i++) {
            if (matches[i].code == '%') {
                substitution = '%';
            } else if (matches[i].code == 'b') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                substitution = convert(matches[i], true);
            } else if (matches[i].code == 'c') {
                matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
                substitution = convert(matches[i], true);
            } else if (matches[i].code == 'd') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                substitution = convert(matches[i]);
            } else if (matches[i].code == 'f') {
                matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
                substitution = convert(matches[i]);
            } else if (matches[i].code == 'o') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                substitution = convert(matches[i]);
            } else if (matches[i].code == 's') {
                matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length);
                substitution = convert(matches[i], true);
            } else if (matches[i].code == 'x') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = convert(matches[i]);
            } else if (matches[i].code == 'X') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = convert(matches[i]).toUpperCase();
            } else {
                substitution = matches[i].match;
            }
            newString += strings[i];
            newString += substitution;
        }
        newString += strings[i];
        return newString;
    };

    String.prototype.replaceAll = function (strTarget, strSubString) {
        var strText = this;
        var intIndexOfMatch = strText.indexOf(strTarget);
        while (intIndexOfMatch != -1) {
            strText = strText.replace(strTarget, strSubString);
            intIndexOfMatch = strText.indexOf(strTarget);
        }
        return strText;
    };

    String.prototype.startsWith = function (value) {
        if (value.length > this.length) {
            return false;
        }
        return this.substr(0, value.length) == value;
    };

    String.prototype.endsWith = function (value) {
        if (value.length > this.length) {
            return false;
        }
        return this.substr(this.length - value.length, value.length) == value;
    };
    
    String.prototype.normaliseHostname = function () {
        var retval = this;
        if ($.inArray(retval, ':') < 0) {
            retval = retval + ":80";
        }
        return retval.toLowerCase();
    };

    String.prototype.getScheme = function () {
        var regex = new RegExp('^([^:]+):.*', 'im');
        var scheme = this.match(regex)[1].toString();
        return scheme;
    };

    String.prototype.getHostname = function (normalise) {
        var regex = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
        var hostname = this.match(regex)[1].toString();
        if (normalise) {
            hostname = hostname.normaliseHostname();
        }
        return hostname;
    };

    String.prototype.trimWithEllipsis = function (maxChars) {
        if (this === "") {
            return "";
        }
        if (this.length > maxChars) {
            var trimEnd = Math.min(this.length, maxChars - 3);
            return this.substring(0, trimEnd) + "...";
        } else {
            return this.substring(0, this.length);
        }
    };

    return {
        camelizeString: camelizeString,
        replaceStringHooks: replaceStringHooks,
        sprintf: sprintf,
        commaSeparateNumber: commaSeparateNumber
    };
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = new StringUtil();
