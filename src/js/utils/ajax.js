/*************************************
 * Imports
 *************************************/

var $                       = require("jquery");

/*************************************
 * Classes
 *************************************/

var AjaxUtil = function() {
	return {
		ajax: function(options) {
			var emulatedinRipple = window.tinyHippos != undefined;
            if (emulatedinRipple) {
                if (options.type && options.type.toLowerCase() == "post") {
                	options.type = "GET";
                }
            }
            return $.ajax(options);
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

exports.Util = new AjaxUtil();