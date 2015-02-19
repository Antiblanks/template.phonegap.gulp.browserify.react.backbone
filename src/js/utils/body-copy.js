/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");

// Utils
var DebugUtil	               	= require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var BodyCopyUtil = function() {
	return {
		getBodyCopy: function(selector, replaceObject) {
			var bodyCopy = $("body .body-copy"+selector).text();
			for (var replaceHook in replaceObject) {
				DebugUtil.log("BodyCopyUtil", "getBodyCopy();", "#"+replaceHook.toUpperCase()+"#", replaceObject[replaceHook]);
				bodyCopy = bodyCopy.replace("#"+replaceHook.toUpperCase()+"#", replaceObject[replaceHook]);
			}
			return bodyCopy;
		}
	};
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = new BodyCopyUtil();
