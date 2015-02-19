/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var Html5Util = function() {
	return {
		isHtml5CanvasCompatible: function() {
		  	return !!document.createElement('canvas').getContext;
		},

		isHtml5Compatible: function() {
			return this.isHtml5CanvasCompatible();
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

exports.Util = new Html5Util();