/*************************************
 * Imports
 *************************************/

// Library
var jQuery 					= require("jquery");
//var JQueryEasing            = require("jquery-easing");

/*************************************
 * Classes
 *************************************/

var EasingUtil = function() {
	return {
		getEasing: function(easingType) {
			if (jQuery && jQuery.easing && typeof jQuery.easing[easingType] == "function") {
				return jQuery.easing[easingType];
			}
			return "linear";
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

exports.Util = new EasingUtil();