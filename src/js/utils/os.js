/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var OsUtil = function() {
	return {
		is32BitWindowsOS: function() {
	        if (this.isMacOS())
	            return false;
	        var userAgentToUpper = navigator.userAgent.toUpperCase();
	        if (userAgentToUpper.indexOf("WOW64") !== -1 || 
	            userAgentToUpper.indexOf("WIN64") !== -1) {
	            return false;
	        }
	        return true;
	    },

		isMacOS: function() {
	        return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
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

exports.Util = new OsUtil();