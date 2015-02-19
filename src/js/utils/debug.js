/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var DebugUtil = function() {
	return {
		log: function() {
			if (window.debugLevel != 0 && console && typeof console.log == "function") {
				console.log.apply(console, arguments);
			}
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

exports.Util = new DebugUtil();